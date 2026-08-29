# Polish round 2 — cumulative review closure

**Repair commit:** pending deployment commit  
**Live URL:** https://caption-style-checker.sociobot.in  
**Scope:** `.factory/review-1.md`, `.factory/review-2.md`, and every earlier
`.factory/review-*.md` / `.factory/polish-*.md` finding.

## Current repair

`F-2-1` is repaired by parsing TTML elements using their XML local names. The
parser now accepts standard `tt:`-prefixed timed TTML, while preserving the
existing unprefixed document, timing, semantic-style, and platform checks.
`tests/fixtures/prefixed-timed.ttml` is included in the one tagged public
format claim test, so a future regression cannot retain the timed-TTML claim.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced platform-behavior promises with local review findings. | `@claim:platform-review-findings`; `/demo` live check. |
| F-1-2 | Added and tested the complete advertised check categories. | `@claim:caption-check-categories`. |
| F-1-3 | Listed the 180-WPM threshold and tested 180/186 boundaries. | `@claim:reading-speed-threshold`. |
| F-1-4 | Separated real refresh and memory-only demo claims/tests. | `@claim:real-session-refresh`, `@claim:demo-memory-isolation`. |
| F-1-5 | Kept the sample outcome with the mobile primary action. | `mobile first screen keeps the sample outcome beside its primary action`; live mobile screenshot. |
| F-1-6 | Uses “timed TTML” in every format list and error. | `@claim:caption-formats`. |
| F-1-7 | Replaced preflight/desk jargon with task labels. | `.factory/copy-audit.md`; cold root check. |
| F-1-8 | Named the three-step section plainly. | `.factory/copy-audit.md`; cold root check. |
| F-1-9 | Rewrote platform/404 metaphors as direct instructions. | `/not-a-real-page` 404 check; copy audit. |
| F-1-10 | Rewrote README privacy, build, and deployment wording. | README copy audit. |
| F-1-11 | Ships social image, Twitter tags, touch icon, and manifest icon. | `release contracts › ships share metadata…`; live asset checks. |
| F-1-12 | Labels the Param Factory destination as external. | live footer check. |
| F-V3-1 | Reports malformed cues and invalid timestamp fields. | `F-V3-1 malformed SRT cues…`. |
| F-V3-2 | Applies named selected publishing-platform rules. | `@claim:platform-review-findings`. |
| F-V3-3 | Supports offset-time TTML and detects visible speaker text. | `F-V3-3 reads TTML offset times…`. |
| F-V3-4 | Provides three selectable high-contrast previews. | `@claim:accessible-preview-styles`. |
| F-V3-5 | Retains focus on platform changes and moves check focus to report. | `F-V3-5 keyboard platform changes…`. |
| F-V3-6 | Omits speed calculations for non-positive durations. | `F-V3-6 does not calculate reading speed…`. |
| F-V3-7 | Regenerated complete landing/result copy audit. | `release contracts › F-V3-7…`. |
| F-V4-1 | Saves paste input before platform rerender and refresh. | `F-V4-1 preserves an unsubmitted pasted caption…`; `@claim:real-session-refresh`. |
| F-V4-2 | Reports unsupported WebVTT markup. | `F-V4-2 reports unsupported WebVTT tags…`. |
| F-V4-3 | Supports `begin` plus `dur` TTML timing. | `F-V4-3 accepts timed TTML begin plus dur`. |
| F-V4-4 | Decodes named and numeric character references. | `F-V4-4 decodes character references…`. |
| F-V4-5 | Lists/tests dated guidance source claim. | `@claim:platform-rules-reviewed`. |
| F-V4-6 | Defers service-worker cache work and meets performance budget. | `release contracts › F-V4-6…`; build size evidence. |
| F-V5-1 | Checks SRT and TTML semantic markup/style/placement. | `F-V5-1 never reports ready…`; `@claim:caption-formats`. |
| F-V5-2 | Revalidates stable hero/social assets instead of caching immutable. | `release contracts › F-V5-2…`; live header check. |
| F-2-1 | Parses standard namespace-prefixed TTML elements and adds the reviewed fixture to the public format claim. | `F-2-1 reads namespace-prefixed timed TTML elements`; `@claim:caption-formats`; live `/demo` prefixed fixture check. |

## Evidence locations

- Local production build and test output: current work-order terminal logs.
- Post-deploy URL verifier and desktop/mobile screenshots:
  `.factory/evidence/polish-2-live/`.
- Post-deploy browser audit screenshot: `.factory/evidence/polish-2-live/prefixed-ttml-demo.png`.

No finding is deferred or marked minor for later work.
