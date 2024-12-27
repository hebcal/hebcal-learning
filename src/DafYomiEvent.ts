import {HDate, flags, Locale} from '@hebcal/core';
import {DafPageEvent} from './DafPageEvent';
import {DafYomi} from './dafYomiBase';
import './locale';

/**
 * Event wrapper around a DafYomi instance
 */
export class DafYomiEvent extends DafPageEvent {
  constructor(date: HDate) {
    const daf = new DafYomi(date.greg());
    super(date, daf, flags.DAF_YOMI);
    this.category = 'Daf Yomi';
  }
  /**
   * Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return Locale.gettext('Daf Yomi', locale) + ': ' + this.daf.render(locale);
  }
  getCategories(): string[] {
    return ['dafyomi'];
  }
}
