import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {dirshuDafHalacha, dirshuDafHalachaStart} from './dirshuDafHalachaBase.js';
import {DirshuDafHalachaEvent} from './DirshuDafHalachaEvent.js';

function wrapper(hd: HDate): DirshuDafHalachaEvent | null {
  const abs = hd.abs();
  if (abs < dirshuDafHalachaStart) {
    return null;
  }
  const reading = dirshuDafHalacha(abs);
  if (reading === null) {
    return null;
  }
  return new DirshuDafHalachaEvent(hd, reading);
}

DailyLearning.addCalendar('dirshuDafHalacha', wrapper, new HDate(dirshuDafHalachaStart));
