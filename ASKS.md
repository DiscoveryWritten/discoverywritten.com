# ASKS — borrowed-windows

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
