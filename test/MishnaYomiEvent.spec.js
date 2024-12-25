import {expect, test} from 'vitest';
import {MishnaYomiEvent} from '../src/MishnaYomiEvent';
import {HDate} from '@hebcal/core';
import '../src/locale';

test('MishnaYomiEvent-url', () => {
  const my = [{k: 'Berakhot', v: '3:6'}, {k: 'Berakhot', v: '4:1'}];
  const hd = new HDate(new Date(1947, 4, 29));
  const ev = new MishnaYomiEvent(hd, my);
  expect(ev.url()).toBe('https://www.sefaria.org/Mishnah_Berakhot.3.6-4.1?lang=bi');

  const my2 = [{k: 'Berakhot', v: '9:5'}, {k: 'Peah', v: '1:1'}];
  const hd2 = new HDate(new Date(2022, 0, 22));
  const ev2 = new MishnaYomiEvent(hd2, my2);
  expect(ev2.url()).toBe('https://www.sefaria.org/Mishnah_Berakhot.9.5?lang=bi');
});

test('MishnaYomiEvent-render', () => {
  const my = [{k: 'Berakhot', v: '3:6'}, {k: 'Berakhot', v: '4:1'}];
  const hd = new HDate(new Date(1947, 4, 29));
  const ev = new MishnaYomiEvent(hd, my);
  expect(ev.render('en')).toBe('Berakhot 3:6-4:1');
  expect(ev.render('ashkenazi')).toBe('Berakhos 3:6-4:1');
  expect(ev.render('he')).toBe('ברכות 3:6-4:1');
});
