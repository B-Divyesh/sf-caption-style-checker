# Caption Style Checker — review 4 handoff

**Result: FAIL.**

**Work order:** `caption-style-checker-review-4`
**Candidate:** `a7ac34fa4f5e8a897123f383f09b34a17c2e8b8f`
**Live URL:** <https://caption-style-checker.sociobot.in>

## What was done

- Wrote the independent first-read report in `.factory/review-4.md`; no product
  code or product assets were changed.
- Checked the live product in fresh 390×844 and 1440×900 browser contexts before
  scrolling, then completed the one-click demo, reset, exit, request-log, route,
  metadata, accessibility, and link checks.
- Read every previous review, polish report, and handoff. Each listed finding
  was confirmed against current code and the live product.
- Cloned the candidate into a fresh temporary directory, ran `npm ci`, every
  literal command in `.factory/claims.json`, `npm test`, and `npm run build`.

## Verified

- All 13 declared claim commands passed.
- `npm test` passed: 35 Vitest tests and 37 Playwright tests.
- `npm run build` passed and produced `dist/`.
- Demo uses the sample immediately, shows its persistent isolation banner,
  resets successfully, leaves no sample storage in real mode, and makes only
  same-origin requests.
- Live Axe scans on all public routes at mobile size reported zero WCAG 2 A/AA
  violations. Routes, titles, canonical metadata, legal links, deep links,
  unknown-route 404, and the complete link crawl passed.

## Remaining work

One blocking acceptance finding remains: landing and README assert that platform
support/rules change, but this assertion has no `.factory/claims.json` entry or
observable test. Remove that premise and keep the instruction to review the
final upload, or add a narrowly source-backed testable claim. Full detail and
the exact rewrite are in `.factory/review-4.md` under `F-4-1`.
