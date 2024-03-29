import test from 'ava';
import './register.js';
import {DailyLearning, HDate} from '@hebcal/core';

test('lookup', (t) => {
  const hd = new HDate(17, 'Sivan', 5783);
  const ev = DailyLearning.lookup('psalms', hd);
  t.is(typeof ev, 'object');
  t.is(ev.getDesc(), 'Psalms 83-87');
});

test('dafWeekly', (t) => {
  const hd = new HDate(17, 'Sivan', 5783);
  const ev = DailyLearning.lookup('dafWeekly', hd);
  t.is(typeof ev, 'object');
  t.is(ev.getDesc(), 'Ketubot 39');
  t.deepEqual(ev.getCategories(), ['dafWeekly']);
});

test('dafWeeklySunday', (t) => {
  const ev1 = DailyLearning.lookup('dafWeeklySunday', new HDate(17, 'Sivan', 5783));
  t.is(ev1, null);
  const ev2 = DailyLearning.lookup('dafWeeklySunday', new HDate(2, 'Elul', 5783));
  t.is(ev2, null);
  const ev3 = DailyLearning.lookup('dafWeeklySunday', new HDate(3, 'Elul', 5783));
  t.is(ev3.getDesc(), 'Ketubot 50');
  t.deepEqual(ev3.getCategories(), ['dafWeekly']);
});

test('tanakhYomi', (t) => {
  const hd = new HDate(17, 'Sivan', 5783);
  const ev = DailyLearning.lookup('tanakhYomi', hd);
  t.is(typeof ev, 'object');
  t.is(ev.getDesc(), 'Minor Prophets Seder 10');
  t.deepEqual(ev.getCategories(), ['tanakhYomi']);

  const ev2 = DailyLearning.lookup('tanakhYomi', new HDate(2, 'Elul', 5783));
  t.is(ev2, null);
});
