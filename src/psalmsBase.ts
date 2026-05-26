import {HDate} from '@hebcal/hdate';

/**
 * One day's slice of the 30-day Psalms cycle, as a two-element tuple
 * `[begin, end]`. Both entries are normally chapter numbers (e.g.
 * `[10, 17]`), but Psalm 119 — the longest chapter, studied over two
 * days — uses verse-prefixed strings (`"119:1"`/`"119:96"` and
 * `"119:97"`/`"119:176"`).
 */
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
 * Returns the Daily Psalms (Tehillim) portion for the given date,
 * using the traditional 30-day cycle indexed by Hebrew day of the
 * month.
 *
 * The entire book is completed on the final day of each Hebrew
 * month. In months with only 29 days, the 30th portion is combined
 * with the 29th (so 29 Cheshvan or 29 Kislev may return
 * `[140, 150]`).
 *
 * Unlike most calendars in this package there is no fixed cycle
 * start — any Hebrew date returns a reading. The function never
 * returns `null`.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns A {@link PsalmBeginEnd} tuple `[begin, end]`.
 * @throws {TypeError} (indirectly, via the `HDate` constructor) if
 *   `date` is not an `HDate`, `Date`, or finite number.
 */
export function dailyPsalms(date: HDate | Date | number): PsalmBeginEnd {
  const hd = new HDate(date);
  const dd = hd.getDate();
  if (dd === 29 && hd.daysInMonth() === 29) {
    return [140, 150]; // read both 29th and 30th
  }
  return schedule[dd];
}
