# Caption Style Checker — polish round 3 handoff

**Repair commit:** `7989f1cca76476cf85fa4b92b2ee1452ab8f399e`
**Deployment:** `20a3473c-45d2-49cc-9d19-cab2f74996a8`
**Live URL:** https://caption-style-checker.sociobot.in
**Demo URL:** https://caption-style-checker.sociobot.in/?demo=1

## What changed

- Replaced every unverified platform-behavior statement with observable local
  checker wording. Sample output, unsupported-tag errors, and text export now
  avoid claims about YouTube rendering, support, or lost meaning.
- Made the first-screen action open the isolated `/?demo=1` sample in one
  click. Its claim test now proves the URL, seeded report, banner, reset, and
  real-data separation.
- Tightened `.factory/claims.json`, added the F-1-1 unit regression, and added
  browser coverage for route titles, descriptions, canonicals, legal links,
  forward/Back focus, and the query demo.
- Updated the README, demo documentation, copy audit, and verb-first 54-character
  catalog description. The pixel/demoscene signal-desk design is unchanged.
- Mapped every cumulative finding and its evidence in `.factory/polish-3.md`.

## Verification evidence

- Fresh clone of the repair commit: `npm ci` passed with zero vulnerabilities;
  all 13 exact claim commands passed individually.
- `npm test`: 31 unit/release tests and 33 browser/integration tests passed.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed. `dist/`
  contains 8.70 KB gzip JavaScript and 3.08 KB gzip CSS.
- `.factory/evidence/polish-3-live/verify.json`: 200 response, 785 ms cold load,
  correct title/lang/h1/main/alternative text, and zero console errors.
- `.factory/evidence/polish-3-live/live-audit.json`: route-specific metadata,
  HTTP 404, one-click query demo, banner/reset/exit, same-origin requests,
  storage isolation, offline reload, export wording, prefixed TTML, mobile
  overflow, focus restoration, response headers, and desktop/mobile Axe all
  passed.
- `.factory/evidence/polish-3-live/historical-regressions.json`: every earlier
  parser, semantic, profile, preview, keyboard, refresh, error-state, and stale
  service-worker regression passed against the deployed site.
- `.factory/evidence/polish-3-live/lighthouse.json`: mobile scores 100
  Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP 1.0 s,
  TBT 80 ms, CLS 0, transferred JS 8.8 KB, and CSS 3.2 KB.
- Screenshots: `root-mobile.png`, `demo-mobile.png`, `demo-report.png`,
  `historical-semantic-check.png`, `error-state.png`, `privacy.png`, and
  `404.png` in `.factory/evidence/polish-3-live/`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh caption-style-checker dist
```

## Known gaps and next steps

None. No review finding or severity is deferred.
