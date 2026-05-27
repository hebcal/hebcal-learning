import {HDate, gematriya} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {DailyLearningEvent} from './DailyLearningEvent';
import {isHebrewLocale, sefariaUrl} from './common';
import './locale';

/**
 * Abstract base class for daily learning where each day's reading is
 * a single "book + chapter" reference — used by {@link NachYomiEvent}
 * (chapters of Nevi'im and Ketuvim) and {@link PerekYomiEvent}
 * (chapters of the Mishna).
 *
 * Stores the book/tractate name as `k` and the chapter number as `v`,
 * and produces a Sefaria URL of the form
 * `https://www.sefaria.org/{book}.{chapter}?lang=bi`. Not instantiated
 * directly.
 */
export abstract class DailyChapterEvent extends DailyLearningEvent {
  k: string;
  v: number;
  constructor(date: HDate, k: string, v: number, mask: number) {
    super(date, `${k} ${v}`, mask);
    this.k = k;
    this.v = v;
  }
  /**
   * Returns name of tractate and page (e.g. "Beitzah 21").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const name = Locale.gettext(this.k, loc);
    if (isHebrewLocale(loc)) {
      return name + ' ' + gematriya(this.v);
    }
    return name + ' ' + this.v;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string {
    return sefariaUrl(this.k, this.v);
  }
  getCategories(): string[] {
    return ['unknown'];
  }
}
