import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent';
import {RambamReading} from './rambam1Base';
import {gematriyaNN, isHebrewLocale} from './common';
import './locale';

/**
 * Event wrapper around a single chapter from the Mishneh Torah, as
 * scheduled by Maimonides' Daily Rambam **1-chapter-a-day** cycle.
 *
 * The cycle began on Sunday, **29 April 1984** (27 Nisan 5744) and
 * repeats every 1,017 days. Looking up a date earlier than that
 * returns `null` from `DailyLearning.lookup('rambam1', ...)`.
 *
 * The companion {@link DailyRambam3Event} covers the 3-chapter-a-day
 * variant of the same cycle.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/rambam1';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('rambam1', hd);
 * console.log(ev.render('en'));
 * // => "Appraisals and Devoted Property 5"
 */
export class DailyRambamEvent extends DailyLearningEvent {
  reading: RambamReading;
  get category(): string {
    return 'Daily Rambam';
  }
  constructor(date: HDate, reading: RambamReading) {
    super(date, `${reading.name} ${reading.perek}`);
    this.reading = reading;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const reading = this.reading;
    const name = Locale.gettext(reading.name, loc);
    if (isHebrewLocale(loc)) {
      const perekStr =
        typeof reading.perek === 'number'
          ? gematriyaNN(reading.perek)
          : reading.perek;
      return name + ' פרק ' + perekStr;
    }
    return name + ' ' + reading.perek;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const reading = this.reading;
    const name = 'Mishneh Torah, ' + reading.name + '.' + reading.perek;
    const urlName = encodeURIComponent(
      name.replaceAll(' ', '_').replaceAll(':', '.')
    );
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['dailyRambam1'];
  }
}
