import test from 'ava';
import {dailyRambam1} from './rambam';
import {HDate, months, greg} from '@hebcal/core';
import fullCycle from './rambam1cycle.json';

test.skip('rambam-single', (t) => {
  const dt = new Date(2020, 6, 9);
  const reading = dailyRambam1(dt);
  console.log(reading);
  t.deepEqual(reading, {name: 'Kings and Wars', perek: 12});
});
