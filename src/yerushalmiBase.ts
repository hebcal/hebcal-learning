import {HDate, greg, months} from '@hebcal/hdate';
import {checkTooEarly, getAbsDate} from './common.js';

/**
 * Description of one Yerushalmi (Jerusalem Talmud) Daf Yomi
 * configuration — currently the {@link vilna Vilna} and
 * {@link schottenstein Schottenstein} editions.
 *
 * Pass an instance of this to {@link yerushalmiYomi} to compute the
 * page for a given date. Each edition has its own page numbering and
 * its own historical start date, so the two cycles do not line up.
 */
export type YerushalmiYomiConfig = {
  /** Edition identifier — `"vilna"` or `"schottenstein"`. Surfaces
   *  on {@link YerushalmiReading.ed}. */
  ed: string;
  /** First day of the cycle as a JavaScript `Date`. */
  startDate: Date;
  /** First day of the cycle as an absolute (R.D.) day number — the
   *  Gregorian start date converted via `greg.greg2abs()`. */
  startAbs: number;
  /** Whether to skip Yom Kippur and Tish'a B'Av (true for Vilna,
   *  false for Schottenstein, per each edition's published custom). */
  skipYK9Av: boolean;
  /** Ordered list of tractates in the cycle, each as
   *  `[name, numDapim]`. */
  shas: [string, number][];
  /** Total number of dapim in the cycle. Computed and cached on
   *  first call to {@link yerushalmiYomi}; the literal `0` in the
   *  exported {@link vilna}/{@link schottenstein} constants is a
   *  placeholder. */
  numDapim: number;
};

const vilnaStartDate = new Date(1980, 1, 2);
/**
 * Yerushalmi Yomi configuration for Vilna Edition
 * @readonly
 */
export const vilna: YerushalmiYomiConfig = {
  ed: 'vilna',
  startDate: vilnaStartDate,
  startAbs: greg.greg2abs(vilnaStartDate),
  skipYK9Av: true,
  shas: [
    ['Berakhot', 68],
    ['Peah', 37],
    ['Demai', 34],
    ['Kilayim', 44],
    ['Sheviit', 31],
    ['Terumot', 59],
    ['Maasrot', 26],
    ['Maaser Sheni', 33],
    ['Challah', 28],
    ['Orlah', 20],
    ['Bikkurim', 13],
    ['Shabbat', 92],
    ['Eruvin', 65],
    ['Pesachim', 71],
    ['Beitzah', 22],
    ['Rosh Hashanah', 22],
    ['Yoma', 42],
    ['Sukkah', 26],
    ['Taanit', 26],
    ['Shekalim', 33],
    ['Megillah', 34],
    ['Chagigah', 22],
    ['Moed Katan', 19],
    ['Yevamot', 85],
    ['Ketubot', 72],
    ['Sotah', 47],
    ['Nedarim', 40],
    ['Nazir', 47],
    ['Gittin', 54],
    ['Kiddushin', 48],
    ['Bava Kamma', 44],
    ['Bava Metzia', 37],
    ['Bava Batra', 34],
    ['Shevuot', 44],
    ['Makkot', 9],
    ['Sanhedrin', 57],
    ['Avodah Zarah', 37],
    ['Horayot', 19],
    ['Niddah', 13],
  ],
  numDapim: 0,
} as const;

const schottensteinStartDate = new Date(2022, 10, 14);
/**
 * Yerushalmi Yomi configuration for Schottenstein Edition
 * @readonly
 */
export const schottenstein: YerushalmiYomiConfig = {
  ed: 'schottenstein',
  startDate: schottensteinStartDate,
  startAbs: greg.greg2abs(schottensteinStartDate),
  skipYK9Av: false,
  shas: [
    ['Berakhot', 94],
    ['Peah', 73],
    ['Demai', 77],
    ['Kilayim', 84],
    ['Sheviit', 87],
    ['Terumot', 107],
    ['Maasrot', 46],
    ['Maaser Sheni', 59],
    ['Challah', 49],
    ['Orlah', 42],
    ['Bikkurim', 26],
    ['Shabbat', 113],
    ['Eruvin', 71],
    ['Pesachim', 86],
    ['Shekalim', 61],
    ['Yoma', 57],
    ['Sukkah', 33],
    ['Beitzah', 49],
    ['Rosh Hashanah', 27],
    ['Taanit', 31],
    ['Megillah', 41],
    ['Chagigah', 28],
    ['Moed Katan', 23],
    ['Yevamot', 88],
    ['Ketubot', 77],
    ['Nedarim', 42],
    ['Nazir', 53],
    ['Sotah', 52],
    ['Gittin', 53],
    ['Kiddushin', 53],
    ['Bava Kamma', 40],
    ['Bava Metzia', 35],
    ['Bava Batra', 39],
    ['Sanhedrin', 75],
    ['Shevuot', 49],
    ['Avodah Zarah', 34],
    ['Makkot', 11],
    ['Horayot', 18],
    ['Niddah', 11],
  ],
  numDapim: 0,
} as const;

const SUN = 0;
const SAT = 6;

/**
 * One day's Daf Yomi Yerushalmi reading.
 */
export type YerushalmiReading = {
  /** Tractate name in Sephardic transliteration (e.g. `"Berakhot"`,
   *  `"Peah"`, `"Yevamot"`). */
  name: string;
  /** Page number (daf) within the tractate, 1-based. */
  blatt: number;
  /** Edition identifier — `"vilna"` or `"schottenstein"`. Copied from
   *  the {@link YerushalmiYomiConfig.ed config.ed} used in the
   *  lookup. */
  ed: string;
};

function countDapim(config: YerushalmiYomiConfig) {
  if (config.numDapim) {
    return config.numDapim;
  }
  const shas = config.shas;
  let numDapim = 0;
  for (const masechet of shas) {
    numDapim += masechet[1];
  }
  config.numDapim = numDapim;
  return numDapim;
}

export function cycleStart(config: YerushalmiYomiConfig, cday: number): number {
  const numDapim = countDapim(config);
  const startAbs = config.startAbs;
  let prev = startAbs;
  let next = startAbs;
  while (cday >= next) {
    prev = next;
    next += numDapim;
    const n = numSpecialDays(config, prev, next);
    // recalculate for any additional special days at the end
    const n2 = numSpecialDays(config, next, next + n);
    next += n + n2;
  }
  return prev;
}

/**
 * Calculates the Daf Yomi Yerushalmi (Jerusalem Talmud) reading for
 * the given date.
 *
 * Using the {@link vilna Vilna} edition the cycle takes ~4.25 years
 * (51 months) and skips both Yom Kippur and Tish'a B'Av. The
 * {@link schottenstein Schottenstein} edition uses different page
 * numbers, takes ~6 years to complete, and **does not** skip those
 * fast days.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @param config - Either {@link vilna} or {@link schottenstein} (or
 *   any other config matching the {@link YerushalmiYomiConfig}
 *   shape).
 * @returns A {@link YerushalmiReading} `{name, blatt, ed}`, or
 *   `null` on Yom Kippur and Tish'a B'Av when using the Vilna config
 *   (`skipYK9Av === true`).
 * @throws {Error} if `config` is missing or has no `shas` array.
 * @throws {RangeError} if `date` is before the cycle's start
 *   (2 February 1980 for Vilna; 14 November 2022 for Schottenstein).
 * @throws {TypeError} if `date` is not an `HDate`, `Date`, or finite
 *   number.
 */
export function yerushalmiYomi(
  date: HDate | Date | number,
  config: YerushalmiYomiConfig
): YerushalmiReading | null {
  if (typeof config !== 'object' || !Array.isArray(config.shas)) {
    throw new RangeError('invalid yerushalmi config');
  }
  const cday = getAbsDate(date);
  const startAbs = config.startAbs;
  checkTooEarly(cday, startAbs, 'Yerushalmi Yomi');
  const hd = new HDate(cday);
  // No Daf for Yom Kippur and Tisha B'Av
  if (config.skipYK9Av && skipDay(hd)) {
    return null;
  }

  const shas = config.shas;
  const prevCycle = cycleStart(config, cday);
  let total = cday - prevCycle - numSpecialDays(config, prevCycle, cday);
  for (const masechet of shas) {
    if (total < masechet[1]) {
      return {name: masechet[0], blatt: total + 1, ed: config.ed};
    }
    total -= masechet[1];
  }
  throw new Error('Interal error, this code should be unreachable');
}

function skipDay(hd: HDate): boolean {
  if (
    (hd.getMonth() === months.TISHREI && hd.getDate() === 10) ||
    (hd.getMonth() === months.AV &&
      ((hd.getDate() === 9 && hd.getDay() !== SAT) ||
        (hd.getDate() === 10 && hd.getDay() === SUN)))
  ) {
    return true;
  }
  return false;
}

export function numSpecialDays(
  config: YerushalmiYomiConfig,
  startAbs: number,
  endAbs: number
): number {
  if (!config.skipYK9Av) {
    return 0;
  }
  const startYear = new HDate(startAbs).getFullYear();
  const endYear = new HDate(endAbs).getFullYear();
  let specialDays = 0;
  for (let year = startYear; year <= endYear; year++) {
    const ykAbs = new HDate(10, months.TISHREI, year).abs();
    if (ykAbs >= startAbs && ykAbs <= endAbs) {
      specialDays++;
    }
    let av9dt = new HDate(9, months.AV, year);
    if (av9dt.getDay() === SAT) {
      av9dt = av9dt.next();
    }
    const av9abs = av9dt.abs();
    if (av9abs >= startAbs && av9abs <= endAbs) {
      specialDays++;
    }
  }
  return specialDays;
}
