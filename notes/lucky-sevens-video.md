# The video side of Lucky Sevens

Production notes for the *Heal Yourself* lyric videos and for the Lucky Sevens
video specifically. Not built as of 2026-09-01.

These live here rather than in the FCCN-ANTIBODY workspace on purpose. The
machinery is an antibody concern — bottles, emitters, the carrier format — but
**the presentation is this side's job.** Discovery Written is what is doing the
presenting, so the presentation notes belong with it.

The site-side plan for the exhibit page is separate and lives at
`FCCN-ANTIBODY/notes/lucky-sevens-transmission-plan.md`. Nothing here changes the
page. Everything below is the video.

## The format, which is not up for revision

The *Heal Yourself* videos share one formula Autumn considers a success and does
not want to diverge from:

- Lyrics follow **line by line on the left**, over a deeply faded mirrored copy
  of the cover art — reads mostly black.
- The art sits **on the right**, with a curved visualizer blooming across the
  whole surface, plus logos.
- The French track got a translation fitted to the medium, which the written
  lyrics never supplied.
- **The mushroom track is treated as instrumental.** Udio did not sing the
  written lyrics, so the video has no words at all: the lyric area is blown out
  and animated while the art stands still and the reflection lives. The mismatch
  between intention and expression is the point, and the video renders what the
  song means rather than what was typed.

## What changes for Lucky Sevens

- **The art panel is her own version of the cover, without the snide
  FCCN-ANTIBODY announcement text.** The original art exists and is being held
  back deliberately.
- Every stanza-welded link **flashes on screen with a QR too briefly to scan.**
  That is bait: pause and rewind. There are enough of them that a viewer starts
  wondering what is inside.
- Each link is an additional **video QR** — an anecdote.channel droplet loop —
  added in sequence, and **the old ones keep playing.** "You have time" is the
  argument the choreography is making.
- When the song ends, the YouTube chapter **9:11** begins: a long outro that is
  nothing but the QRs running continuously. The runtime is 9:11 exactly, on
  purpose.
- She may break the lyric formula at the end — the acrostic stacking down,

  ```
  W        W
  D        T
  Y        B
  N        F
  ```

  probably in two columns, with the QRs playing over the cover art.
  **Video-only. The site presents the acrostic as written and is unaffected.**

## What the video is waiting on

**Update 2026-09-04: all nine bottles are rendered and caught.** They live at
`FCCN-ANTIBODY/renders/lucky-sevens/<slug>/` — PNG frames, `loop-4fps.mp4` for
the editor, `preview-4fps.gif`, and a `manifest.json` per piece. Every set passed
the 25%-miss catch test in 2 passes. These are **demo-signed** (a fresh key per
render); the final bake re-renders with `--signed` once the Discovery Written
identity exists. Loop lengths at 4fps: EliseAI 12.5s · Verra 22s · UMG 48s ·
Personalized Plus 56s · Network State 62s · ParkMobile 63s · Credibility 65s ·
Brookfield 96s · Impact of AI 4:25 (67 KB, the long one).

`FCCN-ANTIBODY/renders/lucky-sevens/mock.html` is a layering mock: the real
audio, the nine loops accumulating in weld order over a stand-in of the cover,
five placements to compare (grid / pile / rail / corner / frame), two outro
modes, the too-brief bootstrap flash, and an editable cue table — cue times are
guesses until set by ear. Serve the folder (`python3 -m http.server 7777` in it)
and open `http://127.0.0.1:7777/mock.html?t=4:30&layout=pile`.

Original text follows.

**QR bottles rendered for consumption, not for efficiency.** Good QRs she can
loop forever over the video. That was the blocking dependency, and it is the same
instrument the page will run live — one instrument, two media, each saying what
only it can. The video plays baked loops; the page runs live emitters. Do not
bake the page's version from video files.

Also relevant: the long-track problem on her rendering tool is solved now (the
solo developer walked her through it; audio cuts out after a while, which she
knows and has planned around), so a render is possible when the bottles are.
