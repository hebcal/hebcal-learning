import {HDate, gematriya} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {Nine29Reading} from './929Base';
import {DailyLearningEvent} from './DailyLearningEvent';
import {isHebrewLocale} from './common';
import './locale';

/**
 * Event wrapper for a daily 929 Tanach chapter reading.
 * Each event corresponds to one Bible chapter in the 929 program
 * (https://www.929.org.il).
 */
export class Nine29Event extends DailyLearningEvent {
  reading: Nine29Reading;

  constructor(date: HDate, reading: Nine29Reading) {
    super(date, `${reading.book} ${reading.bookChap} (${reading.cycleChap})`);
    this.reading = reading;
    this.alarm = false;
  }

  /**
   * Returns the name of the reading, e.g. "Deuteronomy 34 (187)".
   * In Hebrew the chapter is rendered with gematriya: "דברים ל״ד (187)".
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const {book, bookChap, cycleChap} = this.reading;
    const bookName = Locale.gettext(book, loc);
    const chapStr = isHebrewLocale(loc) ? gematriya(bookChap) : String(bookChap);
    return `${bookName} ${chapStr} (${cycleChap})`;
  }

  /**
   * Returns a brief description without the day-number suffix,
   * e.g. "Deuteronomy 34".
   */
  renderBrief(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const {book, bookChap} = this.reading;
    const bookName = Locale.gettext(book, loc);
    const chapStr = isHebrewLocale(loc) ? gematriya(bookChap) : String(bookChap);
    return `${bookName} ${chapStr}`;
  }

  /**
   * Returns a link to sefaria.org for the current chapter,
   * e.g. https://www.sefaria.org/Deuteronomy.34?lang=bi
   */
  url(): string {
    const bookSlug = this.reading.book.replaceAll(' ', '_');
    return `https://www.sefaria.org/${bookSlug}.${this.reading.bookChap}?lang=bi`;
  }

  getCategories(): string[] {
    return ['929'];
  }

  /**
   * Category name used as the location field in iCalendar event feeds.
   */
  get category(): string {
    return '929';
  }
}
