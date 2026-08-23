# assets/ds — second-order mirror

Copied from `https://anecdote.channel/assets/ds/` on 2026-08-23, together with the
faces in `../fonts/` that `fonts.css` points at.

`MIRROR.md` alongside is anecdote's own, kept verbatim. Its rule governs this copy too:

> when the source changes, re-copy verbatim. Do not edit these files here.

It also states the intent that makes this copy legitimate rather than presumptuous:

> The design system is **the constellation's** … kept as a separable layer rather than
> folded into this site's stylesheet, so any node that adopts them can take this
> directory whole.

This site is such a node. It adopts the tokens for its project pages — the places where it
says a little about something in the constellation before sending a reader there — and
nowhere else. The exhibit and record pages keep this site's own voice.

`fonts.css` is anecdote's deviation from the upstream system, not ours: upstream pulls its
faces from a third-party host, and anecdote self-hosts them instead so its pages make no
off-origin request. That reasoning applies here unchanged, and the absolute
`/assets/fonts/...` paths in it resolve against this origin without edits — which is why it
could be taken verbatim rather than rewritten.

Space Mono is SIL OFL 1.1; `../fonts/SpaceMono-OFL.txt` travels with it, because vendoring a
font means carrying its terms.
