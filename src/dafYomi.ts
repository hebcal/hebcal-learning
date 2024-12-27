import {HDate, DailyLearning} from '@hebcal/core';
import {osday} from './dafYomiBase';
import {DafYomiEvent} from './DafYomiEvent';

DailyLearning.addCalendar('dafYomi', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < osday) {
    return null;
  }
  return new DafYomiEvent(hd);
});
