import {HDate, months} from '@hebcal/hdate';

/**
 * Returns the Pirkei Avot chapter(s) studied on the given Shabbat,
 * or `null` if the date is not a Pirkei Avot Shabbat.
 *
 * "From at least the time of Saadia Gaon (10th century), it has been
 * customary to study one chapter a week on each Shabbat between
 * Passover and Shavuot; today, the tractate is generally studied on
 * each Shabbat of the summer, from Passover to Rosh Hashanah, the
 * entire cycle repeating a few times with doubling of chapters at
 * the end if there are not a perfect multiple of six weeks"
 * (https://en.wikipedia.org/wiki/Pirkei_Avot#Study_of_the_work).
 *
 * Unlike most other calendars in this package, this one is purely
 * computed from the Hebrew calendar — there is no fixed start date,
 * just a recurring seasonal window. It never throws on a
 * pre-cycle-start date; it returns `null` for any date outside the
 * window described below.
 *
 * @param dt - Hebrew or Gregorian date to look up.
 * @param il - `true` for the Israel schedule (no 8th day Pesach,
 *   no 2nd day Shavuot); `false` for the Diaspora schedule.
 * @returns An array of one or two chapter numbers (1-6), or `null`
 *   if `dt` is **not** a Shabbat, is before Pesach, is after Rosh
 *   Hashana, or coincides with a holiday on which Pirkei Avot is
 *   skipped (8th day Pesach / 2nd day Shavuot in the Diaspora; Erev
 *   Tish'a B'Av or Tish'a B'Av).
 */
export function pirkeiAvot(dt: Date | HDate, il: boolean): number[] | null {
  const hd = new HDate(dt);
  if (hd.getDay() !== 6) {
    return null;
  }
  const hyear = hd.getFullYear();
  const pesach7 = new HDate(21, months.NISAN, hyear);
  if (hd.abs() <= pesach7.abs()) {
    return null; // before Pesach
  }
  const first = pesach7.after(6);
  let weekDiff = Math.ceil(hd.deltaDays(first) / 7);
  // when a Holiday falls on Saturday, Pirkei avot is not studied, same is for erev Tisha B'av
  const holidays: HDate[] = [];
  if (!il) {
    // 8th day Pesach and 2nd day Shavuot are only observed in the Diaspora
    holidays.push(pesach7.next(), new HDate(7, months.SIVAN, hyear));
  }
  const av8 = new HDate(8, months.AV, hyear);
  holidays.push(av8, av8.next()); // both Erev 9av and Tish'a B'Av
  for (const day of holidays) {
    if (day.isSameDate(hd)) {
      // if dt is one of the holidays return nothing (undefined)
      return null;
    }
    if (day.deltaDays(hd) <= 0 && day.getDay() === 6) {
      weekDiff -= 1; // if dt is past that holiday don't count that week
    }
  }
  if (weekDiff < 0) {
    return null;
  } else if (weekDiff < 18) {
    return [(weekDiff % 6) + 1];
  }
  // fourth round is different
  const rh = new HDate(1, months.TISHREI, hyear + 1);
  const last = rh.before(6);
  const weeksRemain = Math.ceil(last.deltaDays(hd) / 7);
  switch (weeksRemain) {
    case 0:
      return [5, 6];
    case 1:
      return [3, 4];
    case 2:
      return weekDiff % 6 === 1 ? [2] : [1, 2];
    case 3:
      return [1];
  }
  return null;
}
