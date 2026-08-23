import {wrapSchedule} from './wrapSchedule.js';
import {dirshuDafHalacha, dirshuDafHalachaStart} from './dirshuDafHalachaBase.js';
import {DirshuDafHalachaEvent} from './DirshuDafHalachaEvent.js';

wrapSchedule('dirshuDafHalacha', dirshuDafHalachaStart, hd => {
  const reading = dirshuDafHalacha(hd);
  return reading === null ? null : new DirshuDafHalachaEvent(hd, reading);
});
