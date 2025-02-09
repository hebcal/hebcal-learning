import {Event, HDate, Locale, gematriya} from '@hebcal/core';
import './locale';

/**
 * Event wrapper for learning where you read one chapter per day
 * used by Nach Yomi and Perek Yomi
 */
export class DailyChapterEvent extends Event {
  k: string;
  v: number;
  category: string;
  constructor(
    date: HDate,
    k: string,
    v: number,
    category: string,
    mask: number
  ) {
    super(date, `${k} ${v}`, mask);
    this.k = k;
    this.v = v;
    this.category = category;
  }
  /**
   * Returns name of tractate and page (e.g. "Beitzah 21").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const name = Locale.gettext(this.k, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return name + ' ' + gematriya(this.v);
    }
    return name + ' ' + this.v;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const name = this.k.replace(/ /g, '_');
    const chapter = this.v;
    return `https://www.sefaria.org/${name}.${chapter}?lang=bi`;
  }
  getCategories(): string[] {
    return ['unknown'];
  }
}
