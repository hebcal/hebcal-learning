import {wrapSchedule} from './wrapSchedule.js';
import {arukhHaShulchanYomi, ahsyStart} from './arukhHaShulchanYomiBase.js';
import {ArukhHaShulchanYomiEvent} from './ArukhHaShulchanYomiEvent.js';

wrapSchedule(
  'arukhHaShulchanYomi',
  ahsyStart,
  hd => new ArukhHaShulchanYomiEvent(hd, arukhHaShulchanYomi(hd))
);
