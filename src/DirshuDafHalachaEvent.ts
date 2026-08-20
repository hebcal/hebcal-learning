import {HDate} from '@hebcal/hdate';
import {Locale} from '@hebcal/core/dist/esm/locale';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import {DirshuDafHalacha} from './dirshuDafHalachaBase.js';
import {formatBeginEndRange, gematriyaNN, isHebrewLocale, sefariaUrl} from './common.js';
import './locale.js';

const BOOK_NAME = 'Mishnah Berurah';
const PROGRAM_NAME = "Daf HaYomi B'Halacha";
const SEFARIA_BOOK = 'Shulchan Arukh, Orach Chayim';

/** `"345:1"` -> `"שמה:א"` */
function gematriyaRef(ref: string): string {
  return ref.split(':').map(gematriyaNN).join(':');
}

function renderRange(reading: DirshuDafHalacha, hebrew: boolean): string {
  const {b, e} = reading;
  if (!hebrew) {
    return e ? formatBeginEndRange(b, e) : b;
  }
  const begin = gematriyaRef(b);
  if (!e) {
    return begin;
  }
  const p1 = b.split(':');
  const p2 = e.split(':');
  // repeat the siman only when the reading crosses into a different one
  const end = p1[0] === p2[0] && p2.length > 1 ? gematriyaNN(p2[1]) : gematriyaRef(e);
  return begin + '-' + end;
}

/**
 * Event wrapper around a Dirshu Daf HaYomi B'Halacha reading — the daily
 * Mishnah Berurah program, one amud of the Dirshu edition from Sunday
 * through Thursday and a review (chazarah) of the week's five days on
 * Friday and Shabbat.
 *
 * Readings are transcribed from Dirshu's luach booklets, Hebrew pocket luachs
 * and wall calendars, and run from the third cycle's first day — **20 February
 * 2022** — through **31 August 2027**; outside that window
 * `DailyLearning.lookup('dirshuDafHalacha', ...)` returns `null`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/dirshuDafHalacha';
 *
 * const hd = new HDate(new Date(2025, 11, 7));  // 17 Kislev 5786
 * const ev = DailyLearning.lookup('dirshuDafHalacha', hd);
 * console.log(ev.render('en'));
 * // => "Daf HaYomi B'Halacha: Mishnah Berurah 345:1-3"
 */
export class DirshuDafHalachaEvent extends DailyLearningEvent {
  readonly reading: DirshuDafHalacha;
  get category(): string {
    return PROGRAM_NAME;
  }

  constructor(date: HDate, reading: DirshuDafHalacha) {
    const range = renderRange(reading, false);
    const chazarah = reading.review ? 'Chazarah ' : '';
    super(date, `${chazarah}${BOOK_NAME} ${range}`);
    this.reading = reading;
  }

  /**
   * Returns the name with "Daf HaYomi B'Halacha: " prefix
   * (e.g. "Daf HaYomi B'Halacha: Mishnah Berurah 345:1-3").
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return Locale.gettext(PROGRAM_NAME, locale) + ': ' + this.renderBrief(locale);
  }

  /**
   * Returns the book name and reference without the program name
   * (e.g. "Mishnah Berurah 345:1-3", or "Chazarah Mishnah Berurah 345:1-346:3"
   * on the Friday and Shabbat review days).
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    const loc = (locale || 'en').toLowerCase();
    const reading = this.reading;
    const prefix = reading.review ? Locale.gettext('Chazarah', loc) + ' ' : '';
    const book = Locale.gettext(BOOK_NAME, loc);
    return prefix + book + ' ' + renderRange(reading, isHebrewLocale(loc));
  }

  /**
   * Returns a link to sefaria.org for the Shulchan Arukh, Orach Chayim
   * siman and se'if covered by this reading.
   */
  url(): string {
    const {b, e} = this.reading;
    // a reference without a se'if means the whole siman, whose final se'if
    // this package does not know; link to the start of the reading instead
    const wholeSiman = b.indexOf(':') === -1 || (e && e.indexOf(':') === -1);
    const range = e && !wholeSiman ? formatBeginEndRange(b, e) : b;
    return sefariaUrl(SEFARIA_BOOK, range.replaceAll(':', '.'));
  }

  getCategories(): string[] {
    return ['dirshuDafHalacha'];
  }
}
