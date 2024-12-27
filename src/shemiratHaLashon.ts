import {HDate, DailyLearning} from '@hebcal/core';
import {shemiratHaLashon, shemiratHaLashonStart} from './shemiratHaLashonBase';
import {ShemiratHaLashonEvent} from './ShemiratHaLashonEvent';

DailyLearning.addCalendar('shemiratHaLashon', (hd: HDate) => {
  if (hd.abs() < shemiratHaLashonStart) {
    return null;
  }
  const reading = shemiratHaLashon(hd);
  return new ShemiratHaLashonEvent(hd, reading);
});
