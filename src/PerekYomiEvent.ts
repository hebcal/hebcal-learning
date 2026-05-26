import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DailyChapterEvent} from './DailyChapterEvent';
import {PerekYomi} from './perekYomiBase';

/**
 * Event wrapper around a Perek Yomi reading — one chapter of the
 * Mishna studied each day.
 *
 * The cycle began on Shabbat, **9 February 2002** (27 Sh'vat 5762).
 * Looking up a date earlier than that returns `null` from
 * `DailyLearning.lookup('perekYomi', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/perekYomi';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('perekYomi', hd);
 * console.log(ev.render('en'));
 * // => "Sotah 8"
 */
export class PerekYomiEvent extends DailyChapterEvent {
  get category(): string {
    return 'Perek Yomi';
  }
  constructor(date: HDate, reading: PerekYomi) {
    super(date, reading.k, reading.v, flags.DAILY_LEARNING);
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const masechta = this.k;
    const prefix = masechta === 'Avot' ? 'Pirkei' : 'Mishnah';
    const name = masechta.replaceAll(' ', '_');
    const chapter = this.v;
    return `https://www.sefaria.org/${prefix}_${name}.${chapter}?lang=bi`;
  }
  getCategories(): string[] {
    return ['perekYomi'];
  }
}
