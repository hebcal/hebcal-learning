import {HDate, flags} from '@hebcal/core';
import {DailyChapterEvent} from './DailyChapterEvent';
import {PerekYomi} from './perekYomiBase';

/**
 * Event wrapper around a Perek Yomi instance
 */
export class PerekYomiEvent extends DailyChapterEvent {
  constructor(date: HDate, reading: PerekYomi) {
    super(date, reading.k, reading.v, 'Perek Yomi', flags.DAILY_LEARNING);
  }
  getCategories(): string[] {
    return ['perekYomi'];
  }
}
