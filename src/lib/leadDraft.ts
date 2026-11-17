// LINE (LIFF) lead capture: website side.
//
// A tool saves the visitor's answers as a short-lived draft, then opens the LIFF
// form inside LINE with only the draft ID in the URL. The LIFF page reads the
// draft back through an Edge Function after LINE login. See docs/line-leads-setup.md.
//
// The feature switches on only when NEXT_PUBLIC_LIFF_ID is set. Without it, every
// LINE button keeps its existing behaviour.

export const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const liffEnabled = () => Boolean(LIFF_ID && SUPABASE_URL);

export const functionsUrl = (supabaseUrl: string = SUPABASE_URL) =>
  `${supabaseUrl.replace(/\/+$/, "")}/functions/v1`;

export const liffUrl = (draftId?: string | null, liffId: string = LIFF_ID) =>
  `https://liff.line.me/${encodeURIComponent(liffId)}${draftId ? `?d=${encodeURIComponent(draftId)}` : ""}`;

/** Answers a tool hands over. `summary` is shown to the student and staff as-is. */
export interface LeadDraft {
  tool: string;
  answers: {
    summary?: string;
    program_interest?: string;
    intake?: string;
    current_level?: string;
    [key: string]: unknown;
  };
}

const SOURCE_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;
const SOURCE_STORAGE = "ba.leadSource";

export type LeadSource = Partial<Record<(typeof SOURCE_KEYS)[number] | "referrer" | "landing_page", string>>;

/** Marketing parameters and referrer from a landing URL. Pure, for testing. */
export function sourceFromLanding(href: string, referrer: string): LeadSource {
  const url = new URL(href);
  const out: LeadSource = { landing_page: url.pathname };
  for (const k of SOURCE_KEYS) {
    const v = url.searchParams.get(k);
    if (v) out[k] = v.slice(0, 200);
  }
  if (referrer) {
    try {
      const r = new URL(referrer);
      if (r.host !== url.host) out.referrer = r.host;
    } catch {
      /* ignore malformed referrer */
    }
  }
  return out;
}

/** First page of the visit wins, so the ad that brought them is kept. */
export function rememberLeadSource(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(SOURCE_STORAGE)) return;
    window.sessionStorage.setItem(
      SOURCE_STORAGE,
      JSON.stringify(sourceFromLanding(window.location.href, document.referrer)),
    );
  } catch {
    /* storage blocked: attribution is optional */
  }
}

function readLeadSource(): LeadSource {
  try {
    const raw = window.sessionStorage.getItem(SOURCE_STORAGE);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through */
  }
  return sourceFromLanding(window.location.href, document.referrer);
}

export async function saveLeadDraft(draft: LeadDraft, fetchImpl: typeof fetch = fetch): Promise<string> {
  const res = await fetchImpl(`${functionsUrl()}/save-draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...draft, source: readLeadSource() }),
  });
  if (!res.ok) throw new Error(`save-draft ${res.status}`);
  const { draftId } = (await res.json()) as { draftId?: string };
  if (!draftId) throw new Error("save-draft: no id");
  return draftId;
}

/**
 * Click handler body for a LINE button: opens a tab right away (so popup
 * blockers allow it), saves the draft, then points the tab at the LIFF form.
 * If saving fails, the tab goes to `fallbackHref` (the existing LINE link).
 */
export async function openLiffWithDraft(draft: LeadDraft, fallbackHref: string): Promise<void> {
  const tab = window.open("about:blank", "_blank");
  if (tab) tab.opener = null;
  const go = (href: string) => {
    if (tab && !tab.closed) tab.location.href = href;
    else window.location.href = href;
  };
  try {
    go(liffUrl(await saveLeadDraft(draft)));
  } catch (e) {
    console.error(e);
    go(fallbackHref);
  }
}
