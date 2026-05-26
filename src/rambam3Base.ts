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
 * Calculates the Daily Rambam (Mishneh Torah) reading for the
 * **3 chapters a day** cycle.
 *
 * The cycle shares its 29 April 1984 start date with the
 * {@link dailyRambam1 1-chapter cycle} but completes the entire
 * Mishneh Torah in 339 days (~11 months) — about three times faster.
 * The cycle differs from the 1-chapter schedule in two places to keep
 * the three daily chapters logically grouped: "The Order of Prayer"
 * has an extra day, and the final two chapters of "Leavened and
 * Unleavened Bread" are combined into a single day.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns An array of exactly three {@link RambamReading} objects, in
 *   the order they are studied during the day. Adjacent readings may
 *   share a `name` when all three chapters fall within the same
 *   section of the Mishneh Torah; the {@link DailyRambam3Event}
 *   wrapper collapses these for display.
 * @throws {RangeError} if `date` is before 29 April 1984 (the start of
 *   the cycle).
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
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
