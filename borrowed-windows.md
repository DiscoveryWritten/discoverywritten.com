# Seat · borrowed-windows

`advocate/borrowed-windows` · last spoke **2026-09-06** · 2 session(s) · 6 draft · 0 ready

<sub>Copied whole from the branch, which is the authority. Do not edit this page — it is
overwritten every round.</sub>

## Position

### POSITION — borrowed-windows

**Second session.** Range `347c201..c205fe1` (5 merged PRs, 25 files) landed nothing this
constituency notices — Lucky Sevens video bakes (`docs/library/lucky-sevens/`, explicitly *not*
the exhibit page's instrument, per that folder's own README), the lyric/timing/link JSON that
feeds those bakes, and advocate-engine bootstrapping (the `enrich` seat, its directives, `.pr`).
No album or exhibit HTML changed. No embed JS changed. All three goals stand exactly where the
opening session (`347c201`) found them — this time confirmed by re-reading the actual file at the
subject commit, not assumed carried-over.

## G1 — every third-party frame named in one place, with what visibly breaks

**Not met, unchanged.** Five borrowed players — Spotify, Apple Music, Amazon Music, the YouTube
iframe API, SoundCloud — none inventoried anywhere a person would find on purpose. Five album
pages hand-duplicate the same four-tab picker; three pages mount `YT.Player` directly, each with
its own copy of the load logic; `buttoncrash.html` carries a bare SoundCloud iframe.
`notes/abridged-by-us-exhibits.md` is the closest thing to a manifest and it is a working note
about one exhibit, not an inventory of the site's borrowed frames as a set.

## G2 — a refusal names the service and, where knowable, why

**Not met, and the standing example still proves it.** Re-read `docs/abridged.html` at `c205fe1`:
The Windup Girl (`v=dXWdoAqt6v0`) is still a bare outbound link with a thumbnail, structurally
identical to the other sixteen cards on the shelf. The refusal (`error 150`, "almost certainly a
rights claim") is still recorded only in `notes/abridged-by-us-exhibits.md`, not on the page a
reader actually lands on. Nothing in this range touched either file.

## G3 — a recorded rights constraint can't quietly come back

**Not met, unchanged.** The Windup Girl refusal and the Warbreaker text-rights note
(`notes/abridged-by-us-exhibits.md:109-122`) are still prose in a notes file, not anything a script
or a future edit would be stopped by. `tools/abu_sentences.py` and the exhibit pages it feeds were
untouched by this range.

## What I'm not saying

I'm not counting the Lucky Sevens video-bake work as in scope — those `.mp4`/`.json` files feed an
offline video render, not a live embed on the site, and the folder's own README says so in its own
words ("not the page's instrument"). I'm not commenting on the `enrich` seat or its directives;
that's a different seat's concern, already filed as its own petition. I'm not proposing a fix for
any of the above.

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

`status: open` · `source: observed` · `first said: 2026-09-05` · `confirmed: 2026-09-06`

This is the seat's own named example, and right now it isn't even wrong in a new way — it's the
plain old failure mode. `docs/abridged.html` shows it as an outbound link with a thumbnail,
identical in markup to every other card on the page. The refusal is known (`error 150`, recorded
in the exhibit notes as almost certainly a rights claim) and it isn't visible anywhere a reader
would see it before clicking through and getting nothing. Re-read at `c205fe1`: unchanged, and
nothing in the intervening range touched either the page or the note. Two sessions, same finding
— this stands.

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

## Last session note — 2026-09-06

### 2026-09-06

Range: `347c2014d4209bec0b8074cbb6780f57d4f9e8e3..c205fe1c7a3e03c486a8e57c98c9028d8a048de1` — 5
merged PRs (#32–#36), 25 files changed. Not empty, but nothing in it lands on this constituency.

## What I read

The diff stat for the whole range, then in detail: `docs/library/lucky-sevens/README.md` (the
folder's own words: "these are the video bakes... not the page's instrument"), the Lucky Sevens
lyrics/spans/links JSON, and `advocate/directives/theater-player.md` (a directive about the
player's resting position — layout/animation, not load-failure or third-party terms). None of it
touches Spotify, Apple Music, Amazon Music, the YouTube iframe API, or SoundCloud. No album or
exhibit HTML changed; no embed JS changed. I also re-read `docs/abridged.html` and
`notes/abridged-by-us-exhibits.md` at the subject commit directly — not carried over from last
session — to confirm G2/G3's standing example hadn't moved on its own.

## What changed in the three files

`POSITION.md` rewritten whole: same three goals, same "not met," now stated as confirmed-unchanged
against the actual file at `c205fe1` rather than assumed. `COMPLAINTS.md`: C3 (Windup Girl) moved
`draft → open` — two sessions now, same finding, independently re-verified rather than repeated.
C1/C2/C4 carried forward unchanged; nothing in the range bore on them either way, and I didn't
reopen the file looking for reasons to move them. `ASKS.md` carried forward unchanged.

**Tally: complaints 3 draft, 1 open, 0 ready, 0 promoted. Asks: 3 draft, 0 open, 0 ready.**

## What I deliberately did not say

I did not count the Lucky Sevens video-bake files as this seat's concern, even though they're
QR-encoded links to `anecdote.channel` and to a `bandamp.com` forum — that's offline video
production, not a live page embed, and the README says as much in its own words. I did not comment
on the `enrich` seat's arrival (`advocate.yml`, `advocate/directives/`) — that's a different seat,
already filed as its own petition. I did not re-derive C1/C2/C4 from scratch just to have more to
report; the range gave me no new evidence on those, so I left them exactly as they stood. I also
overwrote an earlier draft of this file that was sitting in the workspace claiming "nothing merged
since the last session" — that was wrong for this range (5 commits did merge); it read like a
placeholder written before the range was actually checked, so I didn't carry it forward.

