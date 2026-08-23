import {wrapSchedule} from './wrapSchedule.js';
import {dailyPsalms} from './psalmsBase.js';
import {PsalmsEvent} from './PsalmsEvent.js';

wrapSchedule('psalms', undefined, hd => new PsalmsEvent(hd, dailyPsalms(hd)));
