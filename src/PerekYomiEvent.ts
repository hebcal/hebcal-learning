import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DailyChapterEvent} from './DailyChapterEvent';
import {PerekYomi} from './perekYomiBase';

/**
 * Event wrapper around a Perek Yomi instance
 */
export class PerekYomiEvent extends DailyChapterEvent {
  get category(): string {
    return 'Perek Yomi';
  }
  constructor(date: HDate, reading: PerekYomi) {
    super(date, reading.k, reading.v, flags.DAILY_LEARNING);
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const masechta = this.k;
    const prefix = masechta === 'Avot' ? 'Pirkei' : 'Mishnah';
    const name = masechta.replaceAll(' ', '_');
    const chapter = this.v;
    return `https://www.sefaria.org/${prefix}_${name}.${chapter}?lang=bi`;
  }
  getCategories(): string[] {
    return ['perekYomi'];
  }
}
