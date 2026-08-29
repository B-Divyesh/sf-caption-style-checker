# Independent verification 4 — FAIL

**Candidate:** `3f1dff133a71e49ac1747602e08f3f098a946bed` (`main`)

**Live URL:** https://caption-style-checker.sociobot.in

**Verified:** 2026-08-29 UTC from the supplied clean checkout.

## Decision

**FAIL — do not release this candidate.** The live deployment matches the
candidate. This is not a deployment-only failure. Pasted caption text is
silently discarded by a normal platform change or refresh, unsupported WebVTT
tags can receive **Ready to publish**, and valid timed TTML using `dur` is
reported as an invalid timestamp. These failures affect the brief's core local
preflight job.

## Mandatory first checks

### Cold first read — PASS

A new, storage-free Chromium context opened the live root at 1440×900. The
first screen says **Check captions before upload**, names video educators who
need readable captions and clear speaker cues, and shows **Try it with sample
data** beside “Loads a sample file and shows its warnings.” The action and its
outcome are also inside the first 390×844 viewport.

In plain words: this checks caption files for video educators before they
publish; click the sample action first to see a populated warning report. The
page answers what, for whom, and what to click first. One click opens `/demo`
with the persistent sandbox banner and nine visible findings.

### Declared claims — PASS after the locked install

`.factory/claims.json` exists and declares 12 claims. The literal first command
in the dependency-free clone could not import `@playwright/test`. After the
required `npm ci`, every exact command ran independently and passed one tagged
browser test:

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-preflight` | `npm run test:browser -- --grep @claim:sample-preflight` | 1 passed |
| `local-caption-check` | `npm run test:browser -- --grep @claim:local-caption-check` | 1 passed |
| `offline-reload` | `npm run test:browser -- --grep @claim:offline-reload` | 1 passed |
| `free-to-use` | `npm run test:browser -- --grep @claim:free-to-use` | 1 passed |
| `caption-formats` | `npm run test:browser -- --grep @claim:caption-formats` | 1 passed |
| `report-export` | `npm run test:browser -- --grep @claim:report-export` | 1 passed |
| `platform-review-findings` | `npm run test:browser -- --grep @claim:platform-review-findings` | 1 passed |
| `caption-check-categories` | `npm run test:browser -- --grep @claim:caption-check-categories` | 1 passed |
| `reading-speed-threshold` | `npm run test:browser -- --grep @claim:reading-speed-threshold` | 1 passed |
| `real-session-refresh` | `npm run test:browser -- --grep @claim:real-session-refresh` | 1 passed |
| `demo-memory-isolation` | `npm run test:browser -- --grep @claim:demo-memory-isolation` | 1 passed |
| `accessible-preview-styles` | `npm run test:browser -- --grep @claim:accessible-preview-styles` | 1 passed |

The green fixtures do not cover the normal loss triggers or format cases below.

## Findings

### F-V4-1 — High — platform changes and refresh silently discard pasted text

The product tells users to **Load**, then **Choose** a publishing platform, and
explicitly permits pasted caption text. That order loses the pasted text.

Reproduction on the live `/demo`:

1. Replace the sample with `1\n00:00:01,000 --> 00:00:03,000\nUNIQUE: edit`.
2. Do not press **Check captions**. Change **Publishing platform** to **HTML
   video track**.
3. The textarea silently reverts to the shipped 337-byte WebVTT sample.

In real mode with empty storage, filling the textarea and reloading likewise
returns an empty textarea and `localStorage.getItem('caption-source') === null`.
The `real-session-refresh` claim test presses **Check captions** before reload,
so it does not prove the public statement that the current text is saved for
refresh. File selection and drag/drop do persist; the defect affects the
advertised paste path.

This is release-blocking user data loss in the smallest useful workflow.

### F-V4-2 — High — unsupported WebVTT tags are stripped without a finding

Paste and check:

```vtt
WEBVTT

00:00:01.000 --> 00:00:03.000
<foo>Meaning</foo>
```

The live YouTube profile reports **Ready to publish** and only “No speaker
labels found.” It strips `<foo>` for preview and never reports unsupported
markup. The brief specifically requires unsupported-tag findings per selected
platform profile. The existing category claim covers known sample tags such as
`<v>` and `<i>`, not an unsupported tag, so the core omission remains hidden.

### F-V4-3 — High — valid timed TTML with `dur` is rejected

Paste and check this valid TTML timing form:

```xml
<tt><body><div><p begin="1s" dur="2s">JORDAN: Duration.</p></div></body></tt>
```

The live result is **1 fix needed** and **Cue has an invalid timestamp**, with
`end=""`. TTML2 defines `dur` as a timing attribute; this cue has a two-second
duration. The public “Reads WebVTT, SRT, and timed TTML” claim therefore yields
a false parse error for a standard timing form. The claim fixture covers only
`begin` plus `end`.

Reference used for validation: https://www.w3.org/TR/ttml2/#timing-attribute-dur

### F-V4-4 — Medium — character references remain encoded in the preview

For a WebVTT cue containing `JORDAN: Fish &amp; chips`, the cue preview displays
the literal text `JORDAN: Fish &amp; chips` instead of `JORDAN: Fish & chips`.
The shared text cleaner removes tags but does not decode WebVTT/XML character
references. This makes the accessibility preview differ from rendered caption
meaning and can distort text-length checks.

### F-V4-5 — Medium — the dated platform-rules claim is not in the claim inventory

The live checker states **Rules reviewed 29 August 2026**, and README says the
platform rules were reviewed against linked YouTube and WebVTT guidance. No
entry in `.factory/claims.json` lists that dated/source-backed rules claim, and
the platform claim test checks only one SRT format difference. Under the claims
contract, this user-reliant provenance statement must have an observable test
or be removed/rephrased.

### F-V4-6 — Medium — fresh Lighthouse performance is below the stated budget

Three fresh Lighthouse 12.8.2 mobile runs against live `/demo` scored **85**,
**89**, and **90** for Performance (median **89**). The contract requires at
least 90. LCP remained 1.03–1.26 seconds and CLS was 0, but total blocking time
ranged from 396–595 ms. The first full run scored 100 for Accessibility, Best
Practices, and SEO. Bundle-size budgets pass, but the measured performance gate
is not reliably met.

## Passing local and deployment evidence

- `npm ci`: 58 packages installed; zero reported vulnerabilities.
- `npm audit --audit-level=high`, `npm run typecheck`, and `npm run lint`: pass.
  The `lint` script currently runs TypeScript checking; no separate source
  linter is configured.
- `npm test`: 19 Vitest release/unit tests and 26 Playwright tests pass.
- `GITHUB_SHA=3f1dff133a71e49ac1747602e08f3f098a946bed npm run build`: pass and
  creates `dist/` with `index.html`.
- Production JavaScript is 19.61 kB raw / 7.54 kB gzip; CSS is 10.33 kB raw /
  3.09 kB gzip; there are no font files; the hero WebP is 35.10 kB. All static
  asset-size budgets pass.
- Live HTML and CSS match the candidate build. Live `sw.js` matches byte for
  byte. Live JavaScript SHA-256 is `b034051b…8f66`; the local candidate is
  `f0db998e…6866`. Replacing only the live build-time worker version
  `1787987242381` with the candidate SHA makes the bundle byte-identical at
  `f0db998e…6866`. The deployed source is the candidate.

## Functional, accessibility, privacy, and PWA evidence

- Normal SRT, WebVTT, and TTML offset-time files are detected. A TTML `region`
  produces the placement warning. The HTML track profile rejects non-WebVTT.
- Plain text gives an actionable parse error and a later valid input recovers.
  Mixed valid/malformed SRT, seconds over 59, reversed timing, and empty cues
  never report ready. Exactly 180 WPM passes; 186 WPM is flagged.
- File selection and drag/drop work. A 2,000,001-byte file shows the documented
  size error and leaves the previous caption intact. Report export contains the
  chosen platform and visible finding. Clear removes the stale preview.
- Demo edits stay separate from saved real text; Reset restores the sample;
  Start for real restores the real caption and removes the banner.
- Desktop 1440×900 and mobile 390×844 have no horizontal overflow. Mobile
  controls are at least 44×44 CSS pixels. A 200% text-size check retained the
  heading/editor without horizontal overflow.
- Axe WCAG 2 A/AA found zero serious/critical violations at both sizes. The
  factory URL verifier found one H1, `lang=en`, a main landmark, complete image
  alternatives, named buttons, and no console/page errors. Keyboard checks
  passed for the skip link, file focus ring, platform selector, report focus,
  and SPA route-heading focus. Reduced motion changes report animation to
  0.01 ms.
- All requests throughout the exercised demo and edit/export flows were to
  `https://caption-style-checker.sociobot.in`. No caption upload, analytics,
  remote font/script, authentication, payment, billing, or AI request occurred.
- Live headers include HTTPS/HSTS, `nosniff`, strict-origin referrer policy,
  same-origin CSP/connect policy, and `frame-ancestors 'none'`. HTML and
  `sw.js` use 30-second revalidation; hashed assets use a one-year immutable
  cache.
- Offline reload passes after the service worker controls `/demo`. A fully
  activated replacement worker deletes the previous version and an injected
  obsolete cache, leaving only its new cache.
- `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap, manifest, icons, social
  art, and production assets return 200. An unknown route returns the designed
  page with HTTP 404. All discovered intended links resolve; route titles,
  descriptions, canonicals, one-H1 structure, and history navigation pass.

There are no product server endpoints, sign-in, payment, AI, package, or CLI.
API allowance/429, Entra authority, backend concurrency/persistence, and clean
consumer-install checks do not apply to this static-web artifact.

Evidence from the factory URL verifier and desktop/mobile captures is in
`.factory/evidence/verification-4/`.

## Required repair and re-verification

1. Persist textarea input as it changes, in the correct real/demo namespace,
   before any rerender or reload. Add tests for paste → platform change and
   paste → refresh without pressing Check.
2. Detect and report unsupported cue tags for every platform profile. Add a
   fixture with an unknown WebVTT tag that must not report ready.
3. Support standard TTML `dur` timing, or narrow the product's TTML claim and
   explain the accepted timing subset beside the input.
4. Decode valid WebVTT/XML character references before preview and lint text
   analysis, with regressions for `&amp;`, `&lt;`, and numeric references.
5. Add a listed observable test for the dated platform-rule provenance claim,
   or remove the claim. Recheck mobile performance until the ≥90 gate is stable.
