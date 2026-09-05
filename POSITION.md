# POSITION — one-more-record

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
