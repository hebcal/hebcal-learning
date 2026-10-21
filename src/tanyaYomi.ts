import {wrapSchedule} from './wrapSchedule.js';
import {tanyaYomi} from './tanyaYomiBase.js';
import {TanyaYomiEvent} from './TanyaYomiEvent.js';

wrapSchedule('tanyaYomi', undefined, hd => new TanyaYomiEvent(hd, tanyaYomi(hd)));
