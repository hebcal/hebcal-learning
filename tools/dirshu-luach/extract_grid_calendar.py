#!/usr/bin/env python3
"""Extract Daf HaYomi B'Halacha from Dirshu calendars that transpose the table.

    python3 extract_grid_calendar.py --label 5783 calendar.pdf out.json

Some years lay the month out as a grid where each DAY is a column and each
program is a band of rows, rather than one row per day. Within a day's column
the reading wraps over many short lines, and below it -- after a wide vertical
gap -- the next program's band begins.

So a day's reading is every line in its column between the date row and that
gap, read top to bottom, right to left within each line.
"""

import argparse
import datetime
import json
import re
import sys

from extract_luach import HEB, page_items
from extract_calendar import join_runs, parse_date, unreverse

COLUMN_HALF_WIDTH = 7.0   # a day column is ~13.5pt wide
BAND_GAP = 40.0           # a gap this large ends the daf halacha band
LINE_TOL = 0.6            # runs within this many points share a display line


def date_row(items):
    """(y, {x: date}) for the row of Gregorian dates, which is the widest one."""
    rows = {}
    for y, x, _s, t in items:
        d = parse_date(t)
        if d:
            rows.setdefault(round(y, 0), {})[round(x)] = d
    if not rows:
        return None, {}
    y = max(rows, key=lambda k: len(rows[k]))
    return y, rows[y]


def band_bottom(items, top):
    """Lowest y still inside the daf halacha band, found by the first wide gap."""
    ys = sorted({round(y, 1) for y, _x, _s, _t in items if y < top}, reverse=True)
    for prev, cur in zip(ys, ys[1:]):
        if prev - cur > BAND_GAP:
            return prev
    return ys[-1] if ys else top


def column_text(items, cx, lo, hi):
    lines = {}
    for y, x, seq, t in items:
        if abs(x - cx) <= COLUMN_HALF_WIDTH and lo <= y <= hi:
            key = next((k for k in lines if abs(k - y) <= LINE_TOL), round(y, 1))
            lines.setdefault(key, []).append((x, seq, t))
    out = []
    for ly in sorted(lines, reverse=True):
        runs = [t for _x, _s, t in sorted(lines[ly], key=lambda c: (-c[0], c[1]))]
        out.append(join_runs(runs))
    return unreverse(join_runs(out))


def read_grid(path, label):
    from pypdf import PdfReader
    rows = []
    for pno, page in enumerate(PdfReader(path).pages, 1):
        items = page_items(page)
        dy, cols = date_row(items)
        if len(cols) < 5:
            continue
        top = dy - 5
        bottom = band_bottom(items, top)
        for cx, date in sorted(cols.items()):
            text = column_text(items, cx, bottom, top)
            rows.append({'page': pno, 'date': str(date), 'src': label,
                         'text': text if re.search(rf'[{HEB}]', text) else None})
    best = {}
    for r in rows:
        if r['date'] not in best or (r['text'] and not best[r['date']]['text']):
            best[r['date']] = r
    return sorted(best.values(), key=lambda r: r['date'])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('out')
    ap.add_argument('--label', default='')
    a = ap.parse_args()
    rows = read_grid(a.pdf, a.label or a.pdf.split('/')[-1])
    dates = [datetime.date.fromisoformat(r['date']) for r in rows]
    span = (dates[-1] - dates[0]).days + 1
    learn = review = blank = bad = 0
    for r in rows:
        d = datetime.date.fromisoformat(r['date'])
        text = r['text'] or ''
        kind = 'blank' if not text else ('review' if 'חזרה' in text else 'learn')
        if kind == 'learn':
            learn += 1
        elif kind == 'review':
            review += 1
        else:
            blank += 1
        if (kind == 'learn') != (d.weekday() in (6, 0, 1, 2, 3)):
            bad += 1
            if bad <= 6:
                print(f'  MISMATCH {r["date"]} {d.strftime("%a")} got {kind} | {text[:56]}',
                      file=sys.stderr)
    print(f'{a.label}: {len(rows)} days {dates[0]} -> {dates[-1]} (contiguous={span == len(rows)})  '
          f'learn={learn} review={review} blank={blank} rule-mismatches={bad}', file=sys.stderr)
    json.dump(rows, open(a.out, 'w'), ensure_ascii=False, indent=0)


if __name__ == '__main__':
    main()
