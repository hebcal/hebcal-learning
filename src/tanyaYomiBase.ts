import {HDate, months} from '@hebcal/hdate';
import type {LearningDate} from './common.js';
import tanyaYomiJson from './tanyaYomi.json.js';

/**
 * One day's Tanya Yomi portion, described by where it begins.
 */
export type TanyaYomiReading = {
  /**
   * The book (one of Tanya's five parts) in Sefaria's naming, e.g.
   * `"Likkutei Amarim"`, `"Shaar HaYichud VehaEmunah"`,
   * `"Iggeret HaTeshuvah"`, `"Iggeret HaKodesh"` or `"Kuntres Acharon"`.
   */
  book: string;
  /**
   * Un-numbered front matter within the book, when the portion begins in
   * one: `"Title Page"`, `"Approbation"`, `"Compiler's Foreword"` (all in
   * Likkutei Amarim) or `"Chinukh Katan"` (Shaar HaYichud VehaEmunah).
   */
  section?: string;
  /**
   * Chapter (Likkutei Amarim, Shaar HaYichud VehaEmunah, Iggeret
   * HaTeshuvah), epistle (Iggeret HaKodesh) or essay (Kuntres Acharon)
   * where the portion begins. For front matter, the approbation number
   * when there is one.
   */
  chap?: number;
  /**
   * Sefaria segment (paragraph) where the portion begins. The portions
   * are delimited by phrases, so the day's study generally starts
   * part-way through this paragraph.
   */
  verse: number;
};

const PARTS: Record<string, string> = {
  'Likkutei Amarim': 'Part I',
  'Shaar HaYichud VehaEmunah': 'Part II',
  'Iggeret HaTeshuvah': 'Part III',
  'Iggeret HaKodesh': 'Part IV',
  'Kuntres Acharon': 'Part V',
};

/** Book abbreviations used in `tanyaYomi.json` to keep the bundle small */
const BOOKS: Record<string, string> = {
  LA: 'Likkutei Amarim',
  SY: 'Shaar HaYichud VehaEmunah',
  IT: 'Iggeret HaTeshuvah',
  IK: 'Iggeret HaKodesh',
  KA: 'Kuntres Acharon',
};

type MonthTable = Record<string, string[]>;
const tables = tanyaYomiJson as {regular: MonthTable; leap: MonthTable};

/** Day of Kislev on which each year's cycle begins */
const CYCLE_START_KISLEV = 19;

/**
 * Returns the Hebrew year in which the Tanya Yomi cycle containing `hd`
 * began (on 19 Kislev).
 */
function cycleYear(hd: HDate): number {
  const mm = hd.getMonth();
  const year = hd.getFullYear();
  if (
    mm === months.TISHREI ||
    mm === months.CHESHVAN ||
    (mm === months.KISLEV && hd.getDate() < CYCLE_START_KISLEV)
  ) {
    return year - 1;
  }
  return year;
}

function parseRef(ref: string): TanyaYomiReading {
  // "LA 33:6", "KA 3:1", "LA, Compiler's Foreword 9", "LA, Approbation 3:1"
  const m = /^([^,]+?)(?:, ([^\d]+?))? (\d+)(?::(\d+))?$/.exec(ref);
  if (!m) {
    throw new Error(`Unparseable Tanya ref: ${ref}`);
  }
  const [, abbr, section, n1, n2] = m;
  const book = BOOKS[abbr];
  const reading: TanyaYomiReading =
    n2 === undefined ? {book, verse: Number(n1)} : {book, chap: Number(n1), verse: Number(n2)};
  if (section) {
    reading.section = section;
  }
  return reading;
}

/**
 * Returns the full Sefaria reference for a reading, e.g.
 * `"Tanya, Part I; Likkutei Amarim 33:6"`.
 */
export function tanyaYomiSefariaRef(reading: TanyaYomiReading): string {
  let ref = `Tanya, ${PARTS[reading.book]}; ${reading.book}`;
  if (reading.section) {
    ref += `, ${reading.section}`;
  }
  ref += ' ';
  if (reading.chap !== undefined) {
    ref += `${reading.chap}:`;
  }
  return ref + reading.verse;
}

/**
 * Returns the Tanya Yomi portion for the given date.
 *
 * Tanya Yomi is the daily study of all five parts of the Tanya over the
 * course of a year, as listed in *Hayom Yom*. It is the “T” of the Chabad
 * daily *Chitas* (Chumash, Tehillim, Tanya). The cycle begins every year on
 * **19 Kislev**, “Rosh Hashanah of Chasidut”, with the title page of
 * Likkutei Amarim, and ends on **18 Kislev** with Kuntres Acharon.
 *
 * The schedule is perpetual: each portion is tied to a Hebrew month and
 * day. There is one division for cycles whose year has an Adar II, and
 * another for regular cycles, chosen by the year in which the cycle began.
 * In a year when Cheshvan or Kislev has only 29 days, the portion for the
 * 30th is studied together with the 29th; the returned reading is where
 * that day's study begins.
 *
 * Readings were transcribed from Sefaria's Tanya Yomi calendar, which
 * gives the paragraph on which each portion begins (see
 * `tools/tanya-yomi/`).
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns the {@link TanyaYomiReading} for that day
 * @throws {TypeError} (indirectly, via the `HDate` constructor) if
 *   `date` is not an `HDate`, `Date`, or finite number.
 */
export function tanyaYomi(date: LearningDate): TanyaYomiReading {
  const hd = new HDate(date);
  const table = HDate.isLeapYear(cycleYear(hd)) ? tables.leap : tables.regular;
  const ref = table[hd.getMonthName()]?.[hd.getDate() - 1];
  if (!ref) {
    // this shouldn't happen
    throw new Error(`No Tanya Yomi reading found for ${hd.toString()}`);
  }
  return parseRef(ref);
}
