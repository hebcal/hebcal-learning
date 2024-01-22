import {Locale, gematriya} from '@hebcal/core';

/**
 * Represents a tractate and page number
 */
export class DafPage {
  /**
   * Initializes a daf yomi instance
   * @param {string} name
   * @param {number} blatt
   */
  constructor(name, blatt) {
    this.name = name;
    this.blatt = blatt;
  }
  /**
   * @return {number}
   */
  getBlatt() {
    return this.blatt;
  }
  /**
   * @return {string}
   */
  getName() {
    return this.name;
  }
  /**
   * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return Locale.gettext(this.name, locale) + ' דף ' +
        gematriya(this.blatt);
    }
    return Locale.gettext(this.name, locale) + ' ' + this.blatt;
  }
}
