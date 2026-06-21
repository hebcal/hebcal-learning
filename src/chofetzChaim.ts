import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {chofetzChaim, chofetzChaimStart} from './chofetzChaimBase.js';
import {ChofetzChaimEvent} from './ChofetzChaimEvent.js';

function wrapper(hd: HDate): ChofetzChaimEvent | null {
  if (hd.abs() < chofetzChaimStart) {
    return null;
  }
  const reading = chofetzChaim(hd);
  return new ChofetzChaimEvent(hd, reading);
}

DailyLearning.addCalendar(
  'chofetzChaim',
  wrapper,
  new HDate(chofetzChaimStart)
);
