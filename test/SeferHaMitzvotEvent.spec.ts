import {expect, test} from 'vitest';
import {SeferHaMitzvotEvent} from '../src/SeferHaMitzvotEvent';
import {SeferHaMitzvotReading} from '../src/seferHaMitzvotBase';
import {HDate} from '@hebcal/core';
import '../src/locale';

test('SeferHaMitzvotEvent-url', () => {
  const hd = new HDate(new Date(1984, 3, 30));
  const reading: SeferHaMitzvotReading = {
    day: 2,
    reading: 'Principle 1-3',
  };
  const ev = new SeferHaMitzvotEvent(hd, reading);
  expect(ev.url()).toBe('https://www.chabad.org/dailystudy/seferHamitzvos.asp?tdate=4/30/1984');
});

test('SeferHaMitzvotEvent-render', () => {
  const hd = new HDate(new Date(1984, 3, 30));
  const reading: SeferHaMitzvotReading = {
    day: 2,
    reading: 'Principle 1-3',
  };
  const ev = new SeferHaMitzvotEvent(hd, reading);
  expect(ev.render('en')).toBe('Day 2: Principle 1-3');
  expect(ev.renderBrief('en')).toBe('Day 2: Principle 1-3');

  const day5 = new HDate(new Date(2025, 2, 5));
  const readingDay5: SeferHaMitzvotReading = {
    day: 5,
    reading: 'P1, N1, P2',
  };
  const evDay5 = new SeferHaMitzvotEvent(day5, readingDay5);
  expect(evDay5.render('en')).toBe('Day 5: Positive Commandment 1; Negative Commandment 1; Positive Commandment 2');
  expect(evDay5.renderBrief('en')).toBe('Day 5: P1, N1, P2');

  const day6 = new HDate(new Date(2025, 2, 6));
  const readingDay6: SeferHaMitzvotReading = {
    day: 6,
    reading: 'P3, P4, P9',
  };
  const evDay6 = new SeferHaMitzvotEvent(day6, readingDay6);
  expect(evDay6.render('en')).toBe('Day 6: Positive Commandment 3, 4, 9');
  expect(evDay6.renderBrief('en')).toBe('Day 6: P3, P4, P9');

  const hd3 = new HDate(new Date(2025, 2, 23));
  const reading3: SeferHaMitzvotReading = {
    day: 23,
    reading: 'P5',
  };
  const ev3 = new SeferHaMitzvotEvent(hd3, reading3);
  expect(ev3.render('en')).toBe('Day 23: Positive Commandment 5');
  expect(ev3.renderBrief('en')).toBe('Day 23: P5');
});
