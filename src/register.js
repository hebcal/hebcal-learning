import {DailyLearning, Locale} from '@hebcal/core';
import {DafYomiEvent, osday} from './dafyomi';
import {MishnaYomiEvent} from './MishnaYomiEvent';
import {MishnaYomiIndex, mishnaYomiStart} from './mishnaYomi';
import {NachYomiEvent} from './NachYomiEvent';
import {NachYomiIndex, nachYomiStart} from './nachYomi';
import {yerushalmiYomi, YerushalmiYomiEvent, vilna, schottenstein} from './yerushalmi';
import {chofetzChaim, ChofetzChaimEvent, chofetzChaimStart} from './chofetzChaim';
import {dailyRambam1, DailyRambamEvent, rambam1Start} from './rambam';
import {shemiratHaLashon, ShemiratHaLashonEvent, shemiratHaLashonStart} from './shemiratHaLashon';
import {dailyPsalms, PsalmsEvent} from './psalms';
import poHe from './he.po.json';
import poAshkenazi from './ashkenazi.po.json';

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

Locale.addTranslations('he', poHe);
Locale.addTranslations('h', poHe);
Locale.addTranslations('ashkenazi', poAshkenazi);
Locale.addTranslations('a', poAshkenazi);
