# Directives — the ideas we put in early

A **directive** is an idea recorded before anyone knows what is downstream of it.
That is the whole point: you write it when it is still one sentence, precisely
because you cannot yet see what it implies. Discovering the implications is the
work, and it stays true no matter how much has already been discovered — there is
always more to enrich.

The `enrich` advocate develops these. It does not decide anything and it does not
implement them. It thickens them: what this would touch, what it contradicts,
what question has to be answered before anyone could start, what it turns out to
be a special case of.

## Why files here, and not GitHub issues

Autumn's instinct was open issues, and the shape is right — a queue of intent you
mean to get to, driven toward empty. Files win on two counts specific to this
machinery:

1. **The advocate's scope is this repository at the checked-out commit.** Its own
   method says that if answering a question needs something not in the checkout,
   that is not its question. GitHub issues are not in the checkout. Directives as
   files are.
2. **A directive is enriched in place; an issue can only accrete comments.** The
   third pass over a directive should *replace* the second, the way `POSITION.md`
   is rewritten whole rather than appended. A thread cannot do that.

A directive that graduates becomes a pull request, and its file says so and stops
being open. That is what inbox zero means here.

## The form

One file per directive. Front matter is not required and no tool parses this —
the reader is an agent, and prose is the interface.

```markdown
# <what the idea is, in one line>

**Seeded:** YYYY-MM-DD by <who>
**State:** seed | enriched | blocked | graduated → PR #N | dropped

## The directive

One or two sentences, in her words where possible. Do not improve it. The
imprecision is data.

## What we have learned since

Rewritten whole each pass, not appended.

## Open questions

The ones that must be answered before anyone could start.

## What this turned out to touch

Filled in as it is discovered. Often the most valuable section.
```

## Rules for the enricher

- **Never widen the directive into a different idea.** If it seems to want to be
  something bigger, say so under open questions and leave the original line alone.
- **Enrichment is allowed to conclude "this is smaller than it looked."** Shrinking
  a directive is a real result.
- **A directive may be dropped**, but only by her. The advocate may recommend it.
- **Do not implement.** Graduating means writing the pull request description, not
  the pull request.
