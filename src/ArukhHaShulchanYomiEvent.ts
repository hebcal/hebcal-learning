import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import {AhSYomiReading} from './arukhHaShulchanYomiBase.js';
import {gematriyaNN, isHebrewLocale} from './common.js';
import './locale.js';

/**
 * Event wrapper around an {@link AhSYomiReading Arukh HaShulchan Yomi
 * reading}.
 *
 * The cycle began on Friday, **29 May 2020** (6 Sivan 5780) and
 * completes the entire Arukh HaShulchan in 1,719 days. Looking up a
 * date earlier than that returns `null` from
 * `DailyLearning.lookup('arukhHaShulchanYomi', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/arukhHaShulchanYomi';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('arukhHaShulchanYomi', hd);
 * console.log(ev.render('en'));
 * // => "Yoreh De'ah 263:4-10"
 */
export class ArukhHaShulchanYomiEvent extends DailyLearningEvent {
  readonly reading: AhSYomiReading;
  get category(): string {
    return 'Arukh HaShulchan Yomi';
  }
  constructor(date: HDate, reading: AhSYomiReading) {
    super(date, `${reading.k} ${reading.v}`);
    this.reading = reading;
  }
  render(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const reading = this.reading;
    const name = Locale.gettext(reading.k, loc);
    if (isHebrewLocale(loc)) {
      const parts = reading.v.split('-');
      const beginEnd = parts.map(x => x.split(/\./).map(gematriyaNN).join(':'));
      return name + ' ' + beginEnd.join('-');
    }
    return name + ' ' + reading.v.replaceAll('.', ':');
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const reading = this.reading;
    const name = 'Arukh HaShulchan, ' + reading.k + '.' + reading.v;
    const urlName = encodeURIComponent(name.replaceAll(' ', '_'));
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['arukhHaShulchanYomi'];
  }
}
