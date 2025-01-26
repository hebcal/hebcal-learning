import {HDate, DailyLearning} from '@hebcal/core';
import {shemiratHaLashon, shemiratHaLashonStart} from './shemiratHaLashonBase';
import {ShemiratHaLashonEvent} from './ShemiratHaLashonEvent';

function wrapper(hd: HDate): ShemiratHaLashonEvent | null {
  if (hd.abs() < shemiratHaLashonStart) {
    return null;
  }
  const reading = shemiratHaLashon(hd);
  return new ShemiratHaLashonEvent(hd, reading);
}

DailyLearning.addCalendar(
  'shemiratHaLashon',
  wrapper,
  new HDate(shemiratHaLashonStart)
);
