import {wrapSchedule} from './wrapSchedule.js';
import {shemiratHaLashon, shemiratHaLashonStart} from './shemiratHaLashonBase.js';
import {ShemiratHaLashonEvent} from './ShemiratHaLashonEvent.js';

wrapSchedule(
  'shemiratHaLashon',
  shemiratHaLashonStart,
  hd => new ShemiratHaLashonEvent(hd, shemiratHaLashon(hd))
);
