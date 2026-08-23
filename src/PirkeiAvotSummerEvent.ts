import {HDate, gematriya} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import {sefariaUrl} from './common.js';
import './locale.js';

const PIRKEI_AVOT = 'Pirkei Avot';

/**
 * Event wrapper for Pirkei Avot ("Ethics of the Fathers"), studied
 * one chapter on each Shabbat of the summer between Passover and
 * Rosh Hashana.
 *
 * The schedule is computed from the Hebrew calendar each year, with
 * no fixed start date. `DailyLearning.lookup('pirkeiAvotSummer', hd)`
 * returns `null` outside that window (and on every non-Shabbat).
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/pirkeiAvotSummer';
 *
 * const hd = new HDate(new Date(2024, 6, 6));  // 30 Sivan 5784 (Sat)
 * const ev = DailyLearning.lookup('pirkeiAvotSummer', hd);
 * console.log(ev.render('en'));  // => "Pirkei Avot 4"
 */
export class PirkeiAvotSummerEvent extends DailyLearningEvent {
  readonly reading: number[];
  get category(): string {
    return PIRKEI_AVOT;
  }
  constructor(date: HDate, reading: number[]) {
    super(date, PIRKEI_AVOT + ' ' + reading.join('-'));
    this.reading = reading;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  render(locale?: string): string {
    const book = Locale.gettext(PIRKEI_AVOT, locale);
    const reading = this.reading;
    if (Locale.isHebrewLocale(locale)) {
      return book + ' ' + reading.map(gematriya).join('-');
    }
    return book + ' ' + reading.join('-');
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const chaps = this.reading.join('-');
    return sefariaUrl('Pirkei Avot', chaps);
  }
  getCategories(): string[] {
    return ['pirkeiAvotSummer'];
  }
}
