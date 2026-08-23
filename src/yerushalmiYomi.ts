import {wrapSchedule} from './wrapSchedule.js';
import {schottenstein, vilna, yerushalmiYomi} from './yerushalmiBase.js';
import {YerushalmiYomiEvent} from './YerushalmiYomiEvent.js';

wrapSchedule('yerushalmi-vilna', vilna.startAbs, hd => {
  const daf = yerushalmiYomi(hd, vilna);
  return daf === null ? null : new YerushalmiYomiEvent(hd, daf);
});

wrapSchedule(
  'yerushalmi-schottenstein',
  schottenstein.startAbs,
  hd => new YerushalmiYomiEvent(hd, yerushalmiYomi(hd, schottenstein)!)
);
