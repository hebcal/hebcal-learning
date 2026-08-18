import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common.js';
import dafHalachaJson from './dirshuDafHalacha.json.js';

/*
 * The schedule began on Tuesday, 11 June 2024 = 5 Sivan 5784, on the first
 * amud of the volume that opens Hilchot Shabbat (Orach Chayim 242). This
 * date belongs to `readings[0]`, so the two must be updated together when
 * newer luach booklets are transcribed.
 */
const startDate = new Date(2024, 5, 11);
export const dirshuDafHalachaStart = greg.greg2abs(startDate);

/**
 * One entry per learning day (Sunday through Thursday), in order from
 * `dirshuDafHalachaStart`. Each is a `begin` or `begin-end` reference into
 * Shulchan Arukh, Orach Chayim.
 */
const readings: string[] = dafHalachaJson.readings;

/**
 * Indices into `readings` at which the Dirshu Mishnah Berurah starts a new
 * volume, and its page numbering restarts at daf 2a.
 */
const volumes: number[] = dafHalachaJson.volumes;

/** Sunday on or before `dirshuDafHalachaStart` (R.D. `n % 7 === 0` is a Sunday) */
const week0 = dirshuDafHalachaStart - (dirshuDafHalachaStart % 7);

/**
 * How many learning days of that first (partial) week precede the start.
 * The schedule opened on a Tuesday, so this is 2.
 */
const startOrdinal = dirshuDafHalachaStart - week0;

/**
 * Counts learning days (Sunday through Thursday) from `week0`.
 * Only meaningful when `abs` is itself a learning day.
 */
function ordinal(abs: number): number {
  const n = abs - week0;
  const week = Math.floor(n / 7);
  return week * 5 + (n - week * 7);
}

/** Inverse of {@link ordinal}: R.D. of the nth learning day counted from `week0` */
function learningDayAbs(n: number): number {
  return week0 + Math.floor(n / 5) * 7 + (n % 5);
}

/**
 * R.D. of the last date covered by the published luach booklets — the Shabbat
 * that closes the week of the final transcribed learning day.
 */
export const dirshuDafHalachaEnd = learningDayAbs(readings.length - 1 + startOrdinal) + 2;

/**
 * One day of the Dirshu Daf HaYomi B'Halacha schedule.
 *
 * References are to Shulchan Arukh, Orach Chayim: `"345:1"` is siman 345,
 * se'if 1. A reference without a se'if (e.g. `"361"`) covers that siman in
 * its entirety.
 */
export type DirshuDafHalacha = {
  /** Beginning of the day's reading, e.g. `"345:1"` or `"361"`. */
  b: string;
  /** End of the day's reading, or `undefined` when `b` covers the whole day. */
  e?: string;
  /**
   * `true` on Friday and Shabbat, when the program reviews (chazarah) the
   * five days just completed instead of covering new ground.
   */
  review: boolean;
  /**
   * Page (daf) of the Dirshu Mishnah Berurah, or `undefined` on review days.
   * Numbering restarts at 2 with each volume of the edition.
   */
  daf?: number;
  /** Side of the daf, `"a"` or `"b"`; `undefined` on review days. */
  side?: 'a' | 'b';
};

function splitReading(str: string): [string, string | undefined] {
  const idx = str.indexOf('-');
  return idx === -1 ? [str, undefined] : [str.substring(0, idx), str.substring(idx + 1)];
}

function amudFor(idx: number): {daf: number; side: 'a' | 'b'} {
  let volStart = volumes[0];
  for (const v of volumes) {
    if (v > idx) break;
    volStart = v;
  }
  const n = idx - volStart;
  return {daf: 2 + Math.floor(n / 2), side: n % 2 === 0 ? 'a' : 'b'};
}

/**
 * Calculates the Dirshu Daf HaYomi B'Halacha reading for the given date.
 *
 * Daf HaYomi B'Halacha is Dirshu's daily program in the Mishnah Berurah,
 * covering one amud of the Dirshu edition on each of Sunday through
 * Thursday (Yom Tov included — the schedule never skips a weekday) and
 * reviewing that week's five days on Friday and Shabbat.
 *
 * The readings are transcribed from Dirshu's published luach booklets and
 * run from Tuesday, **11 June 2024** (5 Sivan 5784, the opening of Hilchot
 * Shabbat) through **12 September 2026**. Dates after the last
 * transcribed source return `null` until a newer luach is transcribed.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns A {@link DirshuDafHalacha}, or `null` for a date beyond the
 *   published schedule (and for the Friday and Shabbat of the opening
 *   partial week, which the luach leaves blank).
 * @throws {RangeError} if `date` is before 11 June 2024.
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
 */
export function dirshuDafHalacha(date: HDate | Date | number): DirshuDafHalacha | null {
  const cday = getAbsDate(date);
  checkTooEarly(cday, dirshuDafHalachaStart, "Daf HaYomi B'Halacha");
  const dow = cday % 7; // 0=Sunday
  if (dow < 5) {
    const idx = ordinal(cday) - startOrdinal;
    if (idx >= readings.length) {
      return null;
    }
    const [b, e] = splitReading(readings[idx]);
    return {b, e, review: false, ...amudFor(idx)};
  }
  // Friday and Shabbat review the Sunday through Thursday just completed
  const first = ordinal(cday - dow) - startOrdinal;
  const last = first + 4;
  if (first < 0 || last >= readings.length) {
    return null;
  }
  const [b] = splitReading(readings[first]);
  const [lastB, lastE] = splitReading(readings[last]);
  const e = lastE ?? lastB;
  return {b, e: e === b ? undefined : e, review: true};
}
