// deno test supabase/functions/_shared --allow-env
import { assert, assertEquals, assertRejects } from "jsr:@std/assert@1";
import { isFriend, verifyIdToken, verifySignature } from "./line.ts";
import { HttpError, plainObject, str } from "./http.ts";

Deno.env.set("LINE_CHANNEL_SECRET", "test-secret");
Deno.env.set("LIFF_CHANNEL_ID", "1234567890");
Deno.env.set("LINE_CHANNEL_ACCESS_TOKEN", "bot-token");

async function sign(body: string, secret = "test-secret") {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body)));
  return btoa(String.fromCharCode(...mac));
}

function mockFetch(handler: (url: string, init?: RequestInit) => Response) {
  const original = globalThis.fetch;
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = ((input: string | URL | Request, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    calls.push({ url, init });
    return Promise.resolve(handler(url, init));
  }) as typeof fetch;
  return { calls, restore: () => (globalThis.fetch = original) };
}

Deno.test("webhook signature: accepts LINE's HMAC, rejects tampering and missing header", async () => {
  const body = JSON.stringify({ events: [{ type: "follow" }] });
  assert(await verifySignature(body, await sign(body)));
  assert(!(await verifySignature(body + " ", await sign(body))));
  assert(!(await verifySignature(body, await sign(body, "other-secret"))));
  assert(!(await verifySignature(body, null)));
});

Deno.test("verifyIdToken sends the token and our channel ID, returns the LINE user", async () => {
  const m = mockFetch(() => Response.json({ sub: "U123", name: "Nong", picture: "https://p", email: null }));
  try {
    const me = await verifyIdToken("x".repeat(40));
    assertEquals(me, { userId: "U123", name: "Nong", picture: "https://p", email: null });
    assertEquals(m.calls[0].url, "https://api.line.me/oauth2/v2.1/verify");
    const sent = new URLSearchParams(String(m.calls[0].init?.body));
    assertEquals(sent.get("client_id"), "1234567890");
  } finally {
    m.restore();
  }
});

Deno.test("verifyIdToken: rejected or missing token is a 401", async () => {
  const m = mockFetch(() => new Response('{"error":"invalid_request"}', { status: 400 }));
  try {
    const e = await assertRejects(() => verifyIdToken("x".repeat(40)), HttpError);
    assertEquals(e.status, 401);
    await assertRejects(() => verifyIdToken(undefined), HttpError);
  } finally {
    m.restore();
  }
});

Deno.test("isFriend follows the bot profile endpoint status", async () => {
  let status = 200;
  const m = mockFetch(() => new Response("{}", { status }));
  try {
    assert(await isFriend("U1"));
    status = 404;
    assert(!(await isFriend("U1")));
    assertEquals(m.calls[0].url, "https://api.line.me/v2/bot/profile/U1");
  } finally {
    m.restore();
  }
});

Deno.test("input helpers trim, cap and reject oversized objects", () => {
  assertEquals(str("  Nong  "), "Nong");
  assertEquals(str("   "), null);
  assertEquals(str("abcdef", 3), "abc");
  assertEquals(plainObject([1, 2]), {});
  let threw = false;
  try { plainObject({ big: "x".repeat(17000) }); } catch { threw = true; }
  assert(threw);
});

Deno.test("staff alert leads with name, age, visa and course, then the website answers", async () => {
  const { staffMessage } = await import("./messages.ts");
  const [m] = staffMessage({
    isNew: true, fullName: "Nong Test", nickname: "Nong", age: 26, visaInterest: "student",
    lineName: "Nong", phone: "0812345678", email: null, programInterest: "Master", intake: "Jan–Mar 2027",
    currentLevel: null, tool: "website-tools", summary: "■ A\na", message: null,
    source: { utm_source: "facebook" }, isFriend: true, marketingConsent: false,
  });
  const lines = String(m.text).split("\n");
  assertEquals(lines.slice(1, 5), ["Name: Nong Test (Nong)", "Age: 26", "Visa: Student visa", "Course: Master"]);
  assert(String(m.text).endsWith("Website answers:\n■ A\na"));
  const [whm] = staffMessage({
    isNew: true, fullName: "A", nickname: null, age: 22, visaInterest: "whm", lineName: null, phone: "0812345678",
    email: null, programInterest: null, intake: null, currentLevel: null, tool: null, summary: null, message: null,
    source: {}, isFriend: false, marketingConsent: false,
  });
  assert(!String(whm.text).includes("Course:"));
});
