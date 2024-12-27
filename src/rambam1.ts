import {HDate, DailyLearning} from '@hebcal/core';
import {dailyRambam1, rambam1Start} from './rambam1Base';
import {DailyRambamEvent} from './DailyRambamEvent';

DailyLearning.addCalendar('rambam1', (hd: HDate) => {
  if (hd.abs() < rambam1Start) {
    return null;
  }
  const reading = dailyRambam1(hd);
  return new DailyRambamEvent(hd, reading);
});
