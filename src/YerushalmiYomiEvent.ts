import {Locale} from '@hebcal/core/dist/esm/locale';
import {HDate} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DailyLearningEvent} from './DailyLearningEvent';
import {YerushalmiReading} from './yerushalmiBase';
import {gematriyaNN, isHebrewLocale} from './common';
import './locale';
import vilnaMap0 from './yerushalmiVilnaMap.json';

const vilnaMap: Record<string, (string | null)[]> = vilnaMap0;

/**
 * Event wrapper around a Yerushalmi Yomi result
 */
export class YerushalmiYomiEvent extends DailyLearningEvent {
  daf: YerushalmiReading;
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
    const name = name0.replaceAll(' ', '_');
    const verses = verses0.replaceAll(':', '.');
    return `https://www.sefaria.org/${name}.${verses}?lang=bi`;
  }
  getCategories(): string[] {
    return ['yerushalmi', this.daf.ed];
  }
}
