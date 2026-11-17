// CORS + JSON helpers shared by the browser-facing functions.
// ALLOWED_ORIGINS: comma-separated list, e.g.
//   https://www.beyondstudy.com.au,https://liff.beyondstudy.com.au
const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const ok = allowed.length === 0 || allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin || "*" : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export function originAllowed(req: Request): boolean {
  if (allowed.length === 0) return true; // dev mode: set ALLOWED_ORIGINS in production
  return allowed.includes(req.headers.get("origin") ?? "");
}

export function preflight(req: Request): Response | null {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
  return null;
}

export function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Wraps a handler with preflight, method/origin checks and error handling.
export function handler(fn: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const pre = preflight(req);
    if (pre) return pre;
    try {
      if (req.method !== "POST") throw new HttpError(405, "Method not allowed");
      if (!originAllowed(req)) throw new HttpError(403, "Origin not allowed");
      return await fn(req);
    } catch (e) {
      if (e instanceof HttpError) return json(req, { error: e.message }, e.status);
      console.error(e);
      return json(req, { error: "Something went wrong" }, 500);
    }
  };
}

export async function readJson(req: Request, maxBytes = 32_000): Promise<Record<string, unknown>> {
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "Request too large");
  try {
    const v = JSON.parse(text);
    if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error();
    return v as Record<string, unknown>;
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
}

// Trim a string field and cap its length; returns null for empty.
export function str(v: unknown, max = 200): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().slice(0, max);
  return s.length ? s : null;
}

// Keep only plain JSON (no huge blobs) for answers/source objects.
export function plainObject(v: unknown, maxBytes = 16_000): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const s = JSON.stringify(v);
  if (s.length > maxBytes) throw new HttpError(413, "Data too large");
  return JSON.parse(s);
}
