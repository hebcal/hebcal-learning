import {expect, test} from 'vitest';
import {dailyPsalms} from '../src/psalmsBase';
import {PsalmsEvent} from '../src/PsalmsEvent';
import {HDate} from '@hebcal/hdate';

test('dailyPsalms', () => {
  expect(dailyPsalms(new HDate(1, 'Av', 5783))).toEqual([1, 9]);
  expect(dailyPsalms(new HDate(18, 'Sivan', 5783))).toEqual([88, 89]);
  expect(dailyPsalms(new HDate(29, 'Sivan', 5783))).toEqual([140, 144]);
  expect(dailyPsalms(new HDate(30, 'Sivan', 5783))).toEqual([145, 150]);
  expect(dailyPsalms(new HDate(29, 'Tamuz', 5783))).toEqual([140, 150]);
});

test('PsalmsEvent.url', () => {
  const hd = new HDate(2, 'Av', 5783);
  const reading = dailyPsalms(hd);
  const ev = new PsalmsEvent(hd, reading);
  expect(ev.url()).toBe('https://www.sefaria.org/Psalms.10-17?lang=bi');
});

test('PsalmsEvent.render', () => {
  const hd = new HDate(3, 'Av', 5783);
  const reading = dailyPsalms(hd);
  const ev = new PsalmsEvent(hd, reading);
  expect(ev.render('en')).toBe('Psalms 18-22');
});
