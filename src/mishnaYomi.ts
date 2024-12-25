import {HDate, greg} from '@hebcal/core';
import {checkTooEarly, getAbsDate} from './common';
import mishnayot from './mishnayot.json';

const cycleStartDate = new Date(1947, 4, 20);
export const mishnaYomiStart = greg.greg2abs(cycleStartDate);

const numMishnayot = 4192;
const numDays = numMishnayot / 2;

/**
 * Describes a mishna to be read
 */
export type MishnaYomi = {
  /** tractate name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan") */
  k: string;
  /** verse (e.g. "2:1") */
  v: string;
};

/**
 * A program of daily learning in which participants study two Mishnahs
 * each day in order to finish the entire Mishnah in ~6 years.
 */
export class MishnaYomiIndex {
  private days: MishnaYomi[][];
  /**
   * Initializes a Mishna Yomi instance
   */
  constructor() {
    const tmp = Array<MishnaYomi>(numMishnayot);
    let i = 0;
    for (const element of mishnayot) {
      const tractate = element;
      const v = tractate.v;
      for (let chap = 1; chap <= v.length; chap++) {
        const numv = v[chap - 1];
        for (let verse = 1; verse <= numv; verse++) {
          tmp[i++] = {k: tractate.k, v: `${chap}:${verse}`};
        }
      }
    }
    const days = Array<MishnaYomi[]>(numDays);
    for (let j = 0; j < numDays; j++) {
      const k = j * 2;
      days[j] = [tmp[k], tmp[k + 1]];
    }
    this.days = days;
  }

  /**
   * Looks up a Mishna Yomi
   */
  lookup(date: Date | HDate | number): MishnaYomi[] {
    const abs = getAbsDate(date);
    checkTooEarly(abs, mishnaYomiStart, 'Mishna Yomi');
    const dayNum = (abs - mishnaYomiStart) % numDays;
    return this.days[dayNum];
  }
}
