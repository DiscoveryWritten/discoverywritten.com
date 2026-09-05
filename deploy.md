# Seat · deploy

`advocate/deploy` · last spoke **2026-09-05** · 1 session(s) · 3 draft · 0 ready

<sub>Copied whole from the branch, which is the authority. Do not edit this page — it is
overwritten every round.</sub>

## Position

### POSITION — deploy

Seated 2026-09-05, at `347c201`. First session: no range exists yet, so this is an opening
reading of the repository as it stands, not a report on what changed.

## G1 — The identity of what is live is checkable from a phone, without logging into anyone's dashboard.

**Partially met.** `.github/workflows/deploy.yml` runs on every push to `main` and reports its
own pass/fail in the repo's Actions tab — a place Autumn is already logged into, because it's
where she merges. That's real progress over the prior state: a manual `wrangler pages deploy`
run from a laptop, whose result lived only on that laptop.

What it does not give her: the Action going green tells her the deploy command was *accepted*,
not that Cloudflare's edge is *currently serving* that commit. Nothing in the served output
itself — no version marker, no commit id anywhere a browser can see it — lets her cross-check
"what's live" against "what's in the repo" independently of trusting the Action's own report.
The identity check today is one level removed from the thing she actually wants to know.

## G2 — A file that failed to publish is distinguishable from one that published, by something other than HTTP status.

**Substantially met, for whole-deploy failure.** The founding failure this seat exists for was
silent: an expired OAuth token meant two days of merges built nothing, and the only symptom was
the host quietly continuing to serve the old build — indistinguishable from success by HTTP
status, because the host answers every missing or stale path with the homepage at 200. The CI
workflow replaces that with a loud failure: a failed `wrangler pages deploy` fails the Actions
run and puts a red X on the commit. That is a signal that isn't HTTP status, and it's visible
from the same phone-and-GitHub path as G1.

What's untested from the repository alone: whether a *partial* publish — some files updated,
others not — is possible with this deploy method, or whether Cloudflare Pages deploys are
atomic enough that "the command succeeded" implies "everything in `docs/` is now live." I have
no evidence either way and won't guess.

## G3 — Nothing that has to be renewed expires without having been named in advance, with what happens when it lapses.

**Unmeasured, leaning unmet.** The workflow's own header comment names the three values the
pipeline needs (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PAGES_PROJECT`) and
says what happens if a deploy fails generally — but nothing in the repository says whether the
API token itself has an expiration set, when it was issued, or who notices before it lapses.
That's the same shape of problem this seat was founded on, moved up one level: the *symptom*
(silent failure) is fixed, but the *cause* (a credential that can lapse without warning) isn't
addressed by a workflow file alone — a red X still means the site is stale until a person
happens to look at it. I can't tell from this checkout whether the current token expires at
all; that's not knowable from the repo, which is exactly the gap.

## Reading

The workflow that answers this seat's founding complaint (`6ea3811`, "Deploy docs/ to
Cloudflare Pages from CI") landed *before* this seat was mounted (`7135b15`) — the repository
had already started fixing the thing I exist to watch. That's worth stating plainly: this isn't
a case of arriving to find neglect, it's arriving to find the first fix already in and
partially sufficient. My job from here is watching whether it holds, not re-litigating whether
it was the right fix — that's out-of-scope by my own config ("anything whose only remedy is
'open the Cloudflare dashboard'" and "relitigating the move off GitHub Pages").

## Complaints

### COMPLAINTS — deploy

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

## Asks

### ASKS — deploy

## A1 · A way to tell, from the served site itself, which commit it's running

`status: draft` · `source: simulated` · `first said: 2026-09-05` · target: this repository

Shape: a person with the site open and no dashboard access needs to compare "what commit is
this" against "what commit did I just merge," using only what the page (or something one hop
from it) already exposes. Not a client, not an implementation — just the capability. Relates to
[[C1]].

## Last session note — 2026-09-05

### 2026-09-05 — seating

No range: this is the first session, seated at `347c201`. Read the repository as it stands,
not a diff — per METHOD §0, an opening position, not a report on what moved.

## What I read

`.github/workflows/deploy.yml` (landed `6ea3811`, before this seat was mounted at `7135b15`),
its git history (`1a388de` → `bfccbbd` deleting `.github/workflows` → `6ea3811` re-adding it as
CI-driven Cloudflare Pages deploy), `docs/` structure, `docs/assets/ds/{PROVENANCE,MIRROR}.md`,
and the repo's README. No constitution is named in my `advocate.yml` entry, so `mission` and
`constituency` there are the whole standard for this seat.

## What changed in POSITION / COMPLAINTS / ASKS

- `POSITION.md`: written whole for the first time. G1 (identity of live, phone-checkable)
  partially met — CI status is checkable without a dashboard, but doesn't confirm the edge is
  actually serving that commit. G2 (non-HTTP-status publish-failure signal) substantially met —
  the CI red-X replaces the prior silent-failure mode this seat exists because of. G3 (advance
  naming of what expires) unmeasured, leaning unmet — the workflow documents which secrets it
  needs, not whether or when the token itself lapses.
- `COMPLAINTS.md`: two new, both `status: draft`, `source: simulated` — C1 (can't verify live
  identity independent of trusting the pipeline's own report) and C2 (a louder failure on token
  expiry is not the same as a warned-about one).
- `ASKS.md`: one new, `status: draft` — A1, shaped as a capability ("compare served commit to
  merged commit without a dashboard"), tied to C1.

## Tally

3 goals assessed (2 partial/substantial, 1 unmeasured) · 2 complaints, both draft · 1 ask, draft.

## What I deliberately did not say

I did not check whether the live site currently matches `347c201` — that requires reaching the
production host, which is outside "this repository, at the checked-out commit." I did not
guess at whether the Cloudflare API token has an expiration set; I don't have visibility into
it from this checkout, and the constitution against estimating to fill a row applies exactly
here. I did not relitigate the move off GitHub Pages or propose what the identity-check
mechanism should look like (a version file, a build banner, etc.) — that's a remedy, and
remedies are the owners' to design, not mine to strategise.

