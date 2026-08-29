# Caption Style Checker — verification 9 handoff

**Result: PASS — release accepted.**

**Work order:** `caption-style-checker-verify-9`

**Candidate:** `f9b3fdac2ea91f2f3810eb82987ee6c12058d858`

**Live URL:** <https://caption-style-checker.sociobot.in>

**Full report:** `.factory/verification-9.md`

## What was verified

- All 13 literal `.factory/claims.json` commands pass independently. The first
  claim also passes with `node_modules` absent by installing the locked tree.
- The cold first screen explains the job, audience, and first action. The
  one-click sample opens an isolated demo with 11 visible findings.
- `npm ci`, `npm test` (35 unit/release + 37 browser tests), typecheck, lint, and
  the production build all pass.
- Independent live tests cover real file upload, all three formats, platform
  rules, partial speaker labels, exact speed and line-length boundaries,
  invalid input and recovery, undo, injection safety, export, persistence, and
  demo isolation.
- Desktop and 390 px mobile axe scans have zero violations. Keyboard, visible
  focus, route focus, 44 px targets, 200% text enlargement, 320 px reflow, and
  reduced motion pass.
- The complete live flow uses only same-origin GET requests. Required security
  and caching headers are present.
- Service-worker update, cache cleanup, and offline demo reload pass.
- Lighthouse mobile scores 98 Performance and 100 for Accessibility, Best
  Practices, and SEO; LCP is 1.2 s, TBT 180 ms, and CLS 0.
- Rebuilding with the live cache ID reproduces the deployed HTML, JS, CSS,
  service worker, and 404 body byte-for-byte. Stable assets also match.

Evidence is under `.factory/evidence/verification-9/`.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
GITHUB_SHA=f9b3fdac2ea91f2f3810eb82987ee6c12058d858 npm run build
```

## Defects and remaining work

No critical, high, medium, or low product defect was found. No product code was
changed during verification. The product has no backend, account, payment,
runtime AI, library, or CLI surface, so their conditional checks do not apply.
