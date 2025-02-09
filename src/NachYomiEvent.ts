import {HDate, flags} from '@hebcal/core';
import {DailyChapterEvent} from './DailyChapterEvent';
import {NachYomi} from './nachYomiBase';

/**
 * Event wrapper around a Nach Yomi instance
 */
export class NachYomiEvent extends DailyChapterEvent {
  constructor(date: HDate, reading: NachYomi) {
    super(date, reading.k, reading.v, 'Nach Yomi', flags.NACH_YOMI);
  }
  getCategories(): string[] {
    return ['nachyomi'];
  }
}
