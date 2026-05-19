import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import tanakhNumChap from './tanakhNumChap.json';

// Nach Yomi covers Nevi'im and Ketuvim — all books after the 5 Torah books.
const nach = (Object.entries(tanakhNumChap) as Array<[string, number]>).slice(5);

const cycleStartDate = new Date(2007, 10, 1);
export const nachYomiStart = greg.greg2abs(cycleStartDate);

const numChapters = 742;

/**
 * Describes a chapter to be read
 */
export type NachYomi = {
  /** book name in English transliteration (e.g. "Joshua", "Song of Songs") */
  k: string;
  /** chapter number (e.g. 2) */
  v: number;
};

/**
 * A daily regimen of learning the books of Nevi'im (Prophets)
 * and Ketuvim (Writings).
 */
export class NachYomiIndex {
  private days: NachYomi[];
  /**
   * Initializes a Nach Yomi instance
   */
  constructor() {
    const days = Array<NachYomi>(numChapters);
    let i = 0;
    for (const element of nach) {
      const book = element[0];
      const chapters = element[1];
      for (let chap = 1; chap <= chapters; chap++) {
        days[i++] = {k: book, v: chap};
      }
    }
    this.days = days;
  }

  /**
   * Looks up a Nach Yomi
   */
  lookup(date: HDate | Date | number): NachYomi {
    const abs = getAbsDate(date);
    checkTooEarly(abs, nachYomiStart, 'Nach Yomi');
    const dayNum = (abs - nachYomiStart) % numChapters;
    return this.days[dayNum];
  }
}
