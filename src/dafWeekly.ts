import {wrapSchedule} from './wrapSchedule.js';
import {dafWeekly, dafWeeklyStart} from './dafWeeklyBase.js';
import {DafWeeklyEvent} from './DafWeeklyEvent.js';

wrapSchedule('dafWeekly', dafWeeklyStart, hd => new DafWeeklyEvent(hd, dafWeekly(hd)));

// Only return the weekly daf on Sundays
wrapSchedule('dafWeeklySunday', dafWeeklyStart, hd =>
  hd.getDay() === 0 ? new DafWeeklyEvent(hd, dafWeekly(hd)) : null
);
