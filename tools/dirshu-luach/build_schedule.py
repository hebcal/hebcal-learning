#!/usr/bin/env python3
"""Assemble src/dirshuDafHalacha.json for the whole of cycle 3.

    python3 build_schedule.py --seifim seifim.json --shipped ../../src/dirshuDafHalacha.json \
        --prose cal5783.json --prose cal5784.json --prose heb5782.json --prose cal5782.json \
        --tabular cal5787.json --out ../../src/dirshuDafHalacha.json

Cycle 3 opened on Sunday 2022-02-20 at siman 1 (CLAUDE.md §2a), so that is day
zero. The readings come from several artifacts that overlap:

  * prose sources (Hebrew luachs, wall calendars) for the early years, merged by
    date -- earlier --prose arguments win -- then normalised together, because a
    day whose prose omits its siman inherits it from the day before and the
    carry has to run over one continuous series;
  * the existing shipped array, itself built from the English booklets and a
    reader's spreadsheet, for the stretch it already covers;
  * the tabular 5787 calendar for the tail.

Where a day has no prose but a shipped reading, the shipped value is used and
also repairs the carry -- three rows are missing from the 5784 PDF's text layer.
"""

import argparse
import datetime
import json
import re
import sys

from extract_luach import HEB, gematria, numerals, parse_range
from normalize_prose import parse as parse_prose, render

CYCLE3_START = datetime.date(2022, 2, 20)
WEEK0 = CYCLE3_START.toordinal() - (CYCLE3_START.toordinal() % 7)
BASE = CYCLE3_START.toordinal() - WEEK0
AMUD_RE = re.compile(rf'^([{HEB}]+)\s*([.:])\s*(?:\((\d+)\))?')


def index_of(date):
    n = date.toordinal() - WEEK0
    week = n // 7
    return week * 5 + (n - week * 7) - BASE


def is_learning_day(date):
    return date.toordinal() % 7 <= 4


def load_prose(paths):
    """{date: text}, earlier files winning, restricted to cycle-3 learning days."""
    merged = {}
    for path in paths:
        for r in json.load(open(path)):
            date = r.get('greg') or r.get('date')
            text = r.get('text')
            if not text or 'חזרה' in text:
                continue
            d = datetime.date.fromisoformat(date)
            if d < CYCLE3_START or not is_learning_day(d):
                continue
            merged.setdefault(date, text)
    return merged


def load_tabular(path):
    out = {}
    for r in json.load(open(path)):
        text = r.get('text')
        if not text or 'חזרה' in text:
            continue
        d = datetime.date.fromisoformat(r['date'])
        if not is_learning_day(d):
            continue
        # one row prints two amudim ("ל. לא. תמ\"ח' ג"), so peel them all
        rest = text
        while True:
            m = AMUD_RE.match(rest)
            if not m:
                break
            rest = rest[m.end():].strip()
        # Extraction can drop a space inside a numeral: "ת מ\"ז" is תמ"ז, 447. Only
        # repair when the left side carries no gershayim of its own, or a complete
        # numeral gets welded to the se'if after it -- "תצ\"ז י\"ב" would read 509.
        rest = re.sub(rf'(?<!["”“״])([{HEB}]{{1,2}})\s+([{HEB}]{{1,2}}["”“״])',
                      r'\1\2', rest)
        try:
            b, e = parse_range(numerals([rest]))
        except AssertionError:
            continue
        if b:
            out[r['date']] = (b, e)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--seifim', required=True)
    ap.add_argument('--shipped', required=True)
    ap.add_argument('--prose', action='append', default=[])
    ap.add_argument('--tabular', action='append', default=[])
    ap.add_argument('--out')
    a = ap.parse_args()

    counts = json.load(open(a.seifim))
    def seifim(siman):
        return counts[siman - 1] if 1 <= siman <= len(counts) else 1

    prose = load_prose(a.prose)
    tabular = {}
    for t in a.tabular:
        tabular.update(load_tabular(t))

    shipped = json.load(open(a.shipped))
    ship_start = datetime.date(2024, 6, 11)
    ship = {}
    for i, entry in enumerate(shipped['readings']):
        # the shipped array is dense from its own start; walk learning days
        n, week = i, 0
        d = ship_start
        ship[index_of(ship_start) + i] = entry
    # rebuild by index rather than by date to avoid drift
    ship = {index_of(ship_start) + i: entry for i, entry in enumerate(shipped['readings'])}

    last = max([index_of(datetime.date.fromisoformat(d)) for d in list(prose) + list(tabular)]
               + list(ship))
    readings = [None] * (last + 1)
    carry = (None, 1)
    problems = []
    d = CYCLE3_START
    while index_of(d) <= last:
        if not is_learning_day(d):
            d += datetime.timedelta(days=1)
            continue
        i = index_of(d)
        key = str(d)
        entry = None
        if key in prose and i not in ship:
            bs, bf, es, ef, at_start, at_end = parse_prose(prose[key], carry[0], carry[1], seifim)
            b, e = render(bs, bf, es, ef, at_start, at_end, seifim)
            entry = b + (f'-{e}' if e else '')
            carry = (es, ef)
        elif i in ship:
            entry = ship[i]
        elif key in tabular:
            b, e = tabular[key]
            entry = b + (f'-{e}' if e else '')
        if entry is None:
            problems.append(f'index {i} ({d}) has no source')
        else:
            readings[i] = entry
            if i in ship or key in tabular:
                parts = entry.split('-')
                tail = parts[-1].split(':')
                carry = (int(tail[0]), int(tail[1]) if len(tail) > 1 else seifim(int(tail[0])))
        d += datetime.timedelta(days=1)

    # The 5787 calendar reaches a volume's הקדמה, which is not a siman reference
    # at all, so the array stops there rather than inventing one.
    if None in readings:
        cut = readings.index(None)
        print(f'stopping at index {cut}: no siman reference (a volume introduction)',
              file=sys.stderr)
        readings = readings[:cut]
        problems = [p for p in problems
                    if not any(p.startswith(f'index {i} ') or p.startswith(f'index {i}:')
                               for i in range(cut, cut + 40))]
    for i, r in enumerate(readings):
        if r is None:
            problems.append(f'index {i} empty')
    print(f'built {len(readings)} readings, {sum(r is not None for r in readings)} filled',
          file=sys.stderr)

    # invariants
    prev = (0, 0)
    for i, r in enumerate(readings):
        if not r:
            continue
        b = r.split('-')[0].split(':')
        cur = (int(b[0]), int(b[1]) if len(b) > 1 else 1)
        if cur < prev:
            problems.append(f'index {i}: reading moves backwards {prev} -> {cur} ({r})')
        e = r.split('-')[-1].split(':')
        prev = (int(e[0]), int(e[1]) if len(e) > 1 else 1)
        for part in r.split('-'):
            p = part.split(':')
            if len(p) > 1 and int(p[1]) > seifim(int(p[0])):
                problems.append(f'index {i}: {part} but SA OC {p[0]} has {seifim(int(p[0]))} seifim')

    if problems:
        print(f'{len(problems)} problem(s):', file=sys.stderr)
        for p in problems[:20]:
            print('  ' + p, file=sys.stderr)
    else:
        print('all invariants hold', file=sys.stderr)

    if a.out and not problems:
        # The amud is only knowable where a source printed one: from index 602,
        # where the English booklets begin. VOLUMES are where the edition starts
        # a new volume and its page numbering restarts at 2a. EXTRA records the
        # one day that covers more than a single amud -- 2026-11-15 prints
        # "ל. לא." and every amud after it shifts by a full daf.
        amud = {'from': 602, 'volumes': [602, 1179], 'extra': {'1235': 2}}
        with open(a.out, 'w') as f:
            f.write('{\n"amud":' + json.dumps(amud, separators=(',', ':')) + ',\n')
            f.write('"readings":[\n')
            f.write(',\n'.join(json.dumps(r) for r in readings))
            f.write('\n]}\n')
        print(f'wrote {a.out}', file=sys.stderr)
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
