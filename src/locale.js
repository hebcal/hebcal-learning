import {Locale} from '@hebcal/core';
import poHe from './he.po.js';
import poAshkenazi from './ashkenazi.po.js';

Locale.addTranslations('he', poHe);
Locale.addTranslations('h', poHe);
Locale.addTranslations('ashkenazi', poAshkenazi);
Locale.addTranslations('a', poAshkenazi);

const heStrs = poHe.contexts[''];
const heNoNikud = {};
for (const [key, val] of Object.entries(heStrs)) {
  heNoNikud[key] = [Locale.hebrewStripNikkud(val[0])];
}
const poHeNoNikud = {
  headers: poHe.headers,
  contexts: {'': heNoNikud},
};
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);
