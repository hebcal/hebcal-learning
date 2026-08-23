import {months} from '@hebcal/hdate';
import {wrapSchedule} from './wrapSchedule.js';
import {kitzurShulchanAruch} from './kitzurShulchanAruchBase.js';
import {KitzurShulchanAruchEvent} from './KitzurShulchanAruchEvent.js';

wrapSchedule('kitzurShulchanAruch', undefined, hd => {
  const reading = kitzurShulchanAruch(hd, 'A');
  if (!reading) {
    return null;
  }
  const optionB =
    hd.isLeapYear() && hd.getMonth() === months.ADAR_II ? kitzurShulchanAruch(hd, 'B') : undefined;
  return new KitzurShulchanAruchEvent(hd, reading, optionB);
});
