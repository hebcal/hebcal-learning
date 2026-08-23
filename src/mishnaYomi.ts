import {wrapSchedule} from './wrapSchedule.js';
import {MishnaYomiIndex, mishnaYomiStart} from './mishnaYomiBase.js';
import {MishnaYomiEvent} from './MishnaYomiEvent.js';

const mishnaYomiIndex = new MishnaYomiIndex();

wrapSchedule(
  'mishnaYomi',
  mishnaYomiStart,
  hd => new MishnaYomiEvent(hd, mishnaYomiIndex.lookup(hd))
);
