# Independent verification 3 — FAIL

**Candidate:** `e3f0512347e1f4d87bfcfe1c9c7e3a5d51327c7f` (`main`)

**Live URL:** https://caption-style-checker.sociobot.in

**Verified:** 2026-08-29 UTC from the supplied clean checkout.

## Decision

**FAIL — do not release this candidate.** The live deployment matches the
candidate. This is not a deployment-only failure. The checker can silently
drop a malformed cue, accept invalid timestamps, and then say **Ready to
publish**. That contradicts the core caption-preflight job in the researched
brief. Required platform-specific review and several accessible preview styles
are also absent.

## Mandatory first checks

### Cold first read — PASS

A fresh, storage-free Chromium context opened the live root at 1440×900. The
first screen said **Check captions before upload**, identified video educators
who need readable captions and clear speaker cues, and showed **Try it with
sample data** beside “Loads a sample file and shows its warnings.” The privacy,
offline, and free facts were visible. Clicking the action once opened `/demo`
with the realistic sample, nine findings, and the persistent demo banner.

In my own words: this checks caption files before a video educator publishes;
the first action is to try the supplied sample and inspect its warnings. The
screen answers what, for whom, and what to click first.

### Claims gate — PASS after the locked dependency install

`.factory/claims.json` exists and declares 11 claims. In the dependency-free
checkout, the literal first invocation of each command could not load
`@playwright/test`. After the required `npm ci`, every exact command below ran
unchanged and passed one tagged browser test. The pre-install error is recorded
as bootstrap evidence; none of the installed claim tests failed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-preflight` | `npm run test:browser -- --grep @claim:sample-preflight` | 1 passed |
| `local-caption-check` | `npm run test:browser -- --grep @claim:local-caption-check` | 1 passed |
| `offline-reload` | `npm run test:browser -- --grep @claim:offline-reload` | 1 passed |
| `free-to-use` | `npm run test:browser -- --grep @claim:free-to-use` | 1 passed |
| `caption-formats` | `npm run test:browser -- --grep @claim:caption-formats` | 1 passed |
| `report-export` | `npm run test:browser -- --grep @claim:report-export` | 1 passed |
| `profile-review-findings` | `npm run test:browser -- --grep @claim:profile-review-findings` | 1 passed |
| `caption-check-categories` | `npm run test:browser -- --grep @claim:caption-check-categories` | 1 passed |
| `reading-speed-threshold` | `npm run test:browser -- --grep @claim:reading-speed-threshold` | 1 passed |
| `real-session-refresh` | `npm run test:browser -- --grep @claim:real-session-refresh` | 1 passed |
| `demo-memory-isolation` | `npm run test:browser -- --grep @claim:demo-memory-isolation` | 1 passed |

The green claim fixtures do not cover the malformed mixed-file and common TTML
cases described below.

## Findings

### F-V3-1 — High — malformed cues are silently discarded while the report says ready

Paste this into the live demo and choose **Check captions**:

```srt
1
00:00:01,000 --> 00:00:03,000
JORDAN: Valid cue.

2
00:00:AA,000 --> 00:00:07,000
MORGAN: This cue is silently malformed.
```

The live result is **SRT · 1 cues · 3 sec** and **Ready to publish**. Cue 2 is
discarded without an error or warning. A second invalid input using
`00:00:61,000 --> 00:00:63,000` is accepted as **Ready to publish** and reported
as a 63-second file even though SRT timestamp minutes and seconds must be in
range.

`parse()` skips every block whose timestamp does not match or converts to NaN,
then succeeds whenever at least one other cue remains. Its time parser also
adds numeric fields without validating minute/second ranges. A creator can
therefore publish a file after the checker has hidden a lost cue. This defeats
the brief's real job-to-be-done and is release blocking.

### F-V3-2 — High — the required selected-platform preflight is not implemented

The researched smallest useful product reports lost semantics and unsupported
features **per selected platform profile**. The live selector instead offers
**Placement and markup review**, **WebVTT player review**, and **Plain-text
export review**. It names no publishing platform and makes no platform-specific
result visible. The source retains an internal `youtube` key, but the product
does not tell a user what a selected publishing destination strips, rejects, or
preserves.

This is the product's stated differentiator from a general subtitle editor.
Generic markup review is useful, but it does not complete the acceptance scope.
Platform rules should be evidence-backed, dated, and described as changeable
rather than removed from the user workflow.

### F-V3-3 — Medium — the timed-TTML promise rejects common valid timing and misreads speakers

The page and README claim support for timed TTML. This valid offset-time TTML:

```xml
<tt xmlns="http://www.w3.org/ns/ttml"><body><div>
  <p begin="1s" end="3s">JORDAN: Hello world</p>
</div></body></tt>
```

returns **We could not read that caption file**. TTML offset-time expressions
such as `1s` are valid timed TTML. With the same cue expressed as clock time,
the parser succeeds but displays **No speaker labels found** even though the
visible text starts with `JORDAN:`. Speaker detection checks the raw TTML string,
which starts with the `<p>` element rather than the visible caption text.

The `caption-formats` claim test covers only one clock-time fixture, so it does
not expose either failure.

### F-V3-4 — Medium — the brief requires several accessible previews; only one exists

The researched minimum says the tool previews several accessible styles. The
live product has one fixed **Accessible high-contrast preview** and no style
choice. Cue buttons change only the cue text. A reviewer cannot compare the
same cue across several accessible treatments as contracted.

### F-V3-5 — Medium — core keyboard actions discard focus

At 390×844, focusing **Review profile** and pressing `ArrowDown` changes the
selection but immediately moves `document.activeElement` to `BODY`. A second
arrow press cannot select the next option without navigating back to the
control. Focusing **Check captions** and pressing Enter also leaves focus on
`BODY`, so the next Tab starts again at the skip link instead of continuing to
the updated report or nearby actions.

The skip link, file-control focus ring, and route-heading focus work, and axe
finds no violation. This manual keyboard defect remains because the app
replaces the complete shell on each change.

### F-V3-6 — Low — reversed timing creates a nonsensical speed warning

For `00:00:05.000 --> 00:00:03.000`, the checker correctly reports that the end
is not after the start, but it also reports **Infinity words per minute**.
Reading speed should not be calculated until duration is positive.

### F-V3-7 — Low — the required copy audit is stale and incomplete

`.factory/copy-audit.md` records “Files stay in this browser,” while the live
page says “Caption text stays in this browser.” It also omits visible landing
and empty-state strings such as “No caption file loaded,” the two-sentence empty
state guidance, the limits heading, and footer copy. The live copy inspected in
this review remains understandable and within the supplied length limits, but
the required audit is not a faithful extraction of every landing string.

## Passing local and deployment evidence

- `npm ci`: passed; 58 packages installed, with 0 audit vulnerabilities.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed — 13 Vitest tests and 23 Playwright tests.
- `GITHUB_SHA=e3f0512347e1f4d87bfcfe1c9c7e3a5d51327c7f npm run build`: passed and produced `dist/`.
- Production output: JavaScript 16.78 kB / 6.53 kB gzip, CSS 9.36 kB /
  2.90 kB gzip, no font files, and hero WebP 35,104 bytes. All static budgets pass.
- Live CSS and service worker match the candidate byte for byte. Live JS is
  byte-identical after replacing only the expected build-time worker version
  (`1787982190796` live versus the candidate SHA locally). The normalized live
  and candidate bundle are identical.
- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route returns a
  real HTTP 404. Robots, sitemap, manifest, favicon, Apple icon, social image,
  generated art, JS, and CSS all return 200. Every discovered link resolves.

## Functional checks that passed

- One-click sample, demo edit, reset, report export, exit, and restoration of a
  pre-existing real caption all work. Demo data neither reads nor overwrites
  the saved real caption.
- Normal SRT, WebVTT, clock-time TTML, empty cues, reversed times, long-line
  boundaries, and the 180/186 WPM boundary produce visible results. Plain-text
  invalid input gives an actionable error and a later valid input recovers.
- Native file selection and drag-and-drop both load and identify a caption.
  A 2,000,001-byte file is rejected with “This file is larger than 2 MB. Choose
  a smaller caption file,” leaving the current caption unchanged.
- Export downloads `caption-report.txt` with the active profile and findings.

## Accessibility and visual evidence

- `@axe-core/playwright` WCAG 2 A/AA scans at 1440×900 and 390×844 found zero
  violations, including zero serious or critical findings.
- The worker's `verify-url.sh` passed against live `/demo`: title, `lang=en`, one
  H1, main landmark, complete image alt text, named buttons, and zero console or
  page errors. It measured a 662 ms unthrottled load.
- Desktop and mobile have no horizontal overflow. Tested visible controls are
  at least 44×44 CSS pixels. A 200% text-size override retained the H1, editor,
  and 390-pixel layout without horizontal overflow.
- The skip link focuses `main`; the file control displays a 3 px mint focus
  outline; SPA route navigation focuses the destination H1. Reduced-motion mode
  reduces the report animation to 0.01 ms. Palette contrast samples range from
  9.38:1 to 17.04:1, and axe reported no contrast issue.
- Visual inspection at 390×844 confirms the product-specific pixel signal-desk
  system, readable stacking, clear status labels, and no clipped controls. The
  original generated-art prompt and provenance are recorded in
  `.factory/design.md` and the asset sidecar.

## Privacy, headers, caching, PWA, and performance

- A fresh live real-plus-demo flow recorded requests only to
  `https://caption-style-checker.sociobot.in`: the document, local JS/CSS, and
  local hero image. No caption upload, analytics, third-party font, CDN script,
  billing, authentication, or AI request occurred.
- Browser response headers include HSTS, `X-Content-Type-Options: nosniff`,
  strict-origin referrer policy, and a CSP limited to self with
  `frame-ancestors 'none'` and `connect-src 'self'`. Hashed JS/CSS and art use
  one-year immutable caching; HTML and `sw.js` use 30-second revalidation.
- After first load, `/demo` reloads offline. Registering a replacement worker
  with a new version removed both the prior version and an injected obsolete
  `caption-check-*` cache, leaving only the new cache.
- Lighthouse 12.8.2 mobile simulation on live `/demo`: Performance 99,
  Accessibility 100, Best Practices 100, SEO 100; FCP 1.39 s, LCP 1.45 s,
  CLS 0, and total blocking time 127 ms. Lighthouse does not provide lab INP;
  no INP value is claimed.

There are no product server endpoints, payment calls, sign-in, or AI runtime.
The API allowance/429 and Sociobot Entra authority checks do not apply. Package
consumer testing also does not apply to this static-web artifact.

## Required next steps

1. Preserve and report every parsed caption block. Reject invalid timestamp
   ranges, and add mixed-valid/invalid regression fixtures that must never yield
   **Ready to publish**.
2. Implement evidence-backed, dated publishing-platform profiles or explicitly
   revise the product contract; generic review profiles do not meet the current
   brief.
3. Support common TTML timing expressions and detect visible TTML speaker
   labels, with claim fixtures for both.
4. Add multiple useful accessible preview styles as required by the brief.
5. Preserve or deliberately move keyboard focus after checks/profile changes,
   suppress speed calculations for non-positive durations, and regenerate the
   complete copy audit.
