/* eslint-disable camelcase */
import { Event, HDate, Locale, flags, gematriya, greg } from '@hebcal/core';
import { checkTooEarly, getAbsDate } from './common';

// On 9 July 2020 all three tracks completed the Rambam learning cycle.
// The 3 chapter daily track completed its 39th cycle while the one chapter
// daily track completed its 13th.
// https://en.wikipedia.org/wiki/Daily_Rambam_Study

const cycleLen = 1017;

// The cycle of Rambam began on Sunday, 27 Nissan, 5744 - Apr. 29, 1984.
const startDate = new Date(1984, 3, 29);
export const rambam1Start = greg.greg2abs(startDate);

type Daf = {
  name: string;
  ch: number;
};

const mishnehTorah: Daf[] = [
  ['Transmission of the Oral Law', 3],
  ['Positive Mitzvot', 3],
  ['Negative Mitzvot', 3],
  ['Overview of Mishneh Torah Contents', 3],
  ['Foundations of the Torah', 10],
  ['Human Dispositions', 7],
  ['Torah Study', 7],
  ['Foreign Worship and Customs of the Nations', 12],
  ['Repentance', 10],
  ['Reading the Shema', 4],
  ['Prayer and the Priestly Blessing', 15],
  ['Tefillin, Mezuzah and the Torah Scroll', 10],
  ['Fringes', 3],
  ['Blessings', 11],
  ['Circumcision', 3],
  ['The Order of Prayer', 4],
  ['Sabbath', 30],
  ['Eruvin', 8],
  ['Rest on the Tenth of Tishrei', 3],
  ['Rest on a Holiday', 8],
  ['Leavened and Unleavened Bread', 9],
  ['Shofar, Sukkah and Lulav', 8],
  ['Sheqel Dues', 4],
  ['Sanctification of the New Month', 19],
  ['Fasts', 5],
  ['Scroll of Esther and Hanukkah', 4],
  ['Marriage', 25],
  ['Divorce', 13],
  ['Levirate Marriage and Release', 8],
  ['Virgin Maiden', 3],
  ['Woman Suspected of Infidelity', 4],
  ['Forbidden Intercourse', 22],
  ['Forbidden Foods', 17],
  ['Ritual Slaughter', 14],
  ['Oaths', 12],
  ['Vows', 13],
  ['Nazariteship', 10],
  ['Appraisals and Devoted Property', 8],
  ['Diverse Species', 10],
  ['Gifts to the Poor', 10],
  ['Heave Offerings', 15],
  ['Tithes', 14],
  ['Second Tithes and Fourth Year\'s Fruit', 11],
  ['First Fruits and other Gifts to Priests Outside the Sanctuary', 12],
  ['Sabbatical Year and the Jubilee', 13],
  ['The Chosen Temple', 8],
  ['Vessels of the Sanctuary and Those who Serve Therein', 10],
  ['Admission into the Sanctuary', 9],
  ['Things Forbidden on the Altar', 7],
  ['Sacrificial Procedure', 19],
  ['Daily Offerings and Additional Offerings', 10],
  ['Sacrifices Rendered Unfit', 19],
  ['Service on the Day of Atonement', 5],
  ['Trespass', 8],
  ['Paschal Offering', 10],
  ['Festival Offering', 3],
  ['Firstlings', 8],
  ['Offerings for Unintentional Transgressions', 15],
  ['Offerings for Those with Incomplete Atonement', 5],
  ['Substitution', 4],
  ['Defilement by a Corpse', 25],
  ['Red Heifer', 15],
  ['Defilement by Leprosy', 16],
  ['Those Who Defile Bed or Seat', 13],
  ['Other Sources of Defilement', 20],
  ['Defilement of Foods', 16],
  ['Vessels', 28],
  ['Immersion Pools', 11],
  ['Damages to Property', 14],
  ['Theft', 9],
  ['Robbery and Lost Property', 18],
  ['One Who Injures a Person or Property', 8],
  ['Murderer and the Preservation of Life', 13],
  ['Sales', 30],
  ['Ownerless Property and Gifts', 12],
  ['Neighbors', 14],
  ['Agents and Partners', 10],
  ['Slaves', 9],
  ['Hiring', 13],
  ['Borrowing and Deposit', 8],
  ['Creditor and Debtor', 27],
  ['Plaintiff and Defendant', 16],
  ['Inheritances', 11],
  ['The Sanhedrin and the Penalties within their Jurisdiction', 26],
  ['Testimony', 22],
  ['Rebels', 7],
  ['Mourning', 14],
  ['Kings and Wars', 12],
].map((m) => {
  return {name: m[0] as string, ch: m[1] as number};
});

const first4verses = [
  ['1-21', '22-33', '34-45'], // Transmission of the Oral Law
  ['1-83', '84-166', '167-248'], // Positive Mitzvot
  ['1-122', '123-245', '246-365'], // Negative Mitzvot
  ['1:1-4:8', '5:1-9:9', '10:1-14:10'], // Overview of Mishneh Torah Contents
];

/**
 * Calculates Daily Rambam (Mishneh Torah) for 1 chapter a day cycle.
 * @param {HDate|Date|number} date - Hebrew or Gregorian date
 * @return {any}
 */
export function dailyRambam1(date: HDate | Date | number): any {
  const cday = getAbsDate(date);
  checkTooEarly(cday, rambam1Start, 'Daily Rambam');
  const dno = (cday - rambam1Start) % cycleLen;
  let total = dno;
  for (let j = 0; j < mishnehTorah.length; j++) {
    if (total < mishnehTorah[j].ch) {
      const chapNum = total + 1;
      const perek = j < 4 ? first4verses[j][chapNum - 1] : chapNum;
      return {name: mishnehTorah[j].name, perek};
    }
    total -= mishnehTorah[j].ch;
  }
  throw new Error('Interal error, this code should be unreachable');
}

/**
 * Event wrapper around a Daily Rambam instance
 */
export class DailyRambamEvent extends Event {
  reading: any;
  category: string;
  /**
   * @param {HDate} date
   * @param {any} reading
   */
  constructor(date: HDate, reading: any) {
    super(date, `${reading.name} ${reading.perek}`, flags.DAILY_LEARNING);
    this.reading = reading;
    // this.memo = this.render('memo');
    this.alarm = false;
    this.category = 'Daily Rambam';
  }
  /**
   * Returns name of reading
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const reading = this.reading;
    if ((locale === 'he' || locale === 'he-x-nonikud') && typeof reading.perek === 'number') {
      return Locale.gettext(reading.name, locale) + ' פרק ' +
        gematriya(reading.perek);
    }
    return Locale.gettext(reading.name, locale) + ' ' + reading.perek;
  }
  /**
   * Returns a link to sefaria.org
   * @return {string}
   */
  url(): string {
    const reading = this.reading;
    const name = 'Mishneh Torah, ' + reading.name + '.' + reading.perek;
    const urlName = encodeURIComponent(name.replace(/ /g, '_').replace(/:/g, '.'));
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  getCategories(): string[] {
    return ['dailyRambam1'];
  }
}
