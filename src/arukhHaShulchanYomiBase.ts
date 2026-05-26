import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import ahsyJson from './arukhHaShulchanYomi.json';

/**
 * Describes a daily reading of the Arukh HaShulchan
 */
export type AhSYomiReading = {
  /**
   * section name in Sephardic transliteration
   * (e.g. "Orach Chaim", "Yoreh De'ah", "Even HaEzer", "Choshen Mishpat")
   */
  k: string;
  /** verse range (e.g. "8.20-9.4" or "14.2-9") */
  v: string;
};

const cycleLen = ahsyJson.length; // 1719

const cycleStartDate = new Date(2020, 4, 29);
export const ahsyStart = greg.greg2abs(cycleStartDate);

const sections = [
  '',
  'Orach Chaim',
  "Yoreh De'ah",
  'Even HaEzer',
  'Choshen Mishpat',
];

/**
 * Calculates the Arukh HaShulchan Yomi reading for the given date.
 *
 * Daily study of the Arukh HaShulchan, a work of halacha written by
 * Yechiel Michel Epstein. The current cycle began on Friday,
 * **29 May 2020** (6 Sivan 5780) and completes the entire Arukh
 * HaShulchan in 1,719 days (~4 years 8 months), then repeats
 * indefinitely.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns An {@link AhSYomiReading} `{k, v}` describing the section
 *   and verse range for that day. Always returns a reading once the
 *   cycle has begun (the schedule has no skip days).
 * @throws {RangeError} if `date` is before 29 May 2020 (the start of
 *   the cycle).
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
 */
export function arukhHaShulchanYomi(
  date: HDate | Date | number
): AhSYomiReading {
  const cday = getAbsDate(date);
  checkTooEarly(cday, ahsyStart, 'Arukh HaShulchan Yomi');
  const dayNum = (cday - ahsyStart) % cycleLen;
  const [s, v] = (ahsyJson as [number, string][])[dayNum];
  return {k: sections[s], v};
}
