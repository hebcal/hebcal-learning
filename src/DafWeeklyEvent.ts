import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPage} from './DafPage';
import {DafPageEvent} from './DafPageEvent';

/**
 * Event wrapper around a daily weekly
 */
export class DafWeeklyEvent extends DafPageEvent {
  get category(): string {
    return 'Daf Weekly';
  }
  constructor(date: HDate, daf: DafPage) {
    super(date, daf, flags.DAILY_LEARNING);
  }
  getCategories(): string[] {
    return ['dafWeekly'];
  }
}
