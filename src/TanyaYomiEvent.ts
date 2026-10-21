import {type HDate, Locale} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import {type TanyaYomiReading, tanyaYomiSefariaRef} from './tanyaYomiBase.js';
import {gematriyaNN} from './common.js';
import './locale.js';

function renderReading(reading: TanyaYomiReading, locale?: string): string {
  const book = Locale.gettext(reading.book, locale);
  if (reading.section) {
    return book + ', ' + Locale.gettext(reading.section, locale);
  }
  const chap = reading.chap!;
  const num = Locale.isHebrewLocale(locale) ? gematriyaNN(chap) : String(chap);
  return book + ' ' + num;
}

/**
 * Event wrapper around a Tanya Yomi portion — the Chabad daily study of the
 * Tanya, completed every year from 19 Kislev through 18 Kislev.
 *
 * Renders the part of the Tanya and the chapter (or epistle, or essay) in
 * which the day's portion begins; the {@link url} links to the exact
 * paragraph on Sefaria.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core';
 * import '@hebcal/learning/tanyaYomi';
 *
 * const hd = new HDate(12, 'Adar', 5786);
 * const ev = DailyLearning.lookup('tanyaYomi', hd);
 * console.log(ev.render('en'));
 * // => "Tanya: Likkutei Amarim 33"
 */
export class TanyaYomiEvent extends DailyLearningEvent {
  readonly reading: TanyaYomiReading;
  override get category(): string {
    return 'Tanya Yomi';
  }
  constructor(date: HDate, reading: TanyaYomiReading) {
    super(date, tanyaYomiSefariaRef(reading).replace(/^Tanya, Part [IV]+; /, ''));
    this.reading = reading;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  override render(locale?: string): string {
    return Locale.gettext('Tanya', locale) + ': ' + this.renderBrief(locale);
  }
  /**
   * Returns a brief (translated) description of this event.
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  override renderBrief(locale?: string): string {
    return renderReading(this.reading, locale);
  }
  /**
   * Returns a link to sefaria.org
   */
  override url(): string {
    const ref = tanyaYomiSefariaRef(this.reading)
      .replaceAll(' ', '_')
      .replaceAll(',', '%2C')
      .replaceAll(';', '%3B')
      .replace(/_(\d+):(\d+)$/, '.$1.$2')
      .replace(/_(\d+)$/, '.$1');
    return `https://www.sefaria.org/${ref}?lang=bi`;
  }
  override getCategories(): string[] {
    return ['tanyaYomi'];
  }
}
