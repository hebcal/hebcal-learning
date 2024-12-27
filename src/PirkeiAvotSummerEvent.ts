import {Event, HDate, flags, Locale, gematriya} from '@hebcal/core';

const PIRKEI_AVOT = 'Pirkei Avot';

/**
 * Event wrapper for
 * Pirkei Avot being studied on Shabbat between Pesach and Rosh Hashana
 */
export class PirkeiAvotSummerEvent extends Event {
  reading: number[];
  category: string;
  constructor(date: HDate, reading: number[]) {
    super(date, PIRKEI_AVOT + ' ' + reading.join('-'), flags.DAILY_LEARNING);
    this.reading = reading;
    this.alarm = false;
    this.category = PIRKEI_AVOT;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const book = Locale.gettext(PIRKEI_AVOT, locale);
    const reading = this.reading;
    if (locale === 'he' || locale === 'he-x-nonikud') {
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
