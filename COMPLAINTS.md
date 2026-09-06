# COMPLAINTS — enrich

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
