import {Event, HDate, Locale, flags, gematriya} from '@hebcal/core';
import {DLDate} from './common';

export type PsalmBeginEnd = [number | string, number | string];

const schedule: PsalmBeginEnd[] = [
  [0, 0],
  [1, 9],
  [10, 17],
  [18, 22],
  [23, 28],
  [29, 34],
  [35, 38],
  [39, 43],
  [44, 48],
  [49, 54],
  [55, 59],
  [60, 65],
  [66, 68],
  [69, 71],
  [72, 76],
  [77, 78],
  [79, 82],
  [83, 87],
  [88, 89],
  [90, 96],
  [97, 103],
  [104, 105],
  [106, 107],
  [108, 112],
  [113, 118],
  ['119:1', '119:96'],
  ['119:97', '119:176'],
  [120, 134],
  [135, 139],
  [140, 144],
  [145, 150],
];

/**
 * Calculates Daily Psalms (Tehillim) for 30-day cycle.
 */
export function dailyPsalms(date: DLDate): PsalmBeginEnd {
  const hd = new HDate(date);
  const dd = hd.getDate();
  if (dd === 29 && hd.daysInMonth() === 29) {
    return [140, 150]; // read both 29th and 30th
  }
  return schedule[dd];
}

/**
 * Event wrapper around a daily Psalms / Tehillim
 */
export class PsalmsEvent extends Event {
  reading: PsalmBeginEnd;
  category: string;
  constructor(date: HDate, reading: PsalmBeginEnd) {
    super(date, `Psalms ${reading[0]}-${reading[1]}`, flags.DAILY_LEARNING);
    this.reading = reading;
    this.alarm = false;
    this.category = 'Psalms';
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const book = Locale.gettext('Psalms', locale);
    const reading = this.reading;
    if (
      (locale === 'he' || locale === 'he-x-nonikud') &&
      typeof reading[0] === 'number'
    ) {
      return book + ' ' + gematriya(reading[0]) + '-' + gematriya(reading[1]);
    }
    return book + ' ' + reading[0] + '-' + reading[1];
  }
  /**
   * Returns a link to sefaria.org
   *  e.g. https://www.sefaria.org/Psalms.1-9?lang=b
   */
  url(): string {
    const str = this.getDesc().replace(' ', '.').replace(/:/g, '.');
    return `https://www.sefaria.org/${str}?lang=bi`;
  }
  getCategories(): string[] {
    return ['dailyPsalms'];
  }
}
