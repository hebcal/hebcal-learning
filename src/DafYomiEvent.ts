import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPageEvent} from './DafPageEvent.js';
import {DafYomi} from './dafYomiBase.js';
import './locale.js';

/**
 * Event wrapper around a {@link DafYomi} instance — one daily page of
 * the Babylonian Talmud.
 *
 * The cycle began on **11 September 1923** (1 Tishrei 5684).
 * Looking up a date earlier than that returns `null` from
 * `DailyLearning.lookup('dafYomi', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/dafYomi';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('dafYomi', hd);
 * console.log(ev.render('en'));
 * // => "Daf Yomi: Baba Metzia 40"
 */
export class DafYomiEvent extends DafPageEvent {
  get category(): string {
    return 'Daf Yomi';
  }
  constructor(date: HDate) {
    const daf = new DafYomi(date.greg());
    super(date, daf, flags.DAF_YOMI);
  }
  /**
   * Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return Locale.gettext('Daf Yomi', locale) + ': ' + this.daf.render(locale);
  }
  getCategories(): string[] {
    return ['dafyomi'];
  }
}
