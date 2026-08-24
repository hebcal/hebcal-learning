import {abs2greg, gematriya, greg2abs, HDate, isDate} from '@hebcal/hdate';

/**
 * A date accepted by the learning schedule calculators: an {@link HDate}
 * (Hebrew date), a Gregorian `Date`, or an absolute (R.D.) day number.
 */
export type LearningDate = HDate | Date | number;

/**
 * Normalizes any {@link LearningDate} to an absolute (R.D., Rata Die) day
 * number, the integer count of days since the Gregorian epoch used internally
 * by all cycle calculations.
 *
 * A `number` is assumed to already be an R.D. value and returned as-is; a
 * `Date` and an {@link HDate} are converted accordingly.
 *
 * @private
 * @param date - Hebrew date, Gregorian date, or R.D. day number
 * @returns the absolute (R.D.) day number
 * @throws {TypeError} if `date` is not a recognized date type
 */
export function getAbsDate(date: LearningDate): number {
  let abs: number;
  if (typeof date === 'number') {
    abs = date;
  } else if (isDate(date)) {
    abs = greg2abs(date as Date);
  } else if (HDate.isHDate(date)) {
    abs = (date as HDate).abs();
  } else {
    abs = Number.NaN;
  }
  if (Number.isNaN(abs)) {
    throw new TypeError(`Invalid date: ${date}`);
  }
  return abs;
}

/**
 * Guards against querying a learning cycle before it began, throwing a
 * descriptive error naming the requested date and the cycle's start date.
 *
 * @private
 * @param abs - the requested date as an absolute (R.D.) day number
 * @param startAbs - the cycle's start date as an absolute (R.D.) day number
 * @param name - the cycle's display name, used in the error message
 * @throws {RangeError} if `abs` falls before `startAbs`
 */
export function checkTooEarly(abs: number, startAbs: number, name: string) {
  if (abs < startAbs) {
    const dt = abs2greg(abs);
    const dateStr = dt.toISOString().substring(0, 10);
    const startDt = abs2greg(startAbs);
    const startDateStr = startDt.toISOString().substring(0, 10);
    throw new RangeError(`Date ${dateStr} too early; ${name} cycle began on ${startDateStr}`);
  }
}

/**
 * Formats a range of two colon-delimited references (e.g. `chapter:verse`)
 * into a compact string, omitting the redundant leading component from the
 * end reference when both share the same chapter.
 *
 * @example
 * formatBeginEndRange('1:1', '1:5'); // => '1:1-5'   (same chapter)
 * formatBeginEndRange('1:1', '2:5'); // => '1:1-2:5' (spans chapters)
 *
 * @param begin - the start reference, e.g. `'1:1'`
 * @param end - the end reference, e.g. `'1:5'`
 * @returns the formatted `begin-end` range
 */
export function formatBeginEndRange(begin: string, end: string): string {
  const p1 = begin.split(':');
  const p2 = end.split(':');
  const verse2 = p1[0] === p2[0] ? p2[1] : p2.join(':');
  return begin + '-' + verse2;
}

/**
 * Renders a number as Hebrew-numeral gematriya, stripped of the punctuation
 * marks (geresh `׳` and gershayim `״`) that {@link gematriya} normally inserts.
 *
 * @example
 * gematriyaNN(5784); // => 'תשפד' (rather than 'תשפ״ד')
 *
 * @param num - the number to convert (or a numeric string)
 * @returns the gematriya string without geresh/gershayim
 */
export function gematriyaNN(num: number | string): string {
  const s = gematriya(num);
  return s.replaceAll(/[׳״]/g, '');
}

/**
 * Builds a bilingual (Hebrew/English) Sefaria URL of the form
 * `https://www.sefaria.org/{book}.{chapter}?lang=bi`. Spaces in `book` are
 * converted to underscores automatically to match Sefaria's URL slugs, and
 * commas are percent-encoded as `%2C`.
 *
 * @example
 * sefariaUrl('Jerusalem Talmud Shekalim', '2a');
 * // => 'https://www.sefaria.org/Jerusalem_Talmud_Shekalim.2a?lang=bi'
 *
 * @example
 * sefariaUrl('Shulchan Arukh, Orach Chayim', '460.2-3');
 * // => 'https://www.sefaria.org/Shulchan_Arukh%2C_Orach_Chayim.460.2-3?lang=bi'
 *
 * @param book - the Sefaria book name (spaces allowed)
 * @param chapter - the chapter, page, or verse reference
 * @returns the Sefaria URL
 */
export function sefariaUrl(book: string, chapter: number | string): string {
  const slug = book.replaceAll(' ', '_').replaceAll(',', '%2C');
  return `https://www.sefaria.org/${slug}.${chapter}?lang=bi`;
}
