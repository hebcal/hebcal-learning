import {wrapSchedule} from './wrapSchedule.js';
import {rambam1Start} from './rambam1Base.js';
import {dailyRambam3} from './rambam3Base.js';
import {DailyRambam3Event} from './DailyRambam3Event.js';

wrapSchedule('rambam3', rambam1Start, hd => new DailyRambam3Event(hd, dailyRambam3(hd)));
