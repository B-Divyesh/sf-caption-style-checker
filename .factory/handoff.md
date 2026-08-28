# Caption Style Checker handoff

## What shipped

- A local WebVTT, SRT, and timed-TTML checker with drag/drop, paste, clear,
  report export, platform profiles, and cue preview.
- Checks for invalid or empty timing, fast reading speed, long lines, speaker
  labels, styled text, placement settings, and profile-sensitive markup.
- `/demo` has an isolated, realistic three-cue sample and a resettable demo
  banner. Demo data remains in memory.
- `/privacy`, `/terms`, and a styled fallback page are real SPA routes.
- Original factory-generated pixel/demoscene CRT desk art. The production WebP
  is 35 KB; prompt and provenance are in `.factory/design.md`.
- Service worker caching supports the documented offline-after-first-visit
  experience. There are no runtime third-party scripts, fonts, analytics, or
  caption uploads.

## Run and verify

```sh
npm install
npm test
npm run build
```

`npm run build` creates `dist/` with `index.html` at its root. The exact
static deploy configuration is `public/staticwebapp.config.json`.

Verification completed on 2026-08-28:

- `npm test`: 6 parser unit tests and 4 browser tests passed.
- Claims exercised from clean browser contexts: sample preflight, local-only
  requests, offline reload after first visit, and free access.
- Browser smoke test at 390 px and desktop: one H1, visible demo banner,
  generated art, and zero console errors.
- `axe-core` on `/demo`: 0 violations.
- Lighthouse mobile on `/demo`: Performance 93, Accessibility 100, LCP 1.0 s,
  CLS 0, TBT 310 ms. (Chrome reported a late screenshot-target crash after it
  wrote the JSON report; the reported category/audit values were retained.)
- Production assets: 6.10 KB gzip JavaScript, 2.76 KB gzip CSS, 35 KB hero
  WebP.

## Known gaps and next steps

The parser deliberately covers useful timed TTML paragraphs rather than every
TTML namespace, inheritance rule, or ASS/SSA feature. Platform profiles are
conservative heuristics and should be updated as platforms change. A future
version could add named platform profiles backed by published compatibility
fixtures.
