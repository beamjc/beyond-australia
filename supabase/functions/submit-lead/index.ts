// POST { idToken, draftId?, form, consent } -> { ok, leadId, isFriend }
// Saves the lead, links the website draft, and sends LINE messages.
import { db } from "../_shared/db.ts";
import { loadDraft } from "../_shared/drafts.ts";
import { handler, HttpError, json, plainObject, readJson, str } from "../_shared/http.ts";
import { isFriend, push, verifyIdToken } from "../_shared/line.ts";
import { staffMessage, studentMessage } from "../_shared/messages.ts";

const CONSENT_VERSION = Deno.env.get("CONSENT_VERSION") ?? "2026-11";

function normalisePhone(v: unknown): string | null {
  const s = str(v, 30);
  if (!s) return null;
  const cleaned = s.replace(/[\s().-]/g, "");
  return /^\+?\d{8,15}$/.test(cleaned) ? cleaned : null;
}

function normaliseEmail(v: unknown): string | null {
  const s = str(v, 120);
  if (!s) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s.toLowerCase() : null;
}

Deno.serve(handler(async (req) => {
  const body = await readJson(req);
  const me = await verifyIdToken(body.idToken);

  const form = plainObject(body.form, 4_000);
  const consent = plainObject(body.consent, 500);

  // Validate
  const full_name = str(form.full_name, 120);
  const phone = normalisePhone(form.phone);
  const emailRaw = str(form.email, 120);
  const email = normaliseEmail(form.email);
  const errors: Record<string, string> = {};
  if (!full_name) errors.full_name = "required";
  if (!phone) errors.phone = "invalid";
  if (emailRaw && !email) errors.email = "invalid";
  if (consent.privacy !== true) errors.consent = "required";
  if (Object.keys(errors).length) return json(req, { error: "Please check the form", fields: errors }, 422);

  const fields = {
    full_name,
    nickname: str(form.nickname, 60),
    phone,
    email,
    current_level: str(form.current_level, 80),
    program_interest: str(form.program_interest, 120),
    intake: str(form.intake, 40),
    message: str(form.message, 1000),
  };

  const now = new Date().toISOString();
  const marketing = consent.marketing === true;

  // Existing lead?
  const { data: existing, error: selErr } = await db
    .from("leads")
    .select("id, consent_marketing_at, first_source")
    .eq("line_user_id", me.userId)
    .maybeSingle();
  if (selErr) throw selErr;

  const draft = await loadDraft(body.draftId, existing?.id ?? null);
  const source = draft?.source ?? {};
  const answers = draft?.answers ?? {};
  const friend = await isFriend(me.userId);

  const leadRow = {
    ...fields,
    line_user_id: me.userId,
    line_display_name: me.name,
    line_picture_url: me.picture,
    line_email: me.email,
    is_friend: friend,
    latest_answers: answers,
    latest_source: source,
    consent_privacy_at: now,
    consent_marketing_at: marketing ? (existing?.consent_marketing_at ?? now) : null,
    consent_version: CONSENT_VERSION,
  };

  let leadId: string;
  let isNew = false;
  if (existing) {
    const { error } = await db.from("leads").update(leadRow).eq("id", existing.id);
    if (error) throw error;
    leadId = existing.id;
  } else {
    const { data, error } = await db
      .from("leads")
      .insert({ ...leadRow, first_source: source })
      .select("id")
      .single();
    if (error?.code === "23505") {
      // Double submit raced us: fall back to update.
      const { data: again, error: e2 } = await db
        .from("leads").update(leadRow).eq("line_user_id", me.userId).select("id").single();
      if (e2) throw e2;
      leadId = again.id;
    } else {
      if (error) throw error;
      leadId = data.id;
      isNew = true;
    }
  }

  const { error: subErr } = await db.from("lead_submissions").insert({
    lead_id: leadId,
    draft_id: draft?.id ?? null,
    tool: draft?.tool ?? null,
    answers,
    form: fields,
    source,
  });
  if (subErr) throw subErr;

  if (draft && !draft.used_by_lead) {
    await db.from("lead_drafts").update({ used_at: now, used_by_lead: leadId }).eq("id", draft.id);
  }

  // Messages: failures are logged but never block the student's submit.
  const summary = typeof answers.summary === "string" ? answers.summary.slice(0, 300) : null;
  const tool = draft?.tool ?? null;
  const tasks: Promise<unknown>[] = [];
  if (friend) {
    tasks.push(push(me.userId, studentMessage({ name: fields.nickname ?? full_name!, tool, summary })));
  }
  const staffGroup = Deno.env.get("STAFF_GROUP_ID");
  if (staffGroup) {
    tasks.push(push(staffGroup, staffMessage({
      isNew,
      fullName: fields.full_name,
      nickname: fields.nickname,
      lineName: me.name,
      phone: fields.phone,
      email: fields.email,
      programInterest: fields.program_interest,
      intake: fields.intake,
      currentLevel: fields.current_level,
      tool,
      summary,
      message: fields.message,
      source,
      isFriend: friend,
      marketingConsent: marketing,
    })));
  }
  await Promise.allSettled(tasks);

  return json(req, { ok: true, leadId, isFriend: friend });
}));
