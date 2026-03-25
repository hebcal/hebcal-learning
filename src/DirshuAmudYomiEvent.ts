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
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return (
      Locale.gettext('Dirshu Amud HaYomi', locale) +
      ': ' +
      this.renderBrief(locale)
    );
  }

  /**
   * Returns name of tractate and amud (e.g. "Shekalim 4b").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    locale = locale || 'en';
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const amud = this.amud;
    const name = Locale.gettext(amud.name, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
      const sideStr = amud.side === 'a' ? 'ע״א' : 'ע״ב';
      return name + ' דף ' + gematriya(amud.amud) + ' ' + sideStr;
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
