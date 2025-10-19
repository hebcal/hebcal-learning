import {expect, test} from 'vitest';
import {ArukhHaShulchanYomiEvent} from '../src/ArukhHaShulchanYomiEvent';
import {HDate} from '@hebcal/hdate';
import '../src/locale';

test('render', () => {
  const r1 = {k: "Yoreh De'ah", v: '402.17-403.8'};
  const ev1 = new ArukhHaShulchanYomiEvent(new HDate(1, 'Tishrei', 5790), r1);
  expect(ev1.renderBrief('en')).toBe("Yoreh De'ah 402:17-403:8");
  expect(ev1.renderBrief('he')).toBe("יורה דעה תב:יז-תג:ח");
  expect(ev1.render('he')).toBe("יורה דעה תב:יז-תג:ח");

  const r2 = {k: "Even HaEzer", v: '1.1-3'};
  const ev2 = new ArukhHaShulchanYomiEvent(new HDate(2, 'Tishrei', 5790), r2);
  expect(ev2.renderBrief('en')).toBe("Even HaEzer 1:1-3");
  expect(ev2.renderBrief('he')).toBe("אבן העזר א:א-ג");
  expect(ev2.render('he')).toBe("אבן העזר א:א-ג");
});
