// What the LIFF form is pre-filled with (owner decision 2026-11-21):
// - Personal details (name, nickname, age, phone, email) carry over from the
//   lead's last submission, so a returning student doesn't retype them.
// - Plan details (visa interest, current level, course, intake) come ONLY from
//   this visit's website-tool answers (the draft). Old plan answers are not
//   reused, so a returning student never sees a stale visa or a past intake.

export interface PrefillLead {
  full_name: string | null;
  nickname: string | null;
  age: number | null;
  phone: string | null;
  email: string | null;
}

export interface Prefill {
  full_name: string | null;
  nickname: string | null;
  age: number | null;
  visa_interest: string | null;
  phone: string | null;
  email: string | null;
  current_level: string | null;
  program_interest: string | null;
  intake: string | null;
}

export function buildPrefill(
  lead: PrefillLead | null,
  draftAnswers: Record<string, unknown> | null | undefined,
  me: { name: string | null; email: string | null },
): Prefill {
  const a = draftAnswers ?? {};
  const pick = (k: string) => (typeof a[k] === "string" && (a[k] as string).trim() ? (a[k] as string) : null);
  const draftAge = typeof a.age === "number" && a.age >= 15 && a.age <= 70 ? Math.round(a.age) : null;
  return {
    full_name: lead?.full_name ?? null,
    nickname: lead?.nickname ?? me.name,
    age: draftAge ?? lead?.age ?? null,
    phone: lead?.phone ?? null,
    email: lead?.email ?? me.email,
    visa_interest: pick("visa_interest"),
    current_level: pick("current_level"),
    program_interest: pick("program_interest"),
    intake: pick("intake"),
  };
}
