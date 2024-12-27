import {HDate, flags} from '@hebcal/core';
import {DafPage} from './DafPage';
import {DafPageEvent} from './DafPageEvent';

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
