# COMPLAINTS — deploy

## C1 · I can see the deploy said yes. I still can't see what's actually being served.

`status: draft` · `source: simulated` · `first said: 2026-09-05`

"It looks fine to me. Is it fine?" — a green check in Actions means the pipeline accepted the
job, not that the edge is serving it. There's no mark in the served page itself I could compare
against the repo without also trusting the pipeline's own word for it. Two different kinds of
wrong — a deploy that silently didn't run, and a deploy that ran but didn't finish propagating
— would look the same to me from a phone. Maps to G1.

## C2 · Nothing tells me the token is getting old until the day it's dead.

`status: draft` · `source: simulated` · `first said: 2026-09-05`

The workflow now fails loudly instead of quietly, which is real and I said so. But "fails
loudly" still means the site goes stale between the lapse and whenever someone notices the red
X — and nothing anywhere says whether this token even has an expiration, let alone when. That's
the exact shape of the thing that cost me real days before: a credential nobody was watching.
A louder failure is not the same as a warned-about one. Maps to G3.
