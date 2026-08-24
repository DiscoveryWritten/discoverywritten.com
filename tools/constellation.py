#!/usr/bin/env python3
"""Reconcile this site against the anecdote constellation's registry.

anecdote.channel renders its listing from `/sites.json`, so the registry is
readable without a browser. This reads it and answers three questions:

    ./constellation.py --sites      what the registry currently holds
    ./constellation.py --links      do this repo's outbound links still work
    ./constellation.py --moves      renames the registry remembers
    ./constellation.py --coverage   what TLS names the registry implies
    ./constellation.py --selftest   check the rename reader against a fixture

A content tool, not part of the site. docs/ has no build step and this does
not change that.

Why it exists
-------------
On 2026-08-23 this site shipped a dead link: Northern Colorado Community
Voices moved from `voices.north.colorado.anecdote.channel` to
`north.voices.fort-collins.colorado.anecdote.channel`, the old host stopped
resolving, and nothing here noticed. `--links` is the check that would have
caught it.

What it cannot do yet
---------------------
  * It reads the registry; it cannot write to it. Renaming a node is still a
    manual act at the anecdote end.
  * --coverage UNDERCOUNTS, and is not authoritative. It derives parents from
    the published sites.json, so drafts and system-only hosts are invisible to
    it, and it knows nothing of certificate packs or their 50-host limit. The
    real cost is one wildcard per place plus one per (place, category) in use,
    and the real list is anecdote's own config/san-list.txt. Read this output
    as a shape, not a number.
  * `claimStatus` is reported as the registry states it. This does not verify a
    claim independently. Note sites.json is only ever as fresh as anecdote's last
    deploy, so a node that starts declaring /NAME between deploys reads as
    unclaimed until the next one. Where a live probe and the registry disagree,
    the registry is the stale side by construction.
  * A 403 from a live check is reported as reachable-but-refusing, because
    several hosts block scripted requests while being perfectly fine in a
    browser. A 000 is a real failure to resolve or connect.
"""

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(os.path.dirname(HERE), "docs")
REGISTRY = "https://anecdote.channel/sites.json"
UA = "DiscoveryWrittenSiteBuild/1.0 (autumn@discoverywritten.com)"


def fetch_registry(url=REGISTRY):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    """Report a redirect instead of following it.

    urlopen follows 3xx by default, which would make a vacated host that
    redirects correctly indistinguishable from one that has started serving
    content again under a name it gave up. Those mean opposite things.
    """
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


_opener = urllib.request.build_opener(_NoRedirect)


def live(host, timeout=12):
    """Return (status, location). Status 0 means the host did not answer."""
    req = urllib.request.Request("https://" + host, headers={"User-Agent": UA},
                                 method="HEAD")
    try:
        with _opener.open(req, timeout=timeout) as r:
            return r.status, r.headers.get("Location", "")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Location", "") if e.headers else ""
    except Exception:
        return 0, ""


def outbound_hosts():
    """Every external host this site links to, and which pages link to it."""
    found = {}
    for name in sorted(os.listdir(DOCS)):
        if not name.endswith(".html"):
            continue
        body = open(os.path.join(DOCS, name), encoding="utf-8").read()
        for m in re.findall(r'(?:href|src)="(?:https?:)?//([a-z0-9.-]+)', body):
            found.setdefault(m, set()).add(name)
    return found


def rename_map(reg):
    """Every host a site used to answer to, mapped to what it is now.

    `was` is cumulative rather than a single previous name, so a node that has
    moved twice resolves both of its old hosts to its current one. A set is used
    per key so that a name claimed by two entries surfaces as ambiguous instead
    of silently resolving to whichever was parsed last.
    """
    moves = {}
    for s in reg["sites"]:
        for old in s.get("was") or []:
            if old == s["host"]:
                continue  # an entry naming itself is not a rename
            moves.setdefault(old, set()).add(s["host"])
    return moves


def cmd_moves(reg):
    """List renames, flagging the two states that should be impossible.

    anecdote rejects reused and ambiguous aliases at sync time, so a registry it
    generated cannot contain either. These stay as a consumer-side check: this
    reads a url, and a url is not always the pipeline you think it is.
    """
    moves = rename_map(reg)
    if not moves:
        print("The registry records no renames yet.")
        print("(anecdote writes these as `was:<host>`; they appear at its next deploy.)")
        return 0
    live_hosts = {s["host"] for s in reg["sites"]}
    print("%-54s %s" % ("was", "is now"))
    problems = 0
    for old in sorted(moves):
        now = sorted(moves[old])
        flag = ""
        if len(now) > 1:
            flag = "  AMBIGUOUS - claimed by %d entries" % len(now)
            problems += 1
        elif old in live_hosts:
            flag = "  REUSED - also a current host"
            problems += 1
        print("%-54s %s%s" % (old[:54], ", ".join(now), flag))
    print("\n%d rename(s), %d problem(s)." % (len(moves), problems))
    return 1 if problems else 0


def cmd_sites(reg):
    sites = sorted(reg["sites"], key=lambda s: s["host"])
    print("apex %s   root %s   places %d   sites %d\n"
          % (reg["apex"], reg["root"], len(reg["places"]), len(sites)))
    print("%-56s %-7s %-10s %s" % ("host", "served", "claim", "label"))
    for s in sites:
        print("%-56s %-7s %-10s %s"
              % (s["host"][:56], s.get("served"), s.get("claimStatus", ""),
                 s.get("label", "")[:30]))
        if s.get("to"):
            print("%-56s   -> %s (%s)" % ("", s["to"], s.get("via", "")))
    return 0


def cmd_links(reg):
    """Reconcile the site's outbound links against the registry and reality."""
    known = {s["host"] for s in reg["sites"]}
    known |= set(reg["places"]) | {reg["apex"], reg["root"]}
    # a site that leaves the constellation is reachable at its own address too
    # A registry entry that is not `served` is a pointer, not an address: those
    # hosts do not resolve, so they are not a stable name you could link to
    # instead of the target's own.
    targets = {}
    for s in reg["sites"]:
        if s.get("href"):
            host = re.sub(r"^https?://", "", s["href"]).split("/")[0]
            targets[host] = (s["host"], bool(s.get("served")))

    moves = rename_map(reg)

    problems = 0
    print("%-52s %-6s %s" % ("host linked from docs/", "http", "note"))
    for host, pages in sorted(outbound_hosts().items()):
        status, location = live(host)
        note = []
        renamed = sorted(moves.get(host, ()))
        bad = False
        if status == 0:
            if renamed:
                note.append("RENAMED to %s - update the link" % ", ".join(renamed))
            else:
                note.append("DEAD - does not answer")
            bad = True
        elif renamed:
            # A superseded host that answers means one of two opposite things.
            # Redirecting is the good end state -- the move became a non-event.
            # Serving content under a name the registry says was given up means
            # the old DNS is back, and a stale link now lands a reader on the
            # wrong site instead of visibly breaking.
            if 300 <= status < 400 and location:
                note.append("superseded but redirecting -> %s" % location)
            else:
                note.append("ANSWERING under a vacated name (canonical is %s) - "
                            "old DNS may have returned" % ", ".join(renamed))
                bad = True
        elif status == 403:
            note.append("403, blocks scripts; fine in a browser")
        # only worth saying when nothing above already explained the absence
        if not renamed and host.endswith("anecdote.channel") and host not in known:
            note.append("not in the registry - renamed or retired?")
            bad = True
        problems += 1 if bad else 0
        if host in targets:
            cons, served = targets[host]
            note.append("registry name %s%s"
                        % (cons, "" if served else " (pointer only, does not resolve)"))
        print("%-52s %-6s %s" % (host[:52], status or "---", "; ".join(note)))
        if note and len(pages) <= 4:
            print("%-52s   linked from: %s" % ("", ", ".join(sorted(pages))))

    print("\n%d problem(s)." % problems)
    return 1 if problems else 0


def cmd_coverage(reg):
    """What TLS names the registry implies.

    A wildcard matches exactly one label: *.a.b covers x.a.b but never x.y.a.b.
    So every distinct parent in the tree needs its own entry, and the tier that
    creates new parents -- a new place, or a new topic inside one -- is the tier
    that forces a certificate change.
    """
    hosts = {s["host"] for s in reg["sites"]}
    hosts |= set(reg["places"]) | {reg["apex"], reg["root"]}
    parents = {}
    for h in sorted(hosts):
        parent = h.split(".", 1)[1] if h.count(".") > 1 else h
        parents.setdefault(parent, []).append(h)

    print("wildcards implied by the registry (a wildcard covers ONE label)\n")
    for p in sorted(parents, key=lambda x: (x.count("."), x)):
        print("  *.%s" % p)
        for h in sorted(parents[p]):
            print("       %s" % h)
    print("\n%d wildcard(s) for %d name(s)." % (len(parents), len(hosts)))
    print("\nA new node under an existing parent needs no certificate change.")
    print("A new place, or a new category in use, creates a parent and does.")
    print("Undercounts: drafts and system-only hosts are not in sites.json,")
    print("and anecdote's config/san-list.txt is the authoritative list.")
    return 0


def selftest():
    """Pin the `was:` contract against a fixture.

    The field ships in anecdote's config before it reaches the published
    registry, so this side needs somewhere to verify the reader that does not
    depend on a deploy having happened.
    """
    path = os.path.join(HERE, "fixtures", "sites-was.json")
    reg = json.load(open(path, encoding="utf-8"))
    moves = rename_map(reg)
    fails = []

    def check(label, got, want):
        ok = got == want
        print("  %-58s %s" % (label, "ok" if ok else "FAIL got %r want %r" % (got, want)))
        if not ok:
            fails.append(label)

    check("a single rename resolves",
          sorted(moves.get("voices.north.colorado.anecdote.channel", ())),
          ["north.voices.fort-collins.colorado.anecdote.channel"])
    check("both hops of a double rename resolve to the current host",
          sorted(moves.get("first.media.fort-collins.colorado.anecdote.channel", ()))
          + sorted(moves.get("second.media.fort-collins.colorado.anecdote.channel", ())),
          ["third.media.fort-collins.colorado.anecdote.channel"] * 2)
    check("a host that never moved is absent",
          "pointer.media.fort-collins.colorado.anecdote.channel" in moves, False)
    check("an entry without `was` is tolerated", len(moves), 3)
    check("an entry naming itself is not a rename",
          "selfref.media.fort-collins.colorado.anecdote.channel" in moves, False)
    check("missing `was` is not an error", rename_map({"sites": [{"host": "x"}]}), {})

    print("\n%s" % ("selftest passed" if not fails
                     else "%d check(s) FAILED" % len(fails)))
    return 1 if fails else 0


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--sites", action="store_true", help="what the registry holds")
    p.add_argument("--links", action="store_true", help="check this site's outbound links")
    p.add_argument("--moves", action="store_true", help="renames the registry remembers")
    p.add_argument("--coverage", action="store_true", help="TLS names the registry implies")
    p.add_argument("--selftest", action="store_true",
                   help="check the rename reader against tools/fixtures/sites-was.json")
    p.add_argument("--registry", default=REGISTRY, help="override the registry url")
    a = p.parse_args()
    if a.selftest:
        return selftest()
    if not (a.sites or a.links or a.moves or a.coverage):
        p.print_help()
        return 2
    reg = fetch_registry(a.registry)
    rc = 0
    if a.sites:
        rc |= cmd_sites(reg)
    if a.links:
        if a.sites:
            print()
        rc |= cmd_links(reg)
    if a.moves:
        if a.sites or a.links:
            print()
        rc |= cmd_moves(reg)
    if a.coverage:
        if a.sites or a.links or a.moves:
            print()
        rc |= cmd_coverage(reg)
    return rc


if __name__ == "__main__":
    sys.exit(main())
