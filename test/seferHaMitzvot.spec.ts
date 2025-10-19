import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {seferHaMitzvot} from '../src/seferHaMitzvotBase';

test('simple', () => {
  const hd1 = new HDate(3, 'Av', 5783);
  const reading1 = seferHaMitzvot(hd1);
  expect(reading1).toEqual({
    day: 90,
    reading: "N348, N349, N350, N351",
  });

  const hd2 = new HDate(3, 'Av', 5784);
  const reading2 = seferHaMitzvot(hd2);
  expect(reading2).toEqual({day: 134, reading: "P127"});

  const dt3 = new Date(2025, 5, 1);
  const reading3 = seferHaMitzvot(dt3);
  expect(reading3).toEqual({
    day: 93,
    reading: "N161, N162, P38, N160, N158, N159"
  });
});

test('note', () => {
  const dt = new Date(2025, 6, 18);
  const reading = seferHaMitzvot(dt);
  expect(reading).toEqual({
   day: 140,
   reading: "N149, P132",
   note: "In some editions of the Sefer Hamitzvot Schedule, today’s Sefer Hamitzvot (Day 140) has Negative Mitzvah 148 listed instead of Negative Mitzvah 149 (and Day 161 has Negative Mitzvah 149 instead of 148)",
  });
});
