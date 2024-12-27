import {greg} from '@hebcal/core';
import {checkTooEarly, getAbsDate, DLDate} from './common';
import ahsyJson from './arukhHaShulchanYomi.json';

/**
 * Describes a daily reading of the Arukh HaShulchan
 */
export type AhSYomiReading = {
  /**
   * section name in Sephardic transliteration
   * (e.g. "Orach Chaim", "Yoreh De'ah", "Even HaEzer", "Choshen Mishpat")
   */
  k: string;
  /** verse range (e.g. "8.20-9.4" or "14.2-9") */
  v: string;
};

const cycleLen = ahsyJson.length; // 1719

const cycleStartDate = new Date(2020, 4, 29);
export const arukhHaShulchanYomiStart = greg.greg2abs(cycleStartDate);

const sections = [
  '',
  'Orach Chaim',
  "Yoreh De'ah",
  'Even HaEzer',
  'Choshen Mishpat',
];

/**
 * Calculates Arukh HaShulchan Yomi
 */
export function arukhHaShulchanYomi(date: DLDate): AhSYomiReading {
  const cday = getAbsDate(date);
  checkTooEarly(cday, arukhHaShulchanYomiStart, 'Daily Rambam');
  const dayNum = (cday - arukhHaShulchanYomiStart) % cycleLen;
  const [s, v] = (ahsyJson as [number, string][])[dayNum];
  return {k: sections[s], v};
}
