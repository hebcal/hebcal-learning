import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import tanakhNumChap from './tanakhNumChap.json';

// Nach Yomi covers Nevi'im and Ketuvim — all books after the 5 Torah books.
const nach = (Object.entries(tanakhNumChap) as Array<[string, number]>).slice(5);

const cycleStartDate = new Date(2007, 10, 1);
export const nachYomiStart = greg.greg2abs(cycleStartDate);

const numChapters = 742;

/**
 * Describes a chapter to be read
 */
export type NachYomi = {
  /** book name in English transliteration (e.g. "Joshua", "Song of Songs") */
  k: string;
  /** chapter number (e.g. 2) */
  v: number;
};

/**
 * A daily regimen of learning the books of Nevi'im (Prophets) and
 * Ketuvim (Writings), one chapter per day.
 *
 * The current cycle began on **1 November 2007** (20 Cheshvan 5768)
 * and completes Nach in 742 days (~2 years), then repeats
 * indefinitely.
 *
 * Construct the index once and call {@link NachYomiIndex.lookup
 * .lookup(date)} for each day you need.
 *
 * @example
 * import {NachYomiIndex} from '@hebcal/learning/nachYomiBase';
 *
 * const index = new NachYomiIndex();
 * console.log(index.lookup(new Date(2024, 3, 8)));
 * // {k: 'I Samuel', v: 23}
 */
export class NachYomiIndex {
  private days: NachYomi[];
  /**
   * Builds the in-memory index of all 742 chapters in the cycle.
   * Reuse the same instance across many lookups.
   */
  constructor() {
    const days = Array<NachYomi>(numChapters);
    let i = 0;
    for (const element of nach) {
      const book = element[0];
      const chapters = element[1];
      for (let chap = 1; chap <= chapters; chap++) {
        days[i++] = {k: book, v: chap};
      }
    }
    this.days = days;
  }

  /**
   * Returns the chapter of Nach to study on the given date.
   *
   * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.)
   *   day number.
   * @returns A {@link NachYomi} `{k, v}` — book name and chapter
   *   number. Never `null`; the cycle has no skip days.
   * @throws {RangeError} if `date` is before 1 November 2007.
   * @throws {TypeError} if `date` is not an `HDate`, `Date`, or
   *   finite number.
   */
  lookup(date: HDate | Date | number): NachYomi {
    const abs = getAbsDate(date);
    checkTooEarly(abs, nachYomiStart, 'Nach Yomi');
    const dayNum = (abs - nachYomiStart) % numChapters;
    return this.days[dayNum];
  }
}
