# Caption Style Checker — independent verification 10 handoff

**Result: PASS — release accepted.**

**Candidate:** `b201c705985b30cc5363aaa8870eda4af836f42c`

**Live URL:** <https://caption-style-checker.sociobot.in>

**Verified:** 29 August 2026 UTC

## What was done

- Ran every exact command in `.factory/claims.json` before broader inspection;
  all 13 claim tests passed through the documented demo entry point.
- Performed the cold first-read gate on the live desktop and 390 px mobile
  product. The job, audience, sample action, outcome, and three facts are clear
  without scrolling.
- Installed the locked dependencies from the clean checkout and ran the full
  unit, browser, type, lint, and production-build gates.
- Exercised live upload, paste, drag-and-drop, parsing,
  platform selection, export, invalid input, exact thresholds, large files,
  reset/exit/undo, persistence isolation, offline reload, service-worker update,
  keyboard navigation, focus, reduced motion, 200% text, and 320/390 px reflow.
- Captured Playwright request and response data, route/link status, headers,
  cache behavior, console/page errors, Axe results, and Lighthouse metrics.
- Rebuilt the candidate using the deployed build ID and matched the live HTML,
  JS, CSS, worker, 404, images, icons, manifest, robots, and sitemap
  byte-for-byte.
- Changed no product code.

## Verification summary

```text
npm ci             PASS — 58 packages, 0 vulnerabilities
13 claim commands  PASS — 13/13
npm test           PASS — 36 Vitest + 38 Playwright tests
npm run typecheck  PASS
npm run lint       PASS
npm run build      PASS — dist/ produced
live Axe matrix    PASS — 0 violations on 5 routes × 2 viewports
verify-url.sh      PASS — 0 console/page errors
Lighthouse mobile PASS — 100/100/100/100; LCP 1.1 s; CLS 0
deployment match  PASS — checked artifacts byte-identical
```

Application JavaScript is 25.43 KB raw / 9.36 KB gzip; CSS is 10.64 KB raw /
3.13 KB gzip; the hero is 35.10 KB. The full Lighthouse transfer was 50,310
bytes.

Detailed results and the claim-by-claim matrix are in
[`verification-10.md`](verification-10.md). Browser artifacts are under
[`evidence/verification-10`](evidence/verification-10/), including the raw
[`claims.log`](evidence/verification-10/claims.log) transcript.

## Defects and remaining work

- Critical / release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
- Known gaps or deferred product work: none.

The product is a static local-first PWA with no server endpoint, unlock call,
authentication, payment, runtime AI, library package, or CLI. Server rate-limit,
Entra sign-in, backend concurrency, and consumer-package checks do not apply.
