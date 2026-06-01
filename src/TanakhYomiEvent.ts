import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPageEvent} from './DafPageEvent';
import {TanakhYomi} from './tanakhYomiBase';
import {sefariaUrl} from './common';

/**
 * Event wrapper around a Tanakh Yomi seder reading.
 *
 * The cycle began on **26 October 1948** (23 Tishrei 5709). It skips
 * Shabbat and major festivals, so `DailyLearning.lookup('tanakhYomi',
 * hd)` returns `null` on those days as well as on any date before the
 * cycle began.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/tanakhYomi';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('tanakhYomi', hd);
 * console.log(ev.render('en'));  // => "Ezekiel Seder 3"
 */
export class TanakhYomiEvent extends DafPageEvent {
  get category(): string {
    return 'Tanakh Yomi';
  }
  constructor(date: HDate, daf: TanakhYomi) {
    super(date, daf, flags.DAILY_LEARNING);
    this.memo = daf.verses;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const memo: string = this.memo!;
    const space = memo.lastIndexOf(' ');
    const book = memo.substring(0, space);
    const verses = memo.substring(space + 1).replaceAll(':', '.');
    return sefariaUrl(book, verses);
  }
  getCategories(): string[] {
    return ['tanakhYomi'];
  }
}
