# Abridged By Us — exhibit pages, and everything Jekyll would have to carry

Written 2026-09-01. Autumn's instruction: get the pages well made first, Substack
included, and **know everything we want to do before starting any Jekyll magic**.
So this is the inventory, not a migration plan. Jekyll is deliberately not
designed here — it gets designed against a finished version of section 6.

Nothing in this file is built yet.

---

## 1. What the page is

Today `docs/abridged.html` is a library of 17 cards and every card throws you out
to YouTube. Autumn's objection is not that leaving is rude, it is that leaving
costs her the ability to say anything:

> I'd rather be in a position where it says YouTube won't even show it, look at
> them, than have them get kicked to YouTube and me not able to say anything.

So each episode gets its own exhibit page, shaped like the album exhibits — the
player on one side, panels of text on the other, previous/next paging. The index
keeps existing; its cards point inward instead of outward.

## 2. Layout: the player rests as a theater

At rest the player is **docked across the top**, full width — a theater. As you
scroll it **animates into its side column** and takes its half. The container
holding the player is what knows its resting position is the wide one; the
scrolled position is the one the album pages already use. She is explicit that
the inverse is equally acceptable (start docked in the column, expand at the
top), and that this is not a new idea — it is the existing sticky player with a
resting state added.

On a phone there is no theater and no side column: the player is the top piece,
which is exactly the measured sticky stack from PR #28 (`--player-h` feeds the
nameplate and everything below it).

## 3. The panels, and the preamble as a chapter

The content column is panels, paged with the canonized scroller
(`docs/js/scroller.js`, PR #28) — marks are characters, previous/next is the
mechanism.

**The preamble becomes chapter zero.** Several episodes have introductory text.
Today that would force the all-in-one scrolling flow back, with the marks
skipping down past it. Instead the preamble is its own panel before the first,
the way Larastelle opens on a Foreword. Autumn: *"it makes it feel like the album
has a resting state just like the fact the player isn't playing yet."*

**The prose does not get chapter navigation.** Chapters are a fact about the
video's timeline, not about the text — some map to a clean paragraph and many do
not. So chapters drive the *player*, and the text panel shows whole. This matters
most on the enormous ones: Death's End is 1:05:30, and its text cannot compete
with the video for space.

## 4. The right panel becomes a source picker — for text

This is the interesting inversion. The album pages let you pick a music service.
The Abridged pages let you pick **where the words come from**, using the same
tile row and the same `source()` machinery:

| Source | Coverage | Where it comes from |
| --- | --- | --- |
| Her write-up | every episode | hers, authored per page |
| Verbatim text | every episode | Wikipedia at the linked revision, via `tools/abu_sentences.py` |
| Substack recommendation | **some only** | her Substack, not mirrored here |

**The publication is `autumnvalenta.substack.com`, named Discovery Written, and it
has exactly 9 posts: 8 books plus one intro essay. So the Substack tile appears on
8 of 17 episodes.** All public, no paywall; full text in the RSS feed
(`/feed`, complete `content:encoded`) and in `/api/v1/archive?sort=new&limit=50`
(limit=100 is rejected). No sitemap.

| Episode | Post |
| --- | --- |
| mote-in-gods-eye | `/p/the-mote-in-gods-eye` |
| snow-crash | `/p/snow-crash` |
| windup-girl | `/p/the-windup-girl` |
| revelation-space | `/p/revelation-space` |
| three-body-problem | `/p/the-three-body-problem` |
| pandoras-star | `/p/pandoras-star` |
| a-fire-upon-the-deep | `/p/a-fire-upon-the-deep` |
| warbreaker | `/p/warbreaker` |
| *(intro, not an episode)* | `/p/coming-soon` — "On Discovery Written and AI." |

No post: leviathan-wakes, deaths-end, dark-forest, dune, lies-of-locke-lamora,
name-of-the-wind, and all three Lord of the Rings.

Gotcha for any linking code: three Substack slugs carry a leading `the-` the
episode slugs do not — `the-mote-in-gods-eye`, `the-windup-girl`,
`the-three-body-problem`. The other five match exactly. Map explicitly; do not
derive.

Each post is: embedded audio player, then her review essay (~800–3,500 words),
then the literal marker **`The Wikipedia text lyrics follow:`** and the full
verbatim block. So Substack is independently a second source for the verbatim
text on those 8.

She does not want to mirror Substack yet — treat it as the recommendation engine and link or embed it, which
leaves her own supplied content free to cover all 17 while Substack shows up
sometimes. Her framing of that publication: she only covered books she liked so
she called them recommendations rather than reviews, and then opened with a pan
of *The Mote in God's Eye* — a mean article that still tells you to read it.

Open decision: **link out, iframe the Substack embed, or fetch and render.** Not
decided. Fetching means mirroring, which she declined for now.

### ⚠ Rights: do not republish the Warbreaker text here

Her own Warbreaker post carries a note distinguishing the text from the video:

> this text post is not fan art, and is thus has no exemption to the
> no-derivatives rights policy that the audio/video enjoys

— linking Brandon Sanderson's rights explanation and pointing readers at
Coppermind for the source text. The audio/video has an exemption; a text
reproduction does not. **The verbatim panel must therefore not be generated for
Warbreaker**, and the same question should be asked of any episode whose source
is not Wikipedia's CC-BY-SA text. This is a per-episode property, not a global
one — the page should be able to say "the text isn't mine to reprint, here is
where it lives" the same way it says a video will not embed.

## 5. Inventory — what exists, what is missing

### Already solved, in-repo

`tools/abu_sentences.py` turns out to carry most of the data problem already. Its
`EPISODES` registry has, for all 17: slug, book title, Wikipedia `oldid`, the
section to take, YouTube id, runtime in seconds, and category. It fetches the
revision, strips markup, and splits to one sentence per slide — which *is* the
caption text, because the episode reads the revision straight-faced. It checks
itself against `tools/fixtures/*.srt`.

Verified 2026-09-01: `--check` passes. Leviathan Wakes 43 sentences, 41 exact
against its captions and 2 deliberate drifts; Lies of Locke Lamora 36/36 exact.

Thumbnails for all 17 are already in `docs/img/abu-<videoid>.webp`.

### Verified this session

**Embeddability, tested against the real iframe API — 16 of 17 embed.**

The runtimes reported by YouTube match the registry's `seconds` exactly on every
one, which independently confirms the registry.

> **The Windup Girl (`dXWdoAqt6v0`) fails with error 150** — playback in embedded
> players is disallowed. It is her own upload, so this is almost certainly a
> rights claim rather than a setting she flipped. Worth checking YouTube Studio
> once; if it is a claim, this is precisely the episode the new page exists for.
> It gets to say, on her page, that the video will not be shown here and why —
> instead of silently bouncing someone to YouTube.

### Still missing

| Thing | Status | Where it lives |
| --- | --- | --- |
| Her write-up per episode | **missing** | Discord (see below) |
| Preamble text per episode | **missing** | Discord |
| Chapter titles + timestamps | **missing** | YouTube descriptions, or Discord. Only the *counts* are in `abridged.html` |
| Per-sentence timings | 2 of 17 | `tools/fixtures/*.srt` — Leviathan Wakes and Lies of Locke Lamora only |
| Substack post URLs | **solved** | `autumnvalenta.substack.com`, 8 of 17, table above |

**Discord is the source of truth.** In the Artist Lockers server, the forum named
after her — starts with `autu`, looks like "autonomy" with an extra u — has an
*Abridged By Us* forum. Every post is hers, one per video, and the thread under
each carries the rest, including the Wikipedia revision links at the revision
they were. Token at `~/.config/discord-export-token`. Only that forum needs
reading; she has not offered her other channels and none are needed.

### Chapter counts on the index today

```
Leviathan Wakes         36:50   9      Pandora's Star           42:32  10
The Mote in God's Eye   41:53  10      A Fire Upon The Deep     22:37   6
Snow Crash              25:08   8      Dune                     29:05  11
The Windup Girl         29:43   8      The Lies of Locke Lamora 36:40   8
Revelation Space        21:02   8      Warbreaker               32:34   9
Death's End           1:05:30   8      The Name of the Wind     40:32  11
The Dark Forest         18:22   5      Fellowship of the Ring    8:22   4
The Three-Body Problem  23:08   6      The Two Towers            6:49   4
                                       Return of the King        6:54   5
```

## 6. What this means Jekyll would have to carry

Not a proposal — the requirement list the migration has to satisfy, which is the
thing she asked to have complete first.

1. **17 near-identical exhibit pages from one template**, differing only by data.
   This is the actual argument for a build step: hand-authoring 17 copies of the
   album template is how the CSS drifted between records already.
2. **The episode registry as data**, not as a Python dict *and* a hand-written
   index page. One source; the index and the exhibits both render from it.
3. **Generated text**, since the verbatim panel comes from a Wikipedia revision
   through a script. Either the script runs at build time or its output is
   committed as data. Committed output is likelier right: the revisions are
   frozen by definition, and a build that hits Wikipedia is a build that can fail
   for reasons that have nothing to do with the site.
4. **Conditional sources** — the Substack tile exists on 8 of 17, and the
   verbatim panel is suppressed where the text is not hers to reprint. Per-episode
   flags, not a uniform template.
5. **The album pages too, eventually.** Every record appends to
   `collectorate.css` and `index.html`, which is why PRs kept colliding at the
   same anchors.
6. **Cache-busting.** `?v=` is hand-bumped across 14 files today and is
   error-prone; a build should stamp it.
7. **Carve-out: `bottles.discoverywritten.com` is explicitly a no-Jekyll straight
   serve of static resources.** Whatever happens here must not touch it.
8. **Deploy stays as it is.** Cloudflare Pages only ever sees the output, so it
   cannot tell the difference — that is what makes this safe to do at all.

## 7. Sequencing

1. PR #28 (mobile pass + scroller) lands. The exhibit pages are built on the
   scroller and the measured sticky stack, so they should not fork ahead of it.
2. Pull the write-ups, preambles and chapter lists out of the Discord forum.
3. Build one episode end to end as the exemplar. Note that **no episode has both
   a caption fixture and a Substack post**, so the choice trades off:
   - **Leviathan Wakes** — flagship, caption fixture, verified per-sentence
     timings, but no Substack tile, so the three-source picker is only exercised
     two-thirds.
   - **The Mote in God's Eye** — has the Substack post (the mean one), so all
     three sources are live, but no timing fixture.

   Recommend Leviathan Wakes first for the layout and the theater, then Mote to
   prove the Substack tile. Get it right on her phone before multiplying.
4. Then the other 16, and point the index inward.
5. Only then design Jekyll, against section 6 as it stands by that point.

## 8. Open questions for Autumn

- **Substack: link, iframe, or mirror?** Iframing keeps it hers and unmirrored,
  which matches what she said, but Substack's embed is heavy and may not theme.
  The full text is in the RSS feed if mirroring ever wins, subject to the rights
  note above.
- **Warbreaker's verbatim panel** — confirm it should be suppressed, and whether
  any other episode has the same constraint.
- **Windup Girl:** check Studio to see whether error 150 is a claim or a setting.
  The page copy differs depending on the answer — "they won't let me show you
  this" is a different sentence from "I turned this off".
- **The theater direction:** dock at top and retreat to the column, or start in
  the column and expand. She said either is fine; this picks itself once one is
  seen on a phone.
- **Chapter titles** — are they in the YouTube descriptions, or only in Discord?
