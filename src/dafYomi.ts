import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {osday} from './dafYomiBase';
import {DafYomiEvent} from './DafYomiEvent';

function wrapper(hd: HDate): DafYomiEvent | null {
  const abs = hd.abs();
  if (abs < osday) {
    return null;
  }
  return new DafYomiEvent(hd);
}

DailyLearning.addCalendar('dafYomi', wrapper, new HDate(osday));
