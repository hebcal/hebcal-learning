import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';

// Cycle began on 1 Cheshvan 5784 = October 16, 2023
const startDate = new Date(2023, 9, 16);
export const dirshuAmudYomiStart = greg.greg2abs(startDate);

type AmudEntry = {
  name: string;
  amudim: number;
};

export const shas: AmudEntry[] = (
  [
    ['Berachot', 125],
    ['Shabbat', 312],
    ['Eruvin', 207],
    ['Pesachim', 240],
    ['Shekalim', 42], // Bavli edition
    ['Yoma', 173],
    ['Sukkah', 110],
    ['Beitzah', 78],
    ['Rosh Hashana', 68],
    ['Taanit', 59],
    ['Megillah', 61],
    ['Moed Katan', 55],
    ['Chagigah', 51],
    ['Yevamot', 242],
    ['Ketubot', 222],
    ['Nedarim', 180],
    ['Nazir', 130],
    ['Sotah', 96],
    ['Gitin', 178],
    ['Kiddushin', 162],
    ['Baba Kamma', 236],
    ['Baba Metzia', 235],
    ['Baba Batra', 350],
    ['Sanhedrin', 224],
    ['Makkot', 46],
    ['Shevuot', 96],
    ['Avodah Zarah', 150],
    ['Horayot', 25],
    ['Zevachim', 238],
    ['Menachot', 217],
    ['Chullin', 281],
    ['Bechorot', 119],
    ['Arachin', 65],
    ['Temurah', 65],
    ['Keritot', 54],
    ['Meilah', 41],
    ['Kinnim', 6],
    ['Tamid', 17],
    ['Midot', 8],
    ['Niddah', 143],
  ] as [string, number][]
).map(m => ({name: m[0], amudim: m[1]}));

const totalAmudim = shas.reduce((s, a) => s + a.amudim, 0);

/**
 * Represents an amud (side of a page) in the Dirshu Amud HaYomi program
 */
export type DirshuAmudYomi = {
  name: string;
  amud: number;
  side: 'a' | 'b';
};

/**
 * Calculates the Dirshu Amud HaYomi for a given date
 * @param date - Hebrew or Gregorian date
 */
export function calculateDirshuAmud(
  date: HDate | Date | number
): DirshuAmudYomi {
  const cday = getAbsDate(date);
  checkTooEarly(cday, dirshuAmudYomiStart, 'Dirshu Amud HaYomi');
  const dno = (cday - dirshuAmudYomiStart) % totalAmudim;

  let total = 0;
  for (const tractate of shas) {
    if (dno < total + tractate.amudim) {
      const idx = dno - total;
      const amud = 2 + Math.floor(idx / 2);
      const side: 'a' | 'b' = idx % 2 === 0 ? 'a' : 'b';
      return {name: tractate.name, amud, side};
    }
    total += tractate.amudim;
  }
  throw new Error('Internal error: Dirshu Amud HaYomi calculation failed');
}
