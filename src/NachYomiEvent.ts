import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DailyChapterEvent} from './DailyChapterEvent';
import {NachYomi} from './nachYomiBase';

/**
 * Event wrapper around a Nach Yomi instance
 */
export class NachYomiEvent extends DailyChapterEvent {
  get category(): string {
    return 'Nach Yomi';
  }
  constructor(date: HDate, reading: NachYomi) {
    super(date, reading.k, reading.v, flags.NACH_YOMI);
  }
  getCategories(): string[] {
    return ['nachyomi'];
  }
}
