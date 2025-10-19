import {expect, test} from 'vitest';
import {DailyRambamEvent} from '../src/DailyRambamEvent';
import {HDate} from '@hebcal/hdate';
import '../src/locale';

test('DailyRambamEvent-url', () => {
  const r1 = {name: 'Kings and Wars', perek: 4};
  const hd = new HDate(new Date(1987, 1, 1));
  const ev = new DailyRambamEvent(hd, r1);
  expect(ev.url()).toBe('https://www.sefaria.org/Mishneh_Torah%2C_Kings_and_Wars.4?lang=bi');

  const r2 = {name: 'Transmission of the Oral Law', perek: '1-21'};
  const hd2 = new HDate(new Date(1987, 1, 10));
  const ev2 = new DailyRambamEvent(hd2, r2);
  expect(ev2.url()).toBe('https://www.sefaria.org/Mishneh_Torah%2C_Transmission_of_the_Oral_Law.1-21?lang=bi');
});

test('DailyRambamEvent-render', () => {
  const r1 = {name: 'Kings and Wars', perek: 4};
  const hd = new HDate(new Date(1987, 1, 1));
  const ev = new DailyRambamEvent(hd, r1);
  expect(ev.render('en')).toBe('Kings and Wars 4');
  expect(ev.render('ashkenazi')).toBe('Kings and Wars 4');
  expect(ev.render('he')).toBe('הלכות מלכים ומלחמות פרק ד');
});
