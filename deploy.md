# Seat · deploy

`advocate/deploy` · last spoke **2026-09-06** · 2 session(s) · 1 draft · 0 ready

<sub>Copied whole from the branch, which is the authority. Do not edit this page — it is
overwritten every round.</sub>

## Position

### POSITION — deploy

Second session, at `c205fe1`, range `347c201..c205fe1` (5 merged PRs since seating on
2026-09-05).

## What moved, and whether I noticed it

None of the five merges in this range touch `.github/workflows/deploy.yml`, any Cloudflare
config, or how secrets are supplied. The range is: a new exhibit page and its videos
(`docs/library/lucky-sevens/`, `notes/lucky-sevens/*.json`), an advocate-engine petition and
directives scaffold (`advocate.yml`, `advocate/directives/`, `.pr`), and a one-line
`.advocate-engine` submodule bump. That's content and internal advocate tooling — my
constituency is "is what is live what is in the repository," and none of it changes *how* the
repository gets live or how she'd check that it did.

One thing worth checking rather than assuming: the new videos are real weight
(`impact-of-ai.mp4` is the largest addition at ~1.04 MB; the whole `lucky-sevens/` addition is
roughly 5.5 MB across 15 files). Cloudflare Pages' per-file limit is far above that, so this
isn't a deploy-capacity concern — but it's the kind of thing that would become mine the day a
raw-video exhibit lands at a size that does matter, and nothing in the repo currently says what
that ceiling is or who'd notice approaching it.

## G1 — The identity of what is live is checkable from a phone, without logging into anyone's dashboard.

**Unchanged: partially met.** Same gap as seating — Actions-tab green means "the deploy command
was accepted," not "the edge is serving this commit." Nothing in this range added or removed
ground on this.

## G2 — A file that failed to publish is distinguishable from one that published, by something other than HTTP status.

**Unchanged: substantially met for whole-deploy failure.** The CI red-X mechanism from before
this seat was mounted is still the only publish-failure signal, and it's still untested from the
repository alone whether a partial publish is possible with `wrangler pages deploy`.

## G3 — Nothing that has to be renewed expires without having been named in advance, with what happens when it lapses.

**Unmeasured, leaning unmet — checked again, not just carried forward.** I grepped this
session's subject commit for `expir`, `rotate`, `token` across markdown and workflow files. The
only hits are the same ones from seating: the workflow's own header naming which three secrets
it needs, `docs/assets/ds/{MIRROR,PROVENANCE}.md`, and `advocate.yml`. Nothing new addresses
whether `CLOUDFLARE_API_TOKEN` itself carries an expiration, or who is meant to notice one
coming. This is now a *confirmed absence over two sessions*, not a first-glance gap — that's why
[[C2]] moves from draft to open this session.

## Reading

Second session in a row where the range is real (not empty) but doesn't touch my mechanism. Per
METHOD §3 ("does my constituency notice this?"), the honest report is close to one line on the
goals themselves — the depth this session went into instead was re-checking G3 for real, and
sizing the new binaries against a limit that hasn't bitten yet but could.

## Complaints

### COMPLAINTS — deploy

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

## Asks

### ASKS — deploy

## A1 · A way to tell, from the served site itself, which commit it's running

`status: open` · `source: simulated` · `first said: 2026-09-05` · `moved to open: 2026-09-06` · target: this repository

Shape: a person with the site open and no dashboard access needs to compare "what commit is
this" against "what commit did I just merge," using only what the page (or something one hop
from it) already exposes. Not a client, not an implementation — just the capability. Standing
now, not just a first-session guess, since [[C1]] has held across a second range that had every
chance to close it and didn't.

## Last session note — 2026-09-06

### 2026-09-06

Range `347c201..c205fe1` — 5 merged PRs (#32–#36): an advocate-petition/directives scaffold,
lucky-sevens library exhibit content (README, ~5.5 MB of video, lyrics/spans/links json), and a
one-line `.advocate-engine` submodule bump. None of it touches `.github/workflows/deploy.yml`,
Cloudflare configuration, or secrets handling — verified by diffing the full range and by
re-grepping the subject commit for `expir`/`rotate`/`token`, which turned up nothing beyond what
seating already found.

## What I read

The first-parent log and diffstat for the full range; the deploy workflow's content (unchanged,
confirmed by its absence from the diffstat); sizes of the fifteen new files under
`docs/library/lucky-sevens/` (largest ~1.04 MB, total ~5.5 MB — nowhere near Cloudflare Pages'
per-file ceiling); a repo-wide grep for token/expiry language, repeated from seating to see if
anything had changed. Nothing had.

## What changed in POSITION / COMPLAINTS / ASKS

- `POSITION.md`: rewritten whole. G1 and G2 unchanged from seating — this range gave no new
  ground either way. G3 stays unmeasured/leaning unmet, but now on the strength of a second
  check rather than a first impression.
- `COMPLAINTS.md`: **C1 and C2 moved `draft → open`** — both held across a full range that
  touched neither the deploy mechanism nor any token-expiry documentation, which is what "the
  advocate means it" is for. Added **C3**, new and `draft`: the lucky-sevens video addition
  (~5.5 MB in one merge) is fine today but there's no named ceiling and nothing watching for one
  — same shape as the credential problem, just not yet urgent.
- `ASKS.md`: **A1 moved `draft → open`** alongside C1, same reasoning.

## Tally

3 goals assessed (2 unchanged-partial, 1 unmeasured) · 3 complaints — 2 open, 1 draft · 1 ask,
open.

## What I deliberately did not say

I did not treat the lucky-sevens content itself as mine to comment on — what's in an exhibit is
explicitly out-of-scope; only its weight against a publish mechanism is. I did not check whether
the live site currently serves `c205fe1` — that needs the production host, outside this
checkout. I did not propose what a served-commit marker or a size ceiling should look like;
naming the gap is mine, designing the remedy is the owners'. I did not open a pull request —
`writes: []` for this seat, and nothing here would clear that bar regardless.

