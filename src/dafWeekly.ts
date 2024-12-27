import {HDate, DailyLearning} from '@hebcal/core';
import {dafWeekly, dafWeeklyStart} from './dafWeeklyBase';
import {DafWeeklyEvent} from './DafWeeklyEvent';

DailyLearning.addCalendar('dafWeekly', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < dafWeeklyStart) {
    return null;
  }
  const daf = dafWeekly(abs);
  return new DafWeeklyEvent(hd, daf);
});

DailyLearning.addCalendar('dafWeeklySunday', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < dafWeeklyStart) {
    return null;
  }
  // Only return the weekly daf on Sundays
  const dow = hd.getDay();
  if (dow !== 0) {
    return null;
  }
  const daf = dafWeekly(abs);
  return new DafWeeklyEvent(hd, daf);
});
