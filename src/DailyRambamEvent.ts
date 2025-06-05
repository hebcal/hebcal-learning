import {Event, HDate, flags, Locale} from '@hebcal/core';
import {RambamReading} from './rambam1Base';
import {gematriyaNN} from './gematriyaNN';
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
    // this.memo = this.render('memo');
    this.alarm = false;
    this.category = 'Daily Rambam';
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const reading = this.reading;
    if (
      (locale === 'he' || locale === 'he-x-nonikud') &&
      typeof reading.perek === 'number'
    ) {
      return (
        Locale.gettext(reading.name, locale) +
        ' פרק ' +
        gematriyaNN(reading.perek)
      );
    }
    return Locale.gettext(reading.name, locale) + ' ' + reading.perek;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const reading = this.reading;
    const name = 'Mishneh Torah, ' + reading.name + '.' + reading.perek;
    const urlName = encodeURIComponent(
      name.replace(/ /g, '_').replace(/:/g, '.')
    );
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['dailyRambam1'];
  }
}
