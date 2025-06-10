import {HDate, greg, gematriya} from '@hebcal/core';

/**
 * @private
 * @param date - Hebrew or Gregorian date
 */
export function getAbsDate(date: HDate | Date | number): number {
  const abs =
    typeof date === 'number'
      ? date
      : greg.isDate(date)
        ? greg.greg2abs(date as Date)
        : HDate.isHDate(date)
          ? (date as HDate).abs()
          : NaN;
  if (isNaN(abs)) {
    throw new TypeError(`Invalid date: ${date}`);
  }
  return abs;
}

/**
 * @private
 * @param abs
 * @param startAbs
 * @param name
 */
export function checkTooEarly(abs: number, startAbs: number, name: string) {
  if (abs < startAbs) {
    const dt = greg.abs2greg(abs);
    const dateStr = dt.toISOString().substring(0, 10);
    const startDt = greg.abs2greg(startAbs);
    const startDateStr = startDt.toISOString().substring(0, 10);
    throw new RangeError(
      `Date ${dateStr} too early; ${name} cycle began on ${startDateStr}`
    );
  }
}

export function formatBeginEndRange(begin: string, end: string): string {
  const p1 = begin.split(':');
  const p2 = end.split(':');
  const verse2 = p1[0] === p2[0] ? p2[1] : p2.join(':');
  return begin + '-' + verse2;
}

/**
 * Gematriya without nikkud (geresh or gershayim)
 */
export function gematriyaNN(num: number | string): string {
  const s = gematriya(num);
  return s.replace(/[׳״]/g, '');
}
