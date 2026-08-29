# Independent verification 5 — FAIL

**Candidate:** `288227a2f703c4cf931814138c920736bae3934e` (`main`)

**Live URL:** https://caption-style-checker.sociobot.in

**Verified:** 29 August 2026 UTC from the supplied clean checkout.

## Decision

**FAIL — do not release this candidate.** The live deployment is the candidate
product, not a stale or unrelated build. The checker gives **Ready to publish**
for accepted SRT and valid TTML files whose unsupported styling or referenced
placement will be lost. That contradicts the researched brief's central
preflight job and the product's visible styled-text, placement, markup, and
unsupported-tag promises.

The mandatory first-read and declared-claim gates pass. Their fixtures do not
cover the false-green cases below.

## Mandatory first checks

### Cold first read — PASS

A new, storage-free desktop browser opened the live root. The first screen says
**Check captions before upload**, identifies video educators who need readable
captions and speaker cues, and shows **Try it with sample data** beside “Loads a
sample file and shows its warnings.” The privacy, offline, and free facts are
also visible.

In plain words: this checks captions for video educators before they publish;
the first click is the sample. One click opened `/demo`, displayed nine concrete
findings, and showed the persistent **Demo — sample data, nothing is saved**
banner with **Reset demo** and **Start for real**.

### Declared claims — PASS

`.factory/claims.json` exists. Before dependency installation, the literal first
claim invocation could not resolve `@playwright/test`; after the required
lockfile install, every listed command was run unchanged and selected one
tagged test. All 13 passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-preflight` | `npm run test:browser -- --grep @claim:sample-preflight` | 1 passed |
| `local-caption-check` | `npm run test:browser -- --grep @claim:local-caption-check` | 1 passed |
| `offline-reload` | `npm run test:browser -- --grep @claim:offline-reload` | 1 passed |
| `free-to-use` | `npm run test:browser -- --grep @claim:free-to-use` | 1 passed |
| `caption-formats` | `npm run test:browser -- --grep @claim:caption-formats` | 1 passed |
| `report-export` | `npm run test:browser -- --grep @claim:report-export` | 1 passed |
| `platform-review-findings` | `npm run test:browser -- --grep @claim:platform-review-findings` | 1 passed |
| `platform-rules-reviewed` | `npm run test:browser -- --grep @claim:platform-rules-reviewed` | 1 passed |
| `caption-check-categories` | `npm run test:browser -- --grep @claim:caption-check-categories` | 1 passed |
| `reading-speed-threshold` | `npm run test:browser -- --grep @claim:reading-speed-threshold` | 1 passed |
| `real-session-refresh` | `npm run test:browser -- --grep @claim:real-session-refresh` | 1 passed |
| `demo-memory-isolation` | `npm run test:browser -- --grep @claim:demo-memory-isolation` | 1 passed |
| `accessible-preview-styles` | `npm run test:browser -- --grep @claim:accessible-preview-styles` | 1 passed |

The landing page, privacy/terms pages, and README were cross-checked against the
inventory. No additional unlisted visitor-reliant claim was found.

## Release-blocking finding

### F-V5-1 — High — accepted SRT and TTML semantics are stripped and reported ready

The live YouTube profile produces a green **Ready to publish** heading for all
four cases below:

1. Unsupported SRT markup:

   ```srt
   1
   00:00:01,000 --> 00:00:03,000
   <foo>Meaning</foo>
   ```

2. Styled SRT text:

   ```srt
   1
   00:00:01,000 --> 00:00:03,000
   <font color="red">Danger means stop</font>
   ```

3. Valid TTML styled content using a referenced style and `<span>`:

   ```xml
   <tt xmlns:tts="http://www.w3.org/ns/ttml#styling">
     <head><styling><style xml:id="red" tts:color="red"/></styling></head>
     <body><p begin="1s" end="3s"><span style="red">Danger means stop</span></p></body>
   </tt>
   ```

4. Valid TTML placement inherited through a style reference:

   ```xml
   <tt xmlns:tts="http://www.w3.org/ns/ttml#styling">
     <head><styling><style xml:id="lower" tts:origin="10% 80%"/></styling></head>
     <body><p begin="1s" end="3s" style="lower">JORDAN: Positioned</p></body>
   </tt>
   ```

In every case, the parser removes the markup from the preview and emits no
style, placement, markup, or unsupported-tag finding. The last case shows only
the speaker note; the first three show only the generic missing-speaker note.

This is the exact risk the brief names: caption files losing styling,
placement, and accessibility meaning at the publishing boundary. It also
contradicts the public claims that the checker reads SRT and timed TTML and
checks styled text, placement, and markup. The claim-category fixture exercises
only the shipped WebVTT sample, while unsupported-tag coverage is restricted to
WebVTT.

Required repair: apply format-specific markup checks to every accepted format,
resolve TTML style references enough to detect semantic style and placement, and
add claim-level SRT/TTML regressions that cannot report ready. If that scope is
not supported, narrow the accepted-format and check-category copy honestly.

## Other finding

### F-V5-2 — Medium — unversioned images receive one-year immutable caching

`public/staticwebapp.config.json` assigns `Cache-Control: public,
max-age=31536000, immutable` to all `/assets/*` paths. The live, unversioned
`/assets/signal-desk.webp` and `/assets/caption-checker-social.jpg` receive that
header. A changed image deployed at the same URL can remain stale for a year;
the hero is also listed in the service-worker shell, so a new worker can refill
its new cache from the stale HTTP cache.

Required repair: content-hash these asset filenames, or reserve immutable
caching for hashed files and give stable asset URLs a revalidating policy.

## Passing local gates and build evidence

- Supplied HEAD exactly matched the candidate. Candidate commit `288227a`
  changes only the prior handoff document; product source is inherited from
  repair commit `2755483`.
- `npm ci`: passed, 58 packages installed; `npm audit --audit-level=high`:
  zero vulnerabilities.
- `npm run typecheck` and `npm run lint`: passed. The configured lint command is
  another TypeScript no-emit check; no separate source linter exists.
- `npm test`: 23 Vitest tests and 31 Playwright tests passed.
- `GITHUB_SHA=288227a2f703c4cf931814138c920736bae3934e npm run build`:
  passed and produced `dist/`.
- Production JavaScript is 20.63 kB raw / 8.00 kB gzip; CSS is 10.33 kB raw /
  3.09 kB gzip; there are no font files; hero WebP is 35.10 kB. All stated
  static budgets pass.

## Deployment identity and routes

- Live CSS and `sw.js` are byte-identical to the candidate build. Live JavaScript
  SHA-256 is `5f637868…a8742`; candidate JavaScript is `695f95d3…cd56`.
  Replacing only the expected live build-time cache ID `1787992253353` with the
  candidate SHA makes the files byte-identical at `695f95d3…cd56`. HTML then
  differs only by the content-hashed JavaScript filename. The deployment is the
  candidate product.
- `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, manifest, favicon, touch
  icon, art, JS, and CSS return 200. `/not-a-real-page` returns the designed page
  with HTTP 404. Both external guidance links and the Param Factory footer link
  returned 200.

## Functional, privacy, accessibility, and PWA evidence

- Normal SRT, WebVTT, and TTML `begin` + `dur` worked. Character references
  decoded in the preview. Exactly 180 WPM passed; 186 WPM warned. Invalid
  seconds and zero-duration cues were rejected. Plain invalid input showed an
  actionable error and recovered after valid input.
- File selection, drag/drop, report download, demo reset, and return to saved
  real data worked. A 2,000,001-byte file showed the size error and preserved
  the previous caption.
- The full exercised live flow made requests only to
  `https://caption-style-checker.sociobot.in`. There are no analytics, remote
  fonts/scripts, caption uploads, AI calls, payment, sign-in, or product server
  endpoints. API rate limits, Entra authority, backend concurrency, and clean
  consumer package tests therefore do not apply.
- Factory `verify-url.sh` passed. Axe WCAG 2 A/AA found zero serious/critical
  violations at 1440×900 and 390×844. Both layouts had no horizontal overflow,
  mobile visible targets were at least 44×44 CSS pixels, a 200% text smoke test
  retained the layout, focus rings were visible, SPA navigation focused its H1,
  reduced motion removed visible report movement, and normal flows produced no
  console/page errors. The skip link moved focus to the demo H1; its next Tab
  reached the platform selector.
- Service-worker control, version replacement, obsolete-cache deletion, and
  offline `/demo` reload passed. Online documents and `sw.js` revalidate after
  30 seconds; hashed JS/CSS have the intended immutable policy.
- Response headers include HSTS, `nosniff`, strict-origin referrer policy, and a
  same-origin CSP with `frame-ancestors 'none'` and `connect-src 'self'`.

## Performance

Three independent Lighthouse 12.8.2 mobile runs against live `/demo` scored:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 96 | 100 | 100 | 100 | 955 ms | 222 ms | 0 |
| 2 | 96 | 100 | 100 | 100 | 851 ms | 216 ms | 0 |
| 3 | 95 | 100 | 100 | 100 | 954 ms | 257 ms | 0 |

Lighthouse has no lab INP for this static flow. An explicit caption-check click
rendered by the next animation frame in 6.9 ms. The performance gate passes.

Evidence captures and the factory URL report are in
`.factory/evidence/verification-5/`.
