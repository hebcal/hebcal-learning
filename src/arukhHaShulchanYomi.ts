import {HDate, DailyLearning} from '@hebcal/core';
import {arukhHaShulchanYomi} from './arukhHaShulchanYomiBase';
import {ArukhHaShulchanYomiEvent} from './ArukhHaShulchanYomiEvent';

DailyLearning.addCalendar('arukhHaShulchanYomi', (hd: HDate) => {
  const reading = arukhHaShulchanYomi(hd);
  if (reading === null) {
    return null;
  }
  return new ArukhHaShulchanYomiEvent(hd, reading);
});
