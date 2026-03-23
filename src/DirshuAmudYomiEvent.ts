import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPageEvent} from './DafPageEvent';
import {DirshuAmudYomi, calculateDirshuAmud} from './dirshuAmudYomiBase';
import './locale';

const sefariaNames: Record<string, string> = {
  Berachot: 'Berakhot',
  'Rosh Hashana': 'Rosh_Hashanah',
  Gitin: 'Gittin',
  'Baba Kamma': 'Bava_Kamma',
  'Baba Metzia': 'Bava_Metzia',
  'Baba Batra': 'Bava_Batra',
  Bechorot: 'Bekhorot',
  Arachin: 'Arakhin',
  Midot: 'Middot',
} as const;

/**
 * Event wrapper around a Dirshu Amud HaYomi result
 */
export class DirshuAmudYomiEvent extends DafPageEvent {
  constructor(date: HDate) {
    const daf = calculateDirshuAmud(date.greg());
    super(date, daf, flags.DAILY_LEARNING);
    this.category = 'Dirshu Amud HaYomi';
  }

  /**
   * Returns the name with "Dirshu Amud HaYomi: " prefix (e.g. "Dirshu Amud HaYomi: Shekalim 4b").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return (
      Locale.gettext('Dirshu Amud HaYomi', locale) +
      ': ' +
      this.daf.render(locale)
    );
  }

  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const daf = this.daf as DirshuAmudYomi;
    const tractate = daf.getName();
    const blattNum = daf.blattNum;
    const side = daf.side;
    const name0 = sefariaNames[tractate] || tractate.replace(/ /g, '_');
    return `https://www.sefaria.org/${name0}.${blattNum}${side}?lang=bi`;
  }

  getCategories(): string[] {
    return ['dirshuAmudYomi'];
  }
}
