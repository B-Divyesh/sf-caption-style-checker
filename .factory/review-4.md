# Adversarial first-read review 4 — FAIL

**Product:** Caption Style Checker
**Live URL:** <https://caption-style-checker.sociobot.in>
**Reviewed:** 2026-08-29 UTC
**Repository candidate:** `a7ac34fa4f5e8a897123f383f09b34a17c2e8b8f`

## Verdict

**FAIL.** The product is clear and immediately tryable, the demo sandbox is
isolated, every declared claim test passes, and the earlier defects remain
closed. One factual sentence on the landing page and README is not in
`.factory/claims.json`, so it has no observable test. The acceptance standard
requires zero unlisted claims and zero findings.

## Cold first read

I opened the live root in new storage-free Chromium contexts at **390×844** and
**1440×900**, without scrolling. In my own words: it checks a timed caption file
before upload; it is for video educators; I should tap **“Try it with sample
data.”** The phone first screen includes the headline, audience sentence, action,
and immediate outcome **“Loads a sample file and shows its warnings.”** This is
clear on the first screen at both sizes and is not a first-read blocker.

The pixel/demoscene signal-desk system is visibly product-specific: original CRT
control-desk art, timing-like labels, asymmetric checker layout, square panels,
and the documented dark/mint/violet palette. It does not present as a generic
SaaS template.

## Findings

### Blocking

#### F-4-1 — platform-change assertion is an unlisted claim

- **Quote / location:** landing checker note, **“Platform support changes.”**;
  landing scope section and README, **“Platform rules change, so review the
  final upload before publishing.”**
- **Why this fails:** These are factual assertions about publishing platforms.
  A visitor is asked to rely on them when deciding to inspect an upload. The
  related `platform-rules-reviewed` claim only tests the review date and linked
  guidance; no claims entry or tagged test owns the assertion that support or
  rules change. The claims contract requires every visitor-reliant assertion to
  be listed and observable in its sandbox.
- **Concrete fix:** Prefer removing the untestable premise and retain the useful
  instruction: change the checker note to **“Review the final upload before
  publishing.”** Change the scope and README sentence to the same instruction.
  Alternatively add a narrowly testable, source-backed claim that names the
  exact rule and source revision; do not add a broad, time-sensitive promise.

## Copy audit

Word counts are for every visible landing string, including headings, controls,
and image alt text, and every README sentence or heading. Commands, URLs, and
format names count as one word each. No audited sentence exceeds 22 words.

### Landing page

| Copy | Words | Review |
| --- | ---: | --- |
| Skip to checker | 3 | pass |
| CAPTION//CHECK | 1 | pass |
| Demo | 1 | pass |
| Checker | 1 | pass |
| Privacy | 1 | pass |
| Caption checker in your browser | 5 | pass |
| Check captions before upload | 4 | pass |
| For video educators who need readable captions and clear speaker cues before publishing. | 13 | pass |
| Try it with sample data | 5 | pass |
| Loads a sample file and shows its warnings. | 8 | pass |
| Caption text stays in this browser. | 6 | listed: `local-caption-check` |
| Works offline after one visit. | 5 | listed: `offline-reload` |
| Free to use. | 3 | listed: `free-to-use` |
| Pixel-art caption timing monitor on a compact control desk. | 9 | descriptive alt text |
| Review caption settings before upload. | 5 | usable instruction |
| Check a caption file | 4 | pass |
| Publishing platform | 2 | pass |
| YouTube upload | 2 | pass |
| HTML video track | 3 | pass |
| Rules reviewed 29 August 2026. | 5 | listed: `platform-rules-reviewed` |
| Platform support changes. | 3 | **F-4-1** |
| Check YouTube upload format guidance (external site). | 7 | pass |
| Choose a caption file | 4 | pass |
| or drop it here · WebVTT, SRT, timed TTML | 8 | listed: `caption-formats` |
| Caption text | 2 | pass |
| Paste a caption file here | 5 | pass |
| Check captions | 2 | result-naming verb |
| Clear | 1 | result-naming verb |
| No caption file loaded | 4 | pass |
| Drop a WebVTT, SRT, or timed TTML file | 9 | listed: `caption-formats` |
| Your checks will appear here. | 5 | pass |
| You can also paste caption text below. | 7 | pass |
| How it works | 3 | section name |
| Check a caption file in three steps | 7 | section name |
| Load | 1 | pass |
| Drop a WebVTT, SRT, or timed TTML file. | 9 | listed: `caption-formats` |
| Choose | 1 | pass |
| Select the publishing platform you need. | 6 | pass |
| Fix | 1 | pass |
| Review fast cues, long lines, markup, placement, and speakers. | 9 | listed: `caption-check-categories` |
| What this checker does not do | 6 | section name |
| It checks timed caption files in this browser. | 8 | listed: `caption-formats` |
| Platform rules change, so review the final upload before publishing. | 10 | **F-4-1** |
| Caption checks for people publishing video lessons. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory (external site) | 6 | pass |
| v1.1.0 · generated art noted in design docs | 8 | pass |

No marketing adjectives, information-free slogans, unexplained metaphors, or
non-result buttons were found. Necessary format names (WebVTT, SRT, timed TTML)
are used consistently. “Publishing platform” is introduced beside the select
that it labels and is understandable in context.

### README

| Copy | Words | Review |
| --- | ---: | --- |
| Caption Style Checker | 3 | product name |
| Check caption files before upload. | 5 | pass |
| Caption Style Checker is for independent video educators and accessibility reviewers. | 11 | audience statement |
| It reads WebVTT, SRT, and timed TTML in this browser. | 10 | listed: `caption-formats` |
| It checks fast cues, long lines, styled text, placement settings, markup, and speaker cues. | 13 | listed: `caption-check-categories` |
| It shows local checks for the selected publishing platform. | 9 | listed: `platform-review-findings` |
| It also compares cues in three high-contrast preview styles. | 9 | listed: `accessible-preview-styles` |
| Try the isolated sample at /?demo=1. | 6 | listed: `demo-memory-isolation` |
| It loads a short lesson intro and shows its warnings. | 10 | listed: `sample-preflight` |
| Sample edits stay only in memory and are discarded when real mode starts. | 11 | listed: `demo-memory-isolation` |
| Run it | 2 | section name |
| Open the local URL that Vite prints. | 7 | developer instruction |
| Use npm test for parser and browser tests. | 8 | developer instruction |
| Use npm run lint and npm run typecheck to check TypeScript. | 10 | developer instruction |
| Use npm run build to create the dist/ directory for deployment. | 10 | developer instruction |
| Privacy and scope | 3 | section name |
| Caption text stays in this browser. | 6 | listed: `local-caption-check` |
| Real mode saves the current caption text in this browser for refresh. | 11 | listed: `real-session-refresh` |
| Demo mode keeps its sample text only in memory. | 9 | listed: `demo-memory-isolation` |
| See /privacy and /terms in the app. | 7 | pass |
| Platform rules were reviewed on 29 August 2026 against the linked YouTube caption formats and WebVTT format guidance. | 16 | listed: `platform-rules-reviewed` |
| Platform support changes, so review the final upload before publishing. | 10 | **F-4-1** |
| Deploy | 1 | section name |
| Deploy dist/ to a host that serves the app at /demo, /privacy, and /terms. | 13 | developer instruction |
| public/staticwebapp.config.json is provided for Azure Static Web Apps. | 8 | deployment file/product name |
| License | 1 | section name |
| MIT | 1 | license identifier |

## Demo, sandbox, and privacy

**Pass.** One click from a fresh live root reached `/?demo=1`; the first demo
screen already displayed a three-cue lesson caption and eleven visible findings.
The persistent banner read **“Demo — sample data, nothing is saved”** and exposed
**Reset demo** and **Start for real**. Reset restored the shipped `WEBVTT`
sample. Starting real mode removed the banner and left the real editor empty in
a storage-free context.

The fresh demo context contained no `caption-source` item and no `demo:` storage
entries. The full live demo request log contained only this app origin (HTML,
CSS, JavaScript, and the self-hosted art). `@claim:demo-memory-isolation` and
`@claim:local-caption-check` also passed from the clean clone. The latter proves
the privacy assertion against outgoing requests; the former proves a seeded real
session is neither read nor changed by direct demo entry. `@claim:offline-reload`
passed with its service-worker/offline fixture.

## Declared claims and quality gates

I cloned the candidate to a fresh temporary directory, ran `npm ci`, and ran
each literal command in `.factory/claims.json`. All 13 exited successfully.

| Claim id | Result |
| --- | --- |
| sample-preflight | pass |
| local-caption-check | pass |
| offline-reload | pass |
| free-to-use | pass |
| caption-formats | pass |
| report-export | pass |
| platform-review-findings | pass |
| platform-rules-reviewed | pass |
| caption-check-categories | pass |
| reading-speed-threshold | pass |
| real-session-refresh | pass |
| demo-memory-isolation | pass |
| accessible-preview-styles | pass |

The same clean clone passed `npm test` (35 Vitest tests and 37 Playwright tests)
and `npm run build`. The build produced `dist/`; main JavaScript was 9.38 kB gzip
and CSS was 3.13 kB gzip. The only terminal output was the environment's
non-failing `NO_COLOR` warning from the test web server.

## Earlier findings and regression check

Every prior review, polish report, and handoff was read. The following checks
confirm the fix in both current source and the live product; none was merely
accepted on its previous status.

| Earlier finding | Current live and code verification |
| --- | --- |
| F-1-1 | pass: live sample/export use only local checker wording and `src/lint.ts` says “Check the final upload”; no assertion that YouTube will render, remove, or preserve a feature. |
| F-1-2 | pass: live sample visibly reports speed, long line, styled text, placement, markup, and speaker categories; `caption-check-categories` passed. |
| F-1-3 | pass: live warning names the 180-WPM checker threshold; exact 180/above boundary test passed. |
| F-1-4 | pass: real refresh and memory-only demo isolation passed tagged tests and the current live demo request/storage check. |
| F-1-5 | pass: the mobile sample outcome is directly below the primary action (button bottom 440 px at 844 px viewport). |
| F-1-6 | pass: all current visible format lists say “timed TTML”; format claim passed. |
| F-1-7 | pass: live visitor copy and `src/main.ts` use “Caption checker in your browser,” with no preflight/desk label. |
| F-1-8 | pass: the live section is headed “How it works” / “Check a caption file in three steps.” |
| F-1-9 | pass: live art caption is direct and unknown live route says “This page does not exist.” |
| F-1-10 | pass: README retains browser/TypeScript/plain deployment wording. |
| F-1-11 | pass: live markup has 1200×630 social metadata, Twitter card, 180px Apple icon, and all assets return 200. |
| F-1-12 | pass: live footer visibly labels Param Factory as an external site. |
| F-2-1 | pass: `caption-formats` covers `tests/fixtures/prefixed-timed.ttml`; the local-name parser in `src/lint.ts` accepts namespace-prefixed TTML. |
| F-V3-1 | pass: malformed SRT and invalid timestamp tests remain in the passing suite and do not show Ready to publish. |
| F-V3-2 | pass: switching to HTML video track still requires local WebVTT format checks; tagged platform claim passed. |
| F-V3-3 | pass: offset TTML and speaker text tests remain in the passing suite. |
| F-V3-4 | pass: three live native-radio preview styles are present and the tagged contrast claim passed. |
| F-V3-5 | pass: current browser test verifies file/profile/report focus and Back-route heading focus. |
| F-V3-6 | pass: unit test confirms reversed or zero timing has no reading-speed calculation. |
| F-V3-7 | pass: current copy audit includes landing, result, unsupported-markup, and README copy. |
| F-V4-1 | pass: current browser test preserves unsubmitted input across profile rerender and real refresh. |
| F-V4-2 | pass: unsupported WebVTT markup is a visible local checker error in current tests. |
| F-V4-3 | pass: current unit/browser tests accept TTML `begin` plus `dur`. |
| F-V4-4 | pass: current unit/browser tests decode named and numeric character references. |
| F-V4-5 | pass: dated YouTube and WebVTT source links are present; the tagged source claim passed. |
| F-V4-6 | pass: source defers service-worker registration and current build is well inside the static budget. |
| F-V5-1 | pass: all shipped SRT/TTML semantic fixtures are covered by the current format claim and never report Ready to publish. |
| F-V5-2 | pass: source configuration assigns `public, max-age=0, must-revalidate` to stable hero/social assets before the immutable asset wildcard. |

The prior handoff's unnumbered checks also pass: editable demo reset/exit,
update-safe service-worker flow, file-picker focus, stale-preview clearing, and
a real live HTTP 404 are all covered in the current browser suite and live route
matrix.

## Structure, routes, and accessibility

- **Pass:** `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route
  returns the designed 404 with HTTP 404. Deep links load the correct page.
  Link navigation and Back move focus to the destination H1 after the render.
- **Pass:** each route has one H1, one main landmark, a route-specific title,
  description, canonical URL, consistent header/footer, skip link, and polite
  route announcement. Root title follows the required product-plus-job pattern.
- **Pass:** current live root, demo, privacy, terms, and 404 at 390 px each had
  zero Axe WCAG 2 A/AA violations and no console errors, except the expected
  browser resource error for the intentional HTTP-404 document request.
- **Pass:** Open Graph/Twitter metadata, favicon, Apple icon, robots, sitemap,
  manifest, CSP, nosniff, and referrer policy are present. The CSP's
  `frame-ancestors` directive is served as a response header, not a meta tag.
- **Pass:** every internal link and all three linked external destinations
  (YouTube guidance, MDN WebVTT guidance, and Sociobot) returned 200. There are
  no dead links. The mobile page has no horizontal overflow.

No AI feature is missing: checking a caption file has a complete local path,
file import, preview, and text export. An AI suggestion would be decorative and
would not improve this narrowly defined pre-upload check.

## What would make this perfect

Remove the untested platform-change assertion everywhere, retaining only the
practical final-upload instruction, then re-run the 13 claim commands and this
full cold-live review. With that single claims-contract issue closed, this would
be PASS-adjacent: the first-read, demo, privacy, quality, route, and accessibility
checks all currently verify.
