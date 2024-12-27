import {HDate, DailyLearning} from '@hebcal/core';
import {MishnaYomiIndex, mishnaYomiStart} from './mishnaYomiBase';
import {MishnaYomiEvent} from './MishnaYomiEvent';

const mishnaYomiIndex = new MishnaYomiIndex();
DailyLearning.addCalendar('mishnaYomi', (hd: HDate) => {
  const abs = hd.abs();
  if (abs < mishnaYomiStart) {
    return null;
  }
  const mishnaYomi = mishnaYomiIndex.lookup(abs);
  return new MishnaYomiEvent(hd, mishnaYomi);
});
