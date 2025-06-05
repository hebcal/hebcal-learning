import {expect, test} from 'vitest';
import {HDate, months} from '@hebcal/core';
import {kitzurShulchanAruch} from '../src/kitzurShulchanAruchBase';

test('simple', () => {
  const hd1 = new HDate(3, 'Av', 5783);
  const reading1 = kitzurShulchanAruch(hd1);
  expect(reading1).toEqual({'b': '122:7', 'e': '122:11'});

  const hd2 = new HDate(3, 'Av', 5784);
  const reading2 = kitzurShulchanAruch(hd2);
  expect(reading2).toEqual({'b': '122:7', 'e': '122:11'});

  const hd3 = new HDate(29, 'Shvat', 5784);
  const reading3 = kitzurShulchanAruch(hd3);
  expect(reading3).toEqual({'b': '65:23', 'e': '65:E'});

  const hd4 = new HDate(15, 'Elul', 5784);
  const reading4 = kitzurShulchanAruch(hd4);
  expect(reading4).toEqual({'b': 'Klalim', 'e': undefined});
});

test('leap', () => {
  const hd = new HDate(5, 'Adar II', 5787);
  const readingA = kitzurShulchanAruch(hd, 'A');
  expect(readingA).toEqual({'b': '19', 'e': '23'});

  const readingB = kitzurShulchanAruch(hd, 'B');
  expect(readingB).toEqual({'b': '15:1', 'e': '15:6'});
});

test('Adar30', () => {
  const hd = new HDate(30, 'Adar I', 5787);
  expect(kitzurShulchanAruch(hd, 'A')).toBeUndefined();
  expect(kitzurShulchanAruch(hd, 'B')).toBeUndefined();
});

test('year', () => {
  const startAbs = HDate.hebrew2abs(5780, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(5781, months.TISHREI, 1) - 1;
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const hd = new HDate(abs);
    const reading = kitzurShulchanAruch(hd, 'A');
    const mm = hd.getMonth();
    if (hd.getDate() === 30 && (mm === months.ADAR_I || mm === months.CHESHVAN)) {
      expect(reading).toBeUndefined();
    } else {
      expect(reading).not.toBeUndefined();
      expect(reading).toBeTypeOf('object');
      expect(reading).not.toBeNull();
      expect(reading!.b).toBeTypeOf('string');
    }
  }
});
