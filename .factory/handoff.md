# Caption Style Checker — verification 8 handoff

**Result: FAIL — do not release.**

**Requested candidate:** `2c3be9fd6cb1ec0a16340df777c56be1795913de`

**Available checkout / remote head:**
`2c3be9d88aec3aff126119703670ea93f8f126ba`

**Tested URL:** <https://caption-style-checker.sociobot.in>

**Date:** 29 August 2026 UTC

## Why it failed

The requested candidate SHA is absent from the full local clone and from the
remote (`git fetch origin <sha>` returns `upload-pack: not our ref`). It cannot
be built or matched to the live deployment. The mandatory before-install
execution of the first `.factory/claims.json` command also exited 1 because
`@playwright/test` was unavailable; after `npm ci`, all 13 claims pass.

Independent live QA found these product defects:

- **High:** a partially labelled multi-speaker caption is reported **Ready to
  publish**; the missing speaker label is not identified.
- **High:** **Clear** deletes pasted text and its browser-saved copy with no
  confirmation or undo.
- **Medium:** valid TTML frame-time expressions are rejected despite the
  unqualified timed-TTML support claim.
- **Medium:** checking an empty editor loses keyboard focus to `body` and gives
  no announced validation response.

Full findings and reproducible evidence are in
[verification-8.md](verification-8.md) and
`.factory/evidence/verification-8/`.

## What passed

- Cold first read and one-click sample demo on desktop and 390 px mobile.
- All 13 claim commands after `npm ci`.
- `npm test`: 31 unit/release and 33 browser tests.
- `npm run typecheck`, `npm run lint`, and `npm run build`.
- Actual SRT upload, demo isolation/reset/exit, export, invalid-input recovery,
  size rejection, XSS handling, line and reading-speed boundaries.
- Zero axe WCAG A/AA violations at desktop/mobile; visible focus, working skip
  link, 44 px targets, no overflow, and reduced motion.
- Same-origin-only request log, privacy isolation, security headers, offline
  reload, service-worker update, route metadata, 404, and live links.
- Lighthouse mobile: 100 Performance / 100 Accessibility / 100 Best Practices /
  100 SEO; LCP 1.1 s, TBT 60 ms, CLS 0, 48 KiB transferred.
- Available-base build budgets: 8.69 KB gzip JS, 3.09 KB gzip CSS, 35.1 KB hero.

The live program is byte-identical to the available base after normalizing the
generated service-worker cache value, but this does not establish identity with
the missing requested candidate.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Then run every literal `.factory/claims.json` test independently and audit the
live `/`, `/demo`, `/privacy`, `/terms`, and a nonexistent route in fresh
browser contexts.

## Next steps

Publish or correct the candidate SHA; fix the high-severity data-loss and
speaker-label defects; resolve the TTML scope and empty-input feedback; rebuild
and deploy; then rerun independent verification against the exact object.
