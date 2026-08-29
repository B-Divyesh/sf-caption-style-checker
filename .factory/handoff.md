# Caption Style Checker independent verification 6 handoff

## Current release decision

**PASS — candidate `6c623bbf00f1945fbeac895c473a56eb0772e6aa` is approved for release.**

An independent clean-checkout verification on 29 August 2026 UTC passed every
claim test, all local quality gates, live functional/privacy/accessibility/PWA
checks, and the mobile Lighthouse run. The deployment at
https://caption-style-checker.sociobot.in matches the candidate executable
after normalizing only the expected build-specific service-worker cache ID.
There are no critical, high, medium, or low defects. Full evidence and exact
commands are in `.factory/verification-6.md`. No product code was changed by
the verifier.

---

# Repair 5 handoff (historical context)

## Outcome

**PASS — release blockers from verifier report commit `fa2763e6` are repaired.**

Product repair commit: `b5b6318e75600372454747f7d0c0e0a8c87ee383`.
Production URL: https://caption-style-checker.sociobot.in
Azure Static Web Apps deployment: `99dbf988-6949-4e8d-9983-da45a63367cf`.
Verified on 29 August 2026 UTC.

## Reproduction before repair

The four exact F-V5-1 inputs from `.factory/verification-5.md` were submitted
to an untouched production build of candidate `288227a`. All four displayed
`Ready to publish`:

- unsupported `<foo>` SRT: only `No speaker labels found`;
- SRT `<font color="red">`: only `No speaker labels found`;
- TTML referenced `tts:color`: only `No speaker labels found`;
- TTML referenced `tts:origin`: only `Speaker cue found`.

The live hero also returned `Cache-Control: public, max-age=31536000,
immutable` before repair.

## Repairs

- Added format-specific SRT markup checks. Known visual markup produces a
  review warning; unknown tags produce an error.
- Added TTML presentation-property detection for inline and referenced styles.
  Style references are followed through chains. Color and related appearance
  properties produce a style warning; referenced placement properties feed the
  placement warning. Missing references and unknown TTML cue tags are reported.
- Kept TTML timing attributes separate from presentation attributes, preserving
  the previous passing `begin`/`end` and `begin`/`dur` behavior.
- Added the verifier's four complete files under `tests/fixtures/` and covered
  them in unit, browser, and tagged `@claim:caption-formats` tests. None can
  display `Ready to publish`.
- Added explicit revalidation policies for the stable hero and social image
  paths before the immutable hashed-asset rule.
- Added the claim sandbox detail and ignored Playwright's generated test output.

## Clean verification

The following completed from a clean dependency install:

```sh
npm ci
npm audit --audit-level=high
npm run typecheck
npm run lint
npm test
GITHUB_SHA=b5b6318e75600372454747f7d0c0e0a8c87ee383 npm run build
```

Results:

- install/audit: 58 packages, 0 vulnerabilities;
- typecheck and lint: passed;
- Vitest: 29 passed;
- Playwright: 32 passed, including all 13 declared claim tests;
- production output: `dist/` with root `index.html`;
- JS: 23.33 kB raw / 8.71 kB gzip;
- CSS: 10.33 kB raw / 3.08 kB gzip;
- hero: 35.10 kB; social image: 78.79 kB; no fonts.

The full suite covers file input and drag/drop, parsing boundaries, report
export, demo isolation/reset, real-session refresh, desktop and 390 px layout,
keyboard focus, axe WCAG 2 A/AA, touch targets, reduced motion, same-origin
privacy, service-worker replacement/cache cleanup, offline reload, routing,
metadata, and real 404 policy. Package/consumer, backend rate-limit, sign-in,
payment, and AI checks do not apply to this local-first static product.

## Live evidence

The factory URL verifier returned HTTP 200 for `/demo`, load time 574 ms, no
console errors, `lang=en`, one H1, one main landmark, no missing image alt text,
and no unnamed buttons.

Fresh Chromium contexts at 1440×900 and 390×844 produced the same results:

| Fixture | Live result |
| --- | --- |
| Unsupported SRT tag | `1 fix needed` + `Unsupported SRT tag` |
| Styled SRT text | `1 warning to review` + `Check SRT styling after upload` |
| TTML referenced color | `1 warning to review` + `Check TTML styling after upload` |
| TTML referenced placement | `1 warning to review` + `Check placement after YouTube upload` |

Both viewports had zero serious/critical axe findings, zero console errors, no
horizontal overflow, same-origin requests only, and keyboard route focus on the
new H1. At 390 px, 200% text retained the H1, checker, and results without
horizontal overflow. A fresh live `/demo` also reloaded successfully offline.

Live response checks found `/`, `/demo`, `/privacy`, `/terms`, robots, sitemap,
manifest, and favicon at 200; the unknown-route check returned 404. HSTS,
`nosniff`, strict referrer policy, and the same-origin CSP with
`frame-ancestors 'none'` are present. Both stable images now return
`public, max-age=0, must-revalidate`.

The live JS is `assets/main-BV9xQjlY.js`; its SHA-256 is
`0efd486ab9dfa74518b6a8f57dfe2c928d89a4d09d05ebf0dd1f6aedf69fe2b4`,
identical to `dist/`, and it contains the full repair commit ID. HTML, CSS,
hero, and social-image hashes also matched the deployed files.

Three live Lighthouse 12.8.2 mobile runs scored 100 for Performance,
Accessibility, Best Practices, and SEO. LCP was 1,141 / 822 / 845 ms; TBT was
46 / 4 / 20 ms; CLS was 0 in every run.

## Known gaps and next steps

No release-blocking gap remains from independent verification 5. Platform
caption behavior can change; the product keeps its dated source links and asks
users to preview the final upload.
