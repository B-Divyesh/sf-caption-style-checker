# Polish round 2 handoff

## Outcome

**Ready for deployment.** This repair resolves the sole blocker in adversarial
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

## Verification before deployment

```sh
npm ci
npm run test:unit                   # 30 passed
npm run test:browser -- --grep @claim:caption-formats  # 1 passed
npm run typecheck
npm run lint
npm run build                        # dist/ with root index.html
```

The complete clean-clone claim run, full browser/accessibility/privacy/offline
suite, live deployment check, and the precise deployed commit are recorded in
the deployment evidence appended to this file after deployment. See
`.factory/polish-2.md` for the finding-by-finding map.

## Known gaps / next steps

No known functional or review finding remains. This is a local-first static
PWA: no server, sign-in, payments, analytics, or runtime AI feature exists.
