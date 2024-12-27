import {HDate, DailyLearning} from '@hebcal/core';
import {MishnaYomiEvent} from './MishnaYomiEvent';
import {NachYomiEvent} from './NachYomiEvent';
import {chofetzChaim, chofetzChaimStart} from './chofetzChaimBase';
import {ChofetzChaimEvent} from './ChofetzChaimEvent';
import {dafWeekly, dafWeeklyStart} from './dafWeeklyBase';
import {DafWeeklyEvent} from './DafWeeklyEvent';
import {osday} from './dafYomiBase';
import {DafYomiEvent} from './DafYomiEvent';
import './locale';
import {MishnaYomiIndex, mishnaYomiStart} from './mishnaYomiBase';
import {NachYomiIndex, nachYomiStart} from './nachYomiBase';
import {pirkeiAvot} from './pirkeiAvotBase';
import {PirkeiAvotSummerEvent} from './PirkeiAvotSummerEvent';
import {dailyPsalms} from './psalmsBase';
import {PsalmsEvent} from './PsalmsEvent';
import {dailyRambam1, rambam1Start} from './rambam1Base';
import {DailyRambamEvent} from './DailyRambamEvent';
import {shemiratHaLashon, shemiratHaLashonStart} from './shemiratHaLashonBase';
import {ShemiratHaLashonEvent} from './ShemiratHaLashonEvent';
import {TanakhYomiEvent, tanakhYomi, tanakhYomiStart} from './tanakhYomiBase';
import {schottenstein, vilna, yerushalmiYomi} from './yerushalmiBase';
import {YerushalmiYomiEvent} from './YerushalmiYomiEvent';
import './arukhHaShulchanYomi';

DailyLearning.addCalendar('dafYomi', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < osday) {
    return null;
  }
  return new DafYomiEvent(hd);
});

const mishnaYomiIndex = new MishnaYomiIndex();
DailyLearning.addCalendar('mishnaYomi', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < mishnaYomiStart) {
    return null;
  }
  const mishnaYomi = mishnaYomiIndex.lookup(abs);
  return new MishnaYomiEvent(hd, mishnaYomi);
});

const nachYomiIndex = new NachYomiIndex();
DailyLearning.addCalendar('nachYomi', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < nachYomiStart) {
    return null;
  }
  const nachYomi = nachYomiIndex.lookup(abs);
  return new NachYomiEvent(hd, nachYomi);
});

DailyLearning.addCalendar('yerushalmi-vilna', (hd: HDate) => {
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

DailyLearning.addCalendar('yerushalmi-schottenstein', (hd: HDate) => {
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

DailyLearning.addCalendar('chofetzChaim', (hd: HDate) => {
  if (hd.abs() < chofetzChaimStart) {
    return null;
  }
  const reading = chofetzChaim(hd);
  return new ChofetzChaimEvent(hd, reading);
});

DailyLearning.addCalendar('rambam1', (hd: HDate) => {
  if (hd.abs() < rambam1Start) {
    return null;
  }
  const reading = dailyRambam1(hd);
  return new DailyRambamEvent(hd, reading);
});

DailyLearning.addCalendar('shemiratHaLashon', (hd: HDate) => {
  if (hd.abs() < shemiratHaLashonStart) {
    return null;
  }
  const reading = shemiratHaLashon(hd);
  return new ShemiratHaLashonEvent(hd, reading);
});

DailyLearning.addCalendar('psalms', (hd: HDate) => {
  const reading = dailyPsalms(hd);
  return new PsalmsEvent(hd, reading);
});

DailyLearning.addCalendar('dafWeekly', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < dafWeeklyStart) {
    return null;
  }
  const daf = dafWeekly(abs);
  return new DafWeeklyEvent(hd, daf);
});

DailyLearning.addCalendar('dafWeeklySunday', (hd: HDate) => {
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

DailyLearning.addCalendar('tanakhYomi', (hd: HDate) => {
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

DailyLearning.addCalendar('pirkeiAvotSummer', (hd: HDate, il: boolean) => {
  const reading = pirkeiAvot(hd, il);
  if (reading === null) {
    return null;
  }
  return new PirkeiAvotSummerEvent(hd, reading);
});
