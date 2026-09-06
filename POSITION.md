# POSITION — one-more-record

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
