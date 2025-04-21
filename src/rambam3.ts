import {HDate, DailyLearning} from '@hebcal/core';
import {rambam1Start} from './rambam1Base';
import {dailyRambam3} from './rambam3Base';
import {DailyRambam3Event} from './DailyRambam3Event';

function wrapper(hd: HDate): DailyRambam3Event | null {
  if (hd.abs() < rambam1Start) {
    return null;
  }
  const reading = dailyRambam3(hd);
  return new DailyRambam3Event(hd, reading);
}

DailyLearning.addCalendar('rambam3', wrapper, new HDate(rambam1Start));
