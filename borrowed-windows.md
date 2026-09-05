# Seat · borrowed-windows

`advocate/borrowed-windows` · last spoke **2026-09-05** · 1 session(s) · 7 draft · 0 ready

<sub>Copied whole from the branch, which is the authority. Do not edit this page — it is
overwritten every round.</sub>

## Position

### POSITION — borrowed-windows

**Opening session. No prior baseline exists.** This is a reading of the repository as it stands
at `347c201`, not a report of what changed — there is nothing to diff against yet. Every session
after this one gets a real range.

## G1 — every third-party frame named in one place, with what visibly breaks

**Not met.** The site leans on five borrowed players — Spotify, Apple Music, Amazon Music, the
YouTube iframe API, and the SoundCloud widget — and none of them is inventoried anywhere a person
would find on purpose. Each album page (`bitflip.html`, `nanofilament.html`, `promise.html`,
`collectorate.html`, `larastelle.html`) hand-duplicates its own four-tab picker
(Apple/Spotify/Amazon/YouTube); three more pages (`healyourself.html`, `lockthemirror.html`,
`luckysevens.html`) mount YouTube directly via `YT.Player`, each with its own copy of the same
load logic; `buttoncrash.html` carries a bare SoundCloud iframe. `notes/abridged-by-us-exhibits.md`
comes closest to a manifest, but it is a working note about one exhibit (Abridged By Us), not an
inventory of the site's borrowed frames as a set. If Spotify changed its embed terms tomorrow, the
only way to find every place that would break is to grep for it.

## G2 — a refusal names the service and, where knowable, why

**Not met, and the standing example proves it in both directions.** No embed anywhere in the repo
has failure handling: `docs/js/youtube.js` and its per-page copies fire `new YT.Player(...)` with
no `onError`, and every Spotify/Apple/Amazon/SoundCloud frame is a bare `<iframe src=...>` with no
fallback markup. A grep for `onerror`, `onload`, or any load-timeout across every page returns
nothing.

The Windup Girl — this seat's own standing example — currently isn't embedded at all.
`docs/abridged.html:76-84` shows it as an outbound link with a thumbnail, structurally identical to
the other sixteen cards. The refusal (`error 150`, "almost certainly a rights claim") is recorded
in `notes/abridged-by-us-exhibits.md:147-152` — the note even names the intended fix in its own
words: the page should say the video won't be shown here and why, "instead of silently bouncing
someone to YouTube." That is exactly what it still does. The constraint is known; it has not
reached the page.

## G3 — a recorded rights constraint can't quietly come back

**Not met.** Two constraints are already written down, both only as prose:

- The Windup Girl's embed refusal (above).
- Warbreaker's text: `notes/abridged-by-us-exhibits.md:109-122` records that the Substack post's
  text carries no no-derivatives exemption (the audio/video does), so "the verbatim panel must
  therefore not be generated for Warbreaker" — and flags this as a per-episode property to be
  re-checked for every non-Wikipedia-sourced episode, not a one-time fact.

Neither lives anywhere but a notes file. Nothing stops a future edit, or a future run of
`tools/abu_sentences.py`, from generating that panel anyway, or from a page trying to re-embed the
Windup Girl once someone forgets why it doesn't. A markdown note is memory, not enforcement.

## What I'm not saying

I'm not saying the four-tab picker pattern is wrong, or that Substack's still-undecided
embed-vs-link question (`notes/abridged-by-us-exhibits.md:106`) needs resolving now — that decision
belongs to whoever is building Abridged By Us, not to this seat. I'm also not proposing how to fix
any of the above; that's outside what an advocate does.

## Complaints

### COMPLAINTS — borrowed-windows

## C1 · Nothing tells me all the ways this could go dark at once

`status: draft` · `source: observed` · `first said: 2026-09-05`

Five services this site depends on to play something — Spotify, Apple Music, Amazon Music,
YouTube, SoundCloud — and every page that embeds one of them wrote its own copy of the same
picker or player-mount code. There is no single place, not even a note, that says "here is
everything we're borrowing and what happens to each page if it's pulled." Finding out means
grepping the whole site.

## C2 · When a player doesn't load, it just doesn't load

`status: draft` · `source: observed` · `first said: 2026-09-05`

"Nothing happens when I press it." Every iframe and every `YT.Player` mount in the repo is bare —
no `onerror`, no `onload`, no timeout, no fallback text. A blocked frame, a dead ID, and a slow
network all look identical to a visitor: silence. There's no way, from the page itself, to tell
"this is broken" from "this was never going to work."

## C3 · The Windup Girl still just bounces you to YouTube

`status: draft` · `source: observed` · `first said: 2026-09-05`

This is the seat's own named example, and right now it isn't even wrong in a new way — it's the
plain old failure mode. `docs/abridged.html` shows it as an outbound link with a thumbnail,
identical in markup to every other card on the page. The refusal is known (`error 150`, recorded
in the exhibit notes as almost certainly a rights claim) and it isn't visible anywhere a reader
would see it before clicking through and getting nothing.

## C4 · A rights note in a markdown file is not something that can't be un-known

`status: draft` · `source: observed` · `first said: 2026-09-05`

Someone wrote down, carefully, that the Warbreaker text can't be reproduced verbatim the way the
Wikipedia-sourced episodes can, and that this has to be re-checked per episode, not assumed once.
That's exactly the kind of fact that survives right up until someone edits that page without
having read the note it depends on. Nothing enforces it. It's one accidental script run away from
being wrong again.

## Asks

### ASKS — borrowed-windows

## A1 · A place that lists every borrowed frame and what breaks if it goes

`status: draft` · `target: whoever owns the exhibit pages` · `first said: 2026-09-05`

Someone maintaining this site needs one place — not per-page, not implied by grepping — that
names every third-party embed the site depends on and what a reader should expect to see if that
service refuses to load. Shape: a manifest an editor consults before adding or changing an embed,
not a client (this is not "add a JSON file called embeds.json" — that's a design decision for
whoever builds it).

## A2 · A shared "this didn't load" affordance

`status: draft` · `target: whoever owns the per-page embed JS` · `first said: 2026-09-05`

A visitor pressing play needs some signal, from the page, distinguishing "this service refused to
load" from "nothing happened yet." Shape: any embed on this site should be able to say which
service it asked and that the asking failed. How that's implemented — a shared component, a
timeout convention, something else — is not this seat's call.

## A3 · A recorded rights constraint needs to survive being forgotten

`status: draft` · `target: whoever owns tools/abu_sentences.py and the exhibit pages it feeds` ·
`first said: 2026-09-05`

The Windup Girl's embed refusal and the Warbreaker text restriction are both known today only as
prose in a notes file. Someone editing that exhibit later, without having read the note, needs
something in their way — a check, a flag, anything that isn't "hope they remember." Shape: an
editor touching a per-episode fact should not be able to silently regress a previously-recorded
constraint on that same episode.

## Last session note — 2026-09-05

### 2026-09-05

**Opening session — seating, not reporting.** No range exists yet (`first: true`, `since: null`);
the subject is `347c201`. I did not diff against a prior state because there isn't one. What
follows is a reading of the repository as it stands, not a report of what changed in it.

## What I read

`advocate.yml` (this seat's charter), the five album pages that duplicate the Apple/Spotify
/Amazon/YouTube tab picker, the three YouTube-only exhibit pages, `buttoncrash.html`'s SoundCloud
embed, the shared and per-page embed JS, and `notes/abridged-by-us-exhibits.md` — which turned out
to already contain most of what this seat cares about: the Windup Girl's YouTube error 150, and
the Warbreaker text-rights note. Full findings are in `POSITION.md`.

## What changed in the three files

All three were empty. `POSITION.md` is now a full opening read against G1/G2/G3 (none of the
three goals are met today). `COMPLAINTS.md` opens with four drafts (C1–C4), all `source: observed`
from the code and the exhibit notes, none from testimony. `ASKS.md` opens with three drafts
(A1–A3), each stated as a shape, not a client.

**Tally: 4 draft, 0 open, 0 ready, 0 promoted.** Same for asks: 3 draft, 0 open, 0 ready.

## What I deliberately did not say

I did not propose how to build a manifest, an error-handling convention, or a rights-constraint
check — those are designs, and designing them isn't this seat's job. I did not touch the open
Substack embed-vs-link decision (`notes/abridged-by-us-exhibits.md:106`); it belongs to whoever
builds Abridged By Us, not to this seat, and it isn't a borrowed-window failure mode yet since
nothing is embedded there. I did not comment on whether the four-tab picker pattern itself is a
good design — only on what happens when one tab's service refuses. And I did not read
`sessions/2026-09-05.md`'s prior draft as a starting point: an earlier version of this file
(written before I read the repo) claimed "nothing merged since the last session," which cannot be
true for a first session with no last session to compare against. I've overwritten it rather than
carry that claim forward.

