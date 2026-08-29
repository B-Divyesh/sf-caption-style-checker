# Adversarial first-read review 1 — FAIL

**Product:** Caption Style Checker
**Live URL:** https://caption-style-checker.sociobot.in
**Reviewed:** 2026-08-29 UTC
**Candidate reviewed:** 29b9efe692d1281cd2d70a6e83c7974376b1b875

## Verdict

**FAIL.** The checker is visually distinct, works in its sample sandbox, and passes every declared claim command. It cannot pass this review because several visitor-reliant statements have no matching claim entry and observable tagged test. The phone first screen also separates the primary action from its promised result, and there are copy and metadata findings below. A PASS requires zero findings.

## Cold first read

I opened the live root in fresh, storage-free Chromium contexts at 390×844 and 1440×900 before scrolling. In my own words: this checks a timed caption file before someone uploads a video lesson; it is for video educators; I should tap **“Try it with sample data.”** The headline, audience sentence, and button make those three answers clear. This is **not** a first-read blocking failure.

At 390 px the top screen showed the product art, headline, audience sentence, and primary button. The adjacent outcome text, “Loads a sample file and its warnings.”, started below the viewport; this is recorded as F-1-5.

## Findings

### Blocking

#### F-1-1 — platform-behavior claims are not listed or tested

- **Quote / location:** landing figure caption, “Check what a platform might flatten.”; demo report, “YouTube basic captions can flatten cue placement or alignment settings.” and “YouTube basic captions may remove v, i markup.”
- **Why this fails:** These are factual claims about a publishing platform, not merely descriptions of the UI. .factory/claims.json has no entry for them. @claim:sample-preflight only proves that the checker displays the warnings; it does not prove platform behavior. A first-time visitor may make an upload decision based on them.
- **Concrete fix:** Remove the platform-behavior assertions unless they can be verified against a reproducible platform fixture. Prefer a scoped, testable statement such as “This profile highlights placement and markup to review in your final upload,” then add a profile-review-findings claim whose tagged demo test asserts those displayed findings.

#### F-1-2 — advertised checking scope has no matching claim

- **Quote / location:** landing “Review speed, placement, tags, and speakers.”; README “It reports reading speed, long lines, speaker labels, styled text, placement cues, and markup a selected platform may flatten.”
- **Why this fails:** This is a concrete feature list. The current sample-preflight claim says only “Loads a sample file and its warnings” and its tagged test asserts speed, placement, and speaker findings, but not the advertised tag/markup and long-line coverage. The promise has no claim entry describing its full scope.
- **Concrete fix:** Add one accurately scoped claim, for example caption-check-categories, and a single tagged sample test that observes speed, placement, markup/tag, speaker, and long-line findings. Alternatively, reduce both sentences to the categories that the existing claim actually documents and tests.

#### F-1-3 — the 180-WPM guidance is an unlisted quantitative claim

- **Quote / location:** demo report, “Aim for 180 words per minute or less so viewers can read it.”
- **Why this fails:** A numeric threshold and its promised reading benefit are claims a visitor can rely on. No item in .factory/claims.json owns this sentence, and no @claim: test measures the 180-WPM threshold or the warning boundary.
- **Concrete fix:** Add a reading-speed-threshold claim and a tagged fixture that checks both sides of the exact 180-WPM boundary, or remove the number and use non-quantitative, clearly labelled guidance with a cited policy.

#### F-1-4 — saved-real-session and memory-only-demo promises are unlisted

- **Quote / location:** README, “Real mode saves only the current caption text in this browser to survive a refresh. Demo mode does not save it.”; Privacy, “Real mode saves only the current text in this browser so you can refresh safely. Demo mode saves nothing.”
- **Why this fails:** These are privacy and persistence promises. The existing local-caption-check test records request origins; it does not own either promise in claims.json. There is an untagged browser test covering much of this behavior, but the claims contract requires a listed claim and its one tagged observable test.
- **Concrete fix:** Add real-session-refresh and demo-memory-isolation claims. Their tests should start storage-free, prove real text survives a reload, prove direct /demo neither reads nor writes caption-source, and prove leaving demo restores rather than overwrites real text.

### Minor

#### F-1-5 — phone first screen hides the stated result of the primary action

- **Quote / location:** root hero, button “Try it with sample data” and helper “Loads a sample file and its warnings.”
- **Why this fails:** At 390×844, the button is visible at the bottom of the first screen while the helper starts below it. The first-screen contract says the action and what happens after it must be next to each other. A distracted phone visitor can see what to tap, but not the promised immediate outcome.
- **Concrete fix:** Keep the helper inside the visible button block on mobile, or rename the button to “Try sample and see warnings” and retain the helper above the fold.

#### F-1-6 — “TTML” overstates the supported format and is inconsistent

- **Quote / location:** root file control and empty state, “WebVTT, SRT, TTML”; README and claims.json, “timed TTML.”
- **Why this fails:** The parser explicitly requires timed p entries with begin and end; arbitrary TTML is not supported. A visitor who sees only “TTML” can reasonably expect a non-timed TTML file to work.
- **Concrete fix:** Use “timed TTML” everywhere a supported format is named, including the file control, empty state, error, and How it works step.

#### F-1-7 — “preflight” labels are unexplained jargon

- **Quote / location:** root hero eyebrow “Local caption preflight” and checker eyebrow “Local preflight desk.”
- **Why this fails:** “Preflight” and “desk” do not identify the task more clearly than the product name; the latter is decorative control-room lore. They make the section heading less useful out of context.
- **Concrete fix:** Replace both with “Caption checker in your browser,” or remove the duplicated eyebrow labels.

#### F-1-8 — the How-it-works section uses mood headings instead of section names

- **Quote / location:** root, “A short preflight” and “Catch meaning before publishing.”
- **Why this fails:** Neither heading tells a screen-reader or scanning visitor that the section contains the three checker steps. “Catch meaning” is a slogan, not a section name.
- **Concrete fix:** Use eyebrow “How it works” and heading “Check a caption file in three steps.”

#### F-1-9 — two phrases are vague or metaphorical rather than usable copy

- **Quote / location:** root art caption, “Check what a platform might flatten.”; /not-a-real-page, “That signal did not reach the checker.”
- **Why this fails:** “Flatten” does not say which caption features are at risk, and the 404 metaphor does not state what happened. Neither helps a visitor take the next action.
- **Concrete fix:** Use “Review caption settings before upload.” and “This page does not exist.” respectively. Keep the 404’s existing “Return home” action.

#### F-1-10 — README uses inconsistent and needlessly technical wording

- **Quote / location:** README “Caption text is processed on-device.”, “Use npm run lint and npm run typecheck for static checks.”, “create the deployable dist/ directory.”, and “SPA navigation fallback.”
- **Why this fails:** “On-device” conflicts with the visitor-facing “in this browser”; “static checks,” “deployable,” and “SPA navigation fallback” add jargon without explaining the action.
- **Concrete fix:** Write “Caption text stays in this browser.”; “Use … to check TypeScript.”; “create the dist/ directory for deployment.”; and “Deploy dist/ to a host that serves the app at /demo, /privacy, and /terms.”

#### F-1-11 — required share/device metadata is incomplete

- **Quote / location:** index.html and 404.html set og:image to the square signal-desk.webp; the live hero markup declares it 1024×1024. Neither document has an apple-touch-icon link, and the manifest has only an SVG icon.
- **Why this fails:** The site-structure contract requires a real 1200×630 Open Graph/Twitter image derived from product art and a 180-pixel Apple touch icon. Link previews and saved iOS shortcuts do not receive those required assets.
- **Concrete fix:** Create an original 1200×630 crop/composition from the existing art, use it for og:image and twitter:image, add a self-hosted 180×180 PNG Apple touch icon, and list raster icons in the manifest.

#### F-1-12 — the external footer link does not say that it leaves the site

- **Quote / location:** footer link “Built by Param Factory” points to https://sociobot.in.
- **Why this fails:** rel="external" is not visible or announced as a destination change. The site-structure contract requires external links to say so.
- **Concrete fix:** Use visible text such as “Built by Param Factory (external site)” or an accessible suffix that says “opens external site.”

## Copy audit

The tables enumerate all visible landing strings, including headings, labels, and controls, and every prose sentence in the README. Word counts treat a slash-delimited command or route as one token. No entry exceeds 22 words. The flagged wording is covered by F-1-1 through F-1-10 above.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to checker | 3 |
| CAPTION//CHECK | 1 |
| Demo | 1 |
| Checker | 1 |
| Privacy | 1 |
| Local caption preflight | 3 |
| Check captions before upload | 4 |
| For video educators who need speaker cues and readable meaning to survive publishing. | 13 |
| Try it with sample data | 5 |
| Loads a sample file and its warnings. | 7 |
| Files stay in this browser. | 5 |
| Works offline after one visit. | 5 |
| Free to use. | 3 |
| Check what a platform might flatten. | 6 |
| Local preflight desk | 3 |
| Check a caption file | 4 |
| Platform profile | 2 |
| YouTube basic captions | 3 |
| WebVTT player | 2 |
| Plain-text export | 2 |
| Choose a caption file | 4 |
| or drop it here · WebVTT, SRT, TTML | 7 |
| Caption text | 2 |
| Check captions | 2 |
| Clear | 1 |
| No caption file loaded | 4 |
| Drop a WebVTT, SRT, or TTML file. | 7 |
| Your checks will appear here. | 5 |
| You can also paste caption text below. | 7 |
| A short preflight | 3 |
| Catch meaning before publishing | 4 |
| Load | 1 |
| Choose | 1 |
| Fix | 1 |
| Select the platform profile you need. | 6 |
| Review speed, placement, tags, and speakers. | 6 |
| What this checker does not do | 6 |
| It does not upload captions, host video, translate speech, or promise a platform will keep every feature. | 17 |
| Platform support changes. | 3 |
| Caption checks for people publishing video lessons. | 7 |
| Terms | 1 |
| Built by Param Factory | 4 |
| v1.0.1 · generated art noted in design docs | 7 |

### README

| Copy | Words |
| --- | ---: |
| Caption Style Checker | 3 |
| Check caption files before upload. | 5 |
| Caption Style Checker is for independent video educators and accessibility reviewers. | 11 |
| It reads WebVTT, SRT, and timed TTML in the browser. | 10 |
| It reports reading speed, long lines, speaker labels, styled text, placement cues, and markup a selected platform may flatten. | 19 |
| Try the isolated sample at /demo. | 6 |
| It loads a short lesson intro and its warnings. | 9 |
| Sample edits stay in memory and are discarded when real mode starts. | 12 |
| Run it | 2 |
| Open the local URL that Vite prints. | 7 |
| Use npm test for parser and browser tests. | 8 |
| Use npm run lint and npm run typecheck for static checks. | 11 |
| Use npm run build to create the deployable dist/ directory. | 10 |
| Privacy and scope | 3 |
| Caption text is processed on-device. | 5 |
| Real mode saves only the current caption text in this browser to survive a refresh. | 15 |
| Demo mode does not save it. | 6 |
| The app does not upload files, host video, translate speech, or guarantee changing platform behavior. | 15 |
| See /privacy and /terms in the app. | 7 |
| Deploy | 1 |
| Deploy the contents of dist/ to a static host with SPA navigation fallback. | 13 |
| public/staticwebapp.config.json is provided for Azure Static Web Apps. | 8 |
| License | 1 |
| MIT | 1 |

## Demo and privacy verification

**Passes.** A fresh live root session entered /demo in one click. The first demo screen already displayed the three-cue lesson sample and nine visible findings. The persistent status banner read “Demo — sample data, nothing is saved,” with **Reset demo** and **Start for real**.

In a session seeded with a saved real caption, direct /demo did not read caption-source; an edited sample stayed editable after **Check captions**; **Reset demo** restored the shipped WebVTT; and **Start for real** restored the saved real caption without retaining the demo edit. The live demo’s request log contained only https://caption-style-checker.sociobot.in. After the first visit and service-worker control, /demo reloaded offline with “Check sample captions.”

The implementation behavior passes these checks; F-1-4 concerns the missing claims inventory and tagged tests for public persistence statements, not a reproduced sandbox leak.

## Declared claims

Read .factory/claims.json first, then cloned the candidate into a fresh temp directory, ran npm ci, and ran each exact command. All six passed.

| Claim id | Exact command | Result |
| --- | --- | --- |
| sample-preflight | npm run test:browser -- --grep @claim:sample-preflight | pass (1) |
| local-caption-check | npm run test:browser -- --grep @claim:local-caption-check | pass (1) |
| offline-reload | npm run test:browser -- --grep @claim:offline-reload | pass (1) |
| free-to-use | npm run test:browser -- --grep @claim:free-to-use | pass (1) |
| caption-formats | npm run test:browser -- --grep @claim:caption-formats | pass (1) |
| report-export | npm run test:browser -- --grep @claim:report-export | pass (1) |

Passing listed commands does not close F-1-1 through F-1-4: those are additional claim-like statements with no corresponding inventory item.

## Earlier-review regression check

There are no earlier .factory/review-*.md or .factory/polish-*.md files. I read both prior independent verification reports and the prior handoff. Each reported defect was rechecked on the live site and in source:

| Earlier finding | Verification in this review |
| --- | --- |
| Timed TTML falsely triggers placement warning | Fixed: live timing-only fixture rendered TTML · 1 CUES · 3 SEC with zero “Placement may be lost” findings; src/lint.ts separates timing and layout attributes. |
| Demo cannot be edited or leaks into real mode | Fixed: live edit, reset, direct-demo storage isolation, and leave-demo restoration all passed. |
| Format/export promises absent from claims | Fixed: caption-formats and report-export are present and their exact commands passed. |
| Service-worker cache is not update-safe | Fixed in source: version comes from the worker query parameter, old caption-check- caches are deleted, and navigation is network-first; live cache was versioned caption-check-1787978691958. |
| File-picker focus and route focus are missing | Fixed: live keyboard navigation focused the file control’s visible drop-zone outline; link navigation and browser Back both focused the new H1. |
| Stale preview after clear/error | Fixed: live Clear removed “Read it in context”; the error path is covered by the passing browser suite. |
| Unknown route returns 200 | Fixed: live /not-a-real-page returned HTTP 404 with the designed product page. |

No prior finding was carried forward under an earlier id because the previous reports did not assign F-* identifiers, and none reproduced.

## Structure, accessibility, and product checks

- The live root, demo, privacy, and terms routes returned 200; the unknown route returned 404. Internal links and the external Param Factory destination returned 200. The consistent header/footer, skip link, Privacy/Terms links, sitemap, robots file, favicon, CSP, nosniff, and referrer policy were present.
- Root, /demo, /privacy, /terms, and 404 each had one H1, a main landmark, an updated title, and a canonical URL after navigation. Deep links, navigation, browser Back, and heading focus worked. The expected document 404 request emitted a browser resource error and was excluded from normal-flow console evidence.
- Live Axe WCAG 2 A/AA scans at 1440×900 and 390×844 had zero violations. There were no console/page errors in root or demo flows. Mobile had no horizontal overflow. Reduced-motion, touch-target, and keyboard checks are also covered by the passing 17-browser-test local suite.
- npm test passed (12 Vitest + 17 Playwright tests) from the clean clone. npm run build passed and produced dist/; production JavaScript was 6,312 B gzip, CSS 2,856 B gzip, and the original hero asset 35,104 B.
- The pixel/demoscene signal-desk visual system is product-specific and agrees with .factory/design.md; it is not a generic SaaS template. The original art provenance is documented. No extra AI feature is expected: caption preflight has an adequate non-AI workflow, file import, and report export, and adding AI would be decorative.

## What would make this perfect

Make every factual promise testable or remove it, especially platform-specific warnings, numeric reading guidance, and storage behavior. Then make the sample outcome visible beside the mobile primary action, use one precise name for timed TTML and browser-local processing, replace the mood/jargon headings, and supply the required social and Apple icon assets. Re-run this entire review against the deployed result with no findings remaining.
