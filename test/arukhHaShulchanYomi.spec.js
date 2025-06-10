import {expect, test} from 'vitest';
import {HebrewCalendar} from '@hebcal/core';
import {arukhHaShulchanYomi} from '../src/arukhHaShulchanYomiBase'
import '../src/register';

function hd2iso(hd) {
  return hd.greg().toISOString().substring(0, 10);
}

test('arukhHaShulchanYomi-sample', () => {
  expect(arukhHaShulchanYomi(new Date(2020, 4, 29))).toEqual({k: 'Orach Chaim', v: '1.1-8'});
  expect(arukhHaShulchanYomi(new Date(2020, 5, 3))).toEqual({k: 'Orach Chaim', v: '2.9-3.5'});
  expect(arukhHaShulchanYomi(new Date(2025, 1, 10))).toEqual({k: 'Choshen Mishpat', v: '427.10-11'});
  expect(arukhHaShulchanYomi(new Date(2025, 1, 11))).toEqual({k: 'Orach Chaim', v: '1.1-8'});
  expect(arukhHaShulchanYomi(new Date(2029, 8, 21))).toEqual({k: 'Even HaEzer', v: '21.8-22.3'});
  expect(arukhHaShulchanYomi(new Date(2033, 5, 3))).toEqual({k: "Yoreh De'ah", v: '200.4-201.9'});
});

test('arukhHaShulchanYomi-range', () => {
  const events = HebrewCalendar.calendar({
    start: new Date(2024, 11, 26),
    end: new Date(2025, 2, 5),
    noHolidays: true,
    dailyLearning: {arukhHaShulchanYomi: true},
  });
  const actual = [];
  for (const ev of events) {
    actual.push([hd2iso(ev.getDate()), ev.getDesc()]);
  }
  const expected = [
    ['2024-12-26', "Yoreh De'ah 402.17-403.8"],
    ['2024-12-27', 'Even HaEzer 1.1-3'],
    ['2024-12-28', 'Even HaEzer 1.4-8'],
    ['2024-12-29', 'Even HaEzer 1.9-15'],
    ['2024-12-30', 'Even HaEzer 1.16-22'],
    ['2024-12-31', 'Even HaEzer 1.23-28'],
    ['2025-01-01', 'Even HaEzer 1.29-2.7'],
    ['2025-01-02', 'Even HaEzer 2.8-13'],
    ['2025-01-03', 'Even HaEzer 2.14-17'],
    ['2025-01-04', 'Even HaEzer 2.18-25'],
    ['2025-01-05', 'Even HaEzer 2.26-26'],
    ['2025-01-06', 'Even HaEzer 21.8-22.3'],
    ['2025-01-07', 'Even HaEzer 22.4-15'],
    ['2025-01-08', 'Even HaEzer 22.16-23.7'],
    ['2025-01-09', 'Even HaEzer 23.8-9'],
    ['2025-01-10', 'Choshen Mishpat 259.1-9'],
    ['2025-01-11', 'Choshen Mishpat 259.10-260.3'],
    ['2025-01-12', 'Choshen Mishpat 260.4-10'],
    ['2025-01-13', 'Choshen Mishpat 260.11-16'],
    ['2025-01-14', 'Choshen Mishpat 260.17-23'],
    ['2025-01-15', 'Choshen Mishpat 261.1-262.5'],
    ['2025-01-16', 'Choshen Mishpat 262.6-15'],
    ['2025-01-17', 'Choshen Mishpat 262.16-22'],
    ['2025-01-18', 'Choshen Mishpat 262.23-263.4'],
    ['2025-01-19', 'Choshen Mishpat 264.1-8'],
    ['2025-01-20', 'Choshen Mishpat 264.9-16'],
    ['2025-01-21', 'Choshen Mishpat 264.17-265.2'],
    ['2025-01-22', 'Choshen Mishpat 265.3-267.4'],
    ['2025-01-23', 'Choshen Mishpat 267.5-14'],
    ['2025-01-24', 'Choshen Mishpat 267.15-268.2'],
    ['2025-01-25', 'Choshen Mishpat 268.3-12'],
    ['2025-01-26', 'Choshen Mishpat 268.13-269.5'],
    ['2025-01-27', 'Choshen Mishpat 269.6-270.7'],
    ['2025-01-28', 'Choshen Mishpat 271.1-5'],
    ['2025-01-29', 'Choshen Mishpat 359.9-14'],
    ['2025-01-30', 'Choshen Mishpat 365.6-367.2'],
    ['2025-01-31', 'Choshen Mishpat 367.3-10'],
    ['2025-02-01', 'Choshen Mishpat 367.11-19'],
    ['2025-02-02', 'Choshen Mishpat 367.20-28'],
    ['2025-02-03', 'Choshen Mishpat 368.1-369.7'],
    ['2025-02-04', 'Choshen Mishpat 369.8-17'],
    ['2025-02-05', 'Choshen Mishpat 370.1-9'],
    ['2025-02-06', 'Choshen Mishpat 377.2-378.5'],
    ['2025-02-07', 'Choshen Mishpat 378.6-15'],
    ['2025-02-08', 'Choshen Mishpat 378.16-21'],
    ['2025-02-09', 'Choshen Mishpat 426.3-427.9'],
    ['2025-02-10', 'Choshen Mishpat 427.10-11'],
    ['2025-02-11', 'Orach Chaim 1.1-8'],
    ['2025-02-12', 'Orach Chaim 1.9-16'],
    ['2025-02-13', 'Orach Chaim 1.17-22'],
    ['2025-02-14', 'Orach Chaim 1.23-29'],
    ['2025-02-15', 'Orach Chaim 2.1-8'],
    ['2025-02-16', 'Orach Chaim 2.9-3.5'],
    ['2025-02-17', 'Orach Chaim 3.6-13'],
    ['2025-02-18', 'Orach Chaim 4.1-8'],
    ['2025-02-19', 'Orach Chaim 4.9-15'],
    ['2025-02-20', 'Orach Chaim 4.16-5.4'],
    ['2025-02-21', 'Orach Chaim 6.1-8'],
    ['2025-02-22', 'Orach Chaim 6.9-7.1'],
    ['2025-02-23', 'Orach Chaim 7.2-8.4'],
    ['2025-02-24', 'Orach Chaim 8.5-12'],
    ['2025-02-25', 'Orach Chaim 8.13-19'],
    ['2025-02-26', 'Orach Chaim 8.20-9.4'],
    ['2025-02-27', 'Orach Chaim 9.5-14'],
    ['2025-02-28', 'Orach Chaim 9.15-23'],
    ['2025-03-01', 'Orach Chaim 9.24-10.3'],
    ['2025-03-02', 'Orach Chaim 10.4-9'],
    ['2025-03-03', 'Orach Chaim 10.10-16'],
    ['2025-03-04', 'Orach Chaim 10.17-11.1'],
    ['2025-03-05', 'Orach Chaim 11.2-10'],
  ];
  expect(actual).toEqual(expected);
});
