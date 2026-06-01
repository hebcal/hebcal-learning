import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly} from './common';
import tanakhNumChap from './tanakhNumChap.json';

const tanakhBooks = Object.entries(tanakhNumChap) as Array<[string, number]>;

function chapterToBookAndVerse(chapter: number): {
  book: string;
  bookChap: number;
} {
  let remaining = chapter;
  for (const [book, numChapters] of tanakhBooks) {
    if (remaining <= numChapters) {
      return {book, bookChap: remaining};
    }
    remaining -= numChapters;
  }
  throw new Error(`Chap ${chapter} out of range (max ${TOTAL_929_CHAPTERS})`);
}

// 929 started on Sunday, 21 December 2014
const startDate = new Date(2014, 11, 21);
export const nine29Start = greg.greg2abs(startDate);

// Cycle 1 ended Wed 18 Apr 2018 (Israel's 70th Independence Day). The historical
// schedule had additional skip days (holidays) so the 929th chapter landed earlier
// than our simple Fri/Sat-only formula would predict.  Cycle 2 didn't begin until
// Sun 15 Jul 2018 — a ~3-month gap unique to this transition; subsequent cycles
// restart the following Sunday.
export const nine29EndCycle1 = greg.greg2abs(new Date(2018, 3, 18));
export const nine29StartCycle2 = greg.greg2abs(new Date(2018, 6, 15));

/** Total number of Bible chapters in the 929 program */
export const TOTAL_929_CHAPTERS = 929;

/**
 * Returns true if the given date is a skip day for 929:
 * - Friday or Saturday only (holidays are NOT skipped)
 * @private
 */
function skipDay(abs: number): boolean {
  const dow = abs % 7; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
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
    if (!skipDay(abs)) {
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

export type Nine29Reading = {
  /** Chapter number (1–929) */
  cycleChap: number;
  /** 1-based cycle number */
  cycleNum: number;
  /** Book name, e.g. "Genesis" or "Ruth" */
  book: string;
  /** 1-based chapter number within the book */
  bookChap: number;
};

/**
 * Calculates the 929 reading for a given date.
 *
 * The 929 Project (officially called 929: Tanakh B'yachad or "Bible Together")
 * is a synchronized, chapter-a-day reading program. Named after the 929
 * chapters in the Hebrew Bible (Tanakh), it challenges participants to read
 * one chapter a day, five days a week, covering the entire text in about
 * 3.5 years
 *
 * Returns null if there is no reading on this date (skip day, or the
 * "wind-down" days after chapter 929 before the next cycle begins).
 *
 * @param date - Hebrew or Gregorian date, or absolute day number
 */
export function calculate929(
  date: HDate | Date | number
): Nine29Reading | null {
  const hd: HDate = HDate.isHDate(date) ? (date as HDate) : new HDate(date);
  const abs = hd.abs();
  checkTooEarly(abs, nine29Start, '929');

  if (abs < nine29Start) {
    return null;
  }

  // Walk through completed cycles to find which cycle this date falls in
  // and what chapter offset it has within that cycle.
  let cycleStart = nine29Start;
  let cycleNumber = 1;

  while (true) {
    const cycleEnd = findCycleEnd(cycleStart);
    // Cycle 1→2 has a unique 3-month gap; all later transitions are +4 days.
    const nextStart =
      cycleNumber === 1 ? nine29StartCycle2 : nextCycleStart(cycleEnd);

    if (abs < nextStart) {
      // This date is within the current cycle (either an active reading day
      // or a skip day / wind-down day after chapter 929).
      if (skipDay(abs)) {
        return null;
      }
      // Cycle 1 used a modified schedule (holiday skips); cap it at the
      // historical end date rather than the formula-computed cycleEnd.
      const effectiveCycleEnd = cycleNumber === 1 ? nine29EndCycle1 : cycleEnd;
      if (abs > effectiveCycleEnd) {
        // Wind-down / historical gap: no reading.
        return null;
      }
      // Count how many reading days occurred from cycleStart up to (not
      // including) abs, to determine the chapter number for today.
      let chaptersBeforeToday = 0;
      for (let i = cycleStart; i < abs; i++) {
        if (!skipDay(i)) {
          chaptersBeforeToday++;
        }
      }
      const chapterNum = chaptersBeforeToday + 1;
      const {book, bookChap} = chapterToBookAndVerse(chapterNum);
      return {
        cycleChap: chapterNum,
        cycleNum: cycleNumber,
        book,
        bookChap,
      };
    }

    // Move to the next cycle
    cycleStart = nextStart;
    cycleNumber++;
  }
}
