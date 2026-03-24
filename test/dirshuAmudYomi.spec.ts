import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {
  calculateDirshuAmud,
  DirshuAmudYomi,
  dirshuAmudYomiStart,
  shas,
} from '../src/dirshuAmudYomiBase';
import {DirshuAmudYomiEvent} from '../src/DirshuAmudYomiEvent';

test('cycle-start-day1', () => {
  // Cycle began on 1 Cheshvan 5784 = October 16, 2023 = Berachot 2a
  const dt = new Date(2023, 9, 16);
  const amud = calculateDirshuAmud(dt);
  expect(amud.getName()).toBe('Berachot');
  expect(amud.blattNum).toBe(2);
  expect(amud.side).toBe('a');
  expect(amud.getBlatt()).toBe('2a');
  expect(amud.render('en')).toBe('Berachot 2a');
});

test('cycle-start-day2', () => {
  // October 17, 2023 = Berachot 2b
  const dt = new Date(2023, 9, 17);
  const amud = calculateDirshuAmud(dt);
  expect(amud.getName()).toBe('Berachot');
  expect(amud.blattNum).toBe(2);
  expect(amud.side).toBe('b');
  expect(amud.render('en')).toBe('Berachot 2b');
});

test('today-march-23-2026', () => {
  // March 23, 2026 = 5 Nisan 5786 = Shekalim 4b
  const dt = new Date(2026, 2, 23);
  const amud = calculateDirshuAmud(dt);
  expect(amud.getName()).toBe('Shekalim');
  expect(amud.blattNum).toBe(4);
  expect(amud.side).toBe('b');
  expect(amud.render('en')).toBe('Shekalim 4b');
});

test('berachot-last-amud', () => {
  // Berachot has 125 amudim, last is index 124 → blatt 64a
  const amud = calculateDirshuAmud(dirshuAmudYomiStart + 124);
  expect(amud.getName()).toBe('Berachot');
  expect(amud.blattNum).toBe(64);
  expect(amud.side).toBe('a');
  expect(amud.render('en')).toBe('Berachot 64a');
});

test('shabbat-first-amud', () => {
  // Shabbat starts on day 125 from cycle start
  const amud = calculateDirshuAmud(dirshuAmudYomiStart + 125);
  expect(amud.getName()).toBe('Shabbat');
  expect(amud.blattNum).toBe(2);
  expect(amud.side).toBe('a');
  expect(amud.render('en')).toBe('Shabbat 2a');
});

test('shabbat-last-amud', () => {
  // Shabbat has 312 amudim (indices 125-436), last is index 436 → blatt 157b
  // Day 436 from cycle start
  const startAbs = dirshuAmudYomiStart;
  const amud = calculateDirshuAmud(startAbs + 436);
  expect(amud.getName()).toBe('Shabbat');
  expect(amud.blattNum).toBe(157);
  expect(amud.side).toBe('b');
  expect(amud.render('en')).toBe('Shabbat 157b');
});

test('cycle-boundary-wraps', () => {
  // After the last amud of the cycle, it should wrap back to Berachot 2a
  const totalAmudim = shas.reduce((s, a) => s + a.amudim, 0);
  const amud = calculateDirshuAmud(dirshuAmudYomiStart + totalAmudim);
  expect(amud.getName()).toBe('Berachot');
  expect(amud.blattNum).toBe(2);
  expect(amud.side).toBe('a');
});

test('niddah-last-amud', () => {
  // Niddah is the last tractate with 143 amudim (odd), last amud = index 142 within Niddah
  // index 142: blatt = 2 + floor(142/2) = 2 + 71 = 73, side = 142%2 = 0 → 'a'
  const totalAmudim = shas.reduce((s, a) => s + a.amudim, 0);
  const amud = calculateDirshuAmud(dirshuAmudYomiStart + totalAmudim - 1);
  expect(amud.getName()).toBe('Niddah');
  expect(amud.blattNum).toBe(73);
  expect(amud.side).toBe('a');
  expect(amud.render('en')).toBe('Niddah 73a');
});

test('too-early-throws', () => {
  // Date before cycle start should throw
  expect(() => {
    calculateDirshuAmud(new Date(2023, 9, 15)); // October 15, 2023 (day before start)
  }).toThrow('Date 2023-10-15 too early; Dirshu Amud HaYomi cycle began on 2023-10-16');
});

test('event-render-english', () => {
  const hd = new HDate(new Date(2026, 2, 23)); // March 23, 2026
  const ev = new DirshuAmudYomiEvent(hd);
  expect(ev.render('en')).toBe('Dirshu Amud HaYomi: Shekalim 4b');
  expect(ev.getDesc()).toBe('Shekalim 4b');
  expect(ev.category).toBe('Dirshu Amud HaYomi');
  expect(ev.getCategories()).toEqual(['dirshuAmudYomi']);
});

test('event-render-brief', () => {
  const hd = new HDate(new Date(2026, 2, 23)); // March 23, 2026 = Shekalim 4b
  const ev = new DirshuAmudYomiEvent(hd);
  expect(ev.renderBrief('en')).toBe('Shekalim 4b');
});

test('event-render-hebrew', () => {
  const hd = new HDate(new Date(2026, 2, 23)); // March 23, 2026 = Shekalim 4b
  const ev = new DirshuAmudYomiEvent(hd);
  const rendered = ev.render('he');
  // Should include Hebrew Shekalim and the amud bet notation
  expect(rendered).toContain('שקלים');
  expect(rendered).toContain('ע״ב');
});

test('event-url-sefaria', () => {
  const hd = new HDate(new Date(2026, 2, 23)); // Shekalim 4b
  const ev = new DirshuAmudYomiEvent(hd);
  expect(ev.url()).toBe('https://www.sefaria.org/Jerusalem_Talmud_Shekalim.1.4.5-9?lang=bi');
});

test('event-url-berachot-sefaria', () => {
  // Berachot → Berakhot on sefaria
  const hd = new HDate(new Date(2023, 9, 16)); // October 16, 2023 = Berachot 2a
  const ev = new DirshuAmudYomiEvent(hd);
  expect(ev.url()).toBe('https://www.sefaria.org/Berakhot.2a?lang=bi');
});

test('event-url-rosh-hashana', () => {
  // Rosh Hashana → Rosh_Hashanah on sefaria
  // Find when Rosh Hashana starts
  const beforeRH =
    shas.slice(0, 8).reduce((s, a) => s + a.amudim, 0);
  const hd = new HDate(dirshuAmudYomiStart + beforeRH);
  const ev = new DirshuAmudYomiEvent(hd);
  expect(ev.url()).toBe('https://www.sefaria.org/Rosh_Hashanah.2a?lang=bi');
});

test('event-url-bava-kamma', () => {
  // Baba Kamma → Bava_Kamma on sefaria
  const beforeBK =
    shas.slice(0, 20).reduce((s, a) => s + a.amudim, 0);
  const hd = new HDate(dirshuAmudYomiStart + beforeBK);
  const ev = new DirshuAmudYomiEvent(hd);
  expect(ev.url()).toBe('https://www.sefaria.org/Bava_Kamma.2a?lang=bi');
});

test('amud-render-in-middle', () => {
  // Test a daf in the middle — Eruvin 54b
  // Eruvin starts at index 437, 54b = daf 54 side b
  // index within Eruvin for 54b: (54-2)*2 + 1 = 105
  const eruvinStart = shas.slice(0, 2).reduce((s, a) => s + a.amudim, 0);
  const amud = calculateDirshuAmud(dirshuAmudYomiStart + eruvinStart + 105);
  expect(amud.getName()).toBe('Eruvin');
  expect(amud.blattNum).toBe(54);
  expect(amud.side).toBe('b');
  expect(amud.render('en')).toBe('Eruvin 54b');
});

test('dirshu-amud-yomi-instance', () => {
  const amud = new DirshuAmudYomi('Berachot', 2, 'a');
  expect(amud.getName()).toBe('Berachot');
  expect(amud.getBlatt()).toBe('2a');
  expect(amud.blattNum).toBe(2);
  expect(amud.side).toBe('a');
});

test('total-amudim', () => {
  const total = shas.reduce((s, a) => s + a.amudim, 0);
  expect(total).toBe(5407);
});
