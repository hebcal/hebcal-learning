import type {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import type {SeferHaMitzvotReading} from './seferHaMitzvotBase.js';

type CommandmentType = 'Positive' | 'Negative';

/** `"P186"` -> `'Positive'`, `"N10"` -> `'Negative'`, anything else -> `undefined` */
function commandmentType(part: string): CommandmentType | undefined {
  if (!/^[PN]\d/.test(part)) {
    return undefined;
  }
  return part[0] === 'P' ? 'Positive' : 'Negative';
}

/**
 * Event wrapper around a Sefer Hamitzvos (Daily Mitzvah by Rambam)
 * reading.
 *
 * The cycle began on Sunday, **29 April 1984** (27 Nisan 5744) and
 * repeats every 339 days. Looking up a date earlier than that returns
 * `null` from `DailyLearning.lookup('seferHaMitzvot', ...)`.
 *
 * @example
 * import {HDate} from '@hebcal/hdate';
 * import {DailyLearning} from '@hebcal/core';
 * import '@hebcal/learning/seferHaMitzvot';
 *
 * const hd = new HDate(new Date(2024, 3, 8));  // 29 Adar II 5784
 * const ev = DailyLearning.lookup('seferHaMitzvot', hd);
 * console.log(ev.render('en'));
 * // => "Day 13: Negative Commandment 10, 47, 60, 6, 5, 2, 3, 4, 15;
 * //    Positive Commandment 186; Negative Commandment 23, 24"
 */
export class SeferHaMitzvotEvent extends DailyLearningEvent {
  readonly reading: SeferHaMitzvotReading;
  override get category(): string {
    return 'Sefer Hamitzvot';
  }
  constructor(date: HDate, reading: SeferHaMitzvotReading) {
    const desc = `Day ${reading.day}: ${reading.reading}`;
    super(date, desc);
    this.reading = reading;
    if (reading.note) {
      this.memo = reading.note;
    }
  }
  override render(_locale?: string): string {
    const r = this.reading;
    const parts = r.reading.split(', ');
    let prev: CommandmentType | undefined;
    let str = '';
    for (const part of parts) {
      const type = commandmentType(part);
      const suffix = part.substring(1);
      if (type && type === prev) {
        str += `, ${suffix}`;
      } else if (type) {
        str += `; ${type} Commandment ${suffix}`;
      } else {
        str += `; ${part}`;
      }
      prev = type;
    }
    if (r.note) {
      str += '; Note About Varying Customs';
    }
    return `Day ${r.day}: ` + str.substring(2);
  }
  override renderBrief(_locale?: string): string {
    return this.getDesc();
  }
  /**
   * Returns a link to chabad.org
   */
  override url(): string {
    const dt = this.getDate().greg();
    const yy = dt.getFullYear();
    const mm = dt.getMonth() + 1;
    const dd = dt.getDate();
    const dateStr = `${mm}/${dd}/${yy}`;
    return `https://www.chabad.org/dailystudy/seferHamitzvos.asp?tdate=${dateStr}`;
  }
  override getCategories(): string[] {
    return ['seferHaMitzvot'];
  }
}
