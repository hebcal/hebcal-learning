import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DailyChapterEvent} from './DailyChapterEvent.js';
import {NachYomi} from './nachYomiBase.js';

/**
 * Event wrapper around a Nach Yomi reading — one chapter from
 * Nevi'im or Ketuvim per day.
 *
 * The current cycle began on **1 November 2007** (20 Cheshvan 5768).
 * Looking up a date earlier than that returns `null` from
 * `DailyLearning.lookup('nachYomi', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/nachYomi';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('nachYomi', hd);
 * console.log(ev.render('en'));
 * // => "I Samuel 23"
 */
export class NachYomiEvent extends DailyChapterEvent {
  get category(): string {
    return 'Nach Yomi';
  }
  constructor(date: HDate, reading: NachYomi) {
    super(date, reading.k, reading.v, flags.NACH_YOMI);
  }
  getCategories(): string[] {
    return ['nachyomi'];
  }
}
