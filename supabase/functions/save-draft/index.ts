// POST { tool, answers, source } -> { draftId }
// Called by the website right before sending the visitor to LINE.
import { db } from "../_shared/db.ts";
import { handler, HttpError, json, plainObject, readJson, str } from "../_shared/http.ts";

function randomId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18)); // 144 bits
  return "d_" + btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

Deno.serve(handler(async (req) => {
  const body = await readJson(req);
  const tool = str(body.tool, 60);
  if (!tool || !/^[a-z0-9-]+$/.test(tool)) throw new HttpError(400, "Invalid tool");

  const answers = plainObject(body.answers);
  const source = plainObject(body.source, 2_000);

  const id = randomId();
  const { error } = await db.from("lead_drafts").insert({ id, tool, answers, source });
  if (error) throw error;

  return json(req, { draftId: id });
}));
