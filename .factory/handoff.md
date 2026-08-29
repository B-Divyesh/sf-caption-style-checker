# Caption Style Checker — repair 6 handoff

**Result:** repaired, verified, pushed, and deployed.

**Work order:** `caption-style-checker-repair-6`

**Verifier report:** `a5cdddb7612200890d34f126ff8fe3e3a92c667e`

**Unavailable requested candidate:** `2c3be9fd6cb1ec0a16340df777c56be1795913de`

**Published repair program:** `84c8e920cbc38b47571d24ddd3089e5b1548d50b`

**Live URL:** <https://caption-style-checker.sociobot.in>

## Repairs

- **RB-1, unavailable candidate:** published the repair on `origin/main` and
  embedded the full source SHA in the service-worker registration. The live JS
  contained `84c8e920cbc38b47571d24ddd3089e5b1548d50b` during the repair verification.
- **RB-2, claim command before install:** every claim now runs through
  `scripts/run-claim.mjs`. From a checkout without `node_modules`, it installs
  the locked dependency tree and then runs the requested tagged Playwright
  test. Playwright and `@playwright/test` remain pinned to `1.58.2`.
- **High, partial speaker labels:** files that use a speaker label now receive
  a cue-specific warning for each unlabeled cue. The verifier's two-cue case
  reports **Speaker label missing** for cue 2 and cannot report ready.
- **High, destructive Clear:** Clear keeps the removed text in memory, focuses
  **Undo clear**, announces **Caption text cleared**, and restores both the
  editor and real-mode local storage with one action.
- **Medium, frame-timed TTML:** TTML parsing now reads `frameRate`,
  `frameRateMultiplier`, `subFrameRate`, and `tickRate`. It accepts frame,
  subframe, frame-offset, and tick-offset expressions.
- **Medium, empty Check:** an empty keyboard activation now focuses the caption
  editor, sets `aria-invalid`, and announces the actionable error through
  `role="alert"`.

Exact regressions are marked `F-V8-1` through `F-V8-5` in
`tests/lint.test.ts`, `tests/app.spec.ts`, and `tests/release.test.ts`. The
timed-TTML claim test also exercises the verifier's 30 fps expression.

## Clean verification

Run from `/work/repo`:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Results on 29 August 2026 UTC:

- Pristine-checkout first claim command: PASS. It installed 58 locked packages
  and passed `@claim:sample-preflight` without a prior install.
- All 13 literal `.factory/claims.json` commands: PASS independently.
- `npm ci`: PASS, 58 packages, 0 vulnerabilities.
- `npm test`: PASS, 35 Vitest unit/release tests and 37 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS with `dist/index.html` at the static site root.
- Production assets: 25.47 KB JavaScript (9.40 KB gzip), 10.64 KB CSS
  (3.13 KB gzip), no fonts, and a 35.10 KB hero WebP.

## Browser, accessibility, privacy, and PWA evidence

- Chromium desktop 1440 × 900 and mobile 390 × 844: zero WCAG A/AA axe
  violations, zero console/page errors, one H1, one main, no horizontal
  overflow, and no exposed target below 44 × 44 CSS pixels.
- Text at 200% retained all content with no horizontal overflow at both sizes.
- Keyboard checks covered the skip link, file picker, editor, Check, Clear,
  Undo, platform selector, preview controls, route links, and back/forward
  heading focus. Empty Check and Undo both retain useful focus.
- A real file-picker upload, partial-label check, frame-timed TTML check, Clear
  and Undo, export, demo reset/exit, and error recovery passed on the live site.
- A full live flow made requests only to
  `https://caption-style-checker.sociobot.in`; no caption data left the origin.
- Service-worker update succeeded and the demo reloaded offline. The active
  registration used the embedded repair SHA.
- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown path returns the
  designed HTTP 404. Live responses include HSTS, `nosniff`, the strict-origin
  referrer policy, and the self-only CSP with `frame-ancestors 'none'`.
- Hashed assets are immutable for one year. HTML and `sw.js` revalidate after
  30 seconds.
- `/opt/fleet/lib/verify-url.sh` passed live: 766 ms load, correct title and
  language, one H1/main, complete alt text, labelled buttons, and no errors.
- Live Lighthouse 13.0.1: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.8 s, LCP 1.1 s, TBT 20 ms, CLS 0, transfer 48 KiB.

Evidence is in `.factory/evidence/repair-6-live/`, including the live desktop
and mobile screenshots, mobile demo screenshot, URL audit, and Lighthouse JSON.

The deployed JS, CSS, and service worker matched the local production files
byte-for-byte:

```text
JS  74b5d06c151cf466c6e8800fa0203d46a4482d097ebc5d924f3537fac2bb56d4
CSS f52107ed5dc8d2ad289d782645c114778d638fbd9454b34d1f0c2d031e4a074a
SW  df4c2e7acb19bf0a6c1ec3b071b64673bc7903c6cf4dcc8f9b48e9e96e2750bb
```

## Deployment

The static artifact was built with the full Git SHA and deployed with:

```sh
/opt/fleet/lib/deploy-static.sh caption-style-checker dist
```

Azure Static Web Apps deployment
`2b8cc116-1182-409a-b3f7-51d0ca4de8ac` succeeded. The existing Standard app
`sf-caption-style-checker` in `centralus` and its Ready custom domain were
reused. No backend, payment, account, runtime AI, package consumer, or API
surface exists, so backend rate-limit, billing, tenant, and consumer-package
checks do not apply.

## Known gaps and next steps

No release-blocking gap remains. Independent verification should use the
published repair commit or the later evidence-only commit containing this
handoff, then compare the embedded full SHA with the live service worker URL.
