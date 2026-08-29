# Adversarial first-read review 2 — FAIL

**Product:** Caption Style Checker  
**Live URL:** https://caption-style-checker.sociobot.in  
**Reviewed:** 2026-08-29 UTC  
**Repository candidate:** `c9250311d203e20810a48dce23e07c77ac321b6e`

## Verdict

**FAIL.** The first screen, one-click demo, declared claim commands, privacy
request log, routing, and the prior repairs pass. One blocking mismatch remains:
the product says it reads **timed TTML**, but rejects a valid timed TTML document
whose standard element names use the `tt:` namespace prefix. A visitor with that
ordinary XML form receives a parse error rather than a caption report. There is
therefore one finding and this review cannot pass.

## Cold first read

I opened the live root in new, storage-free Chromium contexts at **390×844** and
**1440×900**, before scrolling or interacting. In my own words: this checks a
caption file before upload; it is for video educators who need readable captions
and clear speaker cues; I should tap **“Try it with sample data.”** All three
answers are visible on the first screen at both sizes. On the phone the result
text, **“Loads a sample file and shows its warnings.”**, is immediately below the
primary action and is still above the fold. This is not a first-read blocker.

The visual system is distinct and agrees with the documented pixel/demoscene
signal-desk thesis. It is an asymmetric checker with original CRT control-desk
art, timing-like labels, square panels, and a dark/mint/violet palette; it does
not present as a generic SaaS card template.

## Findings

### Blocking

#### F-2-1 — “timed TTML” rejects a valid namespace-prefixed TTML caption

- **Quote / location:** landing file control and empty state, **“WebVTT, SRT,
  timed TTML”**; README, **“It reads WebVTT, SRT, and timed TTML in this
  browser.”**; declared claim `caption-formats`, **“Reads WebVTT, SRT, and
  timed TTML.”**
- **Verification:** In a fresh live `/demo` context, I pasted this timed TTML
  document and selected **Check captions**:

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <tt:tt xmlns:tt="http://www.w3.org/ns/ttml">
    <tt:body><tt:div>
      <tt:p begin="00:00:01.000" end="00:00:03.000">
        Standard prefixed timed TTML caption
      </tt:p>
    </tt:div></tt:body>
  </tt:tt>
  ```

  The live result was **“We could not read that caption file”** and **“This
  does not look like a WebVTT, SRT, or timed TTML file.”** The same timing and
  text with unprefixed `<tt>` and `<p>` elements produced `TTML · 1 CUE · 3
  SEC` and a report. The implementation confirms the discrepancy:
  `src/lint.ts` only detects `<tt>`/`<ttml>` followed by whitespace or `>` and
  only scans unprefixed `<p>` elements.
- **Why this fails:** XML namespace prefixes are valid and commonly emitted in
  timed TTML. The unqualified format promise is broader than the parser. A
  first-time visitor can reasonably choose a file the product says it reads,
  then receive an incorrect format error. The existing tagged claim test passes
  only because it does not include this valid form, so it does not prove the
  published claim.
- **Concrete fix:** Parse TTML by local element name so both default-namespace
  and `tt:`-prefixed `tt`, `body`, `div`, `p`, `span`, and `br` elements are
  accepted; preserve the existing semantic checks. Add a standard prefixed
  timed-TTML fixture to `@claim:caption-formats` and assert that it reports one
  cue instead of a parse error. If that support is intentionally out of scope,
  narrow every public promise and file-control label to state exactly that only
  unprefixed TTML elements are accepted; supporting normal namespace prefixes
  is the useful repair.

## Copy audit

Word counts treat commands, URLs, abbreviations, and slash-separated labels as
one word. The table includes visible labels/headings and the image alternative
text because it is visitor-facing accessibility copy. No entry exceeds 22
words. No marketing adjective, mood heading, jargon heading, or non-result
button was found. The one format-scope problem is F-2-1, not a length or plain
language failure.

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
| Loads a sample file and shows its warnings. | 8 | pass |
| Caption text stays in this browser. | 6 | listed claim |
| Works offline after one visit. | 5 | listed claim |
| Free to use. | 3 | listed claim |
| Pixel-art caption timing monitor on a compact control desk. | 9 | pass |
| Review caption settings before upload. | 5 | pass |
| Check a caption file | 4 | pass |
| Publishing platform | 2 | pass |
| YouTube upload | 2 | pass |
| HTML video track | 3 | pass |
| Rules reviewed 29 August 2026. | 5 | listed claim |
| Platform support changes. | 3 | scope note |
| Check YouTube upload format guidance (external site). | 7 | pass |
| Choose a caption file | 4 | pass |
| or drop it here · WebVTT, SRT, timed TTML | 8 | F-2-1 |
| Caption text | 2 | pass |
| Paste a caption file here | 5 | pass |
| Check captions | 2 | pass |
| Clear | 1 | pass |
| No caption file loaded | 4 | pass |
| Drop a WebVTT, SRT, or timed TTML file | 9 | F-2-1 |
| Your checks will appear here. | 5 | pass |
| You can also paste caption text below. | 7 | pass |
| How it works | 3 | pass |
| Check a caption file in three steps | 7 | pass |
| Load | 1 | pass |
| Drop a WebVTT, SRT, or timed TTML file. | 9 | F-2-1 |
| Choose | 1 | pass |
| Select the publishing platform you need. | 6 | pass |
| Fix | 1 | pass |
| Review fast cues, long lines, markup, placement, and speakers. | 9 | listed claim |
| What this checker does not do | 6 | pass |
| It checks timed caption files in this browser. | 8 | F-2-1 scope |
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
| It reads WebVTT, SRT, and timed TTML in this browser. | 10 | F-2-1 |
| It checks fast cues, long lines, styled text, placement settings, markup, and speaker cues. | 13 | listed claim |
| It applies checks for the selected publishing platform and compares cues in three high-contrast preview styles. | 15 | listed claims |
| Try the isolated sample at `/demo`. | 6 | pass |
| It loads a short lesson intro and shows its warnings. | 10 | listed claim |
| Sample edits stay only in memory and are discarded when real mode starts. | 11 | listed claim |
| Run it | 2 | pass |
| Open the local URL that Vite prints. | 7 | pass |
| Use `npm test` for parser and browser tests. | 7 | pass |
| Use `npm run lint` and `npm run typecheck` to check TypeScript. | 10 | pass |
| Use `npm run build` to create the `dist/` directory for deployment. | 10 | pass |
| Privacy and scope | 3 | pass |
| Caption text stays in this browser. | 6 | listed claim |
| Real mode saves the current caption text in this browser for refresh. | 11 | listed claim |
| Demo mode keeps its sample text only in memory. | 9 | listed claim |
| See `/privacy` and `/terms` in the app. | 6 | pass |
| Platform rules were reviewed on 29 August 2026 against the linked YouTube caption formats and WebVTT format guidance. | 17 | listed claim |
| Platform support changes, so review the final upload before publishing. | 10 | scope note |
| Deploy | 1 | pass |
| Deploy `dist/` to a host that serves the app at `/demo`, `/privacy`, and `/terms`. | 12 | pass |
| `public/staticwebapp.config.json` is provided for Azure Static Web Apps. | 8 | pass |
| License | 1 | pass |
| MIT | 1 | pass |

No claim-like landing or README sentence lacks an entry in
`.factory/claims.json`; F-2-1 is a listed claim whose test coverage is too
narrow for the promise.

## Demo, sandbox, and privacy

**Pass, except for the blocking format finding above.** A new live `/demo`
context immediately displayed the realistic three-cue WebVTT lesson sample and
its visible report (`6 warnings to review` plus notes). The persistent banner
read **“Demo — sample data, nothing is saved”** and included both **Reset demo**
and **Start for real**. Editing the sample, resetting it, and leaving it all
worked. A real caption entered after leaving demo survived reload; a later
direct `/demo` opened the shipped sample instead and did not overwrite or read
that saved real caption. The request log for the fresh demo flow contained only
`https://caption-style-checker.sociobot.in`.

The product has useful import (file/drop or paste) and text-report export. No
AI-assisted step is implied by this focused local checker, so adding one would
be decorative rather than missed leverage. No embedded provider key or runtime
AI request was found.

## Declared claims and local quality gates

I ran `npm ci` from this clean checkout, then each exact command named in
`.factory/claims.json`. All 13 completed successfully, one selected tagged test
per command:

| Claim ID | Result |
| --- | --- |
| sample-preflight | pass |
| local-caption-check | pass |
| offline-reload | pass |
| free-to-use | pass |
| caption-formats | pass, but incomplete for F-2-1 |
| report-export | pass |
| platform-review-findings | pass |
| platform-rules-reviewed | pass |
| caption-check-categories | pass |
| reading-speed-threshold | pass |
| real-session-refresh | pass |
| demo-memory-isolation | pass |
| accessible-preview-styles | pass |

`npm test` also passed: **29 Vitest tests** and **32 Playwright tests**.
`npm run build` passed and produced `dist/`; its application JavaScript is
23.30 kB raw / 8.69 kB gzip and CSS is 10.33 kB raw / 3.08 kB gzip.

## Earlier-finding regression check

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the handoff, then
checked each earlier finding in live behavior and the current source.

| Earlier ID | Current verification |
| --- | --- |
| F-1-1 | Fixed: local report wording asks for review; it no longer says a platform will flatten/remove features. `platform-review-findings` is listed and passed. |
| F-1-2 | Fixed: all advertised check categories are in `caption-check-categories`, whose exact command passed. |
| F-1-3 | Fixed: the 180-WPM threshold is listed and its exact boundary test passed. |
| F-1-4 | Fixed: real refresh and memory-only demo behavior are separately claimed, tested, and reproduced above. |
| F-1-5 | Fixed: phone first screen shows the action and result together above the fold. |
| F-1-6 | Fixed as terminology: every visitor-facing format list now says “timed TTML.” F-2-1 is a separate parser-scope failure. |
| F-1-7 | Fixed: “preflight” and “desk” are gone from visitor copy. |
| F-1-8 | Fixed: the section is named “How it works” and “Check a caption file in three steps.” |
| F-1-9 | Fixed: the art caption says “Review caption settings before upload,” and the designed 404 says “This page does not exist.” |
| F-1-10 | Fixed: README uses “this browser,” plain TypeScript instructions, and plain deployment instructions. |
| F-1-11 | Fixed: live HTML has the 1200×630 social image, Twitter metadata, and 180px Apple touch icon. |
| F-1-12 | Fixed: footer visibly says “Built by Param Factory (external site).” |
| F-V5-1 | Fixed: the four shipped SRT/TTML semantic fixtures all produced an error or warning, never “Ready to publish,” on live `/demo`. |
| F-V5-2 | Fixed: live `signal-desk.webp` returns `Cache-Control: public, max-age=0, must-revalidate`. |

The earlier defects above did not recur under their prior IDs.

## Structure and accessibility checks

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/not-a-real-page`
  returns the designed page with HTTP 404. Every checked route has one h1, one
  main landmark, route-specific browser title and description, canonical URL,
  Open Graph/Twitter social image, favicon, and touch icon.
- Header, skip link, footer, Privacy/Terms links, and external-link labelling
  are consistent. `robots.txt`, `sitemap.xml`, manifest, share image, favicon,
  and touch icon returned 200. All discovered internal links and the YouTube
  guidance and Param Factory external links returned 200.
- Client navigation to Privacy and browser Back restored the correct path,
  reset scroll, and focused the respective h1. The 390px and desktop cold loads
  had no console errors. The implementation and passed browser suite cover
  visible focus, keyboard controls, reduced motion, mobile targets, and axe
  checks.
- The live CSP is a response header with `frame-ancestors 'none'`; it permits
  only same-origin connections. The demo request log confirmed that privacy
  boundary in the exercised path.

## What would make this perfect

Accept valid namespace-prefixed TTML and add it to the tagged format claim test.
Then rerun this complete first-read review from a fresh browser context and
clean checkout. With that result reporting a caption rather than a format error,
there would be no remaining finding in this review.
