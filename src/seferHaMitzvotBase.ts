import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common';
import seferHaMitzvotJson from './seferHaMitzvot.json';

/**
 * Describes a daily reading of the Sefer Hamitzvos
 */
export type SeferHaMitzvotReading = {
  day: number;
  reading: string;
  note?: string;
};

const cycleLen = seferHaMitzvotJson.length; // 339

const cycleStartDate = new Date(1984, 3, 29);
export const seferHaMitzvotStart = greg.greg2abs(cycleStartDate);

const notes: Record<number, number[]> = {
  '140': [148, 149, 161],
  '161': [149, 148, 140],
  '258': [296, 295, 259],
  '259': [295, 296, 258],
} as const;

function getNote(day: number): string | undefined {
  const arr = notes[day];
  if (!arr) {
    return undefined;
  }
  const [nm1, nm2, otherDay] = arr;
  return `In some editions of the Sefer Hamitzvot Schedule, today’s Sefer Hamitzvot (Day ${day}) has Negative Mitzvah ${nm1} listed instead of Negative Mitzvah ${nm2} (and Day ${otherDay} has Negative Mitzvah ${nm2} instead of ${nm1})`;
}

/**
 * Calculates Daily Mitzvah (Rambam) from Sefer Hamitzvos
 */
export function seferHaMitzvot(
  date: HDate | Date | number
): SeferHaMitzvotReading {
  const cday = getAbsDate(date);
  checkTooEarly(cday, seferHaMitzvotStart, 'Sefer Hamitzvot');
  const day0 = (cday - seferHaMitzvotStart) % cycleLen;
  const reading: string = seferHaMitzvotJson[day0];
  const day = day0 + 1;
  const result: SeferHaMitzvotReading = {day, reading};
  const note = getNote(day);
  if (note) {
    result.note = note;
  }
  return result;
}
