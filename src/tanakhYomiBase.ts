import {HDate, greg, months} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {flags} from '@hebcal/core/dist/esm/event';
import {getHolidaysOnDate} from '@hebcal/core/dist/esm/holidays';
import {DafPage} from './DafPage';
import {checkTooEarly, gematriyaNN} from './common';
import masoretic0 from './masoretic.json';
import './locale';

const masoretic: {
  split: Record<string, any>;
  regular: Record<string, any>;
} = masoretic0;

// Cycle starts 23 Tishrei (day after Shmini Atzeret in Israel)
// Sunday, Oct 11, 2020
// Tuesday, Oct 26, 1948
const startDate = new Date(1948, 9, 26);
export const tanakhYomiStart = greg.greg2abs(startDate);

const JOSHUA = 'Joshua';
const JEREMIAH = 'Jeremiah';
const RUTH = 'Ruth';
const SHIR_HASHIRIM = 'Song of Songs';

type Daf = {
  name: string;
  blatt: number;
};

const books: Daf[] = [
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
].map(m => {
  return {name: m[0] as string, blatt: m[1] as number};
});

// Also Pesach 1 and 7, Shavuot, RH 1 and 2, YK, Sukkot 1, Shmini Atz,
const toSkip = new Set([
  'Purim',
  "Yom HaAtzma'ut",
  "Tish'a B'Av",
  "Tish'a B'Av (observed)",
]);

/**
 * Calculates Tanakh Yomi.
 * @param date - Hebrew or Gregorian date
 */
export function tanakhYomi(date: HDate | Date | number): TanakhYomi | null {
  const hd: HDate = HDate.isHDate(date) ? (date as HDate) : new HDate(date);
  if (skipDay(hd)) {
    return null;
  }
  const cday = hd.abs();
  checkTooEarly(cday, tanakhYomiStart, 'Tanakh Yomi');
  const hyear = hd.getFullYear();
  const rh = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const startAbs = rh + 22;
  if (cday < startAbs) {
    const rhDow = rh % 7;
    let blatt = rhDow === 4 ? 11 : rhDow === 6 ? 10 : 12;
    for (let i = rh + 2; i < cday; i++) {
      const hdate = new HDate(i);
      if (!skipDay(hdate)) {
        blatt++;
      }
    }
    if (blatt === 26) {
      throw new Error(`${hd.toString()} Chronicles ${blatt}`);
    }
    return new TanakhYomi('Chronicles', blatt);
  }
  let total = 0;
  for (let i = startAbs; i < cday; i++) {
    const hdate = new HDate(i);
    if (!skipDay(hdate)) {
      total++;
    }
  }
  const readingTable = makeReadingTable(hyear);
  const table = readingTable.table;

  for (const element of table) {
    if (total < element.blatt) {
      const blatt = total + 1;
      const name = element.name;
      if (
        (readingTable.longShirHaShirim && name === SHIR_HASHIRIM) ||
        (readingTable.longRuth && name === RUTH)
      ) {
        return new TanakhYomi(name, '1.' + blatt);
      }
      if (readingTable.longJoshua && name === JOSHUA && blatt >= 4) {
        if (blatt === 4) {
          return new TanakhYomi(name, '4.1');
        } else if (blatt === 5) {
          return new TanakhYomi(name, '4.2');
        } else {
          return new TanakhYomi(name, blatt - 1);
        }
      }
      if (readingTable.longJeremiah && name === JEREMIAH && blatt >= 9) {
        if (blatt === 9) {
          return new TanakhYomi(name, '9.1');
        } else if (blatt === 10) {
          return new TanakhYomi(name, '9.2');
        } else {
          return new TanakhYomi(name, blatt - 1);
        }
      }
      return new TanakhYomi(name, blatt);
    }
    total -= element.blatt;
  }
  throw new Error(`Interal error with ${hd.toString()}`);
}

/**
 * @private
 */
function skipDay(hd: HDate): boolean {
  if (hd.getDay() === 6) {
    return true;
  }
  const holidays = getHolidaysOnDate(hd, true);
  if (!holidays) {
    return false;
  }
  for (const ev of holidays) {
    if (ev.getFlags() & flags.CHAG) {
      return true;
    } else if (toSkip.has(ev.getDesc())) {
      return true;
    }
  }
  return false;
}

/**
 * @private
 */
function calculateNumDaysToRead(year: number): number {
  const startAbs = HDate.hebrew2abs(year, months.TISHREI, 23);
  const endAbs = HDate.hebrew2abs(year + 1, months.TISHREI, 22);
  let included = 0;
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const hdate = new HDate(abs);
    if (!skipDay(hdate)) {
      included++;
    }
  }
  return included;
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
function makeReadingTable(year: number): ReadingsForYear {
  const numDays = calculateNumDaysToRead(year);
  const count = HDate.isLeapYear(year) ? numDays - 25 : numDays;
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

/**
 * Returns the Daf Yomi for given date
 */
export class TanakhYomi extends DafPage {
  /**
   * Initializes a daf yomi instance
   * @param name
   * @param blatt
   */
  constructor(name: string, blatt: number | string) {
    super(name, blatt);
    const seders = masoretic.regular[name];
    const verses =
      typeof blatt === 'number'
        ? seders[blatt - 1]
        : masoretic.split[name][blatt];
    if (!verses) {
      throw new Error(`${name} ${blatt}`);
    }
    const firstChar = verses.charCodeAt(0);
    this.verses =
      firstChar >= 48 && firstChar <= 57 ? `${name} ${verses}` : verses;
  }

  /**
   * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || 'en';
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const name = Locale.gettext(this.name, locale);
    const blatt = this.blatt;
    if (locale === 'he' || locale === 'he-x-nonikud') {
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
