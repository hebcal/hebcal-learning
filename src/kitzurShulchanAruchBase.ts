import {HDate, months} from '@hebcal/hdate';
import kitzurSaJson from './kitzurSa.json';

/**
 * Describes one day's reading in the Kitzur Shulchan Aruch calendar.
 */
export type KitzurShulchanAruchReading = {
  /**
   * Beginning of the day's reading. A `siman:seif` reference like
   * `"5:1"` (chapter 5, paragraph 1). On Klalim/leap-option days the
   * value may be a non-numeric token (e.g. `"Klalim"`, `"Shmita"`).
   */
  b: string;
  /**
   * End of the day's reading in the same `siman:seif` format, or
   * `undefined` if the day covers only a single paragraph. May end in
   * `:E` ("end of siman") to indicate the reading runs to the last
   * paragraph of the begin-siman.
   */
  e: string | undefined;
};

const Adar1 = months.ADAR_I;

type IdxName =
  | 'Nisan'
  | 'Iyyar'
  | 'Sivan'
  | 'Tamuz'
  | 'Av'
  | 'Elul'
  | 'Tishrei'
  | 'Cheshvan'
  | 'Kislev'
  | 'Tevet'
  | "Sh'vat"
  | 'Adar'
  | 'Adar I'
  | 'Adar II'
  | 'Leap Option A'
  | 'Leap Option B';

/*
 * As you may have noticed, the daily learning calendar does not include Adar Sheni.  We are making available to you two separate learning tracks for this 29-day period (the optimum time to start would be 23 Adar I – Before Hilchos Pesach begins).
 * - Option A – הלכות זרעים was suggested by HRH”G Rav Chaim Kanievsky shlit”a.  We have selected the הלכות תלויות בארץ that is found in the back of the Hebrew Blum edition of the Kitzur, which many of you are using, and have divided it accordingly.
 * - Option B – is to review הלכות ברכות ותפלה which are numerous and complicated, and are important on a daily basis.
 */
function getMonthName(hd: HDate, leapOption: 'A' | 'B'): IdxName {
  const mm = hd.getMonth();
  if (hd.isLeapYear() && mm === months.ADAR_II) {
    return `Leap Option ${leapOption}`;
  }
  return mm === Adar1 ? 'Adar' : hd.getMonthName();
}

/**
 * Returns the Kitzur Shulchan Aruch Yomi reading for the given date.
 *
 * The Kitzur Shulchan Aruch is a summary of the Shulchan Aruch of
 * Rabbi Yosef Karo, authored by Rabbi Shlomo Ganzfried in 1864. The
 * schedule is Hebrew-calendar driven and repeats each year, so there
 * is no fixed cycle start; any Hebrew date returns a reading (with
 * the exceptions noted below).
 *
 * During Adar II of a leap year there is no part of the regular
 * cycle to study, so two replacement tracks are offered: `'A'` —
 * Hilchot Shmita v'Terumah (the default), or `'B'` — Hilchot Brachot
 * v'Tefilah.
 *
 * @param date - Hebrew date, Gregorian `Date`, or absolute (R.D.) day
 *   number.
 * @param leapOption - Which Adar II track to follow when `date` falls
 *   in Adar II of a leap year. Ignored on all other dates.
 * @returns A {@link KitzurShulchanAruchReading} `{b, e}`, or
 *   `undefined` for the two dates that have no entry in the table:
 *   **30 Cheshvan** and **30 Adar I**.
 * @throws {TypeError} (indirectly, via the `HDate` constructor) if
 *   `date` is not an `HDate`, `Date`, or finite number.
 */
export function kitzurShulchanAruch(
  date: HDate | Date | number,
  leapOption: 'A' | 'B' = 'A'
): KitzurShulchanAruchReading | undefined {
  const hd = new HDate(date);
  const dd = hd.getDate();
  const mm = hd.getMonth();
  // no reading defined for Long Cheshvan or leap year 30 Adar I
  if (dd === 30 && (mm === Adar1 || mm === months.CHESHVAN)) {
    return undefined;
  }
  const monthName = getMonthName(hd, leapOption);
  const reading = kitzurSaJson[monthName][dd - 1];
  if (!reading) {
    // this shouldn't happen
    throw new Error(`No reading found for ${hd.toString()}`);
  }
  const [begin, end] = reading.split('-');
  return {b: begin, e: end};
}
