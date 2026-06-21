import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {calculate929, nine29Start} from './929Base.js';
import {Nine29Event} from './929Event.js';

function wrapper(hd: HDate): Nine29Event | null {
  const abs = hd.abs();
  if (abs < nine29Start) {
    return null;
  }
  const reading = calculate929(hd);
  if (reading === null) {
    return null;
  }
  return new Nine29Event(hd, reading);
}

DailyLearning.addCalendar('929', wrapper, new HDate(nine29Start));
