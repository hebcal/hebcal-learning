import {wrapSchedule} from './wrapSchedule.js';
import {tanakhYomi, tanakhYomiStart} from './tanakhYomiBase.js';
import {TanakhYomiEvent} from './TanakhYomiEvent.js';

wrapSchedule('tanakhYomi', tanakhYomiStart, hd => {
  const daf = tanakhYomi(hd);
  return daf === null ? null : new TanakhYomiEvent(hd, daf);
});
