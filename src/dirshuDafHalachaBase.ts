import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common.js';
import dafHalachaJson from './dirshuDafHalacha.json.js';

/*
 * The third cycle began on Sunday, 20 February 2022 = 19 Adar I 5782, at the
 * start of siman 1, immediately after the second cycle's last learning day
 * (Thursday 17 February 2022, which ended "at the end of the Mishnah Berurah").
 * This date belongs to `readings[0]`, so the two must be updated together.
 */
const startDate = new Date(2022, 1, 20);
export const dirshuDafHalachaStart = greg.greg2abs(startDate);

/**
 * One entry per learning day (Sunday through Thursday), in order from
 * `dirshuDafHalachaStart`. Each is a `begin` or `begin-end` reference into
 * Shulchan Arukh, Orach Chayim.
 */
const readings: string[] = dafHalachaJson.readings;

/**
 * Where the amud is known, and how to count it.
 *
 * Only some of the sources print the page of the Dirshu Mishnah Berurah, so it
 * can be given from `from` onward and not before. `volumes` are the indices at
 * which the edition starts a new volume and its numbering restarts at daf 2a.
 * `extra` records the one day that covers more than a single amud — the day
 * printed "ל. לא." — after which every amud shifts by a full daf.
 */
const amudFrom: number = dafHalachaJson.amud.from;
const amudVolumes: number[] = dafHalachaJson.amud.volumes;
const amudExtra: [number, number][] = Object.entries(dafHalachaJson.amud.extra).map(([idx, n]) => [
  Number(idx),
  n as number,
]);

/** Sunday on or before `dirshuDafHalachaStart` (R.D. `n % 7 === 0` is a Sunday) */
const week0 = dirshuDafHalachaStart - (dirshuDafHalachaStart % 7);

/**
 * How many learning days of that first week precede the start. The cycle opened
 * on a Sunday, so this is 0.
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
 * R.D. of the last date covered by the transcribed sources. The final week is
 * partial, so this is the last learning day rather than the Shabbat after it:
 * a review needs all five of its week's days to exist.
 */
export const dirshuDafHalachaEnd = learningDayAbs(readings.length - 1 + startOrdinal);

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
   * Page (daf) of the Dirshu Mishnah Berurah. `undefined` on review days, and
   * on learning days before 11 June 2024 — the earlier sources are Hebrew
   * luachs and wall calendars, which print the reading but not the page.
   * Numbering restarts at 2 with each volume of the edition.
   */
  daf?: number;
  /** Side of the daf, `"a"` or `"b"`; `undefined` whenever `daf` is. */
  side?: 'a' | 'b';
};

function splitReading(str: string): [string, string | undefined] {
  const idx = str.indexOf('-');
  return idx === -1 ? [str, undefined] : [str.substring(0, idx), str.substring(idx + 1)];
}

function amudFor(idx: number): {daf: number; side: 'a' | 'b'} | Record<string, never> {
  if (idx < amudFrom) {
    return {};
  }
  let volStart = amudVolumes[0];
  for (const v of amudVolumes) {
    if (v > idx) break;
    volStart = v;
  }
  let n = idx - volStart;
  for (const [at, count] of amudExtra) {
    if (at >= volStart && at < idx) n += count;
  }
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
 * The readings are transcribed from Dirshu's luach booklets, Hebrew pocket
 * luachs and wall calendars, and run from the third cycle's first day —
 * Sunday, **20 February 2022** (19 Adar I 5782) — through **31 August 2027**.
 * Dates after the last transcribed source return `null`.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns A {@link DirshuDafHalacha}, or `null` for a date beyond the
 *   transcribed schedule.
 * @throws {RangeError} if `date` is before 20 February 2022.
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
