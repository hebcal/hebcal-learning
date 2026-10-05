import type {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import type {RambamReading} from './rambam1Base.js';
import {DailyRambamEvent} from './DailyRambamEvent.js';
import './locale.js';

function combinePair(r1: RambamReading, r2: RambamReading): RambamReading {
  const {name, perek: perek1} = r1;
  const perek2 = String(r2.perek);
  const perek =
    typeof perek1 === 'number'
      ? `${perek1}-${perek2}`
      : `${perek1.split('-')[0]}-${perek2.split('-')[1]}`;
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
 * import {DailyLearning} from '@hebcal/core';
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
  override get category(): string {
    return 'Daily Rambam';
  }
  constructor(date: HDate, readings: RambamReading[]) {
    const collapsed = collapseAdjacent(readings);
    super(date, collapsed.map(r => `${r.name} ${r.perek}`).join(', '));
    this.readings = collapsed;
    this.events = collapsed.map(r => new DailyRambamEvent(date, r));
    if (collapsed.length > 1) {
      this.memo = this.events.map(ev => ev.getDesc() + '\n' + ev.url()).join('\n\n');
    }
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to empty locale).
   */
  override render(locale?: string): string {
    return this.events.map(ev => ev.render(locale)).join(', ');
  }
  /**
   * Returns a link to sefaria.org
   */
  override url(): string | undefined {
    if (this.events.length === 1) {
      return this.events[0].url();
    }
    return undefined;
  }
  override getCategories(): string[] {
    return ['dailyRambam3'];
  }
}
