import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {
  seferHaMitzvot,
  seferHaMitzvotStart as startAbs,
} from './seferHaMitzvotBase';
import {SeferHaMitzvotEvent} from './SeferHaMitzvotEvent';

function wrapper(hd: HDate) {
  if (hd.abs() < startAbs) {
    return null;
  }
  const reading = seferHaMitzvot(hd);
  return new SeferHaMitzvotEvent(hd, reading);
}

DailyLearning.addCalendar('seferHaMitzvot', wrapper, new HDate(startAbs));
