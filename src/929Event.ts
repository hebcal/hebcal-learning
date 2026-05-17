import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';
import {_929Reading} from './929Base';

/**
 * Event wrapper for a daily 929 Tanach chapter reading.
 * Each event corresponds to one Bible chapter in the 929 program
 * (https://www.929.org.il).
 */
export class _929Event extends Event {
  reading: _929Reading;
  category: string;

  constructor(date: HDate, reading: _929Reading) {
    super(date, `929 Chapter ${reading.chapter}`, flags.DAILY_LEARNING);
    this.reading = reading;
    this.alarm = false;
    this.category = '929';
  }

  /**
   * Returns the name of the reading.
   * @param [_locale] Optional locale name (currently unused; 929 has no
   *   locale-specific rendering).
   */
  render(_locale?: string): string {
    return `929 Chapter ${this.reading.chapter}`;
  }

  /**
   * Returns a brief description without any prefix.
   */
  renderBrief(_locale?: string): string {
    return `Chapter ${this.reading.chapter}`;
  }

  /**
   * Returns a link to the 929 website for the current chapter.
   * e.g. https://www.929.org.il/page/42
   */
  url(): string {
    return `https://www.929.org.il/page/${this.reading.chapter}`;
  }

  getCategories(): string[] {
    return ['929'];
  }
}
