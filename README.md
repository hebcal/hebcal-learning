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

## [API Documentation](https://hebcal.github.io/api/learning/index.html)
