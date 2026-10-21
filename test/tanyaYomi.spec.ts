import {expect, test} from 'vitest';
import {readFileSync} from 'node:fs';
import {HDate, months} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core';
import {tanyaYomi, tanyaYomiSefariaRef} from '../src/tanyaYomiBase';
import '../src/tanyaYomi';

const sefaria: [string, string][] = JSON.parse(
  readFileSync(new URL('./tanyaYomi.sefaria.json', import.meta.url), 'utf8')
);

test('matches Sefaria for every crawled day', () => {
  expect(sefaria.length).toBeGreaterThan(1500);
  for (const [iso, ref] of sefaria) {
    const dt = new Date(iso + 'T12:00:00');
    expect(tanyaYomiSefariaRef(tanyaYomi(dt)), iso).toBe(ref);
  }
});

test('cycle begins 19 Kislev', () => {
  for (const year of [5785, 5787, 5790, 5800]) {
    expect(tanyaYomi(new HDate(19, months.KISLEV, year))).toEqual({
      book: 'Likkutei Amarim',
      section: 'Title Page',
      verse: 1,
    });
    expect(tanyaYomi(new HDate(18, months.KISLEV, year)).book).toBe('Kuntres Acharon');
  }
});

test('leap and regular cycles', () => {
  // 5786 is a regular year, 5787 a leap year
  expect(tanyaYomi(new HDate(12, months.ADAR_I, 5786))).toEqual({
    book: 'Likkutei Amarim',
    chap: 33,
    verse: 6,
  });
  expect(tanyaYomi(new HDate(1, months.ADAR_II, 5787))).toEqual({
    book: 'Likkutei Amarim',
    chap: 34,
    verse: 4,
  });
  // Tishrei 5788 belongs to the cycle that began in Kislev 5787 (leap)
  expect(tanyaYomi(new HDate(28, months.AV, 5787))).toEqual(
    tanyaYomi(new HDate(28, months.AV, 5784))
  );
  expect(tanyaYomi(new HDate(10, months.TISHREI, 5788))).toEqual(
    tanyaYomi(new HDate(10, months.TISHREI, 5785))
  );
});

test('every day for 60 years has a reading', () => {
  const startAbs = HDate.hebrew2abs(5780, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(5840, months.TISHREI, 1);
  let prev = '';
  for (let abs = startAbs; abs < endAbs; abs++) {
    const ref = tanyaYomiSefariaRef(tanyaYomi(abs));
    expect(ref).not.toBe(prev);
    prev = ref;
  }
});

test('event', () => {
  const hd = new HDate(12, months.ADAR_I, 5786);
  const ev = DailyLearning.lookup('tanyaYomi', hd)!;
  expect(ev.getDesc()).toBe('Likkutei Amarim 33:6');
  expect(ev.render('en')).toBe('Tanya: Likkutei Amarim 33');
  expect(ev.renderBrief('en')).toBe('Likkutei Amarim 33');
  expect(ev.render('he')).toBe('תַּנְיָא: לִקּוּטֵי אֲמָרִים לג');
  expect(ev.render('he-x-NoNikud')).toBe('תניא: לקוטי אמרים לג');
  expect(ev.url()).toBe(
    'https://www.sefaria.org/Tanya%2C_Part_I%3B_Likkutei_Amarim.33.6?lang=bi'
  );
  expect(ev.getCategories()).toEqual(['tanyaYomi']);
  expect(ev.category).toBe('Tanya Yomi');

  const ev2 = DailyLearning.lookup('tanyaYomi', new HDate(20, months.KISLEV, 5787))!;
  expect(ev2.render('en')).toBe('Tanya: Likkutei Amarim, Approbation');
  expect(ev2.url()).toBe(
    'https://www.sefaria.org/Tanya%2C_Part_I%3B_Likkutei_Amarim%2C_Approbation.3.1?lang=bi'
  );
  const ev3 = DailyLearning.lookup('tanyaYomi', new HDate(10, months.CHESHVAN, 5787))!;
  expect(ev3.render('en')).toBe('Tanya: Iggeret HaKodesh 26');
  expect(ev3.render('ashkenazi')).toBe('Tanya: Iggeres HaKodesh 26');
});
