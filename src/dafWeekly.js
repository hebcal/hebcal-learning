import {greg} from '@hebcal/core';
import {shas0 as shas, DafPage, DafPageEvent} from './dafyomi';
import {getAbsDate, checkTooEarly} from './common';

const startDate = new Date(2005, 2, 6);
export const dafWeeklyStart = greg.greg2abs(startDate);

const numDays = 2711 * 7;

/**
 * Daf-a-Week
 * @param {HDate|Date|number} date - Hebrew or Gregorian date
 * @return {DafPage}
 */
export function dafWeekly(date) {
  const abs = getAbsDate(date);
  checkTooEarly(abs, dafWeeklyStart, 'Daf-a-Week');

  const dayNum = (abs - dafWeeklyStart) % numDays;
  const weekNum = Math.trunc(dayNum / 7);

  // Find the daf
  let total = 0;
  let blatt = 0;
  let count = -1;
  let j = 0;
  const dafcnt = 40;
  while (j < dafcnt) {
    count++;
    total = total + shas[j].blatt - 1;
    if (weekNum < total) {
      blatt = (shas[j].blatt + 1) - (total - weekNum);
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
 * Event wrapper around a daily weekly
 */
export class DafWeeklyEvent extends DafPageEvent {
  /**
   * @param {HDate} date
   * @param {DafPage} daf
   */
  constructor(date, daf) {
    super(date, daf);
    this.alarm = false;
    this.category = 'Daf Weekly';
  }
  /** @return {string[]} */
  getCategories() {
    return ['dafWeekly'];
  }
}
