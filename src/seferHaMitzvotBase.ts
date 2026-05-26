import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import seferHaMitzvotJson from './seferHaMitzvot.json';

/**
 * One day's reading in the Sefer Hamitzvos (Daily Mitzvah) calendar.
 */
export type SeferHaMitzvotReading = {
  /** 1-based day number within the 339-day cycle. */
  day: number;
  /**
   * The day's mitzvah list, encoded as a single comma-separated
   * string of Maimonides' mitzvah references (e.g. `"P186, N10, N47"`
   * — `P` = Positive Commandment, `N` = Negative Commandment). The
   * {@link SeferHaMitzvotEvent} `render()` method expands this for
   * display.
   */
  reading: string;
  /**
   * Optional explanatory note. Present only on the handful of days
   * (140, 161, 258, 259) where editions of the Sefer Hamitzvot
   * Schedule disagree about which mitzvah is studied; the note
   * describes the alternative.
   */
  note?: string;
};

const cycleLen = seferHaMitzvotJson.length; // 339

const cycleStartDate = new Date(1984, 3, 29);
export const seferHaMitzvotStart = greg.greg2abs(cycleStartDate);

const notes: Record<number, number[]> = {
  '140': [148, 149, 161],
  '161': [149, 148, 140],
  '258': [296, 295, 259],
  '259': [295, 296, 258],
} as const;

function getNote(day: number): string | undefined {
  const arr = notes[day];
  if (!arr) {
    return undefined;
  }
  const [nm1, nm2, otherDay] = arr;
  return `In some editions of the Sefer Hamitzvot Schedule, today’s Sefer Hamitzvot (Day ${day}) has Negative Mitzvah ${nm1} listed instead of Negative Mitzvah ${nm2} (and Day ${otherDay} has Negative Mitzvah ${nm2} instead of ${nm1})`;
}

/**
 * Returns the Sefer Hamitzvos (Daily Mitzvah) reading for the given
 * date.
 *
 * Daily study of one of Maimonides' 613 mitzvot, grouped into a
 * 339-day cycle that completes the entire Sefer Hamitzvos. The cycle
 * began on Sunday, **29 April 1984** (27 Nisan 5744) and repeats
 * indefinitely.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns A {@link SeferHaMitzvotReading} `{day, reading, note?}`.
 *   Always returns a reading once the cycle has begun; there are no
 *   skip days.
 * @throws {RangeError} if `date` is before 29 April 1984.
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
 */
export function seferHaMitzvot(
  date: HDate | Date | number
): SeferHaMitzvotReading {
  const cday = getAbsDate(date);
  checkTooEarly(cday, seferHaMitzvotStart, 'Sefer Hamitzvot');
  const day0 = (cday - seferHaMitzvotStart) % cycleLen;
  const reading: string = seferHaMitzvotJson[day0];
  const day = day0 + 1;
  const result: SeferHaMitzvotReading = {day, reading};
  const note = getNote(day);
  if (note) {
    result.note = note;
  }
  return result;
}
