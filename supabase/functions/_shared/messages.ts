// Message templates. Edit wording here; nothing else needs to change.
import type { LineMessage } from "./line.ts";

// Friendly names for each website tool (the `tool` value sent by the website).
export const TOOL_LABELS: Record<string, { th: string; en: string }> = {
  // Thai labels pending editor review: docs/qa/thai-review-line-leads.md
  "budget-planner": { th: "แผนงบเรียนต่อ", en: "Budget study planner" },
  "contact": { th: "เว็บไซต์", en: "Website" },
};

export function toolLabel(tool: string | null) {
  return (tool && TOOL_LABELS[tool]) || { th: "เว็บไซต์", en: "Website" };
}

type StudentMsgInput = {
  name: string;
  tool: string | null;
  summary: string | null; // human-readable result line, provided by the website tool
};

export function studentMessage({ name, tool, summary }: StudentMsgInput): LineMessage[] {
  const label = toolLabel(tool);
  const th = [
    `สวัสดีค่ะ คุณ${name} 👋`,
    `ขอบคุณที่สนใจเรียนต่อออสเตรเลียกับ Beyond Study Center ค่ะ`,
    summary ? `\nคำตอบจาก${label.th}:\n${summary}` : "",
    `\nทีมที่ปรึกษาจะติดต่อกลับโดยเร็ว หากมีคำถามเพิ่มเติม พิมพ์ถามในแชทนี้ได้เลย`,
  ].filter(Boolean).join("\n");

  const en = [
    `Hi ${name}, thanks for your interest in studying in Australia with Beyond Study Center!`,
    summary ? `Your ${label.en.toLowerCase()} answers are above.` : "",
    `A counsellor will be in touch soon. Feel free to ask anything here.`,
  ].filter(Boolean).join("\n");

  return [{ type: "text", text: `${th}\n\n—\n${en}`.slice(0, 5000) }];
}

type StaffMsgInput = {
  isNew: boolean;
  fullName: string | null;
  nickname: string | null;
  lineName: string | null;
  phone: string | null;
  email: string | null;
  programInterest: string | null;
  intake: string | null;
  currentLevel: string | null;
  tool: string | null;
  summary: string | null;
  message: string | null;
  source: Record<string, unknown>;
  isFriend: boolean;
  marketingConsent: boolean;
};

export function staffMessage(i: StaffMsgInput): LineMessage[] {
  const src = [i.source.utm_source, i.source.utm_medium, i.source.utm_campaign]
    .filter((v) => typeof v === "string" && v).join(" / ") ||
    (typeof i.source.referrer === "string" && i.source.referrer) || "direct";

  const lines = [
    i.isNew ? "🔔 New lead" : "🔁 Returning lead (submitted again)",
    `Name: ${i.fullName ?? "-"}${i.nickname ? ` (${i.nickname})` : ""}`,
    `LINE: ${i.lineName ?? "-"}${i.isFriend ? "" : "  ⚠️ not a friend, can't message on LINE"}`,
    `Phone: ${i.phone ?? "-"}`,
    i.email ? `Email: ${i.email}` : "",
    `Interested in: ${i.programInterest ?? "-"}`,
    `Intake: ${i.intake ?? "-"}`,
    i.currentLevel ? `Current level: ${i.currentLevel}` : "",
    `From: ${toolLabel(i.tool).en}${i.summary ? `: ${i.summary}` : ""}`,
    `Source: ${src}`,
    `Marketing consent: ${i.marketingConsent ? "yes" : "no"}`,
    i.message ? `\nMessage: ${i.message}` : "",
  ].filter(Boolean);

  return [{ type: "text", text: lines.join("\n").slice(0, 5000) }];
}
