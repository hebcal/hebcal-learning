import {Event, HDate} from '@hebcal/core';
import {DafPage} from './DafPage';

const dafYomiSefaria: {[key: string]: string} = {
  Berachot: 'Berakhot',
  'Rosh Hashana': 'Rosh Hashanah',
  Gitin: 'Gittin',
  'Baba Kamma': 'Bava Kamma',
  'Baba Metzia': 'Bava Metzia',
  'Baba Batra': 'Bava Batra',
  Bechorot: 'Bekhorot',
  Arachin: 'Arakhin',
  Midot: 'Middot',
  Shekalim: 'Jerusalem_Talmud_Shekalim',
} as const;

/**
 * Event wrapper around a DafPage instance
 */
export class DafPageEvent extends Event {
  daf: DafPage;
  category?: string;
  constructor(date: HDate, daf: DafPage, mask: number) {
    super(date, daf.render('en'), mask);
    this.daf = daf;
  }
  /**
   * Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return this.daf.render(locale);
  }
  /**
   * Returns Daf Yomi name without the 'Daf Yomi: ' prefix (e.g. "Pesachim 107").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    return this.daf.render(locale);
  }
  /**
   * Returns a link to sefaria.org or dafyomi.org
   */
  url(): string {
    const daf = this.daf;
    const tractate = daf.getName();
    const blatt = daf.getBlatt();
    if (tractate == 'Kinnim' || tractate == 'Midot') {
      return `https://www.dafyomi.org/index.php?masechta=meilah&daf=${blatt}a`;
    } else {
      const name0 = dafYomiSefaria[tractate] || tractate;
      const name = name0.replace(/ /g, '_');
      return `https://www.sefaria.org/${name}.${blatt}a?lang=bi`;
    }
  }
}
