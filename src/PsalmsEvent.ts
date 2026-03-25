import {HDate, gematriya} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {DailyLearningEvent} from './DailyLearningEvent';
import {PsalmBeginEnd} from './psalmsBase';
import './locale';

/**
 * Event wrapper around a daily Psalms / Tehillim
 */
export class PsalmsEvent extends DailyLearningEvent {
  reading: PsalmBeginEnd;
  category: string;
  constructor(date: HDate, reading: PsalmBeginEnd) {
    super(date, `Psalms ${reading[0]}-${reading[1]}`);
    this.reading = reading;
    this.alarm = false;
    this.category = 'Psalms';
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const book = Locale.gettext('Psalms', loc);
    const reading = this.reading;
    if (
      (loc === 'he' || loc === 'he-x-nonikud') &&
      typeof reading[0] === 'number'
    ) {
      return book + ' ' + gematriya(reading[0]) + '-' + gematriya(reading[1]);
    }
    return book + ' ' + reading[0] + '-' + reading[1];
  }
  /**
   * Returns a link to sefaria.org
   *  e.g. https://www.sefaria.org/Psalms.1-9?lang=b
   */
  url(): string {
    const str = this.getDesc().replace(' ', '.').replaceAll(':', '.');
    return `https://www.sefaria.org/${str}?lang=bi`;
  }
  getCategories(): string[] {
    return ['dailyPsalms'];
  }
}
