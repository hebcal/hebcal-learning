import {wrapSchedule} from './wrapSchedule.js';
import {PerekYomiEvent} from './PerekYomiEvent.js';
import {perekYomi, perekYomiStart} from './perekYomiBase.js';

wrapSchedule('perekYomi', perekYomiStart, hd => new PerekYomiEvent(hd, perekYomi(hd)));
