import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common.js';
import amudJson from './amudim.json.js';

// Cycle began on 1 Cheshvan 5784 = October 16, 2023
const startDate = new Date(2023, 9, 16);
export const dirshuAmudYomiStart = greg.greg2abs(startDate);

type AmudEntry = {
  name: string;
  amudim: number;
};

export const shas: AmudEntry[] = Object.entries(amudJson).map(
  ([name, amudim]) => ({name, amudim})
);
const totalAmudim = shas.reduce((s, a) => s + a.amudim, 0);

/**
 * One amud (side of a page) of the Babylonian Talmud as scheduled by
 * the Dirshu Amud HaYomi program.
 */
export type DirshuAmudYomi = {
  /** Tractate name in Sephardic transliteration (e.g. `"Berachot"`,
   *  `"Baba Metzia"`). */
  name: string;
  /** Page number (daf), starting from `2` for the first amud of each
   *  tractate (the convention used for Talmud Bavli citations). */
  amud: number;
  /** Side of the page: `"a"` (recto) or `"b"` (verso). */
  side: 'a' | 'b';
};

/**
 * Calculates the Dirshu Amud HaYomi for a given date — one amud
 * (half-page) of the Babylonian Talmud per day, taking roughly twice
 * as long as the standard Daf Yomi cycle.
 *
 * The cycle began on Monday, **16 October 2023** (1 Cheshvan 5784)
 * and continues indefinitely, restarting from Berachot 2a after the
 * final amud of Niddah.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns A {@link DirshuAmudYomi} `{name, amud, side}`. Never
 *   `null`; the cycle has no skip days.
 * @throws {RangeError} if `date` is before 16 October 2023.
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
 */
export function calculateDirshuAmud(
  date: HDate | Date | number
): DirshuAmudYomi {
  const cday = getAbsDate(date);
  checkTooEarly(cday, dirshuAmudYomiStart, 'Dirshu Amud HaYomi');
  const dno = (cday - dirshuAmudYomiStart) % totalAmudim;

  let total = 0;
  for (const tractate of shas) {
    if (dno < total + tractate.amudim) {
      const idx = dno - total;
      const amud = 2 + Math.floor(idx / 2);
      const side: 'a' | 'b' = idx % 2 === 0 ? 'a' : 'b';
      return {name: tractate.name, amud, side};
    }
    total += tractate.amudim;
  }
  throw new Error('Internal error: Dirshu Amud HaYomi calculation failed');
}
