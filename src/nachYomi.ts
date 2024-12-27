import {HDate, DailyLearning} from '@hebcal/core';
import {NachYomiEvent} from './NachYomiEvent';
import {NachYomiIndex, nachYomiStart} from './nachYomiBase';

const nachYomiIndex = new NachYomiIndex();
DailyLearning.addCalendar('nachYomi', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < nachYomiStart) {
    return null;
  }
  const nachYomi = nachYomiIndex.lookup(abs);
  return new NachYomiEvent(hd, nachYomi);
});
