/* eslint-disable camelcase */
import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import mishnehTorahJson from './mishnehTorah.json';

// On 9 July 2020 all three tracks completed the Rambam learning cycle.
// The 3 chapter daily track completed its 39th cycle while the one chapter
// daily track completed its 13th.
// https://en.wikipedia.org/wiki/Daily_Rambam_Study

export const rambam1cycleLen = 1017;

// The cycle of Rambam began on Sunday, 27 Nissan, 5744 - Apr. 29, 1984.
const startDate = new Date(1984, 3, 29);
export const rambam1Start = greg.greg2abs(startDate);

type Daf = {
  name: string;
  ch: number;
};

const mishnehTorah: Daf[] = mishnehTorahJson.map(m => {
  return {name: m[0] as string, ch: m[1] as number};
});

const first4verses = [
  ['1-21', '22-33', '34-45'], // Transmission of the Oral Law
  ['1-83', '84-166', '167-248'], // Positive Mitzvot
  ['1-122', '123-245', '246-365'], // Negative Mitzvot
  ['1:1-4:8', '5:1-9:9', '10:1-14:10'], // Overview of Mishneh Torah Contents
];

export type RambamReading = {
  name: string;
  perek: number | string;
};

/**
 * Calculates Daily Rambam (Mishneh Torah) for 1 chapter a day cycle.
 */
export function dailyRambam1(date: HDate | Date | number): RambamReading {
  const cday = getAbsDate(date);
  checkTooEarly(cday, rambam1Start, 'Daily Rambam 1');
  const dno = (cday - rambam1Start) % rambam1cycleLen;
  return getChap(dno);
}

export function getChap(idx: number): RambamReading {
  let total = idx;
  for (let j = 0; j < mishnehTorah.length; j++) {
    if (total < mishnehTorah[j].ch) {
      const chapNum = total + 1;
      const perek = j < 4 ? first4verses[j][chapNum - 1] : chapNum;
      return {name: mishnehTorah[j].name, perek};
    }
    total -= mishnehTorah[j].ch;
  }
  throw new Error('Interal error, this code should be unreachable');
}
