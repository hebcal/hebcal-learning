import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {dirshuAmudYomiStart} from './dirshuAmudYomiBase.js';
import {DirshuAmudYomiEvent} from './DirshuAmudYomiEvent.js';

function wrapper(hd: HDate): DirshuAmudYomiEvent | null {
  const abs = hd.abs();
  if (abs < dirshuAmudYomiStart) {
    return null;
  }
  return new DirshuAmudYomiEvent(hd);
}

DailyLearning.addCalendar('dirshuAmudYomi', wrapper, new HDate(dirshuAmudYomiStart));
