import {expect, test} from 'vitest';
import '../src/register';
import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';

test('lookup', () => {
  const hd = new HDate(17, 'Sivan', 5783);
  const ev = DailyLearning.lookup('psalms', hd);
  expect(ev).toBeTypeOf('object');
  expect(ev).not.toBeNull();
  expect(ev.getDesc()).toBe('Psalms 83-87');
});

test('dafWeekly', () => {
  const hd = new HDate(17, 'Sivan', 5783);
  const ev = DailyLearning.lookup('dafWeekly', hd);
  expect(ev).toBeTypeOf('object');
  expect(ev).not.toBeNull();
  expect(ev.getDesc()).toBe('Ketubot 39');
  expect(ev.getCategories()).toEqual(['dafWeekly']);
});

test('dafWeeklySunday', () => {
  const ev1 = DailyLearning.lookup('dafWeeklySunday', new HDate(17, 'Sivan', 5783));
  expect(ev1).toBeNull();
  const ev2 = DailyLearning.lookup('dafWeeklySunday', new HDate(2, 'Elul', 5783));
  expect(ev2).toBeNull();
  const ev3 = DailyLearning.lookup('dafWeeklySunday', new HDate(3, 'Elul', 5783));
  expect(ev3).not.toBeNull();
  expect(ev3.getDesc()).toBe('Ketubot 50');
  expect(ev3.getCategories()).toEqual(['dafWeekly']);
});

test('tanakhYomi', () => {
  const hd = new HDate(17, 'Sivan', 5783);
  const ev = DailyLearning.lookup('tanakhYomi', hd);
  expect(ev).toBeTypeOf('object');
  expect(ev).not.toBeNull();
  expect(ev.getDesc()).toBe('Minor Prophets Seder 10');
  expect(ev.getCategories()).toEqual(['tanakhYomi']);

  const ev2 = DailyLearning.lookup('tanakhYomi', new HDate(2, 'Elul', 5783));
  expect(ev2).toBeNull();
});

test('perekYomi', () => {
  const hd = new HDate(17, 'Sivan', 5783);
  const ev = DailyLearning.lookup('perekYomi', hd);
  expect(ev).toBeTypeOf('object');
  expect(ev).not.toBeNull();
  expect(ev.getDesc()).toBe('Oholot 9');
  expect(ev.getCategories()).toEqual(['perekYomi']);
  expect(ev.url()).toBe('https://www.sefaria.org/Mishnah_Oholot.9?lang=bi');
});

test('seferHaMitzvot', () => {
  const dt = new Date(2025, 7, 8);
  const ev = DailyLearning.lookup('seferHaMitzvot', new HDate(dt));
  expect(ev).toBeTypeOf('object');
  expect(ev).not.toBeNull();
  expect(ev.getDesc()).toBe('Day 161: P89, N145, N148');
  expect(ev.getCategories()).toEqual(['seferHaMitzvot']);
  expect(ev.url()).toBe('https://www.chabad.org/dailystudy/seferHamitzvos.asp?tdate=8/8/2025');
  expect(ev.render('en')).toBe('Day 161: Positive Commandment 89; Negative Commandment 145, 148; Note About Varying Customs');
});

test('kitzurShulchanAruch', () => {
  const hd = new HDate(5, 'Adar II', 5787);
  const ev = DailyLearning.lookup('kitzurShulchanAruch', hd);
  expect(ev).toBeTypeOf('object');
  expect(ev).not.toBeNull();
  expect(ev.getDesc()).toBe("19-23 / 15:1-15:6");
  expect(ev.getCategories()).toEqual(['kitzurShulchanAruch']);
  expect(ev.url()).toBeUndefined();
  expect(ev.render('en')).toBe("Hilchot Shmita v'Terumah 19-23 / Hilchot Brachot v'Tefilah 15:1-6");
  expect(ev.renderBrief('en')).toBe("Hilchot Shmita v'Terumah 19-23 / Hilchot Brachot v'Tefilah 15:1-6");
  expect(ev.renderBrief('he')).toBe("הלכות שמיטה ותרו״מ יט-כג / הלכות ברכות ותפלה טו:א-ו");
});
