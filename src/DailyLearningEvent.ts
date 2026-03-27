import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';

export class DailyLearningEvent extends Event {
  constructor(date: HDate, desc: string, mask: number = flags.DAILY_LEARNING) {
    super(date, desc, mask);
    this.alarm = false;
  }
  /**
   * Category name used as the location field in iCalendar event feeds.
   */
  get category(): string | undefined {
    return undefined;
  }
}
