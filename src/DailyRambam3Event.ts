import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';
import {RambamReading} from './rambam1Base';
import {DailyRambamEvent} from './DailyRambamEvent';
import './locale';

/**
 * Returns true if all 3 chapters are from the same section
 */
export function canCombineReading(r: RambamReading[]): boolean {
  return r[0].name === r[1].name && r[1].name === r[2].name;
}

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

/**
 * If all three chapters are from the same section,
 * we can combine into a single reading with a chapter range
 */
export function combineReading(reading: RambamReading[]): RambamReading {
  return combinePair(reading[0], reading[2]);
}

/**
 * Event wrapper around a Daily Rambam instance
 */
export class DailyRambam3Event extends Event {
  readings: RambamReading[];
  events: DailyRambamEvent[];
  category: string;
  constructor(date: HDate, readings: RambamReading[]) {
    const isCombined = canCombineReading(readings);
    const r1or3 = isCombined ? [combineReading(readings)] : readings;
    const desc = r1or3.map(r => `${r.name} ${r.perek}`).join(', ');
    super(date, desc, flags.DAILY_LEARNING);
    this.readings = r1or3;
    this.events = r1or3.map(r => new DailyRambamEvent(date, r));
    this.alarm = false;
    this.category = 'Daily Rambam';
    if (!isCombined) {
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
