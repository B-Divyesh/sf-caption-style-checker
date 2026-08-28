# Independent verification — FAIL

**Candidate:** `dba7c26bbbbd3f573c0b08709292ee0b5d19b57d` (`main`)

**Live URL:** https://caption-style-checker.sociobot.in

**Verified:** 2026-08-28 UTC

## Decision

**FAIL — do not release this candidate.** The deployment is the tested
candidate, but it has a false positive on valid timed TTML and its required
demo sandbox does not discard sample data or allow a visitor to try edits.
There are also unlisted product claims and accessibility/update defects below.

## Required first checks

### Cold first read — PASS

A new browser context opened the live root page. The first screen plainly says
“Check captions before upload,” names “video educators” who need speaker cues
and readable meaning to survive publishing, and offers the one-click **Try it
with sample data** action with “Loads a sample file and its warnings.” The
three privacy/offline/free facts are also visible. It therefore answers what,
for whom, and what to click first.

### Declared claims — PASS

`.factory/claims.json` exists and each exact command passed after `npm ci`:

| Claim | Command | Result |
| --- | --- | --- |
| `sample-preflight` | `npm run test:browser -- --grep @claim:sample-preflight` | 1 passed |
| `local-caption-check` | `npm run test:browser -- --grep @claim:local-caption-check` | 1 passed |
| `offline-reload` | `npm run test:browser -- --grep @claim:offline-reload` | 1 passed |
| `free-to-use` | `npm run test:browser -- --grep @claim:free-to-use` | 1 passed |

## Build and deployment identity

- `npm ci`: passed (58 packages; 0 vulnerabilities reported).
- `npm test`: passed — 6 Vitest parser tests and 4 Playwright browser tests.
- `npm run build`: passed. Output is `dist/`; generated JS is 14.97 kB
  (6.10 kB gzip), CSS 8.82 kB (2.76 kB gzip), and hero WebP 35.10 kB.
- The live root HTML, JS, CSS, and hero asset matched the fresh build byte for
  byte (SHA-256 respectively `2b69aa14…314b5`, `8ebd8f1f…826ff`,
  `b0ebad81…d201ce`, and `878f72db…1b45cd`). This is not a deployment-only
  failure.

## Functional evidence

On the live site, in fresh browser contexts at desktop 1440px and mobile 390px:

- A normal SRT cue produced “Ready to publish.”
- Invalid plain text produced the actionable “We could not read that caption
  file” recovery message.
- A reversed-time WebVTT cue produced “End time is not after start time.”
- The sample loaded its visible warnings and exported a non-empty
  `caption-report.txt` containing its finding.
- There was no horizontal overflow at 390px and no browser console or page
  errors in the exercised flows.
- A fresh `/demo` made only same-origin requests. No analytics, remote font,
  or third-party runtime request was observed. There is no server API or sign
  in, so rate-limit and identity-provider checks do not apply.

## Release-blocking defects

### High — valid timed TTML gets a false placement warning

**Reproduction:** On the deployed checker paste and check:

```xml
<tt><body><div><p begin="00:00:01.000" end="00:00:03.000">Hello <span>world</span></p></div></body></tt>
```

It parses as one TTML cue but reports “Placement may be lost — YouTube basic
captions can flatten cue placement or alignment settings.” This fixture has no
placement or alignment setting; `begin` and `end` are the required timing
attributes. The linter treats all `<p>` attributes as cue settings. This makes
one of the three advertised formats produce a misleading semantic warning and
undermines the checker’s preflight purpose.

### High — the required demo sandbox cannot be edited and does not discard sample data

**Reproduction:** At `/demo`, replace the caption textarea with a one-cue SRT
and press **Check captions**. The textarea is restored to the shipped 337-byte
WebVTT sample. Then press **Start for real**: the real page still contains that
sample rather than an empty/previous real session. The demo contract requires
an isolated sandbox and says leaving demo discards its data. It also prevents a
visitor from trying the checker with a small custom sandbox input.

### High — user-visible claims are missing from `.factory/claims.json`

The required claim inventory does not cover the visible **Export report**
promise or the public statements that the checker reads WebVTT, SRT, and timed
TTML. The existing tests happen to exercise export and formats, but no claim
entries identify those promises or tie them to their observable tests. The
claims contract requires each visitor-reliant claim to be listed and tested;
unlisted claims fail review until a matching claim/test is added or the copy is
removed.

## Other defects

### Medium — service-worker cache is not versioned for an update

`public/sw.js` hard-codes `const CACHE = 'caption-check-v1'` and uses
cache-first responses, including navigations. It never deletes/replaces a
versioned cache. A later deploy can therefore continue serving the cached root
HTML and old shell rather than reliably updating. Offline reload of the current
version passed, but the PWA update requirement is not met.

### Medium — keyboard focus is invisible on file selection and route changes lose focus

At 390px, tabbing reaches the native `#file` control, but it is an opaque
1×1px input inside the large drop label; its focus indicator is not visible.
After keyboard activation of a SPA navigation link, `document.activeElement`
is `BODY`, not the new page’s H1. The H1 is not focusable and CSS explicitly
removes its outline. This fails the required visible focus and route-change
focus management.

### Low — stale cue preview remains after clearing or a parse error

After checking a valid file, **Clear** changes the results pane to the empty
state but leaves the old cue preview on screen. The same stale preview remains
behind a later parse error. Clear/report error recovery should remove it.

### Low — unknown routes render the visual 404 with HTTP 200

`/not-a-real-page` renders the SPA’s “Page not found” content but the live host
returns HTTP 200 because navigation fallback rewrites it to `index.html`.

## Accessibility, policies, and routing evidence

- Axe 4.11 run against `/demo` at 1440px and 390px: **0 violations** in WCAG
  2 A/AA; the manual keyboard findings above remain release defects.
- `prefers-reduced-motion: reduce` applies a 0.01ms reduced-motion duration;
  the app reported no console/page errors under that setting.
- The live document has `lang=en`, a descriptive title, one H1, a skip link,
  `main`, meaningful hero-image alt text, privacy/terms routes, and a visible
  CSP. HTTP response checks found HTTPS/HSTS, `nosniff`, strict referrer policy,
  `frame-ancestors 'none'`, same-origin `connect-src`, and immutable caching
  for the hashed JS asset. `/`, `/demo`, `/privacy`, `/terms`, robots,
  sitemap, manifest, and favicon return 200.
- A Lighthouse mobile command was attempted independently, but this container’s
  Lighthouse launcher cannot use the preinstalled Playwright Chromium as root
  (Chrome launcher reports no supported Chrome / then omits `--no-sandbox`).
  No independent Lighthouse score is claimed; Playwright/axe and bundle
  measurements above completed.

## Required repair and re-verification

1. Parse TTML timing separately from actual layout/placement attributes, and
   add a regression fixture with `begin`/`end` only that has no placement
   finding.
2. Keep editable demo state in a demo-only namespace, reset it only on Reset,
   and discard it on Start for real; add browser tests for both behavior.
3. Add claims and tagged observable tests for every public format/export
   promise, or remove those promises.
4. Version the service-worker cache per build and verify a prior cached shell
   updates to the new shell.
5. Make the file-picker focus visible, move focus to a focusable H1 after
   route changes, and clear `report` when source parsing/clearing fails.

