import {wrapSchedule} from './wrapSchedule.js';
import {dirshuAmudYomiStart} from './dirshuAmudYomiBase.js';
import {DirshuAmudYomiEvent} from './DirshuAmudYomiEvent.js';

wrapSchedule('dirshuAmudYomi', dirshuAmudYomiStart, hd => new DirshuAmudYomiEvent(hd));
