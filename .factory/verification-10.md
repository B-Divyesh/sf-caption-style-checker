# Independent verification 10 — PASS

**Candidate:** `b201c705985b30cc5363aaa8870eda4af836f42c`

**Live URL:** <https://caption-style-checker.sociobot.in>

**Verified:** 29 August 2026 UTC from the supplied clean checkout.

## Decision

**PASS — release accepted.** The candidate satisfies the researched brief and
the factory acceptance contract. All 13 mandatory claim commands pass, the
cold first-read gate passes, local checks and the production build pass, and a
build from the candidate reproduces the deployed product byte-for-byte. No
critical, high, medium, or low product defect was found.

## Mandatory first-read gate

A new Chromium context opened the live root at 1440 × 900 before any repository
copy was used to judge the screen.

- What it does: **“Check captions before upload.”**
- Who it is for: **“For video educators who need readable captions and clear
  speaker cues before publishing.”**
- What to click first: **“Try it with sample data,”** beside **“Loads a sample
  file and shows its warnings.”**

All three answers are visible without scrolling. One click opens `/?demo=1`,
shows 11 realistic findings, and displays the persistent **“Demo — sample data,
nothing is saved”** banner with **Reset demo** and **Start for real**. Evidence:
[`first-read-desktop.png`](evidence/verification-10/first-read-desktop.png),
[`root-mobile-cold.png`](evidence/verification-10/root-mobile-cold.png), and
[`demo-mobile.png`](evidence/verification-10/demo-mobile.png).

## Claims gate

`.factory/claims.json` exists with 13 entries. Before broader inspection, every
literal command was run independently from the clean candidate checkout. The
first command installed the missing locked dependency tree and then ran through
the documented demo entry point. The complete command transcript is
[`claims.log`](evidence/verification-10/claims.log).

| Claim ID | Exact command result | Observable evidence |
| --- | --- | --- |
| `sample-preflight` | PASS — 1 test passed | One click opened the isolated 11-finding sample; reset worked. |
| `local-caption-check` | PASS — 1 test passed | Browser request log contained only this origin. |
| `offline-reload` | PASS — 1 test passed | Demo reloaded offline under the active worker. |
| `free-to-use` | PASS — 1 test passed | Free fact shown; no payment controls. |
| `caption-formats` | PASS — 1 test passed | WebVTT, SRT, timed, frame-timed, and styled TTML/SRT fixtures produced the expected visible results. |
| `report-export` | PASS — 1 test passed | `caption-report.txt` contained the active profile and visible finding. |
| `platform-review-findings` | PASS — 1 test passed | YouTube local checks and the HTML WebVTT requirement changed with the profile. |
| `platform-rules-reviewed` | PASS — 1 test passed | Both profiles showed the 29 August 2026 review date and working guidance link. |
| `caption-check-categories` | PASS — 1 test passed | The sample visibly covered all six advertised categories. |
| `reading-speed-threshold` | PASS — 1 test passed | 180 WPM passed and 186 WPM warned. |
| `real-session-refresh` | PASS — 1 test passed | Real caption text survived refresh. |
| `demo-memory-isolation` | PASS — 1 test passed | Demo neither read nor replaced real stored text. |
| `accessible-preview-styles` | PASS — 1 test passed | All three advertised foreground/background pairs rendered as asserted. |

The live landing, demo, privacy, terms, README, and copy audit were
cross-checked against this inventory. No material visitor-reliant claim is
unlisted. Cumulative runtime evidence is in
[`live-audit.json`](evidence/verification-10/live-audit.json).

## Clean local gates

The initial worktree was clean, and `HEAD`, `origin/main`, and the requested
candidate all resolved to `b201c705985b30cc5363aaa8870eda4af836f42c`.

```text
npm ci             PASS — 58 packages installed, 0 vulnerabilities
npm test           PASS — 36 Vitest + 38 Playwright tests
npm run typecheck  PASS
npm run lint       PASS
npm run build      PASS — dist/ produced
```

The exact normal production build produced 25.43 KB JavaScript (9.36 KB gzip)
and 10.64 KB CSS (3.13 KB gzip). There are no font files. The hero WebP is
35.10 KB. These are inside the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB
hero budgets.

## End-to-end and boundary testing

Fresh live checks covered the smallest useful product and its recovery paths.

- A real file-picker upload parsed a two-cue SRT, showed the correct preview,
  and reached **Ready to publish**. A separate synthetic browser drag-and-drop
  parsed a one-cue SRT and rendered its preview.
- WebVTT, SRT, namespace-prefixed TTML, `begin` + `dur` TTML, and 30 fps
  frame-timed TTML parsed without false errors. The HTML profile required
  WebVTT as documented.
- The one-click sample produced placement, markup, emphasis, reading-speed,
  line-length, and speaker findings. A partly labelled two-speaker file warned
  about the missing label.
- Exactly 180 WPM passed and 186 WPM warned. A 42-character line passed and a
  43-character line warned.
- Empty input focused the editor, set `aria-invalid`, and announced the next
  action. Plain text produced the actionable parse error, and valid text then
  recovered to a normal report.
- Clear provided one-action keyboard undo. Reset restored demo data, while
  Start for real restored the previously saved real caption.
- A 2,000,001-byte file produced **“This file is larger than 2 MB. Choose a
  smaller caption file.”**
- Injected `<img onerror>` markup remained inert text and became an unsupported
  WebVTT-tag finding.
- Report export, profile changes, browser Back, unknown-route recovery, and
  all internal/external links worked.

## Accessibility, keyboard, and responsive behavior

- Fresh Axe WCAG A/AA scans on `/`, `/demo`, `/privacy`, `/terms`, and the 404
  at 1440 × 900 and 390 × 844 reported zero violations, hence zero serious or
  critical findings.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 609 ms load, correct title,
  `lang=en`, one H1, one main, complete alt text, named buttons, and zero
  console/page errors. Evidence:
  [`verify.json`](evidence/verification-10/verify-url/verify.json).
- Keyboard activation of the first Tab stop, **Skip to checker**, focused the
  H1; the next Tab reached the primary sample action. Platform selection,
  checking, file selection, route links, Back, Reset, Start for real, Clear,
  Undo, cue buttons, radios, and export were operable without a pointer.
- Focus uses a visible 3 px mint outline (`rgb(167, 243, 110)`) with a 3 px
  offset. There was no trap.
- At 390 px there was no horizontal overflow, and every visible link, button,
  select, textarea, drop target, and preview-style label measured at least
  44 × 44 CSS pixels. Reflow also passed at 320 CSS pixels.
- Direct 200% text enlargement preserved all text and controls without
  horizontal overflow. Evidence:
  [`root-mobile-text-200.png`](evidence/verification-10/root-mobile-text-200.png).
- With reduced motion requested, the maximum computed animation or transition
  duration was 0.00001 seconds. No flashing or autoplay exists.

## Privacy, security, routes, and PWA

- The full root/demo/upload/edit/check/navigation flow emitted only same-origin
  `GET` requests, with no request body. No caption text, analytics, remote font,
  third-party script, API request, or AI call left the site.
- Browser response headers show HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP with
  `connect-src 'self'` and `frame-ancestors 'none'`.
- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown URL returns the
  designed HTTP 404. Both external guidance links and the factory link returned
  200.
- Hashed JS/CSS use `public, max-age=31536000, immutable`; HTML and `sw.js`
  revalidate after 30 seconds; stable art revalidates.
- The active worker is `/sw.js?v=1788034190065`. `registration.update()`
  succeeded, only `caption-check-1788034190065` remained, an online refresh
  rejected an injected stale shell, and `/demo` reloaded offline with its
  sample findings.

This is a static, local-first PWA with no server endpoint, product-unlock call,
payment, account, sign-in, runtime AI, library API, or CLI. API 429 and
`Retry-After`, backend concurrency/persistence, Entra authority, and clean
consumer-package checks therefore do not apply. Deterministic local parsing is
appropriate for this job; the brief does not imply a missing AI step.

## Performance and deployment identity

Fresh Lighthouse 13.4.1 mobile results:

| Category/metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.9 s |
| LCP | 1.1 s |
| TBT | 40 ms |
| CLS | 0 |
| Total transfer | 50,310 bytes |

Evidence: [`lighthouse.json`](evidence/verification-10/lighthouse.json).

The live JavaScript exposes build ID `1788034190065`. Rebuilding this candidate
with that deployment input reproduced all deployed files checked byte-for-byte:

| Artifact | Candidate and live SHA-256 |
| --- | --- |
| `index.html` | `109438d5126c733cb6a923047b522a2d54db8795a6538c84a79e691549807cc5` |
| `404.html` | `b3ad229fb98000162ab90cfcd33e39add3c352b63df765495609612d7864a021` |
| `main-CC3QQiCm.js` | `87bee4130a695fbdda98ffa14dcbbeb055623a625b097dfffe3df9415711bfa0` |
| `main-qhPg7aos.css` | `f52107ed5dc8d2ad289d782645c114778d638fbd9454b34d1f0c2d031e4a074a` |
| `sw.js` | `df4c2e7acb19bf0a6c1ec3b071b64673bc7903c6cf4dcc8f9b48e9e96e2750bb` |

Hero art, social image, touch icon, favicon, manifest, robots, and sitemap also
matched. This establishes that the live deployment matches the candidate; the
numeric service-worker cache ID is the sole build-environment input.

## Scope and documentation

The product has the distinct pixel/demoscene signal-desk identity specified in
`.factory/design.md`, including its palette, type, spacing, motion, original art
prompt, and provenance. README, MIT LICENSE, demo documentation, claims, copy
audit, `/privacy`, `/terms`, metadata, sitemap, robots, manifest, and designed
404 are present and consistent.

## Defects by severity

- Critical / release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
