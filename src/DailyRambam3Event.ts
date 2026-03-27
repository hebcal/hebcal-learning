import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent';
import {RambamReading} from './rambam1Base';
import {DailyRambamEvent} from './DailyRambamEvent';
import './locale';

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
 * Event wrapper around a Daily Rambam instance
 */
export class DailyRambam3Event extends DailyLearningEvent {
  readings: RambamReading[];
  events: DailyRambamEvent[];
  category: string;
  constructor(date: HDate, readings: RambamReading[]) {
    const collapsed = collapseAdjacent(readings);
    const desc = collapsed.map(r => `${r.name} ${r.perek}`).join(', ');
    super(date, desc);
    this.readings = collapsed;
    this.events = collapsed.map(r => new DailyRambamEvent(date, r));
    this.category = 'Daily Rambam';
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
