# Polish round 3 — cumulative review closure

**Repair commit:** `7989f1cca76476cf85fa4b92b2ee1452ab8f399e`
**Deployment:** `20a3473c-45d2-49cc-9d19-cab2f74996a8`
**Live URL:** https://caption-style-checker.sociobot.in
**Reviewed scope:** every finding in `.factory/review-1.md`,
`.factory/review-2.md`, `.factory/review-3.md`, `.factory/polish-1.md`, and
`.factory/polish-2.md`.

## Finding map

| Finding | Change made | Automated evidence | Visual and cold-live evidence |
| --- | --- | --- | --- |
| F-1-1 | Removed claims about YouTube rendering, support, and lost meaning. Placement and markup findings now describe local detection and ask the visitor to check the final upload. Unsupported-tag messages describe only the checker’s supported markup. The exported report uses the same scoped copy. | `F-1-1 keeps platform findings scoped to observable local checks`; `@claim:sample-preflight`; `@claim:report-export`; `@claim:platform-review-findings` | `.factory/evidence/polish-3-live/demo-report.png`; `live-audit.json` records `scopedCopy`, `exportScoped`, and `unsupportedMarkupScoped`; the live report contains none of the three rejected phrases. |
| F-1-2 | Kept the full advertised category list aligned with visible speed, line, style, placement, markup, and speaker findings. | `@claim:caption-check-categories` | `.factory/evidence/polish-3-live/demo-report.png`; live sample shows every category. |
| F-1-3 | Kept the 180-WPM threshold listed and tested at 180 and 186 WPM. | `@claim:reading-speed-threshold` | `.factory/evidence/polish-3-live/historical-regressions.json`; live sample shows its measured reading-speed finding. |
| F-1-4 | Kept real-mode refresh storage separate from memory-only demo state; direct query demo neither reads nor changes `caption-source`. | `@claim:real-session-refresh`; `@claim:demo-memory-isolation` | `.factory/evidence/polish-3-live/live-audit.json` records no demo read/write and restored real text; `.factory/evidence/polish-3-live/demo-mobile.png`. |
| F-1-5 | Kept the action result directly below the mobile primary action. | `mobile first screen keeps the sample outcome beside its primary action` | `.factory/evidence/polish-3-live/root-mobile.png`; live outcome bottom was 488.56 px in an 844 px viewport. |
| F-1-6 | Uses “timed TTML” in every visitor-facing format list and parsing error. | `@claim:caption-formats` | `.factory/evidence/polish-3-live/demo-mobile.png`; cold live format matrix passed. |
| F-1-7 | Uses task language (“Caption checker in your browser”) instead of preflight/desk labels. | `F-V3-7 keeps the copy audit aligned…`; `.factory/copy-audit.md` | `.factory/evidence/polish-3-live/root-mobile.png`; cold live text search found no old labels. |
| F-1-8 | Names the section “How it works” and “Check a caption file in three steps.” | `.factory/copy-audit.md`; full browser suite | `.factory/evidence/polish-3-live/screenshot-desktop.png`; cold root check. |
| F-1-9 | Uses “Review caption settings before upload” and the direct 404 message “This page does not exist.” | `unknown routes render the product 404 page`; release 404 contract | `.factory/evidence/polish-3-live/404.png`; live unknown route returned HTTP 404. |
| F-1-10 | Keeps README wording in plain browser, TypeScript, and deployment language. | `.factory/copy-audit.md`; `F-V3-7 keeps the copy audit aligned…` | README and copy audit inspection at the repair commit. |
| F-1-11 | Keeps the product-derived 1200×630 social image, Twitter/Open Graph metadata, and 180 px touch icon. | `ships share metadata and an Apple touch icon from product art` | `.factory/evidence/polish-3-live/live-audit.json`; all metadata assets returned HTTP 200. |
| F-1-12 | Labels the footer destination “Built by Param Factory (external site).” | `real routes set their own titles, metadata, canonicals, and legal links` | `.factory/evidence/polish-3-live/demo-report.png`; external URL returned HTTP 200. |
| F-V3-1 | Malformed SRT cues and invalid minute/second fields remain visible errors and cannot produce “Ready to publish.” | `F-V3-1 reports a malformed cue…`; `F-V3-1 rejects invalid SRT…`; browser equivalent | `.factory/evidence/polish-3-live/historical-regressions.json` records `malformedSrt` and `invalidSeconds`; `.factory/evidence/polish-3-live/error-state.png`. |
| F-V3-2 | Applies the selected platform’s local format rule; an SRT file under HTML video track requires WebVTT. | `F-V3-2 applies the selected publishing platform format rules`; `@claim:platform-review-findings` | `historical-regressions.json` records `htmlProfile`; live platform switch passed. |
| F-V3-3 | Offset-time TTML parses and visible speaker text is detected. | `F-V3-3 reads TTML offset times and visible speaker labels` | `historical-regressions.json` records `offsetTtmlSpeaker`; cold live TTML result passed. |
| F-V3-4 | Keeps three native-radio, high-contrast cue preview styles. | `@claim:accessible-preview-styles` | `.factory/evidence/polish-3-live/demo-mobile.png`; `historical-regressions.json` records all computed color pairs passed. |
| F-V3-5 | Platform changes retain select focus; checking moves focus to the report. Route navigation and Back focus the new h1. | `F-V3-5 keyboard platform changes and checks retain a useful focus position`; `keyboard focus is visible…` | `historical-regressions.json` records `keyboardFocus`; `live-audit.json` records forward/back focus. |
| F-V3-6 | Suppresses reading-speed calculations for zero or reversed durations. | `F-V3-6 does not calculate reading speed for reversed timing` | `historical-regressions.json` records `reversedTimeNoSpeed`. |
| F-V3-7 | Regenerated the copy audit, including landing, empty/error, sample finding, unsupported markup, and README copy. | `F-V3-7 keeps the copy audit aligned…` | `.factory/copy-audit.md`; live screenshots under `.factory/evidence/polish-3-live/`. |
| F-V4-1 | Saves real input as it changes and preserves unsubmitted demo input when a profile rerenders. | `F-V4-1 preserves an unsubmitted pasted caption…`; `@claim:real-session-refresh` | `historical-regressions.json` records `unsubmittedPastePreserved` and `realRefresh`. |
| F-V4-2 | Unsupported WebVTT elements produce a local checker error. | `F-V4-2 rejects unsupported WebVTT tags…`; `F-V4-2 reports unsupported WebVTT tags…` | `live-audit.json` records `unsupportedMarkupScoped`; live output says the tag is outside supported checker markup. |
| F-V4-3 | Accepts TTML `begin` plus `dur`. | Unit and browser tests named `F-V4-3 accepts timed TTML begin plus dur` | `historical-regressions.json` records `ttmlDuration`. |
| F-V4-4 | Decodes named and numeric character references in preview text. | Unit and browser tests named `F-V4-4 decodes character references…` | `historical-regressions.json` records `entitiesDecoded`. |
| F-V4-5 | Keeps the dated source links for both platform choices. | `@claim:platform-rules-reviewed` | `historical-regressions.json` records both guidance links; both external URLs returned HTTP 200. |
| F-V4-6 | Defers service-worker registration until load, versions caches, refreshes navigation online, and stays far below the static budget. | `F-V4-6 defers service-worker cache work…`; `an online navigation ignores a stale cached shell` | `historical-regressions.json` records `staleShellIgnored`; `lighthouse.json` reports 8.8 KB transferred JS, 3.2 KB CSS, and 100 performance. |
| F-V5-1 | Keeps semantic checks for unsupported/styled SRT and referenced TTML color/placement. | `F-V5-1 never reports ready…`; corresponding unit tests; `@claim:caption-formats` | `.factory/evidence/polish-3-live/historical-semantic-check.png`; `historical-regressions.json` records all four live fixtures. |
| F-V5-2 | Revalidates the stable hero and social image URLs instead of marking them immutable. | `F-V5-2 revalidates stable hero and social image URLs` | Cold live headers returned `Cache-Control: public, max-age=0, must-revalidate` for both assets. |
| F-2-1 | Keeps local-name TTML parsing for standard namespace-prefixed `tt`, `body`, `div`, `p`, `span`, and `br` elements. | `F-2-1 reads namespace-prefixed timed TTML elements`; `@claim:caption-formats` | `live-audit.json` records `TTML · 1 cue · 3 sec` for the prefixed fixture; no parse error. |

## Earlier unnumbered regression checks

The earlier review also called out editable demo state, update-safe service-worker
caches, file-picker and route focus, stale previews after clear/error, and a
real HTTP 404. These remain closed through `@claim:demo-memory-isolation`,
`an online navigation ignores a stale cached shell`, `keyboard focus is
visible…`, `clear and parse errors remove the stale cue preview`, and the
release 404 contract. The corresponding live results are in
`live-audit.json`, `historical-regressions.json`, `error-state.png`, and
`404.png`.

## Verification

- Fresh clone at the repair commit: `npm ci` found zero vulnerabilities and all
  13 literal commands in `.factory/claims.json` passed individually.
- Work-order build command: `npm ci && npm test && npm run build` passed 31
  Vitest/release tests and 33 Playwright tests and produced `dist/`.
- Production size: JavaScript 23.45 KB raw / 8.70 KB gzip; CSS 10.33 KB raw /
  3.08 KB gzip.
- Worker URL verifier: `verify.json` reports title, `lang=en`, one h1, one main,
  complete image/button names, a 785 ms cold load, and zero console errors.
- Live Axe scans: zero total violations at 1440×900 and 390×844.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.0 s, TBT 80 ms, CLS 0.
- Every public route, metadata asset, internal legal link, and documented
  external link was checked live. Public routes returned 200 and the designed
  unknown route returned 404.

No finding is deferred.
