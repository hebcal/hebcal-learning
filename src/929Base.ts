import {HDate, greg} from '@hebcal/hdate';

// 929 started on Sunday, 21 December 2014
const startDate = new Date(2014, 11, 21);
export const _929Start = greg.greg2abs(startDate);

/** Total number of Bible chapters in the 929 program */
export const TOTAL_929_CHAPTERS = 929;

/**
 * Returns true if the given date is a skip day for 929:
 * - Friday or Saturday only (holidays are NOT skipped)
 * @private
 */
function skipDay(hd: HDate): boolean {
  const dow = hd.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  return dow === 5 || dow === 6;
}

/**
 * Given an absolute day number that is the first day of a cycle (always a
 * Sunday), returns the absolute day on which chapter 929 will be read.
 * @private
 */
function findCycleEnd(cycleStart: number): number {
  let chaptersRead = 0;
  let abs = cycleStart;
  while (true) {
    const hd = new HDate(abs);
    if (!skipDay(hd)) {
      chaptersRead++;
      if (chaptersRead === TOTAL_929_CHAPTERS) {
        return abs;
      }
    }
    abs++;
  }
}

/**
 * Given an absolute day number for the last chapter (always a Wednesday),
 * returns the absolute day of the Sunday that begins the next cycle.
 * @private
 */
function nextCycleStart(lastChapterAbs: number): number {
  // lastChapterAbs is a Wednesday (getDay() === 3).
  // Skip Thu–Sat (rest of week), next Sunday = lastChapterAbs + 4.
  return lastChapterAbs + 4;
}

export type _929Reading = {
  /** Chapter number (1–929) */
  chapter: number;
  /** 1-based cycle number */
  cycle: number;
};

/**
 * Calculates the 929 reading for a given date.
 * Returns null if there is no reading on this date (skip day, or the
 * "wind-down" days after chapter 929 before the next cycle begins).
 *
 * @param date - Hebrew or Gregorian date, or absolute day number
 */
export function _929(date: HDate | Date | number): _929Reading | null {
  const hd: HDate = HDate.isHDate(date) ? (date as HDate) : new HDate(date);
  const abs = hd.abs();

  if (abs < _929Start) {
    return null;
  }

  // Walk through completed cycles to find which cycle this date falls in
  // and what chapter offset it has within that cycle.
  let cycleStart = _929Start;
  let cycleNumber = 1;

  while (true) {
    const cycleEnd = findCycleEnd(cycleStart);
    const nextStart = nextCycleStart(cycleEnd);

    if (abs < nextStart) {
      // This date is within the current cycle (either an active reading day
      // or a skip day / wind-down day after chapter 929).
      if (skipDay(hd)) {
        return null;
      }
      if (abs > cycleEnd) {
        // Wind-down: after last chapter (Wed) through Sat, no reading.
        return null;
      }
      // Count how many reading days occurred from cycleStart up to (not
      // including) abs, to determine the chapter number for today.
      let chaptersBeforeToday = 0;
      for (let i = cycleStart; i < abs; i++) {
        const hdi = new HDate(i);
        if (!skipDay(hdi)) {
          chaptersBeforeToday++;
        }
      }
      return {
        chapter: chaptersBeforeToday + 1,
        cycle: cycleNumber,
      };
    }

    // Move to the next cycle
    cycleStart = nextStart;
    cycleNumber++;
  }
}
