import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPageEvent} from './DafPageEvent';
import {TanakhYomi} from './tanakhYomiBase';

/**
 * Event wrapper around a tanakhYomi
 */
export class TanakhYomiEvent extends DafPageEvent {
  constructor(date: HDate, daf: TanakhYomi) {
    super(date, daf, flags.DAILY_LEARNING);
    this.alarm = false;
    this.category = 'Tanakh Yomi';
    this.memo = daf.verses;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const memo: string = this.daf.verses!;
    const space = memo.lastIndexOf(' ');
    const book = memo.substring(0, space).replace(/ /g, '_');
    const verses = memo.substring(space + 1).replace(/:/g, '.');
    return `https://www.sefaria.org/${book}.${verses}?lang=bi`;
  }
  getCategories(): string[] {
    return ['tanakhYomi'];
  }
}
