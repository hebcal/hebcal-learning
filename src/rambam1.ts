import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {dailyRambam1, rambam1Start} from './rambam1Base';
import {DailyRambamEvent} from './DailyRambamEvent';

function wrapper(hd: HDate): DailyRambamEvent | null {
  if (hd.abs() < rambam1Start) {
    return null;
  }
  const reading = dailyRambam1(hd);
  return new DailyRambamEvent(hd, reading);
}

DailyLearning.addCalendar('rambam1', wrapper, new HDate(rambam1Start));
