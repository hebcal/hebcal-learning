import {HDate} from '@hebcal/hdate';

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
export function dailyPsalms(date: HDate | Date | number): PsalmBeginEnd {
  const hd = new HDate(date);
  const dd = hd.getDate();
  if (dd === 29 && hd.daysInMonth() === 29) {
    return [140, 150]; // read both 29th and 30th
  }
  return schedule[dd];
}
