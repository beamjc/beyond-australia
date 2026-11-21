// deno test supabase/functions/_shared
import { assertEquals } from "jsr:@std/assert@1";
import { buildPrefill } from "./prefill.ts";

const me = { name: "Nong LINE", email: "line@example.com" };
const lead = { full_name: "Nong Test", nickname: "Nong", age: 26, phone: "0812345678", email: "old@example.com" };

Deno.test("returning lead, no website answers this visit: personal details kept, plan details blank", () => {
  assertEquals(buildPrefill(lead, null, me), {
    full_name: "Nong Test", nickname: "Nong", age: 26, phone: "0812345678", email: "old@example.com",
    visa_interest: null, current_level: null, program_interest: null, intake: null,
  });
});

Deno.test("plan details come from this visit's answers; age from answers wins", () => {
  const p = buildPrefill(lead, { visa_interest: "student", program_interest: "Master", intake: "Jan–Mar 2027", current_level: "", age: 27 }, me);
  assertEquals([p.visa_interest, p.program_interest, p.intake, p.current_level, p.age], ["student", "Master", "Jan–Mar 2027", null, 27]);
  assertEquals([p.full_name, p.phone], ["Nong Test", "0812345678"]);
});

Deno.test("new visitor: LINE name and email as starting points", () => {
  const p = buildPrefill(null, {}, me);
  assertEquals([p.full_name, p.nickname, p.email, p.age, p.visa_interest], [null, "Nong LINE", "line@example.com", null, null]);
});
