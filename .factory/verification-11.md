# Independent verification 11 — PASS

**Candidate:** `ae6e8fc9e9dcf06f32c099ac7d01e0ab34974194`  
**Live URL:** <https://caption-style-checker.sociobot.in>  
**Verified:** 29 August 2026 UTC, from a clean checkout.

## Decision

**PASS — release accepted.** The deployed static product meets the researched
brief and the supplied acceptance contract. No release-blocking defect was
found.

## Mandatory gates

`.factory/claims.json` is present and has 14 claims. Before the broader QA
work, `npm ci` was run from the clean checkout (58 packages, 0 dependency
vulnerabilities), then every literal claim command was run through the shipped
demo test entry point. All passed:

| Claim ID | Result |
| --- | --- |
| sample-preflight | PASS |
| local-caption-check | PASS |
| offline-reload | PASS |
| free-to-use | PASS |
| caption-formats | PASS |
| report-export | PASS |
| platform-review-findings | PASS |
| platform-rules-reviewed | PASS |
| caption-check-categories | PASS |
| reading-speed-threshold | PASS |
| real-session-refresh | PASS |
| demo-memory-isolation | PASS |
| accessible-preview-styles | PASS |
| scope-limitations | PASS |

The exact command used for each was its declared
`npm run test:claim -- @claim:<id>` string. The final full-suite state was
`status: passed` with no failed Playwright tests. The remaining local gates
also passed:

```text
npm test           PASS — 37 Vitest tests and 40 Playwright tests
npm run typecheck  PASS
npm run lint       PASS
npm run build      PASS — dist/ produced
```

The production bundle is 25.64 KB raw / 9.42 KB gzip JavaScript and 10.64 KB
raw / 3.13 KB gzip CSS. It is within the static-product budgets.

## Cold first read and demo

A fresh Chromium context opened the live root before repository copy was used.
The first screen plainly answered all required questions without scrolling:

- **What it does:** “Check captions before upload.”
- **For whom:** “For video educators who need readable captions and clear
  speaker cues before publishing.”
- **What to click first:** “Try it with sample data,” beside “Loads a sample
  file and shows its warnings.”

That one click enters `/?demo=1`; the live demo showed 11 realistic findings
and the persistent “Demo — sample data, nothing is saved” banner with working
**Reset demo** and **Start for real** actions.

## Independent end-to-end checks

- The live demo loaded its sample; a normal one-cue SRT produced **Ready to
  publish**. Empty input gave the announced, actionable error “Paste caption
  text or choose a file before checking.” A subsequent valid input recovered
  normally.
- The sample exposed the advertised semantics and the shipped tests exercised
  WebVTT, SRT, timed/namespace/frame-timed TTML, unsupported markup, referenced
  TTML styles, speaker labels, platform switching, 180 WPM versus 186 WPM, and
  report export.
- A live 2,000,001-byte file was rejected with “This file is larger than 2 MB.
  Choose a smaller caption file.”
- Direct live request recording through demo load, edit, profile change, and
  checking recorded only same-origin GET requests, no request body, and no
  caption marker leaving the browser.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200. A made-up path returned
  the designed HTTP 404. HTML revalidates after 30 seconds; hashed JS/CSS are
  `max-age=31536000, immutable`; `sw.js` revalidates after 30 seconds.
- A live service worker (`/sw.js?v=1788039013352`) controlled the demo; after
  going offline, reload still showed **Check sample captions** and all 11
  sample findings.

This is a local-first static PWA with no server-side product endpoint,
authentication, payment, product-unlock call, API, library, or CLI. Rate-limit
429/`Retry-After`, Entra tenant, backend, and consumer-package checks do not
apply.

## Accessibility and quality

- Fresh Axe WCAG A/AA scans on `/`, `/demo`, `/privacy`, `/terms`, and the 404
  at 1440×900 and 390×844 found **zero violations**, including zero serious or
  critical findings.
- At 390 px the page had zero horizontal overflow. Keyboard Tab first focused
  **Skip to main content** and Enter moved focus to `main`; no console or page
  error was observed in the tested flow. Reduced motion computed to `0.00001s`
  for report animation and transition duration.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, strict
  origin referrer policy, and a self-only CSP with `connect-src 'self'` and
  `frame-ancestors 'none'`.
- Fresh mobile Lighthouse: performance **98**, accessibility **100**, best
  practices **100**, SEO **100**; LCP **1.1 s**, TBT **170 ms**, CLS **0**,
  transferred **49 KiB**.

## Deployment identity

The requested candidate differs from the prior product commit only in factory
documentation/evidence; its product source is the deployed source. A clean
candidate build emitted a different hashed JS filename because `vite.config.ts`
uses a build-time timestamp as the service-worker build ID. After normalizing
only that 13-digit ID, SHA-256 matched exactly for both live versus candidate
JavaScript (`64d9047f…`) and service worker
(`df4c2e7acb19bf0a6c1ec3b071b64673bc7903c6cf4dcc8f9b48e9e96e2750bb`).
The live deployment therefore matches the candidate’s product content; the
asset name/version difference is the expected build-environment input.

## Defects by severity

- Critical / release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
