import {HDate, DailyLearning} from '@hebcal/core';
import {seferHaMitzvot, seferHaMitzvotStart} from './seferHaMitzvotBase';
import {SeferHaMitzvotEvent} from './SeferHaMitzvotEvent';

DailyLearning.addCalendar('seferHaMitzvot', (hd: HDate) => {
  if (hd.abs() < seferHaMitzvotStart) {
    return null;
  }
  const reading = seferHaMitzvot(hd);
  return new SeferHaMitzvotEvent(hd, reading);
});
