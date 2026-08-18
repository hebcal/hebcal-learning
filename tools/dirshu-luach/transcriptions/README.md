# Daf HaYomi B'Halacha — source transcriptions

Human-readable transcriptions of every source used to build
`../../../src/dirshuDafHalacha.json`, so a value in the calendar can be traced back to
the page it was read from. They are redundant with the JSON by design: the JSON
is the machine-readable schedule, these are the audit trail.

Each table is headed with its page (and, for the Hebrew luachs, which of the two
panels on that page) in the original PDF, so it can be compared side by side
with the source.

**Every Hebrew value is followed by its decoded value in the next column** — the
Hebrew date beside `18 Kislev 5786`, the amud `קצו:` beside `196b (p. 392)`, the
reading `שמ״ה ד׳ - ו׳` beside `345:4-345:6` — so a misread gematriya shows up as
a mismatch between two adjacent cells rather than needing a diff against the
JSON. Hebrew is stored in logical order (siman first, then se'if), which is how
it renders right-to-left, and is wrapped in backticks so the exact characters
survive and the cell boundaries stay clear.

The decoded Hebrew dates come from `@hebcal/hdate` via `hebrew_dates.mjs`, the
same library the calendar uses, rather than from a second implementation.

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
- A Hebrew date marked † was reconstructed rather than read: either its cell did
  not survive text extraction, or the cell that was extracted decoded to a
  different day than the row it landed on, which happens where a booklet places
  a date run at a stray coordinate. In that case the printed value is the
  unreliable one — the reconstructed date is anchored on the panel's first date
  and stepped by consecutive days, and is what the Sunday–Thursday rule check
  validates. Every date shown *without* † has been verified to decode to the
  value beside it: 1,584 checked, 0 mismatches.
- `5781-hebrew-luach.md` is the damaged one. Its PDF text layer drops cells the
  other booklets carry, so ~21 of its 312 days show — for the reading, and 158
  of its dates are reconstructed. `5780-5781-hebrew-luach.md` (5 †) and
  `5782-hebrew-luach.md` (6 †) are essentially clean, and the three
  cycle-3 sources are complete.

## Regenerating

```bash
pip install pypdf cffi openpyxl
cd tools/dirshu-luach
python3 extract_hebrew_luach.py <hebrew booklets…> rows.json
node date_hebrew_luach.mjs rows.json dated.json      # dates + rule check
node hebrew_dates.mjs 2020-06-01 2026-10-01 hebrew_dates.json
python3 make_transcripts.py --out transcriptions \
    --english <2024 booklet> <2025 booklet> \
    --hebrew-dated dated.json --hebrew-dates hebrew_dates.json \
    --xlsx <spreadsheet.xlsx>
```

The source files are not in the repo — see `CLAUDE.md` §2 for where they came
from.
