# Adversarial first-read review 5 — FAIL

**Product:** Caption Style Checker

**Live URL:** <https://caption-style-checker.sociobot.in>

**Reviewed:** 29 August 2026 UTC

**Repository candidate:** `d003f722b40d1671c683610cbee623bfeb333cc4`

## Verdict

**FAIL.** The product is clear, immediately tryable, honest about its local
scope, and functionally complete. All 13 declared claim commands pass from a
clean clone. The live demo is isolated, routing works, prior findings remain
fixed, and the accessibility scan reports no violations. Four minor copy and
navigation findings remain. The required standard is zero findings, so this
round cannot pass.

There are no blocking findings in this round.

## Cold first read

I opened the live root in new, storage-free Chromium contexts at **390×844**
and **1440×900** without scrolling or interacting.

In my own words: this checks caption files before upload; it is for video
educators who need readable captions and clear speaker cues; I should select
**“Try it with sample data.”** The action's result, **“Loads a sample file and
shows its warnings.”**, is directly below it. All three facts are also above
the fold at both sizes.

At 390 px, the headline, audience, action, outcome, and final fact ended at 276,
370, 440, 489, and 584 px respectively in an 844-px viewport. This is not a
first-read blocker.

The asymmetric signal-board layout, original pixel control-desk art,
timecode-like labels, square panels, and dark/mint/violet palette match
`.factory/design.md`. The page does not resemble a generic SaaS template.

## Findings

### Minor

#### F-5-1 — the limitations section names no limitation

- **Quote / location:** landing section heading **“What this checker does not
  do”** followed by **“It checks timed caption files in this browser. Review the
  final upload before publishing.”**
- **Why this fails:** The heading promises scope boundaries, but both sentences
  describe what the checker does or what the visitor should do. A first-time
  visitor still cannot tell whether the tool uploads captions, edits video,
  translates speech, or predicts the published result. This also leaves the
  required “What it does not do / privacy” section structurally incomplete.
- **Concrete fix:** State the actual limits, for example: **“It does not upload
  captions, edit video, translate speech, or predict the published result.”**
  Keep **“Review the final upload before publishing.”** as the next sentence.
  List and test any new visitor-reliant privacy assertion in `claims.json`.

#### F-5-2 — the skip link names the wrong destination

- **Quote / location:** the global skip link says **“Skip to checker”** but its
  target is `#main`. On `/`, `#main` starts at the hero rather than the checker;
  `/privacy`, `/terms`, and the 404 page contain no checker at all.
- **Why this fails:** Keyboard and screen-reader users are told that the link
  reaches a checker when it reaches only the route's main content. The wording
  is inaccurate on every non-checker route.
- **Concrete fix:** Rename it **“Skip to main content”** in both `index.html` and
  `404.html`. Keep `href="#main"`.

#### F-5-3 — “Clear” does not name what the button changes

- **Quote / location:** landing checker button **“Clear”**.
- **Why this fails:** The plain-words rule requires a button to use a verb that
  names its result. “Clear” leaves the target implicit, especially when controls
  are encountered out of visual context.
- **Concrete fix:** Rename it **“Clear caption text.”** Keep the existing undo
  notice and focus behavior.

#### F-5-4 — the footer exposes an internal documentation note

- **Quote / location:** landing footer, **“v1.1.0 · generated art noted in
  design docs”**.
- **Why this fails:** The version is useful and required, but the design-doc
  fragment gives a visitor no action or product information. The deployed site
  does not link to those documents. It reads as an internal handoff note.
- **Concrete fix:** Show only **“v1.1.0”** or a real version/build identifier.
  Keep asset provenance in `.factory/design.md`.

## Copy audit

Counts use whitespace-delimited words and ignore the standalone decorative
middle dot. The tables include headings, labels, controls, image alternative
text, and prose so that non-sentence copy is also checked. No item exceeds 22
words. No banned marketing adjective, jargon slogan, or mood heading appears.
The four flagged items map to F-5-1 through F-5-4.

### Landing page

| Copy | Words | Review |
| --- | ---: | --- |
| Skip to checker | 3 | F-5-2 |
| CAPTION//CHECK | 1 | pass: wordmark |
| Demo | 1 | pass: navigation |
| Checker | 1 | pass: navigation |
| Privacy | 1 | pass: navigation |
| Caption checker in your browser | 5 | pass |
| Check captions before upload | 4 | pass |
| For video educators who need readable captions and clear speaker cues before publishing. | 13 | pass |
| Try it with sample data | 5 | pass |
| Loads a sample file and shows its warnings. | 8 | listed claim: `sample-preflight` |
| Caption text stays in this browser. | 6 | listed claim: `local-caption-check` |
| Works offline after one visit. | 5 | listed claim: `offline-reload` |
| Free to use. | 3 | listed claim: `free-to-use` |
| Pixel-art caption timing monitor on a compact control desk. | 9 | pass: image alternative text |
| Review caption settings before upload. | 5 | pass |
| Check a caption file | 4 | pass |
| Publishing platform | 2 | pass |
| YouTube upload | 2 | pass |
| HTML video track | 3 | pass |
| Rules reviewed 29 August 2026. | 5 | listed claim: `platform-rules-reviewed` |
| Review the final upload before publishing. | 6 | pass: instruction |
| Check YouTube upload format guidance (external site). | 7 | pass |
| Choose a caption file | 4 | pass |
| or drop it here · WebVTT, SRT, timed TTML | 8 | listed claim: `caption-formats` |
| Caption text | 2 | pass |
| Paste a caption file here | 5 | pass |
| Check captions | 2 | pass: result-naming button |
| Clear | 1 | F-5-3 |
| No caption file loaded | 4 | pass |
| Drop a WebVTT, SRT, or timed TTML file | 8 | listed claim: `caption-formats` |
| Your checks will appear here. | 5 | pass |
| You can also paste caption text below. | 7 | pass |
| How it works | 3 | pass |
| Check a caption file in three steps | 7 | pass |
| Load | 1 | pass: step heading |
| Drop a WebVTT, SRT, or timed TTML file. | 8 | listed claim: `caption-formats` |
| Choose | 1 | pass: step heading |
| Select the publishing platform you need. | 6 | pass |
| Fix | 1 | pass: step heading |
| Review fast cues, long lines, markup, placement, and speakers. | 9 | listed claim: `caption-check-categories` |
| What this checker does not do | 6 | F-5-1 |
| It checks timed caption files in this browser. | 8 | F-5-1; listed scope: `caption-formats` |
| Review the final upload before publishing. | 6 | F-5-1 context; instruction |
| Caption checks for people publishing video lessons. | 7 | pass |
| Terms | 1 | pass: navigation |
| Built by Param Factory (external site) | 6 | pass |
| v1.1.0 · generated art noted in design docs | 7 | F-5-4 |

### README

| Copy | Words | Review |
| --- | ---: | --- |
| Caption Style Checker | 3 | pass: title |
| Check caption files before upload. | 5 | pass |
| Caption Style Checker is for independent video educators and accessibility reviewers. | 11 | pass |
| It reads WebVTT, SRT, and timed TTML in this browser. | 10 | listed claim: `caption-formats` |
| It checks fast cues, long lines, styled text, placement settings, markup, and speaker cues. | 14 | listed claim: `caption-check-categories` |
| It shows local checks for the selected publishing platform. | 9 | listed claim: `platform-review-findings` |
| It also compares cues in three high-contrast preview styles. | 9 | listed claim: `accessible-preview-styles` |
| Try the isolated sample at `/?demo=1`. | 6 | pass |
| It loads a short lesson intro and shows its warnings. | 10 | listed claim: `sample-preflight` |
| Sample edits stay only in memory and are discarded when real mode starts. | 13 | listed claim: `demo-memory-isolation` |
| Run it | 2 | pass: section heading |
| Open the local URL that Vite prints. | 7 | pass |
| Use `npm test` for parser and browser tests. | 8 | pass |
| Use `npm run lint` and `npm run typecheck` to check TypeScript. | 11 | pass |
| Use `npm run build` to create the `dist/` directory for deployment. | 11 | pass |
| Privacy and scope | 3 | pass: section heading |
| Caption text stays in this browser. | 6 | listed claim: `local-caption-check` |
| Real mode saves the current caption text in this browser for refresh. | 12 | listed claim: `real-session-refresh` |
| Demo mode keeps its sample text only in memory. | 9 | listed claim: `demo-memory-isolation` |
| See `/privacy` and `/terms` in the app. | 7 | pass |
| Platform rules were reviewed on 29 August 2026 against the linked YouTube caption formats and WebVTT format guidance. | 18 | listed claim: `platform-rules-reviewed` |
| Review the final upload before publishing. | 6 | pass: instruction |
| Deploy | 1 | pass: section heading |
| Deploy `dist/` to a host that serves the app at `/demo`, `/privacy`, and `/terms`. | 14 | pass |
| `public/staticwebapp.config.json` is provided for Azure Static Web Apps. | 8 | pass |
| License | 1 | pass: section heading |
| MIT | 1 | pass: license identifier |

Terminology is otherwise consistent: **caption file** names the input,
**cue** names a timed unit, **publishing platform** names the selected rule set,
**finding** names a result, and **sample** names the isolated demo data.

## Demo, sandbox, and privacy

**Pass.** From a fresh root context, one selection of **“Try it with sample
data”** opened `/?demo=1`. The first demo screen already showed a realistic
three-cue lesson, its caption text, an eight-warning summary with eleven visible
findings, and a cue preview. The persistent banner read **“Demo — sample data,
nothing is saved”** and included **Reset demo** and **Start for real**.

I seeded real storage before direct demo entry. Demo mode did not read or change
the real `caption-source` value. Editing and checking the sample worked. Reset
restored the shipped `WEBVTT` sample. Starting real mode restored the seeded
real caption, which survived reload. The live request log contained only
`https://caption-style-checker.sociobot.in`. After the first visit and service
worker control, the demo reloaded offline.

## Declared claims

I cloned the supplied candidate into a new temporary directory, ran `npm ci`,
then ran every literal command in `.factory/claims.json`. Each command selected
exactly one tagged test and passed.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `sample-preflight` | `npm run test:claim -- @claim:sample-preflight` | pass |
| `local-caption-check` | `npm run test:claim -- @claim:local-caption-check` | pass |
| `offline-reload` | `npm run test:claim -- @claim:offline-reload` | pass |
| `free-to-use` | `npm run test:claim -- @claim:free-to-use` | pass |
| `caption-formats` | `npm run test:claim -- @claim:caption-formats` | pass |
| `report-export` | `npm run test:claim -- @claim:report-export` | pass |
| `platform-review-findings` | `npm run test:claim -- @claim:platform-review-findings` | pass |
| `platform-rules-reviewed` | `npm run test:claim -- @claim:platform-rules-reviewed` | pass |
| `caption-check-categories` | `npm run test:claim -- @claim:caption-check-categories` | pass |
| `reading-speed-threshold` | `npm run test:claim -- @claim:reading-speed-threshold` | pass |
| `real-session-refresh` | `npm run test:claim -- @claim:real-session-refresh` | pass |
| `demo-memory-isolation` | `npm run test:claim -- @claim:demo-memory-isolation` | pass |
| `accessible-preview-styles` | `npm run test:claim -- @claim:accessible-preview-styles` | pass |

The landing page and README contain no unlisted claim-like sentence. No claim
is untested.

## Earlier findings and regression check

I read every earlier review, polish report, and the handoff. The live audit and
current code/tests independently confirm each earlier finding rather than
relying on its reported status.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | Fixed: live report/export wording describes local checks only; no YouTube rendering, support, or lost-meaning assertion remains. |
| F-1-2 | Fixed: the live sample shows speed, line, style, placement, markup, and speaker findings; the category claim passed. |
| F-1-3 | Fixed: exact 180/186-WPM boundary coverage passed and the live result uses the checker threshold wording. |
| F-1-4 | Fixed: real refresh and memory-only demo isolation passed both tagged tests and the live seeded-storage check. |
| F-1-5 | Fixed: the action outcome ends at 489 px in the 844-px phone viewport. |
| F-1-6 | Fixed: all visible format lists use “timed TTML.” |
| F-1-7 | Fixed: no visitor-facing preflight/desk jargon remains. |
| F-1-8 | Fixed: the section is named “How it works” and “Check a caption file in three steps.” |
| F-1-9 | Fixed: the art caption is direct and the 404 says “This page does not exist.” |
| F-1-10 | Fixed: README uses plain browser, TypeScript, and deployment language. |
| F-1-11 | Fixed: the 1200×630 social image, Twitter/Open Graph metadata, and 180-px touch icon are live. |
| F-1-12 | Fixed: the Param Factory footer link visibly says “external site.” |
| F-2-1 | Fixed: the namespace-prefixed timed-TTML fixture renders one cue live and remains in the format claim. |
| F-4-1 | Fixed: “Platform support changes” and “Platform rules change” are absent from source and live copy. |
| F-V3-1 | Fixed: malformed and invalid SRT timestamps report errors and never report ready. |
| F-V3-2 | Fixed: selecting HTML video track applies its local WebVTT requirement. |
| F-V3-3 | Fixed: offset-time TTML parses and visible speaker text is detected. |
| F-V3-4 | Fixed: all three native-radio preview styles retain their tested high-contrast colors. |
| F-V3-5 | Fixed: profile changes retain focus; checks, forward navigation, and Back focus the useful heading/control. |
| F-V3-6 | Fixed: non-positive durations do not produce reading-speed output. |
| F-V3-7 | Fixed: the repository copy audit still covers landing, result, error, and README states. |
| F-V4-1 | Fixed: unsubmitted input survives profile rerender and real input survives refresh. |
| F-V4-2 | Fixed: unsupported WebVTT tags produce a visible checker error. |
| F-V4-3 | Fixed: timed TTML using `begin` plus `dur` is accepted. |
| F-V4-4 | Fixed: named and numeric character references decode in cue previews. |
| F-V4-5 | Fixed: both platform choices retain dated, working guidance links. |
| F-V4-6 | Fixed: service-worker work is deferred, online navigation rejects a stale shell, and offline reload passes. |
| F-V5-1 | Fixed: all four shipped SRT/TTML semantic fixtures produce findings and never report ready. |
| F-V5-2 | Fixed: hero and social asset responses use `public, max-age=0, must-revalidate`. |
| Editable demo/reset/exit | Fixed: edits run, Reset restores the sample, and Start for real restores seeded real data. |
| Update-safe service worker | Fixed: the stale-shell live check and offline reload both passed. |
| File and route focus | Fixed: file focus is visible; forward navigation and Back focus the new h1. |
| Stale preview after clear/error | Fixed: the current passing browser suite removes stale output in both paths. |
| Real HTTP 404 | Fixed: the unknown live route returns 404 and the designed recovery page. |

None of the earlier findings regressed. F-5-1 through F-5-4 are new findings.

## Structure, routes, and accessibility

- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route returns
  the designed page with HTTP 404.
- Every route has one h1, one main landmark, a route-specific title,
  description, canonical URL, Open Graph/Twitter metadata, and the consistent
  header/footer. The root title follows “Product — what it does.”
- Deep links load the correct state. Link navigation and browser Back update
  the URL, scroll position, title, focus, and polite announcement.
- All internal links, YouTube guidance, MDN guidance, Param Factory, metadata
  assets, `robots.txt`, `sitemap.xml`, and the manifest returned their expected
  successful status. No dead link was found.
- Live Axe scans found zero violations on root, demo, privacy, terms, and 404
  at desktop and 390 px. The URL verifier found `lang=en`, one h1, one main,
  complete image/button names, and zero console/page errors. The page has no
  horizontal overflow at 200% text.
- Security headers include response-level `frame-ancestors 'none'`, same-origin
  `connect-src`, `nosniff`, and the referrer policy. Reduced motion, visible
  focus, 44-px targets, image alternatives, and form labels are present.
- The production build contains 9.36 KB gzip JavaScript and 3.13 KB gzip CSS,
  well below the static-product budget.

F-5-1 and F-5-2 are the remaining structure/accessibility copy defects.

## Missed leverage

No missing high-value feature is implied by the brief. File selection,
drag-and-drop, paste, platform selection, local checking, cue preview, and text
report export cover the job. An AI action would add network/privacy cost without
being necessary for this deterministic checker. No provider key, runtime AI
call, payment integration, or decorative AI feature is present.

## Quality gates

From the clean clone:

```text
npm ci             PASS — 58 packages, 0 vulnerabilities
13 claim commands  PASS — 13/13
npm test           PASS — 36 Vitest + 38 Playwright tests
npm run build      PASS — dist/ produced
live Axe matrix    PASS — 0 violations across 5 routes × 2 viewports
verify-url.sh      PASS — 0 console/page errors
```

## What would make this perfect

Replace the empty limitations copy with explicit scope boundaries, rename the
global skip link to **“Skip to main content,”** rename **“Clear”** to **“Clear
caption text,”** and remove the internal design-doc note from the footer. Then
rerun the copy audit, route matrix, claim commands, full suite, and live check.
With those four changes and the current behavior retained, nothing else remains
from this review.
