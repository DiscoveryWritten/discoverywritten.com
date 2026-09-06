# ASKS — one-more-record

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
