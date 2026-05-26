import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent';
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
 * Event wrapper around a Sefer Chofetz Chaim reading — daily study
 * of the Jewish ethics and laws of speech by Rabbi Yisrael Meir
 * Kagan.
 *
 * The schedule is Hebrew-calendar driven and repeats on a 3-year
 * cycle; the published cycle began on **1 Tishrei 5634**
 * (~22 September 1873). Looking up a date earlier than that returns
 * `null` from `DailyLearning.lookup('chofetzChaim', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/chofetzChaim';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('chofetzChaim', hd);
 * console.log(ev.render('en'));
 * // => "Hilchos LH 10.4"
 */
export class ChofetzChaimEvent extends DailyLearningEvent {
  reading: ChofetzChaimReading;
  get category(): string {
    return 'Chofetz Chaim';
  }
  constructor(date: HDate, reading: ChofetzChaimReading) {
    const desc = reading.k + formatReadingPages(reading);
    super(date, desc);
    this.reading = reading;
    this.memo = this.render('memo');
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const reading = this.reading;
    const book = reading.k;
    const book2 = book.replace('Hilchos', 'Hilchos ');
    let name =
      loc === 'memo' ? englishNames[book] : Locale.gettext(book2, loc);
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
    const urlName = encodeURIComponent(name.replaceAll(' ', '_'));
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['chofetzChaim'];
  }
}
