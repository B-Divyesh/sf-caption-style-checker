# Independent verification 7 — PASS

**Candidate:** `30922046ba8194dca5a05e142af3b23d472a22b2` (`main`)

**Live URL:** https://caption-style-checker.sociobot.in

**Verified:** 2026-08-29 UTC from a clean checkout.

## Decision

**PASS — release acceptable.** Fresh local and deployed evidence confirms that
the candidate is live. The prior reported deployment-only concern does not
reproduce: the deployed bundle is the candidate program with only the expected
deployment-time service-worker cache identifier substituted.

## Mandatory first checks

### Cold first read — PASS

A fresh, storage-free desktop visit to the live root showed **“Check captions
before upload”**, identified **video educators** who need readable captions and
clear speaker cues before publishing, and showed the one-click **“Try it with
sample data”** action beside “Loads a sample file and shows its warnings.” It
also gave the local, offline-after-first-visit, and free facts. In plain words:
this is a local caption-file preflight tool for video educators; click the
sample button first to see its warnings. The first screen answers what it does,
for whom, and what to do first.

Clicking that action opened `/demo` and immediately displayed the realistic
three-cue sample, six warnings, and the persistent **“Demo — sample data,
nothing is saved”** banner.

### Claim gate — PASS

`.factory/claims.json` exists and was read before the wider review. After the
clean `npm ci`, every literal command listed there passed independently. A
second combined demo-only run, `npm run test:browser -- --grep @claim:`, passed
all 13 tagged tests in 17.4 seconds.

| Claim ID | Result |
| --- | --- |
| `sample-preflight` | PASS |
| `local-caption-check` | PASS |
| `offline-reload` | PASS |
| `free-to-use` | PASS |
| `caption-formats` | PASS |
| `report-export` | PASS |
| `platform-review-findings` | PASS |
| `platform-rules-reviewed` | PASS |
| `caption-check-categories` | PASS |
| `reading-speed-threshold` | PASS |
| `real-session-refresh` | PASS |
| `demo-memory-isolation` | PASS |
| `accessible-preview-styles` | PASS |

The landing page, demo, privacy page, terms page, and README were
cross-checked against this inventory. No additional visitor-reliant claim was
found without a corresponding claim test.

## Local candidate gates — PASS

```sh
npm ci                                      # 58 packages; 0 audit vulnerabilities
npm run test:browser -- --grep @claim:<id>  # every claims.json command, 13/13
npm test                                    # 30 Vitest + 32 Playwright tests
npm run typecheck
npm run lint
GITHUB_SHA=30922046ba8194dca5a05e142af3b23d472a22b2 npm run build
```

The build completed and produced `dist/`. Initial JavaScript is 23,466 bytes
raw / 8.73 kB gzip; CSS is 10,334 bytes raw / 3.08 kB gzip; the hero WebP is
35,104 bytes; no web fonts ship. These are within the static-web budgets.

## End-to-end product evidence — PASS

Fresh live browser sessions exercised both normal and adverse paths:

- The shipped sample showed fast-reading, placement, styled-text, and speaker
  findings. A valid SRT reached **Ready to publish**.
- A mixed valid/malformed SRT reported **Cue has an invalid timestamp** and
  **1 fix needed**, never a false ready result. Replacing it with valid SRT
  recovered successfully.
- Exactly 180 WPM passed; 210 WPM was reported. Unsupported SRT markup was
  reported. Namespace-prefixed timed TTML parsed as one TTML cue with no parse
  error.
- Changing to HTML video track produced the WebVTT-only finding. Changing the
  platform retained keyboard focus. Checking a file moved focus to the report
  heading. Export created `caption-report.txt` containing the active platform.
- Real-mode text survived refresh. Direct demo mode loaded its sample without
  reading or changing the real `caption-source` value; **Start for real**
  restored that real text. File selection, drag/drop, reset, and the supplied
  demo/format/export test coverage also passed.

## Live quality, privacy, and deployment checks — PASS

- Desktop 1440 px and mobile 390 x 844 px had no horizontal overflow, console
  errors, or page errors in the exercised flow. Screenshots and the standard
  URL-verifier output are in `.factory/evidence/verification-7/`.
- `@axe-core/playwright` WCAG 2 A/AA scans had zero serious or critical
  findings on both viewports. The standard `verify-url.sh` passed for `/demo`:
  HTTP 200, title, `lang=en`, one H1, main landmark, image alt coverage,
  labelled buttons, and no console/page errors. Its observed cold load was
  608 ms.
- Keyboard navigation, the skip link, visible focus, route heading focus, and
  `prefers-reduced-motion` were exercised. In reduced-motion mode the report
  animation and transition durations were `0.00001s`.
- A fresh demo request log contained only
  `https://caption-style-checker.sociobot.in`. No analytics, remote fonts,
  third-party scripts, caption upload, or API call was observed. CSP restricts
  `connect-src` to `'self'`.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, strict
  referrer policy, and CSP `frame-ancestors 'none'`. HTML and `sw.js`
  revalidate after 30 seconds; hashed JS/CSS are immutable; stable images
  revalidate. `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, and manifest
  return 200; a nonexistent route returns the designed HTTP 404.
- After its first visit, `/demo` reloaded offline. A query-versioned service
  worker update took control and removed the old `caption-check-*` cache after
  activation, leaving only the new cache.
- Lighthouse 13.4.1 mobile produced Performance 92, Accessibility 100, Best
  Practices 100, and SEO 100; LCP was 1,168 ms and CLS 0. The CLI printed a
  post-run browser-tab-crash warning, but wrote a complete report with these
  scores; the independent Playwright checks above did not crash.

## Deployment identity

The live root references `main-BXpUJt-l.js`; the candidate build references
`main-DMy8IE5h.js`. CSS and `sw.js` have identical SHA-256 values. Normalizing
the live timestamp `1788002331887` and the local candidate SHA in the JavaScript
service-worker registration makes the two bundles byte-for-byte identical.
This is the intended build-time cache-version difference, not a product or
deployment discrepancy.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

This is a local-first static PWA. It has no server-side product endpoint,
payment, sign-in, authentication provider, or runtime AI call; rate-limit/429,
Entra tenant, backend concurrency/persistence, and consumer-package checks do
not apply.
