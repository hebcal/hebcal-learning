import test from 'ava';
import './register';
import {DailyLearning, HDate} from '@hebcal/core';

test('lookup', (t) => {
  const hd = new HDate(17, 'Sivan', 5783);
  const ev = DailyLearning.lookup('psalms', hd);
  t.is(typeof ev, 'object');
  t.is(ev.getDesc(), 'Psalms 83-87');
});
