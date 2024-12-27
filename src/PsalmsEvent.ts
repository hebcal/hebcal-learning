import {Event, HDate, flags, Locale, gematriya} from '@hebcal/core';
import {PsalmBeginEnd} from './psalmsBase';
import './locale';

/**
 * Event wrapper around a daily Psalms / Tehillim
 */
export class PsalmsEvent extends Event {
  reading: PsalmBeginEnd;
  category: string;
  constructor(date: HDate, reading: PsalmBeginEnd) {
    super(date, `Psalms ${reading[0]}-${reading[1]}`, flags.DAILY_LEARNING);
    this.reading = reading;
    this.alarm = false;
    this.category = 'Psalms';
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
    const book = Locale.gettext('Psalms', locale);
    const reading = this.reading;
    if (
      (locale === 'he' || locale === 'he-x-nonikud') &&
      typeof reading[0] === 'number'
    ) {
      return book + ' ' + gematriya(reading[0]) + '-' + gematriya(reading[1]);
    }
    return book + ' ' + reading[0] + '-' + reading[1];
  }
  /**
   * Returns a link to sefaria.org
   *  e.g. https://www.sefaria.org/Psalms.1-9?lang=b
   */
  url(): string {
    const str = this.getDesc().replace(' ', '.').replace(/:/g, '.');
    return `https://www.sefaria.org/${str}?lang=bi`;
  }
  getCategories(): string[] {
    return ['dailyPsalms'];
  }
}
