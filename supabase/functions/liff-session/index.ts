// POST { idToken, draftId? } -> { profile, isFriend, draft, prefill }
// Called by the LIFF page on load to pre-fill the form.
import { db } from "../_shared/db.ts";
import { loadDraft } from "../_shared/drafts.ts";
import { handler, json, readJson } from "../_shared/http.ts";
import { isFriend, verifyIdToken } from "../_shared/line.ts";
import { buildPrefill } from "../_shared/prefill.ts";

Deno.serve(handler(async (req) => {
  const body = await readJson(req, 8_000);
  const me = await verifyIdToken(body.idToken);

  const { data: lead, error } = await db
    .from("leads")
    .select("id, full_name, nickname, age, phone, email")
    .eq("line_user_id", me.userId)
    .maybeSingle();
  if (error) throw error;

  const [draft, friend] = await Promise.all([
    loadDraft(body.draftId, lead?.id ?? null),
    isFriend(me.userId),
  ]);

  // Personal details from last time; plan details only from this visit (see _shared/prefill.ts).
  const answers = (draft?.answers ?? {}) as Record<string, unknown>;
  const summary = typeof answers.summary === "string" ? answers.summary : null;

  return json(req, {
    profile: { name: me.name, picture: me.picture },
    isFriend: friend,
    returning: Boolean(lead),
    draft: draft ? { tool: draft.tool, summary } : null,
    prefill: buildPrefill(lead, answers, me),
  });
}));
