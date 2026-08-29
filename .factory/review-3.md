# Adversarial first-read review 3 — FAIL

**Product:** Caption Style Checker  
**Live URL:** https://caption-style-checker.sociobot.in  
**Reviewed:** 2026-08-29 UTC  
**Repository candidate:** `ecf28a6074ee8310415012ab203d0003e93ba7eb`

## Verdict

**FAIL.** The landing page is clear on phone and desktop, the sample is immediately usable, every declared claim command passes from a clean clone, and routing/privacy checks pass. One prior blocking finding has regressed: the live report again asserts unverified behavior of YouTube. A claim test only checks that the assertion is displayed. It does not establish that the assertion is true.

## Cold first read

I opened `/` in new, storage-free Chromium contexts at 390×844 and 1440×900 before scrolling or interacting. In my words: this checks caption files before upload; it is for video educators who need readable captions and clear speaker cues; I should select **Try it with sample data**. All three answers are on the first screen at both sizes. On the phone, **“Loads a sample file and shows its warnings.”** ends at 489 px of an 844-px viewport. This is not a first-read blocker.

The asymmetric signal-board layout, original pixel control-desk art, square panels, and dark/mint/violet palette agree with `.factory/design.md`; this is not a generic SaaS template.

## Findings

### Blocking

#### F-1-1 — platform-behavior assertions have regressed

This retains the prior ID as required by the history check.

- **Quote / location:** Live `/demo` sample report: **“This cue uses placement or alignment settings. Preview the uploaded video because YouTube rendering can differ.”** Source: `src/lint.ts`, the `placement` finding. The same code also says **“It is not supported by YouTube upload.”** for an unsupported WebVTT tag, and **“Its meaning may not survive upload.”** in other markup findings.
- **Why this fails:** These are factual claims about how a publishing platform handles captions. A visitor can make an upload decision from them. The relevant claim, `platform-review-findings`, says only **“Applies checks for the selected publishing platform.”** Its tagged test switches the select and asserts that the local warning text appears. It does not verify YouTube rendering, support, or loss of meaning against a reproducible source or platform fixture. The cited YouTube format-guidance link and dated-source claim do not make these particular assertions observable in the sandbox.
- **Concrete fix:** Remove platform-behavior assertions from the local report. Replace the first detail with **“This cue uses placement or alignment settings. Check the final upload before publishing.”** Replace **“It is not supported by YouTube upload.”** with **“This tag is outside this checker's supported WebVTT markup.”** Remove all “may not survive” wording unless it is separately listed and tested from a maintained, source-backed platform fixture. Update the sample, export, and tagged platform test to assert scoped local wording.

## Copy audit

Word counts treat labels, commands, URLs, abbreviations, and slash-delimited text as one word. The tables include all visitor-facing initial landing copy and all README prose/headings. No entry exceeds 22 words. No additional jargon, marketing adjective, metaphor heading, inconsistent term, or non-result button was found. F-1-1 is dynamic demo copy, rather than landing or README copy.

### Landing page

| Copy | Words | Result |
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
| Loads a sample file and shows its warnings. | 8 | listed `sample-preflight` |
| Caption text stays in this browser. | 6 | listed `local-caption-check` |
| Works offline after one visit. | 5 | listed `offline-reload` |
| Free to use. | 3 | listed `free-to-use` |
| Pixel-art caption timing monitor on a compact control desk. | 9 | pass (alt) |
| Review caption settings before upload. | 5 | pass |
| Check a caption file | 4 | pass |
| Publishing platform | 2 | pass |
| YouTube upload | 2 | pass |
| HTML video track | 3 | pass |
| Rules reviewed 29 August 2026. | 5 | listed `platform-rules-reviewed` |
| Platform support changes. | 3 | scope note |
| Check YouTube upload format guidance (external site). | 7 | pass |
| Choose a caption file | 4 | pass |
| or drop it here · WebVTT, SRT, timed TTML | 8 | listed `caption-formats` |
| Caption text | 2 | pass |
| Paste a caption file here | 5 | pass |
| Check captions | 2 | pass |
| Clear | 1 | pass |
| No caption file loaded | 4 | pass |
| Drop a WebVTT, SRT, or timed TTML file | 9 | listed `caption-formats` |
| Your checks will appear here. | 5 | pass |
| You can also paste caption text below. | 7 | pass |
| How it works | 3 | pass |
| Check a caption file in three steps | 7 | pass |
| Load | 1 | pass |
| Drop a WebVTT, SRT, or timed TTML file. | 9 | listed `caption-formats` |
| Choose | 1 | pass |
| Select the publishing platform you need. | 6 | pass |
| Fix | 1 | pass |
| Review fast cues, long lines, markup, placement, and speakers. | 9 | listed `caption-check-categories` |
| What this checker does not do | 6 | pass |
| It checks timed caption files in this browser. | 8 | listed claims |
| Platform rules change, so review the final upload before publishing. | 10 | scope note |
| Caption checks for people publishing video lessons. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory (external site) | 6 | pass |
| v1.1.0 · generated art noted in design docs | 8 | pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Caption Style Checker | 3 | pass |
| Check caption files before upload. | 5 | pass |
| Caption Style Checker is for independent video educators and accessibility reviewers. | 11 | pass |
| It reads WebVTT, SRT, and timed TTML in this browser. | 10 | listed `caption-formats` |
| It checks fast cues, long lines, styled text, placement settings, markup, and speaker cues. | 13 | listed `caption-check-categories` |
| It applies checks for the selected publishing platform and compares cues in three high-contrast preview styles. | 15 | listed claims |
| Try the isolated sample at `/demo`. | 6 | pass |
| It loads a short lesson intro and shows its warnings. | 10 | listed `sample-preflight` |
| Sample edits stay only in memory and are discarded when real mode starts. | 11 | listed `demo-memory-isolation` |
| Run it | 2 | pass |
| Open the local URL that Vite prints. | 7 | pass |
| Use `npm test` for parser and browser tests. | 7 | pass |
| Use `npm run lint` and `npm run typecheck` to check TypeScript. | 10 | pass |
| Use `npm run build` to create the `dist/` directory for deployment. | 10 | pass |
| Privacy and scope | 3 | pass |
| Caption text stays in this browser. | 6 | listed `local-caption-check` |
| Real mode saves the current caption text in this browser for refresh. | 11 | listed `real-session-refresh` |
| Demo mode keeps its sample text only in memory. | 9 | listed `demo-memory-isolation` |
| See `/privacy` and `/terms` in the app. | 6 | pass |
| Platform rules were reviewed on 29 August 2026 against the linked YouTube caption formats and WebVTT format guidance. | 17 | listed `platform-rules-reviewed` |
| Platform support changes, so review the final upload before publishing. | 10 | scope note |
| Deploy | 1 | pass |
| Deploy `dist/` to a host that serves the app at `/demo`, `/privacy`, and `/terms`. | 12 | pass |
| `public/staticwebapp.config.json` is provided for Azure Static Web Apps. | 8 | pass |
| License | 1 | pass |
| MIT | 1 | pass |

## Demo and sandbox verification

**Pass.** From a fresh live root, one click on **Try it with sample data** opened `/demo`. The first screen had title **Demo — Caption Style Checker**, h1 **Check sample captions**, a realistic three-cue WebVTT lesson, and nine visible findings. The persistent banner read **Demo — sample data, nothing is saved** and included **Reset demo** and **Start for real**.

I edited the sample, ran the check, and used Reset demo; the original sample returned. In a separate context seeded with a real `caption-source`, direct `/demo` did not read or change that key and restored the real text after Start for real. Request logging recorded only `https://caption-style-checker.sociobot.in`. The clean-clone `offline-reload` claim test passed after service-worker control.

Import (file/drop/paste) and text-report export are present. The brief does not imply an AI action; adding one would be decorative. No provider key or runtime AI request was found.

## Declared claims and quality gates

I cloned the candidate into a new temporary directory, ran `npm ci`, and ran every literal command from `.factory/claims.json`. Each selected one tagged test and passed.

| Claim ID | Result |
| --- | --- |
| sample-preflight | pass |
| local-caption-check | pass |
| offline-reload | pass |
| free-to-use | pass |
| caption-formats | pass |
| report-export | pass |
| platform-review-findings | pass, but does not prove F-1-1 external assertions |
| platform-rules-reviewed | pass, but does not prove F-1-1 external assertions |
| caption-check-categories | pass |
| reading-speed-threshold | pass |
| real-session-refresh | pass |
| demo-memory-isolation | pass |
| accessible-preview-styles | pass |

`npm test` passed: 30 Vitest tests and 32 Playwright tests. `npm run build` passed and produced `dist/`. Application JavaScript was 23.44 kB raw / 8.71 kB gzip; CSS was 10.33 kB raw / 3.08 kB gzip. The repaired prefixed-TTML fixture was entered on live `/demo`; it produced **TTML · 1 CUE · 3 SEC** with no parse error.

## Earlier-finding regression check

I read every earlier review, polish report, and handoff, then checked each finding in the live product and source.

| Earlier ID | Current verification |
| --- | --- |
| F-1-1 | **Regressed; see blocking finding above.** |
| F-1-2 | Fixed: advertised categories are listed and their claim passes. |
| F-1-3 | Fixed: the 180-WPM boundary is listed and tested. |
| F-1-4 | Fixed: real refresh/demo isolation pass and were reproduced live. |
| F-1-5 | Fixed: phone action and result are above the fold. |
| F-1-6 | Fixed: visitor format lists say “timed TTML.” |
| F-1-7 | Fixed: no visitor-facing “preflight” or “desk” jargon remains. |
| F-1-8 | Fixed: the section is explicitly named “How it works.” |
| F-1-9 | Fixed: art caption and 404 use direct wording. |
| F-1-10 | Fixed: README browser, TypeScript, and deployment wording is plain. |
| F-1-11 | Fixed: live social image, Twitter metadata, and touch icon are present. |
| F-1-12 | Fixed: footer labels Param Factory as an external site. |
| F-V3-1 | Fixed: malformed timestamp tests pass and report a finding. |
| F-V3-2 | Fixed: named publishing-platform profile test passes. |
| F-V3-3 | Fixed: source/tests cover offset-time TTML and speaker text. |
| F-V3-4 | Fixed: all three high-contrast preview choices pass. |
| F-V3-5 | Fixed: keyboard profile/check focus tests pass. |
| F-V3-6 | Fixed: source suppresses speed calculation for non-positive duration. |
| F-V3-7 | Fixed: shipped copy audit includes formerly omitted states. |
| F-V4-1 | Fixed: unsubmitted paste survives profile rerender and real refresh. |
| F-V4-2 | Fixed: unsupported WebVTT tags report an error. |
| F-V4-3 | Fixed: timed TTML `begin` plus `dur` test passes. |
| F-V4-4 | Fixed: character-reference decoding test passes. |
| F-V4-5 | Fixed: dated guidance-source claim/test is present. |
| F-V4-6 | Fixed: service-worker work is deferred and production budget passes. |
| F-V5-1 | Fixed: shipped SRT/TTML semantic fixtures never report ready. |
| F-V5-2 | Fixed: source config revalidates hero and social assets. |
| F-2-1 | Fixed: live namespace-prefixed TTML produces one cue; public format claim includes fixture. |

## Structure and accessibility checks

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown route returned the designed 404 with HTTP 404. All had one h1, one main landmark, route title, description, and canonical URL.
- Client navigation to Privacy and browser Back both focused the new h1 after route change. Header/footer, skip link, Privacy/Terms links, and external-destination labelling are consistent.
- Every discovered internal link and both external links returned 200. Social image, touch icon, favicon, robots file, and sitemap returned 200.
- Cold 390px and desktop loads had no console/page errors and no horizontal overflow. The route-matrix script's sole 404 message was from its deliberate unknown-route request, not normal flow.
- The live CSP is a response header with `frame-ancestors 'none'` and same-origin `connect-src`. Existing desktop/mobile Axe checks passed with no serious or critical violations.

## What would make this perfect

Remove or properly prove every external platform-behavior statement in the report, then rerun this full review against the deployed result. With F-1-1 closed and the existing passing checks retained, no other finding remains.

