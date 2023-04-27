import test from 'ava';
import {HebrewCalendar, flags} from '@hebcal/core';
import './register';

/**
 * @param {Event} ev
 * @return {string}
 * @private
 */
function gregDtString(ev) {
  return ev.getDate().greg().toLocaleDateString('en-US');
}

test('dafyomi-only', (t) => {
  const options = {
    year: 1975,
    isHebrewYear: false,
    month: 6,
    noHolidays: true,
    dailyLearning: {dafYomi: true},
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 30);
  t.is(gregDtString(events[0]), '6/1/1975');
  t.is(events[0].getFlags(), flags.DAF_YOMI);
  t.is(events[0].render('en'), 'Daf Yomi: Niddah 51');
  t.is(events[0].renderBrief('en'), 'Niddah 51');
  t.is(events[0].getDesc(), 'Niddah 51');
  t.is(gregDtString(events[23]), '6/24/1975');
  t.is(events[23].getFlags(), flags.DAF_YOMI);
  t.is(events[23].render('en'), 'Daf Yomi: Berachot 2');
  t.is(events[23].renderBrief('en'), 'Berachot 2');
  t.is(events[23].getDesc(), 'Berachot 2');
  t.is(gregDtString(events[29]), '6/30/1975');
  t.is(events[29].getFlags(), flags.DAF_YOMI);
  t.is(events[29].render('en'), 'Daf Yomi: Berachot 8');
  t.is(events[29].renderBrief('en'), 'Berachot 8');
  t.is(events[29].getDesc(), 'Berachot 8');
});

test('mishnaYomi-only', (t) => {
  const events = HebrewCalendar.calendar({
    year: 2022,
    isHebrewYear: false,
    noHolidays: true,
    dailyLearning: {mishnaYomi: true},
  });
  t.is(events.length, 365);
  t.is(events[0].getDesc(), 'Berakhot 3:2-3');
  t.is(events[2].getDesc(), 'Berakhot 3:6-4:1');
});


test('yerushalmiYomi-Vilna', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(1997, 2, 14),
    end: new Date(2001, 5, 22),
    noHolidays: true,
    dailyLearning: {yerushalmi: true},
  });
  t.is(events.length, 1554);
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
  t.deepEqual(actual, expected);
});

test('yerushalmiYomi-Schottenstein', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 10, 14),
    end: new Date(2028, 7, 7),
    noHolidays: true,
    dailyLearning: {yerushalmi: 2},
  });
  t.is(events.length, 2094);
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
  t.deepEqual(actual, expected);
});
