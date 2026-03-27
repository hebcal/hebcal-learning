import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent';
import {AhSYomiReading} from './arukhHaShulchanYomiBase';
import {gematriyaNN, isHebrewLocale} from './common';
import './locale';

/**
 * Event wrapper around a Arukh HaShulchan Yomi reading
 */
export class ArukhHaShulchanYomiEvent extends DailyLearningEvent {
  reading: AhSYomiReading;
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
