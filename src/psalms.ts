import {HDate, DailyLearning} from '@hebcal/core';
import {dailyPsalms} from './psalmsBase';
import {PsalmsEvent} from './PsalmsEvent';

DailyLearning.addCalendar('psalms', (hd: HDate) => {
  const reading = dailyPsalms(hd);
  return new PsalmsEvent(hd, reading);
});
