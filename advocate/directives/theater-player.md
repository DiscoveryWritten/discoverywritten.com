# The player rests as a theater and animates into its column

**Seeded:** 2026-09-01 by Autumn
**State:** seed

## The directive

> what I'm describing is, like, it can stay where it's at, but our container
> where we hold that player, um, on an abridged by us page needs to know that its
> actual resting position is animated out of place to take up that whole top
> space. you could phrase it the other way around for the inverse too. I'm just
> like, boom. See how it's related? It's not actually a new idea. It's just
> adding something fancy to the resting state.

## What we have learned since

Nothing yet. This is a seed, recorded as the worked example of the form.

## Open questions

- Does this belong only to Abridged By Us, or do the album exhibits want it too?
  She raised it for one page; it is described as a property of the *container*,
  which suggests the template.
- How does it interact with the measured sticky stack (`--bar-h` / `--player-h`)?
  Those are read from a live `getBoundingClientRect` during an animation, so an
  animating player would feed a moving number to everything pinned below it.
- Which direction — dock-at-top retreating to the column, or column expanding to
  the top? She said either is fine, which means it picks itself once one is seen
  on a phone, not in advance.
- What does it do under reduced motion? The site already has an animation toggle
  and a motion ladder written for Lucky Sevens; this should reuse that, not
  invent a second one.
- On a phone there is no side column at all. Is the theater simply the phone's
  normal state, making this a desktop-only behaviour?

## What this turned out to touch

Unknown. That is why it is here.
