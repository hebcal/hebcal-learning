import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPageEvent, dafYomiSefaria, shekalimDafYomiMap} from './DafPageEvent';
import {DirshuAmudYomi, calculateDirshuAmud} from './dirshuAmudYomiBase';

/**
 * Event wrapper around a Dirshu Amud HaYomi result
 */
export class DirshuAmudYomiEvent extends DafPageEvent {
  constructor(date: HDate) {
    const daf = calculateDirshuAmud(date);
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
    if (tractate === 'Shekalim') {
      const entry = shekalimDafYomiMap[`${daf.blattNum}${daf.side}`];
      const ref = entry.replaceAll(':', '.');
      return `https://www.sefaria.org/Jerusalem_Talmud_Shekalim.${ref}?lang=bi`;
    }
    const name0 = dafYomiSefaria[tractate] || tractate;
    const name = name0.replaceAll(' ', '_');
    return `https://www.sefaria.org/${name}.${daf.blattNum}${daf.side}?lang=bi`;
  }

  getCategories(): string[] {
    return ['dirshuAmudYomi'];
  }
}
