#!/usr/bin/env python3
"""Reconcile this site against the anecdote constellation's registry.

anecdote.channel renders its listing from `/sites.json`, so the registry is
readable without a browser. This reads it and answers three questions:

    ./constellation.py --sites      what the registry currently holds
    ./constellation.py --links      do this repo's outbound links still work
    ./constellation.py --coverage   what TLS names the registry implies

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
  * It has no view of DNS records or of the certificate's actual SAN list. The
    --coverage output is what the registry *implies* is needed, not what is
    currently issued. Comparing the two would need the cert, which this does
    not fetch.
  * `claimStatus` is reported as the registry states it. This does not verify a
    claim independently.
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


def live(host, timeout=12):
    """Return an HTTP status, or 0 when the host does not answer at all."""
    req = urllib.request.Request("https://" + host, headers={"User-Agent": UA},
                                 method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


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

    problems = 0
    print("%-52s %-6s %s" % ("host linked from docs/", "http", "note"))
    for host, pages in sorted(outbound_hosts().items()):
        status = live(host)
        note = []
        if status == 0:
            note.append("DEAD - does not answer")
            problems += 1
        elif status == 403:
            note.append("403, blocks scripts; fine in a browser")
        if host.endswith("anecdote.channel") and host not in known:
            note.append("not in the registry - renamed or retired?")
            problems += 1
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
    print("A new place or topic creates a new parent, and does.")
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--sites", action="store_true", help="what the registry holds")
    p.add_argument("--links", action="store_true", help="check this site's outbound links")
    p.add_argument("--coverage", action="store_true", help="TLS names the registry implies")
    p.add_argument("--registry", default=REGISTRY, help="override the registry url")
    a = p.parse_args()
    if not (a.sites or a.links or a.coverage):
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
    if a.coverage:
        if a.sites or a.links:
            print()
        rc |= cmd_coverage(reg)
    return rc


if __name__ == "__main__":
    sys.exit(main())
