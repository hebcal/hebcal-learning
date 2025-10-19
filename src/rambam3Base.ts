import {HDate} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import {
  rambam1cycleLen,
  rambam1Start,
  getChap,
  RambamReading,
} from './rambam1Base';

const rambam3cycleLen = rambam1cycleLen / 3;

/**
 * Returns true if all 3 chapters are from the same section
 */
export function canCombineReading(r: RambamReading[]): boolean {
  return r[0].name === r[1].name && r[1].name === r[2].name;
}

/**
 * If all three chapters are from the same section,
 * we can combine into a single reading with a chapter range
 */
export function combineReading(reading: RambamReading[]): RambamReading {
  const name = reading[0].name;
  const perek0 = reading[0].perek;
  const perek2 = reading[2].perek as string;
  let perek;
  if (typeof perek0 === 'number') {
    perek = `${perek0}-${perek2}`;
  } else {
    const first = perek0.split('-');
    const last = perek2.split('-');
    perek = `${first[0]}-${last[1]}`;
  }
  return {name, perek};
}

/**
 * Calculates Daily Rambam (Mishneh Torah) for 1 chapter a day cycle.
 */
export function dailyRambam3(date: HDate | Date | number): RambamReading[] {
  const cday = getAbsDate(date);
  checkTooEarly(cday, rambam1Start, 'Daily Rambam 3');
  const dno = (cday - rambam1Start) % rambam3cycleLen;
  const idx = dno * 3;
  return [getChap(idx), getChap(idx + 1), getChap(idx + 2)];
}
