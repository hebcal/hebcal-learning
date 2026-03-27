import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPageEvent} from './DafPageEvent';
import {DafYomi} from './dafYomiBase';
import './locale';

/**
 * Event wrapper around a DafYomi instance
 */
export class DafYomiEvent extends DafPageEvent {
  get category(): string {
    return 'Daf Yomi';
  }
  constructor(date: HDate) {
    const daf = new DafYomi(date.greg());
    super(date, daf, flags.DAF_YOMI);
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
