# Seat · one-more-record

`advocate/one-more-record` · last spoke **2026-09-06** · 2 session(s) · 5 draft · 0 ready

<sub>Copied whole from the branch, which is the authority. Do not edit this page — it is
overwritten every round.</sub>

## Position

### POSITION — one-more-record

Range this session: `c2604f9..c205fe1` (2 commits, first-parent: merge of PR #35
"lucky-sevens-library", merge of PR #36 "tiliv-patch-1"). Read against the three goals in
`advocate.yml`.

## What moved, and why it isn't mine

Both commits touch only `notes/lucky-sevens/` and the new `docs/library/lucky-sevens/` — QR
bottle video loops for the Lucky Sevens exhibit and the JSON/README notes that drive them
(`links.json`, `lyrics.json`, `spans.json`, a library README documenting placement and
regeneration). None of it touches `index.html`'s tile list, `docs/css/collectorate.css`, any
exhibit page's `<link>`/`<script>` includes, or the root `README.md` — the four places my
constituency actually edits when adding the next record. Lucky Sevens is an exhibit already
underway, not a new record being added the way this seat watches for, and its own library README
already documents its conventions in the way G3 asks for — just for a different audience than
mine. **My constituency does not notice this range.** Nothing here moves any of my three goals in
either direction.

## The three goals, as they stand

**G1 — Adding a record touches one place per fact, not one place per page.** Unchanged from last
session's read, with one piece resolved. `collectorate.css`'s token-block pattern remains one
place per fact for a record's visual identity (6 records: collectorate, promise, nanofilament,
lockthemirror, healyourself, buttoncrash). `larastelle.html`/`larastelle.css` still sit outside
it — and this session I checked what last session left `unmeasured`: git history shows
`docs/css/larastelle.css` was added 2025-05-16/18, and the token-block pattern in
`collectorate.css` first appears 2026-08-22 (`e073ea8`, the Collectorate/PROMISE/Nanofilament/
BITFLIP/Lock The Mirror commit) — fifteen months later. **Larastelle is the fossil, not a live
exception.** It predates the shared pattern; nothing about it was a deliberate choice to opt out.
That resolves the uncertainty, but not the risk: nothing in the repository itself says this, so a
person reaching for the nearest existing page as a template still has no way to know that
larastelle is the one page not to copy. `index.html`'s tile list is still the one genuinely
unavoidable one-edit-per-record surface — no per-record file could hold a tile in isolation.

**G2 — No hand-maintained number lives in more than one file.** Unchanged, not met. The
`?v=` cache-busting suffix on shared assets (`collectorate.css`, `showcase.css`, etc.) is still
hand-copied into at least eight HTML files. Nothing in this range touched a shared asset or its
version stamp, so there is nothing new to check for drift.

**G3 — A convention that exists only in a previous page's markup is written down somewhere a
person can find it before copying.** Unchanged, not met, for the exhibit-page path. Worth naming
precisely because this range makes the contrast visible: the Lucky Sevens *library* now has
exactly the kind of findable, gathered documentation this goal wants
(`docs/library/lucky-sevens/README.md` — what the files are, how to place them, how to
regenerate them) — proof the pattern is achievable here, just not yet applied to the
exhibit-authoring path (`index.html`, `collectorate.css`, the per-page `record-nav` convention)
that this seat actually watches.

## Tally

G1 partially met, now fully measured (no `unmeasured` rows remain). G2 not met, unchanged. G3 not
met for my path, unchanged — though this session found a working example of the pattern
elsewhere in the repo, which sharpens what "met" would look like here. Four complaints stand,
all originally `draft`; one (C3) ripens to `open` this session on the strength of the larastelle
finding. Two asks stand, unchanged.

## Complaints

### COMPLAINTS — one-more-record

## C1 · I bump one file's version number and now I have to remember which other seven pages copy it

`status: draft` · `source: observed` · `first said: 2026-09-05`

Every page that loads `collectorate.css` writes its own `?v=20260901` by hand. It's not one
number, it's one number typed eight separate times, and the only thing keeping them in sync
right now is that nobody has forgotten yet. If I bump the stylesheet at midnight on my phone and
miss one page, that page keeps serving the old CSS from cache and I won't know — nothing will
tell me, it'll just quietly look wrong to whoever opens it next.

## C2 · Two records added at once always collide on the same file

`status: draft` · `source: observed` · `first said: 2026-09-05`

Adding a record's tile to `index.html` means editing the same block every other new record also
edits. There's no way around it — nothing else holds that tile. It's a small, predictable
merge conflict every time, not a surprising one, but it's still a cost I pay on every record and
would keep paying on the next fifty.

## C3 · Nothing tells me larastelle is the one page I shouldn't copy

`status: open` · `source: observed` · `first said: 2026-09-05` · `ripened: 2026-09-06`

I checked, this session: `larastelle.css` is from 2025-05-16, and the token-block pattern every
other record now uses didn't exist until 2026-08-22 — fifteen months later. It's not a deliberate
exception, it's just older than the convention. But that fact lives in git history, not in the
repository a person actually opens. If I reach for the nearest existing page as a template at
midnight, larastelle looks exactly as valid as any of the six that follow the shared pattern —
there's nothing on the page, or near it, saying "this one predates the pattern, don't copy it."
Knowing the answer myself didn't fix the thing that made me not know it.

## C4 · There's nowhere to read "how to add a record" before I start copying a page

`status: draft` · `source: observed` · `first said: 2026-09-05`

The conventions that do exist are written down — as comments on the pages that follow them, like
the "Standalone record: no record-nav" note repeated on four exhibit pages. But that only helps
if I already opened the right page. Starting from the README tells me nothing.

## Asks

### ASKS — one-more-record

## A1 · A shared asset's cache-busting version needs one source, not one per page that includes it

`status: draft` · `source: observed` · `first said: 2026-09-05` · `target: whoever next touches
the page-authoring path`

Relates to C1. An operator adding or editing a record needs the current version stamp for a
shared file (collectorate.css, showcase.css, site.css, accessibility.css) to come from
somewhere she reads once, not somewhere she retypes per page. The shape: one version fact per
shared file, referenced rather than copied, so a bump can't be half-applied. Not mine to say how
— build step, include, or something else is a decision for whoever owns the authoring path.

## A2 · A person starting a new record needs one page to read before copying an old one

`status: draft` · `source: observed` · `first said: 2026-09-05` · `target: whoever next writes
for a new contributor's first record`

Relates to C4, and now C3 (ripened 2026-09-06: larastelle is confirmed to predate the shared
token-block pattern by fifteen months, but nothing in the repo says so — only git history does).
The conventions already exist and are already written down correctly — they're just scattered as
comments across the pages that follow them, or in this case, not written down anywhere at all.
The shape: one findable page that states what a record's markup is expected to do (token block
vs. standalone stylesheet, record-nav vs. standalone, the tile in index.html) and which existing
pages are the pattern versus which predate it, before someone reaches for an existing page as a
template. Not mine to draft that page's contents. `docs/library/lucky-sevens/README.md`, added
this range, is an existing example elsewhere in this repo of the kind of gathered documentation
this asks for — for a different exhibit's asset library, not the exhibit-page path, but proof the
pattern is already in the author's own habits.

## Last session note — 2026-09-06

### 2026-09-06

Range: `c2604f9..c205fe1` — two first-parent merges, PR #35 "lucky-sevens-library" and PR #36
"tiliv-patch-1". Both touch only `notes/lucky-sevens/` and the new `docs/library/lucky-sevens/`:
QR bottle video loops for the Lucky Sevens exhibit, a library README documenting them, and a
restructuring of the lyrics/spans/links JSON that drives them.

**My constituency does not notice this range.** Nothing in it touches `index.html`'s tile list,
`docs/css/collectorate.css`, any exhibit page's includes, or the root `README.md` — the surface
this seat watches for the cost of adding the next record. Lucky Sevens is an exhibit already
underway, authored through its own working notes, not a new record being added the way G1–G3
describe. A range that touches nothing my constituency notices is close to one line, and this is
that line: nothing here moves any of my three goals.

Since the range gave me nothing to speak to directly, I spent the session on the thing last
session left `unmeasured` instead: whether `larastelle.html`'s standalone stylesheet is a
deliberate exception to the token-block pattern or just older than it. Git history settles it —
`larastelle.css` is from 2025-05-16/18, the token-block pattern first appears 2026-08-22
(`e073ea8`), fifteen months later. It's the fossil, not a live alternative. That resolves G1's
open question but not the underlying risk, so I rewrote C3 from "I don't know which it is" to
"nothing tells me which it is, even now that I do" and moved it `draft → open` — it's a stated,
standing complaint now, not a guess. Rewrote `POSITION.md` whole to reflect this: G1 is now fully
measured (no `unmeasured` rows left), G2 and G3 unchanged. Noted in passing that this range's own
`docs/library/lucky-sevens/README.md` is a working example of the gathered documentation G3 and
A2 ask for — just for a different audience, not the exhibit-page path.

**Tally:** 4 complaints — 3 draft (C1, C2, C4), 1 open (C3, ripened this session). 2 asks, both
draft (A1, A2, lightly updated to cite the larastelle finding). Nothing closed, nothing
promoted.

**What I deliberately did not say:** I did not treat the Lucky Sevens library restructuring as
mine to comment on even though it visibly *does* the thing G2 and G3 ask for (single-sourced
JSON, a gathered README) — that library isn't a "record" in the sense my seat watches, and
commenting on it anyway would be reaching into an exhibit that already has its own working
process, which isn't my constituency's problem to have opinions about. I did not go looking for
whether other pages besides larastelle predate the token-block pattern — one confirmed fossil
answers this session's open question; a fuller audit of the other pre-2026-08-22 pages is next
if it turns out to matter more than a single-page ask/complaint already covers. I did not touch
the stray `sessions/2026-09-06.md` that existed before this session ran (it read "nothing merged
since the last session," computed against a workspace whose `state.json` had already advanced to
the subject commit before the range was read) — this file replaces it with the real range.

