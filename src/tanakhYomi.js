import {HDate, HebrewCalendar, flags, greg, months,
  Locale, gematriya} from '@hebcal/core';
import {DafPage} from './DafPage.js';
import {DafPageEvent} from './DafPageEvent.js';
import {checkTooEarly} from './common.js';
import masoretic from './masoretic.json.js';

// Cycle starts 23 Tishrei (day after Shmini Atzeret in Israel)
// Sunday, Oct 11, 2020
// Tuesday, Oct 26, 1948
const startDate = new Date(1948, 9, 26);
export const tanakhYomiStart = greg.greg2abs(startDate);

const JEREMIAH = 'Jeremiah';
const RUTH = 'Ruth';
const SHIR_HASHIRIM = 'Song of Songs';

const books = [
  ['Joshua', 14],
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
].map((m) => {
  return {name: m[0], blatt: m[1]};
});

// Also Pesach 1 and 7, Shavuot, RH 1 and 2, YK, Sukkot 1, Shmini Atz,
const toSkip = new Set([
  'Purim',
  'Yom HaAtzma\'ut',
  'Tish\'a B\'Av',
  'Tish\'a B\'Av (observed)',
]);

/**
 * Calculates Tanakh Yomi.
 * @param {HDate|Date|number} date - Hebrew or Gregorian date
 * @return {TanakhYomi}
 */
export function tanakhYomi(date) {
  const hd = HDate.isHDate(date) ? date : new HDate(date);
  if (skipDay(hd)) {
    return null;
  }
  const cday = hd.abs();
  checkTooEarly(cday, tanakhYomiStart, 'Tanakh Yomi');
  const hyear = hd.getFullYear();
  const rh = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const startAbs = rh + 22;
  const table = books.slice();
  const longCheshvan = HDate.longCheshvan(hyear);
  let longRuth = false;
  if (HDate.isLeapYear(hyear) || longCheshvan) {
    table[12] = {name: RUTH, blatt: 2}; // Ruth gets 2 days
    longRuth = true;
  }
  let longShirHaShirim = false;
  if (longCheshvan) {
    table[11] = {name: SHIR_HASHIRIM, blatt: 2}; // Shir HaShirim gets 2 days
    longShirHaShirim = true;
  }
  let longJeremiah = false;
  if (longCheshvan && !HDate.shortKislev(hyear)) {
    table[5] = {name: JEREMIAH, blatt: 32}; // Jeremiah 9 gets split across two days
    longJeremiah = true;
  }

  if (cday < startAbs) {
    let blatt = rh % 7 === 6 ? 10 : 12;
    for (let i = rh + 2; i < cday; i++) {
      const hdate = new HDate(i);
      if (!skipDay(hdate)) {
        blatt++;
      }
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
  for (let j = 0; j < table.length; j++) {
    if (total < table[j].blatt) {
      const blatt = total + 1;
      const name = table[j].name;
      if ((longShirHaShirim && name === SHIR_HASHIRIM) ||
          (longRuth && name === RUTH)) {
        return new TanakhYomi(name, '1.' + blatt);
      }
      if (longJeremiah && name === JEREMIAH && blatt >= 9) {
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
    total -= table[j].blatt;
  }
  throw new Error(`Interal error with ${hd.toString()}`);
}

/**
 * @private
 * @param {HDate} hd
 * @return {boolean}
 */
function skipDay(hd) {
  if (hd.getDay() === 6) {
    return true;
  }
  const holidays = HebrewCalendar.getHolidaysOnDate(hd, true);
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

const splitSeder = {
  'Jeremiah': {'9.1': '17:7-25', '9.2': '17:26-18:18'},
  'Song of Songs': {'1.1': '1:1-5:1', '1.2': '5:2-8:14'},
  'Ruth': {'1.1': '1:1-2:11', '1.2': '2:12-4:22'},
};

/**
 * Returns the Daf Yomi for given date
 */
export class TanakhYomi extends DafPage {
  /**
   * Initializes a daf yomi instance
   * @param {string} name
   * @param {number} blatt
   */
  constructor(name, blatt) {
    super(name, blatt);
    const seders = masoretic[name];
    const verses = typeof blatt === 'number' ?
      seders[blatt - 1] : splitSeder[name][blatt];
    const firstChar = verses.charCodeAt(0);
    this.verses = firstChar >= 48 && firstChar <= 57 ?
      `${name} ${verses}` : verses;
  }

  /**
   * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const name = Locale.gettext(this.name, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return name + ' ס׳ ' + gematriya(this.blatt);
    }
    return name + ' Seder ' + this.blatt;
  }
}

/**
 * Event wrapper around a tanakhYomi
 */
export class TanakhYomiEvent extends DafPageEvent {
  /**
   * @param {HDate} date
   * @param {TanakhYomi} daf
   */
  constructor(date, daf) {
    super(date, daf, flags.USER_EVENT);
    this.alarm = false;
    this.category = 'Tanakh Yomi';
    this.memo = daf.verses;
  }
  /**
   * Returns a link to sefaria.org or dafyomi.org
   * @return {string}
   */
  url() {
    const memo = this.daf.verses;
    const space = memo.lastIndexOf(' ');
    const book = memo.substring(0, space).replace(/ /g, '_');
    const verses = memo.substring(space + 1).replace(/:/g, '.');
    return `https://www.sefaria.org/${book}.${verses}?lang=bi`;
  }
  /** @return {string[]} */
  getCategories() {
    return ['tanakhYomi'];
  }
}
