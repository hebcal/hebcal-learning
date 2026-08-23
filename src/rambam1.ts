import {wrapSchedule} from './wrapSchedule.js';
import {dailyRambam1, rambam1Start} from './rambam1Base.js';
import {DailyRambamEvent} from './DailyRambamEvent.js';

wrapSchedule('rambam1', rambam1Start, hd => new DailyRambamEvent(hd, dailyRambam1(hd)));
