import {HDate, greg} from '@hebcal/core';

/**
 * most daily learning APIs accept Hebrew or Gregorian dates
 */
export type DLDate = HDate | Date | number;

/**
 * @private
 * @param date - Hebrew or Gregorian date
 */
export function getAbsDate(date: DLDate): number {
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
