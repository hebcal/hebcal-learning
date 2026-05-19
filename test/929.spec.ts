import {describe, expect, it} from 'vitest';
import {HDate, greg} from '@hebcal/hdate';
import {calculate929, nine29Start, nine29EndCycle1, nine29StartCycle2, TOTAL_929_CHAPTERS, Nine29Reading} from '../src/929Base';
import {Nine29Event} from '../src/929Event';
import '../src/locale';

function abs(d: Date): number {
  return greg.greg2abs(d);
}

function hdate(d: Date): HDate {
  return new HDate(d);
}

describe('929Start', () => {
  it('starts on Sunday 21 Dec 2014', () => {
    const startHd = new HDate(nine29Start);
    expect(startHd.getDay()).toBe(0); // 0 = Sunday
    const greg = startHd.greg();
    expect(greg.getFullYear()).toBe(2014);
    expect(greg.getMonth()).toBe(11); // 0-indexed: December
    expect(greg.getDate()).toBe(21);
  });
});

describe('929 basic reading', () => {
  it('returns chapter 1 on the first day (Sun 21 Dec 2014)', () => {
    const result = calculate929(new Date(2014, 11, 21));
    expect(result).not.toBeNull();
    expect(result!.cycleChap).toBe(1);
    expect(result!.cycleNum).toBe(1);
    expect(result!.book).toBe('Genesis');
    expect(result!.bookChap).toBe(1);
  });

  it('returns chapter 2 on Mon 22 Dec 2014', () => {
    const result = calculate929(new Date(2014, 11, 22));
    expect(result).not.toBeNull();
    expect(result!.cycleChap).toBe(2);
    expect(result!.cycleNum).toBe(1);
    expect(result!.book).toBe('Genesis');
    expect(result!.bookChap).toBe(2);
  });

  it('returns chapter 5 on Thu 25 Dec 2014', () => {
    const result = calculate929(new Date(2014, 11, 25));
    expect(result).not.toBeNull();
    expect(result!.cycleChap).toBe(5);
    expect(result!.cycleNum).toBe(1);
    expect(result!.book).toBe('Genesis');
    expect(result!.bookChap).toBe(5);
  });

  it('returns null on Fri 26 Dec 2014', () => {
    expect(calculate929(new Date(2014, 11, 26))).toBeNull();
  });

  it('returns null on Sat 27 Dec 2014', () => {
    expect(calculate929(new Date(2014, 11, 27))).toBeNull();
  });

  it('returns chapter 6 on Sun 28 Dec 2014 (resumes after Fri+Sat skip)', () => {
    const result = calculate929(new Date(2014, 11, 28));
    expect(result).not.toBeNull();
    expect(result!.cycleChap).toBe(6);
    expect(result!.cycleNum).toBe(1);
    expect(result!.book).toBe('Genesis');
    expect(result!.bookChap).toBe(6);
  });

  it('returns chapter 7 on Mon 29 Dec 2014', () => {
    const result = calculate929(new Date(2014, 11, 29));
    expect(result).not.toBeNull();
    expect(result!.cycleChap).toBe(7);
    expect(result!.cycleNum).toBe(1);
    expect(result!.book).toBe('Genesis');
    expect(result!.bookChap).toBe(7);
  });

  it('throws for dates before the program started', () => {
    expect(() => {
      calculate929(new Date(2014, 11, 20));
    }).toThrow('Date 2014-12-20 too early; 929 cycle began on 2014-12-21');
  });
});

describe('929 does NOT skip holidays', () => {
  // Rosh Hashana 5776 = Sun 13 Sep 2015 — a Sunday, so reading continues
  it('reads on Rosh Hashana (Sun 13 Sep 2015)', () => {
    const result = calculate929(new Date(2015, 8, 13));
    expect(result).not.toBeNull();
    expect(result!.cycleNum).toBe(1);
  });

  // Yom Kippur 5776 = Wed 23 Sep 2015
  it('reads on Yom Kippur (Wed 23 Sep 2015)', () => {
    const result = calculate929(new Date(2015, 8, 23));
    expect(result).not.toBeNull();
    expect(result!.cycleNum).toBe(1);
  });
});

describe('929 end of cycle 1', () => {
  // Cycle 1 used a modified schedule (holiday skips) so its last reading day is
  // a hardcoded historical constant (nine29EndCycle1 = Wed 18 Apr 2018) rather
  // than being derived from our simple Fri/Sat-only formula.

  it('nine29EndCycle1 is a Wednesday (Wed 18 Apr 2018)', () => {
    expect(new HDate(nine29EndCycle1).getDay()).toBe(3); // 3 = Wednesday
  });

  it('Thu 19 Apr 2018 returns null (start of gap to cycle 2)', () => {
    expect(calculate929(new HDate(nine29EndCycle1 + 1))).toBeNull();
  });

  it('Sun 15 Jul 2018 starts cycle 2 at chapter 1', () => {
    const cycle2Start = new HDate(nine29StartCycle2);
    expect(cycle2Start.getDay()).toBe(0); // Sunday
    const r = calculate929(cycle2Start);
    expect(r).not.toBeNull();
    expect(r!.cycleChap).toBe(1);
    expect(r!.cycleNum).toBe(2);
    expect(r!.book).toBe('Genesis');
    expect(r!.bookChap).toBe(1);
  });
});

describe('929 cycle 1→2 gap', () => {
  it('nine29EndCycle1 is Wednesday 18 Apr 2018', () => {
    const hd = new HDate(nine29EndCycle1);
    expect(hd.getDay()).toBe(3); // Wednesday
    const g = hd.greg();
    expect(g.getFullYear()).toBe(2018);
    expect(g.getMonth()).toBe(3); // April (0-indexed)
    expect(g.getDate()).toBe(18);
  });

  it('nine29StartCycle2 is Sunday 15 Jul 2018', () => {
    const hd = new HDate(nine29StartCycle2);
    expect(hd.getDay()).toBe(0); // Sunday
    const g = hd.greg();
    expect(g.getFullYear()).toBe(2018);
    expect(g.getMonth()).toBe(6); // July (0-indexed)
    expect(g.getDate()).toBe(15);
  });

  it('Wed 18 Apr 2018 is the last reading day of cycle 1', () => {
    const result = calculate929(new Date(2018, 3, 18));
    expect(result).not.toBeNull();
    expect(result!.cycleNum).toBe(1);
  });

  it('returns null on Thu 19 Apr 2018 (start of gap)', () => {
    expect(calculate929(new Date(2018, 3, 19))).toBeNull();
  });

  it('returns null on Mon 2 Jul 2018 (mid-gap)', () => {
    expect(calculate929(new Date(2018, 6, 2))).toBeNull();
  });

  it('returns null on Sat 14 Jul 2018 (day before cycle 2 starts)', () => {
    expect(calculate929(new Date(2018, 6, 14))).toBeNull();
  });
});

describe('929 cycle boundaries', () => {
  it('cycle 1 starts on Sun 21 Dec 2014 with chapter 1', () => {
    const result = calculate929(new Date(2014, 11, 21));
    expect(result).not.toBeNull();
    expect(result!.cycleChap).toBe(1);
    expect(result!.cycleNum).toBe(1);
    expect(result!.book).toBe('Genesis');
    expect(result!.bookChap).toBe(1);
  });

  // Cycle 1 used a modified schedule (holiday skips) so our formula cannot
  // reproduce its exact chapter count — we only verify its boundary dates.

  const cycles2to4 = [
    {cycle: 2, start: new Date(2018, 6, 15), end: new Date(2022, 1, 2)},
    {cycle: 3, start: new Date(2022, 1, 6), end: new Date(2025, 7, 27)},
    {cycle: 4, start: new Date(2025, 7, 31), end: new Date(2029, 2, 21)},
  ];

  for (const {cycle, start, end} of cycles2to4) {
    it(`cycle ${cycle} starts on ${start.toDateString()} with chapter 1`, () => {
      const result = calculate929(start);
      expect(result).not.toBeNull();
      expect(result!.cycleChap).toBe(1);
      expect(result!.cycleNum).toBe(cycle);
      expect(result!.book).toBe('Genesis');
      expect(result!.bookChap).toBe(1);
    });

    it(`cycle ${cycle} ends on ${end.toDateString()} with chapter 929`, () => {
      const result = calculate929(end);
      expect(result).not.toBeNull();
      expect(result!.cycleChap).toBe(TOTAL_929_CHAPTERS);
      expect(result!.cycleNum).toBe(cycle);
      expect(result!.book).toBe('II Chronicles');
      expect(result!.bookChap).toBe(36);
    });
  }
});

describe('929 book and chapter mapping', () => {
  it('chapter 50 is Genesis 50 (last chapter of Genesis)', () => {
    // Cycle 2 starts Sun 15 Jul 2018; 5 reading days/week; chapter 50 = week 10 Thursday
    const r = calculate929(new Date(2018, 8, 20)); // Thu 20 Sep 2018
    expect(r).not.toBeNull();
    expect(r!.cycleChap).toBe(50);
    expect(r!.book).toBe('Genesis');
    expect(r!.bookChap).toBe(50);
  });

  it('chapter 51 is Exodus 1 (first chapter after Genesis)', () => {
    const r = calculate929(new Date(2018, 8, 23)); // Sun 23 Sep 2018
    expect(r).not.toBeNull();
    expect(r!.cycleChap).toBe(51);
    expect(r!.book).toBe('Exodus');
    expect(r!.bookChap).toBe(1);
  });

  it('chapter 929 is II Chronicles 36 (last chapter of cycle)', () => {
    // Cycle 2 ends Wed 2 Feb 2022
    const r = calculate929(new Date(2022, 1, 2));
    expect(r).not.toBeNull();
    expect(r!.cycleChap).toBe(929);
    expect(r!.book).toBe('II Chronicles');
    expect(r!.bookChap).toBe(36);
  });
});

describe('929Event', () => {
  it('render() English — book chapter (day)', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const reading: Nine29Reading = {cycleChap: 1, cycleNum: 1, book: 'Genesis', bookChap: 1};
    const ev = new Nine29Event(hd, reading);
    expect(ev.render()).toBe('Genesis 1 (1)');
    expect(ev.render('en')).toBe('Genesis 1 (1)');
  });

  it('render() English mid-book — Deuteronomy 34 (187)', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 187, cycleNum: 1, book: 'Deuteronomy', bookChap: 34});
    expect(ev.render('en')).toBe('Deuteronomy 34 (187)');
  });

  it('render() Hebrew — gematriya for book chapter, Arabic for day number', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 187, cycleNum: 1, book: 'Deuteronomy', bookChap: 34});
    expect(ev.render('he')).toBe('דְּבָרִים ל״ד (187)');
  });

  it('render() Hebrew — Genesis 1', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 1, cycleNum: 1, book: 'Genesis', bookChap: 1});
    expect(ev.render('he')).toBe('בְּרֵאשִׁית א׳ (1)');
  });

  it('render() Hebrew — II Chronicles 36 (929)', () => {
    const hd = hdate(new Date(2022, 1, 2));
    const ev = new Nine29Event(hd, {cycleChap: 929, cycleNum: 2, book: 'II Chronicles', bookChap: 36});
    expect(ev.render('he')).toBe('דִברֵי הַיָמִים ב׳ ל״ו (929)');
  });

  it('renderBrief() English', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 187, cycleNum: 1, book: 'Deuteronomy', bookChap: 34});
    expect(ev.renderBrief('en')).toBe('Deuteronomy 34');
  });

  it('renderBrief() Hebrew', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 187, cycleNum: 1, book: 'Deuteronomy', bookChap: 34});
    expect(ev.renderBrief('he')).toBe('דְּבָרִים ל״ד');
  });

  it('url() links to sefaria.org', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 187, cycleNum: 1, book: 'Deuteronomy', bookChap: 34});
    expect(ev.url()).toBe('https://www.sefaria.org/Deuteronomy.34?lang=bi');
  });

  it('url() handles multi-word book names', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 929, cycleNum: 2, book: 'II Chronicles', bookChap: 36});
    expect(ev.url()).toBe('https://www.sefaria.org/II_Chronicles.36?lang=bi');
  });

  it('url() Song of Songs', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 798, cycleNum: 2, book: 'Song of Songs', bookChap: 8});
    expect(ev.url()).toBe('https://www.sefaria.org/Song_of_Songs.8?lang=bi');
  });

  it('has category "929"', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new Nine29Event(hd, {cycleChap: 1, cycleNum: 1, book: 'Genesis', bookChap: 1});
    expect(ev.category).toBe('929');
    expect(ev.getCategories()).toEqual(['929']);
  });
});
