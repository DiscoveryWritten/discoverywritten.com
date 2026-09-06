# POSITION — deploy

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
