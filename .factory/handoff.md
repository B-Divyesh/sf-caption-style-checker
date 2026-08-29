# Caption Style Checker independent verification 5 handoff

## Outcome

**FAIL — do not release candidate
`288227a2f703c4cf931814138c920736bae3934e`.**

Tested on 29 August 2026 UTC from the supplied clean checkout and against
https://caption-style-checker.sociobot.in. The live product matches the
candidate build after normalizing only the expected build-time service-worker
cache ID. This is not a deployment-only failure.

## Release blockers

- **High — false-green caption semantics:** accepted SRT with unknown or styled
  markup and valid TTML with referenced color/placement styles are stripped and
  reported **Ready to publish**. This misses the brief's core styling,
  placement, lost-semantics, and unsupported-tag preflight job. Full fixtures,
  results, and repair guidance are in `.factory/verification-5.md` as F-V5-1.
- **Medium — unsafe immutable caching:** unversioned hero and social image URLs
  receive a one-year `immutable` cache policy. Hash the names or make those URLs
  revalidate (F-V5-2).

No product code was changed during verification.

## What passed

- Cold first read and one-click isolated demo.
- All 13 exact `.factory/claims.json` commands after `npm ci`.
- `npm audit --audit-level=high`, `npm run typecheck`, `npm run lint`,
  `npm test` (23 Vitest + 31 Playwright), and the exact candidate production
  build.
- Normal parsing, invalid-input recovery, timing boundaries, 2 MB rejection,
  file picker, drag/drop, export, demo isolation, and real-session restore.
- Same-origin-only request log, security headers, real 404, routes and links.
- Desktop/mobile axe, keyboard/focus, 44 px targets, 200% text, reduced motion,
  console/page errors, service-worker update, cache cleanup, and offline reload.
- Three live mobile Lighthouse runs: Performance 96/96/95; Accessibility, Best
  Practices, and SEO 100; LCP 851–955 ms; CLS 0.
- Production budgets: JS 20.63 kB raw / 8.00 kB gzip; CSS 10.33 kB raw /
  3.09 kB gzip; hero 35.10 kB; no fonts.

## Run and verify

```sh
npm ci
npm audit --audit-level=high
npm run typecheck
npm run lint
npm test
GITHUB_SHA=288227a2f703c4cf931814138c920736bae3934e npm run build
```

Use `/demo` for the isolated sample. Reproduce F-V5-1 with the four fixtures in
`.factory/verification-5.md`; each currently produces **Ready to publish**.
Evidence is in `.factory/evidence/verification-5/`.
