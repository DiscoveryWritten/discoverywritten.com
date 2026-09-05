# Lucky Sevens — the QR bottle loops, baked for video

Ten loops for placing in the Lucky Sevens video. Each one is a whole article
serialized as QR droplets: point a camera at it long enough and it reassembles
the piece, signature and all. `audio-seal.mp4` is different — it is a 353-byte
receipt naming the audio master by sha256, not the audio itself.

**These are the video bakes. They are not the page's instrument.** The exhibit
page runs live emitters from anecdote.channel; it must never be built from these
files. One instrument, two media.

## The files

| file | payload | K | frames | loop @30fps | dwell to catch |
| --- | ---: | ---: | ---: | ---: | ---: |
| `brookfield-properties.mp4` | 24,078 B | 255 | 638 | 21.3s | 10.2s |
| `credibility-in-journalism.mp4` | 16,358 B | 174 | 435 | 14.5s | 7.0s |
| `eliseai-hierarchy-of-needs.mp4` | 2,020 B | 25 | 63 | 2.1s | 1.0s |
| `impact-of-ai.mp4` | 67,498 B | 707 | 1768 | 58.9s | 28.3s |
| `network-state.mp4` | 15,355 B | 164 | 410 | 13.7s | 6.6s |
| `park-mobile.mp4` | 15,700 B | 167 | 418 | 13.9s | 6.7s |
| `personalized-plus.mp4` | 13,964 B | 149 | 373 | 12.4s | 6.0s |
| `universal-music-group.mp4` | 11,905 B | 128 | 320 | 10.7s | 5.1s |
| `verra-mobility.mp4` | 5,323 B | 59 | 148 | 4.9s | 2.4s |
| `audio-seal.mp4` | 353 B | 7 | 28 | 0.9s | 0.3s |
1104×1104, 30fps, H.264 Main@4.0, yuv420p, bt709 limited range, faststart.
`_format-probe/` holds the smallest loop in every format we can produce, for
finding out what a given tool will accept without waiting on a re-export.

## Placing them: never smaller than 221px

A loop dies below **3.2 pixels per module** — measured against the decoder that
actually ships (anecdote.channel's `decodeImage`), not a stand-in. At 69 modules
across that is **221px in the frame the viewer receives**, so in a 1920-wide
master the tile must be at least:

| viewer's playback | minimum tile |
| --- | ---: |
| 1080p | 221px |
| 720p | 331px |
| 480p | 496px |
| 360p | 662px |

Measured on these exact files: 100% of frames read at 220px, **0% at 165px**. It
is a cliff, not a slope, and below it no amount of looping recovers — the same
frames fail every pass, and the fountain only insures against *random* loss.

Consequence for the outro: **nine small tiles at once only works at 720p and up.**
At 480p each would need 496px and nine of those do not fit on a 1920 frame.

## Why the format is what it is

The first bake was refused by a browser-based editor. Three things were wrong,
all fixed here:

1. **`moov` sat after `mdat`** — no faststart, so a tool that parses
   progressively cannot read the metadata without the whole file. Most likely
   culprit, and free to fix.
2. **4 fps.** Legal, and far outside what any timeline expects.
3. **No audio track**, which some importers treat as "not a video".
   `_format-probe/loop-30fps-silentaudio.mp4` is the answer if that is the one.

Also raised off High@2.2 to Main@4.0 and tagged the colour explicitly.

**Scaling is integer nearest-neighbour, always.** A QR must never be resampled
smoothly — soft edges plus small modules is exactly the pair that defeats the
decoder.

## They are better than the first bake, not just re-wrapped

- **EC L instead of M** — 61 modules instead of 65, so bigger modules at the same
  size. The per-frame error correction was partly redundant anyway: the fountain
  is the error correction, across frames.
- **2.5× overhead instead of 1.5×** — drops the decode rate a stream needs from
  **80% to 48%**, which is the difference between fragile and comfortable.
- Every one passed a **40% simulated miss** catch test, up from 25%.

Verified end to end through the real decoder: EliseAI catches at 1.57s, UMG at
5.87s, both landing exactly on `1.2 × K / fps`.

## Regenerating

Renders live in the FCCN-ANTIBODY workspace (not a repo) at
`renders/lucky-sevens-v2/`, built by `bin/render-bottle-loop.mjs --ec L
--overhead 2.5 --miss 40` and exported by `renders/lucky-sevens-v2/export.sh`
(`EXTRAS=1` for webm and gif). Verify any of them with
`renders/lucky-sevens/_degradation-study/catch-video.mjs --video FILE --tiles whole`.

## Open

These are **demo-signed** — a fresh key per render, pending the Discovery Written
identity. They are therefore different bottles from the first bake; do not mix the
two sets in one video. Re-signing means re-rendering with `--signed`.
