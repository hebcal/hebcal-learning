import {HDate, DailyLearning} from '@hebcal/core';
import {chofetzChaim, chofetzChaimStart} from './chofetzChaimBase';
import {ChofetzChaimEvent} from './ChofetzChaimEvent';

DailyLearning.addCalendar('chofetzChaim', (hd: HDate) => {
  if (hd.abs() < chofetzChaimStart) {
    return null;
  }
  const reading = chofetzChaim(hd);
  return new ChofetzChaimEvent(hd, reading);
});
