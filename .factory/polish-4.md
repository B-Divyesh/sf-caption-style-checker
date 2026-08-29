# Polish round 4 — cumulative review closure

**Product repair commit:** `b57be7192c2a50a06712ef548e6aec1ea065aee2`

**Deployment:** `05516cfe-e500-44c3-9b13-66302ce1ed24`

**Live URL:** <https://caption-style-checker.sociobot.in>

**Scope:** every finding in `.factory/review-1.md` through
`.factory/review-4.md` and every earlier polish report.

The active round-four defect is fixed: the landing page and README no longer
claim that platform support or rules change. They retain the useful instruction
to review the final upload. Both source and browser regressions reject the old
premise.

## Finding map

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| F-1-1 | Report and export describe only local placement and markup checks. | Tests `F-1-1 keeps platform findings scoped…`, `@claim:platform-review-findings`, `@claim:report-export`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live `historicalFindings.F-1-1=true`. |
| F-1-2 | The sample covers fast cues, long lines, styles, placement, markup, and speakers. | Test `@claim:caption-check-categories`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live `F-1-2=true`. |
| F-1-3 | The visible 180-WPM threshold has exact pass/fail boundary coverage. | Test `@claim:reading-speed-threshold`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live 180/186-WPM check `F-1-3=true`. |
| F-1-4 | Real refresh storage remains separate from memory-only demo state. | Tests `@claim:real-session-refresh`, `@claim:demo-memory-isolation`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live direct-demo read/write, reset, exit, and reload check `F-1-4=true`. |
| F-1-5 | Mobile shows the action and its result together on the first screen. | Test `mobile first screen keeps the sample outcome…`; [390px screenshot](evidence/polish-4-live/root-mobile-cold.png); live bottom positions 276/370/440/489px in an 844px viewport. |
| F-1-6 | Every visitor format list says “timed TTML.” | Test `@claim:caption-formats`; [390px screenshot](evidence/polish-4-live/root-mobile-cold.png); live `F-1-6=true`. |
| F-1-7 | Visitor headings use “Caption checker in your browser,” with no preflight/desk jargon. | Test `F-V3-7 keeps the copy audit aligned…`; [root screenshot](evidence/polish-4-live/root-mobile-cold.png); live `F-1-7=true`. |
| F-1-8 | The section is named “How it works” and “Check a caption file in three steps.” | Test `F-V3-7 keeps the copy audit aligned…`; [root screenshot](evidence/polish-4-live/root-mobile-cold.png); live `F-1-8=true`. |
| F-1-9 | Art and 404 copy use direct language, with a working Return home link. | Tests `unknown routes render the product 404 page` and the release 404 contract; [root screenshot](evidence/polish-4-live/root-mobile-cold.png); live unknown URL returned 404 and `F-1-9=true`. |
| F-1-10 | README keeps browser, TypeScript, and deployment wording plain. | Test `F-V3-7 keeps the copy audit aligned…`; [root screenshot](evidence/polish-4-live/root-mobile-cold.png); source and live copy audit contain no old jargon. |
| F-1-11 | Product-derived 1200×630 social metadata and 180px Apple icon remain shipped. | Test `ships share metadata and an Apple touch icon…`; [root screenshot](evidence/polish-4-live/root-mobile-cold.png); live assets returned 200 and `F-1-11=true`. |
| F-1-12 | The Param Factory footer link visibly says it is external. | Test `real routes set their own titles…`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live label/URL and external 200 check `F-1-12=true`. |
| F-2-1 | TTML parsing continues to use XML local names for prefixed elements. | Tests `F-2-1 reads namespace-prefixed…`, `@claim:caption-formats`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live prefixed fixture `F-2-1=true`. |
| F-4-1 | Removed “Platform support changes” and “Platform rules change” from the app, README, and copy audit; retained final-upload guidance. | Tests `F-4-1 keeps final-upload guidance…` and `F-4-1 keeps only practical…`; [root screenshot](evidence/polish-4-live/root-mobile-cold.png); live old-copy count 0, guidance count 2, `F-4-1=true`. |
| F-V3-1 | Malformed SRT cues remain errors and cannot report ready. | Unit/browser tests named `F-V3-1…`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live malformed fixture `F-V3-1=true`. |
| F-V3-2 | The selected HTML profile still requires WebVTT. | Tests `F-V3-2…`, `@claim:platform-review-findings`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live SRT/HTML check `F-V3-2=true`. |
| F-V3-3 | Offset-time TTML and visible speaker names remain supported. | Unit test `F-V3-3…`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live offset TTML check `F-V3-3=true`. |
| F-V3-4 | Three native-radio preview styles retain their tested contrast colors. | Test `@claim:accessible-preview-styles`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live computed-color check `F-V3-4=true`. |
| F-V3-5 | Platform, report, file, forward-route, and Back focus remain useful and visible. | Tests `F-V3-5…` and `keyboard focus is visible…`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live focus check `F-V3-5=true`. |
| F-V3-6 | Non-positive cue durations never produce reading-speed output. | Unit test `F-V3-6…`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live reversed-time check `F-V3-6=true`. |
| F-V3-7 | Copy audit includes landing, empty, error, report, and README language. | Release test `F-V3-7 keeps the copy audit aligned…`; [root screenshot](evidence/polish-4-live/root-mobile-cold.png); live copy checks pass. |
| F-V4-1 | Unsubmitted input survives profile rerender; real input survives refresh. | Test `F-V4-1 preserves an unsubmitted…` and `@claim:real-session-refresh`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live `F-V4-1=true`. |
| F-V4-2 | Unsupported WebVTT tags remain a visible local error. | Unit/browser tests named `F-V4-2…`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live `F-V4-2=true`. |
| F-V4-3 | Timed TTML with `begin` plus `dur` remains accepted. | Unit/browser tests named `F-V4-3…`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live `F-V4-3=true`. |
| F-V4-4 | Named and numeric character references decode in cue previews. | Unit/browser tests named `F-V4-4…`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live preview check `F-V4-4=true`. |
| F-V4-5 | Both profiles retain dated, working guidance links. | Test `@claim:platform-rules-reviewed`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live source/link check `F-V4-5=true`, both external URLs 200. |
| F-V4-6 | Service-worker work remains deferred, versioned, network-first online, and offline-capable. | Tests `F-V4-6 defers…`, `an online navigation ignores a stale…`, `@claim:offline-reload`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); live stale-shell and offline checks `F-V4-6=true`. |
| F-V5-1 | Unsupported/styled SRT and referenced TTML style/placement fixtures never report ready. | Test `F-V5-1 never reports ready…`, `@claim:caption-formats`; [demo screenshot](evidence/polish-4-live/demo-desktop-cold.png); four live fixtures `F-V5-1=true`. |
| F-V5-2 | Stable hero/social URLs revalidate instead of claiming immutable caching. | Test `F-V5-2 revalidates stable hero…`; [root screenshot](evidence/polish-4-live/root-mobile-cold.png); both live headers are `public, max-age=0, must-revalidate`, `F-V5-2=true`. |

The unnumbered earlier defects are also closed: editable demo/reset/exit,
update-safe caches, visible file focus, route focus, stale-preview removal, and
the real HTTP 404 all passed their named browser/release tests and the live
audit.

## Verification

- Fresh clone at `b57be7192c2a50a06712ef548e6aec1ea065aee2`:
  `npm ci` found zero vulnerabilities; every one of the 13 literal commands
  in `.factory/claims.json` passed individually.
- `npm test`: 36 Vitest unit/release tests and 38 Playwright browser tests
  passed. `npm run typecheck`, `npm run lint`, and the commit-stamped
  `npm run build` passed.
- Build: 9.38 KB JavaScript gzip, 3.13 KB CSS gzip, and `dist/` at the
  required static-web root.
- [Live audit](evidence/polish-4-live/live-audit.json): no failures; all public
  routes 200, unknown route 404, same-origin demo requests, isolated reset/exit,
  report export, offline reload, 200% text sizing, and every runtime finding
  above passed.
- Live Axe: zero violations on root, demo, privacy, terms, and 404 at both
  1440×900 and 390×844.
- [Worker verifier](evidence/polish-4-live/verify-url/verify.json): 784 ms cold
  load, one h1, `lang=en`, one main, complete image/button names, and zero
  console errors.
- [Lighthouse mobile](evidence/polish-4-live/lighthouse.json): Performance 99,
  Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, TBT 100 ms, CLS 0.

No finding is deferred.
