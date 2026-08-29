# Caption Style Checker repair handoff

## Outcome

All seven findings in `.factory/verification-3.md` for candidate `e3f0512`
are repaired. The implementation is in commits `5d3b92f` and `1f36ec2` on
`main`. The static artifact was deployed to
https://caption-style-checker.sociobot.in with Azure Static Web Apps deployment
`f236eed5-14af-4ae9-8881-5d8a20222d23`.

## Finding-by-finding repair

| Finding | Root-cause repair | Exact regression |
| --- | --- | --- |
| F-V3-1 malformed SRT | The parser now retains source cue ordinals, reports every malformed cue, validates minute/second ranges, and prevents a malformed file from reporting ready. | `F-V3-1 reports a malformed cue beside a valid SRT cue`; `F-V3-1 rejects invalid SRT minute and second fields`; browser test `F-V3-1 malformed SRT cues and invalid seconds can never report ready` |
| F-V3-2 selected platform | The selector now names YouTube upload and HTML video track. Profiles apply different format, placement, and markup rules. Each displays its source and 29 August 2026 review date. | `F-V3-2 applies the selected publishing platform format rules`; `@claim:platform-review-findings` |
| F-V3-3 TTML | TTML accepts clock and offset units (`h`, `m`, `s`, `ms`). Speaker detection now uses visible cue text as well as WebVTT voice tags. | `F-V3-3 reads TTML offset times and visible speaker labels`; expanded `@claim:caption-formats` fixture |
| F-V3-4 preview styles | The cue preview now offers native radio controls for white-on-black, black-on-white, and yellow-on-black treatments. | `@claim:accessible-preview-styles` asserts all three rendered foreground/background pairs |
| F-V3-5 keyboard focus | Platform rerenders restore focus synchronously to the select. Checking moves focus to the report heading. Cue/style controls update in place. Route heading and file focus behavior remain intact. | `F-V3-5 keyboard platform changes and checks retain a useful focus position`; existing file/route focus regression |
| F-V3-6 reversed speed | Reading speed is calculated only for positive durations. | `F-V3-6 does not calculate reading speed for reversed timing` |
| F-V3-7 copy audit | The audit now inventories the fresh landing, empty state, demo/report states, footer, current browser-local wording, and terminology. | `F-V3-7 keeps the copy audit aligned with every previously omitted landing state` |

## Verification evidence

- Reproduced the original mixed-SRT failure before edits: it displayed one cue
  and “Ready to publish.” The repaired live page displays two source cues,
  “1 fix needed,” and “Cue has an invalid timestamp” for cue 2. The `61`/`63`
  second fixture is also blocked.
- Clean `npm ci`: 58 packages, zero vulnerabilities. `npm audit
  --audit-level=high`: zero vulnerabilities.
- `npm run typecheck` and `npm run lint`: pass.
- `npm test`: 19 Vitest release/unit tests and 26 Playwright browser tests pass.
- Every one of the 12 commands in `.factory/claims.json` was run separately;
  each selected exactly one tagged test and passed.
- `npm run build`: pass; `dist/` contains `index.html`. Production JavaScript
  is 19.61 kB / 7.54 kB gzip and CSS is 10.33 kB / 3.08 kB gzip.
- Browser checks passed at 1440×900 and 390×844. They cover file selection,
  drag/drop, demo isolation/reset/exit, export, malformed recovery, platform
  changes, preview styles, keyboard operation, route focus, touch targets,
  reduced motion, and no horizontal overflow.
- Axe WCAG 2 A/AA: zero violations on the deployed desktop and mobile pages.
  The factory URL verifier reports one H1, `lang=en`, a main landmark, complete
  image alternatives, named buttons, and zero console/page errors. Evidence is
  in `.factory/evidence/repair-3-live/`.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.8 s, LCP 0.8 s, CLS 0, TBT 20 ms.
- Privacy check: all requests in the exercised live flow were same-origin.
  No analytics, remote font, API, authentication, payment, or AI request exists.
- Offline reload passed after service-worker control. The existing update test
  verifies network-first navigation and removal of obsolete versioned caches.
- Live response policy: HTTPS/HSTS, `nosniff`, strict-origin referrer policy,
  same-origin CSP/connect policy, and `frame-ancestors 'none'`. Unknown routes
  return HTTP 404; HTML uses 30-second revalidation and hashed assets use a
  one-year immutable cache.
- Live identity: deployed JavaScript, CSS, and `sw.js` match the final local
  production build byte for byte.
- Package/consumer and server rate-limit/identity checks do not apply to this
  static-web artifact. The original artifact and deployment class are unchanged.

## Run and verify

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Use `/demo` for the isolated sample. No known release-blocking gaps remain.
