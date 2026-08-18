#!/usr/bin/env python3
"""Render the source luachs as Markdown transcriptions, one file per source.

    node hebrew_dates.mjs 2020-06-01 2026-10-01 hebrew_dates.json
    python3 make_transcripts.py --out transcriptions \
        --english 2024-booklet.pdf 2025-booklet.pdf \
        --hebrew-dated heb_dated.json --hebrew-dates hebrew_dates.json \
        --xlsx spreadsheet.xlsx

These files are a human-reviewable record of exactly what was read off each
page, so a discrepancy in src/dirshuDafHalacha.json can be traced back to the
printed source. Every table is headed with its page (and panel) in the
original PDF.

`--hebrew-dated` takes the JSON produced by
`extract_hebrew_luach.py … | date_hebrew_luach.mjs`, which is where the
Hebrew-date -> Gregorian conversion happens.
"""

import argparse
import datetime
import json
import os
import re
import sys

from extract_luach import (DATE_RE, HEB, KNOWN_PROBLEMS, gematria, group_rows,
                           numerals, page_items, parse_range, rtl, split_amud)

DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


def dow(d):
    return DOW[d.weekday()]


HEB_MONTHS = {
    'תשרי': 'Tishrei', 'חשון': 'Cheshvan', 'מרחשון': 'Cheshvan', 'כסלו': 'Kislev',
    'טבת': 'Tevet', 'שבט': "Sh'vat", 'אדר': 'Adar', 'אדר א': 'Adar I', 'אדר ב': 'Adar II',
    'ניסן': 'Nisan', 'אייר': 'Iyyar', 'סיון': 'Sivan', 'סיוון': 'Sivan', 'תמוז': 'Tamuz',
    'אב': 'Av', 'אלול': 'Elul',
}


def printed_date_agrees(printed, computed):
    """Does a printed Hebrew date decode to the date we computed for its row?

    The tashpa booklet places some date runs at a stray y, so a printed date can
    be attributed to the wrong row. Where the two disagree the printed value is
    the unreliable one -- the computed date is anchored on the panel's first
    date and stepped by consecutive days, and is what the Sunday-Thursday rule
    check validates. Returning False makes the caller fall back to the computed
    date and flag it, rather than print a value we know is misplaced.
    """
    if not printed or not computed:
        return False
    m = re.match(rf'^([{HEB}\'"”׳״]+)\s+(.+?)\'?$', printed.strip())
    if not m:
        return False
    day = gematria(m.group(1))
    month = HEB_MONTHS.get(m.group(2).replace("'", '').replace('׳', '').strip())
    if day is None or month is None:
        return False
    return day == computed['d'] and computed['m'].startswith(month.split()[0])


def hebdate(dates, date):
    """Decoded Hebrew date for a Gregorian date, e.g. "18 Kislev 5786"."""
    h = dates.get(str(date))
    return f'{h["d"]} {h["m"]} {h["y"]}' if h else '—'


def simanim_in(text):
    """Decode every siman the prose names, for eyeballing against the Hebrew."""
    out = []
    for m in re.finditer(rf'סימן\s+([{HEB}\'"”׳״]+)', text or ''):
        v = gematria(m.group(1))
        if v and 1 <= v <= 697 and v not in out:
            out.append(v)
    return ', '.join(str(v) for v in out) if out else '—'


def cell(text):
    """Wrap printed text in a code span: keeps exact characters and stops
    bidi reordering from scrambling Hebrew inside a Markdown table."""
    text = (text or '').strip()
    return '`' + text.replace('|', '\\|') + '`' if text else '—'


def read_english_pages(path, xmin=224.0, xmax=282.0):
    """{page number: [row dicts]} for a dafhalacha.com booklet."""
    from pypdf import PdfReader
    pages = {}
    for pno, page in enumerate(PdfReader(path).pages, 1):
        items = page_items(page)
        if not any(DATE_RE.fullmatch(t) for _, _, _, t in items):
            continue
        rows = []
        for _y, cells in group_rows(items):
            greg = [t for _x, _s, t in cells if DATE_RE.fullmatch(t)]
            if not greg:
                continue
            m, d, y = map(int, greg[0].split('/'))
            date = datetime.date(2000 + y, m, d)
            hebrew = ' '.join(t for x, _s, t in sorted(cells, key=lambda c: -c[0])
                              if 295 <= x < 322)
            halacha = rtl([c for c in cells
                           if xmin <= c[0] < xmax and not DATE_RE.fullmatch(c[2])])
            daf, side, printed_page, rest = split_amud(halacha)
            # The verso amud reaches us as separate runs ("קצו" "( :" "392" ")")
            # whose order is an artifact of the text layer; the page itself reads
            # "קצו: (392)". Rebuild that from the parts rather than joining runs.
            amud_printed = ''
            if daf is not None:
                head = halacha[0].strip()
                amud_printed = head if side == 'a' else (
                    f'{head}:' + (f' ({printed_page})' if printed_page else ''))
            amud = ''
            if daf is not None:
                amud = f'{daf}{side}' + (f' (p. {printed_page})' if printed_page else '')
            ref = ' '.join(rest)
            b = e = None
            # "חזרה" is a word, not a numeral -- never feed it to the gematria
            refs = [t for t in rest if 'חזרה' not in t]
            if refs:
                try:
                    b, e = parse_range(numerals(refs))
                except AssertionError:
                    pass
            rows.append({'date': date, 'hebrew': hebrew, 'amud': amud,
                         'amud_printed': amud_printed, 'ref': ref, 'b': b, 'e': e,
                         'learn': daf is not None})
        if rows:
            pages[pno] = rows
    return pages


def english_md(path, title, note, pages, hebrew_dates):
    out = [f'# {title}', '', note, '',
           f'Source file: `{os.path.basename(path)}`  ',
           f'Pages transcribed: {min(pages)}–{max(pages)}  ',
           f'Rows: {sum(len(r) for r in pages.values())}', '',
           'Each schedule page prints 14 days. Sunday–Thursday carry an amud and a',
           'siman/se\'if range; Friday prints `חזרה` and the Shabbat row beneath it',
           'carries that week\'s review range (the two form one merged cell).',
           'The **Parsed** column is what the extractor derived and what reaches',
           '`src/dirshuDafHalacha.json`. Rows marked [^known] are the two',
           'understood discrepancies allowlisted in `extract_luach.py`:', '',
           '- **2025-04-12** — the luach itself prints its own week\'s Thursday',
           '  *start* (308:41) where the *end* (308:45) belongs. The calendar uses',
           '  the computed value, which is correct.',
           '- **2025-12-20** — this review cell\'s gershayim are emitted as separate',
           '  text runs, so the numerals do not reassemble. Harmless: review ranges',
           '  are always computed from the week\'s learning days, never read from',
           '  print.', '']
    for pno in sorted(pages):
        rows = pages[pno]
        out += [f'## Page {pno} — {rows[0]["date"]} → {rows[-1]["date"]}', '',
                '| Date | Day | Hebrew date (printed) | Hebrew date | '
                'Amud (printed) | Amud | Reading (printed) | Reading |',
                '|---|---|---|---|---|---|---|---|']
        for r in rows:
            if r['learn']:
                parsed = r['b'] + (f'-{r["e"]}' if r['e'] else '')
            elif r['b']:
                parsed = f'chazarah {r["b"]}' + (f'-{r["e"]}' if r['e'] else '')
            elif r['ref']:
                parsed = 'chazarah'
            else:
                parsed = '—'
            if str(r['date']) in KNOWN_PROBLEMS:
                parsed += ' [^known]'
            out.append(f'| {r["date"]} | {dow(r["date"])} | {cell(r["hebrew"])} | '
                       f'{hebdate(hebrew_dates, r["date"])} | {cell(r["amud_printed"])} | '
                       f'{r["amud"] or "—"} | {cell(r["ref"])} | {parsed} |')
        out.append('')
    return '\n'.join(out)


def hebrew_md(src, title, note, rows, hebrew_dates):
    """rows: records from date_hebrew_luach.mjs for one booklet."""
    out = [f'# {title}', '', note, '',
           f'Source file: `{src}`  ',
           f'Rows: {len(rows)}  ',
           f'Span: {rows[0]["greg"]} → {rows[-1]["greg"]}', '',
           'These pocket luachs print Hebrew dates only; the Gregorian column is',
           'computed. Each page carries two 14-day panels side by side — the',
           'right-hand panel is the earlier one. The reading is printed as prose',
           'rather than the tabular `siman:se\'if` of the English booklets, and is',
           'reproduced here verbatim, unnormalised. Friday and Shabbat share one',
           'merged `חזרה` cell, shown on the Friday row.', '',
           'Panels run over consecutive days, so each row is located by its offset',
           'from the panel\'s first (anchor) date. A Hebrew date marked † was',
           'reconstructed that way because the booklet\'s own date cell did not',
           'survive text extraction; every other Hebrew date is as printed. A row',
           'showing — for the reading is an extraction gap, not a blank row in',
           'print.', '',
           'The **Simanim** column decodes every `סימן` the prose names, as a',
           'reading aid; it is not the normalised range (see `CLAUDE.md` §7).', '']
    groups = {}
    for r in rows:
        groups.setdefault((r['page'], r['panelX']), []).append(r)
    # within a page, the right-hand panel (larger x) is printed first
    for (pno, px) in sorted(groups, key=lambda k: (k[0], -k[1])):
        g = sorted(groups[(pno, px)], key=lambda r: r['abs'])
        panels_on_page = sorted({p for (pg, p) in groups if pg == pno}, reverse=True)
        side = ('right' if px == panels_on_page[0] else 'left') if len(panels_on_page) > 1 else 'single'
        label = f'## Page {pno}, {side} panel' if side != 'single' else f'## Page {pno}'
        out += [f'{label} — {g[0]["greg"]} → {g[-1]["greg"]}', '',
                '| Hebrew date (printed) | Hebrew date | Gregorian | Day | '
                'Reading (printed) | Simanim |',
                '|---|---|---|---|---|---|']
        for r in g:
            date = datetime.date.fromisoformat(r['greg'])
            computed = hebrew_dates.get(r['greg'])
            trusted = not r.get('computedDate') and printed_date_agrees(r['hebrew'], computed)
            heb = (cell(r['hebrew']) if trusted
                   else cell(computed['gematriya'] if computed else None) + '&nbsp;†')
            out.append(f'| {heb} | {hebdate(hebrew_dates, date)} | {r["greg"]} | {dow(date)} '
                       f'| {cell(r.get("text"))} | {simanim_in(r.get("text"))} |')
        out.append('')
    return '\n'.join(out)


def xlsx_md(path, title, note, hebrew_dates):
    import openpyxl
    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    rows = []
    for row in ws.iter_rows(values_only=True):
        if len(row) < 8 or not isinstance(row[3], datetime.datetime):
            continue
        amud = (row[6] or '').strip()
        ref = (row[7] or '').strip()
        daf = side = page = None
        m = re.match(rf'^([{HEB}]+)\s*([.:])', amud)
        if m:
            daf, side = gematria(m.group(1)), ('a' if m.group(2) == '.' else 'b')
        pg = re.search(r'\((\d+)\)', amud)
        if pg:
            page = int(pg.group(1))
        b = e = None
        if ref:
            try:
                b, e = parse_range(numerals([ref]))
            except AssertionError:
                pass
        decoded = ''
        if daf is not None:
            decoded = f'{daf}{side}' + (f' (p. {page})' if page else '')
        rows.append({'date': row[3].date(), 'hebrew': (row[2] or '').strip(),
                     'amud': amud, 'amud_decoded': decoded, 'ref': ref, 'b': b, 'e': e})
    out = [f'# {title}', '', note, '',
           f'Source file: `{os.path.basename(path)}`  ',
           f'Rows: {len(rows)}  ',
           f'Span: {rows[0]["date"]} → {rows[-1]["date"]}', '',
           'A third-party transcription, not a Dirshu publication. It agreed with',
           'the two English booklets on all 264 overlapping learning days and',
           'supplied the 10 days after the last booklet ends.', '']
    by_month = {}
    for r in rows:
        by_month.setdefault((r['date'].year, r['date'].month), []).append(r)
    for key in sorted(by_month):
        g = by_month[key]
        out += [f'## {key[0]}-{key[1]:02d} — {g[0]["date"]} → {g[-1]["date"]}', '',
                '| Date | Day | Hebrew date (printed) | Hebrew date | '
                'Amud (printed) | Amud | Reading (printed) | Reading |',
                '|---|---|---|---|---|---|---|---|']
        for r in g:
            parsed = (r['b'] + (f'-{r["e"]}' if r['e'] else '')) if r['b'] else '—'
            out.append(f'| {r["date"]} | {dow(r["date"])} | {cell(r["hebrew"])} | '
                       f'{hebdate(hebrew_dates, r["date"])} | {cell(r["amud"])} | '
                       f'{r["amud_decoded"] or "—"} | {cell(r["ref"])} | {parsed} |')
        out.append('')
    return '\n'.join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True)
    ap.add_argument('--english', nargs=2, required=True, metavar=('2024', '2025'))
    ap.add_argument('--hebrew-dated', required=True)
    ap.add_argument('--xlsx', required=True)
    ap.add_argument('--hebrew-dates', required=True,
                    help='Gregorian -> Hebrew map from hebrew_dates.mjs')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    hebrew_dates = json.load(open(a.hebrew_dates))

    written = []
    eng = [
        (a.english[0], '2024 Luach Booklet (English) — Daf HaYomi B\'Halacha',
         '2024-Luach-Booklet-5-22-24-DIGITAL-Single-Pages.pdf, published by '
         'dafhalacha.com. Third cycle, opening Hilchot Shabbat.',
         '2024-english-booklet.md'),
        (a.english[1], '2025 Luach Booklet (English) — Daf HaYomi B\'Halacha',
         '2025-Luach-Booklet-11-20-25-SINGLE-Pages-NO-bleed.pdf, published by '
         'dafhalacha.com. Third cycle, completing Hilchot Shabbat and opening Eruvin.',
         '2025-english-booklet.md'),
    ]
    for path, title, note, name in eng:
        pages = read_english_pages(path)
        open(os.path.join(a.out, name), 'w').write(english_md(path, title, note, pages, hebrew_dates))
        written.append((name, sum(len(r) for r in pages.values())))

    dated = json.load(open(a.hebrew_dated))
    heb_meta = {
        'bb66b78a-57805781.pdf': ('Hebrew luach, Tamuz 5780 – Nisan 5781 — Daf HaYomi B\'Halacha',
                                  '**Second cycle**, simanim ~490–581.',
                                  '5780-5781-hebrew-luach.md'),
        '1f7b0998-luach_tashpa1.pdf': ('Hebrew luach 5781 (תשפ״א) — Daf HaYomi B\'Halacha',
                                       '**Second cycle**, simanim ~579 to the end of the Mishnah '
                                       'Berurah. NOTE: this booklet\'s text layer drops many cells — '
                                       '97 of its 312 days come out blank. Blanks below are '
                                       'extraction gaps, not blank rows in print.',
                                       '5781-hebrew-luach.md'),
        'e139a915-luach57821.pdf': ('Hebrew luach 5782 (תשפ״ב) — Daf HaYomi B\'Halacha',
                                    'Straddles the changeover: the **second cycle ends** Thu '
                                    '2022-02-17 and the **third cycle begins** Sun 2022-02-20 at '
                                    'siman 1. Simanim 1–53.',
                                    '5782-hebrew-luach.md'),
    }
    for src, (title, note, name) in heb_meta.items():
        rows = sorted([r for r in dated if r['src'] == src], key=lambda r: r['abs'])
        if not rows:
            print(f'no rows for {src}', file=sys.stderr)
            continue
        open(os.path.join(a.out, name), 'w').write(hebrew_md(src, title, note, rows, hebrew_dates))
        written.append((name, len(rows)))

    name = '2025-2026-spreadsheet.md'
    open(os.path.join(a.out, name), 'w').write(xlsx_md(
        a.xlsx, 'Spreadsheet transcription, Elul 5785 – Elul 5786',
        'Emailed to the maintainer by a reader; covers 2025-08-25 → 2026-09-11.',
        hebrew_dates))
    written.append((name, None))

    for n, c in written:
        print(f'  wrote {n}' + (f' ({c} rows)' if c else ''), file=sys.stderr)


if __name__ == '__main__':
    main()
