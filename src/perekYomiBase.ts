/*
 * Mishnah Perek (chapter) Yomi
 * One chapter per day
 */
import {HDate, greg} from '@hebcal/core';
import {checkTooEarly, getAbsDate} from './common';
import mishnayot from './mishnayot.json';

const cycleLen = 525;
const startDate = new Date(2002, 1, 9);
export const perekYomiStart = greg.greg2abs(startDate);

/**
 * Describes a chapter to be read
 */
export type PerekYomi = {
  /** book name in English transliteration (e.g. "Joshua", "Song of Songs") */
  k: string;
  /** chapter number (e.g. 2) */
  v: number;
};

/**
 * Calculates Perek Yomi (Mishnah, one chapter per day)
 */
export function perekYomi(date: HDate | Date | number): PerekYomi {
  const cday = getAbsDate(date);
  checkTooEarly(cday, perekYomiStart, 'Perek Yomi');
  const dno = (cday - perekYomiStart) % cycleLen;
  let total = dno;
  for (let j = 0; j < mishnayot.length; j++) {
    const numChaps = mishnayot[j].v.length;
    if (total < numChaps) {
      return {k: mishnayot[j].k, v: total + 1};
    }
    total -= numChaps;
  }
  throw new Error('Interal error, this code should be unreachable');
}
