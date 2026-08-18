#!/usr/bin/env python3
"""Extract (hebrew-date, daf-halacha-prose) rows from Dirshu's HEBREW luachs.

    python3 extract_hebrew_luach.py luach_5782.pdf ... out.json
    node date_hebrew_luach.mjs out.json      # add Gregorian dates + validate

These are the pocket luachs from dirshu.co.il, a different artifact from the
English dafhalacha.com booklets that `extract_luach.py` reads:

  * Hebrew dates only, no Gregorian column, so the Hebrew year has to be
    supplied per booklet (see START in date_hebrew_luach.mjs).
  * Each page holds two 14-day panels side by side. The daf halacha cell sits
    ~35-130pt left of its own panel's date column.
  * Friday and Shabbat share one merged 'חזרה' cell, and its text often wraps
    onto the Shabbat row ("חזרה מסימן …" / "עד סימן …") -- rejoin them.
  * The reading is PROSE, not the tabular siman/seif of the English booklets:
    "מסימן ב' סעיף ו' עד תחילת סימן ג'". Where one se'if runs for days it
    descends to lettered sub-items ("מ-אות ה' עד אות ט'", e.g. siman 32:3),
    which is finer than the siman:seif model in src/dirshuDafHalacha.json.

    Normalising that prose into `siman:seif` refs is NOT done here -- this
    tool emits the raw cell text. Do it in one pass once the 5783/5784
    booklets close the gap (see CLAUDE.md §7).
"""
import json, re, sys
sys.path.insert(0, 'tools/dirshu-luach')
from extract_luach import page_items, HEB
from pypdf import PdfReader

MONTHS = ['תשרי', 'מרחשון', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר א', 'אדר ב',
          'אדר', 'ניסן', 'אייר', 'סיון', 'סיוון', 'תמוז', 'אב', 'אלול']
NUM = "[" + HEB + "'\"״׳]"
DATE_RE = re.compile(rf"^({NUM}{{1,6}})\s+(" + '|'.join(MONTHS) + r")('|׳)?\s*$")
HALACHA_HINT = re.compile(r'סימן|סעיף|אות|המשנה ברורה')


def parse_date(text):
    m = DATE_RE.match(text.strip())
    if not m:
        return None
    day = ''.join(c for c in m.group(1) if c in HEB)
    from extract_luach import gematria
    d = gematria(day)
    if not d or d > 30:
        return None
    return d, m.group(2)


def extract(path):
    reader = PdfReader(path)
    out = []
    for pno, page in enumerate(reader.pages, 1):
        items = page_items(page)
        dates = [(y, x, t, parse_date(t)) for y, x, _s, t in items if parse_date(t)]
        if len(dates) < 5:
            continue
        # cluster date cells into panels by x
        xs = sorted({round(x) for _y, x, _t, _d in dates})
        panels = []
        for x in xs:
            if panels and x - panels[-1][-1] <= 3:
                panels[-1].append(x)
            else:
                panels.append([x])
        for panel in panels:
            lo, hi = min(panel) - 3, max(panel) + 3
            rows = sorted([d for d in dates if lo <= d[1] <= hi], key=lambda d: -d[0])
            if len(rows) < 5:
                continue
            dx = sum(panel) / len(panel)
            cells = [(y, x, t) for y, x, _s, t in items
                     if dx - 130 <= x <= dx - 35 and (HALACHA_HINT.search(t) or t.strip().startswith('חזרה'))]
            pitch = None
            if len(rows) > 2:
                gaps = [rows[i][0] - rows[i + 1][0] for i in range(len(rows) - 1)]
                gaps = [g for g in gaps if 5 < g < 20]
                if gaps:
                    pitch = sorted(gaps)[len(gaps) // 2]
            for y, _x, t, (day, month) in rows:
                near = [c for c in cells if abs(c[0] - y) <= (pitch or 11) * 0.45]
                near.sort(key=lambda c: abs(c[0] - y))
                out.append({'page': pno, 'panelX': round(dx, 1), 'y': round(y, 1),
                            'day': day, 'month': month,
                            'text': ' '.join(c[2] for c in near) or None})
    return out


if __name__ == '__main__':
    data = []
    for p in sys.argv[1:-1]:
        rows = extract(p)
        print(f'{p.split("/")[-1]}: {len(rows)} dated rows, '
              f'{sum(1 for r in rows if r["text"])} with halacha text', file=sys.stderr)
        for r in rows:
            r['src'] = p.split('/')[-1]
        data += rows
    json.dump(data, open(sys.argv[-1], 'w'), ensure_ascii=False, indent=0)
