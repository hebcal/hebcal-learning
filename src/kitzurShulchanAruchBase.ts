import {HDate, months} from '@hebcal/hdate';
import kitzurSaJson from './kitzurSa.json';

/**
 * Describes a daily reading of the Kitzur Shulchan Aruch
 */
export type KitzurShulchanAruchReading = {
  /** begin */
  b: string;
  /** end */
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
 * Calculates Kitzur Shulchan Aruch Yomi.
 * Kitzur Shulchan Aruch is a summary of the Shulchan Aruch of Rabbi Yosef Karo.
 * It was authored by Rabbi Shlomo Ganzfried in 1864.
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
