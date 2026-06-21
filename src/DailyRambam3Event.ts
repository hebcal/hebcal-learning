import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import {RambamReading} from './rambam1Base.js';
import {DailyRambamEvent} from './DailyRambamEvent.js';
import './locale.js';

function combinePair(r1: RambamReading, r2: RambamReading): RambamReading {
  const name = r1.name;
  const perek0 = r1.perek;
  const perek2 = r2.perek as string;
  let perek;
  if (typeof perek0 === 'number') {
    perek = `${perek0}-${perek2}`;
  } else {
    const first = perek0.split('-');
    const last = perek2.split('-');
    perek = `${first[0]}-${last[1]}`;
  }
  return {name, perek};
}

/** @private */
export function collapseAdjacent(r: RambamReading[]): RambamReading[] {
  if (r[0].name === r[1].name && r[1].name === r[2].name) {
    return [combinePair(r[0], r[2])];
  }
  if (r[0].name === r[1].name) {
    return [combinePair(r[0], r[1]), r[2]];
  }
  if (r[1].name === r[2].name) {
    return [r[0], combinePair(r[1], r[2])];
  }
  return r;
}

/** @private */
export function makeDesc(readings: RambamReading[]): string {
  const collapsed = collapseAdjacent(readings);
  return collapsed.map(r => `${r.name} ${r.perek}`).join(', ');
}

/**
 * Event wrapper for the Mishneh Torah's **3-chapters-a-day** cycle.
 * Each event groups the three chapters studied that day, collapsing
 * adjacent chapters in the same section into a single range
 * (e.g. "Human Dispositions 1-2") for display.
 *
 * The cycle began on Sunday, **29 April 1984** (27 Nisan 5744) and
 * repeats every 339 days. Looking up a date earlier than that returns
 * `null` from `DailyLearning.lookup('rambam3', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
 * import '@hebcal/learning/rambam3';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('rambam3', hd);
 * console.log(ev.render('en'));
 * // => "Foreign Worship and Customs of the Nations 1-3"
 */
export class DailyRambam3Event extends DailyLearningEvent {
  readonly readings: RambamReading[];
  readonly events: DailyRambamEvent[];
  get category(): string {
    return 'Daily Rambam';
  }
  constructor(date: HDate, readings: RambamReading[]) {
    const collapsed = collapseAdjacent(readings);
    const desc = collapsed.map(r => `${r.name} ${r.perek}`).join(', ');
    super(date, desc);
    this.readings = collapsed;
    this.events = collapsed.map(r => new DailyRambamEvent(date, r));
    if (collapsed.length > 1) {
      this.memo = this.events
        .map(ev => {
          return ev.getDesc() + '\n' + ev.url();
        })
        .join('\n\n');
    }
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return this.events.map(ev => ev.render(locale)).join(', ');
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string | undefined {
    if (this.events.length === 1) {
      return this.events[0].url();
    }
    return undefined;
  }
  getCategories(): string[] {
    return ['dailyRambam3'];
  }
}
