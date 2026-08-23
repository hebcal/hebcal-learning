import {HDate} from '@hebcal/hdate';
import {Event} from '@hebcal/core/dist/esm/event';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';

/**
 * Registers a learning calendar with the {@link DailyLearning} registry,
 * absorbing the boilerplate shared by nearly every `<name>.ts` wrapper:
 * guarding the cycle's start date and building the {@link HDate} start marker
 * passed to {@link DailyLearning.addCalendar}.
 *
 * The `compute` callback receives the Hebrew date and the Israel flag, and
 * returns the day's `Event` — or `null` when there is no learning that day (a
 * gap in the cycle, or a bounded table's data horizon), per the registry's
 * contract. Dates before `startAbs` short-circuit to `null` before `compute` is
 * called, so callers need not repeat that guard. The `*Base.ts` calculators all
 * accept an {@link HDate} directly (as a `LearningDate`), so the callback can
 * just pass `hd` through — no `hd.abs()` needed.
 *
 * @param name registry name (case insensitive)
 * @param startAbs first valid R.D. day number, or `undefined` for schedules
 *   with no start bound (e.g. Psalms, Pirkei Avot, Kitzur Shulchan Aruch)
 * @param compute returns the day's `Event`, or `null` when there is no learning
 */
export function wrapSchedule(
  name: string,
  startAbs: number | undefined,
  compute: (hd: HDate, il: boolean) => Event | null
): void {
  const calendar = (hd: HDate, il: boolean): Event | null => {
    if (startAbs !== undefined && hd.abs() < startAbs) {
      return null;
    }
    return compute(hd, il);
  };
  DailyLearning.addCalendar(
    name,
    calendar,
    startAbs !== undefined ? new HDate(startAbs) : undefined
  );
}
