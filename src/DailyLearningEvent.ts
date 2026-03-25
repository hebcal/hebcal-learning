import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';

export class DailyLearningEvent extends Event {
  constructor(date: HDate, desc: string, mask = flags.DAILY_LEARNING) {
    super(date, desc, mask);
  }
}
