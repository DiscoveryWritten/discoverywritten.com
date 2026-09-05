# POSITION — borrowed-windows

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
