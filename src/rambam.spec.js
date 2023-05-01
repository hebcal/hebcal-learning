import test from 'ava';
import {dailyRambam1} from './rambam';
import {greg} from '@hebcal/core';
import fullCycle from './rambam1cycle.json';

// eslint-disable-next-line require-jsdoc
function abs2iso(abs) {
  return greg.abs2greg(abs).toISOString().substring(0, 10);
}

test('rambam1-single', (t) => {
  const dt = new Date(2020, 6, 9);
  const reading = dailyRambam1(dt);
  t.deepEqual(reading, {name: 'Kings and Wars', perek: 12});
});

test('rambam1-single2', (t) => {
  t.deepEqual(dailyRambam1(new Date(1986, 0, 1)), {name: 'Red Heifer', perek: 8});
  t.deepEqual(dailyRambam1(new Date(1987, 0, 1)), {name: 'Testimony', perek: 16});
  t.deepEqual(dailyRambam1(new Date(1987, 1, 1)), {name: 'Kings and Wars', perek: 4});
  t.deepEqual(dailyRambam1(new Date(1987, 1, 8)), {name: 'Kings and Wars', perek: 11});
  t.deepEqual(dailyRambam1(new Date(1987, 1, 9)), {name: 'Kings and Wars', perek: 12});
  t.deepEqual(dailyRambam1(new Date(1987, 1, 10)), {name: 'Transmission of the Oral Law', perek: '1-21'});
  t.deepEqual(dailyRambam1(new Date(1987, 5, 1)), {name: 'Sabbath', perek: 4});
  t.deepEqual(dailyRambam1(new Date(1988, 0, 1)), {name: 'Vows', perek: 2});
  t.deepEqual(dailyRambam1(new Date(1989, 0, 1)), {name: 'Vessels', perek: 7});
  t.deepEqual(dailyRambam1(new Date(1990, 0, 1)), {name: 'Foreign Worship and Customs of the Nations', perek: 4});
  t.deepEqual(dailyRambam1(new Date(1991, 0, 1)), {name: 'Second Tithes and Fourth Year\'s Fruit', perek: 1});
});

test('rambam1-1984', (t) => {
  const start = greg.greg2abs(new Date(1984, 3, 29));
  const endAbs = greg.greg2abs(new Date(1984, 4, 16));
  const actual = {};
  for (let abs = start; abs <= endAbs; abs++) {
    const reading = dailyRambam1(abs);
    actual[abs2iso(abs)] = `${reading.name} ${reading.perek}`;
  }
  const expected = {
    '1984-04-29': 'Transmission of the Oral Law 1-21',
    '1984-04-30': 'Transmission of the Oral Law 22-33',
    '1984-05-01': 'Transmission of the Oral Law 34-45',
    '1984-05-02': 'Positive Mitzvot 1-83',
    '1984-05-03': 'Positive Mitzvot 84-166',
    '1984-05-04': 'Positive Mitzvot 167-248',
    '1984-05-05': 'Negative Mitzvot 1-122',
    '1984-05-06': 'Negative Mitzvot 123-245',
    '1984-05-07': 'Negative Mitzvot 246-365',
    '1984-05-08': 'Overview of Mishneh Torah Contents 1:1-4:8',
    '1984-05-09': 'Overview of Mishneh Torah Contents 5:1-9:9',
    '1984-05-10': 'Overview of Mishneh Torah Contents 10:1-14:10',
    '1984-05-11': 'Foundations of the Torah 1',
    '1984-05-12': 'Foundations of the Torah 2',
    '1984-05-13': 'Foundations of the Torah 3',
    '1984-05-14': 'Foundations of the Torah 4',
    '1984-05-15': 'Foundations of the Torah 5',
    '1984-05-16': 'Foundations of the Torah 6',
  };
  t.deepEqual(actual, expected);
});

test('rambam1-fullCycle', (t) => {
  const start = greg.greg2abs(new Date(2023, 3, 23));
  const endAbs = greg.greg2abs(new Date(2026, 1, 2));
  const actual = {};
  for (let abs = start; abs <= endAbs; abs++) {
    const reading = dailyRambam1(abs);
    actual[abs2iso(abs)] = `${reading.name} ${reading.perek}`;
  }
  t.deepEqual(actual, fullCycle);
});
