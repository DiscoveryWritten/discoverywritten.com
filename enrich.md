# Seat · enrich

`advocate/enrich` · last spoke **2026-09-05** · 1 session(s) · 3 draft · 0 ready

<sub>Copied whole from the branch, which is the authority. Do not edit this page — it is
overwritten every round.</sub>

## Position

### POSITION — enrich

**Session:** 2026-09-05 · **Subject:** `c2604f9` · **First session** — no range yet, no prior
`POSITION.md` to supersede. This is an opening reading, not a diff against one.

## The backlog, as it stands

One directive exists in `advocate/directives/`: `theater-player.md` — "The player rests as a
theater and animates into its column," seeded 2026-09-01 by Autumn, **State: seed**. Nothing else
is in the folder besides the `README.md` that defines the form. The backlog she said she wants to
keep filling early is, right now, one entry deep, four days old, untouched since.

## G1 — every directive read since last touched, and says what it's waiting on

**Half true.** This is the first time an enrich session has read it, and today is that reading —
so the letter of the goal holds. But the file's own "What we have learned since" section still
says "Nothing yet," and that undersells it: `notes/abridged-by-us-exhibits.md` §2 ("Layout: the
player rests as a theater"), written the same day the directive was seeded, already works out most
of what the directive is waiting on — which page it belongs to, what it does on a phone, that the
docking direction is still hers to pick. The directive doesn't cite that note and, as filed, isn't
in a position to. I could not update `theater-player.md` itself this session — that file lives
outside this seat's own workspace, and I was instructed not to touch anything under the project
checkout beyond it. So the gap I'm reporting is real, but closing it is not something I could do
from here today. **Unmeasured:** whether G1's "has been read" is meant to leave a mark on the
directive file, or just to have happened.

## G2 — a directive ready to graduate says so, with its PR description already written

**Not ready.** What's still genuinely open, past what the existing notes already answer:

- **Direction** — dock-at-top retreating to the column, or column expanding to the top. She said
  either is fine, which the directive already records; nothing since has picked one, and nothing
  should until it's seen on a phone.
- **Reduced motion** — the directive's own open questions assume "the site already has an
  animation toggle and a motion ladder written for Lucky Sevens" to reuse for this. I looked:
  `docs/css` and `docs/js` have no `prefers-reduced-motion`, no animation toggle, no motion ladder,
  anywhere. The motion ladder that does exist is written for the Lucky Sevens *video*, not the
  website. If that's right, this directive is quietly waiting on site machinery that doesn't exist
  yet, not reusing something built — that's a different, and bigger, open question than the file
  currently states.
- **Scope** — whether this belongs to Abridged By Us alone or the album exhibits want it too. The
  exhibits note frames it as a property of the container/template, which leans toward "shared,"
  but nothing has decided that.

## G3 — no directive silently widened past what was seeded

**Nothing to report.** The directive hasn't moved in either direction since it was written —
neither widened nor shrunk. Four days of stillness on a one-entry backlog isn't yet evidence of
anything; it's just the starting line.

## What I deliberately didn't check

I did not read the Discord forum the exhibits note says holds the real write-ups — that's a
repository this checkout doesn't have, and not my question. I did not form an opinion on whether
the theater idea is good, or push toward a direction — that's hers.

## Complaints

### COMPLAINTS — enrich

## C1 · The directive doesn't know what I already figured out four days later

`status: draft` · `source: observed` · `first said: 2026-09-05`

I wrote the theater idea down as one sentence on the 1st, and by the same day I'd basically worked
out the rest of it while writing up the Abridged By Us page notes — which page it's for, what it
does on a phone, that the direction still isn't picked. None of that made it back into the
directive. If I come back to `theater-player.md` in three months it'll still read like a bare
sentence, because the answer is sitting in a different file I won't think to open.

## C2 · I said "we already have a motion ladder for this" and I don't think we do

`status: draft` · `source: observed` · `first said: 2026-09-05`

The theater directive's open questions assume there's already an animation toggle and a motion
ladder on the site to reuse for reduced motion. There's a motion ladder — it's the one written for
the Lucky Sevens video, not the website. Nothing in the site's CSS or JS handles reduced motion
anywhere today. If that's right, this idea is quietly waiting on a second thing that was never
written down as its own directive, and I almost let the assumption stand unchecked.

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

## Last session note — 2026-09-05

### 2026-09-05 — enrich

**First session.** No range: per METHOD step 0, this is a seating, not a report against a prior
baseline. Subject at `c2604f9`.

## What I read

- `advocate.yml`'s `enrich` entry and `advocate/directives/README.md` — the mission and the form.
- The one directive that exists: `advocate/directives/theater-player.md` (seeded 2026-09-01,
  State: seed) — the only entry in the backlog.
- `notes/abridged-by-us-exhibits.md`, which turned out to already contain a fuller working-out of
  the same idea (§2), written the same day.
- `docs/css/collectorate.css` and `docs/js/` for `--bar-h`/`--player-h` and any existing reduced-
  motion handling — found the sticky-stack variables, found no `prefers-reduced-motion`, animation
  toggle, or motion ladder anywhere in the site's own code.

## What changed in the three files

- `POSITION.md` — written whole, as an opening position (first ever). Reports G1 as half-true (read,
  but the directive doesn't yet say what's already known), G2 as not ready, G3 as nothing to
  report.
- `COMPLAINTS.md` — two new drafts. C1: the directive and the exhibits notes don't know about each
  other. C2: the directive assumes a site-side motion ladder / reduced-motion mechanism exists; I
  could not find one anywhere in `docs/css` or `docs/js`.
- `ASKS.md` — one new draft. A1: the directive template should have a place to point at a fuller
  note elsewhere, for when enrichment turns one up.

## Tally

2 drafts in `COMPLAINTS.md`, 1 draft in `ASKS.md`, 0 ready, 0 promoted. Nothing to close yet — this
is the first pass.

## What I deliberately did not say

I did not say the theater idea is a good one, or push toward a docking direction — she said either
is fine and that's hers to pick once it's seen on a phone, not mine to nudge. I did not read the
Discord forum the exhibits notes point to for the real write-ups; that's a repository this checkout
doesn't have. I did not touch `advocate/directives/theater-player.md` itself, even though the
directive's own README describes enrichment as editing it in place — that file sits outside this
seat's workspace this session, and the instruction I was seated under was explicit not to touch the
project checkout beyond this workspace. That mismatch between the form's description and what this
session could actually do is exactly the shape of thing the seat's own preamble already flags as
filed elsewhere (`corpus-seats-cannot-speak.md`); I'm not reopening that argument here, just noting
where it bit today. I did not touch other advocates' branches or sessions — `deploy`,
`borrowed-windows`, and `one-more-record` all ran today too, and none of that is mine to read into.

