# Independent verification 9 — PASS

**Candidate:** `f9b3fdac2ea91f2f3810eb82987ee6c12058d858`

**Live URL:** <https://caption-style-checker.sociobot.in>

**Verified:** 29 August 2026 UTC from the supplied clean checkout.

## Decision

**PASS — release accepted.** The candidate satisfies the researched brief and
factory acceptance contract. All 13 mandatory claims pass, the cold first-read
gate passes, the complete local suite and production build pass, and the live
deployment is byte-reproducible from the candidate. No release-blocking, high,
medium, or low product defect was found.

## Mandatory first-read gate

A new storage-free Chromium context opened the live root at 1440 × 900.

- What it does: **“Check captions before upload.”**
- Who it is for: **“For video educators who need readable captions and clear
  speaker cues before publishing.”**
- What to click first: **“Try it with sample data,”** beside **“Loads a sample
  file and shows its warnings.”**

All three are visible without scrolling. One click opens `/?demo=1`, displays
11 realistic findings, and shows the persistent **“Demo — sample data, nothing
is saved”** banner with **Reset demo** and **Start for real**. Evidence:
`.factory/evidence/verification-9/first-read-desktop.png` and
`.factory/evidence/verification-9/demo-mobile.png`.

## Claims gate

`.factory/claims.json` exists with 13 entries. Every literal test command ran
independently and passed:

| Claim | Result |
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

The pristine-dependency path was also replayed with `node_modules` absent.
`npm run test:claim -- @claim:sample-preflight` installed the 58 locked
packages and passed, resolving verification 8's first-command blocker.
Per-claim logs and the command summary are under
`.factory/evidence/verification-9/claims/`.

Landing, demo, privacy, terms, README, and copy-audit text were cross-checked
against the claim inventory. No material visitor-reliant claim is unlisted.

## Clean local gates

```text
npm ci             PASS — 58 packages, 0 vulnerabilities
npm test           PASS — 35 Vitest + 37 Playwright tests
npm run typecheck  PASS
npm run lint       PASS
npm run build      PASS — dist/ produced
```

The candidate-SHA build contains 25.47 KB JavaScript (9.40 KB gzip), 10.64 KB
CSS (3.13 KB gzip), no fonts, and a 35.10 KB hero WebP. These are inside the
200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Independent end-to-end testing

The live browser matrix passed 25 of 25 checks. Full structured evidence is in
`.factory/evidence/verification-9/live-qa.json`.

- A real file-picker upload parsed a two-cue SRT, reached **Ready to publish**,
  and persisted through refresh.
- WebVTT, SRT, and 30 fps frame-timed TTML paths worked without false parse
  errors. The HTML video profile correctly required WebVTT.
- A partially labelled two-speaker file warned **Speaker label missing** on cue
  2 and could not report ready.
- Exactly 180 WPM passed and 186 WPM warned. A 42-character line passed and a
  43-character line warned.
- Empty input focused the editor, set `aria-invalid`, and announced its next
  step. Plain text produced a parse error and valid input recovered normally.
- Clear offered keyboard-operable undo and restored the saved value.
- A file over 2,000,000 bytes produced an actionable size error.
- Injected `<img onerror>` markup stayed inert text and produced an unsupported
  WebVTT-tag finding.
- Export downloaded `caption-report.txt` with the active platform and visible
  finding.
- Demo edits neither read nor replaced real saved text. Reset restored the
  sample, and Start for real restored the real session.

## Accessibility, mobile, and navigation

- Fresh axe WCAG A/AA scans at 1440 × 900 and 390 × 844 reported zero total
  violations, hence zero serious or critical findings.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 601 ms load, correct title and
  `lang=en`, one H1, one main, complete alt text, labelled buttons, and zero
  console/page errors. Evidence:
  `.factory/evidence/verification-9/verify-url.json`.
- Keyboard-only checks covered the skip link, empty and valid Check actions,
  route links, browser Back, and heading focus. The designed focus ring is 3 px
  mint (`rgb(167, 243, 110)`). There were no keyboard traps.
- At 390 px there is no horizontal overflow; the sample action and outcome are
  above the fold; every exposed link, button, select, textarea, drop target,
  and preview-style label is at least 44 × 44 CSS pixels.
- Direct 200% text enlargement produced no clipped text at desktop or mobile;
  all content and controls remained reachable. Evidence:
  `.factory/evidence/verification-9/text-resize.json`.
- The 320-CSS-pixel reflow check retained all content and controls without
  horizontal scrolling.
- Reduced-motion mode leaves no animation or transition longer than 1 ms.
- Route navigation and browser Back move focus to the new H1. Public pages have
  route-specific titles, one H1, and the expected landmarks.

## Privacy, routes, headers, PWA, and performance

- A complete real/demo/edit/check/export/navigation flow made 45 requests. All
  were same-origin GETs; no caption text, analytics, remote font, third-party
  script, AI call, or API request left the site.
- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route returns
  the designed HTTP 404. Product links and both external guidance links return
  200.
- Live HTML includes HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and the self-only CSP with
  `frame-ancestors 'none'`.
- Hashed JS/CSS cache immutably for one year. HTML and `sw.js` revalidate after
  30 seconds. Stable art revalidates.
- The active worker is `/sw.js?v=1788028196540`. `registration.update()`
  succeeded, only its versioned cache remained, and `/demo` reloaded offline
  with all 11 findings.
- Lighthouse 13.4.1 mobile: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 180 ms, CLS 0, 50,364 bytes total
  transfer. Evidence: `.factory/evidence/verification-9/lighthouse.json`.

## Deployment identity

`HEAD`, `origin/main`, and the requested candidate all resolve to
`f9b3fdac2ea91f2f3810eb82987ee6c12058d858`.

The live worker reports build ID `1788028196540`. Rebuilding the candidate with
that deployment value reproduced live `index.html`, JavaScript, CSS, service
worker, and 404 body byte-for-byte:

```text
index.html             d89048239e2684e6e1c5965dd60b891699d2e3ce019e289a386308b68592303d
main-Cw7xtUUN.js       4b5a6df1ee0f85a2a7ce157c8224c68ed44136a6e3ea0c052f1bb5dd54db2232
main-qhPg7aos.css      f52107ed5dc8d2ad289d782645c114778d638fbd9454b34d1f0c2d031e4a074a
sw.js                  df4c2e7acb19bf0a6c1ec3b071b64673bc7903c6cf4dcc8f9b48e9e96e2750bb
404 response body      4ecbec5f89df218ae60a3b6a7d50182c828404dd8654236db01deda74b4a0164
```

Hero art, social image, touch icon, favicon, manifest, robots, and sitemap also
match the candidate build. This establishes that the live deployment matches
the candidate product source; the cache ID is the only build-environment
input.

## Scope and documentation

The product-specific pixel/demoscene signal-desk identity matches
`.factory/design.md`; palette, typography, spacing, motion, original art prompt,
and provenance are recorded. README, MIT LICENSE, `/privacy`, `/terms`, demo
documentation, copy audit, claims, and handoff are present.

This is a static local-first PWA with no server endpoint, unlock call, payment,
account, sign-in, runtime AI, library package, or CLI. API 429/`Retry-After`,
backend concurrency/persistence, Entra authority, and clean-consumer package
checks therefore do not apply.

## Defects by severity

- Critical / release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
