import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {tanakhYomi, tanakhYomiStart} from './tanakhYomiBase';
import {TanakhYomiEvent} from './TanakhYomiEvent';

function wrapper(hd: HDate): TanakhYomiEvent | null {
  const abs = hd.abs();
  if (abs < tanakhYomiStart) {
    return null;
  }
  const daf = tanakhYomi(abs);
  if (daf === null) {
    return null;
  }
  return new TanakhYomiEvent(hd, daf);
}

DailyLearning.addCalendar('tanakhYomi', wrapper, new HDate(tanakhYomiStart));
