import { HDate, flags, greg } from '@hebcal/core';
import { DafPage } from './DafPage';
import { DafPageEvent } from './DafPageEvent';
import { checkTooEarly, getAbsDate } from './common';
import { findDaf, shas0 } from './dafyomi';

const startDate = new Date(2005, 2, 6);
export const dafWeeklyStart = greg.greg2abs(startDate);

const numDays = 2711 * 7;

/**
 * Daf-a-Week
 * @param date - Hebrew or Gregorian date
 */
export function dafWeekly(date: HDate | Date | number): DafPage {
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
  constructor(date: HDate, daf: DafPage) {
    super(date, daf, flags.DAILY_LEARNING);
    this.alarm = false;
    this.category = 'Daf Weekly';
  }
  getCategories(): string[] {
    return ['dafWeekly'];
  }
}
