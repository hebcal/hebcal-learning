# Daf HaYomi B'Halacha — source transcriptions

Human-readable transcriptions of every source used to build
`../../../src/dirshuDafHalacha.json`, so a value in the calendar can be traced back to
the page it was read from. They are redundant with the JSON by design: the JSON
is the machine-readable schedule, these are the audit trail.

Each table is headed with its page (and, for the Hebrew luachs, which of the two
panels on that page) in the original PDF, so it can be compared side by side
with the source.

| File | Source | Span | Cycle |
|---|---|---|---|
| [2024-english-booklet.md](2024-english-booklet.md) | `2024-Luach-Booklet-5-22-24-DIGITAL-Single-Pages.pdf` (dafhalacha.com) | 2024-06-11 → 2025-12-06 | 3 |
| [2025-english-booklet.md](2025-english-booklet.md) | `2025-Luach-Booklet-11-20-25-SINGLE-Pages-NO-bleed.pdf` (dafhalacha.com) | 2025-12-07 → 2026-08-29 | 3 |
| [2025-2026-spreadsheet.md](2025-2026-spreadsheet.md) | reader's spreadsheet, emailed to the maintainer | 2025-08-25 → 2026-09-11 | 3 |
| [5780-5781-hebrew-luach.md](5780-5781-hebrew-luach.md) | `bb66b78a-57805781.pdf` (dirshu.co.il pocket luach) | 2020-06-23 → 2021-04-12 | **2** |
| [5781-hebrew-luach.md](5781-hebrew-luach.md) | `1f7b0998-luach_tashpa1.pdf` | 2021-04-13 → 2022-02-19 | **2** |
| [5782-hebrew-luach.md](5782-hebrew-luach.md) | `e139a915-luach57821.pdf` | 2022-02-20 → 2022-09-24 | **3** |

Only the two English booklets and the spreadsheet feed the shipped calendar.
The three Hebrew luachs are the evidence behind two claims in `CLAUDE.md`:

- **The cycles run back-to-back.** `5781-hebrew-luach.md` ends Thu 2022-02-17
  with `מסימן תרצ''ו סעיף ח' עד סוף המשנה ברורה - סיום כל חלקי משנה ברורה`
  ("from 696:8 to the end of the Mishnah Berurah — completion of all its
  parts"), and `5782-hebrew-luach.md` opens Sun 2022-02-20 with
  `מתחילת סימן א'` ("from the beginning of siman 1"). Only that week's chazarah
  falls between them.
- **The Sunday–Thursday rule is not new to cycle 3.** It holds without
  exception across all 290 days of `5780-5781-hebrew-luach.md`.

## Caveats

- The Hebrew luachs print the reading as prose rather than the tabular
  `siman:se'if` of the English booklets, and are reproduced verbatim here. That
  prose is **not yet normalised** into the calendar's reference model — see
  `CLAUDE.md` §7.
- `5781-hebrew-luach.md` has real gaps: that booklet's PDF text layer drops
  cells other booklets carry, so some rows show — where the page has a reading.
  Roughly 21 of its 312 days are affected. The other five sources are complete.

## Regenerating

```bash
pip install pypdf cffi openpyxl
python3 tools/dirshu-luach/extract_hebrew_luach.py <hebrew booklets…> rows.json
node tools/dirshu-luach/date_hebrew_luach.mjs rows.json dated.json
cd tools/dirshu-luach && python3 make_transcripts.py --out transcriptions \
    --english <2024 booklet> <2025 booklet> \
    --hebrew-dated dated.json --xlsx <spreadsheet.xlsx>
```

The source files are not in the repo — see `CLAUDE.md` §2 for where they came
from.
