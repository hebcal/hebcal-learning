import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {NachYomiEvent} from './NachYomiEvent.js';
import {NachYomiIndex, nachYomiStart} from './nachYomiBase.js';

const nachYomiIndex = new NachYomiIndex();

function wrapper(hd: HDate): NachYomiEvent | null {
  const abs = hd.abs();
  if (abs < nachYomiStart) {
    return null;
  }
  const nachYomi = nachYomiIndex.lookup(abs);
  return new NachYomiEvent(hd, nachYomi);
}

DailyLearning.addCalendar('nachYomi', wrapper, new HDate(nachYomiStart));
