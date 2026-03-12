import {expect, test} from 'vitest';
import {dailyRambam3} from '../src/rambam3Base';
import {collapseAdjacent, makeDesc} from '../src/DailyRambam3Event';
import {greg} from '@hebcal/hdate';

function abs2iso(abs: number): string {
  return greg.abs2greg(abs).toISOString().substring(0, 10);
}
test('collapseAdjacent', () => {
  expect(collapseAdjacent([
    {name: 'Foobar', perek: 3},
    {name: 'Foobar', perek: 4},
    {name: 'Foobar', perek: 5},
  ])).toEqual([{name: 'Foobar', perek: '3-5'}]);
  expect(collapseAdjacent([
    {name: 'Quux', perek: '4-6'},
    {name: 'Quux', perek: '7-11'},
    {name: 'Quux', perek: '12-15'},
  ])).toEqual([{name: 'Quux', perek: '4-15'}]);
  expect(collapseAdjacent([
    {name: 'Foundations of the Torah', perek: 10},
    {name: 'Human Dispositions', perek: 1},
    {name: 'Human Dispositions', perek: 2},
  ])).toEqual([
    {name: 'Foundations of the Torah', perek: 10},
    {name: 'Human Dispositions', perek: '1-2'},
  ]);
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

test('rambam3-2020', () => {
  const start = greg.greg2abs(new Date(2020, 7, 9));
  const endAbs = greg.greg2abs(new Date(2020, 8, 18));
  const actual: Record<string, string> = {};
  for (let abs = start; abs <= endAbs; abs++) {
    const reading = dailyRambam3(abs);
    const desc = makeDesc(reading);
    actual[abs2iso(abs)] = desc;
  }
  const expected = {
  '2020-08-09': 'Blessings 1-3',
  '2020-08-10': 'Blessings 4-6',
  '2020-08-11': 'Blessings 7-9',
  '2020-08-12': 'Blessings 10-11, Circumcision 1',
  '2020-08-13': 'Circumcision 2-3, The Order of Prayer 1',
  '2020-08-14': 'The Order of Prayer 2-4',
  '2020-08-15': 'The Order of Prayer 5, Sabbath 1-2',
  '2020-08-16': 'Sabbath 3-5',
  '2020-08-17': 'Sabbath 6-8',
  '2020-08-18': 'Sabbath 9-11',
  '2020-08-19': 'Sabbath 12-14',
  '2020-08-20': 'Sabbath 15-17',
  '2020-08-21': 'Sabbath 18-20',
  '2020-08-22': 'Sabbath 21-23',
  '2020-08-23': 'Sabbath 24-26',
  '2020-08-24': 'Sabbath 27-29',
  '2020-08-25': 'Sabbath 30, Eruvin 1-2',
  '2020-08-26': 'Eruvin 3-5',
  '2020-08-27': 'Eruvin 6-8',
  '2020-08-28': 'Rest on the Tenth of Tishrei 1-3',
  '2020-08-29': 'Rest on a Holiday 1-3',
  '2020-08-30': 'Rest on a Holiday 4-6',
  '2020-08-31': 'Rest on a Holiday 7-8, Leavened and Unleavened Bread 1',
  '2020-09-01': 'Leavened and Unleavened Bread 2-4',
  '2020-09-02': 'Leavened and Unleavened Bread 5-7',
  '2020-09-03': 'Leavened and Unleavened Bread 8-9, Shofar, Sukkah and Lulav 1-2',
  '2020-09-04': 'Shofar, Sukkah and Lulav 3-5',
  '2020-09-05': 'Shofar, Sukkah and Lulav 6-8',
  '2020-09-06': 'Sheqel Dues 1-3',
  '2020-09-07': 'Sheqel Dues 4, Sanctification of the New Month 1-2',
  '2020-09-08': 'Sanctification of the New Month 3-5',
  '2020-09-09': 'Sanctification of the New Month 6-8',
  '2020-09-10': 'Sanctification of the New Month 9-11',
  '2020-09-11': 'Sanctification of the New Month 12-14',
  '2020-09-12': 'Sanctification of the New Month 15-17',
  '2020-09-13': 'Sanctification of the New Month 18-19, Fasts 1',
  '2020-09-14': 'Fasts 2-4',
  '2020-09-15': 'Fasts 5, Scroll of Esther and Hanukkah 1-2',
  '2020-09-16': 'Scroll of Esther and Hanukkah 3-4, Marriage 1',
  '2020-09-17': 'Marriage 2-4',
  '2020-09-18': 'Marriage 5-7'
  }
  expect(actual).toEqual(expected);
});

test('rambam3-spotcheck', () => {
  expect(dailyRambam3(new Date(2020, 7, 15)))
    .toEqual([
      {name: 'The Order of Prayer', perek: 5},
      {name: 'Sabbath', perek: 1},
      {name: 'Sabbath', perek: 2},
    ]);
  expect(dailyRambam3(new Date(2020, 7, 16)))
    .toEqual([
      {name: 'Sabbath', perek: 3},
      {name: 'Sabbath', perek: 4},
      {name: 'Sabbath', perek: 5},
    ]);
  expect(dailyRambam3(new Date(2020, 8, 1)))
    .toEqual([
      {name: 'Leavened and Unleavened Bread', perek: 2},
      {name: 'Leavened and Unleavened Bread', perek: 3},
      {name: 'Leavened and Unleavened Bread', perek: 4},
    ]);
  expect(dailyRambam3(new Date(2020, 11, 5)))
    .toEqual([
      {name: 'The Chosen Temple', perek: 5},
      {name: 'The Chosen Temple', perek: 6},
      {name: 'The Chosen Temple', perek: 7},
    ]);
  expect(dailyRambam3(new Date(2021, 0, 2)))
    .toEqual([
      {name: 'Trespass', perek: 2},
      {name: 'Trespass', perek: 3},
      {name: 'Trespass', perek: 4},
    ]);
  expect(dailyRambam3(new Date(2021, 0, 3)))
    .toEqual([
      {name: 'Trespass', perek: 5},
      {name: 'Trespass', perek: 6},
      {name: 'Trespass', perek: 7},
    ]);
  });

test('rambam3-1984', () => {
  const start = greg.greg2abs(new Date(1984, 3, 29));
  const endAbs = greg.greg2abs(new Date(1984, 4, 20));
  const actual: Record<string, string> = {};
  for (let abs = start; abs <= endAbs; abs++) {
    const reading = dailyRambam3(abs);
    const desc = makeDesc(reading);
    actual[abs2iso(abs)] = desc;
  }
  const expected = {
    '1984-04-29': 'Transmission of the Oral Law 1-45',
    '1984-04-30': 'Positive Mitzvot 1-248',
    '1984-05-01': 'Negative Mitzvot 1-365',
    '1984-05-02': 'Overview of Mishneh Torah Contents 1:1-14:10',
    '1984-05-03': 'Foundations of the Torah 1-3',
    '1984-05-04': 'Foundations of the Torah 4-6',
    '1984-05-05': 'Foundations of the Torah 7-9',
    '1984-05-06': 'Foundations of the Torah 10, Human Dispositions 1-2',
    '1984-05-07': 'Human Dispositions 3-5',
    '1984-05-08': 'Human Dispositions 6-7, Torah Study 1',
    '1984-05-09': 'Torah Study 2-4',
    '1984-05-10': 'Torah Study 5-7',
    '1984-05-11': 'Foreign Worship and Customs of the Nations 1-3',
    '1984-05-12': 'Foreign Worship and Customs of the Nations 4-6',
    '1984-05-13': 'Foreign Worship and Customs of the Nations 7-9',
    '1984-05-14': 'Foreign Worship and Customs of the Nations 10-12',
    '1984-05-15': 'Repentance 1-3',
    '1984-05-16': 'Repentance 4-6',
    '1984-05-17': 'Repentance 7-9',
    '1984-05-18': 'Repentance 10, Reading the Shema 1-2',
    '1984-05-19': 'Reading the Shema 3-4, Prayer and the Priestly Blessing 1',
    '1984-05-20': 'Prayer and the Priestly Blessing 2-4',
  };
  expect(actual).toEqual(expected);
});
