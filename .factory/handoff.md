# Polish round 2 handoff

## Outcome

**Deployed and verified.** This repair resolves the sole blocker in adversarial
review 2 and preserves the repaired behaviors from every earlier review.
Timed TTML now accepts the standard namespace-prefixed element form such as
`<tt:tt>` and `<tt:p>`, including prefixed `span`, `br`, and `style` elements.

## Repair

- `src/lint.ts` recognizes TTML by local element name, not only unprefixed
  tag spelling. It extracts namespaced paragraph cues, recognizes namespaced
  style and semantic elements, normalizes namespaced tag names, and renders
  namespaced line breaks as spaces.
- `tests/fixtures/prefixed-timed.ttml` is the ordinary prefixed TTML file from
  the review case. Unit coverage verifies its parsed text and cue count.
- The existing tagged `@claim:caption-formats` browser test now submits that
  fixture from fresh `/demo` alongside WebVTT, SRT, ordinary TTML, and the
  earlier SRT/TTML semantic fixtures.
- The catalog description is now the verb-first sentence “Check caption files
  before upload.”

## Verification

```sh
npm ci                              # clean clone; 0 audit vulnerabilities
npm run test:unit                   # 30 passed
npm run test:browser -- --grep @claim:caption-formats  # 1 passed
npm run typecheck
npm run lint
npm run build                        # dist/ with root index.html
```

From a separate fresh clone of commit
`8078e797c7a9c0c9c334a2694362553991cc0619`, all 13 literal commands from
`.factory/claims.json` passed, followed by `npm test` (30 Vitest/release and
32 Playwright tests), typecheck, lint, and `GITHUB_SHA=<commit> npm run build`.

Deployment `58d39fb4-ea06-4892-8c63-73bf565bd11d` completed through the static
work-order deployment. The cold live verifier at `/demo` returned HTTP 200 in
576 ms with no console errors, one H1/main, `lang=en`, complete image alt text,
and named buttons. The live prefixed-TTML reproduction produced
`TTML · 1 cue · 3 sec` with no parse-error heading. Live desktop/mobile Axe
WCAG 2 A/AA had zero serious or critical violations, no overflow or console
errors, and only same-origin requests. Live route checks confirmed 200 for
`/`, `/demo`, `/privacy`, `/terms` and a designed HTTP 404 for an unknown URL.
Evidence is under `.factory/evidence/polish-2-live/`; see
`.factory/polish-2.md` for the finding-by-finding map.

## Known gaps / next steps

No known functional or review finding remains. This is a local-first static
PWA: no server, sign-in, payments, analytics, or runtime AI feature exists.
