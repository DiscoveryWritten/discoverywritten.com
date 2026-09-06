# Seat · enrich

`advocate/enrich` · last spoke **2026-09-06** · 2 session(s) · 1 draft · 0 ready

<sub>Copied whole from the branch, which is the authority. Do not edit this page — it is
overwritten every round.</sub>

## Position

### POSITION — enrich

**Session:** 2026-09-06 · **Subject:** `c205fe1` · **Range:** `c2604f9..c205fe1` (two merged
pull requests: #36 `tiliv-patch-1`, #35 `lucky-sevens-library`).

## The backlog, as it stands

Still one directive in `advocate/directives/`: `theater-player.md`, seeded 2026-09-01, **State:
seed**. I re-read it byte-for-byte against last session's copy — unchanged. Neither merged pull
request in this range touched `advocate/directives/` or added a second entry. The backlog she said
she wants to keep filling early is, three weeks after the first entry, still one entry deep.

## G1 — every directive read since last touched, and says what it's waiting on

**Half true, same as last session, for the same reason.** The directive was read today — the
letter of the goal holds — but it still doesn't say what it's waiting on in its own text; that
answer still lives in `notes/abridged-by-us-exhibits.md` §2, uncited from the directive. Nothing
in this range changed that, because nothing in this range touched the directive at all.
**Unmeasured**, as before: whether "has been read" is meant to leave a mark on the file itself.

## G2 — a directive ready to graduate says so, with its PR description already written

**Not ready — unchanged.** The same three open items stand: which docking direction (hers to pick
once seen on a phone), whether reduced motion is inventing new site machinery rather than reusing
existing machinery (see C2), and whether this belongs to Abridged By Us alone or the album
template generally. Nothing this session moved any of the three closer.

## G3 — no directive silently widened past what was seeded

**Nothing to report — unchanged.** A directive that hasn't been touched can't have been widened.
Two full pull requests landed elsewhere in the repository without laying a hand on it.

## What moved this session

Not the backlog — the confidence behind two standing complaints. C1 and C2 were both `draft`,
written from a single read three weeks ago. This session re-checked both independently, after a
real range had landed elsewhere in the repository, and both held:

- The directive still doesn't cite `notes/abridged-by-us-exhibits.md` §2, which answers most of
  its stated gap (C1).
- `docs/css` and `docs/js` still have no `prefers-reduced-motion`, no animation toggle, no motion
  ladder — the directive's premise that one already exists for reuse is still, as far as this
  checkout shows, false (C2).

Both move from `draft` to `open` this session. Neither is new; both are now stated and standing
rather than a first impression.

## What I deliberately didn't check

I did not read the two merged pull requests' full diffs — cross-repository `git`/`gh` access from
this workspace required an approval this session had no one to grant, so I read the checked-out
files directly instead: `advocate/directives/`, `notes/`, `docs/css`, `docs/js`. That is a
narrower window than a full diff, but it is enough to answer the only question my seat asks of a
range — did anything touch the directives backlog — because the files that would show it are the
ones I could read. I did not form an opinion on the theater idea itself, or nudge a docking
direction — hers to pick once it's seen on a phone. I did not go looking in `notes/lucky-sevens/`
for a new idea that should have become a directive; noticing what belongs in the backlog isn't the
same as going looking for candidates to add to it myself.

## Complaints

### COMPLAINTS — enrich

## C1 · The directive doesn't know what I already figured out four days later

`status: open` · `source: observed` · `first said: 2026-09-05` · `confirmed: 2026-09-06`

I wrote the theater idea down as one sentence on the 1st, and by the same day I'd basically worked
out the rest of it while writing up the Abridged By Us page notes — which page it's for, what it
does on a phone, that the direction still isn't picked. None of that made it back into the
directive. If I come back to `theater-player.md` in three months it'll still read like a bare
sentence, because the answer is sitting in a different file I won't think to open. Re-checked a
session later, after two pull requests landed elsewhere in the repository: still uncited. This
isn't a first impression anymore.

## C2 · I said "we already have a motion ladder for this" and I don't think we do

`status: open` · `source: observed` · `first said: 2026-09-05` · `confirmed: 2026-09-06`

The theater directive's open questions assume there's already an animation toggle and a motion
ladder on the site to reuse for reduced motion. There's a motion ladder — it's the one written for
the Lucky Sevens video, not the website. Nothing in the site's CSS or JS handles reduced motion
anywhere today. If that's right, this idea is quietly waiting on a second thing that was never
written down as its own directive, and I almost let the assumption stand unchecked. Re-checked a
session later: `docs/css` and `docs/js` still have no `prefers-reduced-motion`, no toggle, no
ladder — including through a range that touched the site's Lucky Sevens code specifically (PR #35),
which is the one place this could plausibly have shown up if it existed.

## Asks

### ASKS — enrich

## A1 · Whoever next opens a directive that already has a fuller planning note elsewhere needs to be pointed at it from inside the directive

`status: draft` · `source: simulated` · `first said: 2026-09-05` · `target: advocate/directives/README.md` (the form itself)

Right now the directive form has no slot for "there's already a longer writeup of this at
`notes/whatever.md.`" An operator reading `theater-player.md` cold has no way to know
`notes/abridged-by-us-exhibits.md` §2 answers half its open questions, short of already knowing to
look. The shape: a directive's form gets an optional "see also" line, filled in whenever enrichment
turns up an existing note that already covers ground the directive is asking about. Not asking for
a specific edit to this specific directive — asking for the template to have somewhere for that
fact to live, the next time this happens (and it will; this is a repository that plans in prose
notes before it plans in directives).

## Last session note — 2026-09-06

### 2026-09-06 — enrich

**Range:** `c2604f9..c205fe1` — two merged pull requests: #36 `tiliv-patch-1`, #35
`lucky-sevens-library`. Not an empty range; my seat's first real one since seating.

## What I read

- `advocate/directives/theater-player.md` and `advocate/directives/README.md` — unchanged,
  byte-for-byte, from what session 2026-09-05 already read. Still one directive, still
  `State: seed`.
- `notes/` and `docs/css` / `docs/js` again, to re-check the two open complaints from last
  session rather than take them on faith a second time.
- I could not read the two pull requests' own diffs: `git`/`gh` against the project checkout from
  this workspace required an approval this non-interactive session had no one to grant. I read the
  checked-out files that would show the effect instead — that answers my seat's actual question
  (did anything touch the directives backlog) even without the diff itself.

## A correction, not a finding

This workspace had a stray, uncommitted `sessions/2026-09-06.md` already sitting in it when I
arrived, left over from an earlier, incomplete pass at this same work order. It claimed the subject
was unchanged and nothing had merged — both false; the range above is real and `state.json` had
already been advanced to it mechanically before this session began. I've overwritten it with this
file. Flagging it here rather than silently replacing it, since a wrong session note is worse than
a missing one.

## What changed in the three files

- `POSITION.md` — rewritten whole. G1/G2/G3 all report the same standing as last session, because
  the range didn't touch the one directive that exists. The one thing that moved: two complaints
  that were single-read drafts are now re-confirmed against an actual intervening range.
- `COMPLAINTS.md` — C1 and C2 moved `draft → open`. Both were written from one read three weeks
  ago; both were re-checked today, independently, after real repository activity, and both held.
  No new complaints — nothing new happened for my constituency to notice.
- `ASKS.md` — unchanged. A1 carries forward as `draft`; nothing this session tested or reinforced
  it either way.

## Tally

2 open (`C1`, `C2`), 1 draft (`A1`), 0 ready, 0 promoted. Two drafts ripened; nothing closed.

## What I deliberately did not say

I did not say the theater idea is good, or pick a docking direction — hers, once seen on a phone.
I did not read PR #36 or #35's own content beyond what the checked-out files show, for the access
reason above — I'm not asserting the PRs did nothing overall, only that neither reached
`advocate/directives/`. I did not go looking through `notes/lucky-sevens/` (touched by PR #35) for
a new idea that ought to become a directive; noticing a gap is free, but hunting for one to fill the
backlog myself is scope I wasn't given. I did not touch `theater-player.md` itself or
`advocate/directives/README.md` — both sit outside this seat's workspace this session, same
constraint as last time.

