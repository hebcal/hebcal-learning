# Daf HaYomi B'Halacha (Dirshu) — how this schedule was built

Working notes for `dirshuDafHalacha`, the one calendar in this package that is
**not** a perpetual cycle. Everything here is background for maintaining it;
`CLAUDE.md` covers the repo as a whole.

Read `src/dirshuDafHalachaBase.ts`'s file header first — it carries the part
that must not be lost (why there is no `% cycleLen`). This file is the longer
story: where the data came from, how it was extracted, and what is still open.

---

## 1. What the calendar is

Dirshu's daily Mishnah Berurah program. One amud of the **Dirshu edition** of
the Mishnah Berurah on each of Sunday through Thursday; Friday and Shabbat
review (chazarah) that week's five days.

| File | Purpose |
|---|---|
| `src/dirshuDafHalacha.json` | 1443 daily readings + amud metadata |
| `src/dirshuDafHalachaBase.ts` | `dirshuDafHalacha(date)`, start/end constants |
| `src/DirshuDafHalachaEvent.ts` | Event class: `render`, `renderBrief`, `url` |
| `src/dirshuDafHalacha.ts` | `DailyLearning.addCalendar('dirshuDafHalacha', …)` |
| `test/dirshuDafHalacha.spec.ts` | 20 tests |
| `tools/dirshu-luach/` | the extraction pipeline (§5) and the transcriptions (§6) |

The array covers **cycle-3 learning days 0 through 1442**, from **2022-02-20**
through **2027-08-31**, with no hole. Dates past the end return `null`; dates
before the start throw `RangeError` via the shared `checkTooEarly`.

## 2. The schedule rule

Validated over every day of every source, with no exceptions:

- **Sunday–Thursday**: one amud, always advancing by exactly one.
- **Friday + Shabbat**: chazarah of that week's five days. The luach prints it
  as one merged two-row cell — `חזרה` on the Friday row, the range on the
  Shabbat row.
- **Yom Tov never interrupts it.** Verified on Tisha B'Av 5784/5785, Rosh
  Hashanah 5785, Yom Kippur 5786 and Pesach 5785/5786 — all ordinary learning
  days with ordinary readings.
- **The rule is identical in cycle 2.** `date_hebrew_luach.mjs` replays it over
  the Hebrew luachs: 0 mismatches across the 290 days of the 5780–5781 luach,
  2 across the 5782 one. The *timing* half of the pattern is confirmed across
  two cycles.
- Printed page number is always `daf × 2` on the b-side (`daf × 2 − 1` on the
  a-side, where it is not printed).
- Amud numbering **restarts at 2a with each volume** of the Dirshu edition —
  per *volume*, not per MB chelek. Page 1 is front matter and is never learned.

Because the amud advances mechanically, `daf`/`side` are *computed* from the
learning-day index rather than stored. Only the siman:se'if ranges and the
volume-start indices live in the JSON.

Date → learning-day index is pure arithmetic: anchor on the Sunday on or before
the start date, then `index = week × 5 + dayOfWeek − startOrdinal`. The cycle
opened on a Sunday, so `startOrdinal` is 0.

## 3. Cycle 3's anchor, and cycles run back-to-back

**Cycle 3 began Sunday 2022-02-20** (19 Adar I 5782) at siman 1, immediately
after cycle 2's last learning day. The 5782 Hebrew luach straddles the
changeover and says so in its own introduction — *"finishing the second cycle …
with the beginning of the third cycle of learning … to begin and complete all
six chalakim of the Mishnah Berurah"* — and its schedule pages show it directly:

| Date | | Reading |
|---|---|---|
| Thu **2022-02-17** (16 Adar I 5782) | cycle 2, last learning day | `מסימן תרצ''ו סעיף ח' עד סוף המשנה ברורה - סיום כל חלקי משנה ברורה` (696:8 → end of MB) |
| Fri–Sat 2022-02-18/19 | | the week's chazarah |
| Sun **2022-02-20** (19 Adar I 5782) | **cycle 3, day 0** | `מתחילת סימן א' עד אמצע סעיף א' ''ולא יתבייש''` (start of siman 1) |

No gap and no restart offset: in cycle 3's own Sunday–Thursday counting, cycle
2's final learning day sits at index **−1**.

## 4. References are Shulchan Arukh, NOT Mishnah Berurah

The `סימן וסעיף` column gives **Shulchan Arukh, Orach Chayim** siman:se'if.
Confirmed: siman 308 runs to se'if 52 in the data, and SA OC 308 has exactly 52
se'ifim, whereas Sefaria's *Mishnah Berurah* 308 has 171 (it is indexed by
se'if katan). Every reading was checked against Sefaria's shape API — zero out
of range.

So `url()` links to `Shulchan_Arukh,_Orach_Chayim.<siman>.<seif>`. **Do not
"fix" this to `Mishnah_Berurah`** — it would point at the wrong text. The
rendered book name is still "Mishnah Berurah", because that is what the program
is called and what the luach prints.

A reference with **no se'if** (e.g. `"361"`) means the whole siman. 41 readings
begin that way and 15 end that way; these are *not* always single-se'if simanim
(255 has 3, 294 has 5, 332 has 4), so they cannot be normalised to `:1`.
Following the `KitzurShulchanAruchEvent` precedent for `:E`, `url()` links to
the start of the reading rather than emitting an ambiguous range.

## 5. The sources

None of these are in the repo — they were emailed or downloaded. What each one
*says* is captured in `tools/dirshu-luach/transcriptions/`, one Markdown table
per PDF page, so a reading can be reviewed and disputed without the PDFs in
hand.

| Source | Origin | Covers | Cycle |
|---|---|---|---|
| 2024 booklet (English) | `dafhalacha.com/wp-content/uploads/2024/06/2024-Luach-Booklet-5-22-24-DIGITAL-Single-Pages.pdf` | 2024-06-11 → 2025-12-06 | 3 |
| 2025 booklet (English) | `dafhalacha.com/wp-content/uploads/2025/12/2025-Luach-Booklet-11-20-25-SINGLE-Pages-NO-bleed.pdf` | 2025-12-07 → 2026-08-29 | 3 |
| spreadsheet (`.xlsx`) | emailed by a reader | 2025-08-25 → 2026-09-11 | 3 |
| `57805781.pdf` (Hebrew pocket luach) | emailed | 2020-06-23 → 2021-04-12 | **2** |
| `luach_tashpa1.pdf` (Hebrew) | emailed | 2021-04-13 → 2022-02-19 | **2** |
| `luach57821.pdf` (Hebrew) | emailed | 2022-02-20 → 2022-09-24 | **3** |
| 5782 wall calendar | emailed | 2021-08-09 → 2022-09-25 | 2 → **3** |
| 5783 wall calendar | emailed | 2022-08-28 → 2023-09-15 | 3 |
| 5784 wall calendar | emailed | 2023-08-18 → 2024-10-02 | 3 |
| 5787 wall calendar | emailed | 2026-08-14 → 2027-10-01 | 3 |

The spreadsheet is an independent third-party transcription with Gregorian
dates, the amud *and* the siman/se'if. It **agreed with the two English
booklets on all 264 overlapping learning days** — reference, daf, side and
printed page — and extended the horizon by 10 learning days.

The two English booklets are **not two cycles**, despite how they were
described when handed over. They are consecutive annual booklets from the
middle of cycle 3, contiguous to the day (544 + 266 = 810 rows = exactly 810
calendar days). Both say so in their own introductions ("…**in the third
cycle**").

### Which source covers which index

Indices are learning days counted from cycle 3 day 0 = 2022-02-20:

| Range | Source | Simanim |
|---|---|---|
| 0 – 154 | 5782 Hebrew luach (prose) | 1 – 53 |
| 155 – 389 | 5783 wall calendar, transposed grid (prose) | ~53 – 160 |
| 390 – 601 | 5784 wall calendar (prose) | ~160 – 241 |
| 602 – 1189 | English booklets + reader's spreadsheet (tabular) | 242 – 434 |
| 1190 – 1442 | 5787 wall calendar (tabular) | 434 – 514 |
| 1443 – end | **missing** — later calendars | 514 – 697 |

Every join overlaps, and 181 days carry two or more independent sources. It
stops at index 1442 because the 5787 calendar's next learning day prints a
volume's `הקדמה` — an introduction, not a siman reference — which the
`siman:se'if` model has no way to express.

## 6. The extraction pipeline

`tools/dirshu-luach/`, one script per source *layout*, all feeding
`build_schedule.py`:

| Script | Layout |
|---|---|
| `extract_luach.py` | dafhalacha.com English booklets → `siman:seif` JSON directly |
| `extract_hebrew_luach.py` + `date_hebrew_luach.mjs` | dirshu.co.il Hebrew pocket luachs (Hebrew-dated, prose) |
| `extract_calendar.py` | row-per-day English-dated wall calendars |
| `extract_grid_calendar.py` | wall calendars that transpose the table (day = column) |
| `normalize_prose.py` | prose readings → the `siman:seif` model |
| `build_schedule.py` | merges every source into the shipped JSON |
| `make_transcripts.py` | renders `transcriptions/*.md` |
| `hebrew_dates.mjs` | Gregorian → Hebrew date map, via `@hebcal/hdate` |

`transcriptions/README.md` documents the regeneration commands and the
per-calendar `--halacha-x` windows. The English pipeline reproduces the
committed JSON **byte-identically** and reports two known/benign diagnostics
(allowlisted in `KNOWN_PROBLEMS`):

- **2025-04-12** — a genuine typo *in the luach*: that Shabbat row prints its
  own week's Thursday **start** (308:41) where the **end** (308:45) belongs.
  The computed value is right; 114 of the other 115 printed review ranges match
  exactly.
- **2025-12-20** — one review cell whose gershayim are emitted as separate text
  runs, so the numerals don't reassemble. Harmless: review ranges are always
  computed from the week's learning days, never read from print.

Anything *else* it reports is a real regression — investigate before trusting
the output.

### Traps in the PDF text layer

Each of these cost real time. The extractors handle them, but new parsing code
will hit them again:

1. **Same-x text runs are emitted in reverse.** Runs sharing an x coordinate
   form one visual cell whose pieces come out backwards. `['א׳', 'רמ״ו', 'ו׳',
   'רמ״ה']` displays as `רמ״ה ו׳ - רמ״ו א׳` = 245:6–246:1. Group by x, reverse
   within each group, then read groups by descending x.
2. **Strip gershayim, don't split on them.** A gershayim sits *inside* a
   numeral (`ע״ר` = 270, not 70 and 200) while spaces *separate* numerals
   (`רפ״ז רפ״ח` = 287 and 288). Replacing punctuation with a space silently
   corrupts alternate spellings like `ער״ב`/`רע״ב`. A geresh, by contrast,
   closes a numeral, so it does force a space after.
3. **Split columns by content, not by a fixed coordinate window.** The wall
   calendars print a one-letter day of the week (alef–vav = Sunday–Friday,
   shin = Shabbat) to the right of the Hebrew date, but *how far* right varies
   by year: 79pt in 5787, 91–94pt in 5784, and the 5782 calendar prints no
   Hebrew date at all. A fixed window swallowed the letter into the date in
   some years and not others. The transcriptions now decode the letter and
   check it against the weekday computed from the row's own Gregorian date.
4. **Column x-coordinates differ per publication.** `--halacha-x 224,282` is
   calibrated for the English booklets; the Hebrew luach puts siman/se'if near
   x≈273–288 and the amud near x≈306–323; each wall calendar year differs
   again. Always run `--dump-page N` on a schedule page of a new file and
   re-derive the window before trusting output.

## 7. What is still open

- **The cycle does not reach its end.** Cycle 3 runs to roughly siman 697; the
  data stops at 514 (2027-08-31). The cycle length is therefore not known, and
  the calendar goes silent after that date. Closing this needs the 5788
  calendar and its successors.
- **A modulo would drift — do not add one.** See the file header in
  `src/dirshuDafHalachaBase.ts` for the evidence and the worked example.
- **The amud is only known from index 602.** Earlier sources print the reading
  but not the page of the Dirshu edition, so `daf`/`side` are `undefined`
  before 2024-06-11. One day (index 1235, 2026-11-15) covers more than a single
  amud — it prints `ל. לא.` — and every amud after it shifts by a full daf;
  that is recorded in the JSON's `amud.extra` rather than left to silently
  skew.
- **The prose normaliser is calibrated, not proven.** 68 of the 79 days where
  the 5784 calendar overlaps the English booklets reproduce them exactly; the
  other 11 were traced to three rows missing from that PDF's text layer, which
  merging sources fixes. Re-run that comparison after touching
  `normalize_prose.py` — the conventions differ by one se'if (booklets print
  the se'ifim *touched*, prose prints start and end *points*) and a mistake
  there is silent.
- **The cycle-2 tail is transcribed but unused.** The 5780/5781 material covers
  cycle 2 from 2020-06-23 to its end. It is the evidence for §2 and §3 and for
  the non-repeat finding, but it does not feed the shipped JSON.
- **`luach_tashpa1` extracts badly — 97 of its 312 days come out blank.** Its
  text layer drops cells the other two Hebrew booklets carry. Since it is
  cycle-2 data, it was not chased further; fix it only if the cycle-2 tail is
  ever actually needed.

### Source availability

> Network reachability is session-dependent — re-test rather than trusting this
> blindly. The captcha wall below has been seen both up and fully down.

- **dafhalacha.com** has been seen both captcha-walled (SiteGround `sgcaptcha`,
  HTTP 202 + JS redirect on every path) and wide open. Either way its media
  library **only goes back to 2024-06-10**; the authoritative check is
  `…/wp-json/wp/v2/media?per_page=100&mime_type=application/pdf&orderby=date&order=asc`,
  whose first row is the 2024 booklet. There are no pre-2024 booklets on the
  live site. The only other Luach PDFs present are near-duplicate variants of
  the two already used.
- **dirshu.co.il is completely open** — no captcha, WP REST API works, `curl`
  pulls its PDFs. It carries the same columns as the English booklets and
  matches them exactly (spot-checked 17–28 Kislev 5786), but it is Hebrew-date
  only and they keep **just the current year**.
- **`files.dirshu.co.il`** responds but directory listing is 403, so old luachs
  cannot be discovered there. Sibling sites (`dirshu.co.uk`, `dirshu.co.za`)
  link only to the current luach page.
- **Web archives have been unreachable** from the sandbox: `web.archive.org`
  returned 502/503 on every endpoint, `timetravel.mementoweb.org` failed DNS,
  and `archive.today` sat behind an unsolvable CAPTCHA. The Wayback snapshot of
  the old `dafhalacha.com/limud-schedule/` page needs a real browser.
- Unverified lead, low confidence: YUTorah hosts a daily *"Dirshu Daf HaYomi
  B'Halacha Mishna Berura (X:Y)"* shiur series whose titles encode siman:se'if
  with dates, including simanim in the missing range. It is Cloudflare-gated,
  and the lecture IDs don't order consistently with the Dirshu sequence
  (881453 = 242:1 predates 1073335 = 162:1, which is backwards), so it may be a
  different track. Cross-check at best, never a primary source.

## 8. Design decisions worth not re-litigating

- **Calendar key `dirshuDafHalacha`**, matching the existing `dirshuAmudYomi`.
- **Review days emit events.** `{review: true}` with the week's range, `daf` and
  `side` undefined. This is faithful to the luach, which explicitly schedules
  chazarah, but it does add two events per week to a feed.
- **`null` past the end of data**, not a thrown error — this matches the
  `DailyLearning.addCalendar` contract ("return null if no learning that day").
  `RangeError` before the start, via the shared `checkTooEarly`.
- **`dirshuDafHalachaEnd` is exported** so callers can see the data horizon.
- **English render**: `Daf HaYomi B'Halacha: Mishnah Berurah 345:1-3`; review
  days insert `Chazarah` before the book name. **Hebrew** follows the
  `KitzurShulchanAruchEvent` convention — `gematriyaNN` joined by `:`
  (`משנה ברורה שמה:א-ג`), not the luach's own `שמ״ה א׳ - ג׳` styling.
- Translations for `Daf HaYomi B'Halacha`, `Mishnah Berurah` and `Chazarah`
  live in `po/he.po` and `po/ashkenazi.po`.
