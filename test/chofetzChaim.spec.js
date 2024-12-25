import {expect, test} from 'vitest';
import {HebrewCalendar} from '@hebcal/core';
import '../src/register';

function hd2iso(hd) {
  return hd.greg().toISOString().substring(0, 10);
}

test('chofetzChaim-2023-10', () => {
  const events = HebrewCalendar.calendar({
    start: new Date(2023, 9, 1),
    end: new Date(2023, 9, 31),
    noHolidays: true,
    dailyLearning: {chofetzChaim: true},
  });
  const actual = [];
  for (const ev of events) {
    actual.push([hd2iso(ev.getDate()), ev.render('en')]);
  }
  const expected = [
    ['2023-10-01', 'Lavin 14-15'],
    ['2023-10-02', 'Lavin 16-17'],
    ['2023-10-03', 'Asin 1-2'],
    ['2023-10-04', 'Asin 3-4'],
    ['2023-10-05', 'Asin 5-6'],
    ['2023-10-06', 'Asin 7-8'],
    ['2023-10-07', 'Asin 9-10'],
    ['2023-10-08', 'Asin 11-12'],
    ['2023-10-09', 'Asin 13-14'],
    ['2023-10-10', 'Arurin'],
    ['2023-10-11', 'Hilchos LH 1.1-1.2'],
    ['2023-10-12', 'Hilchos LH 1.3-1.4'],
    ['2023-10-13', 'Hilchos LH 1.5-1.6'],
    ['2023-10-14', 'Hilchos LH 1.7-1.9'],
    ['2023-10-15', 'Hilchos LH 2.1-2.2'],
    ['2023-10-16', 'Hilchos LH 2.3-2.4'],
    ['2023-10-17', 'Hilchos LH 2.5-2.6'],
    ['2023-10-18', 'Hilchos LH 2.7-2.8'],
    ['2023-10-19', 'Hilchos LH 2.9-2.10'],
    ['2023-10-20', 'Hilchos LH 2.11'],
    ['2023-10-21', 'Hilchos LH 2.12-2.13'],
    ['2023-10-22', 'Hilchos LH 3.1-3.2'],
    ['2023-10-23', 'Hilchos LH 3.3-3.4'],
    ['2023-10-24', 'Hilchos LH 3.5-3.6'],
    ['2023-10-25', 'Hilchos LH 3.7-3.8'],
    ['2023-10-26', 'Hilchos LH 4.1-4.2'],
    ['2023-10-27', 'Hilchos LH 4.3-4.4'],
    ['2023-10-28', 'Hilchos LH 4.5-4.6'],
    ['2023-10-29', 'Hilchos LH 4.7-4.8'],
    ['2023-10-30', 'Hilchos LH 4.9-4.10'],
    ['2023-10-31', 'Hilchos LH 4.11'],
  ];
  expect(actual).toEqual(expected);
});
