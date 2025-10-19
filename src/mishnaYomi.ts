import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {MishnaYomiIndex, mishnaYomiStart} from './mishnaYomiBase';
import {MishnaYomiEvent} from './MishnaYomiEvent';

const mishnaYomiIndex = new MishnaYomiIndex();

function wrapper(hd: HDate): MishnaYomiEvent | null {
  const abs = hd.abs();
  if (abs < mishnaYomiStart) {
    return null;
  }
  const mishnaYomi = mishnaYomiIndex.lookup(abs);
  return new MishnaYomiEvent(hd, mishnaYomi);
}

DailyLearning.addCalendar('mishnaYomi', wrapper, new HDate(mishnaYomiStart));
