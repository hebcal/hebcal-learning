import {expect, test} from 'vitest';
import {dailyRambam3, canCombineReading, combineReading} from '../src/rambam3Base';
import {greg} from '@hebcal/core';

function abs2iso(abs: number): string {
  return greg.abs2greg(abs).toISOString().substring(0, 10);
}

test('canCombineReading', () => {
  expect(canCombineReading([
    {name: 'Kings and Wars', perek: 10},
    {name: 'Kings and Wars', perek: 11},
    {name: 'Kings and Wars', perek: 12},
  ])).toBe(true);
  expect(canCombineReading([
    {name: 'Foundations of the Torah', perek: 10},
    {name: 'Human Dispositions', perek: 1},
    {name: 'Human Dispositions', perek: 2},
  ])).toBe(false);
});

test('combineReading', () => {
  expect(combineReading([
    {name: 'Foobar', perek: 3},
    {name: 'Foobar', perek: 4},
    {name: 'Foobar', perek: 5},
  ])).toEqual({name: 'Foobar', perek: '3-5'});
  expect(combineReading([
    {name: 'Quux', perek: '4-6'},
    {name: 'Quux', perek: '7-11'},
    {name: 'Quux', perek: '12-15'},
  ])).toEqual({name: 'Quux', perek: '4-15'});
});

test('rambam3-single', () => {
  const reading = dailyRambam3(new Date(2020, 6, 9));
  const expected = [
    {name: 'Kings and Wars', perek: 10},
    {name: 'Kings and Wars', perek: 11},
    {name: 'Kings and Wars', perek: 12},
  ];
  expect(reading).toEqual(expected);
});

test('rambam3-single2', () => {
  const reading = dailyRambam3(new Date(1984, 4, 6));
  const expected = [
    {name: 'Foundations of the Torah', perek: 10},
    {name: 'Human Dispositions', perek: 1},
    {name: 'Human Dispositions', perek: 2},
  ];
  expect(reading).toEqual(expected);
});

test('rambam3-single3', () => {
  const reading = dailyRambam3(new Date(2024, 2, 27));
  const expected = [
    {name: 'Transmission of the Oral Law', perek: '1-21'},
    {name: 'Transmission of the Oral Law', perek: '22-33'},
    {name: 'Transmission of the Oral Law', perek: '34-45'},
  ];
  expect(reading).toEqual(expected);
});

test('rambam3-1984', () => {
  const start = greg.greg2abs(new Date(1984, 3, 29));
  const endAbs = greg.greg2abs(new Date(1984, 4, 20));
  const actual: Record<string, string> = {};
  for (let abs = start; abs <= endAbs; abs++) {
    const reading = dailyRambam3(abs);
    let strs: string[] = [];
    if (canCombineReading(reading)) {
      const combined = combineReading(reading);
      strs.push(`${combined.name} ${combined.perek}`);
    } else {
      for (let i = 0; i < 3; i++) {
        strs.push(`${reading[i].name} ${reading[i].perek}`);
      }
    }
    actual[abs2iso(abs)] = strs.join(', ');
  }
  const expected = {
    '1984-04-29': 'Transmission of the Oral Law 1-45',
    '1984-04-30': 'Positive Mitzvot 1-248',
    '1984-05-01': 'Negative Mitzvot 1-365',
    '1984-05-02': 'Overview of Mishneh Torah Contents 1:1-14:10',
    '1984-05-03': 'Foundations of the Torah 1-3',
    '1984-05-04': 'Foundations of the Torah 4-6',
    '1984-05-05': 'Foundations of the Torah 7-9',
    '1984-05-06': 'Foundations of the Torah 10, Human Dispositions 1, Human Dispositions 2',
    '1984-05-07': 'Human Dispositions 3-5',
    '1984-05-08': 'Human Dispositions 6, Human Dispositions 7, Torah Study 1',
    '1984-05-09': 'Torah Study 2-4',
    '1984-05-10': 'Torah Study 5-7',
    '1984-05-11': 'Foreign Worship and Customs of the Nations 1-3',
    '1984-05-12': 'Foreign Worship and Customs of the Nations 4-6',
    '1984-05-13': 'Foreign Worship and Customs of the Nations 7-9',
    '1984-05-14': 'Foreign Worship and Customs of the Nations 10-12',
    '1984-05-15': 'Repentance 1-3',
    '1984-05-16': 'Repentance 4-6',
    '1984-05-17': 'Repentance 7-9',
    '1984-05-18': 'Repentance 10, Reading the Shema 1, Reading the Shema 2',
    '1984-05-19': 'Reading the Shema 3, Reading the Shema 4, Prayer and the Priestly Blessing 1',
    '1984-05-20': 'Prayer and the Priestly Blessing 2-4',
  };
  expect(actual).toEqual(expected);
});
