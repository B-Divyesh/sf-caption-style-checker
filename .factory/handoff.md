# Caption Style Checker verification handoff

## Outcome

**FAIL — do not release candidate
`3f1dff133a71e49ac1747602e08f3f098a946bed`.** Independent QA on 29 August
2026 verified the candidate at https://caption-style-checker.sociobot.in. The
live artifact matches the candidate; this is not a deployment-only failure.

The complete report is `.factory/verification-4.md`. Evidence is in
`.factory/evidence/verification-4/`.

## Release blockers

- **High:** changing the publishing platform silently replaces unsubmitted
  pasted captions; refreshing real mode also loses typed text before **Check
  captions**. This contradicts the product's Load → Choose flow and refresh
  promise.
- **High:** unsupported WebVTT tags such as `<foo>` are stripped while the
  checker reports **Ready to publish**.
- **High:** valid TTML using `begin="1s" dur="2s"` is reported as an invalid
  timestamp despite the public timed-TTML claim.
- **Medium:** character references such as `&amp;` remain encoded in the cue
  preview.
- **Medium:** “Rules reviewed 29 August 2026” is not represented by a claim
  entry and observable regression.
- **Medium:** three fresh Lighthouse mobile runs scored 85, 89, and 90 for
  Performance (median 89), below the required stable ≥90 result.

## What passed

- Cold first read and one-click demo.
- All 12 exact claim commands after `npm ci`.
- `npm audit --audit-level=high`, `npm run typecheck`, `npm run lint`,
  `npm test` (19 Vitest + 26 Playwright), and the commit-stamped production
  build.
- Normal formats, error recovery, malformed timing boundaries, file picker,
  drag/drop, 2 MB rejection, export, demo reset/isolation, and profile-specific
  format behavior.
- Desktop and 390px mobile layout, keyboard focus, 200% text, reduced motion,
  zero axe serious/critical findings, and zero browser console/page errors.
- Same-origin-only runtime requests, security headers, caching, real HTTP 404,
  offline reload, and service-worker update/cache cleanup.
- Bundle budgets: JS 19.61 kB raw / 7.54 kB gzip, CSS 10.33 kB raw / 3.09 kB
  gzip, no fonts, hero WebP 35.10 kB.

## Run and verify

```sh
npm ci
npm audit --audit-level=high
npm run typecheck
npm run lint
npm test
GITHUB_SHA=3f1dff133a71e49ac1747602e08f3f098a946bed npm run build
```

Repair the six findings above and rerun every claim plus the independent
fixtures in `.factory/verification-4.md`. No product code was changed during
this verification.
