import {HDate, DailyLearning, months} from '@hebcal/core';
import {kitzurShulchanAruch} from './kitzurShulchanAruchBase';
import {KitzurShulchanAruchEvent} from './KitzurShulchanAruchEvent';

DailyLearning.addCalendar('kitzurShulchanAruch', (hd: HDate) => {
  const reading = kitzurShulchanAruch(hd, 'A');
  if (!reading) {
    return null;
  }
  const optionB =
    hd.isLeapYear() && hd.getMonth() === months.ADAR_II
      ? kitzurShulchanAruch(hd, 'B')
      : undefined;
  return new KitzurShulchanAruchEvent(hd, reading, optionB);
});
