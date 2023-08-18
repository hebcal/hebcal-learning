import {HDate, greg} from '@hebcal/core';

/**
 * @private
 * @param {string} msg
 */
function throwTypeError(msg) {
  throw new TypeError(msg);
}

/**
 * @private
 * @param {HDate|Date|number} date - Hebrew or Gregorian date
 * @return {number}
 */
export function getAbsDate(date) {
  const abs = (typeof date === 'number' && !isNaN(date)) ? date :
    greg.isDate(date) ? greg.greg2abs(date) :
    HDate.isHDate(date) ? date.abs() :
    throwTypeError(`Invalid date: ${date}`);
  return abs;
}

/**
 * @private
 * @param {number} abs
 * @param {number} startAbs
 * @param {string} name
 */
export function checkTooEarly(abs, startAbs, name) {
  if (abs < startAbs) {
    const dt = greg.abs2greg(abs);
    const dateStr = dt.toISOString().substring(0, 10);
    const startDt = greg.abs2greg(startAbs);
    const startDateStr = startDt.toISOString().substring(0, 10);
    throw new RangeError(`Date ${dateStr} too early; ${name} cycle began on ${startDateStr}`);
  }
}
