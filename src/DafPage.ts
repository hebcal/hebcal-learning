import {Locale} from '@hebcal/core/dist/esm/locale';
import {gematriya} from '@hebcal/hdate';
import './locale.js';

/**
 * Represents a tractate and page number
 */
export class DafPage {
  readonly name: string;
  readonly blatt: string | number;
  readonly cycle?: number;
  /**
   * Initializes a daf yomi instance
   */
  constructor(name: string, blatt: number | string, cycle?: number) {
    this.name = name;
    this.blatt = blatt;
    this.cycle = cycle;
  }
  getBlatt(): number | string {
    return this.blatt;
  }
  getName(): string {
    return this.name;
  }
  /**
   * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  render(locale?: string): string {
    const {name, blatt} = this;
    if (Locale.isHebrewLocale(locale)) {
      return Locale.gettext(name, locale) + ' דף ' + gematriya(blatt);
    }
    return Locale.gettext(name, locale) + ' ' + blatt;
  }
}
