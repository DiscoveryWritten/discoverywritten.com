# Seat · one-more-record

`advocate/one-more-record` · last spoke **2026-09-05** · 1 session(s) · 6 draft · 0 ready

<sub>Copied whole from the branch, which is the authority. Do not edit this page — it is
overwritten every round.</sub>

## Position

### POSITION — one-more-record

Seated 2026-09-05, subject at `c2604f9`. This is an opening position, not a range report:
there is no prior session to diff against, so what follows is a read of the repository as it
stands, against the three goals in `advocate.yml`.

## G1 — Adding a record touches one place per fact, not one place per page

**Partially true, and better than the seat's framing suggested.** `docs/css/collectorate.css`
already centralizes a record's visual identity into one `body.<record>` token block per record
(6 of them today: collectorate, promise, nanofilament, lockthemirror, healyourself, buttoncrash),
with everything else in the file shared. The header comment says this on purpose: "Each record
sets the token block; nothing below it is per-album." That is one place per fact, working as
intended.

`larastelle.html` sits outside that pattern entirely — its own `larastelle.css`, its own fonts,
its own fixed-size background mechanics — and nothing in either file says whether that is a
deliberate exception (an older, more bespoke exhibit) or the record where the shared pattern
hadn't been invented yet. I can't tell which from the code, so I report this **unmeasured**
rather than guess.

The one place that is unavoidably one-edit-per-record is `index.html`'s tile list (the
`.links.media` block, 8 tiles today, one `<div class="group-label">` per act). Every new record
adds a block there, in the same list every other new record also edits — this is the literal
collision point the seat's constituency describes, and it is structural, not accidental: there
is no per-record file that could hold a tile in isolation.

## G2 — No hand-maintained number lives in more than one file

**Not true today, concretely.** The cache-busting `?v=` suffix on a shared asset is copied by
hand into every page that includes it, rather than read from one place. `collectorate.css?v=20260901`
alone is independently hand-typed in at least 8 HTML files (collectorate, buttoncrash,
healyourself, lockthemirror, nanofilament, promise, abridged, and referenced again for
showcase.css from index.html). Version values are internally consistent right now — I checked for
format drift across every `?v=` in `docs/*.html` and found none, only three date-stamps
(20260822, 20260823, 20260901) applied correctly per file — but consistency here is a property of
recent hand-discipline, not of anything that would catch a miss. If collectorate.css is bumped
next and one of those eight files isn't touched, that page silently serves a stale cached copy;
nothing checks it and nothing would say so.

## G3 — A convention that exists only in a previous page's markup is written down somewhere findable

**Not true.** The root `README.md` says nothing about adding a record. The conventions that do
exist are real, but they live as comments on the pages that follow them, not anywhere gathered:
`docs/collectorate.html`, `promise.html`, and four others each carry a one-line HTML comment
declaring whether they use `record-nav` or are "Standalone record: no record-nav" — which is
good practice, but only reaches someone who opens the right existing page and reads its comments
before starting a new one. There is no single page a person would land on first.

## Tally

Three goals read: G1 partially met (one real exception, unmeasured), G2 not met (confirmed),
G3 not met (confirmed). No prior complaints exist to compare against — this session's output is
the baseline the next one measures against.

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

## C3 · I don't know if larastelle is the exception or the fossil

`status: draft` · `source: observed` · `first said: 2026-09-05`

Every other record's look lives as one token block in `collectorate.css`. LARASTELLE has its own
whole stylesheet instead, and nothing says why. If I copy that page as a starting point for a
new record because it happens to be the one I have open, I'd be rebuilding a special case
instead of using the shared one — and I wouldn't necessarily notice I'd done it.

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

Relates to C4. The conventions already exist and are already written down correctly — they're
just scattered as comments across the pages that follow them. The shape: one findable page that
states what a record's markup is expected to do (token block vs. standalone stylesheet,
record-nav vs. standalone, the tile in index.html) before someone reaches for an existing page as
a template. Not mine to draft that page's contents.

## Last session note — 2026-09-05

### 2026-09-05

First session. No range exists yet — this is seating, not reporting, per METHOD.md §0. Subject
read at `c2604f9`.

Read `docs/` for how a record is added today, against the seat's three goals: `collectorate.css`
(the token-block pattern and the one file that breaks it, larastelle.css), `index.html`'s tile
list, every album page's `<link>`/`<script>` includes for `?v=` drift, and the root `README.md`.

Wrote an opening `POSITION.md`: G1 partially met (the token-block pattern already does one place
per fact for a record's visual identity; larastelle is an unexplained exception, reported
unmeasured rather than guessed at), G2 not met (a shared asset's version number is hand-copied
into every page that loads it — confirmed in at least 8 files for collectorate.css alone), G3 not
met (no page documents how to add a record; the real conventions that exist live only as comments
on pages that already follow them).

Opened four complaints (C1–C4), all `status: draft`, `source: observed` — none are testimony,
all are my own reading of the code. Opened two asks (A1, A2) naming a shape, not an
implementation, for the two complaints closest to actionable.

Tally: 4 draft, 0 open, 0 ready, 0 promoted. Nothing to close yet — nothing existed before this
session.

**What I deliberately did not say:** whether larastelle's separate stylesheet is a mistake or a
deliberate choice — I don't have the history to tell, so it's `unmeasured` in POSITION.md rather
than a complaint. I did not touch the Jekyll question at all; that's `notes/abridged-by-us-exhibits.md`'s
call, named out-of-scope in my own config. I did not check whether the `?v=` values I found are
*correct* against each file's actual last-modified state — only that the same value is typed more
than once per shared file, which is the structural fact, not whether today's copies happen to
agree.

