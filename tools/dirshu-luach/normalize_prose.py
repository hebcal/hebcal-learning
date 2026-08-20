#!/usr/bin/env python3
"""Convert the luachs' prose readings into the siman:seif model of the JSON.

    python3 normalize_prose.py --seifim seifim.json in.json out.json

The English booklets print a reading as the se'ifim it TOUCHES ("245:3-245:5").
The Hebrew luachs and the wall calendars instead print the START and END POINTS
("מסעיף ג' עד סעיף ו'"), which is not the same thing: that reading runs from the
start of se'if 3 up to the start of se'if 6, so it touches 3 to 5, and the next
day opens "מסעיף ו'". Getting that off by one would shift 600 days by one se'if,
so every rule below is calibrated against the 82 days where the 5784 calendar
and the shipped English booklets overlap.

    מתחילת סימן רמ"ג …                 start = 243:1
    מסימן רמ"ד אמצע סעיף א' "…"        start = 244:1   (אמצע = inside that se'if)
    … עד אמצע סעיף ה' "…"              end   = 5       (content runs into 5)
    … עד סעיף ו'                       end   = 5       (stops at the start of 6)
    … עד תחילת סימן רמ"ה               end   = last se'if of the current siman
    … עד סימן רמ"ו סעיף ב'             end   = 246:1

A reading that covers a whole siman is written as the bare siman, matching how
the booklets print it -- but only when the prose says the reading both opens at
that siman's start and runs to its end. A day can open at the start of a siman
and stop halfway through its only se'if, which the booklets still print "242:1".

Status: 68 of the 79 calibration days reproduce the shipped booklets exactly.
The other 11 are all one fault, not eleven: three rows are absent from the 5784
PDF's text layer, and a day whose prose does not name its siman inherits it from
the day before, so a lost row leaves the carried siman stale until some later
day names one again. Merging the sources by date before normalising fixes it --
every one of cycle-3 learning days 0-601 has prose from at least one source.
"""

import argparse
import json
import re
import sys

from extract_luach import HEB, gematria

# A Hebrew numeral is a few letters with at most one gershayim before the last
# of them. It must NOT be allowed to run on, or a citation right after the
# numeral gets swallowed: "סעיף א\'"ואם היתה"" would read as one number.
# The gershayim inside a numeral is written "  in some sources and as two
# apostrophes in others -- י''א is siman 11, and reading it as י loses the 11.
GERSHAYIM = r'["”“״]|\'\''
# Wrapped in a non-capturing group: it is an alternation, and interpolating it
# bare lets its branches escape whatever group it is placed in -- which made the
# se'if-katan pattern match any one to four Hebrew letters anywhere.
NUM = (rf'(?:[{HEB}]{{1,3}}\s*(?:{GERSHAYIM})\s*[{HEB}]{{1,2}}'
       # the same numeral with a stray space dropped into it by extraction,
       # as "ת מ\"ז" for תמ"ז (447) in the 5787 calendar
       rf'|[{HEB}]{{1,2}}\s+[{HEB}]{{1,2}}\s*(?:{GERSHAYIM})\s*[{HEB}]{{1,2}}'
       rf'|[{HEB}]{{1,4}})')
TOKEN = re.compile(
    rf'(?P<startsiman>מתחילת\s+סימן\s+(?P<ss>{NUM}))'
    rf'|(?P<siman>סימן\s+(?P<sm>{NUM}))'
    rf'|(?P<begin>תחילת)'
    rf'|(?P<sof>סוף)'
    rf'|(?P<mid>אמצע)'
    # se'if KATAN is the Mishnah Berurah's own numbering, so it marks a position
    # inside the current se'if rather than naming one -- consume its numeral
    rf'|(?P<katan>סעיף\s+קטן\s+{NUM})'
    rf'|(?P<seif>סעיף\s+(?P<sf>{NUM}))'
    rf'|(?P<hasseif>הסעיף)'
    rf'|(?P<os>אות)'
    rf'|(?P<ad>עד)'
    # A bare numeral standing where a siman belongs: "עד ק\"א סעיף ג'". Anchored
    # between "עד " and "סעיף", and listed last so every keyword matches first --
    # ordinary Hebrew words are themselves valid gematria, so unanchored this
    # reads עד as siman 74, the מ of מסעיף as 40 and אמצע as 201.
    rf'|(?P<bare>(?<=עד )(?P<bs2>{NUM})\s*(?=סעיף))'
)


def parse(text, carry_siman, carry_seif, seifim):
    """prose -> (b_siman, b_seif, e_siman, e_seif) as inclusive endpoints."""
    side = 0                       # 0 = before "עד", 1 = after
    cur = [carry_siman, carry_seif]
    pt = [[carry_siman, carry_seif, False], None]   # [siman, seif, at_start_of_siman]
    pending_begin = pending_sof = pending_mid = False
    for m in TOKEN.finditer(text):
        kind = m.lastgroup if m.lastgroup in ('ss', 'sm', 'sf') else None
        if m.group('ad') and side == 0:
            side = 1
            pt[1] = [cur[0], cur[1], False]
            pending_begin = pending_sof = pending_mid = False
            continue
        if m.group('startsiman'):
            cur = [gematria(m.group('ss')), 1]
            pt[side] = [cur[0], 1, True]
            pending_begin = False
        elif m.group('siman') or m.group('bare'):
            value = gematria(m.group('sm') if m.group('siman') else m.group('bs2'))
            cur[0] = value
            if pending_begin:
                pt[side] = [value, 1, True]
                pending_begin = False
            elif pending_sof:
                pt[side] = [value, seifim(value), False]
                pending_sof = False
            else:
                # a siman with no se'if after it names the siman itself, which as
                # an endpoint means its start -- "עד סימן קט\"ז"
                cur[1] = 1
                pt[side] = [value, 1, False, 'siman-only']
        elif m.group('seif'):
            value = gematria(m.group('sf'))
            cur[1] = value
            pt[side] = [cur[0], value, False]     # an explicit se'if clears siman-only
            if pending_mid:
                pt[side].append('mid')
                pending_mid = False
        elif m.group('katan'):
            pt[side] = [cur[0], cur[1], False]
            if pending_mid:
                pt[side].append('mid')
                pending_mid = False
        elif m.group('hasseif'):
            pt[side] = [cur[0], cur[1], False]
            if pending_mid:
                pt[side].append('mid')
                pending_mid = False
        elif m.group('begin'):
            pending_begin = True
        elif m.group('sof'):
            pending_sof = True
        elif m.group('mid'):
            pending_mid = True
    if pt[1] is None:
        pt[1] = list(pt[0])
    b_siman, b_seif = pt[0][0], pt[0][1]
    b_at_siman_start = bool(pt[0][2])
    e = pt[1]
    e_siman, e_seif = e[0], e[1]
    inside = len(e) > 3 and e[3] == 'mid'
    siman_only = len(e) > 3 and e[3] == 'siman-only'
    e_at_siman_end = False
    if e[2] or (siman_only and e[0] != b_siman):   # "until the start of siman Y"
        if e_siman != b_siman:
            # the reading stops where siman Y opens, so it runs to the end of
            # Y-1 -- which is not always the siman it started in
            e_siman, e_seif = e_siman - 1, seifim(e_siman - 1)
            e_at_siman_end = True
        else:
            e_seif = 1
    elif not inside and (e_siman, e_seif) != (b_siman, b_seif):
        # stops at the START of that se'if, so the previous one is the last touched
        e_seif -= 1
        if e_seif < 1:
            e_siman -= 1
            e_seif = seifim(e_siman)
            e_at_siman_end = True
    if (e_siman, e_seif) < (b_siman, b_seif):
        e_siman, e_seif = b_siman, b_seif
    return b_siman, b_seif, e_siman, e_seif, b_at_siman_start, e_at_siman_end


def render(b_siman, b_seif, e_siman, e_seif, at_start, at_end, seifim):
    """A siman is written bare only when the reading truly spans all of it.

    Covering se'if 1 through the last se'if is not enough: a day can open at the
    start of a siman and stop halfway through its only se'if, which the booklets
    still print as "242:1". So the bare form needs the prose to have said both
    "from the beginning of siman X" and "until the beginning of the next".
    """
    def covers_all_of(siman):
        """Does the reading run from this siman's true start to its true end?"""
        opens = b_siman < siman or (b_siman == siman and b_seif == 1 and at_start)
        closes = e_siman > siman or (e_siman == siman and e_seif == seifim(siman) and at_end)
        return opens and closes

    b = str(b_siman) if b_seif == 1 and covers_all_of(b_siman) else f'{b_siman}:{b_seif}'
    e = (str(e_siman) if e_seif == seifim(e_siman) and covers_all_of(e_siman)
         else f'{e_siman}:{e_seif}')
    return b, (None if e == b else e)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('out')
    ap.add_argument('--seifim', required=True, help='JSON array of SA OC seif counts')
    a = ap.parse_args()
    counts = json.load(open(a.seifim))
    def seifim(siman):
        return counts[siman - 1] if 1 <= siman <= len(counts) else 1

    rows = json.load(open(a.src))
    carry = (None, 1)
    out = []
    for r in sorted(rows, key=lambda r: r['date']):
        text = r.get('text')
        if not text or 'חזרה' in text:
            out.append({**r, 'b': None, 'e': None})
            continue
        try:
            bs, bf, es, ef, at_start, at_end = parse(text, carry[0], carry[1], seifim)
        except (TypeError, IndexError) as exc:
            print(f'  UNPARSED {r["date"]}: {text[:60]} ({exc})', file=sys.stderr)
            out.append({**r, 'b': None, 'e': None})
            continue
        b, e = render(bs, bf, es, ef, at_start, at_end, seifim)
        carry = (es, ef)
        out.append({**r, 'b': b, 'e': e})
    json.dump(out, open(a.out, 'w'), ensure_ascii=False, indent=0)
    done = sum(1 for r in out if r['b'])
    print(f'{a.src.split("/")[-1]}: normalised {done} of {len(out)} rows', file=sys.stderr)


if __name__ == '__main__':
    main()
