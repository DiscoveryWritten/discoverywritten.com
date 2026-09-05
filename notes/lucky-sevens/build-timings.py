#!/usr/bin/env python3
"""Rebuild the Lucky Sevens lyric timings from the gapless export.

The source export was made "gapless" by setting each line's start to the
previous line's end. That means ENDS ARE INTACT and only starts are wrong, so
every instrumental the export swallowed shows up as an inflated duration on the
line that follows it. We recover the gap by estimating what each line actually
needs (median chars/sec across the song) and giving the rest back.

Outputs, next to this script:
  lyrics.json   every moment covered; sung lines with corrected starts, and
                empty-text spans wherever the music plays alone
  spans.json    the same timeline as section titles, for running in parallel
  spans-annotated.json   spans.json plus kind/bottle metadata

Starts of gap-following lines are ESTIMATES (Autumn corrects them by ear);
ends are the export's and are trusted.
"""
import json, statistics, pathlib

HERE = pathlib.Path(__file__).parent
SRC = pathlib.Path.home() / ".claude/uploads/730f6740-362c-5995-bb76-28d82263b09e/176eda05-Lucky_Sevens_lyrics.json"

# Section structure, in song order: (title, number of sung lines).
# BREAK and SCREED carry no sung lines — they are the instrumentals the export ate.
SECTIONS = [
    ("[intro]", 4), ("[⛬]", 4), ("[💿]", 4), ("[pre-chorus]", 3),
    ("[📀]", 4), ("[👾]", 4),
    ("BREAK", 0),
    ("[💽]", 4), ("[💌]", 4), ("[✨ chorus]", 8),
    ("SCREED", 0),
    ("[📱]", 4), ("[💸]", 4), ("[🤖]", 4), ("[🎰]", 4),
    ("BREAK", 0),
    ("[🤠]", 4), ("[super 🪭]", 4), ("[💻]", 4),
    ("BREAK", 0),
    ("[⛓️‍💥]", 4), ("[📱]", 4), ("[🫙 !important]", 4), ("[⛬⏰]", 4), ("[💰]", 4),
    ("", 4), ("", 4), ("", 1), ("", 4), ("", 4),
    ("BREAK", 0),
    ("", 4), ("", 4), ("", 5), ("[🎲]", 5), ("", 5),
]

# Welded sections → the bottle whose loop takes the stage there.
BOTTLES = {
    11: "cite-autumn-ryan-eliseai-hierarchy-of-needs",
    12: "cite-autumn-ryan-network-state",
    13: "cite-autumn-ryan-impact-of-ai",
    14: "cite-autumn-ryan-brookfield-properties",
    16: "cite-autumn-ryan-credibility-in-journalism",
    17: "cite-autumn-ryan-park-mobile",
    18: "cite-autumn-ryan-verra-mobility",
    20: "cite-autumn-ryan-universal-music-group",
    24: "cite-autumn-ryan-personalized-plus",
}
# Sections welded to something that is not a bottle (forum threads, org links).
LINKS = {
    7: "forum.bandamp.com/The_Pit/14556.html",
    8: "forum.bandamp.com/Feedback/5186.html",
    9: "forum.bandamp.com/Audio_Review/3861.html#id40623",
    21: "anecdote.discoverywritten.com",
    34: "github.com/FCCN-ANTIBODY",
}

TEXT_FIXES = {  # wordplay correction: the exec joke and the AI-taking-orders joke, both ways
    "These Aye-Ayes should represent themselves, not us or Double-UMG":
    "These Aye-Is should represent themselves, not us or Double-UMG",
}

GAP_MIN = 1.2   # seconds of excess before we call it an instrumental
MIN_LINE = 0.9  # no sung line is shorter than this, however few characters
SPANNING = {"🎶"}  # glyphs that MEAN "instrumental here" — let them hold the whole gap

# ---------------------------------------------------------------------------
# CORRECTIONS — Autumn's, by ear. These win over every estimate.
#   line text: (gap_start | None, true_line_start)
# gap_start opens the silence in front of the line; None means "leave it where
# the previous line ends". A correction may introduce a gap mid-stanza that no
# estimate would have found — 220.2 below is one, and it is dramatic, not an
# artifact. Add rows here and rerun; the timeline re-derives around them.
# ---------------------------------------------------------------------------
CORRECTIONS = {
    "I could pummel a fool in Super Smash Bros.":  (None,  95.5),
    "Been saying since 2003":                      (None, 135.0),
    "The corpos centralized everything in sight":  (160.3, 197.8),
    "They don't fear us now":                      (216.9, 220.2),
    "We were here all along":                      (None, 264.9),
    "The sanctioned Artists can go on with their Slop": (None, 315.4),
    "We already have the tools, and they were always right here": (327.4, 329.1),
    "Tick Tock should mean waking up to what and w-why":          (None, 363.0),
    # keyed on the EXPORT's text, before the Aye-Ayes → Aye-Is fix is applied
    "These Aye-Ayes should represent themselves, not us or Double-UMG": (452.8, 464.5),
}

# A corrected gap_start ALWAYS becomes the previous line's end: the silence
# opening and the line before it closing are the same event, so one number sets
# both. END_FIX is the other case — holding a line out over the music with no
# gap after it, where the export cut it short.
END_FIX = {
    "And No One Is Stopping You because you have Biological I.": 363.0,
}

lines = json.loads(SRC.read_text())
assert len(lines) == sum(n for _, n in SECTIONS), \
    f"structure has {sum(n for _,n in SECTIONS)} lines, export has {len(lines)}"

rate = statistics.median(len(l["text"]) / (l["end"] - l["start"])
                         for l in lines if len(l["text"]) > 20)

# ---- walk the structure, recovering gaps -------------------------------------
out, spans, i = [], [], 0
pending_break = None          # a BREAK/SCREED marker waiting for the gap it owns
cursor = 0.0                  # end of the last thing we emitted

def emit_gap(start, end, title):
    """Music with no words: empty in the lyric track, titled in the span track."""
    if end - start < 0.05:
        return
    out.append({"start": round(start, 3), "end": round(end, 3), "text": ""})
    if title is not None:
        spans.append({"start": round(start, 3), "end": round(end, 3), "text": title,
                      "kind": "break" if title == "[break]" else "screed"})

def resolve(l):
    """True start for a line, and the start of any silence in front of it."""
    if l["text"] in CORRECTIONS:
        gap_start, true_start = CORRECTIONS[l["text"]]
        return gap_start, true_start
    if l["text"] in SPANNING:
        return None, l["start"]              # the glyph owns its instrumental
    est = max(MIN_LINE, len(l["text"]) / rate)
    if (l["end"] - l["start"]) - est > GAP_MIN:
        return None, l["end"] - est          # the export swallowed a gap here
    return None, l["start"]

for si, (title, n) in enumerate(SECTIONS):
    if n == 0:
        pending_break = "[break]" if title == "BREAK" else "[radio screed]"
        continue

    chunk = lines[i:i + n]
    i += n
    section_start = None

    for k, l in enumerate(chunk):
        gap_start, true_start = resolve(l)
        # The gap opening IS the previous line ending. One number, both edges.
        if gap_start is not None and out:
            assert abs(gap_start - cursor) < 2.0, \
                f"gap start {gap_start} is {gap_start-cursor:+.2f}s off the previous end — typo?"
            out[-1]["end"] = round(gap_start, 3)
            cursor = gap_start
        open_at = cursor

        if true_start > open_at + 0.05:
            emit_gap(open_at, true_start, pending_break if k == 0 else None)
        elif k == 0 and pending_break:
            print(f"  ! {pending_break} at section {si} found no gap to occupy")
        if k == 0:
            pending_break = None
            section_start = true_start

        text = TEXT_FIXES.get(l["text"], l["text"])
        end = END_FIX.get(l["text"], l["end"])
        out.append({"start": round(true_start, 3), "end": round(end, 3), "text": text})
        cursor = end

    span = {"start": round(section_start, 3), "end": round(cursor, 3), "text": title,
            "kind": "weld" if si in BOTTLES else ("link" if si in LINKS else
                    ("section" if title else "untitled"))}
    if si in BOTTLES: span["bottle"] = BOTTLES[si]
    if si in LINKS:   span["link"] = LINKS[si]
    spans.append(span)

spans.sort(key=lambda s: s["start"])
out.sort(key=lambda s: s["start"])

(HERE / "lyrics.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
(HERE / "spans-annotated.json").write_text(json.dumps(spans, ensure_ascii=False, indent=1) + "\n")
(HERE / "spans.json").write_text(json.dumps(
    [{"start": s["start"], "end": s["end"], "text": s["text"]} for s in spans],
    ensure_ascii=False, indent=1) + "\n")

# ---- report ------------------------------------------------------------------
print(f"rate {rate:.2f} chars/sec · {len(out)} lyric entries ({sum(1 for o in out if not o['text'])} empty) · {len(spans)} spans")
print("\ninstrumentals recovered (start times are ESTIMATES for correction):")
for s in spans:
    if s["kind"] in ("break", "screed"):
        print(f"  {s['text']:<16} {s['start']:8.3f} → {s['end']:8.3f}  ({s['end']-s['start']:5.2f}s)")
print("\nwelds — when each bottle takes the stage:")
for s in spans:
    if s["kind"] == "weld":
        print(f"  {s['text']:<8} {s['start']:8.3f} → {s['end']:8.3f}  ({s['end']-s['start']:5.1f}s)  {s['bottle']}")
gaps = [o for o in out if not o["text"]]
print(f"\ncoverage: {out[0]['start']:.3f} → {out[-1]['end']:.3f}, contiguous = "
      f"{all(abs(a['end']-b['start'])<0.002 for a,b in zip(out, out[1:]))}")
