import {Locale} from '@hebcal/core/dist/esm/locale';
import poAshkenazi from './ashkenazi.po.js';
import poHe from './he.po.js';

Locale.addTranslations('he', poHe);
Locale.addTranslations('ashkenazi', poAshkenazi);

const poHeNoNikud = Locale.copyLocaleNoNikud(poHe);
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);
