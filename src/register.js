import {DailyLearning} from '@hebcal/core';
import {DafYomiEvent, osday} from './dafyomi.js';
import {MishnaYomiEvent} from './MishnaYomiEvent.js';
import {MishnaYomiIndex, mishnaYomiStart} from './mishnaYomi.js';
import {NachYomiEvent} from './NachYomiEvent.js';
import {NachYomiIndex, nachYomiStart} from './nachYomi.js';
import {yerushalmiYomi, YerushalmiYomiEvent, vilna, schottenstein} from './yerushalmi.js';
import {chofetzChaim, ChofetzChaimEvent, chofetzChaimStart} from './chofetzChaim.js';
import {dailyRambam1, DailyRambamEvent, rambam1Start} from './rambam.js';
import {shemiratHaLashon, ShemiratHaLashonEvent, shemiratHaLashonStart} from './shemiratHaLashon.js';
import {dailyPsalms, PsalmsEvent} from './psalms.js';
import {dafWeekly, DafWeeklyEvent, dafWeeklyStart} from './dafWeekly.js';
import {tanakhYomi, tanakhYomiStart, TanakhYomiEvent} from './tanakhYomi.js';
import './locale.js';

DailyLearning.addCalendar('dafYomi', function(hd) {
  const abs = hd.abs();
  if (abs < osday) {
    return null;
  }
  return new DafYomiEvent(hd);
});

const mishnaYomiIndex = new MishnaYomiIndex();
DailyLearning.addCalendar('mishnaYomi', function(hd) {
  const abs = hd.abs();
  if (abs < mishnaYomiStart) {
    return null;
  }
  const mishnaYomi = mishnaYomiIndex.lookup(abs);
  return new MishnaYomiEvent(hd, mishnaYomi);
});

const nachYomiIndex = new NachYomiIndex();
DailyLearning.addCalendar('nachYomi', function(hd) {
  const abs = hd.abs();
  if (abs < nachYomiStart) {
    return null;
  }
  const nachYomi = nachYomiIndex.lookup(abs);
  return new NachYomiEvent(hd, nachYomi);
});

DailyLearning.addCalendar('yerushalmi-vilna', function(hd) {
  const abs = hd.abs();
  if (abs < vilna.startAbs) {
    return null;
  }
  const daf = yerushalmiYomi(abs, vilna);
  if (daf === null) {
    return null;
  }
  return new YerushalmiYomiEvent(hd, daf);
});

DailyLearning.addCalendar('yerushalmi-schottenstein', function(hd) {
  const abs = hd.abs();
  if (abs < schottenstein.startAbs) {
    return null;
  }
  const daf = yerushalmiYomi(abs, schottenstein);
  if (daf === null) {
    return null;
  }
  return new YerushalmiYomiEvent(hd, daf);
});

DailyLearning.addCalendar('chofetzChaim', function(hd) {
  if (hd.abs() < chofetzChaimStart) {
    return null;
  }
  const reading = chofetzChaim(hd);
  return new ChofetzChaimEvent(hd, reading);
});

DailyLearning.addCalendar('rambam1', function(hd) {
  if (hd.abs() < rambam1Start) {
    return null;
  }
  const reading = dailyRambam1(hd);
  return new DailyRambamEvent(hd, reading);
});

DailyLearning.addCalendar('shemiratHaLashon', function(hd) {
  if (hd.abs() < shemiratHaLashonStart) {
    return null;
  }
  const reading = shemiratHaLashon(hd);
  return new ShemiratHaLashonEvent(hd, reading);
});

DailyLearning.addCalendar('psalms', function(hd) {
  const reading = dailyPsalms(hd);
  return new PsalmsEvent(hd, reading);
});

DailyLearning.addCalendar('dafWeekly', function(hd) {
  const abs = hd.abs();
  if (abs < dafWeeklyStart) {
    return null;
  }
  const daf = dafWeekly(abs);
  return new DafWeeklyEvent(hd, daf);
});

DailyLearning.addCalendar('dafWeeklySunday', function(hd) {
  const abs = hd.abs();
  if (abs < dafWeeklyStart) {
    return null;
  }
  // Only return the weekly daf on Sundays
  const dow = hd.getDay();
  if (dow !== 0) {
    return null;
  }
  const daf = dafWeekly(abs);
  return new DafWeeklyEvent(hd, daf);
});

DailyLearning.addCalendar('tanakhYomi', function(hd) {
  const abs = hd.abs();
  if (abs < tanakhYomiStart) {
    return null;
  }
  const daf = tanakhYomi(abs);
  if (daf === null) {
    return null;
  }
  return new TanakhYomiEvent(hd, daf);
});
