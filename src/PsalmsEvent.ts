import {HDate, gematriya} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {DailyLearningEvent} from './DailyLearningEvent';
import {PsalmBeginEnd} from './psalmsBase';
import {isHebrewLocale, sefariaUrl} from './common';
import './locale';

/**
 * Event wrapper around the daily Psalms / Tehillim portion in the
 * traditional 30-day cycle. The cycle is indexed by Hebrew day of
 * the month and repeats every Hebrew month, so any Hebrew date
 * returns a reading and `DailyLearning.lookup('psalms', hd)` never
 * returns `null`.
 *
 * On 29-day months, the 30th portion is combined with the 29th.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/psalms';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('psalms', hd);
 * console.log(ev.render('en'));  // => "Psalms 140-150"
 */
export class PsalmsEvent extends DailyLearningEvent {
  readonly reading: PsalmBeginEnd;
  get category(): string {
    return 'Psalms';
  }
  constructor(date: HDate, reading: PsalmBeginEnd) {
    super(date, `Psalms ${reading[0]}-${reading[1]}`);
    this.reading = reading;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const book = Locale.gettext('Psalms', loc);
    const reading = this.reading;
    if (isHebrewLocale(loc) && typeof reading[0] === 'number') {
      return book + ' ' + gematriya(reading[0]) + '-' + gematriya(reading[1]);
    }
    return book + ' ' + reading[0] + '-' + reading[1];
  }
  /**
   * Returns a link to sefaria.org
   *  e.g. https://www.sefaria.org/Psalms.1-9?lang=b
   */
  url(): string {
    const r = this.reading;
    const chapter = `${r[0]}-${r[1]}`.replaceAll(':', '.');
    return sefariaUrl('Psalms', chapter);
  }
  getCategories(): string[] {
    return ['dailyPsalms'];
  }
}
