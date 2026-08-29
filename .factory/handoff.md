# Caption Style Checker — verification 11 handoff

**Independent verification result: PASS.** Candidate
`ae6e8fc9e9dcf06f32c099ac7d01e0ab34974194` was independently accepted against
the live site at <https://caption-style-checker.sociobot.in> on 29 August 2026.
All 14 declared claim commands, the complete local test suite, typecheck,
lint, production build, live privacy/header/PWA checks, keyboard/mobile/Axe
checks, and Lighthouse passed. See [verification-11.md](verification-11.md)
for exact evidence, deployment identity analysis, and the empty defect list.

## Previous builder handoff

**Result:** Complete — no known unresolved review finding.

**Product repair commit:** `255ef2fade43a890bfc5bb58ed7795ecb9f00247`

**Deployment:** `a767047f-b742-464c-a836-c1c2f27970dd`

**Live URL:** <https://caption-style-checker.sociobot.in>

**Verified:** 29 August 2026 UTC

## What changed

- Rewrote the limitations section to name what the checker does not do and
  added the tested `scope-limitations` claim.
- Renamed and behavior-tested the route-wide “Skip to main content” link.
- Renamed “Clear” to “Clear caption text” while retaining focus and Undo.
- Removed the internal design-document note from every footer.
- Updated the catalog description, README, copy audit, claims inventory, and
  release/browser/live-audit coverage.
- Rechecked every finding from reviews 1–5 without replacing the product's
  pixel signal-desk visual identity or static-web deployment class.

The one-to-one map for every numbered finding is in
[`polish-5.md`](polish-5.md).

## Verification evidence

From a clean remote clone of product commit
`255ef2fade43a890bfc5bb58ed7795ecb9f00247`:

```text
npm ci --ignore-scripts --no-audit --no-fund  PASS — 58 packages
all 14 exact claims.json commands             PASS — 14/14
npm run typecheck                             PASS
npm run lint                                  PASS
npm test                                      PASS — 37 Vitest + 40 Playwright
npm run build                                 PASS — dist/ produced
```

The deployed production build contains 25.67 KB raw / 9.45 KB gzip JavaScript
and 10.64 KB raw / 3.13 KB gzip CSS.

Post-deployment cold checks:

- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with distinct titles;
  an unknown path rendered the product 404 and returned 404.
- One-click demo, direct `?demo=1`, Reset demo, Start for real, report export,
  isolated storage, GET-only same-origin requests, and prefixed TTML passed.
- Offline reload and 200% text resizing passed.
- Axe found 0 violations across five routes at desktop and mobile sizes.
- Lighthouse scored 100 performance, 100 accessibility, 100 best practices,
  and 100 SEO (LCP 1.1 s, TBT 0 ms, CLS 0).
- The worker URL verifier found no console or page errors.

Evidence is under [`evidence/polish-5-live/`](evidence/polish-5-live/), including
`live-audit.json`, `lighthouse.json`, cold screenshots, and verifier output.
Local screenshots are under [`evidence/polish-5-local/`](evidence/polish-5-local/).

## How to verify

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
node scripts/audit-live.mjs https://caption-style-checker.sociobot.in .factory/evidence/polish-5-live
/opt/fleet/lib/verify-url.sh https://caption-style-checker.sociobot.in .factory/evidence/polish-5-live/verify-url
```

Run every `test` string in `.factory/claims.json` independently from a clean
clone to reproduce the claim matrix.

## Known gaps and next steps

None.
