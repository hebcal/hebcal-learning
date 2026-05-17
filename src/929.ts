import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {_929, _929Start} from './929Base';
import {_929Event} from './929Event';

function wrapper(hd: HDate): _929Event | null {
  const reading = _929(hd);
  if (reading === null) {
    return null;
  }
  return new _929Event(hd, reading);
}

DailyLearning.addCalendar('929', wrapper, new HDate(_929Start));
