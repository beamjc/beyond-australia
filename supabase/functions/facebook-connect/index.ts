// Admin-only: connect the Facebook Page whose posts feed the articles.
//
// POST { action: "status" }                         -> connection status (never the token)
// POST { action: "connect", userAccessToken, pageId? }
//      The admin logs in with Facebook on /admin (read-only Page permissions).
//      We swap their short-lived token for a long-lived one, then read the
//      Page token from /me/accounts. That Page token doesn't expire.
//      If they manage several Pages and no pageId is given, the Pages are listed.
// POST { action: "disconnect" }
import { db } from "../_shared/db.ts";
import { handler, HttpError, json, readJson, str } from "../_shared/http.ts";
import { graphGet } from "../_shared/facebook.ts";

const APP_ID = () => Deno.env.get("FACEBOOK_APP_ID") ?? "";
const APP_SECRET = () => Deno.env.get("FACEBOOK_APP_SECRET") ?? "";
const PINNED_PAGE = () => Deno.env.get("FACEBOOK_PAGE_ID") ?? ""; // optional: only allow this Page

async function admin(req: Request) {
  const jwt = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!jwt) throw new HttpError(401, "Sign in first");
  const { data } = await db.auth.getUser(jwt);
  if (!data.user) throw new HttpError(401, "Sign in first");
  return data.user; // all accounts are admins on this site
}

type PageAccount = { id: string; name: string; access_token: string; tasks?: string[] };

Deno.serve(handler(async (req) => {
  const user = await admin(req);
  const body = await readJson(req, 8_000);
  const action = str(body.action, 20);

  if (action === "status") {
    const { data, error } = await db.from("facebook_connection")
      .select("page_id, page_name, connected_at, last_sync_at, last_sync_status, last_error")
      .eq("id", 1).maybeSingle();
    if (error) throw error;
    return json(req, { connected: Boolean(data), ...(data ?? {}) });
  }

  if (action === "disconnect") {
    const { error } = await db.from("facebook_connection").delete().eq("id", 1);
    if (error) throw error;
    return json(req, { connected: false });
  }

  if (action !== "connect") throw new HttpError(400, "Unknown action");
  if (!APP_ID() || !APP_SECRET()) throw new HttpError(500, "Facebook app is not configured");
  const shortToken = str(body.userAccessToken, 1000);
  if (!shortToken) throw new HttpError(400, "Missing Facebook login");

  // The exchange only succeeds for tokens issued to our app.
  let longToken: string;
  try {
    const ex = await graphGet<{ access_token: string }>("oauth/access_token", {
      grant_type: "fb_exchange_token",
      client_id: APP_ID(),
      client_secret: APP_SECRET(),
      fb_exchange_token: shortToken,
    });
    longToken = ex.access_token;
  } catch (e) {
    console.error(e);
    throw new HttpError(401, "Facebook login failed, please try again");
  }

  const accounts = await graphGet<{ data: PageAccount[] }>("me/accounts", {
    fields: "id,name,access_token,tasks",
    limit: "100",
    access_token: longToken,
  });
  let pages = accounts.data ?? [];
  if (PINNED_PAGE()) pages = pages.filter((p) => p.id === PINNED_PAGE());
  if (!pages.length) {
    throw new HttpError(403, PINNED_PAGE()
      ? "This Facebook account can't access the Beyond Study Page, or permission wasn't granted"
      : "No Pages found. Make sure you picked the Page when Facebook asked");
  }

  const wanted = str(body.pageId, 40);
  const page = wanted ? pages.find((p) => p.id === wanted) : pages.length === 1 ? pages[0] : null;
  if (!page) {
    return json(req, { needsPage: true, pages: pages.map(({ id, name }) => ({ id, name })) });
  }

  const { error } = await db.from("facebook_connection").upsert({
    id: 1,
    page_id: page.id,
    page_name: page.name,
    page_token: page.access_token,
    connected_by: user.id,
    connected_at: new Date().toISOString(),
    last_sync_status: null,
    last_error: null,
  });
  if (error) throw error;
  return json(req, { connected: true, page_id: page.id, page_name: page.name });
}));
