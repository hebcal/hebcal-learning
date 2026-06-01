import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DailyLearningEvent} from './DailyLearningEvent';
import {YerushalmiReading} from './yerushalmiBase';
import {gematriyaNN, isHebrewLocale, sefariaUrl} from './common';
import './locale';
import vilnaMap0 from './yerushalmiVilnaMap.json';

const vilnaMap: Record<string, (string | null)[]> = vilnaMap0;

/**
 * Event wrapper around a Yerushalmi (Jerusalem Talmud) Daf Yomi
 * reading. Used by both the `yerushalmi-vilna` and
 * `yerushalmi-schottenstein` calendars; the `daf.ed` field
 * distinguishes them.
 *
 * Cycle start dates:
 *  - **Vilna**: Shabbat, **2 February 1980** (15 Sh'vat 5740). Skips
 *    Yom Kippur and Tish'a B'Av, so `lookup` returns `null` on those
 *    days.
 *  - **Schottenstein**: Monday, **14 November 2022** (20 Cheshvan
 *    5783). Does not skip fast days.
 *
 * Looking up a date earlier than the relevant start date returns
 * `null`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/yerushalmiYomi';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const vilna = DailyLearning.lookup('yerushalmi-vilna', hd);
 * console.log(vilna.render('en'));  // => "Yerushalmi Eruvin 25"
 *
 * const schott = DailyLearning.lookup('yerushalmi-schottenstein', hd);
 * console.log(schott.render('en'));  // => "Yerushalmi Terumot 97"
 */
export class YerushalmiYomiEvent extends DailyLearningEvent {
  readonly daf: YerushalmiReading;
  get category(): string {
    return 'Yerushalmi Yomi';
  }
  constructor(date: HDate, daf: YerushalmiReading) {
    super(date, `${daf.name} ${daf.blatt}`, flags.YERUSHALMI_YOMI);
    this.daf = daf;
  }
  /**
   * Returns name of tractate and page (e.g. "Yerushalmi Beitzah 21").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const prefix = Locale.gettext('Yerushalmi', locale);
    return prefix + ' ' + this.renderBrief(locale);
  }
  /**
   * Returns name of tractate and page (e.g. "Beitzah 21").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const name = Locale.gettext(this.daf.name, loc);
    if (isHebrewLocale(loc)) {
      return name + ' דף ' + gematriyaNN(this.daf.blatt);
    }
    return name + ' ' + this.daf.blatt;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string | undefined {
    const daf = this.daf;
    if (daf.ed !== 'vilna') {
      return undefined;
    }
    const tractate = daf.name;
    const pageMap = vilnaMap[tractate];
    if (!Array.isArray(pageMap)) {
      return undefined;
    }
    const idx = daf.blatt - 1;
    const verses0 = pageMap[idx];
    if (typeof verses0 !== 'string') {
      return undefined;
    }
    const name0 = 'Jerusalem Talmud ' + tractate;
    const verses = verses0.replaceAll(':', '.');
    return sefariaUrl(name0, verses);
  }
  getCategories(): string[] {
    return ['yerushalmi', this.daf.ed];
  }
}
