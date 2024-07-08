import { HDate, greg } from '@hebcal/core';
import { checkTooEarly, getAbsDate } from './common';

const nach: [string, number][] = [
  ['Joshua', 24],
  ['Judges', 21],
  ['I Samuel', 31],
  ['II Samuel', 24],
  ['I Kings', 22],
  ['II Kings', 25],
  ['Isaiah', 66],
  ['Jeremiah', 52],
  ['Ezekiel', 48],
  ['Hosea', 14],
  ['Joel', 4],
  ['Amos', 9],
  ['Obadiah', 1],
  ['Jonah', 4],
  ['Micah', 7],
  ['Nachum', 3],
  ['Habakkuk', 3],
  ['Zephaniah', 3],
  ['Haggai', 2],
  ['Zechariah', 14],
  ['Malachi', 3],
  ['Psalms', 150],
  ['Proverbs', 31],
  ['Job', 42],
  ['Song of Songs', 8],
  ['Ruth', 4],
  ['Lamentations', 5],
  ['Ecclesiastes', 12],
  ['Esther', 10],
  ['Daniel', 12],
  ['Ezra', 10],
  ['Nehemiah', 13],
  ['I Chronicles', 29],
  ['II Chronicles', 36],
];

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
  lookup(date: Date | HDate | number): NachYomi {
    const abs = getAbsDate(date);
    checkTooEarly(abs, nachYomiStart, 'Nach Yomi');
    const dayNum = (abs - nachYomiStart) % numChapters;
    return this.days[dayNum];
  }
}
