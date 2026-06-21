import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPage} from './DafPage.js';
import {DafPageEvent} from './DafPageEvent.js';

/**
 * Event wrapper around the **Daf-a-Week** Talmud page — the same
 * `daf` is repeated each day of the week.
 *
 * The cycle began on Sunday, **6 March 2005** (25 Adar I 5765).
 * Looking up a date earlier than that returns `null` from
 * `DailyLearning.lookup('dafWeekly', ...)`.
 *
 * Two calendars use this event: `dafWeekly` (every day of the week)
 * and `dafWeeklySunday` (only on Sundays — `lookup` returns `null` on
 * Mon-Sat).
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/dafWeekly';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('dafWeekly', hd);
 * console.log(ev.render('en'));
 * // => "Ketubot 83"
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
