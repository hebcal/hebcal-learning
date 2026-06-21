import {HDate} from '@hebcal/hdate';
import {DailyLearningEvent} from './DailyLearningEvent.js';
import {SeferHaMitzvotReading} from './seferHaMitzvotBase.js';

enum ReadingType {
  Other,
  Positive,
  Negative,
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
 * import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
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
  get category(): string {
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
  render(_locale?: string): string {
    const r = this.reading;
    const parts = r.reading.split(', ');
    let prev = ReadingType.Other;
    let str = '';
    for (const part of parts) {
      const ch = part[0];
      const isPos = ch === 'P';
      const isNeg = ch === 'N';
      const code = part.charCodeAt(1);
      const isNumber = code >= 48 && code <= 57;
      const type =
        isPos && isNumber
          ? ReadingType.Positive
          : isNeg && isNumber
            ? ReadingType.Negative
            : ReadingType.Other;
      const suffix = part.substring(1);
      if (type === prev && type !== ReadingType.Other) {
        str += `, ${suffix}`;
      } else if (type !== ReadingType.Other) {
        const prefix = isPos ? 'Positive' : 'Negative';
        str += `; ${prefix} Commandment ${suffix}`;
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
  renderBrief(_locale?: string): string {
    return this.getDesc();
  }
  /**
   * Returns a link to chabad.org
   */
  url(): string {
    const dt = this.getDate().greg();
    const yy = dt.getFullYear();
    const mm = dt.getMonth() + 1;
    const dd = dt.getDate();
    const dateStr = `${mm}/${dd}/${yy}`;
    return `https://www.chabad.org/dailystudy/seferHamitzvos.asp?tdate=${dateStr}`;
  }
  getCategories(): string[] {
    return ['seferHaMitzvot'];
  }
}
