import {Event, HDate, flags, Locale} from '@hebcal/core';
import {
  ChofetzChaimReading,
  formatReadingPages,
  englishNames,
  HilchosLH,
  HilchosRechilus,
  Tziyurim,
} from './chofetzChaimBase';
import './locale';

/**
 * Event wrapper around a Chofetz Chaim instance
 */
export class ChofetzChaimEvent extends Event {
  reading: ChofetzChaimReading;
  category: string;
  constructor(date: HDate, reading: ChofetzChaimReading) {
    const desc = reading.k + formatReadingPages(reading);
    super(date, desc, flags.DAILY_LEARNING);
    this.reading = reading;
    this.memo = this.render('memo');
    this.alarm = false;
    this.category = 'Chofetz Chaim';
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const reading = this.reading;
    const book = reading.k;
    const book2 = book.replace('Hilchos', 'Hilchos ');
    let name =
      locale === 'memo' ? englishNames[book] : Locale.gettext(book2, locale);
    name += formatReadingPages(reading);
    return name;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const str = this.renderBrief(locale);
    const reading = this.reading;
    if (typeof reading.textBegin === 'string') {
      return str + ' ' + reading.textBegin + ' - ' + reading.textEnd;
    } else {
      return str;
    }
  }
  /**
   * Returns a link to sefaria.org
   *  e.g. https://www.sefaria.org/Chofetz_Chaim%2C_Part_One%2C_The_Prohibition_Against_Lashon_Hara%2C_Principle_7.7
   */
  url(): string {
    const reading = this.reading;
    const book = reading.k;
    let name = 'Chofetz Chaim, ' + englishNames[book];
    let separator = '.';
    if (book === HilchosLH || book === HilchosRechilus) {
      name += ', Principle';
      separator = '_';
    } else if (book === Tziyurim) {
      name += ', Illustration';
      separator = '_';
    }
    if (typeof reading.b !== 'undefined') {
      name += separator + reading.b;
    }
    const urlName = encodeURIComponent(name.replace(/ /g, '_'));
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['chofetzChaim'];
  }
}
