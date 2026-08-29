# Caption Style Checker — visual thesis

## Direction

**Pixel / demoscene signal desk.** Caption files are small timed signals that can
lose meaning while moving through a platform. The interface borrows the honest,
instrument-like clarity of a late-1980s demoscene tracker: scan lines, a timing
ruler, bright semantic markers, and dense but calm readouts. It should feel like
a preflight desk, not a video editor.

## Palette and type

The default is a deliberately dark control-room treatment:

- `--ink: #07151d` — blue-black background
- `--surface: #102936` — raised panels
- `--surface-2: #173b4d` — active input areas
- `--paper: #f4f7e9` — primary readable text
- `--muted: #bdd0cc` — supporting copy
- `--mint: #a7f36e` — action / pass
- `--violet: #d4a9ff` — timing and position
- `--amber: #ffcf70` — warning
- `--coral: #ff907d` — error

All text pairings are selected for at least 4.5:1 contrast. System `ui-monospace`
is used for timing and rules; system `ui-rounded`/sans is used for body and
headings. This keeps the checker fast and avoids remote font loading.

## Layout and interaction grammar

An asymmetric signal board replaces a generic centred marketing hero: copy sits
beside a generated CRT-style asset, then flows into the working checker. Panels
have square-cut corners and small offset shadows. Eight-pixel spacing steps and
timecode-like labels make the content feel inspectable. Result rows use both
word labels and color. The mobile layout stacks the board in task order.

Focus is a 3px mint outline. Buttons use explicit verbs. The report updates
through a polite live region. The signature motion is one short horizontal
"signal sweep" on a newly rendered report (180ms); with reduced motion it is
immediate and static.

The cue monitor offers three deliberate accessibility proofs: white on black,
black on white, and phosphor yellow on black. Each pairing exceeds 4.5:1, uses
the same square caption plate, and can be selected with native radio controls.
This turns the signal-desk preview into a comparison tool without imitating a
video editor. Platform choices use native selects and keep keyboard focus after
the report is redrawn.

## Art plan and provenance

Hero art is an original generated raster: an empty CRT monitor showing colored
caption tracks and waveform-like timing bars, surrounded by a compact pixel
control desk. It contains no readable words, logos, brands, people, or watermark.
It clarifies that the product checks timed text signals. It is exported as WebP
for the page and sized under 300 KB.

Prompt sheet: pixel-art demoscene control room; midnight blue, mint, violet,
amber, coral phosphor palette; sharp CRT scan lines and subtle dithering; 3/4
front view; practical negative space; no text, no watermark, no logos, no people.
Model: factory-image (Azure AI Foundry). License/provenance: original product
asset generated for Caption Style Checker, 2026-08-28.

The 1200×630 social image and 180×180 Apple touch icon are cropped,
colour-preserving derivatives of that original asset, made locally on
2026-08-29. They add no third-party material.

## Motion policy

Motion is limited to a single 180ms opacity/transform report arrival and hover
states. No looping decoration or flashing. `prefers-reduced-motion: reduce`
removes transitions and keeps all state changes instant.
