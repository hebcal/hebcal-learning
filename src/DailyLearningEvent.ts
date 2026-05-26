import {HDate} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';

/**
 * Abstract base class for all daily-learning events produced by this package
 * (Daf Yomi, Mishna Yomi, Daily Rambam, 929, etc.).
 *
 * Concrete subclasses are returned by `DailyLearning.lookup(name, hdate)`
 * once the corresponding calendar has been registered (either via the
 * top-level `import '@hebcal/learning'` or a per-calendar import such as
 * `import '@hebcal/learning/dafYomi'`). Subclasses extend the
 * hebcal `Event` API with calendar-specific fields (e.g. `daf`, `reading`,
 * `readings`, `mishnaYomi`) and typically override `render(locale)` and
 * `url()`.
 *
 * Events created by this package have `alarm` set to `false` (these are
 * study readings, not appointments) and carry the `DAILY_LEARNING` event
 * flag — some subclasses use a more specific flag (`DAF_YOMI`,
 * `NACH_YOMI`, `MISHNA_YOMI`, `YERUSHALMI_YOMI`) instead.
 */
export abstract class DailyLearningEvent extends Event {
  constructor(date: HDate, desc: string, mask: number = flags.DAILY_LEARNING) {
    super(date, desc, mask);
    this.alarm = false;
  }
  /**
   * Category name used as the location field in iCalendar event feeds.
   * Subclasses override this with their calendar's display name
   * (e.g. "Daf Yomi", "Daily Rambam", "929").
   */
  get category(): string | undefined {
    return undefined;
  }
}
