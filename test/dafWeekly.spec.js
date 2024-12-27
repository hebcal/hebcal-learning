import {expect, test} from 'vitest';
import {HDate} from '@hebcal/core';
import {dafWeekly} from '../src/dafWeeklyBase';
import {DafWeeklyEvent} from '../src/DafWeeklyEvent';

test('dafWeekly', () => {
  const daf1 = dafWeekly(new Date(2015, 8, 26));
  expect(daf1.blatt).toBe(88);
  expect(daf1.name).toBe('Yoma');
  const daf2 = dafWeekly(new Date(2015, 8, 27));
  expect(daf2.blatt).toBe(2);
  expect(daf2.name).toBe('Sukkah');
  const daf3 = dafWeekly(new Date(2057, 1, 17));
  expect(daf3.blatt).toBe(73);
  expect(daf3.name).toBe('Niddah');
});

test('dafWeekly-render', () => {
  const hd = new HDate(new Date(2008, 4, 9));
  const daf = dafWeekly(hd);
  const ev = new DafWeeklyEvent(hd, daf);
  expect(ev.render('en')).toBe('Shabbat 104');
  expect(ev.render('a')).toBe('Shabbos 104');
  expect(ev.render('he')).toBe('שַׁבָּת דף ק״ד');
  expect(ev.render('he-x-NoNikud')).toBe('שבת דף ק״ד');
  expect(ev.url()).toBe('https://www.sefaria.org/Shabbat.104a?lang=bi');
});
