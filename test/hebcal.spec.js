import {expect, test} from 'vitest';
import {HebrewCalendar, flags} from '@hebcal/core';
import '../src/register';

/**
 * @private
 */
function gregDtString(ev) {
  return ev.getDate().greg().toLocaleDateString('en-US');
}

test('dafyomi-only', () => {
  const options = {
    year: 1975,
    isHebrewYear: false,
    month: 6,
    noHolidays: true,
    dailyLearning: {dafYomi: true},
  };
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(30);
  expect(gregDtString(events[0])).toBe('6/1/1975');
  expect(events[0].getFlags()).toBe(flags.DAF_YOMI);
  expect(events[0].render('en')).toBe('Daf Yomi: Niddah 51');
  expect(events[0].renderBrief('en')).toBe('Niddah 51');
  expect(events[0].getDesc()).toBe('Niddah 51');
  expect(gregDtString(events[23])).toBe('6/24/1975');
  expect(events[23].getFlags()).toBe(flags.DAF_YOMI);
  expect(events[23].render('en')).toBe('Daf Yomi: Berachot 2');
  expect(events[23].renderBrief('en')).toBe('Berachot 2');
  expect(events[23].getDesc()).toBe('Berachot 2');
  expect(gregDtString(events[29])).toBe('6/30/1975');
  expect(events[29].getFlags()).toBe(flags.DAF_YOMI);
  expect(events[29].render('en')).toBe('Daf Yomi: Berachot 8');
  expect(events[29].renderBrief('en')).toBe('Berachot 8');
  expect(events[29].getDesc()).toBe('Berachot 8');
});

test('mishnaYomi-only', () => {
  const events = HebrewCalendar.calendar({
    year: 2022,
    isHebrewYear: false,
    noHolidays: true,
    dailyLearning: {mishnaYomi: true},
  });
  expect(events.length).toBe(365);
  expect(events[0].getDesc()).toBe('Berakhot 3:2-3');
  expect(events[2].getDesc()).toBe('Berakhot 3:6-4:1');
});


test('yerushalmiYomi-Vilna', () => {
  const events = HebrewCalendar.calendar({
    start: new Date(1997, 2, 14),
    end: new Date(2001, 5, 22),
    noHolidays: true,
    dailyLearning: {yerushalmi: true},
  });
  expect(events.length).toBe(1554);
  const daf1 = events.filter((ev) => ev.daf.blatt === 1);
  const actual = daf1.map((ev) => gregDtString(ev) + ' ' + ev.render('en'));
  const expected = [
    '3/14/1997 Yerushalmi Berakhot 1',
    '5/21/1997 Yerushalmi Peah 1',
    '6/27/1997 Yerushalmi Demai 1',
    '7/31/1997 Yerushalmi Kilayim 1',
    '9/14/1997 Yerushalmi Sheviit 1',
    '10/16/1997 Yerushalmi Terumot 1',
    '12/14/1997 Yerushalmi Maasrot 1',
    '1/9/1998 Yerushalmi Maaser Sheni 1',
    '2/11/1998 Yerushalmi Challah 1',
    '3/11/1998 Yerushalmi Orlah 1',
    '3/31/1998 Yerushalmi Bikkurim 1',
    '4/13/1998 Yerushalmi Shabbat 1',
    '7/14/1998 Yerushalmi Eruvin 1',
    '9/18/1998 Yerushalmi Pesachim 1',
    '11/29/1998 Yerushalmi Beitzah 1',
    '12/21/1998 Yerushalmi Rosh Hashanah 1',
    '1/12/1999 Yerushalmi Yoma 1',
    '2/23/1999 Yerushalmi Sukkah 1',
    '3/21/1999 Yerushalmi Taanit 1',
    '4/16/1999 Yerushalmi Shekalim 1',
    '5/19/1999 Yerushalmi Megillah 1',
    '6/22/1999 Yerushalmi Chagigah 1',
    '7/14/1999 Yerushalmi Moed Katan 1',
    '8/3/1999 Yerushalmi Yevamot 1',
    '10/28/1999 Yerushalmi Ketubot 1',
    '1/8/2000 Yerushalmi Sotah 1',
    '2/24/2000 Yerushalmi Nedarim 1',
    '4/4/2000 Yerushalmi Nazir 1',
    '5/21/2000 Yerushalmi Gittin 1',
    '7/14/2000 Yerushalmi Kiddushin 1',
    '9/1/2000 Yerushalmi Bava Kamma 1',
    '10/16/2000 Yerushalmi Bava Metzia 1',
    '11/22/2000 Yerushalmi Bava Batra 1',
    '12/26/2000 Yerushalmi Shevuot 1',
    '2/8/2001 Yerushalmi Makkot 1',
    '2/17/2001 Yerushalmi Sanhedrin 1',
    '4/15/2001 Yerushalmi Avodah Zarah 1',
    '5/22/2001 Yerushalmi Horayot 1',
    '6/10/2001 Yerushalmi Niddah 1',
  ];
  expect(actual).toEqual(expected);
});

test('yerushalmiYomi-Schottenstein', () => {
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 10, 14),
    end: new Date(2028, 7, 7),
    noHolidays: true,
    dailyLearning: {yerushalmi: 2},
  });
  expect(events.length).toBe(2094);
  const daf1 = events.filter((ev) => ev.daf.blatt === 1);
  const actual = daf1.map((ev) => gregDtString(ev) + ' ' + ev.render('en'));
  const expected = [
    '11/14/2022 Yerushalmi Berakhot 1',
    '2/16/2023 Yerushalmi Peah 1',
    '4/30/2023 Yerushalmi Demai 1',
    '7/16/2023 Yerushalmi Kilayim 1',
    '10/8/2023 Yerushalmi Sheviit 1',
    '1/3/2024 Yerushalmi Terumot 1',
    '4/19/2024 Yerushalmi Maasrot 1',
    '6/4/2024 Yerushalmi Maaser Sheni 1',
    '8/2/2024 Yerushalmi Challah 1',
    '9/20/2024 Yerushalmi Orlah 1',
    '11/1/2024 Yerushalmi Bikkurim 1',
    '11/27/2024 Yerushalmi Shabbat 1',
    '3/20/2025 Yerushalmi Eruvin 1',
    '5/30/2025 Yerushalmi Pesachim 1',
    '8/24/2025 Yerushalmi Shekalim 1',
    '10/24/2025 Yerushalmi Yoma 1',
    '12/20/2025 Yerushalmi Sukkah 1',
    '1/22/2026 Yerushalmi Beitzah 1',
    '3/12/2026 Yerushalmi Rosh Hashanah 1',
    '4/8/2026 Yerushalmi Taanit 1',
    '5/9/2026 Yerushalmi Megillah 1',
    '6/19/2026 Yerushalmi Chagigah 1',
    '7/17/2026 Yerushalmi Moed Katan 1',
    '8/9/2026 Yerushalmi Yevamot 1',
    '11/5/2026 Yerushalmi Ketubot 1',
    '1/21/2027 Yerushalmi Nedarim 1',
    '3/4/2027 Yerushalmi Nazir 1',
    '4/26/2027 Yerushalmi Sotah 1',
    '6/17/2027 Yerushalmi Gittin 1',
    '8/9/2027 Yerushalmi Kiddushin 1',
    '10/1/2027 Yerushalmi Bava Kamma 1',
    '11/10/2027 Yerushalmi Bava Metzia 1',
    '12/15/2027 Yerushalmi Bava Batra 1',
    '1/23/2028 Yerushalmi Sanhedrin 1',
    '4/7/2028 Yerushalmi Shevuot 1',
    '5/26/2028 Yerushalmi Avodah Zarah 1',
    '6/29/2028 Yerushalmi Makkot 1',
    '7/10/2028 Yerushalmi Horayot 1',
    '7/28/2028 Yerushalmi Niddah 1',
  ];
  expect(actual).toEqual(expected);
});

test('shemiratHaLashon', () => {
  const events = HebrewCalendar.calendar({
    start: new Date(1997, 3, 25),
    end: new Date(1997, 5, 2),
    noHolidays: true,
    dailyLearning: {shemiratHaLashon: true},
  });
  const actual = events.map((ev) => gregDtString(ev) + ' ' + ev.render('en'));
  const expected = [
    '4/25/1997 Book I, Shar Hatorah 9.15-9.17',
    '4/26/1997 Book I, Shar Hatorah 10.1-10.4',
    '4/27/1997 Book I, Shar Hatorah 10.5-10.7',
    '4/28/1997 Book I, Shar Hatorah 10.8-10.9',
    '4/29/1997 Book I, Shar Hatorah 10.10-10.11',
    '4/30/1997 Book I, Chasimas Hasefer 1.1-1.4',
    '5/1/1997 Book I, Chasimas Hasefer 1.5',
    '5/2/1997 Book I, Chasimas Hasefer 2.1-2.4',
    '5/3/1997 Book I, Chasimas Hasefer 2.5',
    '5/4/1997 Book I, Chasimas Hasefer 3.1-3.2',
    '5/5/1997 Book I, Chasimas Hasefer 3.3-3.4',
    '5/6/1997 Book I, Chasimas Hasefer 3.5',
    '5/7/1997 Book I, Chasimas Hasefer 3.6',
    '5/8/1997 Book I, Chasimas Hasefer 4.1-4.3',
    '5/9/1997 Book I, Chasimas Hasefer 4.4-4.5',
    '5/10/1997 Book I, Chasimas Hasefer 4.6-4.8',
    '5/11/1997 Book I, Chasimas Hasefer 5.1-5.3',
    '5/12/1997 Book I, Chasimas Hasefer 6.1-6.2',
    '5/13/1997 Book I, Chasimas Hasefer 6.3-6.4',
    '5/14/1997 Book I, Chasimas Hasefer 6.5-6.6',
    '5/15/1997 Book I, Chasimas Hasefer 6.7-6.9',
    '5/16/1997 Book I, Chasimas Hasefer 6.10-6.11',
    '5/17/1997 Book I, Chasimas Hasefer 7.1-7.5',
    '5/18/1997 Book I, Chasimas Hasefer 7.6',
    '5/19/1997 Book I, Chasimas Hasefer 7.7-7.8',
    '5/20/1997 Book I, Chasimas Hasefer 7.9',
    '5/21/1997 Book I, Chasimas Hasefer 7.10',
    '5/22/1997 Book I, Chasimas Hasefer 7.11',
    '5/23/1997 Book I, Chasimas Hasefer 7.12-7.13',
    '5/24/1997 Book II 1.1-1.2',
    '5/25/1997 Book II 1.3-1.5',
    '5/26/1997 Book II 1.6-1.7',
    '5/27/1997 Book II 1.8',
    '5/28/1997 Book II 2.1-2.4',
    '5/29/1997 Book II 2.5-2.6',
    '5/30/1997 Book II 2.7',
    '5/31/1997 Book II 2.8',
    '6/1/1997 Book II 2.9',
    '6/2/1997 Book II 2.10',
  ];
  expect(actual).toEqual(expected);
});
