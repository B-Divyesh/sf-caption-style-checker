# Independent verification 8 — FAIL

**Requested candidate:** `2c3be9fd6cb1ec0a16340df777c56be1795913de`

**Available checkout and `origin/main`:**
`2c3be9d88aec3aff126119703670ea93f8f126ba`

**Live URL:** <https://caption-style-checker.sociobot.in>

**Verified:** 29 August 2026 UTC from the supplied clean checkout.

## Decision

**FAIL — do not release this candidate.** The requested candidate object does
not exist in the supplied full clone or on the remote, so it cannot be built,
tested, or matched to the deployment. The exact fetch failed with
`upload-pack: not our ref`. The deployed product otherwise matches the
available base source after normalizing its generated service-worker cache
identifier, and most functional and quality checks pass. Independent testing
also found two high-severity product defects and two medium-severity recovery /
format defects.

## Release blockers

### RB-1 — requested candidate is unavailable

`git rev-parse HEAD` and `git ls-remote origin HEAD refs/heads/main` both return
`2c3be9d88aec3aff126119703670ea93f8f126ba`. The repository is not shallow.
`git cat-file -t 2c3be9fd6cb1ec0a16340df777c56be1795913de`
reports no such object, and an exact
`git fetch origin 2c3be9fd6cb1ec0a16340df777c56be1795913de` reports
`upload-pack: not our ref`.

The live JavaScript differs from a fresh build of the available base only in
the generated service-worker registration value (`1788023156367` live versus
`1788025544569` locally). Normalizing that value gives the same SHA-256,
`b3b62b44f1a02e8955515892905296eb5e4b0e1d6d8def0cdf1af274ca820451`.
CSS, service worker, manifest, robots, sitemap, and stable image assets compare
byte-for-byte. That proves the live site corresponds to the available base
program, not to the missing requested candidate.

### RB-2 — mandatory first claims execution failed

As required, `.factory/claims.json` was read and its commands were executed
before installation or other checks. The first literal command,
`npm run test:browser -- --grep @claim:sample-preflight`, exited 1 because
`@playwright/test` was unavailable in the clean clone
(`ERR_MODULE_NOT_FOUND`). The acceptance contract says any failing claim test
is release-blocking.

After `npm ci`, all 13 claim commands passed independently. This confirms the
claimed behavior but does not erase the required first-run failure.

## Mandatory first-read test — PASS

A new storage-free browser context opened the live root at 1440 × 900. The
first screen says:

- What: **“Check captions before upload.”**
- For whom: **“For video educators who need readable captions and clear
  speaker cues before publishing.”**
- What to click first: **“Try it with sample data,”** beside **“Loads a sample
  file and shows its warnings.”**

The action is visible without scrolling at desktop and 390 × 844 mobile. One
click opens `/?demo=1`, changes the heading to **“Check sample captions,”** and
shows nine findings plus the persistent **“Demo — sample data, nothing is
saved”** banner, **Reset demo**, and **Start for real**. Local storage remains
empty. Screenshots are in `.factory/evidence/verification-8/`.

## Claims gate after installation

`.factory/claims.json` exists and contains 13 entries. Each literal command
passed after `npm ci`:

| Claim | Result |
| --- | --- |
| `sample-preflight` | PASS |
| `local-caption-check` | PASS |
| `offline-reload` | PASS |
| `free-to-use` | PASS |
| `caption-formats` | PASS |
| `report-export` | PASS |
| `platform-review-findings` | PASS |
| `platform-rules-reviewed` | PASS |
| `caption-check-categories` | PASS |
| `reading-speed-threshold` | PASS |
| `real-session-refresh` | PASS |
| `demo-memory-isolation` | PASS |
| `accessible-preview-styles` | PASS |

Landing, demo, privacy, terms, and README copy were cross-checked against the
inventory. No additional material visitor-reliant claim was found without a
claim entry. The supplied format and semantic fixtures produced no false parse
errors.

## Local gates on the available base

These results apply to `2c3be9d88aec3aff126119703670ea93f8f126ba`, not to
the unavailable candidate:

```text
npm ci             PASS — 58 packages, 0 audit vulnerabilities
npm test           PASS — 31 Vitest + 33 Playwright tests
npm run typecheck  PASS
npm run lint       PASS
npm run build      PASS — dist/ produced
```

The production build contains 23,447 bytes JavaScript (8,691 gzip), 10,334
bytes CSS (3,092 gzip), no fonts, and a 35,104-byte hero WebP. These are well
inside the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Independent end-to-end checks

Passed live behavior:

- Actual file-picker import read a two-cue SRT, rendered both cues, persisted
  real-mode text, and reached **Ready to publish**.
- The demo loaded, reset, retained real data in a separate namespace, restored
  it on **Start for real**, changed platform rules, and exported
  `caption-report.txt` with the active platform.
- Empty input, plain text, a malformed timestamp, reversed timing, unsupported
  markup, and a file over 2 MB all avoided a false success. Valid input after
  an error recovered normally.
- A 42-character line passed and a 43-character line produced **Long caption
  line**. Exactly 180 WPM passed; above 180 WPM was flagged.
- Injected HTML did not execute or enter the DOM and was reported as unsupported
  markup.

Failed live behavior:

- A file with `JORDAN:` on cue 1 and an unlabeled speaker change on cue 2
  reports only **Speaker cue found** and gives **Ready to publish**. It does not
  identify the missing label.
- **Clear** immediately empties the textarea and removes the sole
  `caption-source` local-storage value. No confirmation or undo is offered.
- A valid TTML frame-time document using `ttp:frameRate="30"` and
  `begin="00:00:01:15"` is reported as **Cue has an invalid timestamp** despite
  the unqualified “timed TTML” support claim.
- Activating **Check captions** on an empty editor re-renders the page, moves
  focus to `body`, and announces no error. A keyboard user loses position and
  receives no action feedback.

## Accessibility, responsive behavior, and navigation

- Fresh `@axe-core/playwright` WCAG A/AA scans produced zero violations at
  1440 × 900 and 390 × 844; therefore serious/critical counts are both zero.
- The required `/opt/fleet/lib/verify-url.sh` passed after being invoked with
  its documented output directory: HTTP 200, 617 ms load, correct title,
  `lang=en`, one H1, one main landmark, complete image alt text, labelled
  buttons, and zero console/page errors.
- Desktop and mobile have no horizontal overflow. All exposed mobile links,
  buttons, selects, textarea, drop target, and radio labels are at least 44 ×
  44 CSS pixels. A 640-CSS-pixel reflow check also has no overflow.
- Keyboard traversal reaches the skip link, navigation, demo controls,
  platform selector, external guidance, file picker, editor, report, cue/style
  controls, and footer. Focus is a visible 3 px mint outline. The skip link
  moves focus to the H1/main area, and route changes restore heading focus.
- With reduced motion requested, visible animation and transition counts are
  zero; computed duration is `0.00001s`.
- Every route has one H1, route-specific title/description/canonical, and
  expected landmarks. `/`, `/demo`, `/privacy`, and `/terms` return 200; an
  unknown path returns a designed HTTP 404. All product and external guidance
  links tested return 200.

## Privacy, headers, PWA, and performance

- A full live real/demo/edit/check/platform/export/exit flow made only
  same-origin GET requests. No caption data, analytics, remote fonts, third-
  party scripts, AI service, or API request was observed. Demo edits neither
  read nor replace the seeded real caption.
- Live responses include HSTS, `nosniff`, strict-origin referrer policy, and a
  CSP restricted to self with `frame-ancestors 'none'`. Hashed JS/CSS are
  immutable for one year; HTML and `sw.js` revalidate after 30 seconds; stable
  art revalidates.
- Chromium parsed the web manifest with no errors. A fresh service worker took
  control at `/sw.js?v=1788023156367`, `registration.update()` succeeded, and
  the demo reloaded offline with all nine findings from the sole versioned
  cache.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 60 ms, max potential input delay 110
  ms, CLS 0, total transfer 48 KiB. Report:
  `.factory/evidence/verification-8/lighthouse.json`.

The product is a local static PWA with no server-side endpoint, payment,
sign-in, runtime AI, library package, or CLI. API allowance/429,
`Retry-After`, Entra tenant, backend concurrency/persistence, and clean-consumer
package checks do not apply.

## Defects by severity

### Critical / release-blocking

1. **Candidate identity cannot be established.** The requested SHA is absent
   locally and remotely, so no candidate build or live comparison is possible.
2. **The mandatory first claim command failed in the clean clone before
   installation.** The post-install rerun is 13/13 green.

### High

1. **Core missing-speaker-label check can produce false ready.** A partially
   labelled multi-speaker file is declared ready once any cue has a label.
2. **Clear causes unrecoverable local data loss.** It deletes the pasted source
   and its saved copy without confirmation or undo.

### Medium

1. **Valid frame-timed TTML is rejected.** Either support TTML frame/subframe
   time expressions or narrow the advertised format and claim test.
2. **Empty Check loses keyboard focus without feedback.** Keep focus on the
   action/editor or expose and announce an actionable validation message.

### Low

None observed.

## Required next steps

Publish or correct the candidate SHA, then rerun this verification against that
exact object. Fix the two high-severity product defects and the empty-input
focus path. Resolve the TTML support/copy mismatch. Ensure the claim commands
are runnable at the mandated gate point, then rebuild, deploy, and prove the
deployed build identity.
