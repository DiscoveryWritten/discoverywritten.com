# Lucky Sevens — lyric timings, rebuilt

Production inputs for the video. Regenerate with `python3 build-timings.py`.

## What was wrong with the export, and why it was recoverable

The source export was made "gapless" by setting each line's start to the previous
line's end. That is lossy in one direction only: **ends are intact, starts are
derived.** So every instrumental the export swallowed is still visible — it shows
up as an inflated duration on the line that *follows* it. Estimating what each
line actually needs (median 14.27 chars/sec across the song) and giving the rest
back recovers all of them.

All four `[break]`s and the `[✨]` screed fell out exactly where the lyric sheet
says they should be. That is the check that the reconstruction is right, not a
coincidence to be pleased about.

## The files

| file | what it is |
| --- | --- |
| `lyrics.json` | 149 entries, contiguous 0 → 550.838. Sung lines with corrected starts; **empty-string** entries wherever the music plays alone. |
| `spans.json` | The same timeline as section titles. Plain `{start,end,text}` to match the lyric shape, for running in parallel. |
| `spans-annotated.json` | `spans.json` plus `kind` (`weld` / `link` / `break` / `screed` / `section` / `untitled`) and the `bottle` each weld names. |

Kept as asked: `[break]` occupies the seam and reports as an empty string; the
`[✨]` repeat is inserted and is `[radio screed]` in the spans; `These Aye-Ayes`
→ `These Aye-Is`.

## Corrections

Autumn's corrections live in one `CORRECTIONS` table at the top of
`build-timings.py`, keyed by line text: `(gap_start | None, true_line_start)`.
Add a row, rerun, and the timeline re-derives around it. Applied so far:

| line | gap opens | line starts |
| --- | ---: | ---: |
| I could pummel a fool | — | **95.5** |
| Been saying since 2003 | — | **135.0** |
| The corpos centralized *(the screed)* | **160.3** | **197.8** |
| They don't fear us now | **216.9** | **220.2** |
| We were here all along *(break)* | — | **264.9** |
| The sanctioned Artists *(break)* | — | **315.4** |
| We already have the tools | **327.4** | **329.1** |
| Tick Tock should mean waking up | — | **363.0** |
| These Aye-Is *(break)* | **452.8** | **464.5** |

Two of these made the model give ground, and both changes are now general:

- **A corrected `gap_start` always sets the previous line's end.** The silence
  opening and the line before it closing are one event, so one number sets both
  edges. That is how `good for me` came to end at 452.800 instead of 452.071 — a
  0.73s move, too large for the tolerance-sized snap this replaced, and right
  anyway. There is an assert if a gap start lands more than 2s from the previous
  end, since at that distance it is likelier a typo than a correction.
- **`END_FIX` holds a line out over the music.** Ends were otherwise the
  export's and trusted, but `Biological I.` needed to run to 363.0 with `Tick
  Tock` starting exactly there and *no* gap between — which no gap-shaped
  correction can express. It also removed a 2.15s gap the estimator had inferred
  there, which was wrong.

`They don't fear us now` and `We already have the tools` are **mid-stanza pauses**
with no seam to hang on: the export's own durations for those lines were 4.5s and
4.3s, so no estimate would have found either. Gaps can now open anywhere.

### Still estimated

The long ones, most likely to be off:

| gap | length | before |
| ---: | ---: | --- |
| 7.551 → 21.091 | 13.54s | I drove my Ford EXP |
| 515.536 → 526.201 | 10.67s | ¿? |
| 541.235 → 549.938 | 8.70s | ¿? |

Plus eleven short gaps of 1.3–3.7s inferred from delivery rate (before *Piano
teacher*, *So we quit showin' em*, *Same, bitch. Holy fuck. Same.*, *You should
understand how to train*, and others). **Those are the ones I would most expect
to be over-eager** — they come from a 1.2s excess threshold (`GAP_MIN`), and
raising it drops them all at once.

**Every `[break]` and the screed are now confirmed by ear**, so the structural
skeleton is settled; what is left is breath-level.

The two `¿?` gaps are a judgment call: `¿?` is treated as a short vocal with the
silence in front of it. `🎶` is treated the opposite way — it keeps its whole
8.85s span, since it is the glyph that *means* "instrumental here". Say the word
and I will flip either.

## What the spans say about the QR choreography

Each weld holds the stage for only **10.6–13.9 seconds**. Every bottle needs far
longer than that to be caught — `1.2 × K / 4fps`, per the transmission-health
measurements in `FCCN-ANTIBODY/renders/lucky-sevens/_degradation-study/`:

| weld | stage time | needs | on screen if it keeps playing | |
| --- | ---: | ---: | ---: | --- |
| 📱 EliseAI | 12.3s | 8s | 353s | OK |
| 💸 Network State | 12.9s | 49s | 341s | OK |
| 🤖 Impact of AI | 12.5s | **212s** | 328s | OK |
| 🎰 Brookfield | 12.9s | 76s | 315s | OK |
| 🤠 Credibility | 12.1s | 52s | 286s | OK |
| 🪭 ParkMobile | 10.6s | 50s | 274s | OK |
| 💻 Verra | 13.9s | 18s | 263s | OK |
| ⛓️‍💥 UMG | 12.1s | 38s | 235s | OK |
| 💰 Personalized Plus | 13.6s | 45s | 175s | OK |

**"The old ones keep playing" is load-bearing, not decorative.** Every one clears
its budget only because it stays up after its stanza passes. Impact of AI needs
3m 32s and has 5m 28s left when it arrives — it would be uncatchable in any
design that retired it.

## The constraint that follows: never shrink a QR below 146px

A loop dies below 2.0 pixels per module (measured; a cliff, not a slope). At 73
modules across that is **146px in the delivered frame** — so in a 1920-wide
master the tile must be at least:

| viewer's playback | minimum tile in the master |
| --- | ---: |
| 1080p | 146px |
| 720p | 219px |
| 480p | 328px |
| 360p | 438px |

Against the mock's layouts: the outro's nine-up grid (330px tiles) survives to
480p and **dies at 360p**; the rail strip (190px) and the pile's shrunken older
tiles (150px) die at 720p. The big single tile (560px) survives to 360p.

YouTube picks quality for the viewer and a phone often gets 360p. **If the outro
is meant to be scannable, the nine cannot all be small at once** — rotate which
one is large, or accept a 480p floor.

## The audio: sealable yes, scannable no

Bottling and QR-rendering are different things, and the audio splits them apart.

**As a QR loop it is impossible.** 18,662,238 bytes → K = 145,799 blocks →
218,699 frames → a **15.2-hour loop** needing **12.1 hours** of continuous
filming. For scale, what fits at 4fps:

| dwell you can ask for | catchable payload |
| --- | ---: |
| 60 seconds | ~25 KB |
| 3 minutes | ~75 KB |
| the entire 9:11, alone on screen | ~230 KB |

The audio is **79× too big even for the whole runtime**. Compressing does not
rescue it — Opus at 24kbps mono would still be ~1.65MB, 7× over.

**As a seal it is easy, and it is what you actually asked for.** The bottle is the
signed envelope; the QR is only one carrier of it. So the audio gets bottled and
hosted normally, and what goes *on screen* is a receipt naming it:

    renders/lucky-sevens/audio-seal/   353 B → K=7 → 28 frames
      a 7-second loop, catchable in 2.1 seconds, EC L

It carries kind/work/album/by/**version**/supersedes/bytes/**sha256**/duration and
the bottle address. Scanning it proves which master is playing. Because
`version` and `supersedes` are in the payload, a prior master and a new one seal
to different receipts and can name each other — which is the "prior version and
a new version" case, handled without re-rendering anything else.

Current seal: `master-2026-09-04`, sha256 `b804ddea…de272`, 551.358s. Re-run
`bin/render-bottle-loop.mjs --payload audio-seal.json --kind seal --overhead 4
--ec L` against a new master to re-seal.

## Still open

- The estimated starts above, and whether `GAP_MIN` should rise to drop the short
  inferred gaps.
- Whether the `[✨]` screed shows the chorus words again or stays wordless. It is
  currently one empty 37.5s span, on the reading that it is "unassisted".
- The outro runs **past the end of the audio** — the last vocal ends at 550.838 of
  a 551.358s track, so there is no room inside the song for it. The mock's `force
  outro` checkbox previews it, since the audio cannot reach it.
- The seal is DEMO-signed like the article bottles, pending the Discovery Written
  identity.
