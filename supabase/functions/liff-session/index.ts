// POST { idToken, draftId? } -> { profile, isFriend, draft, prefill }
// Called by the LIFF page on load to pre-fill the form.
import { db } from "../_shared/db.ts";
import { loadDraft } from "../_shared/drafts.ts";
import { handler, json, readJson } from "../_shared/http.ts";
import { isFriend, verifyIdToken } from "../_shared/line.ts";

Deno.serve(handler(async (req) => {
  const body = await readJson(req, 8_000);
  const me = await verifyIdToken(body.idToken);

  const { data: lead, error } = await db
    .from("leads")
    .select("id, full_name, nickname, phone, email, current_level, program_interest, intake")
    .eq("line_user_id", me.userId)
    .maybeSingle();
  if (error) throw error;

  const [draft, friend] = await Promise.all([
    loadDraft(body.draftId, lead?.id ?? null),
    isFriend(me.userId),
  ]);

  // Pre-fill: answers from the website tool win over older saved details,
  // so a returning student sees what they just chose.
  const a = (draft?.answers ?? {}) as Record<string, unknown>;
  const pick = (k: string) => (typeof a[k] === "string" ? a[k] : null);

  return json(req, {
    profile: { name: me.name, picture: me.picture },
    isFriend: friend,
    returning: Boolean(lead),
    draft: draft ? { tool: draft.tool, summary: pick("summary") } : null,
    prefill: {
      full_name: lead?.full_name ?? null,
      nickname: lead?.nickname ?? me.name,
      phone: lead?.phone ?? null,
      email: lead?.email ?? me.email,
      current_level: pick("current_level") ?? lead?.current_level ?? null,
      program_interest: pick("program_interest") ?? lead?.program_interest ?? null,
      intake: pick("intake") ?? lead?.intake ?? null,
    },
  });
}));
