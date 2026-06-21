import {HDate, gematriya} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {Nine29Reading} from './929Base.js';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import {isHebrewLocale, sefariaUrl} from './common.js';
import './locale.js';

/**
 * Event wrapper for a daily 929 Tanakh chapter reading
 * (https://www.929.org.il). The 929 Project reads one chapter of the
 * Hebrew Bible Sun-Thu (skipping Fri/Sat), covering all 929 chapters
 * in about 3.5 years.
 *
 * The first cycle began on Sunday, **21 December 2014**
 * (29 Kislev 5775). `DailyLearning.lookup('929', hd)` returns `null`
 * on Fridays and Saturdays (skip days), on the wind-down days
 * between the end of one cycle and the start of the next, and on any
 * date before 21 December 2014.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/929';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784 (Mon)
 * const ev = DailyLearning.lookup('929', hd);
 * console.log(ev.render('en'));  // => "Malachi 3 (567)"
 */
export class Nine29Event extends DailyLearningEvent {
  readonly reading: Nine29Reading;

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
    const chapStr = isHebrewLocale(loc)
      ? gematriya(bookChap)
      : String(bookChap);
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
    const chapStr = isHebrewLocale(loc)
      ? gematriya(bookChap)
      : String(bookChap);
    return `${bookName} ${chapStr}`;
  }

  /**
   * Returns a link to sefaria.org for the current chapter,
   * e.g. https://www.sefaria.org/Deuteronomy.34?lang=bi
   */
  url(): string {
    return sefariaUrl(this.reading.book, this.reading.bookChap);
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
