import {HDate, greg} from '@hebcal/hdate';
import {DafPage} from './DafPage.js';
import {checkTooEarly, getAbsDate} from './common.js';
import {findDaf, shas0} from './dafYomiBase.js';

const startDate = new Date(2005, 2, 6);
export const dafWeeklyStart = greg.greg2abs(startDate);

const numDays = 2711 * 7;

/**
 * Calculates the **Daf-a-Week** Talmud page for the given date.
 *
 * In this slower schedule the same daf is studied for an entire week;
 * one full cycle through the Babylonian Talmud takes ~52 years. The
 * cycle began on Sunday, **6 March 2005** (25 Adar I 5765).
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number. The function returns the same {@link DafPage} for any day
 *   of the same week; the `dafWeeklySunday` calendar registered with
 *   `DailyLearning` exposes only the Sunday occurrence.
 * @returns A {@link DafPage} for that week (`name` + `blatt`). Never
 *   `null` once the cycle has begun.
 * @throws {RangeError} if `date` is before 6 March 2005.
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
 */
export function dafWeekly(date: HDate | Date | number): DafPage {
  const abs = getAbsDate(date);
  checkTooEarly(abs, dafWeeklyStart, 'Daf-a-Week');

  const dayNum = (abs - dafWeeklyStart) % numDays;
  const weekNum = Math.trunc(dayNum / 7);

  return findDaf(shas0, weekNum);
}
