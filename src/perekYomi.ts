import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {PerekYomiEvent} from './PerekYomiEvent';
import {perekYomi, perekYomiStart} from './perekYomiBase';

function wrapper(hd: HDate): PerekYomiEvent | null {
  const abs = hd.abs();
  if (abs < perekYomiStart) {
    return null;
  }
  const reading = perekYomi(abs);
  return new PerekYomiEvent(hd, reading);
}

DailyLearning.addCalendar('perekYomi', wrapper, new HDate(perekYomiStart));
