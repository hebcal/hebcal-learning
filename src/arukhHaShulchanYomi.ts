import {HDate, DailyLearning} from '@hebcal/core';
import {arukhHaShulchanYomi, ahsyStart} from './arukhHaShulchanYomiBase';
import {ArukhHaShulchanYomiEvent} from './ArukhHaShulchanYomiEvent';

function wrapper(hd: HDate): ArukhHaShulchanYomiEvent | null {
  if (hd.abs() < ahsyStart) {
    return null;
  }
  const reading = arukhHaShulchanYomi(hd);
  return new ArukhHaShulchanYomiEvent(hd, reading);
}

DailyLearning.addCalendar('arukhHaShulchanYomi', wrapper, new HDate(ahsyStart));
