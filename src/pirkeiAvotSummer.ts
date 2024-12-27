import {HDate, DailyLearning} from '@hebcal/core';
import {pirkeiAvot} from './pirkeiAvotBase';
import {PirkeiAvotSummerEvent} from './PirkeiAvotSummerEvent';

DailyLearning.addCalendar('pirkeiAvotSummer', (hd: HDate, il: boolean) => {
  const reading = pirkeiAvot(hd, il);
  if (reading === null) {
    return null;
  }
  return new PirkeiAvotSummerEvent(hd, reading);
});
