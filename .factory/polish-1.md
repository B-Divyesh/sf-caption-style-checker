# Polish round 1 — all review findings resolved

**Repair commit:** `d897449e1b02063f37a51078c33e6f8f8188df5b`  
**Deployment:** `4fecc662-fe00-415d-b1e9-2993ace43b8c`  
**Live URL:** https://caption-style-checker.sociobot.in

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced platform-behaviour wording with a local “Placement and markup review” profile. Its findings now say what this checker highlights for final-upload review. | `@claim:profile-review-findings`; cold live `/demo` check found the two review findings and no `YouTube` text. |
| F-1-2 | Listed the full checking scope in `caption-check-categories` and added an observable sample test for fast cues, long lines, styled text, placement, markup, and speakers. | `@claim:caption-check-categories`; live `/demo`; [demo report](/work/repo/.factory/evidence/live-d897449/demo-desktop.png). |
| F-1-3 | Reworded the guidance as the checker's 180-WPM threshold and added exact at-threshold/above-threshold coverage. | `@claim:reading-speed-threshold`. |
| F-1-4 | Added separate real-refresh and demo-memory claims/tests. Demo remains memory-only, does not touch the real key, and restores saved real text when exited. | `@claim:real-session-refresh`; `@claim:demo-memory-isolation`; cold live `/?demo=1` storage check. |
| F-1-5 | Kept the sample outcome in the primary action block and put content before art on mobile. | `mobile first screen keeps the sample outcome beside its primary action`; [live mobile screen](/work/repo/.factory/evidence/live-d897449/root-mobile.png). |
| F-1-6 | Changed every visitor-facing format list and parse error to “timed TTML.” | `@claim:caption-formats`; live `/demo`. |
| F-1-7 | Replaced “preflight” and “desk” with “Caption checker in your browser.” | cold live `/` text check; `.factory/copy-audit.md`. |
| F-1-8 | Renamed the section “How it works” and “Check a caption file in three steps.” | cold live `/` heading check; `.factory/copy-audit.md`. |
| F-1-9 | Replaced the art caption with “Review caption settings before upload” and the 404 copy with “This page does not exist.” | cold live `/` and `/not-a-real-page` checks; `/not-a-real-page` returned HTTP 404. |
| F-1-10 | Rewrote README wording to use “this browser,” “check TypeScript,” and plain deployment directions. | README review; `.factory/copy-audit.md`. |
| F-1-11 | Added a 1200×630 social JPEG derived from the original signal-desk art, Twitter/Open Graph metadata, an Apple touch icon, and manifest raster icon. | `ships share metadata and an Apple touch icon from product art`; live asset checks returned 200. |
| F-1-12 | Changed the visible footer label to “Built by Param Factory (external site).” | cold live footer check at `/demo`. |

## Verification summary

From a fresh clone at `d897449`, `npm ci` passed with zero vulnerabilities;
all 11 exact commands in `.factory/claims.json`, `npm test` (13 Vitest/release
and 23 Playwright tests), and `npm run build` passed. The live cold audit used
fresh browser contexts at 1440×900 and 390×844, reported zero console errors
before the expected 404 document load, and found zero serious or critical Axe
WCAG 2 A/AA violations. `verify-url.sh` output is in
`.factory/evidence/live-d897449/verify.json`.
