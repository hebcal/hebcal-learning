import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';
import {SeferHaMitzvotReading} from './seferHaMitzvotBase';

enum ReadingType {
  Other,
  Positive,
  Negative,
}

/**
 * Event wrapper around a Sefer HaMitzvot reading
 */
export class SeferHaMitzvotEvent extends Event {
  reading: SeferHaMitzvotReading;
  category: string;
  constructor(date: HDate, reading: SeferHaMitzvotReading) {
    const desc = `Day ${reading.day}: ${reading.reading}`;
    super(date, desc, flags.DAILY_LEARNING);
    this.reading = reading;
    this.alarm = false;
    this.category = 'Sefer Hamitzvot';
    if (reading.note) {
      this.memo = reading.note;
    }
  }
  render(locale?: string): string {
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
  renderBrief(locale?: string): string {
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
