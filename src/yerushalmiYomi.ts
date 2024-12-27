import {HDate, DailyLearning} from '@hebcal/core';
import {schottenstein, vilna, yerushalmiYomi} from './yerushalmiBase';
import {YerushalmiYomiEvent} from './YerushalmiYomiEvent';

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
