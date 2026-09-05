# POSITION — deploy

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
