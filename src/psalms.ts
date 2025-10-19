import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {dailyPsalms} from './psalmsBase';
import {PsalmsEvent} from './PsalmsEvent';

DailyLearning.addCalendar('psalms', (hd: HDate) => {
  const reading = dailyPsalms(hd);
  return new PsalmsEvent(hd, reading);
});
