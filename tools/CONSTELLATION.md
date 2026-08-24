# Self-service moving — what it would take

Notes toward letting a node change its own name, written after this site shipped a dead
link because one did. `constellation.py` is the runnable part; this is the reasoning around
it. Nothing here is decided — it is a place to staple things to.

## What the registry already does

`anecdote.channel/sites.json` is the source of truth and the page is only a renderer over
it. Each entry already carries most of the vocabulary a self-service system needs:

| field | what it is | today |
| --- | --- | --- |
| `host` | the constellation address | 10 sites |
| `served` | whether anecdote serves it, or it is a pointer | 4 true, 6 false |
| `claim` / `claimStatus` | the name the site asserts for itself, and whether the registry agrees | 3 `agrees`, 7 `unclaimed` |
| `labelFrom` | provenance of the display name — its own title, the target's, or config | |
| `to` / `via` / `href` | where an unserved entry actually points, and how that was discovered | `repo homepage`, `pages cname`, `config` |
| `targetLive` etc. | health of the thing pointed at | |

`claimStatus` is the interesting one. A site declaring the name it believes it has, and the
registry recording agreement or disagreement, is already the shape of self-service: the node
asserts, the registry reconciles. What is missing is what happens when the assertion
*changes*.

## Two different events, often confused

**Registration** — a new place or a new topic inside one. Rare, provisioning-flavoured,
and it forces a certificate change. Autumn's framing: a thing you do when propping up new
areas, not a repeated event.

**Renaming** — an existing node changing its address. Repeatable, and the one worth making
self-service.

The line between them is not editorial, it is a property of TLS. **A wildcard matches
exactly one label**: `*.a.b` covers `x.a.b` and never `x.y.a.b`. Run
`./constellation.py --coverage` for the current picture — today 7 wildcards for 16 names,
because each topic tier (`media`, `voices`, `trade`) creates its own parent.

So:

- a new node under an existing parent — `something.media.fort-collins…` — is already
  covered, and could be instant and self-service
- a new place or topic creates a parent that is not covered, and cannot be instant, because
  a certificate has to be reissued first

And a rename is whichever of those it lands in. NCCV's move is the worked example: it went
from parent `north.colorado.anecdote.channel` to parent
`voices.fort-collins.colorado.anecdote.channel`. That is a *new parent*, so despite feeling
like a rename it was registration-class work, and the old name went dark.

## The gap that actually broke something

The registry knows FC Public Media as `public.media.fort-collins.colorado.anecdote.channel`
and points it at `new.fcpublicmedia.org`. But that constellation host **does not resolve** —
`served: false` means the entry is a pointer, not an address.

That matters more than it looks. The promise of mapping someone's domain is a stable name
that survives them moving. Right now:

- link the constellation host → dead for any unserved node
- link the target directly → breaks the day they move, silently

Neither is stable, so downstream sites have nothing safe to point at. This site links
targets directly for exactly that reason.

**The missing piece is that every registry entry should resolve**, even the pointers, and
redirect to wherever the node currently lives. Then a node can move as often as it likes and
nothing downstream notices — which is the actual product.

## What renaming would have to do

1. accept the new name and check it is free, well-formed, and inside covered parents
2. if it is not covered, this is registration: queue a certificate change, do not promise
   an instant switch
3. **keep the old name resolving and redirecting.** Permanently, or long enough that
   downstream links can be repaired. This is the step that did not happen
4. update the registry entry, keeping the old host as a recorded alias rather than deleting
   it
5. re-derive `claimStatus`, since the claim and the host have to agree again
6. give downstream sites something to check — a machine-readable "this moved" is what turns
   a silent break into a fixable one

Step 6 is the one this repo can already use: an alias field in `sites.json` would let
`constellation.py --links` say *"this was renamed, here is the new name"* instead of merely
*"dead"*.

## What `constellation.py` does today

- `--sites` — read the registry
- `--links` — every outbound host in `docs/`, live-checked, flagged when it is dead or when
  an `anecdote.channel` host is absent from the registry
- `--coverage` — the wildcard analysis above

Its limits are listed in its own docstring: it reads and never writes, it cannot see DNS or
the issued certificate, and it takes `claimStatus` at the registry's word.
