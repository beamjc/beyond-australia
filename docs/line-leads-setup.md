# LINE lead capture (LIFF): how it works and how to switch it on

Branch: `feat/line-liff-leads`. Nothing is deployed, and the feature stays **off** until `NEXT_PUBLIC_LIFF_ID` is set. Until then every LINE button works exactly as before.

## What it does

1. A visitor finishes the **Budget Study Planner** and taps the existing **LINE: @beyondstudy** button.
2. The site saves their planner answers as a short-lived **draft** in Supabase (`save-draft`) and opens `https://liff.line.me/<LIFF_ID>?d=<draftId>`. Only the random draft ID goes in the URL, never personal data.
3. LINE opens the form at `/line` (the LIFF page). The visitor logs in with LINE and is prompted to add `@beyondstudy` as a friend.
4. `liff-session` verifies the LINE ID token with LINE, loads the draft, and pre-fills the form. The visitor's planner answers are shown at the top.
5. The visitor adds name and phone, ticks consent, and submits. `submit-lead` verifies the token again, then saves or updates the lead (one row per LINE user) and records the submission.
6. If they're a friend, the bot sends them a summary in LINE. If `STAFF_GROUP_ID` is set, the staff LINE group gets an alert.

If anything fails on the website side (e.g. Supabase is down), the button falls back to the normal LINE link.

## Files

| Path | What |
|---|---|
| `supabase/line_leads.sql` | Tables `lead_drafts`, `leads`, `lead_submissions`, `line_groups`. RLS on with **no policies**, so the anon key can't read or write them. Only the Edge Functions (service role) can. |
| `supabase/functions/save-draft` | Website → saves tool answers + UTM source, returns a random draft ID (expires in 2 days). |
| `supabase/functions/liff-session` | LIFF page → verifies the LINE ID token, returns profile, draft, pre-fill, and whether the visitor is a friend (checked with LINE server-side). |
| `supabase/functions/submit-lead` | LIFF page → validates, saves the lead, sends LINE messages. |
| `supabase/functions/line-webhook` | LINE → keeps `is_friend` in sync (follow/unfollow), and replies with the group ID when the bot joins a group. Checks LINE's signature. |
| `supabase/functions/_shared/messages.ts` | Wording of the student message and staff alert. |
| `src/app/line/page.tsx`, `src/components/line/LiffLeadForm.tsx` | The LIFF form (TH/EN). |
| `src/lib/leadDraft.ts` | Website helper: UTM capture, save draft, open LIFF. |
| `src/components/shared/BSCConsultationCTA.tsx` | New optional `leadDraft` prop. Only the Budget Planner passes it for now. |

## Setup checklist

### 1. LINE Developers Console (needs an admin of the @beyondstudy OA)

1. **Messaging API:** in LINE Official Account Manager, turn on Messaging API for @beyondstudy (Settings → Messaging API). This creates a Messaging API channel under a provider. Note which provider.
2. In the LINE Developers Console, open that Messaging API channel:
   - Copy the **Channel secret** (Basic settings).
   - Issue a **Channel access token (long-lived)** (Messaging API tab).
   - Webhook URL: `https://<project-ref>.supabase.co/functions/v1/line-webhook`. Turn on **Use webhook**.
3. **Create the channel that hosts the form, under the same provider.** The same provider matters: LINE gives each user a different ID per provider, and the add-friend option only works within one provider.
   - LINE recommends new LIFF apps be created as a **LINE MINI App** channel, because LIFF is being merged into LINE MINI App. An unverified MINI App can be published without review. Set the endpoint URL and add-friend option in its **Web app settings** tab.
   - Or use a **LINE Login** channel → **LIFF** tab → Add. Set Basic settings → **Linked LINE Official Account** to @beyondstudy, then set the channel to **Published**.
   - Either way, configure the LIFF app like this:
     - Size: **Full**
     - Endpoint URL: `https://<site>/line`
     - Scopes: **openid**, **profile**. Add email only if LINE has approved the email permission.
     - Add friend option: **On (aggressive)**
   - Copy the **LIFF ID** and that channel's **Channel ID**.
4. In OA Manager, turn on **Allow bot to join group chats** if you want staff alerts in a group. Check that **Chat** stays on in Response settings so staff can still reply to students by hand.

### 2. Supabase (project used by the site)

1. SQL Editor → run `supabase/line_leads.sql`.
2. Set the secrets (CLI shown; Dashboard → Edge Functions → Secrets also works):
   ```
   supabase secrets set \
     LIFF_CHANNEL_ID=<channel ID from step 1.3> \
     LINE_CHANNEL_ACCESS_TOKEN=<long-lived token> \
     LINE_CHANNEL_SECRET=<Messaging API channel secret> \
     ALLOWED_ORIGINS=https://beyond-australia.jirachaiphat-c.workers.dev
   ```
   Add the production domain to `ALLOWED_ORIGINS` (comma-separated) when it moves.
3. Deploy the functions. JWT checking is off because the callers are the public site and LINE. Each function does its own checks instead.
   ```
   supabase functions deploy save-draft liff-session submit-lead line-webhook --no-verify-jwt --project-ref <project-ref>
   ```
4. **Staff group:** add @beyondstudy to the staff LINE group. The bot replies with the group ID (or type `group id` in the group). Run `supabase secrets set STAFF_GROUP_ID=<id>`.

### 3. Website

`NEXT_PUBLIC_*` values are built into the site, so set them wherever `npm run deploy` runs (`.env.local`, or the Cloudflare build environment):

```
NEXT_PUBLIC_LIFF_ID=<LIFF ID>
NEXT_PUBLIC_PRIVACY_URL=<privacy policy URL>   # optional; shows a link next to the consent box
```

### 4. Test on real phones before announcing

- [ ] iPhone + Android in the LINE app: Budget Planner → LINE button → login → add friend → form pre-filled → submit → summary arrives in chat → staff alert arrives.
- [ ] Desktop browser: the button opens LINE's web login (QR or email). After login, the same form appears.
- [ ] Decline the add-friend prompt: the lead is still saved. Staff alert shows "not a friend". The form shows the add-friend button.
- [ ] Submit twice from one LINE account: one `leads` row, two `lead_submissions` rows.
- [ ] Block the OA, then unblock it: `leads.is_friend` follows (webhook).
- [ ] In Supabase, the `leads` table is empty for the anon key: `select` through the REST API with the anon key returns nothing.

## Decisions for the owner

1. **Consent wording and privacy policy (PDPA).** The form asks for required consent to be contacted and separate optional marketing consent, and stores the time and a version (`CONSENT_VERSION`, default `2026-11`). The wording is a draft. It should be checked with whoever handles Beyond Study Center's PDPA compliance, and a privacy policy URL should be supplied.
2. **Thai copy.** All new Thai text is a draft awaiting the external editor: `docs/qa/thai-review-line-leads.md`.
3. **Staff alert contains phone numbers** in a LINE group. Keep that group small, or remove the phone line in `messages.ts`.
4. **Message quota.** Each student summary and staff alert is a push message and counts against the OA plan's monthly message allowance.
5. **Where staff work the leads.** Supabase Table Editor works on day one (filter `leads` by `status`). A small admin page or a CRM sync can come later.
6. **More tools.** Only the Budget Planner passes answers today. Other tools can pass `leadDraft` to `BSCConsultationCTA` the same way, and the floating LINE button can point at the LIFF URL with no draft.

## Tests

- `npm test` → `tests/unit/liffForm.test.ts` (intakes, validation, LIFF URL, UTM capture).
- `deno test supabase/functions/_shared --allow-env` → webhook signature, ID token verification, friendship check (LINE mocked).
- `npx playwright test tests/e2e/line-leads.spec.ts` → LIFF form and Budget Planner button with **mocked** LINE SDK and Edge Functions.

None of these prove that LINE login, the deployed functions, or LINE messaging work live. That needs the checklist above.
