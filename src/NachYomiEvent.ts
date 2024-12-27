import {Event, HDate, Locale, flags, gematriya} from '@hebcal/core';
import {NachYomi} from './nachYomiBase';

/**
 * Event wrapper around a Nach Yomi instance
 */
export class NachYomiEvent extends Event {
  nachYomi: NachYomi;
  category: string;
  constructor(date: HDate, nachYomi: NachYomi) {
    super(date, `${nachYomi.k} ${nachYomi.v}`, flags.NACH_YOMI);
    this.nachYomi = nachYomi;
    this.category = 'Nach Yomi';
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
    const name = Locale.gettext(this.nachYomi.k, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return name + ' ' + gematriya(this.nachYomi.v);
    }
    return name + ' ' + this.nachYomi.v;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    const name = this.nachYomi.k.replace(/ /g, '_');
    const chapter = this.nachYomi.v;
    return `https://www.sefaria.org/${name}.${chapter}?lang=bi`;
  }
  getCategories(): string[] {
    return ['nachyomi'];
  }
}
