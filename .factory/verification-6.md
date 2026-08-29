# Independent verification 6 — Caption Style Checker

**Verdict: PASS.** Candidate `6c623bbf00f1945fbeac895c473a56eb0772e6aa`
is acceptable for release. Verification was performed on 29 August 2026 UTC
from this clean checkout against
https://caption-style-checker.sociobot.in.

## First read and demo

A cold, desktop and 390 px mobile visit says **“Check captions before
upload”**, says it is for video educators who need readable captions and clear
speaker cues, and presents **“Try it with sample data”** as the first action.
That action opens `/demo`, shows the persistent **“Demo — sample data, nothing
is saved”** banner, and immediately displays the realistic three-cue lesson
sample and nine findings. The first-read and one-click sandbox requirements
pass.

## Required claim tests

After `npm ci`, every exact command named in `.factory/claims.json` was run
from the demo entry point and passed (13/13). A combined `--grep @claim:` run
also completed 13/13.

| Claim ID | Result |
| --- | --- |
| `sample-preflight` | PASS — sample and visible warnings |
| `local-caption-check` | PASS — only app-origin requests |
| `offline-reload` | PASS — `/demo` reloads offline after first visit |
| `free-to-use` | PASS — displayed fact and no payment controls |
| `caption-formats` | PASS — WebVTT, SRT, timed TTML and semantic fixtures |
| `report-export` | PASS — `caption-report.txt` includes visible findings |
| `platform-review-findings` | PASS — selected platform changes checks |
| `platform-rules-reviewed` | PASS — dated YouTube and MDN guidance links |
| `caption-check-categories` | PASS — all advertised finding categories |
| `reading-speed-threshold` | PASS — 180 WPM passes; 186 WPM warns |
| `real-session-refresh` | PASS — real-mode text survives refresh |
| `demo-memory-isolation` | PASS — demo does not read or write real storage |
| `accessible-preview-styles` | PASS — all three contrast treatments |

## Local quality gates

All checks passed:

```sh
npm ci
npm audit --audit-level=high     # 0 vulnerabilities
npm run typecheck
npm run lint
npm test                         # 29 Vitest + 32 Playwright passed
GITHUB_SHA=6c623bbf00f1945fbeac895c473a56eb0772e6aa npm run build
```

The build produced `dist/`. Its initial JavaScript is 23,329 bytes raw / 8,707
bytes gzip, CSS is 10,334 bytes raw / 3,092 bytes gzip, the hero is 35,104
bytes, and no web fonts ship. These are within the static-product budgets.

## Live functional, accessibility, privacy, and PWA evidence

- On desktop (1440 px) and mobile (390 px), normal SRT succeeds; invalid text
  produces the useful parse error; recovery succeeds; 180 WPM passes; 186 WPM
  warns; unsupported SRT markup gives `1 fix needed`; and a >2 MB file gives
  the stated recovery alert.
- Fresh-page request logs during the demo flow contained only
  `https://caption-style-checker.sociobot.in`. Console errors and page errors
  were both zero. This confirms the local-caption privacy claim in the live
  deployment.
- `@axe-core/playwright` found zero serious or critical WCAG 2 A/AA violations
  on both viewports. Keyboard platform selection retained focus with a solid
  focus outline; the shipped keyboard suite also passed. Reduced motion uses
  0.01 ms animation/transition durations; neither viewport overflowed.
- Fresh live `/demo` installed the service worker, cached its shell, and
  reloaded offline to `Check sample captions`. A query-versioned worker update
  took control and, after activation, left only its new `caption-check-*`
  cache, confirming update cache cleanup.
- Live responses give HSTS, `nosniff`, strict-origin referrer policy, and the
  same-origin CSP with response-header `frame-ancestors 'none'`. `/`, `/demo`,
  `/privacy`, `/terms`, metadata files, and linked guidance all returned 200;
  an unknown route returned 404. Hashed JS/CSS are immutable; the stable hero
  and social images correctly revalidate.
- Mobile Lighthouse 13.4.1: Performance **99**, Accessibility **100**, Best
  Practices **100**, SEO **100**; LCP 1,722 ms, TBT 1.8 ms, CLS 0.

## Deployment identity

The live HTML references `main-DN5GSmzv.js`; the candidate production build
with its commit SHA references `main-CQ1-Rqqd.js`. The sources are byte-for-byte
identical after replacing only the service-worker cache build ID (live uses the
deployment timestamp `1787995021866`; local uses the requested candidate SHA).
The CSS and stable image SHA-256 values match. This is the expected build-time
identity difference, not a deployment mismatch. Commit `6c623bb` itself changes
only `.factory/handoff.md`; its product source is the repaired executable that
is live.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

No product code was modified during this verification. This is a local-first
static PWA; sign-in, payment, server endpoints/rate limits, backend
concurrency/persistence, and package-consumer checks do not apply.
