import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate, gematriya} from '@hebcal/hdate';
import {dafYomiSefaria, shekalimDafYomiMap} from './DafPageEvent.js';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import {DirshuAmudYomi, calculateDirshuAmud} from './dirshuAmudYomiBase.js';
import {isHebrewLocale, sefariaUrl} from './common.js';
import './locale.js';

/**
 * Event wrapper around a Dirshu Amud HaYomi reading — one amud
 * (half-page) of the Babylonian Talmud per day, roughly twice as slow
 * as the standard Daf Yomi.
 *
 * The cycle began on Monday, **16 October 2023** (1 Cheshvan 5784).
 * Looking up a date earlier than that returns `null` from
 * `DailyLearning.lookup('dirshuAmudYomi', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/dirshuAmudYomi';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('dirshuAmudYomi', hd);
 * console.log(ev.render('en'));
 * // => "Dirshu Amud HaYomi: Shabbat 27a"
 */
export class DirshuAmudYomiEvent extends DailyLearningEvent {
  readonly amud: DirshuAmudYomi;
  get category(): string {
    return 'Dirshu Amud HaYomi';
  }

  constructor(date: HDate) {
    const amud = calculateDirshuAmud(date);
    super(date, `${amud.name} ${amud.amud}${amud.side}`);
    this.amud = amud;
  }

  /**
   * Returns the name with "Dirshu Amud HaYomi: " prefix (e.g. "Dirshu Amud HaYomi: Shekalim 4b").
   * In Hebrew, uses full amud notation with "דף" and "ע״א"/"ע״ב" (e.g. "פסחים דף פ״ד ע״ב").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const prefix = Locale.gettext('Dirshu Amud HaYomi', locale);
    const loc = (locale || 'en').toLowerCase();
    const amud = this.amud;
    const name = Locale.gettext(amud.name, loc);
    let amudStr: string;
    if (isHebrewLocale(loc)) {
      const sideStr = amud.side === 'a' ? 'ע״א' : 'ע״ב';
      amudStr = name + ' דף ' + gematriya(amud.amud) + ' ' + sideStr;
    } else {
      amudStr = name + ' ' + amud.amud + amud.side;
    }
    return prefix + ': ' + amudStr;
  }

  /**
   * Returns name of tractate and amud (e.g. "Shekalim 4b").
   * In Hebrew, uses short notation without "דף" and with plain "א"/"ב" (e.g. "פסחים פ״ד ב").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const amud = this.amud;
    const name = Locale.gettext(amud.name, loc);
    if (isHebrewLocale(loc)) {
      const sideStr = amud.side === 'a' ? 'א' : 'ב';
      return name + ' ' + gematriya(amud.amud) + ' ' + sideStr;
    }
    return name + ' ' + amud.amud + amud.side;
  }

  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const amud = this.amud;
    const tractate = amud.name;
    if (tractate === 'Shekalim') {
      const entry = shekalimDafYomiMap[`${amud.amud}${amud.side}`];
      const ref = entry.replaceAll(':', '.');
      return sefariaUrl('Jerusalem Talmud Shekalim', ref);
    }
    const name0 = dafYomiSefaria[tractate] || tractate;
    return sefariaUrl(name0, `${amud.amud}${amud.side}`);
  }

  getCategories(): string[] {
    return ['dirshuAmudYomi'];
  }
}
