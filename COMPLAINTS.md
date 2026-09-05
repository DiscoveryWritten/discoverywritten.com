# COMPLAINTS — borrowed-windows

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
