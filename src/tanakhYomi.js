import {HDate, HebrewCalendar, flags, greg, months} from '@hebcal/core';
import {DafPageEvent} from './DafPageEvent.js';
import {checkTooEarly} from './common.js';

// Cycle starts 23 Tishrei (day after Shmini Atzeret in Israel)
// Sunday, Oct 11, 2020
// Tuesday, Oct 26, 1948
const startDate = new Date(1948, 9, 26);
export const tanakhYomiStart = greg.greg2abs(startDate);

const JEREMIAH = 'Jeremiah';
const RUTH = 'Ruth';
const SHIR_HASHIRIM = 'Song of Songs';

const masoretic = [
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
  ['Ezra', 10],
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
 * @return {any}
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
  const table = masoretic.slice();
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

  let dno = 0;
  if (cday < startAbs) {
    let blatt = rh % 7 === 6 ? 10 : 12;
    for (let i = rh + 2; i < cday; i++) {
      const hdate = new HDate(i);
      if (!skipDay(hdate)) {
        blatt++;
      }
    }
    return {name: 'Chronicles', blatt};
  }
  for (let i = startAbs; i < cday; i++) {
    const hdate = new HDate(i);
    if (!skipDay(hdate)) {
      dno++;
    }
  }
  let total = dno;
  for (let j = 0; j < table.length; j++) {
    if (total < table[j].blatt) {
      const blatt = total + 1;
      const name = table[j].name;
      if ((longShirHaShirim && name === SHIR_HASHIRIM) ||
          (longRuth && name === RUTH)) {
        return {name, blatt: '1.' + blatt};
      }
      if (longJeremiah && name === JEREMIAH && blatt >= 9) {
        if (blatt === 9) {
          return {name, blatt: '9.1'};
        } else if (blatt === 10) {
          return {name, blatt: '9.2'};
        } else {
          return {name, blatt: blatt - 1};
        }
      }
      return {name, blatt};
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


/**
 * Event wrapper around a tanakhYomi
 */
export class TanakhYomiEvent extends DafPageEvent {
  /**
   * @param {HDate} date
   * @param {DafPage} daf
   */
  constructor(date, daf) {
    super(date, daf, flags.USER_EVENT);
    this.alarm = false;
    this.category = 'Tanakh Yomi';
  }
  /**
   * Returns a link to sefaria.org or dafyomi.org
   * @return {string}
   */
  url() {
    const daf = this.daf;
    const tractate = daf.getName();
    const blatt = daf.getBlatt();
    if (tractate == 'Kinnim' || tractate == 'Midot') {
      return `https://www.dafyomi.org/index.php?masechta=meilah&daf=${blatt}a`;
    } else {
      const name0 = dafYomiSefaria[tractate] || tractate;
      const name = name0.replace(/ /g, '_');
      return `https://www.sefaria.org/${name}.${blatt}a?lang=bi`;
    }
  }
  /** @return {string[]} */
  getCategories() {
    return ['tanakhYomi'];
  }
}
