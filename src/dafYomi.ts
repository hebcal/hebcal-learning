import {wrapSchedule} from './wrapSchedule.js';
import {oldStart} from './dafYomiBase.js';
import {DafYomiEvent} from './DafYomiEvent.js';

wrapSchedule('dafYomi', oldStart, hd => new DafYomiEvent(hd));
