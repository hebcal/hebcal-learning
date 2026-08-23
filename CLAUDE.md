# CLAUDE.md — working notes for `@hebcal/learning`

Daily Jewish learning schedules (Daf Yomi, Mishna Yomi, Rambam, 929, …),
published as a plugin for the `DailyLearning` registry in `@hebcal/core`.
`README.md` is the user-facing list of schedules; this file is for working in
the repo.

Long-form notes for one schedule live in **`dirshuDafHalacha.md`** — Dirshu's
Daf HaYomi B'Halacha is the only calendar here that is a finite transcribed
table rather than a perpetual cycle, and it has a lot of provenance behind it.
Read that file before touching `src/dirshuDafHalacha*` or `tools/dirshu-luach/`.

---

## Layout

```
src/       <name>Base.ts  pure calculation, exports the lookup function
           <Name>Event.ts hebcal Event subclass: render / renderBrief / url
           <name>.ts      side-effect module: DailyLearning.addCalendar(...)
           <name>.json    lookup table, where the cycle needs one
           common.ts      getAbsDate, checkTooEarly, formatBeginEndRange,
                          gematriyaNN, sefariaUrl, the LearningDate type
           wrapSchedule.ts the registration helper the <name>.ts files call
           index.ts       public exports (+ imports register.js)
           register.ts    side-effect imports of every <name>.ts
           locale.ts      wires po/*.po into Locale
po/        he.po, ashkenazi.po
test/      vitest specs, one per schedule plus cross-cutting suites
tools/     one-off extraction pipelines (currently only dirshu-luach)
```

Every schedule follows the same three-module split. `*Base.ts` knows nothing
about hebcal `Event`s and can be imported on its own (README documents these as
the "low-level APIs"); `*Event.ts` renders; `<name>.ts` registers — almost
always through the `wrapSchedule()` helper (see below). `wrapSchedule.ts` is
deliberately *not* part of `common.ts`: it pulls in `DailyLearning`/`Event`, and
`common.ts` must stay importable by the pure `*Base.ts` modules without dragging
the registry in.

## Adding or changing a schedule

1. `src/<name>Base.ts` — the calculation. Take a `LearningDate` (an `HDate`, a
   `Date`, or an R.D. number), normalise with `getAbsDate`, guard the start
   with `checkTooEarly`, and export the start date as `<name>Start`.
2. `src/<Name>Event.ts` — extend `DailyLearningEvent`. Override `category`,
   `render`, `renderBrief`, `url` and `getCategories`. Use
   `Locale.isHebrewLocale(locale)` to branch on Hebrew, `gematriyaNN` for
   Hebrew numerals, `sefariaUrl` to build links.
3. `src/<name>.ts` — register with
   `wrapSchedule('<name>', startAbs, (hd, il) => …)`. The helper installs the
   `abs < startAbs` guard and builds the `HDate` start marker, so the callback
   just constructs and returns the day's `Event`. The `*Base.ts` calculators
   accept an `HDate` (a `LearningDate`), so pass `hd` straight through rather
   than `hd.abs()`; `il` is the Israel flag, needed only by `pirkeiAvotSummer`. **Return `null` when
   there is no learning that day** (a gap in the cycle, a bounded table's data
   horizon); that is the registry's contract. Pass `undefined` for `startAbs`
   when the schedule has no start bound (Psalms, Pirkei Avot, Kitzur Shulchan
   Aruch). A file may call `wrapSchedule()` more than once (see `dafWeekly.ts`,
   `yerushalmiYomi.ts`). Reach for a raw `DailyLearning.addCalendar(...)` only
   if some edge case truly does not fit the helper — none currently do.
4. Wire it into **both** `src/index.ts` (exports) and `src/register.ts`
   (side-effect import). A schedule missing from `register.ts` silently fails
   to appear in `import '@hebcal/learning'`.
5. Add translations to `po/he.po` and `po/ashkenazi.po` for any new
   user-visible string.
6. Add `test/<name>.spec.ts` and a line to `README.md`.

## Conventions

- **R.D. day numbers** are the internal currency. `abs % 7 === 0` is a Sunday.
  Prefer closed-form arithmetic on the R.D. number to walking forward from the
  epoch: `test/cycleRollover.spec.ts` exists because three calendars used to
  walk, and both grew without bound for far-future dates and drifted.
- **`test/calendarDifferential.spec.ts`** folds every day of the supported
  range into a checksum generated from the pre-optimisation implementation. If
  you change cycle math and it fails, you changed output for at least one day
  in ~200 years — find out which before updating the constant.
- **Generated files are gitignored — never commit them.** `npm run build`
  writes `src/*.json.ts` (from `src/*.json`) and `src/*.po.ts` (from `po/*.po`);
  TypeScript imports the `.json.ts` form, so a new `src/<name>.json` needs no
  build-script change but does need a build before `tsc` will resolve it.
- `npm test` runs `pretest` → `build` (`po2json` + `build:json2js` + `tsc`)
  first, so a type error fails the test run.
- **Formatting**: `npm run format` (prettier) and `npm run lint` (oxlint), or
  `npm run fix` for both. `*.json`, `*.yml`, `*.md` and `test/*` are in
  `.prettierignore` — do not reformat them. Prettier will happily reformat
  files that were already unformatted on `main`; check `git diff --stat` before
  committing and revert unrelated churn.
- **CI** (`.github/workflows/node.js.yml`) runs `npm ci && npm run build && npm
  test` on Node 22, 24 and 26.

## Two kinds of schedule

Most calendars here are **perpetual**: a start date plus arithmetic, optionally
with a fixed table for one cycle's worth of content (`bavli.json`,
`mishnayot.json`, `arukhHaShulchanYomi.json`, `kitzurSa.json`). They answer for
any date from their start onward.

`dirshuDafHalacha` is the exception: a **bounded table** with a data horizon,
which returns `null` past the end. Both the timing rule and the cycle boundary
are known, but the cycles do not repeat exactly, so it cannot be closed with a
modulo. The evidence is in the file header of `src/dirshuDafHalachaBase.ts`;
the full story, the sources and the extraction pipeline are in
`dirshuDafHalacha.md`.
