# CLAUDE.md — working notes for `claude/dirshu-daf-halacha-schedule-u6v5b8`

> **This file is a handoff for one in-progress branch, not permanent repo
> documentation. Delete or trim it before merging to `main`.**

Task: add the Dirshu **Daf HaYomi B'Halacha** (daily Mishnah Berurah) schedule
to `@hebcal/learning`, derived from Dirshu's published luach booklets.

**Status: implemented and tested. The coverage gap is CLOSED.** A reader
supplied six more Dirshu calendars on 2026-08-20 and `src/dirshuDafHalacha.json`
now holds **1443 consecutive learning days — cycle-3 indices 0 to 1442, from
2022-02-20 to 2027-08-31** — with no hole. Merging is still the maintainer's
call; see §7 for what remains (the cycle does not yet reach its end, so
`% cycleLen` is still not possible).

**Cycle 3 began Sunday 2022-02-20** at siman 1, immediately after cycle 2's last
learning day (Thu 2022-02-17). Cycles run strictly back-to-back with no gap and
no restart offset (§2a).

---

## 1. What was delivered

| File | Purpose |
|---|---|
| `src/dirshuDafHalacha.json` | 1443 daily readings + amud metadata |
| `src/dirshuDafHalachaBase.ts` | `dirshuDafHalacha(date)`, start/end constants |
| `src/DirshuDafHalachaEvent.ts` | Event class: `render`, `renderBrief`, `url` |
| `src/dirshuDafHalacha.ts` | `DailyLearning.addCalendar('dirshuDafHalacha', …)` |
| `test/dirshuDafHalacha.spec.ts` | 16 tests |
| `tools/dirshu-luach/extract_luach.py` | dafhalacha.com booklets → JSON (§5) |
| `tools/dirshu-luach/extract_hebrew_luach.py` + `date_hebrew_luach.mjs` | dirshu.co.il Hebrew pocket luachs |
| `tools/dirshu-luach/extract_calendar.py` | row-per-day English-dated wall calendars |
| `tools/dirshu-luach/extract_grid_calendar.py` | wall calendars that transpose the table |
| `tools/dirshu-luach/normalize_prose.py` | prose readings → the `siman:seif` model |
| `tools/dirshu-luach/build_schedule.py` | merges every source into the shipped JSON |
| `tools/dirshu-luach/transcriptions/` | Markdown transcription of every source, one table per PDF page — the audit trail behind the JSON |
| `src/index.ts`, `src/register.ts`, `po/*.po`, `README.md` | wiring |

Full suite green: 30 files / 183 tests. `npm run lint` and
`npm run format:check` clean.

## 2. The two source PDFs

The maintainer uploaded these into the session (originals are behind a captcha,
see §6). **They are not in the repo** — re-request them if you need to re-run
the extractor. What each one *says* is captured in
`tools/dirshu-luach/transcriptions/`, one Markdown table per PDF page, so the
readings can be reviewed and disputed without the PDFs in hand.

| Source | Origin | Covers | Cycle |
|---|---|---|---|
| 2024 booklet (English) | `dafhalacha.com/wp-content/uploads/2024/06/2024-Luach-Booklet-5-22-24-DIGITAL-Single-Pages.pdf` | 2024-06-11 → 2025-12-06 | 3 |
| 2025 booklet (English) | `dafhalacha.com/wp-content/uploads/2025/12/2025-Luach-Booklet-11-20-25-SINGLE-Pages-NO-bleed.pdf` | 2025-12-07 → 2026-08-29 | 3 |
| spreadsheet (`303460cb-*.xlsx`) | emailed to the maintainer by a reader | 2025-08-25 → 2026-09-11 | 3 |
| `bb66b78a-57805781.pdf` (Hebrew) | emailed (`avrumiesti@gmail.com`, 2026-08-18) | 2020-06-23 → 2021-04-12, simanim ~490–581 | **2** |
| `1f7b0998-luach_tashpa1.pdf` (Hebrew) | same | 2021-04-13 → 2022-02-19, simanim ~579–**end of MB** | **2** |
| `e139a915-luach57821.pdf` (Hebrew) | same | 2022-02-20 → 2022-09-24, simanim **1–53** | **3** |

The spreadsheet is an independent third-party transcription with Gregorian
dates, the amud *and* the siman/seif. It **agreed with the two English booklets
on all 264 overlapping learning days** — reference, daf, side and printed page —
and extended the horizon by 10 learning days. It is merged in via `--xlsx`
(§5).

**They are NOT two cycles**, despite how they were described when handed over.
They are consecutive annual booklets from the *middle of the third cycle*, and
they are contiguous to the day (544 + 266 = 810 rows = exactly 810 calendar
days, no gap, no overlap). Both booklets say so in their own introductions:

- 2024: *"…embarks on the beginning of hilchos Shabbos, Chelek Gimmel of the
  Mishnah Berurah **in the third cycle**"*
- 2025: *"…completes hilchos Shabbos, Chelek Gimmel and begins the halachos of
  Eruvin, Chelek Daled, **in the third cycle**"*

This matters: **there is zero cross-cycle evidence in these files.** Any claim
about whether cycle 4 repeats cycle 3 day-for-day is unverified.

## 2a. Cycle 3's anchor, and cycles run back-to-back

The three Hebrew luachs settled the question §7 used to flag as unanswerable.
`luach57821`'s own introduction says it straddles the changeover — *"finishing
the second cycle … with the beginning of the third cycle of learning … to begin
and complete all six chalakim of the Mishnah Berurah"* — and the schedule pages
show it directly:

| Date | | Reading |
|---|---|---|
| Thu **2022-02-17** (16 Adar I 5782) | cycle 2, last learning day | `מסימן תרצ''ו סעיף ח' עד סוף המשנה ברורה - סיום כל חלקי משנה ברורה` (696:8 → end of MB) |
| Fri–Sat 2022-02-18/19 | | the week's chazarah |
| Sun **2022-02-20** (19 Adar I 5782) | **cycle 3, day 0** | `מתחילת סימן א' עד אמצע סעיף א' ''ולא יתבייש''` (start of siman 1) |

No gap, no restart offset: in cycle 3's own Sunday-Thursday counting, cycle 2's
final learning day sits at index **−1**. So a future `% cycleLen` is sound.

Indices below are learning days counted from cycle 3 day 0 = 2022-02-20:

| Range | Source | Simanim |
|---|---|---|
| 0 – 154 | Hebrew `luach57821` (prose) | 1 – 53 |
| 155 – 389 | 5783 wall calendar, transposed grid (prose) | ~53 – 160 |
| 390 – 601 | 5784 wall calendar (prose) | ~160 – 241 |
| 602 – 1189 | dafhalacha.com booklets + reader's spreadsheet (tabular) | 242 – 434 |
| 1190 – 1442 | 5787 wall calendar (tabular) | 434 – 514 |
| 1443 – end | **MISSING** — later calendars | 514 – 697 |

Every join overlaps, and 181 days carry two or more independent sources. The
array is indexed from cycle-3 day 0 (2022-02-20 = `readings[0]` = siman 1:1).
The old 578-entry array is preserved byte-for-byte at indices 602–1189.

It stops at index 1442 because the 5787 calendar's next learning day prints a
volume's `הקדמה` — an introduction, not a siman reference — which the
`siman:seif` model has no way to express.

## 3. The schedule rule (validated over all 810 consecutive days)

This half *is* a clean reproducible pattern, with no exceptions anywhere in the
data:

- **Sunday–Thursday**: one amud of the Dirshu Mishnah Berurah edition, always
  advancing by exactly one.
- **Friday + Shabbat**: chazarah (review) of that week's five days. Printed as
  one merged two-row cell — "חזרה" on the Friday row, the range on the Shabbat
  row.
- **Yom Tov never interrupts it.** Verified on Tisha B'Av 5784/5785, Rosh
  Hashanah 5785, Yom Kippur 5786, Pesach 5785/5786 — all ordinary learning days
  with ordinary readings.
- **The rule is identical in cycle 2.** `date_hebrew_luach.mjs` replays it over
  the Hebrew luachs: **0 mismatches across the 290 days** of `bb66b78a`
  (cycle 2, 2020-06-23 → 2021-04-12) and 2 across `luach57821` (cycle 3 start).
  So the *timing* half of the pattern is confirmed across two cycles.
- Printed page number is always `daf × 2` on the b-side (`daf × 2 − 1` on the
  a-side, where it is not printed).
- Amud numbering **restarts at 2a with each volume** of the edition. Page 1 is
  front matter and is never learned.

Because the amud advances mechanically, `daf`/`side` are *computed* from the
learning-day index, not stored. Only the siman:se'if ranges and the volume-start
indices live in the JSON.

Date → learning-day index is pure arithmetic (`dirshuDafHalachaBase.ts`):
anchor on the Sunday on or before the start date, then
`index = week × 5 + dayOfWeek − startOrdinal`. The start date is a Tuesday, so
`startOrdinal` is 2 — which is also why the opening Friday/Shabbat
(2024-06-14/15) correctly return `null`: their week begins before the schedule
does, exactly as the luach prints it (blank).

## 4. References are Shulchan Arukh, NOT Mishnah Berurah

The `סימן וסעיף` column gives **Shulchan Arukh, Orach Chayim** siman:se'if.
Confirmed: siman 308 runs to se'if 52 in the data, and SA OC 308 has exactly 52
se'ifim, whereas Sefaria's *Mishnah Berurah* 308 has 171 (it is indexed by
se'if katan). Every one of the 578 readings was checked against Sefaria's shape
API — zero out of range.

So `url()` links to `Shulchan_Arukh,_Orach_Chayim.<siman>.<seif>`. Do not
"fix" this to `Mishnah_Berurah` — it would point at the wrong text.

A reference with **no se'if** (e.g. `"361"`) means the whole siman. 41 readings
begin that way and 15 end that way; these are *not* always single-se'if
simanim (255 has 3, 294 has 5, 332 has 4), so they cannot be normalised to
`:1`. Following the `KitzurShulchanAruchEvent` precedent for `:E`, `url()`
links to the start of the reading rather than emitting an ambiguous range.

## 5. Re-running the extractor when new booklets arrive

```bash
pip install pypdf cffi openpyxl   # cffi or pypdf's crypto import dies
python3 tools/dirshu-luach/extract_luach.py \
    --check-sefaria --xlsx <spreadsheet.xlsx> \
    --out src/dirshuDafHalacha.json \
    <English booklets…in chronological order>
npm test
```

`--xlsx` merges a spreadsheet transcription: new days are appended, and days
that overlap the PDFs are **cross-checked** rather than trusted (it reports any
disagreement as a problem). The 2026-08-18 run reported 0 disagreements over
264 overlapping learning days.

For the **Hebrew** luachs (dirshu.co.il pocket booklets) use the separate pair —
they are a different artifact with a different layout, and they emit raw prose
rather than `siman:seif`:

```bash
python3 tools/dirshu-luach/extract_hebrew_luach.py <hebrew booklets…> rows.json
node tools/dirshu-luach/date_hebrew_luach.mjs rows.json dated.json
```

`date_hebrew_luach.mjs` needs each booklet's Hebrew year in its `START` map
(the Hebrew luachs print no year), and it validates the Sun-Thu/chazarah rule.

The English pipeline reproduces the committed JSON **byte-identically** from the sources above,
exits 0, and reports two known/benign diagnostics (allowlisted in
`KNOWN_PROBLEMS`):

- **2025-04-12** — a genuine typo *in the luach*: that Shabbat row prints its own
  week's Thursday **start** (308:41) where the **end** (308:45) belongs. The
  computed value is right; 114 of the other 115 printed review ranges match
  exactly.
- **2025-12-20** — one review cell whose gershayim are emitted as separate text
  runs so the numerals don't reassemble. Harmless: review ranges are always
  computed from the week's learning days, never read from print.

Anything *else* it reports is a real regression — investigate before trusting
the output.

### Two traps in the PDF text layer

Both cost real time; the extractor handles them, but you'll hit them again if
you write new parsing code:

1. **Same-x text runs are emitted in reverse.** Runs sharing an x coordinate
   form one visual cell whose pieces come out backwards. `['א׳', 'רמ״ו', 'ו׳',
   'רמ״ה']` displays as `רמ״ה ו׳ - רמ״ו א׳` = 245:6–246:1. Group by x, reverse
   within each group, then read groups by descending x.
2. **Strip gershayim, don't split on them.** Gershayim sit *inside* a numeral
   (`ע״ר` = 270, not 70 and 200) while spaces *separate* numerals (`רפ״ז רפ״ח`
   = 287 and 288). Replacing punctuation with a space silently corrupts
   alternate spellings like `ער״ב`/`רע״ב`.

### Column layout

`--halacha-x 224,282` is calibrated for the **English** dafhalacha.com
booklets. Column x-coordinates in those booklets:

| x | Column |
|---|---|
| ~331 | day-of-week letter |
| ~307 | Hebrew date |
| ~284 | Gregorian date (`MM/DD/YY`) |
| ~254–276 | **עמוד** (amud / printed page) |
| ~227–247 | **סימן וסעיף** |
| ~130–214 | מוסר |
| ~108 / ~83 / ~54 / ~25 | חבורת ש״ס / קנין תורה / קנין ירושלמי / עמוד היומי |

Dirshu's **Hebrew** luach uses a different layout — siman/se'if near x≈273–288,
amud near x≈306–323. Always run `--dump-page N` on a schedule page of any new
booklet and re-derive the window before trusting output.

## 6. Source availability — what is and isn't reachable

> **Network reachability is session-dependent — re-test, don't trust this list
> blindly.** The captcha wall described below was *fully down* in the
> 2026-08-16 re-probe: `curl` pulled the 2024 booklet PDF straight off
> dafhalacha.com (HTTP 200, `application/pdf`, 17.9 MB) and its WP REST API
> answered WebFetch with no `sgcaptcha`. An earlier session saw the opposite.
> Spend two `curl` calls confirming the current state before concluding
> anything is blocked — but expect the *coverage* conclusion (below) to hold
> regardless of which wall is up, because the old booklets simply aren't hosted.

- **dafhalacha.com** has been seen both captcha-walled (SiteGround `sgcaptcha`,
  HTTP 202 + JS redirect on every path) *and* wide open (2026-08-16). When open,
  both `curl` and WebFetch reach `/wp-json/wp/v2/media` and the PDF uploads
  directly. **But its media library only goes back to 2024-06-10** — the
  authoritative check is
  `…/wp-json/wp/v2/media?per_page=100&mime_type=application/pdf&orderby=date&order=asc`,
  whose *first* row is the 2024 booklet. There are **no pre-2024 booklets on the
  live site**, wall up or down. The only Luach PDFs present are four: the two
  you already have plus a `2024-10/2024-Luach-Booklet-6-19-24-NO-Bleed.pdf` and a
  `2025-11/2025-2026-Luach-Booklet-Email-Version-single-pages.pdf` (variants of
  the same two — diff them against the JSON if ever curious, but they add no
  coverage).
- **All web archives are blocked here — confirmed 2026-08-16, all three routes:**
  `web.archive.org` returns nginx **502/503 on every endpoint** (CDX,
  `/wayback/available`, and the `/web/<ts>/` and `…id_/` snapshot paths alike —
  it is the egress proxy intercepting, not the real IA);
  `timetravel.mementoweb.org` **fails DNS resolution**; `archive.today`
  (`archive.ph`) is reachable but sits behind an **unsolvable Cloudflare
  CAPTCHA** (HTTP 429 → recaptcha challenge page). So the Wayback snapshot of the
  old `https://dafhalacha.com/limud-schedule/` page (see §7) **cannot be fetched
  from this environment** — it needs a real browser outside the sandbox.
- **Chromium is not a workaround in this environment.** It cannot reach *any*
  host through the agent proxy — `ERR_CONNECTION_RESET` even for example.com.
- **dirshu.co.il is completely open** — no captcha, WP REST API works, and
  `curl` pulls its PDFs (`luach_5786.pdf`, 1.7 MB, HTTP 200).
  `https://www.dirshu.co.il/wp-content/uploads/2026/02/luach_5786.pdf` is the
  current Hebrew luach (linked from the `לוח הלימוד השנתי` page —
  `…/2161-2/לוח-הלימוד-השנתי/` — via a pdf-viewer shortcode iframe). It carries
  the same columns and **matches the English booklets exactly** (spot-checked
  17–28 Kislev 5786). It is Hebrew-date only and they keep **just the current
  year**: the media API returns only `luach_5786`, and brute-forcing
  `luach_5785`/`5784` across likely `/YYYY/MM/` upload paths returned **no hits**
  (2026-08-16).
- **`files.dirshu.co.il`** is a plain (non-WordPress) file server that responds,
  but directory listing is **403** and individual files need an exact guessed
  path — not a practical way to discover old luachs. Reachable sibling sites
  (`dirshu.co.uk/downloads-info`, `dirshu.co.za`) link only to the current
  dirshu.co.il luach page, sample tests, and marei-mekomos — no schedule
  archive.

**`tashpa` extracts badly — 97 of its 312 days come out blank** (its text layer
drops cells that the other two booklets carry). `bb66b78a` extracts cleanly (0
mismatches) and `luach57821` nearly so (2). Since `tashpa` is cycle-2 data whose
value is conditional anyway, it was not chased further; fix it only if the
cycle-2 tail is ever actually needed.

That Hebrew luach also settled an ambiguity: its page header marks
`* תחילת חלק ד׳` ("start of chelek 4") against 17 Kislev while the amud
continues at 196 rather than resetting. So the `עמוד` column is per **Dirshu
volume** (simanim 242–428, spanning MB chalakim 3–4), *not* per MB chelek.

## 7. The open question — read this before writing more code

The timing rule (§3) is fully reproducible. The **content mapping is not a rule
and cannot be made into one**: which siman:se'if falls on a given amud is where
the page breaks land in a physical printed edition. It can only ever be a
table. That alone is fine — `arukhHaShulchanYomi.json` is a 1719-entry table,
and `bavli.json`, `mishnayot.json`, `kitzurSa.json` are all tables too.

The real gap was **coverage**, and as of 2026-08-20 it is closed for the years
we have: `readings` holds cycle-3 indices 0–1442 with no hole. What remains:

- **The cycle does not reach its end.** Cycle 3 runs to roughly siman 697; the
  data stops at 514 (2027-08-31). So `% cycleLen` is still impossible — the
  cycle length is not yet known, and the calendar goes silent after 2027-08-31.
  Closing this needs the 5788 calendar and its successors, or the cycle-2
  material below.
- **The cycles are NOT identical — a modulo would drift (tested 2026-08-20).**
  Aligning the normalised cycle-2 readings against cycle 3 finds a single sharp
  signal at a cycle length of ~1804 learning days: 23 consecutive days match
  *exactly*, including compound ranges like `497:8-497:11`, against ~0% at every
  other offset. So the two cycles are unmistakably the same schedule. But the
  match then breaks: from cycle-3 index 1409 on, cycle 2's readings line up with
  cycle 3 shifted by **one day**. Cycle 3 spends two days (`503:1-504:1`,
  `504:1-504:2`) where cycle 2 spent one (`503:1-504:2`), so cycle 3 contains at
  least one learning day that cycle 2 did not — consistent with Dirshu
  re-typesetting a volume between cycles, which moves the amud breaks.
  The overlap is only 72 days, so there may be more such adjustments elsewhere.
  **Do not add `% cycleLen`.** It would be right for a while and then silently
  drift by a day.
- **The cycle-2 sources are still only a conditional shortcut.** `bb66b78a`,
  `tashpa` and the 5780/5781 wall calendars cover cycle 2 from 2019-09-01 to its
  end. If the content table repeats across cycles, those readings are cycle 3's
  for the same indices counted back from the cycle end, which would complete the
  table outright. Cycle-3 coverage now reaches index 1442 and the cycle-2 data
  covers roughly the last 640 learning days of its cycle, so for the first time
  the two **should overlap** — an alignment search over the readings would both
  test the repeat hypothesis and, if it holds, yield the cycle length. That
  experiment has not been run. Do not assume the repeat without it.
- **The amud is only known from index 602.** Earlier sources print the reading
  but not the page of the Dirshu edition, so `daf`/`side` are `undefined` before
  2024-06-11. One day (index 1235, 2026-11-15) covers more than a single amud —
  it prints `ל. לא.` — and every amud after it shifts by a full daf; that is
  recorded in the JSON's `amud.extra` rather than left to silently skew.
- **The prose normaliser is calibrated, not proven.** 68 of the 79 days where
  the 5784 calendar overlaps the English booklets reproduce them exactly; the
  other 11 were traced to three rows missing from that PDF's text layer, which
  merging sources fixes. Re-run that comparison after touching
  `normalize_prose.py` — the conventions differ by one se'if and a mistake there
  is silent (§5).

Back-to-back continuity is settled (§2a), so once the table reaches the end of
the cycle a `% cycleLen` will be sound.

Unverified lead, low confidence: YUTorah hosts a daily *"Dirshu Daf HaYomi
B'Halacha Mishna Berura (X:Y)"* shiur series whose titles encode siman:se'if
with dates, including simanim in the missing range (lecture 1073335 is titled
162:1). It is Cloudflare-gated here (403 "Just a moment…"). Treat with caution:
the lecture IDs don't order consistently with the Dirshu sequence — 881453 =
242:1 predates 1073335 = 162:1, which is backwards — so it may be a different
track or maggid shiur. Cross-check at best, never a primary source.

## 8. Design decisions worth not re-litigating

- **Calendar key `dirshuDafHalacha`**, matching the existing `dirshuAmudYomi`.
- **Review days emit events.** `{review: true}` with the week's range, `daf` and
  `side` undefined. This is faithful to the luach, which explicitly schedules
  chazarah — but it does add two events per week to a feed. The maintainer was
  told this is easy to drop if unwanted.
- **`null` past the end of data**, not a thrown error — matches the
  `DailyLearning.addCalendar` contract ("return null if no learning that day").
  `RangeError` before the start, via the shared `checkTooEarly`.
- **`dirshuDafHalachaEnd` is exported** so callers can see the data horizon.
- **English render**: `Daf HaYomi B'Halacha: Mishnah Berurah 345:1-3`; review
  days insert `Chazarah` before the book name. **Hebrew** follows the
  `KitzurShulchanAruchEvent` convention — `gematriyaNN` joined by `:`
  (`משנה ברורה שמה:א-ג`), not the luach's own `שמ״ה א׳ - ג׳` styling.
- Translations added to `po/he.po` and `po/ashkenazi.po` for
  `Daf HaYomi B'Halacha`, `Mishnah Berurah`, `Chazarah`.

## 9. Repo conventions used

- `npm test` runs `pretest` → `po2json` + `build:json2js` + `tsc` first. The
  generated `src/*.json.ts` and `src/*.po.ts` are gitignored — never commit them.
- New schedules need wiring in **both** `src/index.ts` (exports) and
  `src/register.ts` (side-effect import), plus a `src/<name>.ts` that calls
  `DailyLearning.addCalendar`.
- `npm run format` before committing; `*.json`, `*.md` and `test/*` are in
  `.prettierignore`.
