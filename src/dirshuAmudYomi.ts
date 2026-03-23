import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {dirshuAmudYomiStart} from './dirshuAmudYomiBase';
import {DirshuAmudYomiEvent} from './DirshuAmudYomiEvent';

function wrapper(hd: HDate): DirshuAmudYomiEvent | null {
  const abs = hd.abs();
  if (abs < dirshuAmudYomiStart) {
    return null;
  }
  return new DirshuAmudYomiEvent(hd);
}

DailyLearning.addCalendar('dirshuAmudYomi', wrapper, new HDate(dirshuAmudYomiStart));
