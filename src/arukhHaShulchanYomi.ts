import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {arukhHaShulchanYomi, ahsyStart} from './arukhHaShulchanYomiBase.js';
import {ArukhHaShulchanYomiEvent} from './ArukhHaShulchanYomiEvent.js';

function wrapper(hd: HDate): ArukhHaShulchanYomiEvent | null {
  if (hd.abs() < ahsyStart) {
    return null;
  }
  const reading = arukhHaShulchanYomi(hd);
  return new ArukhHaShulchanYomiEvent(hd, reading);
}

DailyLearning.addCalendar('arukhHaShulchanYomi', wrapper, new HDate(ahsyStart));
