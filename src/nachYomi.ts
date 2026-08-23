import {wrapSchedule} from './wrapSchedule.js';
import {NachYomiEvent} from './NachYomiEvent.js';
import {NachYomiIndex, nachYomiStart} from './nachYomiBase.js';

const nachYomiIndex = new NachYomiIndex();

wrapSchedule('nachYomi', nachYomiStart, hd => new NachYomiEvent(hd, nachYomiIndex.lookup(hd)));
