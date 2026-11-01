import {HDate, greg2abs, months, Locale, hebrew2abs, isLeapYear} from '@hebcal/hdate';
import QuickLRU from 'quick-lru';
import {DafPage} from './DafPage.js';
import {type LearningDate, checkTooEarly, gematriyaNN} from './common.js';
import masoretic0 from './masoretic.json.js';
import './locale.js';

const masoretic: {
  split: Record<string, Record<string, string>>;
  regular: Record<string, string[]>;
} = masoretic0;

// Cycle starts 23 Tishrei (day after Shmini Atzeret in Israel)
// Sunday, Oct 11, 2020
// Tuesday, Oct 26, 1948
const startDate = new Date(1948, 9, 26);
export const tanakhYomiStart = greg2abs(startDate);

const JOSHUA = 'Joshua';
const JEREMIAH = 'Jeremiah';
const RUTH = 'Ruth';
const SHIR_HASHIRIM = 'Song of Songs';

type Daf = {
  name: string;
  blatt: number;
};

const books: Daf[] = (
  [
    [JOSHUA, 14],
    ['Judges', 14],
    ['Samuel', 34],
    ['Kings', 35],
    ['Isaiah', 26],
    [JEREMIAH, 31],
    ['Ezekiel', 29],
    ['Minor Prophets', 21], // תרי עשר
    ['Psalms', 19],
    ['Proverbs', 8],
    ['Job', 8],
    [SHIR_HASHIRIM, 1],
    [RUTH, 1], // רות ס' א1, רות ס' א2
    ['Lamentations', 1],
    ['Ecclesiastes', 4],
    ['Esther', 5],
    ['Daniel', 7],
    ['Ezra and Nehemiah', 10],
    ['Chronicles', 25],
    ['Chronicles', 25],
  ] satisfies [string, number][]
).map(([name, blatt]) => ({name, blatt}));

/**
 * Calculates the Tanakh Yomi reading for the given date.
 *
 * Tanakh Yomi is a learning cycle for completing Tanakh annually
 * according to the ancient Masoretic division of sedarim. The cycle
 * began on **26 October 1948** (23 Tishrei 5709) and repeats each
 * Hebrew year, starting on 23 Tishrei (the day after Shmini Atzeret
 * in Israel).
 *
 * The schedule skips Shabbat and the major festivals (Pesach 1/7,
 * Shavuot, Rosh Hashana, Yom Kippur, Sukkot 1, Shmini Atzeret,
 * Purim, Yom HaAtzma'ut, Tish'a B'Av).
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @returns A {@link TanakhYomi} (a {@link DafPage} subclass) for the
 *   reading day, or `null` on Shabbat and on any of the skipped
 *   holidays listed above. The `verses` property holds the Masoretic
 *   verse range.
 * @throws {RangeError} if `date` is before 26 October 1948.
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
 */
export function tanakhYomi(date: LearningDate): TanakhYomi | null {
  const hd: HDate = HDate.isHDate(date) ? (date as HDate) : new HDate(date);
  if (skipDay(hd)) {
    return null;
  }
  const cday = hd.abs();
  checkTooEarly(cday, tanakhYomiStart, 'Tanakh Yomi');
  const hyear = hd.getFullYear();
  const rh = hebrew2abs(hyear, months.TISHREI, 1);
  const startAbs = rh + 22;
  if (cday < startAbs) {
    return endOfPreviousCycle(hd, rh);
  }
  let total = countReadingDays(startAbs, cday);
  const readings = makeReadingTable(hyear);
  for (const {name, blatt} of readings.table) {
    if (total < blatt) {
      return new TanakhYomi(name, sederFor(readings, name, total + 1));
    }
    total -= blatt;
  }
  throw new Error(`Interal error with ${hd.toString()}`);
}

/**
 * Between Rosh Hashana and Shmini Atzeret the previous year's cycle is
 * still finishing the second half of Chronicles.
 * @private
 */
function endOfPreviousCycle(hd: HDate, rh: number): TanakhYomi {
  const rhDow = rh % 7;
  let blatt = 12;
  if (rhDow === 4) {
    blatt = 11;
  } else if (rhDow === 6) {
    blatt = 10;
  }
  blatt += countReadingDays(rh + 2, hd.abs());
  if (blatt === 26) {
    throw new Error(`${hd.toString()} Chronicles ${blatt}`);
  }
  return new TanakhYomi('Chronicles', blatt);
}

/**
 * Maps the 1-based day within a book to its seder, accounting for the
 * books that a longer year stretches over an extra day.
 * @private
 */
function sederFor(readings: ReadingsForYear, name: string, day: number): number | string {
  if (
    (readings.longShirHaShirim && name === SHIR_HASHIRIM) ||
    (readings.longRuth && name === RUTH)
  ) {
    return '1.' + day;
  }
  if (readings.longJoshua && name === JOSHUA) {
    return splitSeder(day, 4);
  }
  if (readings.longJeremiah && name === JEREMIAH) {
    return splitSeder(day, 9);
  }
  return day;
}

/**
 * For a book where seder `splitAt` is read over two days (as
 * `"<splitAt>.1"` and `"<splitAt>.2"`), maps the 1-based day within the
 * book to its seder.
 * @private
 */
function splitSeder(day: number, splitAt: number): number | string {
  if (day < splitAt) {
    return day;
  } else if (day === splitAt) {
    return `${splitAt}.1`;
  } else if (day === splitAt + 1) {
    return `${splitAt}.2`;
  }
  return day - 1;
}

/**
 * @private
 */
function skipDay(hd: HDate): boolean {
  const dow = hd.getDay();
  if (dow === 6) {
    return true;
  }
  const mm = hd.getMonth();
  const dd = hd.getDate();
  switch (mm) {
    case months.TISHREI:
      // Rosh Hashana, Yom Kippur, Sukkot 1, Shmini Atzeret (Israel)
      return dd === 1 || dd === 2 || dd === 10 || dd === 15 || dd === 22;
    case months.NISAN:
      // Pesach 1 and 7 (Israel)
      return dd === 15 || dd === 21;
    case months.IYYAR:
      return dd === yomHaAtzmautDay(hd.getFullYear());
    case months.SIVAN:
      // Shavuot (Israel)
      return dd === 6;
    case months.AV:
      // Tish'a B'Av, or observed on 10 Av when 9 Av is Shabbat
      return dd === 9 || (dd === 10 && dow === 0);
    case months.ADAR_I:
      return dd === 14 && !isLeapYear(hd.getFullYear());
    case months.ADAR_II:
      return dd === 14;
    default:
      return false;
  }
}

/**
 * Day of Iyyar on which Yom HaAtzma'ut is observed: 5 Iyyar, moved
 * earlier to Thursday when it would fall on Friday or Shabbat, and
 * (from 5764) moved from Monday to Tuesday so Yom HaZikaron does not
 * begin on Motzei Shabbat. Mirrors `dateYomHaZikaron` in @hebcal/core.
 * @private
 */
function yomHaAtzmautDay(year: number): number {
  const pdow = hebrew2abs(year, months.NISAN, 15) % 7;
  if (pdow === 0) {
    return 3;
  } else if (pdow === 6) {
    return 4;
  } else if (year >= 5764 && pdow === 2) {
    return 6;
  }
  return 5;
}

type YearReadingDays = {
  /** Absolute day number of 1 Tishrei */
  rh: number;
  /** Length of the Hebrew year in days */
  len: number;
  /** `prefix[i]` is the number of reading days in `[rh, rh + i)` */
  prefix: Int32Array;
};

/** Keeps the caches bounded when callers sweep across many years. @private */
const MAX_CACHED_YEARS = 64;

/**
 * Counting reading days one at a time costs hundreds of `skipDay` calls per
 * query. Instead, resolve a whole Hebrew year at once and cache the prefix
 * sums, so that repeated queries -- overwhelmingly for dates in the same
 * year or two -- reduce to array subtraction.
 * @private
 */
const yearCache = new QuickLRU<number, YearReadingDays>({maxSize: MAX_CACHED_YEARS});

/**
 * @private
 */
function getYearReadingDays(year: number): YearReadingDays {
  const cached = yearCache.get(year);
  if (cached) {
    return cached;
  }
  const rh = hebrew2abs(year, months.TISHREI, 1);
  const len = hebrew2abs(year + 1, months.TISHREI, 1) - rh;
  const prefix = new Int32Array(len + 1);
  let count = 0;
  for (let i = 0; i < len; i++) {
    prefix[i] = count;
    if (!skipDay(new HDate(rh + i))) {
      count++;
    }
  }
  prefix[len] = count;
  const info: YearReadingDays = {rh, len, prefix};
  yearCache.set(year, info);
  return info;
}

/**
 * Number of reading days (days that are not skipped) in the half-open
 * range `[startAbs, endAbs)`.
 * @private
 */
function countReadingDays(startAbs: number, endAbs: number): number {
  let count = 0;
  let abs = startAbs;
  while (abs < endAbs) {
    const info = getYearReadingDays(new HDate(abs).getFullYear());
    const stop = Math.min(endAbs, info.rh + info.len);
    count += info.prefix[stop - info.rh] - info.prefix[abs - info.rh];
    abs = stop;
  }
  return count;
}

/**
 * @private
 */
function calculateNumDaysToRead(year: number): number {
  const startAbs = hebrew2abs(year, months.TISHREI, 23);
  const endAbs = hebrew2abs(year + 1, months.TISHREI, 22);
  return countReadingDays(startAbs, endAbs + 1);
}

type ReadingsForYear = {
  numDays: number;
  table: Daf[];
  longRuth: boolean;
  longShirHaShirim: boolean;
  longJeremiah: boolean;
  longJoshua: boolean;
};

/**
 * A common year can have a length of 353, 354 or 355 days
 * A leap year can have a length of 383, 384 or 385 days
 *
 * Common years can have
 *   293 chapters - no extra chapters (45%)
 *   294 chapters - 1 extra chapter (5%)
 *   295 chapters - 2 extra chapters (31%)
 *   296 chapters - 3 extra chapters (19%)
 * Leap years can have
 *   318 chapters - no extra chapters (10%)
 *   319 chapters - 1 extra chapter (30%)
 *   320 chapters - 2 extra chapters (47%)
 *   222 chapters - 4 extra chapters (12%)
 *
 * @private
 */
const readingTableCache = new QuickLRU<number, ReadingsForYear>({maxSize: MAX_CACHED_YEARS});

function makeReadingTable(year: number): ReadingsForYear {
  const cached = readingTableCache.get(year);
  if (cached) {
    return cached;
  }
  const result = buildReadingTable(year);
  readingTableCache.set(year, result);
  return result;
}

/**
 * @private
 */
function buildReadingTable(year: number): ReadingsForYear {
  const numDays = calculateNumDaysToRead(year);
  const count = isLeapYear(year) ? numDays - 25 : numDays;
  const extra = count - 293;
  const table = books.slice();
  const result: ReadingsForYear = {
    numDays,
    table,
    longRuth: false,
    longShirHaShirim: false,
    longJeremiah: false,
    longJoshua: false,
  };
  switch (extra) {
    case 0:
      return result;
    case 4:
      // Joshua 4 gets split across two days
      table[0] = {name: JOSHUA, blatt: 15};
      result.longJoshua = true;
    /* FALLTHROUGH */
    case 3:
      // Jeremiah 9 gets split across two days
      table[5] = {name: JEREMIAH, blatt: 32};
      result.longJeremiah = true;
    /* FALLTHROUGH */
    case 2:
      // Shir HaShirim gets 2 days
      table[11] = {name: SHIR_HASHIRIM, blatt: 2};
      result.longShirHaShirim = true;
    /* FALLTHROUGH */
    case 1:
      // Ruth gets 2 days
      table[12] = {name: RUTH, blatt: 2};
      result.longRuth = true;
      break;
    default:
      throw new Error(`${year} => ${numDays} ${count} ${extra}`);
  }
  return result;
}

function masoreticVerses(name: string, blatt: number | string): string {
  if (typeof blatt === 'number') {
    return masoretic.regular[name][blatt - 1];
  }
  return masoretic.split[name][blatt];
}

/**
 * One day's reading in the Tanakh Yomi cycle — a single Masoretic
 * seder (verse range) within one of the books of Tanakh.
 *
 * Inherits {@link DafPage}'s `name` (book) and `blatt` (seder
 * number); the `verses` property is set to the verse range string,
 * e.g. `"Joshua 1:1-3:6"`, or `"Hosea 14:6-Joel 2:26"` for a seder that
 * runs into the next book.
 */
export class TanakhYomi extends DafPage {
  readonly verses: string;
  /**
   * Builds a TanakhYomi for the given book and seder number.
   * Throws if `(name, blatt)` is not a valid seder in the Masoretic
   * table — call {@link tanakhYomi} to compute the right values from
   * a date instead of constructing directly.
   */
  constructor(name: string, blatt: number | string) {
    super(name, blatt);
    const verses = masoreticVerses(name, blatt);
    if (!verses) {
      throw new Error(`${name} ${blatt}`);
    }
    const ch = verses.codePointAt(0)!;
    this.verses = ch >= 48 && ch <= 57 ? `${name} ${verses}` : verses;
  }

  /**
   * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  override render(locale?: string): string {
    const name = Locale.gettext(this.name, locale);
    const blatt = this.blatt;
    if (Locale.isHebrewLocale(locale)) {
      const prefix = name + ' ס׳ ';
      if (typeof blatt === 'string') {
        const major = blatt[0];
        const minor = blatt[2];
        return prefix + gematriyaNN(+major) + minor;
      }
      return prefix + gematriyaNN(blatt);
    }
    return name + ' Seder ' + blatt;
  }
}
