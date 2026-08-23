/**
 * Daf Yomi calculator.
 *
 * A TypeScript port of `daf.el` by Bob Newell (first written Bismarck, North
 * Dakota, April 24 1998; last revised Honolulu, Hawai'i, December 14 2012),
 * which was released by its author into the public domain. This port is
 * likewise public domain.
 *
 * The algorithm walks the fixed sequence of masechtos, using the absolute
 * ("Rata Die") day number of the requested date to find the offset into the
 * current cycle. Cycles 1-7 ran 2702 days (Shekalim was learned as 13 blatt);
 * from cycle 8 onward they run 2711 days (Shekalim expanded to 22 blatt).
 *
 * One deviation from the original: `daf.el` gave Tamid nine dafim (26-34) and
 * Midos three (35-37). The accepted division is Tamid 26-33 and Midos 34-37, so
 * the original named the wrong masechta on one day of every cycle. The cycle
 * length is unchanged, so no other day is affected.
 */

import {greg2abs} from '@hebcal/hdate';
import {DafPage} from './DafPage.js';
import {LearningDate, checkTooEarly, getAbsDate} from './common.js';
import bavliJson from './bavli.json.js';

/** Masechtos in Daf Yomi order. */
const TRACTATE_NAMES: readonly string[] = Object.keys(bavliJson);

/**
 * Last daf of each masechta. A masechta of N blatt occupies N-1 days, since
 * pagination starts at daf 2.
 */
const TRACTATE_LAST_DAF: readonly number[] = Object.values<number>(bavliJson);

const TRACTATE_COUNT = TRACTATE_LAST_DAF.length;

/** Index of Shekalim, whose length differs between the old and new cycles. */
const SHEKALIM_INDEX = 4;
const SHEKALIM_OLD_LAST_DAF = 13;

const LAST_DAF_OLD = [...TRACTATE_LAST_DAF];
LAST_DAF_OLD[SHEKALIM_INDEX] = SHEKALIM_OLD_LAST_DAF;

/**
 * Kinnim, Tamid and Midos are printed as continuations of the preceding
 * masechta rather than starting at daf 2, so their numbering is offset.
 */
const DAF_OFFSETS: Readonly<Record<number, number>> = {
  36: 21, // Kinnim starts at 23
  37: 24, // Tamid starts at 26
  38: 32, // Midos starts at 34
};

/** Start of cycle 1 (11 September 1923) and of cycle 8 (24 June 1975). */
export const oldStart = greg2abs(new Date(1923, 8, 11));
const newStart = greg2abs(new Date(1975, 5, 24));

const OLD_CYCLE_LENGTH = 2702;
const NEW_CYCLE_LENGTH = 2711;
const FIRST_NEW_CYCLE = 8;

export interface DafYomiResult {
  /** Cycle number, counting the cycle that began 11 September 1923 as 1. */
  cycle: number;
  /** Masechta name, e.g. "Chullin". */
  tractate: string;
  /** Daf (folio) number within the masechta. */
  daf: number;
}

/**
 * Calculate the Daf Yomi for a Gregorian date.
 */
function calculateDaf(date: LearningDate): DafPage {
  const absolute = getAbsDate(date);
  checkTooEarly(absolute, oldStart, 'Daf Yomi');

  let cycle: number;
  let dayInCycle: number;
  if (absolute >= newStart) {
    const elapsed = absolute - newStart;
    cycle = FIRST_NEW_CYCLE + Math.floor(elapsed / NEW_CYCLE_LENGTH);
    dayInCycle = elapsed % NEW_CYCLE_LENGTH;
  } else {
    const elapsed = absolute - oldStart;
    cycle = 1 + Math.floor(elapsed / OLD_CYCLE_LENGTH);
    dayInCycle = elapsed % OLD_CYCLE_LENGTH;
  }

  const lastDaf = cycle < FIRST_NEW_CYCLE ? LAST_DAF_OLD : TRACTATE_LAST_DAF;

  // Walk the masechtos, accumulating days, until the cycle offset falls inside one.
  let daysSoFar = 0;
  for (let index = 0; index < TRACTATE_COUNT; index++) {
    daysSoFar += lastDaf[index] - 1;
    if (dayInCycle < daysSoFar) {
      const daf = lastDaf[index] + 1 - (daysSoFar - dayInCycle) + (DAF_OFFSETS[index] ?? 0);
      const tractate = TRACTATE_NAMES[index];
      return new DafPage(tractate, daf, cycle);
    }
  }

  // Unreachable: the masechta lengths sum to exactly the cycle length.
  throw new Error('Daf Yomi calculation fell through; masechta table is inconsistent.');
}

/**
 * The Babylonian Talmud page (daf) studied on a given date in the
 * worldwide Daf Yomi cycle.
 *
 * The original ("old") cycle began on **11 September 1923**
 * (1 Tishrei 5684); the current page numbering ("new" cycle)
 * starts from 24 June 1975. Each cycle takes approximately 7½ years
 * to complete the entire Talmud.
 *
 * Use this class when you want just the tractate name and page number
 * (a {@link DafPage} subclass with `name` and `blatt` fields) without
 * the surrounding {@link DafYomiEvent} wrapper.
 *
 * @throws {RangeError} from the constructor if `date` is before
 *   11 September 1923.
 * @throws {TypeError} from the constructor if `date` is not an
 *   `HDate`, `Date`, or finite number.
 *
 * @example
 * import {DafYomi} from '@hebcal/learning/dafYomiBase';
 *
 * const daf = new DafYomi(new Date(2024, 3, 8));
 * console.log(daf.getName(), daf.getBlatt());  // "Baba Metzia" 40
 */
export class DafYomi extends DafPage {
  /**
   * Computes the Daf Yomi for the given date.
   * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.)
   *   day number.
   */
  constructor(date: LearningDate) {
    const d = calculateDaf(date);
    super(d.name, d.blatt, d.cycle);
  }
}

// for Daf Weekly, which is a separate schedule
export {DAF_OFFSETS, NEW_CYCLE_LENGTH, TRACTATE_COUNT, TRACTATE_LAST_DAF, TRACTATE_NAMES};
