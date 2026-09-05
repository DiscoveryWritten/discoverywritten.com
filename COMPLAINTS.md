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
