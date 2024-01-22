import {Event} from '@hebcal/core';

export const dafYomiSefaria = {
  'Berachot': 'Berakhot',
  'Rosh Hashana': 'Rosh Hashanah',
  'Gitin': 'Gittin',
  'Baba Kamma': 'Bava Kamma',
  'Baba Metzia': 'Bava Metzia',
  'Baba Batra': 'Bava Batra',
  'Bechorot': 'Bekhorot',
  'Arachin': 'Arakhin',
  'Midot': 'Middot',
  'Shekalim': 'Jerusalem_Talmud_Shekalim',
};

/**
 * Event wrapper around a DafPage instance
 */
export class DafPageEvent extends Event {
  /**
   * @param {HDate} date
   * @param {DafPage} daf
   * @param {number} mask
   */
  constructor(date, daf, mask) {
    super(date, daf.render('en'), mask);
    this.daf = daf;
  }
  /**
   * Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return this.daf.render(locale);
  }
  /**
   * Returns Daf Yomi name without the 'Daf Yomi: ' prefix (e.g. "Pesachim 107").
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return this.daf.render(locale);
  }
  /**
   * Returns a link to sefaria.org or dafyomi.org
   * @return {string}
   */
  url() {
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
