import {Event, HDate, Locale, flags, gematriya} from '@hebcal/core';
import {AhSYomiReading} from './arukhHaShulchanYomiBase';

/**
 * Event wrapper around a Arukh HaShulchan Yomi reading
 */
export class ArukhHaShulchanYomiEvent extends Event {
  reading: AhSYomiReading;
  category: string;
  constructor(date: HDate, reading: AhSYomiReading) {
    super(date, `${reading.k} ${reading.v}`, flags.DAILY_LEARNING);
    this.reading = reading;
    this.category = 'Arukh HaShulchan Yomi';
  }
  /**
   * Returns name of tractate and page (e.g. "Beitzah 21").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const reading = this.reading;
    const name = Locale.gettext(reading.k, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return name + ' ' + gematriya(reading.v);
    }
    return name + ' ' + reading.v;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const reading = this.reading;
    const name = 'Arukh HaShulchan, ' + reading.k + '.' + reading.v;
    const urlName = encodeURIComponent(name.replace(/ /g, '_'));
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['arukhHaShulchanYomi'];
  }
}
