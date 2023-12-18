import {greg} from '@hebcal/core';
import mishnayot from './mishnayot.js';
import {getAbsDate, checkTooEarly} from './common.js';

const cycleStartDate = new Date(1947, 4, 20);
export const mishnaYomiStart = greg.greg2abs(cycleStartDate);

const numMishnayot = 4192;
const numDays = numMishnayot / 2;

/**
 * Describes a mishna to be read
 * @typedef {Object} MishnaYomi
 * @property {string} k tractate name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan")
 * @property {string} v verse (e.g. "2:1")
 */

/**
 * A program of daily learning in which participants study two Mishnahs
 * each day in order to finish the entire Mishnah in ~6 years.
 */
export class MishnaYomiIndex {
  /**
   * Initializes a Mishna Yomi instance
   */
  constructor() {
    const tmp = Array(numMishnayot);
    let i = 0;
    for (let j = 0; j < mishnayot.length; j++) {
      const tractate = mishnayot[j];
      const v = tractate.v;
      for (let chap = 1; chap <= v.length; chap++) {
        const numv = v[chap - 1];
        for (let verse = 1; verse <= numv; verse++) {
          tmp[i++] = {k: tractate.k, v: `${chap}:${verse}`};
        }
      }
    }
    const days = Array(numDays);
    for (let j = 0; j < numDays; j++) {
      const k = j * 2;
      days[j] = [tmp[k], tmp[k + 1]];
    }
    /** @type {MishnaYomi[]} */
    this.days = days;
  }

  /**
   * Looks up a Mishna Yomi
   * @param {Date|HDate|number} date Gregorian date
   * @return {MishnaYomi[]}
   */
  lookup(date) {
    const abs = getAbsDate(date);
    checkTooEarly(abs, mishnaYomiStart, 'Mishna Yomi');
    const dayNum = (abs - mishnaYomiStart) % numDays;
    return this.days[dayNum];
  }
}
