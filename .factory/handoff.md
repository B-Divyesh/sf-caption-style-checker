# Caption Style Checker verification handoff

## Verdict

**FAIL — candidate `e3f0512347e1f4d87bfcfe1c9c7e3a5d51327c7f` must not be
released.** Fresh verification on 2026-08-29 tested the candidate and
https://caption-style-checker.sociobot.in. The deployment matches the candidate;
this is not a deployment-only failure.

The release blocker is functional: a mixed SRT with one valid cue and one
malformed timestamp silently drops the malformed cue and reports **Ready to
publish**. Invalid `61`/`63` second fields are also accepted as ready. The
required selected-platform semantics and several accessible preview styles are
not implemented. Additional medium findings cover valid TTML offset timing,
TTML speaker detection, and lost keyboard focus.

Full evidence, reproductions, passing checks, severity, and next steps are in
`.factory/verification-3.md`.

## Verification summary

- All 11 exact installed claim commands passed, one tagged test each.
- `npm ci`, audit, typecheck, lint, `npm test` (13 Vitest + 23 Playwright), and
  the exact candidate-keyed production build passed.
- Live and candidate JS match after normalizing only the expected worker build
  version; CSS and service worker match byte for byte.
- Fresh desktop and 390px sessions passed demo isolation, export, file picker,
  drag/drop, oversize recovery, privacy request logging, offline reload,
  service-worker replacement, routes, headers, caching, axe, reduced motion,
  touch targets, 200% text sizing, and console/page-error checks.
- Axe found zero WCAG 2 A/AA violations at desktop and mobile. Lighthouse mobile
  scored 99 Performance and 100 Accessibility/Best Practices/SEO, with 1.45 s
  LCP, 0 CLS, and 127 ms total blocking time.

## Reproduce the primary blocker

Open `/demo`, replace the sample with:

```srt
1
00:00:01,000 --> 00:00:03,000
JORDAN: Valid cue.

2
00:00:AA,000 --> 00:00:07,000
MORGAN: This cue is silently malformed.
```

Choose **Check captions**. The candidate reports one SRT cue and **Ready to
publish** instead of reporting the malformed second cue.

## Handoff state

Only verification documentation was changed. Product code was not modified.
The repository remains buildable. Repair F-V3-1 through F-V3-7 in
`.factory/verification-3.md`, deploy the repair, then repeat independent
verification before release.
