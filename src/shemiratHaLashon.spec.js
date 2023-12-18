import test from 'ava';
import {HDate, greg} from '@hebcal/core';
import {shemiratHaLashon, ShemiratHaLashonEvent} from './shemiratHaLashon.js';

// eslint-disable-next-line require-jsdoc
function hd2iso(hd) {
  return hd.greg().toISOString().substring(0, 10);
}

test('shemiratHaLashon-3-Av', (t) => {
  const hd1 = new HDate(3, 'Av', 5783);
  const reading1 = shemiratHaLashon(hd1);
  const hd2 = new HDate(3, 'Av', 5784);
  const reading2 = shemiratHaLashon(hd2);
  t.deepEqual(reading1, {bk: 2, k: 'x', b: 16.14, e: 16.15});
  t.deepEqual(reading2, {bk: 2, k: 'x', b: 19.5, e: 19.6});
});

test('shemiratHaLashon-2023-10', (t) => {
  const startAbs = greg.greg2abs(new Date(2023, 4, 12));
  const endAbs = greg.greg2abs(new Date(2023, 5, 2));
  const actual = [];
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const hd = new HDate(abs);
    const reading = shemiratHaLashon(hd);
    actual.push([hd2iso(hd), reading]);
  }
  const expected = [
    ['2023-05-12', {bk: 1, k: 'Chasimas Hasefer', b: 6.3, e: 6.4}],
    ['2023-05-13', {bk: 1, k: 'Chasimas Hasefer', b: 6.5, e: 6.6}],
    ['2023-05-14', {bk: 1, k: 'Chasimas Hasefer', b: 6.7, e: 6.9}],
    ['2023-05-15', {bk: 1, k: 'Chasimas Hasefer', b: '6.10', e: 6.11}],
    ['2023-05-16', {bk: 1, k: 'Chasimas Hasefer', b: 7.1, e: 7.5}],
    ['2023-05-17', {bk: 1, k: 'Chasimas Hasefer', b: 7.6, e: 7.6}],
    ['2023-05-18', {bk: 1, k: 'Chasimas Hasefer', b: 7.7, e: 7.8}],
    ['2023-05-19', {bk: 1, k: 'Chasimas Hasefer', b: 7.9, e: 7.9}],
    ['2023-05-20', {bk: 1, k: 'Chasimas Hasefer', b: '7.10', e: '7.10'}],
    ['2023-05-21', {bk: 1, k: 'Chasimas Hasefer', b: 7.11, e: 7.11}],
    ['2023-05-22', {bk: 1, k: 'Chasimas Hasefer', b: 7.12, e: 7.13}],
    ['2023-05-23', {bk: 2, k: 'x', b: 1.1, e: 1.2}],
    ['2023-05-24', {bk: 2, k: 'x', b: 1.3, e: 1.5}],
    ['2023-05-25', {bk: 2, k: 'x', b: 1.6, e: 1.7}],
    ['2023-05-26', {bk: 2, k: 'x', b: 1.8, e: 1.8}],
    ['2023-05-27', {bk: 2, k: 'x', b: 2.1, e: 2.4}],
    ['2023-05-28', {bk: 2, k: 'x', b: 2.5, e: 2.6}],
    ['2023-05-29', {bk: 2, k: 'x', b: 2.7, e: 2.7}],
    ['2023-05-30', {bk: 2, k: 'x', b: 2.8, e: 2.9}],
    ['2023-05-31', {bk: 2, k: 'x', b: '2.10', e: '2.10'}],
    ['2023-06-01', {bk: 2, k: 'x', b: 2.11, e: 2.11}],
    ['2023-06-02', {bk: 2, k: 'x', b: 3.1, e: 3.2}],
  ];
  t.deepEqual(actual, expected);
});

test('ShemiratHaLashonEvent', (t) => {
  const hd = new HDate(23, 'Adar I', 5784);
  const reading = shemiratHaLashon(hd);
  const ev = new ShemiratHaLashonEvent(hd, reading);
  t.is(ev.getDesc(), 'Book I, Shar Hatorah 2.20-2.23');
  t.is(ev.memo, 'Book I, The Gate of Torah 2.20-2.23');
  t.is(ev.url(), 'https://www.sefaria.org/Shemirat_HaLashon%2C_Book_I%2C_The_Gate_of_Torah.2.20?lang=bi');
});
