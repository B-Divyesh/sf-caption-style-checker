# Independent verification 2 — PASS

**Candidate:** `5166690211271171561eacc574bf815bb7764f67` (`main`)

**Live URL:** https://caption-style-checker.sociobot.in

**Verified:** 2026-08-29 UTC, from a clean checkout at the candidate commit.

## Decision

**PASS — release acceptable.** This re-verification found that the deployed
application implements the repaired candidate. The prior deployment-only
concern is not reproduced.

There are no open release-blocking, high, medium, or low defects.

## Mandatory first checks

### Cold first read — PASS

A fresh, storage-free desktop session opened the live root URL. Its first
screen says **“Check captions before upload”**, identifies **video educators**
who need speaker cues and readable meaning to survive publishing, and provides
the one-click **“Try it with sample data”** action with the immediately visible
outcome “Loads a sample file and its warnings.” The three plain facts say that
files stay in the browser, it works offline after one visit, and it is free.

This answers what the product does, for whom, and what to click first in plain
words. The required one-click demo is present.

### Claim inventory and exact claim commands — PASS

`.factory/claims.json` exists and was read before the wider QA run. It contains
six claims; each exact command below was executed from the clean checkout after
`npm ci` and passed (one browser test each):

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-preflight` | `npm run test:browser -- --grep @claim:sample-preflight` | pass |
| `local-caption-check` | `npm run test:browser -- --grep @claim:local-caption-check` | pass |
| `offline-reload` | `npm run test:browser -- --grep @claim:offline-reload` | pass |
| `free-to-use` | `npm run test:browser -- --grep @claim:free-to-use` | pass |
| `caption-formats` | `npm run test:browser -- --grep @claim:caption-formats` | pass |
| `report-export` | `npm run test:browser -- --grep @claim:report-export` | pass |

## Local candidate evidence

- `npm ci`: passed; 58 packages installed and npm reported 0 vulnerabilities.
- `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`: passed.
  The complete test suite has 12 Vitest tests and 17 Playwright tests.
- Exact production build: `GITHUB_SHA=5166690211271171561eacc574bf815bb7764f67 npm run build` passed and produced `dist/`.
- Production assets: JavaScript 15.57 kB (6.34 kB gzip), CSS 9.18 kB
  (2.84 kB gzip), and hero WebP 35.10 kB. These are within the static-web
  budgets.
- The local end-to-end run exercised normal SRT, timing-only TTML, TTML with
  an explicit `region`, invalid text and recovery, reversed timings, an empty
  cue, profile-specific markup warnings, report export, keyboard navigation,
  and axe. It found no serious/critical axe violations or console/page errors.

## Deployment identity

The live HTML and CSS match the candidate production build. The deployed JS is
byte-for-byte identical after replacing only the expected build-time service
worker cache value: live uses its deployment timestamp `1787978691958` where a
fresh deterministic local build used the supplied `GITHUB_SHA`. The translated
candidate bundle and live `/assets/main-CPSwv-vS.js` have the same SHA-256:
`cc3d34cc8dc2c1805d3c7be2ea5c6df73495cbe13a8a7a50501cea3145e6eda5`.
The corresponding translated HTML is also identical. This is expected from
the source's build-id fallback and is not a functional deployment difference.

Live status evidence: `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap,
manifest, favicon, and generated art returned 200; an unknown application URL
returned a real HTTP 404 with the product 404 page. All discovered internal
links resolve to those routes; the external Param Factory footer link is
explicitly external.

## Live product QA

Fresh Playwright sessions against the live deployment verified:

- The demo loads the sample and visible warnings. Demo edits persist only for
  the demo session; **Reset demo** resets to sample; **Start for real** restores
  the saved real caption and removes the demo banner.
- A normal SRT is detected; invalid non-caption text receives the actionable
  parse-error state; a reversed WebVTT cue reports “End time is not after
  start time”; an empty SRT cue reports missing caption text.
- Timing-only TTML is detected and does **not** report placement loss. The same
  TTML with `region="lower"` does report the placement warning. Plain-text
  export warns for styled markup. Export produces `caption-report.txt` with its
  selected profile and finding.
- The file picker path, textarea path, demo reset/exit, desktop and 390×844
  layouts, skip link, visible focus, SPA navigation focus to the new H1, and
  reduced motion were exercised. Mobile had no horizontal overflow; every
  tested visible interactive control was at least 44×44 CSS px.
- `@axe-core/playwright` WCAG 2 A/AA found zero serious or critical violations
  at 1440px and 390px. The worker `verify-url.sh` also passed for `/demo`:
  title, `lang=en`, one H1, main landmark, image alt coverage, named buttons,
  and zero console/page errors. (The expected HTTP-404 navigation was excluded
  from the normal-flow console result.)
- Service worker: the live demo reloaded offline after initial visit. An
  injected `caption-check-obsolete-qa` cache was removed after unregistering
  and re-registering the worker, while the versioned live cache remained.

## Privacy, transport, cache, and performance

- A fresh live demo flow recorded requests only to
  `https://caption-style-checker.sociobot.in`; no analytics, CDN fonts, or
  third-party caption transfer occurred. The CSP limits `connect-src` to
  `'self'`. Real mode's local storage and the in-memory demo behavior match the
  privacy page and demo documentation.
- There are no server-side product endpoints, sign-in, billing, or AI calls;
  therefore API allowance/429 and Entra tenant checks do not apply.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, CSP with `frame-ancestors 'none'`, and immutable caching for
  hashed JS/CSS and the hero asset. HTML uses short revalidation caching.
- Independent Lighthouse 12.8.2 mobile run on `/demo` with the installed
  Playwright Chromium: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 0.7 s, CLS 0, TBT 20 ms.

## Known limits

The checker intentionally provides pragmatic timed-TTML/WebVTT/SRT preflight
coverage rather than a full TTML rendering engine. Platform support can change,
as the product states. This is a documented product limit, not an observed QA
defect.
