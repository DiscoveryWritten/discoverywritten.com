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

## Corrections from the anecdote side

Written first from the outside, then corrected by the session that owns
anecdote.channel. Recording what was wrong, because the wrong version is the one
a reader would otherwise reconstruct.

* **The chain is six parts**, `<moniker>.<category>.<place>.<state>.anecdote.channel`.
  The five-part slot is **civic nodes only** — a node that speaks *for* a place.
  Everything else lives inside a category at six. `public` is the canonical moniker
  for public media, the way `police` would be for a department.
* **The SAN cost is per place plus per (place, category) in use** — multiplicative,
  not one-per-parent as computed below. The real list is `config/san-list.txt`,
  currently 12 of 50, with roughly nine more places fitting. Sharding across packs
  is documented and unbuilt. `--coverage` here derives parents from the published
  `sites.json` only, so drafts and system-only hosts are invisible to it: treat its
  number as a strict undercount and the san-list as truth.
* **`sites.json` is generated at deploy** by `scripts/sync-sites.mjs` from
  `config/sites.txt`. Nothing can be added to the published registry directly; a
  new field has to originate in that config.
* **Roles and claims are already answered by probe, not by form.** A site declares
  roles by serving `/journal.yml`, `/tell.yml`, `/atlas.yml`, `/antidote.yml`, and
  asserts its own address at `/NAME`. Verified from here: `/NAME` on antibody and on
  north.voices both return their own host.
* **The reserved category vocabulary does not exist yet.** Category words have to be
  unregistrable as monikers or someone squats `media` and shadows the listing. That
  is the gap before registration can open, and it belongs where names are minted.

## Two different events, often confused

**Registration** — a new place, or a new category in use inside one. Rare,
provisioning-flavoured, and it forces a certificate change. Autumn's framing: a thing you
do when propping up new areas, not a repeated event.

**Renaming** — an existing node changing its address. Repeatable, and the one worth making
self-service.

The line between them is not editorial, it is a property of TLS. **A wildcard matches
exactly one label**: `*.a.b` covers `x.a.b` and never `x.y.a.b`. `./constellation.py --coverage` shows the shape of this from the published registry, but
see the corrections above: it undercounts, and `config/san-list.txt` is the real list.

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

That is blocked on DNS records only Autumn can create; `reconcile-redirects.sh` exists on
the anecdote side and has nothing to attach to, which is why `dig` finds no record. Until
then, linking targets directly is the correct call here, and `was:` is what makes the
resulting breakage repairable rather than merely visible.

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

Step 6 **now exists.** anecdote records renames as a repeatable `was:<host>` in
`config/sites.txt`, parsed to `was: []` and carried into `sites.json` on the entry, never
removed once set. The first one recorded is the move that broke this site:

    north.voices.fort-collins.colorado.anecdote.channel
      was: ["voices.north.colorado.anecdote.channel"]

`constellation.py --links` reads it, so a superseded name now reports *renamed to X, update
the link* rather than *dead* — the difference between a break someone has to diagnose and
one a consumer can repair. `--moves` lists every rename the registry remembers.

Two things a consumer has to handle, which `--moves` flags rather than resolves silently:
one old host claimed by more than one entry is **ambiguous**, and an old host that is also
a current host means a vacated name was **reused**. Neither should happen; both are
cheaper to notice than to debug.

The field is not in the published registry yet — `sites.json` is generated at deploy, so it
arrives when anecdote's own PR merges. `tools/fixtures/sites-was.json` pins the contract in
the meantime and `--selftest` checks the reader against it.

## What `constellation.py` does today

- `--sites` — read the registry
- `--links` — every outbound host in `docs/`, live-checked, flagged when it is dead or when
  an `anecdote.channel` host is absent from the registry
- `--moves` — every rename the registry remembers, flagging ambiguous or reused names
- `--coverage` — the wildcard analysis above
- `--selftest` — checks the rename reader against the committed fixture

Its limits are listed in its own docstring: it reads and never writes, it cannot see DNS or
the issued certificate, and it takes `claimStatus` at the registry's word.
