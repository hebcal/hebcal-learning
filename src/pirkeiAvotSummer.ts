import {wrapSchedule} from './wrapSchedule.js';
import {pirkeiAvot} from './pirkeiAvotBase.js';
import {PirkeiAvotSummerEvent} from './PirkeiAvotSummerEvent.js';

wrapSchedule('pirkeiAvotSummer', undefined, (hd, il) => {
  const reading = pirkeiAvot(hd, il);
  return reading === null ? null : new PirkeiAvotSummerEvent(hd, reading);
});
