# Adversarial first-read review 6 — PASS

**Product:** Caption Style Checker  
**Live URL:** <https://caption-style-checker.sociobot.in>  
**Reviewed:** 29 August 2026 UTC  
**Repository candidate:** `8461bffa88557d512b318065522edd4fb45ac0a1`

## Verdict

**PASS.** There are zero blocking or minor findings. The first screen explains
the job, audience, and first action; the sample is usable in one click and is
isolated from real storage; every declared claim passed from a clean clone; and
the complete live route, accessibility, privacy, offline, and regression audit
has no failure. No claim-like landing or README statement was left unlisted.

## Cold first read

I opened the live root in fresh, storage-free Chromium contexts at **390×844**
and **1440×1000**, before scrolling or interacting.

In my own words: this checks caption files before a video educator uploads
them; it is for video educators who need readable captions and clear speaker
cues; I should select **“Try it with sample data.”** The phone first screen
also shows **“Loads a sample file and shows its warnings.”** directly under the
action. The headline, audience sentence, action, and action result end at
276, 370, 440, and 489 px respectively in an 844 px viewport. This is clear
within one phone screen and is not a blocking first-read failure.

The live visual treatment is recognisably product-specific and matches
`.factory/design.md`: an asymmetric dark signal board, original pixel-art CRT
control-desk image, square-cut panels, timing readouts, and mint/violet/amber
status colors. It is not a generic SaaS template.

## Findings

None.

## Copy audit

The tables list all visitor-facing landing and README copy, including headings,
controls, and image alternative text. Word counts use whitespace-delimited
tokens. No entry exceeds 22 words. No banned marketing adjective, unexplained
jargon, metaphor/mood heading, inconsistent term, or non-result button was
found. The terminology remains consistent: **caption file**, **cue**,
**publishing platform**, **finding**, and **sample**.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | pass |
| CAPTION//CHECK | 1 | pass |
| Demo | 1 | pass |
| Checker | 1 | pass |
| Privacy | 1 | pass |
| Caption checker in your browser | 5 | pass |
| Check captions before upload | 4 | pass |
| For video educators who need readable captions and clear speaker cues before publishing. | 13 | pass |
| Try it with sample data | 5 | pass |
| Loads a sample file and shows its warnings. | 8 | `sample-preflight` |
| Caption text stays in this browser. | 6 | `local-caption-check` |
| Works offline after one visit. | 5 | `offline-reload` |
| Free to use. | 3 | `free-to-use` |
| Pixel-art caption timing monitor on a compact control desk. | 9 | descriptive alt text |
| Review caption settings before upload. | 5 | pass |
| Check a caption file | 4 | pass |
| Publishing platform | 2 | pass |
| YouTube upload | 2 | pass |
| HTML video track | 3 | pass |
| Rules reviewed 29 August 2026. | 5 | `platform-rules-reviewed` |
| Review the final upload before publishing. | 6 | usable instruction |
| Check YouTube upload format guidance (external site). | 7 | pass |
| Choose a caption file | 4 | pass |
| or drop it here · WebVTT, SRT, timed TTML | 8 | `caption-formats` |
| Caption text | 2 | pass |
| Paste a caption file here | 5 | pass |
| Check captions | 2 | result-naming verb |
| Clear caption text | 3 | result-naming verb |
| No caption file loaded | 4 | pass |
| Drop a WebVTT, SRT, or timed TTML file | 9 | `caption-formats` |
| Your checks will appear here. | 5 | pass |
| You can also paste caption text below. | 7 | pass |
| How it works | 3 | section name |
| Check a caption file in three steps | 7 | section name |
| Load | 1 | pass |
| Drop a WebVTT, SRT, or timed TTML file. | 9 | `caption-formats` |
| Choose | 1 | pass |
| Select the publishing platform you need. | 6 | pass |
| Fix | 1 | pass |
| Review fast cues, long lines, markup, placement, and speakers. | 9 | `caption-check-categories` |
| What this checker does not do | 6 | section name |
| It does not upload captions, edit video, translate speech, or predict the published result. | 14 | `scope-limitations` |
| Review the final upload before publishing. | 6 | usable instruction |
| Caption checks for people publishing video lessons. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory (external site) | 6 | pass |
| v1.1.0 | 1 | pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Caption Style Checker | 3 | pass |
| Check caption files before upload. | 5 | pass |
| Caption Style Checker is for independent video educators and accessibility reviewers. | 11 | pass |
| It reads WebVTT, SRT, and timed TTML in this browser. | 10 | `caption-formats` |
| It checks fast cues, long lines, styled text, placement settings, markup, and speaker cues. | 13 | `caption-check-categories` |
| It shows local checks for the selected publishing platform. | 9 | `platform-review-findings` |
| It also compares cues in three high-contrast preview styles. | 9 | `accessible-preview-styles` |
| Try the isolated sample at `/?demo=1`. | 6 | pass |
| It loads a short lesson intro and shows its warnings. | 10 | `sample-preflight` |
| Sample edits stay only in memory and are discarded when real mode starts. | 11 | `demo-memory-isolation` |
| Run it | 2 | section name |
| Open the local URL that Vite prints. | 7 | pass |
| Use `npm test` for parser and browser tests. | 8 | pass |
| Use `npm run lint` and `npm run typecheck` to check TypeScript. | 10 | pass |
| Use `npm run build` to create the `dist/` directory for deployment. | 10 | pass |
| Privacy and scope | 3 | section name |
| Caption text stays in this browser. | 6 | `local-caption-check` |
| Real mode saves the current caption text in this browser for refresh. | 11 | `real-session-refresh` |
| Demo mode keeps its sample text only in memory. | 9 | `demo-memory-isolation` |
| It does not upload captions, edit video, translate speech, or predict the published result. | 14 | `scope-limitations` |
| Review the final upload before publishing. | 6 | usable instruction |
| Platform rules were reviewed on 29 August 2026 against the linked YouTube caption formats and WebVTT format guidance. | 17 | `platform-rules-reviewed` |
| Deploy | 1 | section name |
| Deploy `dist/` to a host that serves the app at `/demo`, `/privacy`, and `/terms`. | 12 | pass |
| `public/staticwebapp.config.json` is provided for Azure Static Web Apps. | 8 | pass |
| License | 1 | pass |
| MIT | 1 | pass |

The claim scan found no unlisted claim-like sentence in the live landing or
README. The remaining live result/preview statements are covered by their
respective format, category, threshold, platform-review, preview-style, export,
or scope claims; instructions and labels do not make an additional promise.

## Demo, sandbox, and privacy

**Pass.** From a fresh root, one activation of **Try it with sample data**
opened `/?demo=1`. The first demo screen already showed the realistic
three-cue lesson sample, **11** findings, and the report/preview. The persistent
status banner says **“Demo — sample data, nothing is saved”** and exposes both
**Reset demo** and **Start for real**.

An edited demo sample checked locally; Reset restored the shipped `WEBVTT`
sample. In a seeded fresh context, direct demo entry did not read or change the
real `caption-source` key; Start for real restored the seeded real caption and
that caption survived reload. The live Playwright request log contained only
same-origin GET requests. After first visit/service-worker control, the demo
also reloaded offline. This confirms the public local/privacy and offline
claims in the actual sandbox, not just in source.

## Declared claims and quality gates

I made a fresh local clone, ran `npm ci --ignore-scripts --no-audit --no-fund`,
then ran every literal `test` string from `.factory/claims.json` independently.
All 14 passed:

`sample-preflight`, `local-caption-check`, `offline-reload`, `free-to-use`,
`caption-formats`, `report-export`, `platform-review-findings`,
`platform-rules-reviewed`, `caption-check-categories`,
`reading-speed-threshold`, `real-session-refresh`,
`demo-memory-isolation`, `accessible-preview-styles`, and
`scope-limitations`.

The clean clone also passed `npm test` (**37** Vitest/release tests and **40**
Playwright tests) and `npm run build`. The build produced `dist/` with 9.42 KB
gzip JavaScript and 3.13 KB gzip CSS.

## Earlier findings and regression check

I read every earlier `review-*.md`, `polish-*.md`, and the previous handoff.
I then repeated the relevant live and source checks rather than accepting their
recorded status. Each earlier finding is fixed:

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Report/export use only local checker wording; no platform-rendering assertion returned. |
| F-1-2 | Demo visibly reports all six advertised checking categories. |
| F-1-3 | Exact 180/186-WPM boundary check passes. |
| F-1-4 | Seeded real storage, demo memory isolation, reset, exit, and reload pass. |
| F-1-5 | Phone action and outcome remain above the fold. |
| F-1-6 | All visible format lists say “timed TTML.” |
| F-1-7 | No visitor-facing preflight/desk jargon remains. |
| F-1-8 | The steps section is plainly named “How it works.” |
| F-1-9 | Art caption and 404 use direct wording; 404 has Return home. |
| F-1-10 | README retains plain browser, TypeScript, and deployment wording. |
| F-1-11 | Live 1200×630 social art, Twitter/Open Graph tags, and 180 px touch icon are present. |
| F-1-12 | Param Factory visibly identifies itself as an external site. |
| F-2-1 | Namespace-prefixed timed TTML yields a one-cue report. |
| F-4-1 | No platform-change assertion appears in source or live copy. |
| F-5-1 | Limitations explicitly name upload, video, translation, and prediction boundaries. |
| F-5-2 | Skip link accurately names and focuses main content. |
| F-5-3 | Clear button names its target and retains one-action Undo. |
| F-5-4 | Footer contains only the useful version string. |
| F-V3-1 | Malformed/invalid SRT timing remains a visible error, never ready. |
| F-V3-2 | HTML video track still requires WebVTT. |
| F-V3-3 | Offset-time TTML and speaker detection still work. |
| F-V3-4 | All three native preview styles retain tested contrast colors. |
| F-V3-5 | File, platform, report, forward route, and Back focus remain useful. |
| F-V3-6 | Reversed or zero durations do not calculate reading speed. |
| F-V3-7 | The maintained copy audit covers landing, results, errors, controls, and README. |
| F-V4-1 | Unsubmitted text survives platform rerender; real text survives refresh. |
| F-V4-2 | Unsupported WebVTT markup produces a local error. |
| F-V4-3 | TTML `begin` plus `dur` is accepted. |
| F-V4-4 | Named and numeric character references decode in preview. |
| F-V4-5 | Both dated, linked platform guidance sources are present and reachable. |
| F-V4-6 | Online navigation rejects a stale shell; offline reload works. |
| F-V5-1 | Shipped SRT/TTML semantic fixtures show findings and never Ready to publish. |
| F-V5-2 | Stable hero/social art uses revalidation, not immutable caching. |

## Structure, routes, accessibility, and scope

- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown path returned
  the designed 404 with HTTP 404. Internal links and all three external guidance
  links returned 200.
- Each of five checked routes had one H1, one main landmark, its own title,
  meta description, canonical, social metadata, favicon, and consistent
  header/footer. Client navigation and browser Back focused the new H1 and
  updated the title/canonical.
- The live audit found zero console errors in normal flows, no horizontal
  overflow at 390 px or 200% text, and zero Axe violations on five routes at
  desktop and mobile sizes. The skip link, labels, visible focus, and keyboard
  route/check behavior work.
- `robots.txt`, `sitemap.xml`, manifest, Apple icon, and social image are live.
  The response CSP includes same-origin `connect-src` and response-level
  `frame-ancestors 'none'`; `X-Content-Type-Options: nosniff` is present.
- The job is complete without AI: file/drop/paste import, deterministic local
  checking, style comparison, and report export are the useful path. An AI
  feature would add network/privacy cost without improving this defined task.

## What would make this perfect

No repair is currently indicated. Preserve this result by rerunning the full
claim matrix, live audit, and copy audit whenever caption formats, platform
guidance, or visitor-facing copy changes.
