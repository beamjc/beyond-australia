#!/usr/bin/env bash
# Builds the current branch and deploys it to the STAGING worker only
# (beyond-australia-staging), never to the live beyond-australia worker.
# Settings come from .env.staging.local (copy .env.staging.example; not committed).
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .env.staging.local ]]; then
  echo "Missing .env.staging.local. Copy .env.staging.example and fill it in." >&2
  exit 1
fi

# NEXT_PUBLIC_* values are built into the pages, so they must be set for the build.
# Values exported here win over .env / .env.local.
set -a
source .env.staging.local
set +a

for v in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY; do
  [[ -n "${!v:-}" ]] || { echo "$v is empty in .env.staging.local" >&2; exit 1; }
done

echo "Deploying branch $(git rev-parse --abbrev-ref HEAD) to STAGING…"
npx opennextjs-cloudflare build
# DRY_RUN=1 npm run deploy:staging builds but only prints the deploy command.
${DRY_RUN:+echo} npx opennextjs-cloudflare deploy -- --env staging
