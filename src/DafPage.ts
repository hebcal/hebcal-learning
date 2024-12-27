import {Locale, gematriya} from '@hebcal/core';
import './locale';

/**
 * Represents a tractate and page number
 */
export class DafPage {
  name: string;
  blatt: string | number;
  verses?: string;
  /**
   * Initializes a daf yomi instance
   */
  constructor(name: string, blatt: number | string) {
    this.name = name;
    this.blatt = blatt;
  }
  getBlatt(): number | string {
    return this.blatt;
  }
  getName(): string {
    return this.name;
  }
  /**
   * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return Locale.gettext(this.name, locale) + ' דף ' + gematriya(this.blatt);
    }
    return Locale.gettext(this.name, locale) + ' ' + this.blatt;
  }
}
