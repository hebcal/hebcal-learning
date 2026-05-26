# @hebcal/learning
Javascript Daily Learning Schedules

[![Build Status](https://github.com/hebcal/hebcal-learning/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-learning/actions/workflows/node.js.yml)

This package provides multiple daily learning schedules
used by the [DailyLearning](https://hebcal.github.io/api/core/classes/DailyLearning.html) API provided by
[@hebcal/core](https://www.npmjs.com/package/@hebcal/core)

## Learning Schedules

### Talmud and Mishna

#### Daf Yomi
Daily regimen of learning the Babylonian Talmud. This cycle takes approximately 7½ years to complete.

* Daily - `dafYomi`
* Amud Yomi (Dirshu) - `dirshuAmudYomi`
* Daf-a-Week, a page of Babylonian Talmud a week - `dafWeekly`
* Daf-a-Week, only on Sundays - `dafWeeklySunday`

#### Mishna Yomi
* Two mishnayot each day - `mishnaYomi`
* Perek Yomi (one chapter per day) - `perekYomi`

#### Yerushalmi Yomi (Jerusalem Talmud)
* Vilna edition - `yerushalmi-vilna`
* Schottenstein edition - `yerushalmi-schottenstein`

### Tanakh

#### Nach Yomi - `nachYomi`
daily regimen of learning the books of Nevi'im (Prophets) and Ketuvim (Writings)

#### Tanakh Yomi - `tanakhYomi`
learning cycle for completing Tanakh annually. On Shabbat, each Torah portion is recited. On weekdays, Prophets and Writings are recited according to the ancient Masoretic division of sedarim. This cycle is completed each year

#### Psalms / Tehillim (30 day cycle) - `psalms`
Daily study of a few chapters from the 150-chapter book of Psalms (Tehillim). The entire book is completed on the final day of each Hebrew month. On months with 29 days, the 30th portion is combined with the 29th portion

#### 929 - `929`
The 929 Project (officially called 929: Tanakh B'yachad or "Bible Together") is a synchronized, chapter-a-day reading program. Named after the 929 chapters in the Hebrew Bible (Tanakh), it challenges participants to read one chapter a day, five days a week, covering the entire text in about 3.5 years

### Halacha

#### Daily Rambam
Maimonides’ Mishneh Torah legal code
* 1 chapter a day cycle - `rambam1`
* 3 chapters a day cycle - `rambam3`

#### Sefer Hamitzvos - `seferHaMitzvot`
Daily Mitzvah (Rambam)

#### Arukh HaShulchan Yomi - `arukhHaShulchanYomi`
Daily study of the Arukh HaShulchan Yomi, a work of halacha written by Yechiel Michel Epstein. The work attempts to be a clear, organized summary of the sources for each chapter of the Shulchan Arukh and its commentaries, with special emphasis on the positions of the Jerusalem Talmud and Maimonides

#### Kitzur Shulchan Aruch Yomi - `kitzurShulchanAruch`
Summary of the Shulchan Aruch of Rabbi Yosef Karo,
authored by Rabbi Shlomo Ganzfried in 1864.

### Ethics

#### Sefer Chofetz Chaim - `chofetzChaim`
deals with the Jewish ethics and laws of speech

#### Sefer Shemirat HaLashon - `shemiratHaLashon`

#### Pirkei Avot - `pirkeiAvotSummer`
“Ethics of the Fathers”, studied one chapter on each Shabbat of the summer between Passover and Rosh Hashanah

## Installation
```bash
$ npm install @hebcal/learning
```

## Synopsis
```javascript
import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import '@hebcal/learning';

const dt = new Date();
const hd = new HDate(dt);
const ev = DailyLearning.lookup('dafYomi', hd);
console.log(dt.toLocaleDateString(), hd.toString(), ev.render('en'));
```

## Selective imports (smaller bundles)

The top-level `import '@hebcal/learning'` registers *all* of the calendars
listed above with `DailyLearning`, which pulls every cycle's lookup tables
into your bundle. If you only need a few calendars, import them
individually instead. Each module registers exactly one calendar (or two,
in the case of Daf-a-Week) with `DailyLearning` as a side-effect of being
imported, and you call them through the same `DailyLearning.lookup` API:

```javascript
import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import '@hebcal/learning/rambam3';
import '@hebcal/learning/dafYomi';

const hd = new HDate(new Date(2024, 3, 8));
console.log(DailyLearning.lookup('rambam3', hd).render('en'));
console.log(DailyLearning.lookup('dafYomi', hd).render('en'));
```

The module names match the source files in `src/` (for example
`@hebcal/learning/dafYomi`, `@hebcal/learning/rambam1`,
`@hebcal/learning/yerushalmiYomi`, `@hebcal/learning/929`).
Tree-shaking bundlers will then drop the unused calendars.

## Low-level APIs (skip the Event wrappers)

If you don't need a hebcal `Event` (with `render()`, `url()`, `memo`,
iCalendar categories, etc.), you can call the underlying calculation
functions directly. They accept an `HDate`, a JavaScript `Date`, or an
absolute (R.D.) day number, and return a plain data object you can
interpret yourself:

```javascript
import {dailyRambam3} from '@hebcal/learning/rambam3Base';

// Returns an array of 3 RambamReading objects: {name, perek}
const readings = dailyRambam3(new Date(2024, 3, 8));
// [
//   {name: 'Foreign Worship and Customs of the Nations', perek: 1},
//   {name: 'Foreign Worship and Customs of the Nations', perek: 2},
//   {name: 'Foreign Worship and Customs of the Nations', perek: 3},
// ]
```

Each calendar's lookup function lives in its `*Base` module — for
example `dailyRambam1`, `dailyRambam3`, `dafWeekly`, `calculate929`,
`calculateDirshuAmud`, `arukhHaShulchanYomi`, `yerushalmiYomi`,
`kitzurShulchanAruch`, `seferHaMitzvot`, `chofetzChaim`,
`shemiratHaLashon`, `dailyPsalms`, `perekYomi`, `pirkeiAvot`,
`tanakhYomi`, plus the `DafYomi`, `MishnaYomiIndex` and `NachYomiIndex`
classes. See the per-function JSDoc for the exact return shape and the
conditions under which a function throws (date before the cycle began,
invalid date type) or returns `null` (no reading on this date).

## [API Documentation](https://hebcal.github.io/api/learning/index.html)
