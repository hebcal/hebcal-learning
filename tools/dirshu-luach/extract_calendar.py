#!/usr/bin/env python3
"""Extract Daf HaYomi B'Halacha from Dirshu's English-dated wall/email calendars.

    python3 extract_calendar.py --halacha-x 410,605 --label 5784 calendar.pdf out.json

A third artifact, distinct from the dafhalacha.com booklets (extract_luach.py)
and the Hebrew pocket luachs (extract_hebrew_luach.py):

  * One row per day, with a Gregorian date in the row (M/D/YYYY, sometimes
    MM/DD/YY, and at least one typo of the form "8/18//2023").
  * The reading is usually PROSE, like the Hebrew luachs
    ("מסימן קנ\"ט אמצע סעיף ב' 'כיון' עד סעיף ד'"). The 5787 calendar instead
    prints the tabular amud + siman/seif of the English booklets.
  * The daf halacha column sits at a different x in every year, so --halacha-x
    must be calibrated per file with --dump-page (see extract_luach.py).

Some years (5781, 5783) transpose the table so each day is a column rather than
a row; this script does not handle those.
"""

import argparse
import datetime
import json
import re
import sys

from extract_luach import HEB, group_rows, page_items, rtl

# M/D/YYYY, MM/DD/YY, and the doubled-slash typo seen in the 5784 calendar
DATE_RE = re.compile(r'(\d{1,2})/+(\d{1,2})/+(\d{2}|\d{4})')


def parse_date(text):
    m = DATE_RE.fullmatch(text.strip())
    if not m:
        return None
    month, day, year = (int(g) for g in m.groups())
    if year < 100:
        year += 2000
    try:
        return datetime.date(year, month, day)
    except ValueError:
        return None


PUNCT_ONLY = re.compile(r"^[\'\"”“’‘׳״.:()\-\s]+$")
# a gershayim sits INSIDE a numeral (קנ"ט is 159); a geresh closes one (ב' is 2)
GERSHAYIM = '"”“״('


def join_runs(runs):
    """Join display-order runs into one cell.

    The PDF emits each quote mark as its own run, and whether a space belongs
    after it depends on which mark it is. A gershayim sits inside a Hebrew
    numeral, so the letter after it continues the same number -- קנ + " + ט is
    קנ"ט, 159, not 150 and 9. A geresh closes a numeral, so the next letter
    starts a new one -- תכ"ו + ' + א is 426 then 1, and running them together
    would read as the single number 427.
    """
    out = ''
    for run in runs:
        if not out:
            out = run
        elif PUNCT_ONLY.match(run) or out[-1] in GERSHAYIM:
            out += run
        else:
            out += ' ' + run
    return re.sub(r'\s+', ' ', out).strip()


QUOTES = '\'"”“’‘׳״'


def unreverse(text):
    """Repair a cell whose quote-delimited segments were stored in reverse.

    Some years emit the whole reading as one run in visual rather than logical
    order, so "מתחילת סימן תרל\"א עד סעיף ה'" arrives as
    "'א עד סעיף ה\"מתחילת סימן תרל" -- the same segments, back to front.
    A reading always opens with a Hebrew word (מסימן, מסעיף, עד, חזרה) and
    never with a quote mark, so a leading quote is a reliable signal.
    """
    if not text or text[0] not in QUOTES:
        return text
    segments = re.findall(rf'[{QUOTES}]+|[^{QUOTES}]+', text)
    return re.sub(r'\s+', ' ', ''.join(reversed(segments))).strip()


def read_calendar(path, xmin, xmax):
    from pypdf import PdfReader
    rows = []
    for pno, page in enumerate(PdfReader(path).pages, 1):
        items = page_items(page)
        if not any(parse_date(t) for _y, _x, _s, t in items):
            continue
        for _y, cells in group_rows(items):
            dates = [d for d in (parse_date(t) for _x, _s, t in cells) if d]
            if not dates:
                continue
            if len({str(d) for d in dates}) > 1:
                # a transposed page: many dates share one y
                continue
            # the printed Hebrew date sits just right of the Gregorian one
            date_x = max(c[0] for c in cells if parse_date(c[2]))
            hebrew = join_runs(rtl([c for c in cells
                                    if date_x < c[0] <= date_x + 90
                                    and not parse_date(c[2])]))
            halacha = rtl([c for c in cells
                           if xmin <= c[0] < xmax and not parse_date(c[2])])
            text = unreverse(join_runs(halacha))
            rows.append({'page': pno, 'date': str(dates[0]),
                         'hebrew': hebrew if re.search(rf'[{HEB}]', hebrew) else None,
                         'text': text if re.search(rf'[{HEB}]', text) else None})
    # a reading can wrap to a second physical line; keep the row that has text
    best = {}
    for r in rows:
        if r['date'] not in best or (r['text'] and not best[r['date']]['text']):
            best[r['date']] = r
    return sorted(best.values(), key=lambda r: r['date'])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('out')
    ap.add_argument('--halacha-x', required=True, metavar='MIN,MAX')
    ap.add_argument('--label', default='')
    a = ap.parse_args()
    xmin, xmax = (float(v) for v in a.halacha_x.split(','))
    rows = read_calendar(a.pdf, xmin, xmax)
    for r in rows:
        r['src'] = a.label or a.pdf.split('/')[-1]

    dates = [datetime.date.fromisoformat(r['date']) for r in rows]
    span = (dates[-1] - dates[0]).days + 1
    learn = review = blank = bad = 0
    for r in rows:
        d = datetime.date.fromisoformat(r['date'])
        text = r['text'] or ''
        kind = 'blank' if not text else ('review' if 'חזרה' in text else 'learn')
        expected = 'learn' if d.weekday() in (6, 0, 1, 2, 3) else 'review/blank'
        if kind == 'learn':
            learn += 1
        elif kind == 'review':
            review += 1
        else:
            blank += 1
        if (kind == 'learn') != (expected == 'learn'):
            bad += 1
            if bad <= 6:
                print(f'  MISMATCH {r["date"]} {d.strftime("%a")} got {kind} | {text[:60]}',
                      file=sys.stderr)
    print(f'{a.label or a.pdf.split("/")[-1]}: {len(rows)} days {dates[0]} -> {dates[-1]} '
          f'(contiguous={span == len(rows)})  learn={learn} review={review} blank={blank} '
          f'rule-mismatches={bad}', file=sys.stderr)
    json.dump(rows, open(a.out, 'w'), ensure_ascii=False, indent=0)


if __name__ == '__main__':
    main()
