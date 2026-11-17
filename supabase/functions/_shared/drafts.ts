import { db } from "./db.ts";

export type Draft = {
  id: string;
  tool: string;
  answers: Record<string, unknown>;
  source: Record<string, unknown>;
  used_by_lead: string | null;
};

// Returns the draft if it exists, hasn't expired, and hasn't been claimed by
// a different lead. Invalid IDs simply return null (the form still works).
export async function loadDraft(draftId: unknown, leadId: string | null): Promise<Draft | null> {
  if (typeof draftId !== "string" || !/^d_[A-Za-z0-9_-]{16,40}$/.test(draftId)) return null;
  const { data, error } = await db
    .from("lead_drafts")
    .select("id, tool, answers, source, used_by_lead, expires_at")
    .eq("id", draftId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) return null;
  if (data.used_by_lead && data.used_by_lead !== leadId) return null;
  return data as Draft;
}
