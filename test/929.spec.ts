import {describe, expect, it} from 'vitest';
import {HDate, greg} from '@hebcal/hdate';
import {_929, _929Start, TOTAL_929_CHAPTERS, _929Reading} from '../src/929Base';
import {_929Event} from '../src/929Event';

function abs(d: Date): number {
  return greg.greg2abs(d);
}

function hdate(d: Date): HDate {
  return new HDate(d);
}

describe('_929Start', () => {
  it('starts on Sunday 21 Dec 2014', () => {
    const startHd = new HDate(_929Start);
    expect(startHd.getDay()).toBe(0); // 0 = Sunday
    const greg = startHd.greg();
    expect(greg.getFullYear()).toBe(2014);
    expect(greg.getMonth()).toBe(11); // 0-indexed: December
    expect(greg.getDate()).toBe(21);
  });
});

describe('_929 basic reading', () => {
  it('returns chapter 1 on the first day (Sun 21 Dec 2014)', () => {
    const result = _929(new Date(2014, 11, 21));
    expect(result).not.toBeNull();
    expect(result!.chapter).toBe(1);
    expect(result!.cycle).toBe(1);
  });

  it('returns chapter 2 on Mon 22 Dec 2014', () => {
    const result = _929(new Date(2014, 11, 22));
    expect(result).not.toBeNull();
    expect(result!.chapter).toBe(2);
    expect(result!.cycle).toBe(1);
  });

  it('returns chapter 5 on Thu 25 Dec 2014', () => {
    const result = _929(new Date(2014, 11, 25));
    expect(result).not.toBeNull();
    expect(result!.chapter).toBe(5);
    expect(result!.cycle).toBe(1);
  });

  it('returns null on Fri 26 Dec 2014', () => {
    expect(_929(new Date(2014, 11, 26))).toBeNull();
  });

  it('returns null on Sat 27 Dec 2014', () => {
    expect(_929(new Date(2014, 11, 27))).toBeNull();
  });

  it('returns chapter 6 on Sun 28 Dec 2014 (resumes after Fri+Sat skip)', () => {
    const result = _929(new Date(2014, 11, 28));
    expect(result).not.toBeNull();
    expect(result!.chapter).toBe(6);
    expect(result!.cycle).toBe(1);
  });

  it('returns chapter 7 on Mon 29 Dec 2014', () => {
    const result = _929(new Date(2014, 11, 29));
    expect(result).not.toBeNull();
    expect(result!.chapter).toBe(7);
    expect(result!.cycle).toBe(1);
  });

  it('returns null for dates before the program started', () => {
    expect(_929(new Date(2014, 11, 20))).toBeNull();
    expect(_929(new Date(2000, 0, 1))).toBeNull();
  });
});

describe('_929 does NOT skip holidays', () => {
  // Rosh Hashana 5776 = Sun 13 Sep 2015 — a Sunday, so reading continues
  it('reads on Rosh Hashana (Sun 13 Sep 2015)', () => {
    const result = _929(new Date(2015, 8, 13));
    expect(result).not.toBeNull();
    expect(result!.cycle).toBe(1);
  });

  // Yom Kippur 5776 = Wed 23 Sep 2015
  it('reads on Yom Kippur (Wed 23 Sep 2015)', () => {
    const result = _929(new Date(2015, 8, 23));
    expect(result).not.toBeNull();
    expect(result!.cycle).toBe(1);
  });
});

describe('_929 end of cycle 1', () => {
  // Walk forward from the start to find where chapter 929 lands and verify
  // structural properties: it must be a Wednesday, the next day (Thu) is
  // null (wind-down), and the following Sunday starts cycle 2 at chapter 1.
  it('chapter 929 lands on a Wednesday', () => {
    // Find the last chapter of cycle 1 by scanning
    let lastChapterDate: HDate | null = null;
    let abs = _929Start;
    while (true) {
      const hd = new HDate(abs);
      const r = _929(hd);
      if (r && r.chapter === TOTAL_929_CHAPTERS && r.cycle === 1) {
        lastChapterDate = hd;
        break;
      }
      // Safety: don't scan more than 4 years of days
      if (abs > _929Start + 4 * 366) break;
      abs++;
    }
    expect(lastChapterDate).not.toBeNull();
    expect(lastChapterDate!.getDay()).toBe(3); // 3 = Wednesday
  });

  it('Thursday after chapter 929 returns null (wind-down)', () => {
    let lastChapterAbs: number | null = null;
    let abs = _929Start;
    while (true) {
      const hd = new HDate(abs);
      const r = _929(hd);
      if (r && r.chapter === TOTAL_929_CHAPTERS && r.cycle === 1) {
        lastChapterAbs = abs;
        break;
      }
      if (abs > _929Start + 4 * 366) break;
      abs++;
    }
    expect(lastChapterAbs).not.toBeNull();
    // Thursday = lastChapterAbs + 1
    expect(_929(new HDate(lastChapterAbs! + 1))).toBeNull();
  });

  it('Sunday after chapter 929 starts cycle 2 at chapter 1', () => {
    let lastChapterAbs: number | null = null;
    let abs = _929Start;
    while (true) {
      const hd = new HDate(abs);
      const r = _929(hd);
      if (r && r.chapter === TOTAL_929_CHAPTERS && r.cycle === 1) {
        lastChapterAbs = abs;
        break;
      }
      if (abs > _929Start + 4 * 366) break;
      abs++;
    }
    expect(lastChapterAbs).not.toBeNull();
    // Next Sunday = lastChapterAbs + 4 (Wed → Sun)
    const cycle2Start = new HDate(lastChapterAbs! + 4);
    expect(cycle2Start.getDay()).toBe(0); // Sunday
    const r = _929(cycle2Start);
    expect(r).not.toBeNull();
    expect(r!.chapter).toBe(1);
    expect(r!.cycle).toBe(2);
  });
});

describe('_929Event', () => {
  it('renders correctly', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const reading: _929Reading = {chapter: 1, cycle: 1};
    const ev = new _929Event(hd, reading);
    expect(ev.render()).toBe('929 Chapter 1');
    expect(ev.renderBrief()).toBe('Chapter 1');
  });

  it('returns correct url', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new _929Event(hd, {chapter: 42, cycle: 1});
    expect(ev.url()).toBe('https://www.929.org.il/page/42');
  });

  it('has category "929"', () => {
    const hd = hdate(new Date(2014, 11, 21));
    const ev = new _929Event(hd, {chapter: 1, cycle: 1});
    expect(ev.category).toBe('929');
    expect(ev.getCategories()).toEqual(['929']);
  });
});
