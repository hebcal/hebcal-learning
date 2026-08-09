import {HDate, greg} from '@hebcal/hdate';
import {checkTooEarly} from './common.js';
import tanakhNumChap from './tanakhNumChap.json.js';

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
 * Day offset from the start of a cycle (always a Sunday) to the day chapter
 * 929 is read.
 *
 * Reading 5 chapters a week, 929 chapters is 185 full weeks (925 chapters)
 * plus 4 more: the 185 weeks span days 0..1294, so chapters 926-929 fall on
 * the Sun/Mon/Tue/Wed of the following week, i.e. offsets 1295..1298. That
 * makes the last chapter land on offset 1298, always a Wednesday.
 * @private
 */
const LAST_CHAPTER_OFFSET = 1298;

/**
 * Number of days from the start of one cycle to the start of the next.
 * The last chapter is a Wednesday, and the next cycle begins the following
 * Sunday (+4 days), so cycles repeat on a fixed 1302-day period.
 * @private
 */
const CYCLE_DAYS = LAST_CHAPTER_OFFSET + 4;

/**
 * Number of chapters read in the `days` days starting at a cycle start
 * (always a Sunday) and ending just before `cycleStart + days`.
 *
 * Whole weeks contribute 5 chapters each; the partial week contributes one
 * per day from Sunday through Thursday, capped at 5 since Fri/Sat are skipped.
 * @private
 */
function chaptersInDays(days: number): number {
  return Math.floor(days / 7) * 5 + Math.min(days % 7, 5);
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
export function calculate929(date: HDate | Date | number): Nine29Reading | null {
  const hd: HDate = HDate.isHDate(date) ? (date as HDate) : new HDate(date);
  const abs = hd.abs();
  checkTooEarly(abs, nine29Start, '929');

  if (abs < nine29Start) {
    return null;
  }

  // Locate the cycle containing this date directly. Cycle 1→2 has a unique
  // ~3-month gap, so cycle 1 is special-cased; from cycle 2 onward the cycles
  // repeat on a fixed CYCLE_DAYS period.
  let cycleNumber: number;
  let cycleStart: number;
  if (abs < nine29StartCycle2) {
    cycleNumber = 1;
    cycleStart = nine29Start;
  } else {
    const elapsed = Math.floor((abs - nine29StartCycle2) / CYCLE_DAYS);
    cycleNumber = 2 + elapsed;
    cycleStart = nine29StartCycle2 + elapsed * CYCLE_DAYS;
  }

  if (skipDay(abs)) {
    return null;
  }
  // Cycle 1 used a modified schedule (holiday skips); cap it at the
  // historical end date rather than the formula-computed cycle end.
  const effectiveCycleEnd = cycleNumber === 1 ? nine29EndCycle1 : cycleStart + LAST_CHAPTER_OFFSET;
  if (abs > effectiveCycleEnd) {
    // Wind-down / historical gap: no reading.
    return null;
  }
  const chapterNum = chaptersInDays(abs - cycleStart) + 1;
  const {book, bookChap} = chapterToBookAndVerse(chapterNum);
  return {
    cycleChap: chapterNum,
    cycleNum: cycleNumber,
    book,
    bookChap,
  };
}
