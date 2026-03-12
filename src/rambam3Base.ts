import {HDate} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import {
  rambam1cycleLen,
  rambam1Start,
  getChap,
  RambamReading,
  mishnehTorah1,
} from './rambam1Base';

const rambam3cycleLen = rambam1cycleLen / 3;

const mishnehTorah3 = structuredClone(mishnehTorah1);
// The Order of Prayer has an extra day in the 3-day cycle (4 => 5)
mishnehTorah3[15].ch = 5;
// The final 2 chapters of Leavened and Unleavened Bread
// are combined on a single day in the 3-day cycle (9 => 8)
// https://www.chabad.org/dailystudy/rambam.asp?rambamchapters=3&tdate=09/03/2020
//   Chametz U'Matzah - Chapter 8
//   Chametz U'Matzah - Text of the Haggadah (Sefaria calls this Ch 9)
//   Shofar, Sukkah, vLulav - Chapter 1
//   Shofar, Sukkah, vLulav - Chapter 2
mishnehTorah3[20].ch = 8;

/**
 * Calculates Daily Rambam (Mishneh Torah) for 3 chapters a day cycle.
 */
export function dailyRambam3(date: HDate | Date | number): RambamReading[] {
  const cday = getAbsDate(date);
  checkTooEarly(cday, rambam1Start, 'Daily Rambam 3');
  const dno = (cday - rambam1Start) % rambam3cycleLen;
  const idx = dno * 3;
  const r1 = getChap(idx, mishnehTorah3);
  if (r1.name === 'Leavened and Unleavened Bread' && r1.perek === 8) {
    r1.perek = '8-9';
  }
  const r2 = getChap(idx + 1, mishnehTorah3);
  const r3 = getChap(idx + 2, mishnehTorah3);
  return [r1, r2, r3];
}
