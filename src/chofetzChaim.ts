import {wrapSchedule} from './wrapSchedule.js';
import {chofetzChaim, chofetzChaimStart} from './chofetzChaimBase.js';
import {ChofetzChaimEvent} from './ChofetzChaimEvent.js';

wrapSchedule('chofetzChaim', chofetzChaimStart, hd => new ChofetzChaimEvent(hd, chofetzChaim(hd)));
