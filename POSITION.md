# POSITION — borrowed-windows

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
