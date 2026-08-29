# Caption Style Checker — polish round 5

**Product repair commit:** `255ef2fade43a890bfc5bb58ed7795ecb9f00247`

**Deployment:** `a767047f-b742-464c-a836-c1c2f27970dd`

**Live URL:** <https://caption-style-checker.sociobot.in>

This pass read every `.factory/review-*.md` and `.factory/polish-*.md`. The
table maps every numbered finding to its retained or new repair and to current
test plus cold-production evidence. `live-audit.json` records every referenced
live finding as `true` and has an empty `failures` array.

## Finding map

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Report and export copy describe local checks only; they make no platform-rendering assertion. | Tests `F-1-1 keeps platform findings scoped…`, `@claim:platform-review-findings`, `@claim:report-export`; live `historicalFindings.F-1-1=true`. |
| F-1-2 | The sample covers speed, line length, styles, placement, markup, and speakers. | `@claim:caption-check-categories`; [cold demo](evidence/polish-5-live/demo-desktop-cold.png); live `F-1-2=true`. |
| F-1-3 | The visible 180-WPM checker threshold has exact 180/186 boundary coverage. | `@claim:reading-speed-threshold`; live `F-1-3=true`. |
| F-1-4 | Real refresh storage remains separate from memory-only demo state. | `@claim:real-session-refresh`, `@claim:demo-memory-isolation`; live reset, exit, reload, request, and seeded-storage checks `F-1-4=true`. |
| F-1-5 | Mobile keeps the action and its stated result on the first screen. | Browser test `mobile first screen keeps the sample outcome…`; [390 px cold root](evidence/polish-5-live/root-mobile-cold.png); bottoms 276/370/440/489 px in an 844 px viewport. |
| F-1-6 | Every visitor-facing format list says “timed TTML.” | `@claim:caption-formats`; live `F-1-6=true`. |
| F-1-7 | Visitor copy uses task language, with no “preflight” or “desk” jargon. | Release test `F-V3-7 keeps the copy audit aligned…`; `.factory/copy-audit.md`; live `F-1-7=true`. |
| F-1-8 | The section is named “How it works” and “Check a caption file in three steps.” | Copy-audit release test; [cold root](evidence/polish-5-live/root-mobile-cold.png); live `F-1-8=true`. |
| F-1-9 | Art and 404 copy use direct language and the 404 offers a return-home link. | Tests `unknown routes render the product 404 page` and the release 404 contract; cold unknown URL returned 404; live `F-1-9=true`. |
| F-1-10 | README retains plain browser, TypeScript, and deployment wording. | Release copy-audit test; `.factory/copy-audit.md`. |
| F-1-11 | Product-derived 1200×630 social metadata and the 180 px Apple icon remain shipped. | Test `ships share metadata and an Apple touch icon…`; live assets returned 200; `F-1-11=true`. |
| F-1-12 | The Param Factory footer link visibly identifies an external site. | Test `real routes set their own titles…`; cold external link returned 200; live `F-1-12=true`. |
| F-2-1 | TTML parsing continues to use XML local names for namespace-prefixed elements. | Tests `F-2-1 reads namespace-prefixed…`, `@claim:caption-formats`; cold prefixed fixture passed; live `F-2-1=true`. |
| F-4-1 | Platform-change assertions remain absent while useful final-upload guidance remains. | Tests `F-4-1 keeps final-upload guidance…` and `F-4-1 keeps only practical…`; live old-copy count 0, guidance count 2, `F-4-1=true`. |
| F-5-1 | Replaced the non-limitation with explicit boundaries: no upload, video editing, speech translation, or published-result prediction. Added a listed scope claim. | New `@claim:scope-limitations`; live exact-copy plus GET-only network-boundary check `F-5-1=true`; [cold root](evidence/polish-5-live/root-mobile-cold.png). |
| F-5-2 | Renamed every skip link “Skip to main content” and made activation focus and scroll the main landmark. | Browser test `F-5-2 skip links name and focus the main content…`; cold live Tab/Enter focus check `F-5-2=true`; Axe matrix 0 violations. |
| F-5-3 | Renamed “Clear” to “Clear caption text”; clear still empties the input, focuses it, and supports Undo. | Browser test `clearing caption text is reversible…`; cold live clear/undo/focus check `F-5-3=true`. |
| F-5-4 | Removed the internal “generated art noted in design docs” note; the footer now shows only `v1.1.0`. | Release test `F-5 release copy removes…`; cold root/footer check `F-5-4=true`. |
| F-V3-1 | Malformed SRT cues and invalid timestamps remain errors and cannot report ready. | Unit/browser tests named `F-V3-1…`; live malformed fixture `F-V3-1=true`. |
| F-V3-2 | The selected HTML profile still requires WebVTT. | Test `F-V3-2…`, `@claim:platform-review-findings`; live `F-V3-2=true`. |
| F-V3-3 | Offset-time TTML and visible speaker names remain supported. | Unit test `F-V3-3…`; live `F-V3-3=true`. |
| F-V3-4 | Three native-radio preview styles retain their tested contrast colors. | `@claim:accessible-preview-styles`; live computed-color check `F-V3-4=true`. |
| F-V3-5 | Platform, report, file, route, Back, and skip-link focus remain useful and visible. | Tests `F-V3-5…`, `keyboard focus is visible…`, and the new F-5-2 test; live `F-V3-5=true`. |
| F-V3-6 | Non-positive cue durations never produce reading-speed output. | Unit test `F-V3-6…`; live reversed-time check `F-V3-6=true`. |
| F-V3-7 | Copy audit covers landing, empty, error, report, limitations, controls, and README language. | Release test `F-V3-7 keeps the copy audit aligned…`; `.factory/copy-audit.md`. |
| F-V4-1 | Unsubmitted input survives profile rerender; real input survives refresh. | Test `F-V4-1 preserves an unsubmitted…`, `@claim:real-session-refresh`; live `F-V4-1=true`. |
| F-V4-2 | Unsupported WebVTT tags remain a visible local checker error. | Unit/browser tests named `F-V4-2…`; live `F-V4-2=true`. |
| F-V4-3 | Timed TTML using `begin` plus `dur` remains accepted. | Unit/browser tests named `F-V4-3…`; live `F-V4-3=true`. |
| F-V4-4 | Named and numeric character references decode in cue previews. | Unit/browser tests named `F-V4-4…`; live `F-V4-4=true`. |
| F-V4-5 | Both profiles retain dated, working guidance links. | `@claim:platform-rules-reviewed`; all cold external links returned 200; live `F-V4-5=true`. |
| F-V4-6 | Service-worker work remains deferred, versioned, network-first online, and offline-capable. | Tests `F-V4-6 defers…`, `an online navigation ignores a stale…`, `@claim:offline-reload`; cold offline reload passed; live `F-V4-6=true`. |
| F-V5-1 | Unsupported/styled SRT and referenced TTML style/placement fixtures never report ready. | Test `F-V5-1 never reports ready…`, `@claim:caption-formats`; four cold live fixtures passed; `F-V5-1=true`. |
| F-V5-2 | Stable hero/social URLs revalidate instead of claiming immutable caching. | Test `F-V5-2 revalidates stable hero…`; cold headers are `public, max-age=0, must-revalidate`; live `F-V5-2=true`. |

## Verification

- Clean remote clone of `255ef2fade43a890bfc5bb58ed7795ecb9f00247`: all 14 literal claim commands passed.
- `npm test`: 37 Vitest/release tests and 40 Playwright tests passed.
- `npm run typecheck`, `npm run lint`, and `npm run build`: passed; `dist/` produced.
- Cold live route/title/metadata/link/404/demo/privacy/offline/text-resize checks: passed.
- Axe: 0 violations on five routes at desktop and mobile sizes (10 scans).
- Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.1 s, TBT 0 ms, CLS 0.
- Worker URL verifier: no console or page errors.

Full machine-readable evidence is in
[`evidence/polish-5-live/live-audit.json`](evidence/polish-5-live/live-audit.json),
[`evidence/polish-5-live/lighthouse.json`](evidence/polish-5-live/lighthouse.json),
and [`evidence/polish-5-live/verify-url/verify.json`](evidence/polish-5-live/verify-url/verify.json).
