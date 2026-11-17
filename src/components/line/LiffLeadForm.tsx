'use client'

// The form students see inside LINE (LIFF). Opened from a website tool with
// ?d=<draftId>, or with no draft from any plain LINE link to the LIFF URL.
// Flow: LINE login -> liff-session (verifies the ID token, returns draft + prefill)
// -> student confirms -> submit-lead (saves, sends LINE messages).
// All Thai copy here is pending editor review: docs/qa/thai-review-line-leads.md

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import Image from "next/image";
import { CheckCircle2, Loader2, MessageCircle, TriangleAlert } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { LIFF_ID, functionsUrl } from "@/lib/leadDraft";
import { LINE_URL } from "@/components/shared/BSCConsultationCTA";
import { buildIntakes, isValidEmail, isValidPhone, LEVEL_OPTIONS, PROGRAM_OPTIONS, withValue } from "@/lib/liffForm";

/* Minimal typing for the LIFF SDK loaded from LINE's CDN. */
interface Liff {
  init(config: { liffId: string }): Promise<void>;
  isLoggedIn(): boolean;
  login(opts?: { redirectUri?: string }): void;
  logout(): void;
  getIDToken(): string | null;
  isInClient(): boolean;
  closeWindow(): void;
}
declare global {
  interface Window { liff?: Liff }
}

const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_URL ?? "";
const DRAFT_KEY = "ba.liffDraft";
const RELOGIN_KEY = "ba.liffRelogin";

type Session = {
  profile: { name: string | null; picture: string | null };
  isFriend: boolean;
  returning: boolean;
  draft: { tool: string; summary: string | null } | null;
  prefill: Record<"full_name" | "nickname" | "phone" | "email" | "current_level" | "program_interest" | "intake", string | null>;
};

type FieldKey = "full_name" | "phone" | "email" | "consent";
type View = "loading" | "error" | "form" | "done";

const T = {
  th: {
    loading: "กำลังเปิดแบบฟอร์ม…",
    errorTitle: "เปิดแบบฟอร์มไม่สำเร็จ",
    errorBody: "กรุณาลองใหม่อีกครั้ง หรือทักแชท LINE ของเราได้เลย",
    retry: "ลองใหม่",
    hello: (n: string | null) => (n ? `สวัสดีค่ะ คุณ${n}` : "สวัสดีค่ะ"),
    intro: "กรอกข้อมูลสั้น ๆ ทีมที่ปรึกษาจะติดต่อกลับเพื่อแนะนำแผนที่เหมาะกับคุณ",
    yourAnswers: "คำตอบของคุณจากเว็บไซต์",
    notFriend: "เพิ่ม Beyond Study Center เป็นเพื่อนใน LINE เพื่อรับสรุปคำตอบและให้ทีมงานทักกลับทางแชทได้",
    addFriend: "เพิ่มเพื่อนใน LINE",
    fullName: "ชื่อ-นามสกุล",
    nickname: "ชื่อเล่น",
    phone: "เบอร์โทรศัพท์",
    email: "อีเมล (ไม่บังคับ)",
    level: "ระดับการศึกษาปัจจุบัน",
    program: "หลักสูตรที่สนใจ",
    intake: "อยากเริ่มเรียนช่วงไหน",
    message: "คำถามเพิ่มเติม (ไม่บังคับ)",
    select: "เลือก",
    consent: "ยินยอมให้ Beyond Study Center เก็บและใช้ข้อมูลนี้เพื่อติดต่อให้คำปรึกษาเรื่องเรียนต่อ",
    privacy: "อ่านนโยบายความเป็นส่วนตัว",
    marketing: "รับข่าวสารและทุนการศึกษาทาง LINE (ไม่บังคับ)",
    submit: "ส่งข้อมูลให้ทีมที่ปรึกษา",
    sending: "กำลังส่ง…",
    errors: {
      full_name: "กรุณากรอกชื่อ",
      phone: "กรุณากรอกเบอร์โทรให้ถูกต้อง",
      email: "รูปแบบอีเมลไม่ถูกต้อง",
      consent: "กรุณาติ๊กยินยอมก่อนส่งข้อมูล",
    },
    sendFailed: "ส่งไม่สำเร็จ กรุณาลองใหม่",
    expired: "หมดเวลาเข้าสู่ระบบ กรุณาเปิดลิงก์ใหม่อีกครั้ง",
    doneTitle: "ได้รับข้อมูลแล้วค่ะ",
    doneFriend: "เราส่งสรุปไปที่แชท LINE แล้ว ทีมที่ปรึกษาจะติดต่อกลับโดยเร็ว",
    doneNotFriend: "ทีมที่ปรึกษาจะติดต่อกลับโดยเร็ว เพิ่มเพื่อนใน LINE เพื่อรับสรุปทางแชท",
    close: "ปิดหน้านี้",
  },
  en: {
    loading: "Opening the form…",
    errorTitle: "Couldn't open the form",
    errorBody: "Please try again, or message us on LINE.",
    retry: "Try again",
    hello: (n: string | null) => (n ? `Hi ${n}` : "Hi there"),
    intro: "Share a few details and a counsellor will get back to you with a plan that fits.",
    yourAnswers: "Your answers from the website",
    notFriend: "Add Beyond Study Center on LINE to get a summary and let our team reply in chat.",
    addFriend: "Add us on LINE",
    fullName: "Full name",
    nickname: "Nickname",
    phone: "Phone number",
    email: "Email (optional)",
    level: "Current education",
    program: "Interested in",
    intake: "Preferred start",
    message: "Anything else? (optional)",
    select: "Select",
    consent: "I agree that Beyond Study Center may keep and use this information to contact me about studying in Australia.",
    privacy: "Read the privacy policy",
    marketing: "Send me news and scholarships on LINE (optional)",
    submit: "Send to a counsellor",
    sending: "Sending…",
    errors: {
      full_name: "Please enter your name",
      phone: "Please enter a valid phone number",
      email: "Please check your email",
      consent: "Please tick to agree before sending",
    },
    sendFailed: "Couldn't send. Please try again.",
    expired: "Your LINE login expired. Please reopen the link.",
    doneTitle: "Thanks, we've got it",
    doneFriend: "We've sent a summary to your LINE chat. A counsellor will be in touch soon.",
    doneNotFriend: "A counsellor will be in touch soon. Add us on LINE to get a summary in chat.",
    close: "Close",
  },
} as const;

class ApiError extends Error {
  constructor(public status: number, public data: Record<string, unknown>) {
    super(String(data.error ?? status));
  }
}

async function api<R>(path: string, body: unknown): Promise<R> {
  const res = await fetch(`${functionsUrl()}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data);
  return data as R;
}

const store = {
  get: (k: string) => { try { return window.sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { window.sessionStorage.setItem(k, v); } catch { /* optional */ } },
  del: (k: string) => { try { window.sessionStorage.removeItem(k); } catch { /* optional */ } },
};

const fieldClass =
  "w-full min-h-11 rounded-xl border border-input bg-background px-3 py-2.5 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

export default function LiffLeadForm() {
  const { language, setLanguage } = useLanguage();
  const t = T[language];

  const [view, setView] = useState<View>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [friendAtDone, setFriendAtDone] = useState(false);
  const draftId = useRef<string | null>(null);
  const started = useRef(false);

  const intakes = useMemo(() => buildIntakes(new Date()), []);

  const start = useCallback(async () => {
    const liff = window.liff;
    if (!liff || !LIFF_ID) { setView("error"); return; }
    setView("loading");
    try {
      await liff.init({ liffId: LIFF_ID });
    } catch (e) {
      console.error(e);
      setView("error");
      return;
    }

    // Read after init: LIFF restores the original ?d= query here. Kept in the
    // tab so it survives the LINE login redirect in an external browser.
    const fromUrl = new URLSearchParams(window.location.search).get("d");
    if (fromUrl) store.set(DRAFT_KEY, fromUrl);
    draftId.current = fromUrl ?? store.get(DRAFT_KEY);

    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href });
      return;
    }

    const relogin = () => {
      if (store.get(RELOGIN_KEY)) return false; // once only: no redirect loops
      store.set(RELOGIN_KEY, "1");
      liff.logout();
      liff.login({ redirectUri: window.location.href });
      return true;
    };

    const idToken = liff.getIDToken();
    if (!idToken) { if (!relogin()) setView("error"); return; }

    try {
      const s = await api<Session>("liff-session", { idToken, draftId: draftId.current });
      store.del(RELOGIN_KEY);
      setSession(s);
      setView("form");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401 && relogin()) return;
      console.error(e);
      setView("error");
    }
  }, []);

  // The SDK may already be cached from an earlier visit.
  useEffect(() => {
    if (window.liff && !started.current) { started.current = true; void start(); }
  }, [start]);
  const onSdkLoad = () => {
    if (!started.current) { started.current = true; void start(); }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const fd = new FormData(e.currentTarget);
    const form = Object.fromEntries(
      ["full_name", "nickname", "phone", "email", "current_level", "program_interest", "intake", "message"]
        .map((k) => [k, String(fd.get(k) ?? "")]),
    );
    const consent = { privacy: fd.get("consent_privacy") === "on", marketing: fd.get("consent_marketing") === "on" };

    const errs: Partial<Record<FieldKey, boolean>> = {};
    if (!form.full_name.trim()) errs.full_name = true;
    if (!isValidPhone(form.phone)) errs.phone = true;
    if (form.email.trim() && !isValidEmail(form.email)) errs.email = true;
    if (!consent.privacy) errs.consent = true;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(first === "consent" ? "consent_privacy" : first)?.focus();
      return;
    }

    setSending(true);
    try {
      const res = await api<{ isFriend: boolean }>("submit-lead", {
        idToken: window.liff?.getIDToken(),
        draftId: draftId.current,
        form,
        consent,
      });
      store.del(DRAFT_KEY);
      setFriendAtDone(res.isFriend);
      setView("done");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError && err.status === 422 && err.data.fields) {
        const f = err.data.fields as Record<string, string>;
        setErrors(Object.fromEntries(Object.keys(f).map((k) => [k, true])));
      } else if (err instanceof ApiError && err.status === 401) setFormError(t.expired);
      else setFormError(t.sendFailed);
    } finally {
      setSending(false);
    }
  };

  const clearError = (k: FieldKey) => errors[k] && setErrors((p) => ({ ...p, [k]: false }));

  return (
    <main className="min-h-screen bg-muted/40 px-4 pb-10 pt-5">
      <Script src="https://static.line-scdn.net/liff/edge/2/sdk.js" strategy="afterInteractive" onLoad={onSdkLoad} onError={() => setView("error")} />
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Image src="/beyond-study-logo.png" alt="Beyond Study Center" width={120} height={40} className="h-9 w-auto" priority />
          <div className="flex rounded-full border border-border bg-background p-0.5 text-xs font-semibold" role="group" aria-label="Language">
            {(["th", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                aria-pressed={language === l}
                className={`min-h-8 rounded-full px-3 ${language === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {view === "loading" && (
          <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground" role="status">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
            <p>{t.loading}</p>
          </div>
        )}

        {view === "error" && (
          <div className="rounded-2xl border border-border bg-background p-6 text-center" role="alert">
            <TriangleAlert className="mx-auto h-10 w-10 text-amber-500" aria-hidden />
            <h1 className="mt-3 text-lg font-bold">{t.errorTitle}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.errorBody}</p>
            <button type="button" onClick={() => void start()} className="mt-5 min-h-11 w-full rounded-xl border-2 border-primary font-semibold text-primary">
              {t.retry}
            </button>
            <a href={LINE_URL} className="mt-2.5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white" style={{ backgroundColor: "#00B900" }}>
              <MessageCircle className="h-4 w-4" aria-hidden /> LINE: @beyondstudy
            </a>
          </div>
        )}

        {view === "form" && session && (
          <>
            <header className="mb-4 flex items-center gap-3">
              {session.profile.picture && (
                // LINE profile images come from LINE's CDN; plain img avoids adding a remote pattern.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.profile.picture} alt="" className="h-12 w-12 rounded-full object-cover" />
              )}
              <div>
                <h1 className="text-xl font-bold leading-tight">{t.hello(session.profile.name)}</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">{t.intro}</p>
              </div>
            </header>

            {session.draft?.summary && (
              <section className="mb-3 rounded-2xl bg-primary p-4 text-primary-foreground">
                <h2 className="text-xs font-semibold uppercase tracking-wide opacity-80">{t.yourAnswers}</h2>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">{session.draft.summary}</p>
              </section>
            )}

            {!session.isFriend && (
              <section className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
                <p>{t.notFriend}</p>
                <a href={LINE_URL} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white" style={{ backgroundColor: "#00B900" }}>
                  <MessageCircle className="h-4 w-4" aria-hidden /> {t.addFriend}
                </a>
              </section>
            )}

            <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-border bg-background p-5">
              <Field id="full_name" label={`${t.fullName} *`} error={errors.full_name ? t.errors.full_name : ""}>
                <input id="full_name" name="full_name" autoComplete="name" maxLength={120} required
                  defaultValue={session.prefill.full_name ?? ""} className={fieldClass}
                  aria-invalid={errors.full_name || undefined} aria-describedby={errors.full_name ? "full_name-error" : undefined}
                  onInput={() => clearError("full_name")} />
              </Field>
              <Field id="nickname" label={t.nickname}>
                <input id="nickname" name="nickname" autoComplete="nickname" maxLength={60}
                  defaultValue={session.prefill.nickname ?? ""} className={fieldClass} />
              </Field>
              <Field id="phone" label={`${t.phone} *`} error={errors.phone ? t.errors.phone : ""}>
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} required
                  placeholder="08x xxx xxxx / +61 4xx xxx xxx"
                  defaultValue={session.prefill.phone ?? ""} className={fieldClass}
                  aria-invalid={errors.phone || undefined} aria-describedby={errors.phone ? "phone-error" : undefined}
                  onInput={() => clearError("phone")} />
              </Field>
              <Field id="email" label={t.email} error={errors.email ? t.errors.email : ""}>
                <input id="email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={120}
                  defaultValue={session.prefill.email ?? ""} className={fieldClass}
                  aria-invalid={errors.email || undefined} aria-describedby={errors.email ? "email-error" : undefined}
                  onInput={() => clearError("email")} />
              </Field>
              <Field id="current_level" label={t.level}>
                <Select id="current_level" placeholder={t.select} lang={language}
                  options={withValue(LEVEL_OPTIONS, session.prefill.current_level)} value={session.prefill.current_level} />
              </Field>
              <Field id="program_interest" label={t.program}>
                <Select id="program_interest" placeholder={t.select} lang={language}
                  options={withValue(PROGRAM_OPTIONS, session.prefill.program_interest)} value={session.prefill.program_interest} />
              </Field>
              <Field id="intake" label={t.intake}>
                <Select id="intake" placeholder={t.select} lang={language}
                  options={withValue(intakes, session.prefill.intake)} value={session.prefill.intake} />
              </Field>
              <Field id="message" label={t.message}>
                <textarea id="message" name="message" maxLength={1000} rows={3} className={`${fieldClass} min-h-20`} />
              </Field>

              <div>
                <label className="flex items-start gap-3 text-sm">
                  <input id="consent_privacy" name="consent_privacy" type="checkbox" required
                    className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
                    aria-invalid={errors.consent || undefined} aria-describedby={errors.consent ? "consent-error" : undefined}
                    onChange={() => clearError("consent")} />
                  <span>
                    {t.consent} *
                    {PRIVACY_URL && (
                      <> <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline">{t.privacy}</a></>
                    )}
                  </span>
                </label>
                {errors.consent && <p id="consent-error" className="mt-1 text-sm text-destructive">{t.errors.consent}</p>}
              </div>
              <label className="flex items-start gap-3 text-sm">
                <input name="consent_marketing" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-primary" />
                <span>{t.marketing}</span>
              </label>

              {formError && <p className="text-sm text-destructive" role="alert">{formError}</p>}
              <button type="submit" disabled={sending}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60">
                {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {sending ? t.sending : t.submit}
              </button>
            </form>
          </>
        )}

        {view === "done" && (
          <div className="rounded-2xl border border-border bg-background p-6 text-center" role="status">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" aria-hidden />
            <h1 className="mt-3 text-xl font-bold">{t.doneTitle}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{friendAtDone ? t.doneFriend : t.doneNotFriend}</p>
            {!friendAtDone && (
              <a href={LINE_URL} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white" style={{ backgroundColor: "#00B900" }}>
                <MessageCircle className="h-4 w-4" aria-hidden /> {t.addFriend}
              </a>
            )}
            {typeof window !== "undefined" && window.liff?.isInClient() && (
              <button type="button" onClick={() => window.liff?.closeWindow()} className="mt-2.5 min-h-11 w-full rounded-xl border border-border font-semibold">
                {t.close}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function Select({ id, options, value, placeholder, lang }: {
  id: string;
  options: { value: string; th: string; en: string }[];
  value: string | null;
  placeholder: string;
  lang: "th" | "en";
}) {
  return (
    <select id={id} name={id} defaultValue={value ?? ""} className={fieldClass}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o[lang]}</option>)}
    </select>
  );
}
