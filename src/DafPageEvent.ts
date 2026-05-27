import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent';
import {DafPage} from './DafPage';
import {sefariaUrl} from './common';
import shekalimDafYomiMap0 from './shekalimDafYomiMap.json';
import './locale';

export const shekalimDafYomiMap = shekalimDafYomiMap0 as Record<string, string>;

export const dafYomiSefaria: Record<string, string> = {
  Berachot: 'Berakhot',
  'Rosh Hashana': 'Rosh Hashanah',
  Gitin: 'Gittin',
  'Baba Kamma': 'Bava Kamma',
  'Baba Metzia': 'Bava Metzia',
  'Baba Batra': 'Bava Batra',
  Bechorot: 'Bekhorot',
  Arachin: 'Arakhin',
  Midot: 'Middot',
  Shekalim: 'Jerusalem_Talmud_Shekalim',
} as const;

/**
 * Abstract event wrapper around any kind of Talmud page ({@link DafPage}),
 * shared by {@link DafYomiEvent}, {@link DafWeeklyEvent}, and
 * {@link TanakhYomiEvent}. Holds the `daf` (tractate name + page number)
 * and provides default `render`, `renderBrief`, and `url` implementations
 * that produce sefaria.org or dafyomi.org links.
 *
 * Subclasses override `category`, `getCategories()`, and—where the
 * display format differs—`render`/`url`. Not instantiated directly;
 * use {@link DafYomiEvent}, {@link DafWeeklyEvent}, etc.
 */
export abstract class DafPageEvent extends DailyLearningEvent {
  daf: DafPage;
  constructor(date: HDate, daf: DafPage, mask: number) {
    super(date, daf.render('en'), mask);
    this.daf = daf;
  }
  /**
   * Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return this.daf.render(locale);
  }
  /**
   * Returns Daf Yomi name without the 'Daf Yomi: ' prefix (e.g. "Pesachim 107").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    return this.daf.render(locale);
  }
  /**
   * Returns a link to sefaria.org or dafyomi.org
   */
  url(): string {
    const daf = this.daf;
    const tractate = daf.getName();
    const blatt = daf.getBlatt();
    if (tractate === 'Kinnim' || tractate === 'Midot') {
      return `https://www.dafyomi.org/index.php?masechta=meilah&daf=${blatt}a`;
    } else if (tractate === 'Shekalim') {
      const aEntry = shekalimDafYomiMap[`${blatt}a`];
      const bEntry = shekalimDafYomiMap[`${blatt}b`];
      const aStart = aEntry.split('-')[0];
      const bEnd = bEntry.includes('-') ? bEntry.split('-')[1] : bEntry;
      const ref = `${aStart}-${bEnd}`.replaceAll(':', '.');
      return sefariaUrl('Jerusalem Talmud Shekalim', ref);
    } else {
      const name0 = dafYomiSefaria[tractate] || tractate;
      return sefariaUrl(name0, `${blatt}a`);
    }
  }
}
