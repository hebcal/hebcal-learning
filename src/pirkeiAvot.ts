import { Event, HDate, Locale, flags, gematriya, months } from '@hebcal/core';

/**
 * Pirkei Avot being studied on Shabbat between Pesach and Rosh Hashana
 *
 * "From at least the time of Saadia Gaon (10th century),
 * it has been customary to study one chapter a week on each Shabbat
 * between Passover and Shavuot; today, the tractate is generally studied
 * on each Shabbat of the summer, from Passover to Rosh Hashanah,
 * the entire cycle repeating a few times with doubling of chapters
 * at the end if there are not a perfect multiple of six weeks"
 * https://en.wikipedia.org/wiki/Pirkei_Avot#Study_of_the_work
 *
 * returns array (since it can return 2 chapters) or undefined if there is no Pirkei Avot on that day
 * optimized for diaspora and il
 * feel free to modify whatever you want, i am sure this task can be done in different ways and orders
 */
export function pirkeiAvot(dt: Date | HDate, il: boolean): number[] | null {
  const hd = new HDate(dt);
  if (hd.getDay() !== 6) {
    // throw new RangeError('Date must be Saturday');
    return null;
  }
  const shvi = new HDate(21, months.NISAN, hd.getFullYear());
  if (hd.abs() <= shvi.abs()) {
    return null; // before Pesach
  }
  const first = shvi.after(6);
  let weekDiff = Math.ceil(hd.deltaDays(first) / 7);
  // when a Holiday falls on Saturday, Pirkei avot is not studied, same is for erev Tisha B'av
  const holidays: HDate[] = [];
  if (!il) {
    holidays.push(shvi.next()); // 8th day Pesach
    holidays.push(new HDate(7, months.SIVAN, hd.getFullYear())); // 2nd day Shavuot
  }
  const erev9av = new HDate(8, months.AV, hd.getFullYear());
  holidays.push(erev9av); // Erev Tish'a B'Av
  holidays.push(erev9av.next()); // Tish'a B'Av
  for (const day of holidays) {
    if (day.isSameDate(hd)) {
      // if dt is one of the holidays return nothing (undefined)
      return null;
    }
    if (day.deltaDays(hd) <= 0 && day.getDay() === 6) {
      weekDiff -= 1; // if dt is past that holiday don't count that week
    }
  }
  if (weekDiff < 18) {
    return [(weekDiff % 6) + 1];
  }
  // fourth round is different
  const rh = new HDate(1, months.TISHREI, hd.getFullYear() +1);
  const last = rh.before(6);
  const weeksRemain = Math.ceil(last.deltaDays(hd) / 7);
  switch (weeksRemain) {
    case 0:
      return [5, 6];
    case 1:
      return [3, 4];
    case 2:
      return (weekDiff % 6 == 1) ? [2] : [1, 2];
    case 3:
      return [1];
  }
  return null;
}

const PIRKEI_AVOT = 'Pirkei Avot';

/**
 * Event wrapper for
 * Pirkei Avot being studied on Shabbat between Pesach and Rosh Hashana
 */
export class PirkeiAvotSummerEvent extends Event {
  reading: number[];
  category: string;
  constructor(date: HDate, reading: number[]) {
    super(date, PIRKEI_AVOT + ' ' + reading.join('-'), flags.DAILY_LEARNING);
    this.reading = reading;
    this.alarm = false;
    this.category = PIRKEI_AVOT;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const book = Locale.gettext(PIRKEI_AVOT, locale);
    const reading = this.reading;
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return book + ' ' + reading.map(gematriya).join('-');
    }
    return book + ' ' + reading.join('-');
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const chaps = this.reading.join('-');
    return `https://www.sefaria.org/Pirkei_Avot.${chaps}?lang=bi`;
  }
  getCategories(): string[] {
    return ['pirkeiAvotSummer'];
  }
}
