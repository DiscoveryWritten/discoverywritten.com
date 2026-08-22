#!/usr/bin/env python3
"""Pull an Abridged By Us episode's caption text out of the Wikipedia revision
it was read from.

Each episode reads a book's Wikipedia plot summary straight-faced, one sentence
per slide, and every episode links the revision that was live when it was made.
So the revision *is* the caption text: fetch it, strip the markup, split on
sentences, and you have exactly what is burnt into the video, in order.

This is a content tool, not part of the site. docs/ has no build step and this
does not change that -- nothing here runs at deploy time. It exists to generate
exhibit copy, and to be checked against known-good captions so it stays honest.

    ./abu_sentences.py --check                 verify against the fixtures
    ./abu_sentences.py leviathan-wakes         print that episode's sentences
    ./abu_sentences.py --all --json out.json   every episode, machine readable

Three details cost real time to find. They are the reason this is a file
instead of a one-liner:

  * Sentences split on periods only. Question and exclamation marks appear
    inside sentences in this material and must not split -- except in the
    Warbreaker prologue and interlude, which come from dialogue-heavy blog
    posts rather than Wikipedia and set `bangs`.
  * A sentence can end `."` or `.)` as well as a bare period. A lookbehind for
    just `.` silently glues those pairs together, which is subtle because the
    result is still readable prose.
  * The captions were copied from the *rendered* article, so they carry
    footnote markers like `[3]` as literal text. Comparisons have to normalise
    those away or otherwise-identical sentences will not match.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = "DiscoveryWrittenSiteBuild/1.0 (autumn@discoverywritten.com)"
SENTINEL = "\x00"

# oldid is the revision the episode links -- the one live when it was made.
# A late-looking revision id usually just means nobody edited the article; the
# Lies of Locke Lamora pin is from 2025 and its Plot section is byte-identical
# to what was live on the video's own date.
EPISODES = {
    "leviathan-wakes":        dict(title="Leviathan Wakes", oldid=1257876628, section="Plot summary",
                                   video="sKg8knAMfjM", seconds=2210, category="sci-fi"),
    "mote-in-gods-eye":       dict(title="The Mote in God's Eye", oldid=1245285377, section="Plot summary",
                                   video="ZfMx4ORmZVg", seconds=2513, category="sci-fi"),
    "snow-crash":             dict(title="Snow Crash", oldid=1249995074, section="Summary",
                                   video="lLrHNmZaw8c", seconds=1508, category="sci-fi"),
    "windup-girl":            dict(title="The Windup Girl", oldid=1232664337, section="Plot summary",
                                   video="dXWdoAqt6v0", seconds=1783, category="sci-fi"),
    # The article is unusually terse and stays that way on purpose: the standing
    # rule is not to write the Wikipedia words the episode will then read aloud.
    "revelation-space":       dict(title="Revelation Space", oldid=1313670878, section="Summary",
                                   video="teEiQuiWSMw", seconds=1262, category="sci-fi"),
    "deaths-end":             dict(title="Death's End", oldid=1240758021, section="Plot",
                                   video="P5blKsyymuQ", seconds=3930, category="sci-fi"),
    "dark-forest":            dict(title="The Dark Forest", oldid=1240037921, section="Plot",
                                   video="FaklcAm6Yio", seconds=1102, category="sci-fi"),
    "three-body-problem":     dict(title="The Three-Body Problem (novel)", oldid=1251739534, section="Plot",
                                   video="JiD8G1w63iE", seconds=1388, category="sci-fi"),
    # Both books, deliberately. Pandora's Star ends on a cliffhanger that
    # resolves nothing, so the episode plays straight through into Judas
    # Unchained without announcing it. The transition is the first sentence of
    # the second subsection and needs no special handling -- keeping the
    # subsections unlabelled in the running text is the whole point.
    "pandoras-star":          dict(title="Commonwealth Saga", oldid=1225343754, section="Plot",
                                   subsections=["''Pandora's Star''", "''Judas Unchained''"],
                                   video="wVTsCPCiCAY", seconds=2552, category="sci-fi"),
    "a-fire-upon-the-deep":   dict(title="A Fire Upon the Deep", oldid=1242453141, section="Plot",
                                   video="wLzIZY4hTJo", seconds=1357, category="sci-fi"),
    "dune":                   dict(title="Dune (novel)", oldid=1248457092, section="Plot",
                                   video="V_tr-Od8Fr4", seconds=1745, category="sci-fi"),
    "lies-of-locke-lamora":   dict(title="The Lies of Locke Lamora", oldid=1308469487, section="Plot",
                                   video="T-_gqShZjE8", seconds=2200, category="fantasy"),
    # Wikipedia covers the middle only. The prologue and interlude were
    # abridged on the fly from two Sanderson blog posts and exist nowhere but
    # the burnt-in captions, so this count is short of the real total.
    "warbreaker":             dict(title="Warbreaker", oldid=1245814648, section="Plot summary",
                                   video="JwdPS9E2YvA", seconds=1954, category="fantasy",
                                   incomplete="prologue and interlude are not on Wikipedia"),
    "name-of-the-wind":       dict(title="The Name of the Wind", oldid=1243036054, section="Plot",
                                   video="v9HbEfIrfYE", seconds=2432, category="fantasy"),
    "fellowship-of-the-ring": dict(title="The Lord of the Rings", oldid=1247075460, section="Plot",
                                   subsections=["''The Fellowship of the Ring''"],
                                   video="_FnSucInJJs", seconds=502, category="fantasy"),
    "the-two-towers":         dict(title="The Lord of the Rings", oldid=1247075460, section="Plot",
                                   subsections=["''The Two Towers''"],
                                   video="7K7jSXzIRbQ", seconds=409, category="fantasy"),
    "return-of-the-king":     dict(title="The Lord of the Rings", oldid=1247075460, section="Plot",
                                   subsections=["''The Return of the King''"],
                                   video="obNQkCwzjqg", seconds=414, category="fantasy"),
}

# Episodes with a known-good caption file to check the parser against.
FIXTURES = {
    "leviathan-wakes": "fixtures/leviathan-wakes.srt",
    "lies-of-locke-lamora": "fixtures/lies-of-locke-lamora.srt",
}


def fetch_wikitext(oldid, cache_dir):
    """Revisions are immutable, so cache them forever."""
    os.makedirs(cache_dir, exist_ok=True)
    path = os.path.join(cache_dir, "%d.json" % oldid)
    if not os.path.exists(path):
        url = ("https://en.wikipedia.org/w/api.php?action=parse&oldid=%d"
               "&prop=wikitext&format=json&formatversion=2" % oldid)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            open(path, "w", encoding="utf-8").write(r.read().decode("utf-8"))
        time.sleep(0.4)
    data = json.load(open(path, encoding="utf-8"))
    if "parse" not in data:
        raise SystemExit("wikipedia refused oldid %d: %s" % (oldid, data.get("error")))
    return data["parse"]["wikitext"]


def take_section(wikitext, heading):
    m = re.search(r"==\s*%s\s*==(.*?)(?=\n==[^=])" % re.escape(heading), wikitext, re.S)
    if not m:
        raise SystemExit("section %r not found" % heading)
    return m.group(1)


def take_subsections(body, wanted):
    """Return the named === subsections === in the order asked for.

    Anchored to whole lines at exactly three '=' so that deeper headings stay
    inside their parent. The Lord of the Rings nests level-4 "Book" headings
    under each volume; an unanchored pattern matches those one character in,
    truncating the volume to its first line.
    """
    parts = re.split(r"(?m)^={3}(?!=)\s*(.+?)\s*={3}(?!=)\s*$", body)
    found = {parts[i].strip(): parts[i + 1] for i in range(1, len(parts), 2)}
    out = []
    for name in wanted:
        if name.strip() not in found:
            raise SystemExit("subsection %r not found; have %s" % (name, sorted(found)))
        out.append(found[name.strip()])
    return "\n".join(out)


def strip_markup(t):
    t = re.sub(r"<ref[^>]*/>", "", t)
    t = re.sub(r"<ref[^>]*>.*?</ref>", "", t, flags=re.S)
    t = re.sub(r"\{\{[^{}]*\}\}", "", t)
    t = re.sub(r"\[\[[^\]|]*\|([^\]]*)\]\]", r"\1", t)
    t = re.sub(r"\[\[([^\]]*)\]\]", r"\1", t)
    t = re.sub(r"'''''|'''|''", "", t)
    t = re.sub(r"<!--.*?-->", "", t, flags=re.S)
    t = re.sub(r"<[^>]+>", "", t)
    t = re.sub(r"(?m)^=+.*?=+\s*$", "", t)
    return re.sub(r"[ \t]+", " ", t).strip()


def split_sentences(text, bangs=False):
    """Split on periods, allowing a closing quote or bracket to follow.

    `bangs` also splits on ? and ! and is only correct for the Warbreaker blog
    material; Wikipedia prose keeps both inside sentences.
    """
    enders = r"[.!?]" if bangs else r"\."
    pattern = re.compile(enders + r"[\"\u201d'\)\]]*\s+(?=[\"\u201c\u2018]?[A-Z])")
    marked = pattern.sub(lambda m: m.group(0).rstrip() + SENTINEL, text.replace("\n", " "))
    return [s.strip() for s in marked.split(SENTINEL) if s.strip()]


def sentences_for(key, cache_dir):
    ep = EPISODES[key]
    body = take_section(fetch_wikitext(ep["oldid"], cache_dir), ep["section"])
    if ep.get("subsections"):
        body = take_subsections(body, ep["subsections"])
    return split_sentences(strip_markup(body), bangs=ep.get("bangs", False))


def normalise(s):
    """Compare on letters and digits only.

    Drops the rendered footnote markers the captions carry, and folds the
    curly quotes Wikipedia uses against the straight ones the captions do.
    """
    s = s.replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
    s = re.sub(r"\[\d+\]", "", s)
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def read_srt(path):
    body = open(path, encoding="utf-8").read()
    cues = re.findall(
        r"(\d+)\n(\d\d:\d\d:\d\d,\d+) --> (\d\d:\d\d:\d\d,\d+)\n(.+?)(?=\n\n|\n*$)",
        body, re.S)
    def secs(x):
        h, m, rest = x.split(":")
        s, ms = rest.split(",")
        return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
    return [(secs(a), secs(b), c.strip().replace("\n", " ")) for _, a, b, c in cues]


def check(cache_dir):
    """Verify the parser against every episode with a known-good caption file."""
    ok = True
    for key, rel in FIXTURES.items():
        cues = read_srt(os.path.join(HERE, rel))
        got = sentences_for(key, cache_dir)
        pool = [normalise(s) for s in got]
        exact = sum(1 for _, _, t in cues if normalise(t) in pool)
        counts_match = len(got) == len(cues)
        # Deliberate drift is expected: some articles were edited from the
        # Abridged By Us account during production, pinning the corrected text
        # so the difference against the video is visible on purpose.
        good = counts_match and exact >= len(cues) - 2
        ok = ok and good
        print("%-24s revision %3d | captions %3d | exact %3d/%d  %s"
              % (key, len(got), len(cues), exact, len(cues), "ok" if good else "FAIL"))
        if not counts_match:
            print("    sentence count disagrees with the caption count")
        for _, _, t in cues:
            if normalise(t) not in pool:
                print("    drift: %s" % t[:88])
    return 0 if ok else 1


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("episode", nargs="?", help="episode key, or omit with --all/--check")
    p.add_argument("--all", action="store_true", help="every episode")
    p.add_argument("--check", action="store_true", help="verify against the fixtures")
    p.add_argument("--json", metavar="PATH", help="write machine-readable output")
    p.add_argument("--cache", default=os.path.join(HERE, ".wikicache"))
    p.add_argument("--list", action="store_true", help="list episode keys")
    a = p.parse_args()

    if a.list:
        for k, e in EPISODES.items():
            print("%-24s %-10s %s" % (k, e["category"], e["title"]))
        return 0
    if a.check:
        return check(a.cache)

    keys = list(EPISODES) if a.all else ([a.episode] if a.episode else [])
    if not keys:
        p.print_help()
        return 2
    for k in keys:
        if k not in EPISODES:
            raise SystemExit("unknown episode %r (try --list)" % k)

    out, total = {}, 0
    for k in keys:
        ep = EPISODES[k]
        s = sentences_for(k, a.cache)
        total += len(s)
        out[k] = dict(title=ep["title"], video=ep["video"], seconds=ep["seconds"],
                      category=ep["category"], oldid=ep["oldid"], sentences=s)
        if ep.get("incomplete"):
            out[k]["incomplete"] = ep["incomplete"]
        if a.all:
            note = "  (%s)" % ep["incomplete"] if ep.get("incomplete") else ""
            print("%-24s %3d sentences  %5.1fs each%s"
                  % (k, len(s), ep["seconds"] / len(s), note))
        else:
            for i, line in enumerate(s, 1):
                print("%3d. %s" % (i, line))
    if a.all:
        print("\n%d sentences across %d episodes" % (total, len(keys)))
    if a.json:
        json.dump(out, open(a.json, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
        print("wrote %s" % a.json)
    return 0


if __name__ == "__main__":
    sys.exit(main())
