import {flags, greg} from '@hebcal/core';
import {shas0, findDaf} from './dafyomi.js';
import {DafPageEvent} from './DafPageEvent.js';
import {getAbsDate, checkTooEarly} from './common.js';

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

  return findDaf(shas0, weekNum);
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
    super(date, daf, flags.USER_EVENT);
    this.alarm = false;
    this.category = 'Daf Weekly';
  }
  /** @return {string[]} */
  getCategories() {
    return ['dafWeekly'];
  }
}
