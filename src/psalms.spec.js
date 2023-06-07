import test from 'ava';
import {dailyPsalms, PsalmsEvent} from './psalms';
import {HDate} from '@hebcal/core';

test('dailyPsalms', (t) => {
  t.deepEqual(dailyPsalms(new HDate(1, 'Av', 5783)), [1, 9]);
  t.deepEqual(dailyPsalms(new HDate(18, 'Sivan', 5783)), [88, 89]);
  t.deepEqual(dailyPsalms(new HDate(29, 'Sivan', 5783)), [140, 144]);
  t.deepEqual(dailyPsalms(new HDate(30, 'Sivan', 5783)), [145, 150]);
  t.deepEqual(dailyPsalms(new HDate(29, 'Tamuz', 5783)), [140, 150]);
});

test('PsalmsEvent.url', (t) => {
  const hd = new HDate(2, 'Av', 5783);
  const reading = dailyPsalms(hd);
  const ev = new PsalmsEvent(hd, reading);
  t.is(ev.url(), 'https://www.sefaria.org/Psalms.10-17?lang=bi');
});

test('PsalmsEvent.render', (t) => {
  const hd = new HDate(3, 'Av', 5783);
  const reading = dailyPsalms(hd);
  const ev = new PsalmsEvent(hd, reading);
  t.is(ev.render('en'), 'Psalms 18-22');
});
