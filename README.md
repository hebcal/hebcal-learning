# hebcal-learning
Javascript Daily Learning Schedules

[![Build Status](https://github.com/hebcal/hebcal-learning/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-learning/actions/workflows/node.js.yml)

Supports several learning schedules

* Daf Yomi (Babylonian Talmud / Bavli) - `dafYomi`
* Mishna Yomi - `mishnaYomi`
* Nach Yomi - `nachYomi`
* Tanakh Yomi - `tanakhYomi`
* Psalms / Tehillim (30 day cycle) - `psalms`
* Yerushalmi Yomi (Jerusalem Talmud)
  * Vilna edition - `yerushalmi-vilna`
  * Schottenstein edition - `yerushalmi-schottenstein`
* Daily Rambam (Mishneh Torah)
  * 1 chapter a day cycle - `rambam1`
* Chofetz Chaim - `chofetzChaim`
* Sefer Shemirat HaLashon - `shemiratHaLashon`
* Daf-a-Week
  * Daily - `dafWeekly`
  * Sundays only - `dafWeeklySunday`
* Pirkei Avot studied on Shabbat between Pesach and Rosh Hashana - `pirkeiAvotSummer`

## Installation
```bash
$ npm install @hebcal/learning
```

## Synopsis
```javascript
import {HDate, DailyLearning} from '@hebcal/core';
import '@hebcal/learning';

const dt = new Date();
const hd = new HDate(dt);
const ev = DailyLearning.lookup('dafYomi', hd);
console.log(dt.toLocaleDateString(), hd.toString(), ev.render('en'));
```

## [API Documentation](https://hebcal.github.io/api/learning/index.html)
