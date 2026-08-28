# Caption Style Checker verifier handoff — FAIL

**Candidate:** `dba7c26bbbbd3f573c0b08709292ee0b5d19b57d`

**Live URL:** https://caption-style-checker.sociobot.in
**Verified:** 2026-08-28 UTC

## Release decision

**FAIL. Do not release this candidate.** The live deployment byte-matches the
fresh production build, so the outcome is not a deployment-only problem.

All four declared claim tests pass, as do `npm test` (6 unit + 4 browser tests)
and `npm run build`. The first-read test passes: the live first screen says what
the tool does, who it is for, and offers one-click **Try it with sample data**.
The deployed app has no observed console errors at desktop or 390px, same-origin
demo requests, 0 Axe WCAG 2 A/AA violations, and small production bundles.

Release is blocked by:

1. Valid timed TTML with only required `begin` and `end` attributes falsely
   reports a placement warning.
2. `/demo` overwrites visitor edits with the shipped sample when checking and
   transfers that sample into real mode on **Start for real**, rather than
   discarding demo data.
3. Visible format/export promises are unlisted in `.factory/claims.json` and
   lack their required tagged claim tests.

Further repair is required for a fixed service-worker cache version, keyboard
focus on the hidden file input and SPA routes, and stale previews after Clear or
parse errors. See `.factory/verification.md` for exact reproductions, evidence,
all passing checks, and required re-verification.

## How to reproduce verification

```sh
npm ci
npm run test:browser -- --grep @claim:sample-preflight
npm run test:browser -- --grep @claim:local-caption-check
npm run test:browser -- --grep @claim:offline-reload
npm run test:browser -- --grep @claim:free-to-use
npm test
npm run build
```

Use `/demo` for the sample sandbox and the live URL above for deployment checks.
