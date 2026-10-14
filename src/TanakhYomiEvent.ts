import {type HDate, Locale} from '@hebcal/hdate';
import {flags} from '@hebcal/core/dist/esm/event';
import {DafPageEvent} from './DafPageEvent.js';
import type {TanakhYomi} from './tanakhYomiBase.js';
import {gematriyaNN, sefariaUrl} from './common.js';

/**
 * A parsed Masoretic verse range such as `"Joshua 14:15-17:3"` or, for a
 * seder that runs into the next book, `"Hosea 14:6-Joel 2:26"`.
 * @private
 */
type VerseRange = {
  book: string;
  start: string;
  /** Present only when the range ends in a different book */
  endBook?: string;
  /** `"17:3"`, or a bare verse (`"41"`) when the range ends in the same chapter */
  end?: string;
};

const RANGE_RE = /^(.+?) (\d+:\d+)(?:-(?:(.+?) )?(\d+(?::\d+)?))?$/;

/** @private */
function parseVerses(verses: string): VerseRange {
  const m = RANGE_RE.exec(verses);
  if (m === null) {
    throw new Error(`Unparseable Tanakh Yomi verses: ${verses}`);
  }
  return {book: m[1], start: m[2], endBook: m[3], end: m[4]};
}

/**
 * Last verse of each book in which a seder starts but does not end.
 * Sefaria cannot link a range that spans two books, so the link for such
 * a seder covers its part in the first book.
 * @private
 */
const lastVerse: Record<string, string> = {
  'I Samuel': '31:13',
  'I Kings': '22:54',
  Hosea: '14:10',
  Joel: '4:21',
  Amos: '9:15',
  Obadiah: '1:21',
  Micah: '7:20',
  Zephaniah: '3:20',
  Haggai: '2:23',
  Zechariah: '14:21',
  Ezra: '10:44',
  'I Chronicles': '29:30',
};

/**
 * Event wrapper around a Tanakh Yomi seder reading.
 *
 * The cycle began on **26 October 1948** (23 Tishrei 5709). It skips
 * Shabbat and major festivals, so `DailyLearning.lookup('tanakhYomi',
 * hd)` returns `null` on those days as well as on any date before the
 * cycle began.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core';
 * import '@hebcal/learning/tanakhYomi';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('tanakhYomi', hd);
 * console.log(ev.render('en'));  // => "Ezekiel Seder 3 (6:1-7:27)"
 */
export class TanakhYomiEvent extends DafPageEvent {
  override get category(): string {
    return 'Tanakh Yomi';
  }
  constructor(date: HDate, daf: TanakhYomi) {
    super(date, daf, flags.DAILY_LEARNING);
    this.memo = daf.verses;
  }
  /**
   * Returns the seder followed by its verse range, e.g.
   * "Joshua Seder 9 (14:15-17:3)" or "Kings Seder 6 (I Kings 7:21-8:10)".
   * The book is named in the range only when it differs from the seder's
   * book, so a printed calendar shows what to read without a lookup.
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  override render(locale?: string): string {
    return this.daf.render(locale) + ' (' + this.renderVerses(locale) + ')';
  }
  /**
   * Same as {@link render}: the verse range is the reading itself, not
   * supplementary detail.
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  override renderBrief(locale?: string): string {
    const str = this.render(locale);
    return str.replace(' Seder ', ' S');
  }
  /**
   * Renders just the verse range, e.g. "14:15-17:3" or
   * "Hosea 14:6-Joel 2:26". Hebrew locales use Hebrew book names and
   * numerals ("יד:טו-יז:ג").
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  renderVerses(locale?: string): string {
    const r = parseVerses(this.memo!);
    const isHebrew = Locale.isHebrewLocale(locale);
    const num = (s: string) => (isHebrew ? s.split(':').map(gematriyaNN).join(':') : s);
    const book = (s: string) => Locale.gettext(s, locale) + ' ';
    let str = (r.book === this.daf.getName() ? '' : book(r.book)) + num(r.start);
    if (r.end) {
      str += '-' + (r.endBook ? book(r.endBook) : '') + num(r.end);
    }
    return str;
  }
  /**
   * Returns a link to sefaria.org
   */
  override url(): string {
    const r = parseVerses(this.memo!);
    let end = r.end;
    if (r.endBook) {
      end = lastVerse[r.book];
    }
    let verses = r.start;
    if (end && end !== r.start) {
      verses += '-' + end;
    }
    return sefariaUrl(r.book, verses.replaceAll(':', '.'));
  }
  override getCategories(): string[] {
    return ['tanakhYomi'];
  }
}
