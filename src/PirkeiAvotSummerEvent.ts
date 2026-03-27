import {HDate, gematriya} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {DailyLearningEvent} from './DailyLearningEvent';
import {isHebrewLocale} from './common';
import './locale';

const PIRKEI_AVOT = 'Pirkei Avot';

/**
 * Event wrapper for
 * Pirkei Avot being studied on Shabbat between Pesach and Rosh Hashana
 */
export class PirkeiAvotSummerEvent extends DailyLearningEvent {
  reading: number[];
  get category(): string {
    return PIRKEI_AVOT;
  }
  constructor(date: HDate, reading: number[]) {
    super(date, PIRKEI_AVOT + ' ' + reading.join('-'));
    this.reading = reading;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const book = Locale.gettext(PIRKEI_AVOT, loc);
    const reading = this.reading;
    if (isHebrewLocale(loc)) {
      return book + ' ' + reading.map(gematriya).join('-');
    }
    return book + ' ' + reading.join('-');
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const chaps = this.reading.join('-');
    return `https://www.sefaria.org/Pirkei_Avot.${chaps}?lang=bi`;
  }
  getCategories(): string[] {
    return ['pirkeiAvotSummer'];
  }
}
