// LINE Login + Messaging API helpers.
import { HttpError } from "./http.ts";

const LIFF_CHANNEL_ID_ENV = () => mustEnv("LIFF_CHANNEL_ID");
const BOT_TOKEN = () => mustEnv("LINE_CHANNEL_ACCESS_TOKEN");

function mustEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export type LineIdentity = {
  userId: string;
  name: string | null;
  picture: string | null;
  email: string | null;
};

// Verify a LIFF ID token with LINE. Never trust a user ID sent by the browser:
// this is the only place a LINE user ID enters our system.
export async function verifyIdToken(idToken: unknown): Promise<LineIdentity> {
  if (typeof idToken !== "string" || idToken.length < 20 || idToken.length > 4096) {
    throw new HttpError(401, "Missing LINE login");
  }
  const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id_token: idToken, client_id: LIFF_CHANNEL_ID_ENV() }),
  });
  if (!res.ok) throw new HttpError(401, "LINE login expired, please reopen the page");
  const p = await res.json();
  if (typeof p.sub !== "string") throw new HttpError(401, "Invalid LINE login");
  return {
    userId: p.sub,
    name: typeof p.name === "string" ? p.name : null,
    picture: typeof p.picture === "string" ? p.picture : null,
    email: typeof p.email === "string" ? p.email : null,
  };
}

// True if the user has added the OA as a friend (and not blocked it).
// Checked server-side so the result can't be faked by the browser.
export async function isFriend(userId: string): Promise<boolean> {
  const res = await fetch(`https://api.line.me/v2/bot/profile/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${BOT_TOKEN()}` },
  });
  await res.body?.cancel();
  return res.ok;
}

// deno-lint-ignore no-explicit-any
export type LineMessage = Record<string, any>;

export async function push(to: string, messages: LineMessage[]): Promise<boolean> {
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BOT_TOKEN()}`,
      "Content-Type": "application/json",
      "X-Line-Retry-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({ to, messages: messages.slice(0, 5) }),
  });
  if (!res.ok) console.error("LINE push failed", res.status, await res.text());
  else await res.body?.cancel();
  return res.ok;
}

export async function reply(replyToken: string, messages: LineMessage[]): Promise<void> {
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: { Authorization: `Bearer ${BOT_TOKEN()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ replyToken, messages: messages.slice(0, 5) }),
  });
  if (!res.ok) console.error("LINE reply failed", res.status, await res.text());
  else await res.body?.cancel();
}

// Webhook signature check: base64(HMAC-SHA256(channelSecret, rawBody)).
export async function verifySignature(rawBody: string, signature: string | null): Promise<boolean> {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(mustEnv("LINE_CHANNEL_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
  const expected = btoa(String.fromCharCode(...mac));
  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
