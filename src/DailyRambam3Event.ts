import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';
import {canCombineReading, combineReading} from './rambam3Base';
import {RambamReading} from './rambam1Base';
import {DailyRambamEvent} from './DailyRambamEvent';
import './locale';

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
