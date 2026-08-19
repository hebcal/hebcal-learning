/**
 * Daf Yomi calculator.
 *
 * A TypeScript port of `daf.el` by Bob Newell (first written Bismarck, North
 * Dakota, April 24 1998; last revised Honolulu, Hawai'i, December 14 2012),
 * which was released by its author into the public domain. This port is
 * likewise public domain.
 *
 * The algorithm walks the fixed sequence of masechtos, using the absolute
 * ("Rata Die") day number of the requested date to find the offset into the
 * current cycle. Cycles 1-7 ran 2702 days (Shekalim was learned as 13 blatt);
 * from cycle 8 onward they run 2711 days (Shekalim expanded to 22 blatt).
 *
 * One deviation from the original: `daf.el` gave Tamid nine dafim (26-34) and
 * Midos three (35-37). The accepted division is Tamid 26-33 and Midos 34-37, so
 * the original named the wrong masechta on one day of every cycle. The cycle
 * length is unchanged, so no other day is affected.
 */

/** Masechtos in Daf Yomi order. */
const TRACTATE_NAMES: readonly string[] = [
  "Berachos", "Shabbat", "Eruvin", "Pesachim", "Shekalim",
  "Yoma", "Sukkah", "Beitzah", "Rosh Hashana", "Taanit",
  "Megillah", "Moed Katan", "Chagigah", "Yevamot", "Ketubot",
  "Nedarim", "Nazir", "Sotah", "Gitin", "Kiddushin",
  "Baba Kamma", "Baba Metzia", "Baba Basra", "Sanhedrin",
  "Makkos", "Shevuos", "Avodah Zarah", "Horayot", "Zevachim",
  "Menachos", "Chullin", "Bechoros", "Arachin", "Temurah",
  "Keritot", "Meilah", "Kinnim", "Tamid", "Midos", "Niddah",
];

/**
 * Last daf of each masechta. A masechta of N blatt occupies N-1 days, since
 * pagination starts at daf 2.
 */
const TRACTATE_LAST_DAF: readonly number[] = [
  64, 157, 105, 121, 22, 88, 56, 40, 35, 31,
  32, 29, 27, 122, 112, 91, 66, 49, 90, 82,
  119, 119, 176, 113, 24, 49, 76, 14, 120, 110,
  142, 61, 34, 34, 28, 22, 4, 9, 5, 73,
];

const TRACTATE_COUNT = TRACTATE_NAMES.length;

/** Index of Shekalim, whose length differs between the old and new cycles. */
const SHEKALIM_INDEX = 4;
const SHEKALIM_OLD_LAST_DAF = 13;
const SHEKALIM_NEW_LAST_DAF = 22;

/**
 * Kinnim, Tamid and Midos are printed as continuations of the preceding
 * masechta rather than starting at daf 2, so their numbering is offset.
 */
const DAF_OFFSETS: Readonly<Record<number, number>> = {
  36: 21, // Kinnim starts at 23
  37: 24, // Tamid starts at 26
  38: 32, // Midos starts at 34
};

/** Start of cycle 1 (11 September 1923) and of cycle 8 (24 June 1975). */
const OLD_CYCLE_START = { year: 1923, month: 9, day: 11 };
const NEW_CYCLE_START = { year: 1975, month: 6, day: 24 };
const OLD_CYCLE_LENGTH = 2702;
const NEW_CYCLE_LENGTH = 2711;
const FIRST_NEW_CYCLE = 8;

/** A proleptic Gregorian calendar date. `month` is 1-12, unlike `Date`. */
export interface GregorianDate {
  year: number;
  /** 1 = January through 12 = December. */
  month: number;
  day: number;
}

export interface DafYomiResult {
  /** Cycle number, counting the cycle that began 11 September 1923 as 1. */
  cycle: number;
  /** Masechta name, e.g. "Chullin". */
  tractate: string;
  /** Daf (folio) number within the masechta. */
  daf: number;
  /** Convenience rendering, e.g. "Chullin 111". */
  toString(): string;
}

/** Thrown for dates before the first Daf Yomi cycle began. */
export class DafYomiRangeError extends RangeError {
  constructor(message: string) {
    super(message);
    this.name = "DafYomiRangeError";
  }
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/** Day of the year, 1-366. */
function dayNumber({ year, month, day }: GregorianDate): number {
  const cumulative = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  return cumulative[month - 1] + day + (month > 2 && isLeapYear(year) ? 1 : 0);
}

/**
 * Absolute (Rata Die) day number: days elapsed since the imaginary Gregorian
 * date 31 December 1 BCE, so that 1 January 1 CE is day 1. This mirrors Emacs'
 * `calendar-absolute-from-gregorian`.
 */
export function absoluteFromGregorian(date: GregorianDate): number {
  const priorYears = date.year - 1;
  return (
    dayNumber(date) +
    365 * priorYears +
    Math.floor(priorYears / 4) -
    Math.floor(priorYears / 100) +
    Math.floor(priorYears / 400)
  );
}

function validate(date: GregorianDate): void {
  const { year, month, day } = date;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new TypeError("Date components must be integers.");
  }
  if (month < 1 || month > 12) {
    throw new RangeError(`Month must be 1-12, received ${month}.`);
  }
  const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > lengths[month - 1]) {
    throw new RangeError(`Day ${day} is out of range for month ${month} of ${year}.`);
  }
}

/**
 * Calculate the Daf Yomi for a Gregorian date.
 *
 * @throws {DafYomiRangeError} if the date precedes 11 September 1923.
 */
export function dafYomi(date: GregorianDate): DafYomiResult {
  validate(date);

  const absolute = absoluteFromGregorian(date);
  const oldStart = absoluteFromGregorian(OLD_CYCLE_START);
  const newStart = absoluteFromGregorian(NEW_CYCLE_START);

  if (absolute < oldStart) {
    throw new DafYomiRangeError(
      "The date given is prior to organized Daf Yomi cycles (11 September 1923).",
    );
  }

  let cycle: number;
  let dayInCycle: number;
  if (absolute >= newStart) {
    const elapsed = absolute - newStart;
    cycle = FIRST_NEW_CYCLE + Math.floor(elapsed / NEW_CYCLE_LENGTH);
    dayInCycle = elapsed % NEW_CYCLE_LENGTH;
  } else {
    const elapsed = absolute - oldStart;
    cycle = 1 + Math.floor(elapsed / OLD_CYCLE_LENGTH);
    dayInCycle = elapsed % OLD_CYCLE_LENGTH;
  }

  const lastDaf = [...TRACTATE_LAST_DAF];
  lastDaf[SHEKALIM_INDEX] =
    cycle < FIRST_NEW_CYCLE ? SHEKALIM_OLD_LAST_DAF : SHEKALIM_NEW_LAST_DAF;

  // Walk the masechtos, accumulating days, until the cycle offset falls inside one.
  let daysSoFar = 0;
  for (let index = 0; index < TRACTATE_COUNT; index++) {
    daysSoFar += lastDaf[index] - 1;
    if (dayInCycle < daysSoFar) {
      const daf = lastDaf[index] + 1 - (daysSoFar - dayInCycle) + (DAF_OFFSETS[index] ?? 0);
      const tractate = TRACTATE_NAMES[index];
      return {
        cycle,
        tractate,
        daf,
        toString: () => `${tractate} ${daf}`,
      };
    }
  }

  // Unreachable: the masechta lengths sum to exactly the cycle length.
  throw new Error("Daf Yomi calculation fell through; masechta table is inconsistent.");
}

/** Daf Yomi for a JavaScript `Date`, read in local time. */
export function dafYomiForDate(date: Date = new Date()): DafYomiResult {
  return dafYomi({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

/** Formatted like the original's message, e.g. "The Daf is on cycle 14 Chullin 111". */
export function formatWithCycle(result: DafYomiResult): string {
  return `The Daf is on cycle ${result.cycle} ${result.tractate} ${result.daf}`;
}
