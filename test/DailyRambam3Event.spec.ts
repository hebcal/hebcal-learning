import {expect, test} from 'vitest';
import {DailyRambam3Event} from '../src/DailyRambam3Event';
import {HDate} from '@hebcal/core';
import '../src/locale';

test('DailyRambam3Event-url', () => {
  const r1 = [
    {name: 'Overview of Mishneh Torah Contents', perek: '1:1-4:8'},
    {name: 'Overview of Mishneh Torah Contents', perek: '5:1-9:9'},
    {name: 'Overview of Mishneh Torah Contents', perek: '10:1-14:10'},
  ];
  const hd = new HDate(new Date(1984, 4, 2));
  const ev = new DailyRambam3Event(hd, r1);
  expect(ev.getDesc()).toBe('Overview of Mishneh Torah Contents 1:1-14:10');
  expect(ev.url()).toBe('https://www.sefaria.org/Mishneh_Torah%2C_Overview_of_Mishneh_Torah_Contents.1.1-14.10?lang=bi');
  expect(ev.memo).toBeUndefined();

  const r2 = [
    {name: 'Foundations of the Torah', perek: 10},
    {name: 'Human Dispositions', perek: 1},
    {name: 'Human Dispositions', perek: 2},
  ];
  const hd2 = new HDate(new Date(1987, 1, 10));
  const ev2 = new DailyRambam3Event(hd2, r2);
  expect(ev2.url()).toBeUndefined();
  expect(ev2.getDesc()).toBe('Foundations of the Torah 10, Human Dispositions 1, Human Dispositions 2');
  expect(ev2.memo).toBe(`Foundations of the Torah 10
https://www.sefaria.org/Mishneh_Torah%2C_Foundations_of_the_Torah.10?lang=bi

Human Dispositions 1
https://www.sefaria.org/Mishneh_Torah%2C_Human_Dispositions.1?lang=bi

Human Dispositions 2
https://www.sefaria.org/Mishneh_Torah%2C_Human_Dispositions.2?lang=bi`);
});

test('DailyRambam3Event-render', () => {
  const r1 = [
    {name: 'Foundations of the Torah', perek: 10},
    {name: 'Human Dispositions', perek: 1},
    {name: 'Human Dispositions', perek: 2},
  ];
  const hd = new HDate(new Date(1987, 1, 1));
  const ev = new DailyRambam3Event(hd, r1);
  expect(ev.render('en')).toBe('Foundations of the Torah 10, Human Dispositions 1, Human Dispositions 2');
  expect(ev.render('ashkenazi')).toBe('Foundations of the Torah 10, Human Dispositions 1, Human Dispositions 2');
  expect(ev.render('he')).toBe("הלכות יסודי התורה פרק י׳, הלכות דעות פרק א׳, הלכות דעות פרק ב׳");
});
