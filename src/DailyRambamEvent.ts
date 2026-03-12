import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';
import {RambamReading} from './rambam1Base';
import {gematriyaNN} from './common';
import './locale';

/**
 * Event wrapper around a Daily Rambam instance
 */
export class DailyRambamEvent extends Event {
  reading: RambamReading;
  category: string;
  constructor(date: HDate, reading: RambamReading) {
    super(date, `${reading.name} ${reading.perek}`, flags.DAILY_LEARNING);
    this.reading = reading;
    this.alarm = false;
    this.category = 'Daily Rambam';
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || 'en';
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const reading = this.reading;
    const name = Locale.gettext(reading.name, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
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
