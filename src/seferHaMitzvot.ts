import {wrapSchedule} from './wrapSchedule.js';
import {seferHaMitzvot, seferHaMitzvotStart} from './seferHaMitzvotBase.js';
import {SeferHaMitzvotEvent} from './SeferHaMitzvotEvent.js';

wrapSchedule(
  'seferHaMitzvot',
  seferHaMitzvotStart,
  hd => new SeferHaMitzvotEvent(hd, seferHaMitzvot(hd))
);
