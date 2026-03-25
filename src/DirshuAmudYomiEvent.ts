import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate, gematriya} from '@hebcal/hdate';
import {dafYomiSefaria, shekalimDafYomiMap} from './DafPageEvent';
import {DailyLearningEvent} from './DailyLearningEvent';
import {DirshuAmudYomi, calculateDirshuAmud} from './dirshuAmudYomiBase';
import './locale';

/**
 * Event wrapper around a Dirshu Amud HaYomi result
 */
export class DirshuAmudYomiEvent extends DailyLearningEvent {
  amud: DirshuAmudYomi;
  category: string;

  constructor(date: HDate) {
    const amud = calculateDirshuAmud(date);
    super(date, `${amud.name} ${amud.amud}${amud.side}`);
    this.amud = amud;
    this.category = 'Dirshu Amud HaYomi';
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
    if (loc === 'he' || loc === 'he-x-nonikud') {
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
    if (loc === 'he' || loc === 'he-x-nonikud') {
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
      return `https://www.sefaria.org/Jerusalem_Talmud_Shekalim.${ref}?lang=bi`;
    }
    const name0 = dafYomiSefaria[tractate] || tractate;
    const name = name0.replaceAll(' ', '_');
    return `https://www.sefaria.org/${name}.${amud.amud}${amud.side}?lang=bi`;
  }

  getCategories(): string[] {
    return ['dirshuAmudYomi'];
  }
}
