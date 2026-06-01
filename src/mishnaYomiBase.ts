import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import mishnayotJson from './mishnayot.json';

const mishnayot = Object.entries(mishnayotJson).map(([k, v]) => ({k, v}));

const cycleStartDate = new Date(1947, 4, 20);
export const mishnaYomiStart = greg.greg2abs(cycleStartDate);

const numMishnayot = 4192;
const numDays = numMishnayot / 2;

/**
 * Describes a mishna to be read
 */
export type MishnaYomi = {
  /** tractate name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan") */
  k: string;
  /** verse (e.g. "2:1") */
  v: string;
};

/**
 * A program of daily learning in which participants study two
 * mishnayot each day in order to finish the entire Mishna in ~6 years.
 *
 * The cycle began on **20 May 1947** (1 Sivan 5707).
 *
 * Construct the index once and call {@link MishnaYomiIndex.lookup
 * .lookup(date)} for each day you need.
 *
 * @example
 * import {MishnaYomiIndex} from '@hebcal/learning/mishnaYomiBase';
 *
 * const index = new MishnaYomiIndex();
 * const reading = index.lookup(new Date(2024, 3, 8));
 * // [{k: 'Nazir', v: '1:6'}, {k: 'Nazir', v: '1:7'}]
 */
export class MishnaYomiIndex {
  private days: MishnaYomi[][];
  /**
   * Builds the in-memory index of all 2,096 days in the cycle.
   * Construction walks every mishna in the Shisha Sidrei; reuse the
   * same instance across many lookups instead of constructing on each
   * call.
   */
  constructor() {
    const tmp = Array<MishnaYomi>(numMishnayot);
    let i = 0;
    for (const element of mishnayot) {
      const tractate = element;
      const v = tractate.v;
      for (let chap = 1; chap <= v.length; chap++) {
        const numv = v[chap - 1];
        for (let verse = 1; verse <= numv; verse++) {
          tmp[i++] = {k: tractate.k, v: `${chap}:${verse}`};
        }
      }
    }
    const days = Array<MishnaYomi[]>(numDays);
    for (let j = 0; j < numDays; j++) {
      const k = j * 2;
      days[j] = [tmp[k], tmp[k + 1]];
    }
    this.days = days;
  }

  /**
   * Returns the two mishnayot to study on the given date.
   *
   * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.)
   *   day number.
   * @returns An array of exactly two {@link MishnaYomi} entries. The
   *   two mishnayot are usually consecutive within the same tractate
   *   but can straddle a tractate boundary on the last day of a
   *   tractate.
   * @throws {RangeError} if `date` is before 20 May 1947.
   * @throws {TypeError} if `date` is not an `HDate`, `Date`, or
   *   finite number.
   */
  lookup(date: HDate | Date | number): MishnaYomi[] {
    const abs = getAbsDate(date);
    checkTooEarly(abs, mishnaYomiStart, 'Mishna Yomi');
    const dayNum = (abs - mishnaYomiStart) % numDays;
    return this.days[dayNum];
  }
}
