import {greg2abs} from '@hebcal/hdate';
import {DafPage} from './DafPage.js';
import {checkTooEarly, getAbsDate, LearningDate} from './common.js';
import {
  DAF_OFFSETS,
  NEW_CYCLE_LENGTH,
  TRACTATE_COUNT,
  TRACTATE_LAST_DAF,
  TRACTATE_NAMES,
} from './dafYomiBase.js';

const startDate = new Date(2005, 2, 6);
export const dafWeeklyStart = greg2abs(startDate);

const numDays = NEW_CYCLE_LENGTH * 7;

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
export function dafWeekly(date: LearningDate): DafPage {
  const abs = getAbsDate(date);
  checkTooEarly(abs, dafWeeklyStart, 'Daf-a-Week');

  const dayNum = (abs - dafWeeklyStart) % numDays;
  const weekNum = Math.trunc(dayNum / 7);

  // Walk the masechtos, accumulating days, until the cycle offset falls inside one.
  let weeksSoFar = 0;
  for (let index = 0; index < TRACTATE_COUNT; index++) {
    weeksSoFar += TRACTATE_LAST_DAF[index] - 1;
    if (weekNum < weeksSoFar) {
      const daf = TRACTATE_LAST_DAF[index] + 1 - (weeksSoFar - weekNum) + (DAF_OFFSETS[index] ?? 0);
      const tractate = TRACTATE_NAMES[index];
      return new DafPage(tractate, daf);
    }
  }

  // Unreachable: the masechta lengths sum to exactly the cycle length.
  throw new Error('dafWeekly calculation fell through; masechta table is inconsistent.');
}
