import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';
import {formatReadingPages} from './chofetzChaimBase';
import {
  ShemiratHaLashonReading,
  Chapters,
  englishNames,
} from './shemiratHaLashonBase';
import './locale';

/**
 * Event wrapper around a Sefer Shemirat HaLashon instance
 */
export class ShemiratHaLashonEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reading: any;
  category: string;
  memo: string;
  constructor(date: HDate, reading: ShemiratHaLashonReading) {
    const book = reading.bk === 1 ? 'Book I' : 'Book II';
    const section = reading.k === Chapters ? '' : `, ${reading.k}`;
    const desc = book + section + formatReadingPages(reading);
    super(date, desc, flags.DAILY_LEARNING);
    this.reading = reading;
    this.memo = this.render('memo');
    this.alarm = false;
    this.category = 'Shemirat HaLashon';
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || 'en';
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const prefix = this.renderPrefix(locale);
    return prefix + formatReadingPages(this.reading);
  }

  /**
   * @private
   * @param locale
   */
  renderPrefix(locale: string): string {
    const reading = this.reading;
    const book = reading.bk === 1 ? 'Book I' : 'Book II';
    const section0 = reading.k.replace(/ /g, '_');
    const section =
      locale === 'memo'
        ? englishNames[section0]
        : reading.k === Chapters
          ? null
          : Locale.gettext(reading.k, locale);
    return section ? `${book}, ${section}` : book;
  }

  /**
   * Returns a link to sefaria.org
   *  e.g. https://www.sefaria.org/Shemirat_HaLashon%2C_Book_I%2C_The_Gate_of_Torah.4.2?lang=b
   */
  url(): string {
    const name =
      'Shemirat HaLashon, ' + this.renderPrefix('memo') + '.' + this.reading.b;
    const urlName = encodeURIComponent(name.replace(/ /g, '_'));
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['shemiratHaLashon'];
  }
}
