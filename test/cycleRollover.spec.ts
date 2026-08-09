import {expect, test} from 'vitest';
import {HDate, greg} from '@hebcal/hdate';
import {calculate929, nine29Start, nine29StartCycle2, TOTAL_929_CHAPTERS} from '../src/929Base';
import {yerushalmiYomi, vilna, schottenstein, cycleStart, numSpecialDays} from '../src/yerushalmiBase';
import {tanakhYomi} from '../src/tanakhYomiBase';
import {DafYomi} from '../src/dafYomiBase';

/**
 * These calendars used to recompute their cycle by stepping forward from the
 * epoch one day (or one cycle) at a time, which both grew without bound for
 * far-future dates and, for Vilna, drifted into an unreachable state. The
 * tests below pin the cycle boundaries and exercise the far-future range.
 */

test('yerushalmi-vilna-rollover-2172', () => {
  // 18 Av 5932 (2172-08-08) used to throw: the cycle-start walk under-advanced
  // and produced total === numDapim, one past the end of the shas table.
  const abs = 793162;
  const hd = new HDate(abs);
  expect(hd.toString()).toBe('18 Av 5932');
  expect(greg.abs2greg(abs).toISOString().slice(0, 10)).toBe('2172-08-08');

  // A new cycle begins on this day rather than blowing up.
  expect(yerushalmiYomi(abs, vilna)).toEqual({name: 'Berakhot', blatt: 1, ed: 'vilna'});
  expect(cycleStart(vilna, abs)).toBe(abs);

  // The preceding day is the last daf of the outgoing cycle.
  const prev = yerushalmiYomi(abs - 1, vilna);
  expect(prev).toEqual({name: 'Niddah', blatt: 13, ed: 'vilna'});

  // ...and the days after continue in order.
  expect(yerushalmiYomi(abs + 1, vilna)).toEqual({name: 'Berakhot', blatt: 2, ed: 'vilna'});
});

test('yerushalmi-vilna-rollover-2420', () => {
  // The second date where the old cycle walk broke down.
  const abs = 883792;
  expect(new HDate(abs).toString()).toBe('20 Tishrei 6181');
  expect(yerushalmiYomi(abs, vilna)).not.toBeNull();
});

test('yerushalmi-vilna-every-cycle-boundary-is-berakhot-1', () => {
  // Walk 200 consecutive cycles and confirm each starts at Berakhot 1 and the
  // day before ends at the last daf of Niddah.
  const numDapim = vilna.shas.reduce((sum, m) => sum + m[1], 0);
  expect(numDapim).toBe(1554);
  let abs = vilna.startAbs;
  for (let cycle = 0; cycle < 200; cycle++) {
    expect(yerushalmiYomi(abs, vilna)).toEqual({name: 'Berakhot', blatt: 1, ed: 'vilna'});
    expect(cycleStart(vilna, abs)).toBe(abs);
    if (cycle > 0) {
      // find the previous reading day (skipping YK / Tish'a B'Av)
      let prev = abs - 1;
      while (yerushalmiYomi(prev, vilna) === null) {
        prev--;
      }
      expect(yerushalmiYomi(prev, vilna)).toEqual({name: 'Niddah', blatt: 13, ed: 'vilna'});
    }
    // advance past the end of this cycle
    let next = abs + numDapim;
    while (cycleStart(vilna, next) === abs) {
      next++;
    }
    abs = cycleStart(vilna, next);
  }
  // 200 cycles is roughly 850 years past 1980
  expect(greg.abs2greg(abs).getFullYear()).toBeGreaterThan(2800);
});

test('929-cycle-boundaries', () => {
  // Cycle 2 onward repeats on a fixed 1302-day period; chapter 929 lands on
  // the Wednesday at offset 1298 and the next cycle opens the Sunday after.
  for (let cycle = 0; cycle < 300; cycle++) {
    const start = nine29StartCycle2 + cycle * 1302;
    expect(start % 7).toBe(0); // Sunday
    const first = calculate929(start)!;
    expect(first.cycleChap).toBe(1);
    expect(first.cycleNum).toBe(2 + cycle);
    expect(first.book).toBe('Genesis');
    expect(first.bookChap).toBe(1);

    const last = calculate929(start + 1298)!;
    expect(last.cycleChap).toBe(TOTAL_929_CHAPTERS);
    expect(last.cycleNum).toBe(2 + cycle);
    expect((start + 1298) % 7).toBe(3); // Wednesday

    // Thursday through Saturday after the last chapter have no reading
    for (let d = 1299; d <= 1301; d++) {
      expect(calculate929(start + d)).toBeNull();
    }
  }
});

test('929-cycle-1-truncated-at-historical-end', () => {
  const first = calculate929(nine29Start)!;
  expect(first.cycleNum).toBe(1);
  expect(first.cycleChap).toBe(1);
  // Cycle 1 followed a modified schedule and stopped early, on Israel's 70th
  // Independence Day, without reaching chapter 929.
  const lastAbs = greg.greg2abs(new Date(2018, 3, 18));
  const last = calculate929(lastAbs)!;
  expect(last.cycleNum).toBe(1);
  expect(last.cycleChap).toBe(869);
  expect(calculate929(lastAbs + 1)).toBeNull();
  // Gap until cycle 2 opens
  expect(calculate929(nine29StartCycle2 - 1)).toBeNull();
  expect(calculate929(nine29StartCycle2)!.cycleNum).toBe(2);
});

test('929-never-skips-or-repeats-a-chapter', () => {
  // Sweep 40 years and confirm chapters run 1..929 strictly in order.
  let expected = 0;
  let cycle = 2;
  const start = nine29StartCycle2;
  for (let abs = start; abs < start + 40 * 366; abs++) {
    const r = calculate929(abs);
    if (r === null) continue;
    if (r.cycleNum !== cycle) {
      expect(expected).toBe(TOTAL_929_CHAPTERS);
      cycle = r.cycleNum;
      expected = 0;
    }
    expected++;
    expect(r.cycleChap).toBe(expected);
  }
});

test('far-future-year-2999-is-computable', () => {
  const abs = greg.greg2abs(new Date(2999, 5, 15));
  expect(new DafYomi(abs).getName()).toBeTruthy();
  expect(calculate929(abs) === null || calculate929(abs)!.cycleChap > 0).toBe(true);
  expect(yerushalmiYomi(abs, schottenstein)).not.toBeNull();
  const v = yerushalmiYomi(abs, vilna);
  expect(v === null || v.blatt > 0).toBe(true);
  const t = tanakhYomi(abs);
  expect(t === null || t.getBlatt() !== undefined).toBe(true);
});

test('numSpecialDays-boundaries', () => {
  // Exactly one Yom Kippur and one (observed) Tish'a B'Av per Hebrew year.
  for (let year = 5750; year < 6250; year++) {
    const rh = HDate.hebrew2abs(year, 7 /* TISHREI */, 1);
    const nextRh = HDate.hebrew2abs(year + 1, 7, 1);
    expect(numSpecialDays(vilna, rh, nextRh - 1)).toBe(2);
  }
  // Schottenstein never skips
  expect(numSpecialDays(schottenstein, 738473, 803533)).toBe(0);
});
