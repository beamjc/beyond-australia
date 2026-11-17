// LINE Messaging API webhook.
// - Keeps leads.is_friend in sync (follow / unfollow).
// - When the bot is added to a group, records it and replies with the group ID,
//   so you can copy it into the STAFF_GROUP_ID secret.
// - Typing "group id" in a group makes the bot reply with the ID again.
import { db } from "../_shared/db.ts";
import { reply, verifySignature } from "../_shared/line.ts";

// deno-lint-ignore no-explicit-any
type LineEvent = Record<string, any>;

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  const raw = await req.text();
  if (!(await verifySignature(raw, req.headers.get("x-line-signature")))) {
    return new Response("bad signature", { status: 401 });
  }

  let events: LineEvent[] = [];
  try {
    events = JSON.parse(raw).events ?? [];
  } catch {
    return new Response("bad json", { status: 400 });
  }

  for (const ev of events) {
    try {
      await handle(ev);
    } catch (e) {
      console.error("webhook event failed", ev.type, e);
    }
  }
  return new Response("ok");
});

async function handle(ev: LineEvent) {
  const src = ev.source ?? {};
  switch (ev.type) {
    case "follow":
      if (src.userId) await db.from("leads").update({ is_friend: true }).eq("line_user_id", src.userId);
      break;
    case "unfollow":
      if (src.userId) await db.from("leads").update({ is_friend: false }).eq("line_user_id", src.userId);
      break;
    case "join":
      if (src.type === "group" && src.groupId) {
        await db.from("line_groups").upsert({ group_id: src.groupId, joined_at: new Date().toISOString(), left_at: null });
        await reply(ev.replyToken, [{ type: "text", text: groupIdText(src.groupId) }]);
      }
      break;
    case "leave":
      if (src.groupId) await db.from("line_groups").update({ left_at: new Date().toISOString() }).eq("group_id", src.groupId);
      break;
    case "message":
      if (src.type === "group" && ev.message?.type === "text" &&
          ev.message.text.trim().toLowerCase() === "group id") {
        await reply(ev.replyToken, [{ type: "text", text: groupIdText(src.groupId) }]);
      }
      break;
  }
}

function groupIdText(id: string) {
  return `This group's ID is:\n${id}\n\nTo send new-lead alerts here, set it as STAFF_GROUP_ID in Supabase secrets.`;
}
