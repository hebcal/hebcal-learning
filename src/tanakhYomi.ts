import {HDate, DailyLearning} from '@hebcal/core';
import {tanakhYomi, tanakhYomiStart} from './tanakhYomiBase';
import {TanakhYomiEvent} from './TanakhYomiEvent';

DailyLearning.addCalendar('tanakhYomi', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < tanakhYomiStart) {
    return null;
  }
  const daf = tanakhYomi(abs);
  if (daf === null) {
    return null;
  }
  return new TanakhYomiEvent(hd, daf);
});
