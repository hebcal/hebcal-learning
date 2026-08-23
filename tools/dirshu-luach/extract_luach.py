#!/usr/bin/env python3
"""Extract the Daf HaYomi B'Halacha schedule from Dirshu luach booklet PDFs.

Usage:
    pip install pypdf cffi

    # inspect one page's text with coordinates (to re-derive column x-ranges)
    python3 extract_luach.py --dump-page 6 2024-booklet.pdf

    # parse booklets and write src/dirshuDafHalacha.json
    python3 extract_luach.py --out ../../src/dirshuDafHalacha.json \
        2024-booklet.pdf 2025-booklet.pdf

    # additionally check every seif against Sefaria's Shulchan Arukh (network)
    python3 extract_luach.py --check-sefaria ... 2024-booklet.pdf 2025-booklet.pdf

Booklets must be passed in chronological order and must be contiguous — the
script asserts this, since the output is a dense day-indexed array.

IMPORTANT: --halacha-x is calibrated for the English booklets published at
dafhalacha.com. Dirshu's Hebrew luach (dirshu.co.il, `luach_57xx.pdf`) uses a
different page layout — its siman/seif sit near x=273..288 and its amud near
x=306..323. Always run --dump-page on a schedule page of a new booklet and
re-derive the window before trusting the output.
"""

import argparse
import datetime
import json
import re
import sys

from pypdf import PdfReader

GEM = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400,
    'ך': 20, 'ם': 40, 'ן': 50, 'ף': 80, 'ץ': 90,
}
HEB = ''.join(GEM)
# geresh/gershayim variants used inconsistently across the booklets
PUNCT = "'’‘\"”“׳״`"
DATE_RE = re.compile(r'\d\d/\d\d/\d\d')

# A siman is always >= 200 in the transcribed range (242..429) and the largest
# seif anywhere in the Shulchan Arukh is well under 200, so the two are
# unambiguous. Revisit if booklets covering simanim < 200 are ever added.
SIMAN_FLOOR = 200

# Diagnostics that are understood and benign. Anything not listed here is a
# real regression and should be investigated before the output is trusted.
KNOWN_PROBLEMS = {
    # The luach itself is wrong: this row prints its own week's Thursday start
    # (308:41) where the end (308:45) belongs. Computed value is correct.
    '2025-04-12',
    # The gershayim in this one review cell are emitted as separate text runs
    # ("שמ" "’’" "ה"), so the numerals do not reassemble. Harmless: review
    # ranges are computed from the week's learning days, never read from print.
    '2025-12-20',
}


def gematria(word):
    letters = [c for c in word if c in GEM]
    return sum(GEM[c] for c in letters) if letters else None


def page_items(page):
    """[(y, x, seq, text)] for every non-empty text run on the page."""
    items = []
    seq = [0]

    def visitor(text, cm, tm, fontdict, fontsize):
        stripped = text.strip()
        if not stripped:
            return
        seq[0] += 1
        items.append((tm[5], tm[4], seq[0], stripped))

    page.extract_text(visitor_text=visitor)
    return items


def group_rows(items, tol=3.5):
    """Cluster text runs into table rows by y coordinate, top to bottom."""
    rows = []
    for y, x, seq, text in sorted(items, key=lambda i: -i[0]):
        if rows and abs(rows[-1][0] - y) <= tol:
            rows[-1][1].append((x, seq, text))
        else:
            rows.append([y, [(x, seq, text)]])
    return rows


def rtl(cells):
    """Reconstruct display (right-to-left) reading order.

    Cells are laid out right to left, so descending x is reading order. Runs
    sharing an x are one visual cell whose pieces the PDF emits in reverse,
    e.g. ['א׳', 'רמ״ו', 'ו׳', 'רמ״ה'] displays as
    "רמ״ה ו׳ - רמ״ו א׳" (245:6-246:1).
    """
    groups = []
    for x, seq, text in sorted(cells, key=lambda c: (-c[0], c[1])):
        if groups and abs(groups[-1][0] - x) < 1.0:
            groups[-1][1].append(text)
        else:
            groups.append([x, [text]])
    out = []
    for _x, texts in groups:
        out.extend(reversed(texts) if len(texts) > 1 else texts)
    return out


def read_booklet(path, xmin, xmax):
    """[(date, halacha_tokens)] for every dated row in the booklet."""
    reader = PdfReader(path)
    rows = []
    for page in reader.pages:
        items = page_items(page)
        if not any(DATE_RE.fullmatch(t) for _, _, _, t in items):
            continue  # not a schedule page
        for _y, cells in group_rows(items):
            dates = [t for _x, _s, t in cells if DATE_RE.fullmatch(t)]
            if not dates:
                continue
            month, day, year = map(int, dates[0].split('/'))
            halacha = [
                c for c in cells if xmin <= c[0] < xmax and not DATE_RE.fullmatch(c[2])
            ]
            rows.append((datetime.date(2000 + year, month, day), rtl(halacha)))
    return rows


def split_amud(tokens):
    """Peel the amud cell off the front. -> (daf, side, printed_page, rest)"""
    if not tokens:
        return None, None, None, tokens
    head = tokens[0]
    # recto prints as a bare numeral plus a period, e.g. "קצו."
    if re.fullmatch(rf'[{HEB}]+\.', head):
        return gematria(head), 'a', None, tokens[1:]
    # verso prints numeral, colon and the page number, e.g. "קצו" ":" "392" ")"
    if len(tokens) >= 4 and re.fullmatch(rf'[{HEB}]+', head) and ':' in tokens[1]:
        page = next((int(t) for t in tokens[1:4] if t.strip().isdigit()), None)
        return gematria(head), 'b', page, tokens[4:]
    return None, None, None, tokens


def numerals(tokens):
    """Display-order tokens -> list of ints and '-' markers.

    Punctuation is stripped rather than replaced, because gershayim sit *inside*
    a numeral (ע״ר is 270, not 70 and 200), while spaces separate numerals
    (רפ״ז רפ״ח is 287 and 288).
    """
    out = []
    for token in tokens:
        cleaned = ''.join(c for c in token if c not in PUNCT)
        for word in re.findall(rf'[{HEB}]+|-', cleaned):
            out.append(word if word == '-' else gematria(word))
    return out


def ref(siman, seif):
    return f'{siman}:{seif}' if seif is not None else str(siman)


def parse_range(seq):
    """Numeral sequence -> (begin, end). end is None when it equals begin.

    Handles every shape the booklets use, e.g.
        [345, 1]                 -> 345:1
        [345, 1, '-', 3]         -> 345:1 .. 345:3
        [245, 6, '-', 246, 1]    -> 245:6 .. 246:1
        [361]                    -> all of siman 361
        [331, 10, 332]           -> 331:10 .. all of 332
        [286, 4, '-', 5, 287, 288, 1] -> 286:4 .. 288:1
    """
    nums = [(v, v >= SIMAN_FLOOR) for v in seq if v != '-']
    if not nums:
        return None, None
    begin_siman, begin_is_siman = nums[0]
    assert begin_is_siman, f'reading does not start with a siman: {seq}'
    begin_seif = nums[1][0] if len(nums) > 1 and not nums[1][1] else None
    last_value, last_is_siman = nums[-1]
    if last_is_siman:
        end_siman, end_seif = last_value, None
    else:
        end_seif = last_value
        end_siman = next((v for v, is_s in reversed(nums[:-1]) if is_s), None)
    begin = ref(begin_siman, begin_seif)
    end = ref(end_siman, end_seif)
    return begin, (None if end == begin else end)


def parse_rows(rows):
    recs = []
    for date, tokens in rows:
        rec = {'date': date, 'tokens': tokens}
        if tokens and tokens[0] == 'חזרה':
            rec['kind'] = 'review-fri'
        else:
            daf, side, page, rest = split_amud(tokens)
            seq = numerals(rest)
            if daf is not None:
                rec.update(kind='learn', daf=daf, side=side, page=page)
                rec['b'], rec['e'] = parse_range(seq)
            elif seq:
                # Shabbat prints the week's review range with no "חזרה" of its own
                rec['kind'] = 'review-sat'
                rec['b'], rec['e'] = parse_range(seq)
            else:
                rec['kind'] = 'none'
        recs.append(rec)
    recs.sort(key=lambda r: r['date'])
    return recs


def read_xlsx(path):
    """Read a spreadsheet transcription of the luach.

    Same schedule, independently transcribed by a third party: column D holds
    the Gregorian date, G the amud ("קנט." / "קנט: (318)") and H the
    siman/seif reference ("שכ\"ה ט' - י'"). Rows without an amud are the
    Friday/Shabbat review days.
    """
    import datetime
    import openpyxl

    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    recs = []
    for row in ws.iter_rows(values_only=True):
        if len(row) < 8 or not isinstance(row[3], datetime.datetime):
            continue
        date = row[3].date()
        amud = (row[6] or '').strip()
        ref = (row[7] or '').strip()
        m = re.match(rf'^([{HEB}]+)\s*([.:])', amud)
        if not (m and ref):
            recs.append({'date': date, 'tokens': [amud, ref], 'kind': 'none'})
            continue
        page = re.search(r'\((\d+)\)', amud)
        b, e = parse_range(numerals([ref]))
        recs.append({'date': date, 'tokens': [amud, ref], 'kind': 'learn',
                     'daf': gematria(m.group(1)), 'side': 'a' if m.group(2) == '.' else 'b',
                     'page': int(page.group(1)) if page else None, 'b': b, 'e': e})
    return recs


def merge(primary, secondary):
    """Merge a secondary source into the primary, cross-checking the overlap."""
    by_date = {r['date']: r for r in primary}
    problems, added = [], 0
    for r in secondary:
        have = by_date.get(r['date'])
        if have is None:
            by_date[r['date']] = r
            added += 1
        elif have['kind'] == 'learn' and r['kind'] == 'learn':
            mine = (have['b'], have['e'], have['daf'], have['side'])
            theirs = (r['b'], r['e'], r['daf'], r['side'])
            if mine != theirs:
                problems.append(f'{r["date"]}: sources disagree, {mine} vs {theirs}')
    merged = sorted(by_date.values(), key=lambda r: r['date'])
    return merged, added, problems


def validate(recs, check_sefaria=False):
    """Returns (learning_records, problems). Every invariant here held across
    the 2024 + 2025 booklets, so a new failure means a layout or parse change."""
    problems = []
    span = (recs[-1]['date'] - recs[0]['date']).days + 1
    if span != len(recs):
        problems.append(f'booklets are not contiguous: {span} days but {len(recs)} rows')

    learn = [r for r in recs if r['kind'] == 'learn']

    # 1. learning days are exactly Sunday-Thursday; Friday and Shabbat review
    for r in recs:
        weekday = r['date'].weekday()  # Mon=0 .. Sun=6
        expected = 'learn' if weekday in (6, 0, 1, 2, 3) else 'review'
        actual = 'learn' if r['kind'] == 'learn' else 'review'
        if actual != expected and r['kind'] != 'none':
            problems.append(f'{r["date"]}: expected {expected}, parsed {r["kind"]} {r["tokens"]}')

    # 2. the amud advances by exactly one every learning day, restarting at 2a
    #    with each volume of the Dirshu Mishnah Berurah
    volumes = []
    previous = None
    for i, r in enumerate(learn):
        key = (r['daf'], r['side'])
        if previous is None:
            volumes.append(i)
        else:
            expected = (previous[0], 'b') if previous[1] == 'a' else (previous[0] + 1, 'a')
            if key != expected:
                if key == (2, 'a'):
                    volumes.append(i)  # new volume
                else:
                    problems.append(f'{r["date"]}: amud jumped {previous} -> {key}')
        if r['page'] is not None:
            expected_page = r['daf'] * 2 - (0 if r['side'] == 'b' else 1)
            if r['page'] != expected_page:
                problems.append(f'{r["date"]}: page {r["page"]} != {expected_page}')
        previous = key

    # 3. readings never move backwards
    def parts(s):
        p = s.split(':')
        return int(p[0]), (int(p[1]) if len(p) > 1 else None)

    previous_end = None
    for r in learn:
        begin = parts(r['b'])
        if previous_end:
            ps, pf = previous_end
            ok = begin[0] > ps or (
                begin[0] == ps and (begin[1] is None or pf is None or begin[1] >= pf)
            )
            if not ok:
                problems.append(f'{r["date"]}: reading moved backwards {previous_end} -> {begin}')
        previous_end = parts(r['e'] or r['b'])

    # 4. each printed Shabbat review range matches the week it reviews.
    #    Known exception: 2025-04-12 prints its own week's Thursday *start*
    #    (308:41) where the end (308:45) belongs -- a typo in the luach.
    by_date = {r['date']: r for r in recs}
    for r in recs:
        if r['kind'] != 'review-sat' or not r.get('b'):
            continue
        week = [by_date.get(r['date'] - datetime.timedelta(days=n)) for n in range(2, 7)]
        week = sorted(
            (d for d in week if d and d['kind'] == 'learn'), key=lambda d: d['date']
        )
        if len(week) != 5:
            continue
        expected = (week[0]['b'], week[-1]['e'] or week[-1]['b'])
        printed = (r['b'], r['e'] or r['b'])
        # a bare siman and its first seif denote the same point
        normalised = tuple(v if ':' in v else v + ':1' for v in printed)
        if normalised != tuple(v if ':' in v else v + ':1' for v in expected):
            problems.append(
                f'{r["date"]}: printed review {printed} != computed {expected} {r["tokens"]}'
            )

    if check_sefaria:
        problems.extend(check_against_sefaria(learn))

    return learn, volumes, problems


def check_against_sefaria(learn):
    """Every seif must exist in Shulchan Arukh, Orach Chayim."""
    import urllib.request

    url = 'https://www.sefaria.org/api/shape/Shulchan%20Arukh,%20Orach%20Chayim'
    with urllib.request.urlopen(url, timeout=60) as resp:
        chapters = json.load(resp)[0]['chapters']
    problems = []
    for r in learn:
        for reference in (r['b'], r['e']):
            if not reference or ':' not in reference:
                continue
            siman, seif = (int(p) for p in reference.split(':'))
            if seif > chapters[siman - 1]:
                problems.append(
                    f'{r["date"]}: {reference} but SA OC {siman} has {chapters[siman - 1]} seifim'
                )
    return problems


def dump_page(path, number):
    reader = PdfReader(path)
    for _y, cells in group_rows(page_items(reader.pages[number - 1])):
        line = '  '.join(f'({x:.0f}){t}' for x, _s, t in sorted(cells, key=lambda c: -c[0]))
        print(line)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('pdfs', nargs='+')
    ap.add_argument('--out', help='write the schedule JSON here')
    ap.add_argument('--dump-page', type=int, metavar='N',
                    help='print page N with coordinates and exit')
    ap.add_argument('--halacha-x', default='224,282', metavar='MIN,MAX',
                    help='x range of the Daf HaYomi B\'Halacha columns (default 224,282)')
    ap.add_argument('--xlsx', action='append', default=[], metavar='FILE',
                    help='spreadsheet transcription to merge in and cross-check')
    ap.add_argument('--check-sefaria', action='store_true',
                    help='validate every seif against Sefaria (requires network)')
    args = ap.parse_args()

    if args.dump_page:
        dump_page(args.pdfs[0], args.dump_page)
        return 0

    xmin, xmax = (float(v) for v in args.halacha_x.split(','))
    rows = []
    for path in args.pdfs:
        booklet = read_booklet(path, xmin, xmax)
        print(f'{path}: {len(booklet)} dated rows, '
              f'{booklet[0][0]} .. {booklet[-1][0]}', file=sys.stderr)
        rows.extend(booklet)

    recs = parse_rows(rows)
    merge_problems = []
    for xp in args.xlsx:
        extra = read_xlsx(xp)
        recs, added, probs = merge(recs, extra)
        merge_problems += probs
        print(f'{xp}: {len(extra)} rows, {added} new days, '
              f'{len(probs)} disagreement(s) on the overlap', file=sys.stderr)
    learn, volumes, problems = validate(recs, args.check_sefaria)
    problems += merge_problems

    print(f'\n{len(recs)} rows, {len(learn)} learning days, '
          f'{learn[0]["date"]} .. {learn[-1]["date"]}', file=sys.stderr)
    print(f'volume starts at learning-day indices {volumes} '
          f'({[str(learn[i]["date"]) for i in volumes]})', file=sys.stderr)
    known = [p for p in problems if p.split(':')[0] in KNOWN_PROBLEMS]
    new = [p for p in problems if p.split(':')[0] not in KNOWN_PROBLEMS]
    if known:
        print(f'\n{len(known)} known/benign diagnostic(s):', file=sys.stderr)
        for p in known:
            print('  ' + p, file=sys.stderr)
    if new:
        print(f'\n{len(new)} NEW problem(s) -- investigate before trusting output:',
              file=sys.stderr)
        for p in new:
            print('  ' + p, file=sys.stderr)
    else:
        print('\nall invariants hold', file=sys.stderr)

    if args.out:
        readings = [r['b'] + ('-' + r['e'] if r['e'] else '') for r in learn]
        with open(args.out, 'w', encoding='utf-8') as f:
            f.write('{\n"volumes":' + json.dumps(volumes, separators=(',', ':')) + ',\n')
            f.write('"readings":[\n')
            f.write(',\n'.join(json.dumps(s) for s in readings))
            f.write('\n]}\n')
        print(f'wrote {args.out} ({len(readings)} readings)', file=sys.stderr)

    return 1 if new else 0


if __name__ == '__main__':
    sys.exit(main())
