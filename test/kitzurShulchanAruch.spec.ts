import {expect, test} from 'vitest';
import {HDate} from '@hebcal/core';
import {kitzurShulchanAruch} from '../src/kitzurShulchanAruchBase';

test('simple', () => {
  const hd1 = new HDate(3, 'Av', 5783);
  const reading1 = kitzurShulchanAruch(hd1);
  expect(reading1).toEqual({"b": "122:7", "e": "122:11"});

  const hd2 = new HDate(3, 'Av', 5784);
  const reading2 = kitzurShulchanAruch(hd2);
  expect(reading2).toEqual({"b": "122:7", "e": "122:11"});

  const hd3 = new HDate(29, 'Shvat', 5784);
  const reading3 = kitzurShulchanAruch(hd3);
  expect(reading3).toEqual({"b": "65:23", "e": "65:E"});

  const hd4 = new HDate(15, 'Elul', 5784);
  const reading4 = kitzurShulchanAruch(hd4);
  expect(reading4).toEqual({"b": "Klalim", "e": "Klalim"});
});

test('leap', () => {
});
