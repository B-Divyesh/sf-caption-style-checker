# Caption Style Checker repair handoff

## Repair scope

This repair addresses the independent verifier report in commit
`e4b4e74e290ae1b41ffb3aa86dc05eb5bdf5087a` for candidate
`dba7c26bbbbd3f573c0b08709292ee0b5d19b57d`. The product remains a Vite and
TypeScript static web app with `dist/` as its deployment root.

## What changed

- Timed TTML `begin` and `end` attributes no longer trigger a placement
  warning. Only explicit TTML layout attributes such as `region`,
  `tts:textAlign`, and `tts:origin` are treated as placement settings.
- Demo source is isolated in memory. Visitors can edit and check it, reset it
  to the shipped WebVTT, and leave without reading or overwriting the saved
  real-mode caption.
- The public WebVTT, SRT, timed-TTML, and report-export promises are now listed
  in `.factory/claims.json`. Each of the six claims has exactly one tagged
  observable browser test.
- Every build registers a versioned service worker. New workers delete older
  product caches, and navigations use the network first with an offline cache
  fallback. This prevents a previous shell from masking a new release.
- Keyboard focus is visible around the full file-picker target. SPA navigation
  focuses and announces the destination H1. Mobile controls are at least
  44 CSS pixels in both dimensions.
- Empty and parse-error results clear the prior cue preview.
- Azure Static Web Apps now rewrites only the four real SPA routes. Unknown
  paths use a built `404.html` and return HTTP 404 instead of 200.
- Package version is `1.0.1`; Playwright is pinned to `1.58.2` as required.

## Verification evidence

Run from `/work/repo` on 2026-08-29 UTC:

```sh
npm ci
npm audit --audit-level=high
npm run lint
npm run typecheck
npm run test:unit
npm run test:browser
npm run build
```

- Clean install: 58 packages installed; audit reported 0 vulnerabilities.
- Type/lint: both `tsc --noEmit` commands passed.
- Unit and release contracts: 12 passed. These include the exact timing-only
  TTML regression, a positive TTML placement fixture, claim-tag uniqueness,
  cache update policy, and the HTTP-404 configuration.
- Playwright: 17 passed at desktop and 390×844 mobile. Coverage includes all
  six claim commands, demo edit/reset/exit isolation, stale-preview removal,
  file-picker and route focus, back-end-free privacy requests, offline reload,
  stale-cache refresh, real URLs, reduced motion, touch targets, and console
  errors.
- Axe 4.11: 0 serious or critical WCAG 2 A/AA violations on `/demo` at desktop
  and 390 px.
- Worker `verify-url.sh` against the SWA emulator: title
  `Demo — Caption Style Checker`, `lang=en`, one H1, one main landmark, no
  missing alt text, no unnamed buttons, and 0 console/page errors.
- SWA emulator: `/`, `/demo`, `/privacy`, and `/terms` returned 200;
  `/not-a-real-page` returned 404; offline `/demo` reloaded to “Check sample
  captions”; CSP, `nosniff`, referrer policy, HSTS, and immutable hashed-asset
  caching were present.
- Mobile Lighthouse on `/demo`: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.1 s, CLS 0, total blocking time 0 ms.
- Production output: JavaScript 15.54 kB / 6.31 kB gzip; CSS 9.18 kB / 2.84 kB
  gzip; generated hero WebP 35.10 kB. All are below the static-product budgets.
- Package/consumer testing does not apply to this static-web artifact. There
  is no backend, authentication provider, payment flow, or AI runtime to test.

## Deployment

The repair is configured for Azure Static Web Apps at
`https://caption-style-checker.sociobot.in` using:

```sh
/opt/fleet/lib/deploy-static.sh caption-style-checker dist
```

Live deployment identity and post-deploy results are recorded below after the
production upload.

## Known limits

The parser intentionally supports useful timed TTML paragraphs rather than all
TTML inheritance and styling rules. Platform profiles remain conservative
preflight guidance because publisher behavior can change. No verifier finding
is left open.
