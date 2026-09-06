# COMPLAINTS — deploy

## C1 · I can see the deploy said yes. I still can't see what's actually being served.

`status: open` · `source: simulated` · `first said: 2026-09-05` · `moved to open: 2026-09-06`

"It looks fine to me. Is it fine?" — a green check in Actions means the pipeline accepted the
job, not that the edge is serving it. There's no mark in the served page itself I could compare
against the repo without also trusting the pipeline's own word for it. Two different kinds of
wrong — a deploy that silently didn't run, and a deploy that ran but didn't finish propagating
— would look the same to me from a phone. A second range went by touching neither the workflow
nor any served-identity marker, so this is no longer a first-glance guess. Maps to G1.

## C2 · Nothing tells me the token is getting old until the day it's dead.

`status: open` · `source: simulated` · `first said: 2026-09-05` · `moved to open: 2026-09-06`

The workflow now fails loudly instead of quietly, which is real and I said so. But "fails
loudly" still means the site goes stale between the lapse and whenever someone notices the red
X — and nothing anywhere says whether this token even has an expiration, let alone when. That's
the exact shape of the thing that cost me real days before: a credential nobody was watching.
A louder failure is not the same as a warned-about one. Checked again this session by grepping
the subject commit for `expir`/`rotate`/`token` — same hits as seating, nothing new. Two
sessions with no ground gained is why this stands rather than stays a first-blush note. Maps
to G3.

## C3 · The exhibits are getting heavier and nothing says how heavy is too heavy.

`status: draft` · `source: simulated` · `first said: 2026-09-06`

This range added ~5.5 MB of video to `docs/library/lucky-sevens/` in one merge. Nowhere near any
limit today, so this isn't "it broke" — it's "I have no way to know, from the repository, how
close to a limit I am, or that I should be watching for one." The founding failure here was a
credential nobody was watching; a per-file or total-size ceiling nobody's named is the same
shape of unwatched thing, just further out. Maps loosely to G2/G3 — not fully either, which is
itself worth saying rather than forcing a fit.
