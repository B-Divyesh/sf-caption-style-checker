# Caption Style Checker repair handoff

## Outcome

All release blockers from independent report `.factory/verification-4.md` are
repaired in `2755483d2458f2ca3aca4ff988a5f66566362a31` and deployed to
https://caption-style-checker.sociobot.in through Azure Static Web Apps
`sf-caption-style-checker` (production environment).

## Reproduced first

Before editing, the exact reported `/demo` flow—paste `UNIQUE: edit`, then
change from YouTube upload to HTML video track—replaced the text with the
337-byte sample. In real mode, pasting the same text then refreshing returned
an empty editor and `caption-source` was absent. The cause was that textarea
state was saved only by **Check captions**.

## Repairs and regression coverage

| Finding | Root-cause repair | Regression coverage |
| --- | --- | --- |
| F-V4-1 pasted text loss | Textarea `input` events now update real-mode local storage or demo memory before a rerender. Platform changes and refresh therefore use the current source even before checking. | `F-V4-1 preserves an unsubmitted pasted caption when the platform changes`; `@claim:real-session-refresh` refreshes without checking. |
| F-V4-2 unknown WebVTT tags | The linter now reads each WebVTT tag name and makes unknown tags an error for both publishing profiles. Known markup behavior is unchanged. | Unit: `F-V4-2 rejects unsupported WebVTT tags for every platform profile`; browser: `F-V4-2 reports unsupported WebVTT tags instead of ready to publish`. |
| F-V4-3 TTML `dur` | A timed TTML paragraph accepts `begin` plus `dur` and derives its end time; `begin` plus `end` remains supported. | Unit and browser `F-V4-3 accepts timed TTML begin plus dur`. |
| F-V4-4 character references | Caption cleanup now decodes named (`amp`, `lt`) and decimal/hex numeric references after stripping source markup. | Unit `F-V4-4 decodes named and numeric character references in cue text`; browser preview regression. |
| F-V4-5 rules-reviewed claim | Registered the observable dated/source-backed provenance claim in `.factory/claims.json`. | `@claim:platform-rules-reviewed` selects both profiles and checks the 29 August 2026 date and linked source. |
| F-V4-6 mobile performance | Service-worker registration/cache work now begins after the load event, leaving initial rendering unblocked. | `F-V4-6 defers service-worker cache work until after the initial page load`; three fresh mobile Lighthouse runs scored 100/100/100 Performance. |

## Verification evidence

- Clean `npm ci`: 58 packages installed; `npm audit --audit-level=high`: zero vulnerabilities.
- `npm run typecheck` and `npm run lint`: pass.
- `npm test`: 23 Vitest unit/release tests and 31 Playwright browser tests pass.
- Every one of the 13 exact commands in `.factory/claims.json` was run separately; each selected one tagged browser test and passed.
- `GITHUB_SHA=2755483d2458f2ca3aca4ff988a5f66566362a31 npm run build`: pass; `dist/index.html` exists. Production JS is 20.63 kB raw / 8.00 kB gzip and CSS is 10.33 kB raw / 3.08 kB gzip.
- Desktop 1440×900 and 390×844 live browser checks passed: the exact unsubmitted platform-change and refresh reproductions preserve `UNIQUE: edit`; unknown `<foo>` is blocked; TTML `begin="1s" dur="2s"` is valid; preview text is `Fish & chips`; mobile has no horizontal overflow.
- Live Axe WCAG 2 A/AA at desktop and 390px: zero serious/critical violations. The browser observed no console errors.
- Privacy: the exercised live flow made only same-origin requests. No analytics, remote fonts/scripts, caption upload, sign-in, payment, or AI request exists.
- Offline reload passed after service-worker control at the live `/demo` URL. Existing browser coverage verifies cache version cleanup and online network-first navigation.
- Response policy/live identity: live `/demo` returns HTTPS/HSTS, `nosniff`, strict-origin referrer policy, the same-origin CSP with `frame-ancestors 'none'`, 30-second HTML revalidation, and a real HTTP 404 for an unknown route. The deployed `main-BDKU-zVq.js` SHA-256 is `1532494b90a7d6cc55b4da7d5b833cc5eb55f0929c436a9dfee54e3d0573bb16`, exactly matching the final local production asset.
- Mobile Lighthouse, fresh local production `/demo`, simulated mobile: Performance 100/100/100; Accessibility, Best Practices, and SEO 100 each; TBT 57/15/23 ms, LCP 1.110/1.086/1.092 s, CLS 0. A matching Lighthouse 12.8.2 run scored 100 Performance (TBT 16 ms, LCP 1.094 s).

## Run and verify

```sh
npm ci
npm audit --audit-level=high
npm run typecheck
npm run lint
npm test
GITHUB_SHA=$(git rev-parse HEAD) npm run build
```

Use `/demo` for the one-click isolated sample. This remains a static-web artifact deployed from `dist/`; server API, package/consumer, billing, and backend rate-limit checks do not apply. No known release-blocking gaps remain.
