# COMPLAINTS — one-more-record

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
