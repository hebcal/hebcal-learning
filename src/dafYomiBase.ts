/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import {HDate, greg} from '@hebcal/hdate';
import {DafPage} from './DafPage.js';
import {checkTooEarly, getAbsDate} from './common.js';
import bavliJson from './bavli.json.js';

const osdate = new Date(1923, 8, 11);
export const osday = greg.greg2abs(osdate);
const nsday = greg.greg2abs(new Date(1975, 5, 24));

type Daf = {
  name: string;
  blatt: number;
};

export const shas0: Daf[] = Object.entries<number>(bavliJson).map(
  ([name, blatt]) => ({name, blatt})
);

/**
 * @private
 */
function calculateDaf(date: HDate | Date | number): DafPage {
  const cday = getAbsDate(date);
  checkTooEarly(cday, osday, 'Daf Yomi');
  let cno;
  let dno;
  if (cday >= nsday) {
    // "new" cycle
    cno = 8 + Math.floor((cday - nsday) / 2711);
    dno = (cday - nsday) % 2711;
  } else {
    // old cycle
    cno = 1 + Math.floor((cday - osday) / 2702);
    dno = (cday - osday) % 2702;
  }

  // Find the daf taking note that the cycle changed slightly after cycle 7.
  // Fix Shekalim for old cycles
  const shortShekalim = cno <= 7;
  const shas = shortShekalim ? shas0.slice() : shas0;
  if (shortShekalim) {
    shas[4] = {name: 'Shekalim', blatt: 13};
  }

  return findDaf(shas, dno);
}

/**
 * @private
 */
export function findDaf(shas: Daf[], dno: number): DafPage {
  let total = 0;
  let blatt = 0;
  let count = -1;

  // Find the daf
  let j = 0;
  const dafcnt = 40;
  while (j < dafcnt) {
    count++;
    total = total + shas[j].blatt - 1;
    if (dno < total) {
      blatt = shas[j].blatt + 1 - (total - dno);
      // fiddle with the weird ones near the end
      switch (count) {
        case 36:
          blatt = blatt + 21;
          break;
        case 37:
          blatt = blatt + 24;
          break;
        case 38:
          blatt = blatt + 32;
          break;
        default:
          break;
      }
      // Bailout
      j = 1 + dafcnt;
    }
    j++;
  }
  return new DafPage(shas[count].name, blatt);
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
  constructor(date: HDate | Date | number) {
    const d = calculateDaf(date);
    super(d.name, d.blatt);
  }
}
