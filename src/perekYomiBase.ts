/*
 * Mishnah Perek (chapter) Yomi
 * One chapter per day
 */
import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import mishnayotJson from './mishnayot.json';

const mishnayot = Object.entries(mishnayotJson).map(([k, v]) => ({k, v}));

const cycleLen = 525;
const startDate = new Date(2002, 1, 9);
export const perekYomiStart = greg.greg2abs(startDate);

/**
 * One chapter of the Mishna as scheduled by the Perek Yomi cycle.
 */
export type PerekYomi = {
  /** Mishna tractate name in Sephardic transliteration
   *  (e.g. "Berakhot", "Sotah", "Avot") */
  k: string;
  /** 1-based chapter number within the tractate */
  v: number;
};

/**
 * Calculates the Perek Yomi (Mishna, **one chapter per day**)
 * reading for the given date.
 *
 * The cycle began on Shabbat, **9 February 2002** (27 Sh'vat 5762)
 * and completes the entire Mishna in 525 days (~17 months), then
 * repeats indefinitely.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns A {@link PerekYomi} `{k, v}` — tractate name and chapter
 *   number. Never `null`; the cycle has no skip days.
 * @throws {RangeError} if `date` is before 9 February 2002.
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
 */
export function perekYomi(date: HDate | Date | number): PerekYomi {
  const cday = getAbsDate(date);
  checkTooEarly(cday, perekYomiStart, 'Perek Yomi');
  const dno = (cday - perekYomiStart) % cycleLen;
  let total = dno;
  for (const tractate of mishnayot) {
    const numChaps = tractate.v.length;
    if (total < numChaps) {
      return {k: tractate.k, v: total + 1};
    }
    total -= numChaps;
  }
  throw new Error('Interal error, this code should be unreachable');
}
