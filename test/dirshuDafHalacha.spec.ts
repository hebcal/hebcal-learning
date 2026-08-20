import {expect, test} from 'vitest';
import {HDate, greg} from '@hebcal/hdate';
import {DailyLearning} from '@hebcal/core/dist/esm/DailyLearning';
import {
  DirshuDafHalacha,
  dirshuDafHalacha,
  dirshuDafHalachaEnd,
  dirshuDafHalachaStart,
} from '../src/dirshuDafHalachaBase';
import {DirshuDafHalachaEvent} from '../src/DirshuDafHalachaEvent';
import '../src/dirshuDafHalacha';

function reading(y: number, m: number, d: number): DirshuDafHalacha {
  const r = dirshuDafHalacha(new Date(y, m - 1, d));
  expect(r).not.toBeNull();
  return r as DirshuDafHalacha;
}

function ev(y: number, m: number, d: number): DirshuDafHalachaEvent {
  const hd = new HDate(new Date(y, m - 1, d));
  return new DirshuDafHalachaEvent(hd, reading(y, m, d));
}

test('cycle-starts-at-siman-1', () => {
  // Sunday 20 February 2022 = 19 Adar I 5782, the third cycle's first day. The
  // second cycle's last learning day was the Thursday before.
  expect(dirshuDafHalachaStart).toBe(greg.greg2abs(new Date(2022, 1, 20)));
  expect(reading(2022, 2, 20)).toEqual({b: '1:1', e: undefined, review: false});
  expect(reading(2022, 2, 21)).toEqual({b: '1:1', e: '1:2', review: false});
  expect(reading(2022, 2, 24)).toEqual({b: '2:1', e: '2:5', review: false});
});

test('amud is only given where a source printed it', () => {
  // the early years come from Hebrew luachs and wall calendars, which print the
  // reading but not the page of the Dirshu edition
  expect(reading(2022, 2, 20).daf).toBeUndefined();
  expect(reading(2024, 6, 10).daf).toBeUndefined();
  expect(reading(2024, 6, 11)).toEqual({b: '242:1', e: undefined, review: false, daf: 2, side: 'a'});
  // siman 242 has a single se'if, so it spans both sides of daf 2
  expect(reading(2024, 6, 12)).toEqual({b: '242:1', e: undefined, review: false, daf: 2, side: 'b'});
  expect(reading(2024, 6, 13)).toEqual({b: '243:1', e: undefined, review: false, daf: 3, side: 'a'});
});

test('a day that covers more than one amud shifts the ones after it', () => {
  // 15 November 2026 prints two amudim ("ל. לא."), so from the next day on the
  // page is a full daf ahead of a plain one-amud-per-day count
  expect(reading(2026, 11, 15)).toMatchObject({daf: 30, side: 'a'});
  expect(reading(2026, 11, 16)).toMatchObject({daf: 31, side: 'b'});
});

test('too-early', () => {
  expect(() => dirshuDafHalacha(new Date(2022, 1, 19))).toThrow(RangeError);
});

test('one-amud-per-weekday', () => {
  // Sunday 7 December 2025 = 17 Kislev 5786, the start of Hilchot Eruvin
  expect(reading(2025, 12, 7)).toEqual({
    b: '345:1',
    e: '345:3',
    review: false,
    daf: 196,
    side: 'a',
  });
  expect(reading(2025, 12, 8)).toEqual({
    b: '345:4',
    e: '345:6',
    review: false,
    daf: 196,
    side: 'b',
  });
  expect(reading(2025, 12, 9)).toEqual({b: '345:7', e: undefined, review: false, daf: 197, side: 'a'});
});

test('reading-spanning-two-simanim', () => {
  expect(reading(2024, 6, 30)).toEqual({b: '245:6', e: '246:1', review: false, daf: 8, side: 'b'});
});

test('reading-of-an-entire-siman', () => {
  // a reference without a se'if covers the whole siman
  expect(reading(2024, 8, 20)).toEqual({b: '255', e: undefined, review: false, daf: 27, side: 'a'});
  expect(reading(2026, 2, 1)).toEqual({b: '361', e: undefined, review: false, daf: 216, side: 'a'});
  expect(reading(2025, 10, 6)).toEqual({b: '331:10', e: '332', review: false, daf: 174, side: 'a'});
});

test('friday-and-shabbat-are-chazarah', () => {
  const expected = {b: '345:1', e: '345:12', review: true, daf: undefined, side: undefined};
  expect(reading(2025, 12, 12)).toEqual(expected); // Friday
  expect(reading(2025, 12, 13)).toEqual(expected); // Shabbat
  // the following week
  expect(reading(2025, 12, 19)).toEqual({
    b: '345:13',
    e: '346:3',
    review: true,
    daf: undefined,
    side: undefined,
  });
});

test('opening-week-is-reviewed', () => {
  // the cycle opened on a Sunday, so its very first week is a full one. The
  // luach prints this review as "עד סימן ב' סעיף ו'" -- up to the start of 2:6,
  // so it touches through 2:5.
  const expected = {b: '1:1', e: '2:5', review: true, daf: undefined, side: undefined};
  expect(reading(2022, 2, 25)).toEqual(expected); // Friday
  expect(reading(2022, 2, 26)).toEqual(expected); // Shabbat
});

test('yom-tov-does-not-interrupt-the-schedule', () => {
  // 3 October 2024 = 1 Tishrei 5785 (Rosh Hashana)
  expect(reading(2024, 10, 3)).toEqual({b: '267:2', e: '268:1', review: false, daf: 43, side: 'a'});
  // 13 April 2025 = 15 Nisan 5785 (first day of Pesach)
  expect(reading(2025, 4, 13)).toEqual({
    b: '308:46',
    e: '308:52',
    review: false,
    daf: 111,
    side: 'a',
  });
});

test('daf-numbering-restarts-with-each-volume', () => {
  // last amud of the Shabbat/Eruvin volume, then the first of the next
  expect(reading(2026, 8, 26)).toEqual({b: '428:8', e: undefined, review: false, daf: 290, side: 'a'});
  expect(reading(2026, 8, 27)).toEqual({b: '429:1', e: undefined, review: false, daf: 2, side: 'a'});
});

test('end-of-transcribed-schedule', () => {
  expect(dirshuDafHalachaEnd).toBe(greg.greg2abs(new Date(2027, 7, 31)));
  expect(dirshuDafHalacha(dirshuDafHalachaEnd)).not.toBeNull();
  expect(dirshuDafHalacha(dirshuDafHalachaEnd + 1)).toBeNull();
  expect(dirshuDafHalacha(new Date(2028, 0, 1))).toBeNull();
});

test('days-transcribed-from-the-spreadsheet', () => {
  // 2026-08-30 onward come from a third-party spreadsheet transcription that
  // continues past the last luach booklet
  expect(reading(2026, 8, 30)).toEqual({b: '429:2', e: undefined, review: false, daf: 2, side: 'b'});
  expect(reading(2026, 8, 31)).toEqual({b: '430', e: '431:1', review: false, daf: 3, side: 'a'});
  expect(reading(2026, 9, 10)).toEqual({b: '434:4', e: undefined, review: false, daf: 7, side: 'a'});
});

test('render', () => {
  const event = ev(2025, 12, 7);
  expect(event.getDesc()).toBe('Mishnah Berurah 345:1-3');
  expect(event.render('en')).toBe("Daf HaYomi B'Halacha: Mishnah Berurah 345:1-3");
  expect(event.renderBrief('en')).toBe('Mishnah Berurah 345:1-3');
  expect(event.category).toBe("Daf HaYomi B'Halacha");
  expect(event.getCategories()).toEqual(['dirshuDafHalacha']);
});

test('render-chazarah', () => {
  const event = ev(2025, 12, 13);
  expect(event.getDesc()).toBe('Chazarah Mishnah Berurah 345:1-12');
  expect(event.render('en')).toBe("Daf HaYomi B'Halacha: Chazarah Mishnah Berurah 345:1-12");
});

test('render-spanning-two-simanim', () => {
  expect(ev(2024, 6, 30).render('en')).toBe("Daf HaYomi B'Halacha: Mishnah Berurah 245:6-246:1");
  expect(ev(2024, 8, 20).render('en')).toBe("Daf HaYomi B'Halacha: Mishnah Berurah 255");
});

test('render-he', () => {
  expect(ev(2025, 12, 7).renderBrief('he')).toBe('מִשְׁנָה בְּרוּרָה שמה:א-ג');
  expect(ev(2025, 12, 7).renderBrief('he-x-NoNikud')).toBe('משנה ברורה שמה:א-ג');
  expect(ev(2024, 6, 30).renderBrief('he-x-NoNikud')).toBe('משנה ברורה רמה:ו-רמו:א');
  expect(ev(2024, 8, 20).renderBrief('he-x-NoNikud')).toBe('משנה ברורה רנה');
  expect(ev(2025, 12, 13).renderBrief('he-x-NoNikud')).toBe('חזרה משנה ברורה שמה:א-יב');
});

test('url', () => {
  expect(ev(2025, 12, 7).url()).toBe(
    'https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim.345.1-3?lang=bi'
  );
  expect(ev(2024, 6, 30).url()).toBe(
    'https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim.245.6-246.1?lang=bi'
  );
  expect(ev(2024, 6, 11).url()).toBe(
    'https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim.242.1?lang=bi'
  );
  // whole-siman references link to the start of the reading
  expect(ev(2024, 8, 20).url()).toBe(
    'https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim.255?lang=bi'
  );
  expect(ev(2025, 10, 6).url()).toBe(
    'https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim.331.10?lang=bi'
  );
});

test('DailyLearning-registration', () => {
  expect(DailyLearning.has('dirshuDafHalacha')).toBe(true);
  expect(DailyLearning.getStartDate('dirshuDafHalacha')?.abs()).toBe(dirshuDafHalachaStart);
  const hd = new HDate(new Date(2025, 11, 7));
  const event = DailyLearning.lookup('dirshuDafHalacha', hd, false);
  expect(event?.render('en')).toBe("Daf HaYomi B'Halacha: Mishnah Berurah 345:1-3");
  expect(DailyLearning.lookup('dirshuDafHalacha', new HDate(new Date(2021, 0, 1)), false)).toBeNull();
  expect(DailyLearning.lookup('dirshuDafHalacha', new HDate(new Date(2030, 0, 1)), false)).toBeNull();
});
