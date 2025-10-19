import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {schottenstein, vilna, yerushalmiYomi} from './yerushalmiBase';
import {YerushalmiYomiEvent} from './YerushalmiYomiEvent';

function wrapperVilna(hd: HDate): YerushalmiYomiEvent | null {
  const abs = hd.abs();
  if (abs < vilna.startAbs) {
    return null;
  }
  const daf = yerushalmiYomi(abs, vilna);
  if (daf === null) {
    return null;
  }
  return new YerushalmiYomiEvent(hd, daf);
}

DailyLearning.addCalendar(
  'yerushalmi-vilna',
  wrapperVilna,
  new HDate(vilna.startAbs)
);

function wrapperSchottenstein(hd: HDate): YerushalmiYomiEvent | null {
  const abs = hd.abs();
  if (abs < schottenstein.startAbs) {
    return null;
  }
  const daf = yerushalmiYomi(abs, schottenstein);
  return new YerushalmiYomiEvent(hd, daf!);
}

DailyLearning.addCalendar(
  'yerushalmi-schottenstein',
  wrapperSchottenstein,
  new HDate(schottenstein.startAbs)
);
