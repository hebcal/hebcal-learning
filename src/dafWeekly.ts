import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {dafWeekly, dafWeeklyStart} from './dafWeeklyBase';
import {DafWeeklyEvent} from './DafWeeklyEvent';

const startDate = new HDate(dafWeeklyStart);

function wrapperDaily(hd: HDate): DafWeeklyEvent | null {
  const abs = hd.abs();
  if (abs < dafWeeklyStart) {
    return null;
  }
  const daf = dafWeekly(abs);
  return new DafWeeklyEvent(hd, daf);
}

function wrapperSun(hd: HDate): DafWeeklyEvent | null {
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
}

DailyLearning.addCalendar('dafWeekly', wrapperDaily, startDate);
DailyLearning.addCalendar('dafWeeklySunday', wrapperSun, startDate);
