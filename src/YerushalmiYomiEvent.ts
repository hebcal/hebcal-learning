import {Event, HDate, flags, Locale, gematriya} from '@hebcal/core';
import {YerushalmiReading} from './yerushalmiBase';
import './locale';
import vilnaMap0 from './yerushalmiVilnaMap.json';

const vilnaMap: {
  [key: string]: (string | null)[];
} = vilnaMap0;

/**
 * Event wrapper around a Yerushalmi Yomi result
 */
export class YerushalmiYomiEvent extends Event {
  daf: YerushalmiReading;
  category: string;
  constructor(date: HDate, daf: YerushalmiReading) {
    super(date, `${daf.name} ${daf.blatt}`, flags.YERUSHALMI_YOMI);
    this.daf = daf;
    this.category = 'Yerushalmi Yomi';
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
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const name = Locale.gettext(this.daf.name, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return name + ' דף ' + gematriya(this.daf.blatt);
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
    const name = name0.replace(/ /g, '_');
    const verses = verses0.replace(/:/g, '.');
    return `https://www.sefaria.org/${name}.${verses}?lang=bi`;
  }
  getCategories(): string[] {
    return ['yerushalmi', this.daf.ed];
  }
}
