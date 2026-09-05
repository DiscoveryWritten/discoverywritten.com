# Lucky Sevens — the QR bottle loops

**The sprite sheets are the source.** One PNG per bottle holding every frame at
**one pixel per module**, with a JSON sidecar for its geometry. That is the whole
of a QR frame — 69 modules across (61 plus a 4-module quiet zone each side) — so
anything larger is scaling, and scaling belongs to whoever is displaying it.

**No time is baked in.** A sheet is frames in a grid; the player picks the rate.
That is why the same file drives the page at 15fps and a video bake at 30 without
re-rendering anything.

Each one is a whole article serialized as droplets: point a camera at it long
enough and the piece reassembles, signature and all. `audio-seal` is the odd one
— a 353-byte receipt naming the audio master by sha256, not the audio itself.

## The files

| bottle | payload | K | frames | sheet | catchable after |
| --- | ---: | ---: | ---: | ---: | ---: |
| `audio-seal` | 353 B | 7 | 28 | 6x5 · 24 KB | 8 frames |
| `brookfield-properties` | 24,078 B | 255 | 638 | 26x25 · 530 KB | 306 frames |
| `credibility-in-journalism` | 16,358 B | 174 | 435 | 21x21 · 359 KB | 209 frames |
| `eliseai-hierarchy-of-needs` | 2,020 B | 25 | 63 | 8x8 · 54 KB | 30 frames |
| `impact-of-ai` | 67,498 B | 707 | 1768 | 43x42 · 1395 KB | 848 frames |
| `network-state` | 15,355 B | 164 | 410 | 21x20 · 337 KB | 197 frames |
| `park-mobile` | 15,700 B | 167 | 418 | 21x20 · 345 KB | 200 frames |
| `personalized-plus` | 13,964 B | 149 | 373 | 20x19 · 310 KB | 179 frames |
| `universal-music-group` | 11,905 B | 128 | 320 | 18x18 · 265 KB | 154 frames |
| `verra-mobility` | 5,323 B | 59 | 148 | 13x12 · 124 KB | 71 frames |
Verified from the sheet alone — sliced, read with anecdote.channel's own decoder,
reassembled through `carrierSession`: 100% of cells decode and the payload comes
back byte-exact with a valid signature. `verify-sprite.mjs` in the workspace does
this; it is the test that the sheet needs no other artifact.

## `_intermediates/` is not library material

The mp4s live there because they are bakes for a video editor, not sources. They
carry a frame rate the sheets deliberately do not, and they are derived — delete
them and nothing is lost that `export.sh` cannot rebuild. `_format-probe/` holds
one loop in every container we can produce, for finding out what a given tool
accepts without waiting on a re-export.

## Playing them

`docs/js/bottle-emitter.js`. Every slot names its own source in the markup, so
you can read the HTML and know exactly what is on screen:

```html
<li class="qr-slot" id="slot-cite-autumn-ryan-verra-mobility"
    data-sprite="library/lucky-sevens/verra-mobility.png"
    data-frames="148" data-cols="13" data-cell="69" data-fps="15">
```

No manifest fetch, no indirection. Change `data-fps` and the loop changes speed;
change `data-sprite` and it plays something else.

**Scaling is nearest-neighbour, always** (`image-rendering: pixelated`, and
`imageSmoothingEnabled = false` on the canvas). A smoothly resampled QR stops
reading: soft edges plus small modules is precisely the pair that defeats a
decoder, and either alone is survivable.

## Never render one below 221px

A loop dies below **3.2 device pixels per module**, measured against the decoder
that actually ships rather than a stand-in. At 69 modules that is **221px**. The
emitter checks its own size every frame and, if it is ever laid out under that,
adds `.too-small-to-scan` — a red outline and a note — rather than quietly
serving a code no camera can read.

At 320px (the current cap) each module gets 4.6px, comfortably clear.

## Regenerating

Renders live in the FCCN-ANTIBODY workspace at `renders/lucky-sevens-v2/`, built
by `bin/render-bottle-loop.mjs --ec L --overhead 2.5 --miss 40`. `sprites.sh`
packs the sheets; `export.sh` makes the intermediates; `verify-sprite.mjs` proves
a sheet still reassembles.

These are **demo-signed** — a fresh key per render, pending the Discovery Written
identity. Re-signing means re-rendering with `--signed`, which changes the bytes,
which changes the sheets. Do not mix sheets from different bakes in one video.
