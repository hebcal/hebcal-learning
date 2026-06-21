import {Locale} from '@hebcal/core/dist/esm/locale';
import {gematriya} from '@hebcal/hdate';
import {isHebrewLocale} from './common.js';
import './locale.js';

/**
 * Represents a tractate and page number
 */
export class DafPage {
  readonly name: string;
  readonly blatt: string | number;
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
    const loc = (locale || 'en').toLowerCase();
    if (isHebrewLocale(loc)) {
      return Locale.gettext(this.name, loc) + ' דף ' + gematriya(this.blatt);
    }
    return Locale.gettext(this.name, loc) + ' ' + this.blatt;
  }
}
