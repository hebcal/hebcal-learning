import {expect, test} from 'vitest';
import {perekYomi} from '../src/perekYomiBase';
import {greg} from '@hebcal/hdate';

function abs2iso(abs) {
  return greg.abs2greg(abs).toISOString().substring(0, 10);
}

test('perekYomi-single', () => {
  const r1 = perekYomi(new Date(2025, 1, 8));
  expect(r1.k).toBe('Berakhot');
  expect(r1.v).toBe(1);

  const r2 = perekYomi(new Date(2025, 1, 19));
  expect(r2.k).toBe('Peah');
  expect(r2.v).toBe(3);
});

test('perekYomi-jan-2025', () => {
  const start = greg.greg2abs(new Date(2025, 0, 1));
  const endAbs = greg.greg2abs(new Date(2025, 0, 31));
  const actual = {};
  for (let abs = start; abs <= endAbs; abs++) {
    const reading = perekYomi(abs);
    actual[abs2iso(abs)] = `${reading.k} ${reading.v}`;
  }
  const expected = {
    '2025-01-01': 'Mikvaot 5',
    '2025-01-02': 'Mikvaot 6',
    '2025-01-03': 'Mikvaot 7',
    '2025-01-04': 'Mikvaot 8',
    '2025-01-05': 'Mikvaot 9',
    '2025-01-06': 'Mikvaot 10',
    '2025-01-07': 'Niddah 1',
    '2025-01-08': 'Niddah 2',
    '2025-01-09': 'Niddah 3',
    '2025-01-10': 'Niddah 4',
    '2025-01-11': 'Niddah 5',
    '2025-01-12': 'Niddah 6',
    '2025-01-13': 'Niddah 7',
    '2025-01-14': 'Niddah 8',
    '2025-01-15': 'Niddah 9',
    '2025-01-16': 'Niddah 10',
    '2025-01-17': 'Makhshirin 1',
    '2025-01-18': 'Makhshirin 2',
    '2025-01-19': 'Makhshirin 3',
    '2025-01-20': 'Makhshirin 4',
    '2025-01-21': 'Makhshirin 5',
    '2025-01-22': 'Makhshirin 6',
    '2025-01-23': 'Zavim 1',
    '2025-01-24': 'Zavim 2',
    '2025-01-25': 'Zavim 3',
    '2025-01-26': 'Zavim 4',
    '2025-01-27': 'Zavim 5',
    '2025-01-28': 'Tevul Yom 1',
    '2025-01-29': 'Tevul Yom 2',
    '2025-01-30': 'Tevul Yom 3',
    '2025-01-31': 'Tevul Yom 4',
  };
  expect(actual).toEqual(expected);
});
