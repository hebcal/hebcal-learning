import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent';
import {RambamReading} from './rambam1Base';
import {gematriyaNN, isHebrewLocale} from './common';
import './locale';

/**
 * Event wrapper around a Daily Rambam instance
 */
export class DailyRambamEvent extends DailyLearningEvent {
  reading: RambamReading;
  category: string;
  constructor(date: HDate, reading: RambamReading) {
    super(date, `${reading.name} ${reading.perek}`);
    this.reading = reading;
    this.alarm = false;
    this.category = 'Daily Rambam';
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
