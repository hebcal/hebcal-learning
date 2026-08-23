import {wrapSchedule} from './wrapSchedule.js';
import {calculate929, nine29Start} from './929Base.js';
import {Nine29Event} from './929Event.js';

wrapSchedule('929', nine29Start, hd => {
  const reading = calculate929(hd);
  return reading === null ? null : new Nine29Event(hd, reading);
});
