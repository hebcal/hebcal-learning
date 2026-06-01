import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent';
import {formatReadingPages} from './chofetzChaimBase';
import {
  ShemiratHaLashonReading,
  Chapters,
  englishNames,
} from './shemiratHaLashonBase';
import './locale';

/**
 * Event wrapper around a Sefer Shemirat HaLashon reading — daily
 * study of the laws of guarded speech by Rabbi Yisrael Meir Kagan
 * (a companion to the Chofetz Chaim).
 *
 * The schedule is Hebrew-calendar driven and repeats annually; the
 * published cycle began on **21 Sh'vat 5636** (~16 February 1876).
 * Looking up a date earlier than that returns `null` from
 * `DailyLearning.lookup('shemiratHaLashon', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/shemiratHaLashon';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('shemiratHaLashon', hd);
 * console.log(ev.render('en'));
 * // => "Book I, Shar Hatorah 7.7-7.8"
 */
export class ShemiratHaLashonEvent extends DailyLearningEvent {
  reading: ShemiratHaLashonReading;
  memo: string;
  get category(): string {
    return 'Shemirat HaLashon';
  }
  constructor(date: HDate, reading: ShemiratHaLashonReading) {
    const book = reading.bk === 1 ? 'Book I' : 'Book II';
    const section = reading.k === Chapters ? '' : `, ${reading.k}`;
    const desc = book + section + formatReadingPages(reading);
    super(date, desc);
    this.reading = reading;
    this.memo = this.render('memo');
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const prefix = this.renderPrefix(loc);
    return prefix + formatReadingPages(this.reading);
  }

  /**
   * @private
   * @param locale
   */
  renderPrefix(locale: string): string {
    const reading = this.reading;
    const book = reading.bk === 1 ? 'Book I' : 'Book II';
    const section0 = reading.k.replaceAll(' ', '_');
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
    const urlName = encodeURIComponent(name.replaceAll(' ', '_'));
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['shemiratHaLashon'];
  }
}
