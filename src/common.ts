import {HDate, greg, gematriya} from '@hebcal/hdate';

/**
 * @private
 * @param date - Hebrew or Gregorian date
 */
export function getAbsDate(date: HDate | Date | number): number {
  let abs: number;
  if (typeof date === 'number') {
    abs = date;
  } else if (greg.isDate(date)) {
    abs = greg.greg2abs(date as Date);
  } else if (HDate.isHDate(date)) {
    abs = (date as HDate).abs();
  } else {
    abs = Number.NaN;
  }
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
  return s.replaceAll(/[׳״]/g, '');
}

export function isHebrewLocale(locale: string): boolean {
  return locale === 'he' || locale === 'he-x-nonikud';
}

/**
 * Builds a Sefaria URL of the form
 * `https://www.sefaria.org/{book}.{chapter}?lang=bi`.
 * Spaces in `book` are converted to underscores automatically.
 */
export function sefariaUrl(book: string, chapter: number | string): string {
  const slug = book.replaceAll(' ', '_');
  return `https://www.sefaria.org/${slug}.${chapter}?lang=bi`;
}
