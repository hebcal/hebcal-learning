import test from 'ava';
import {HDate} from '@hebcal/core';
import {dafWeekly, DafWeeklyEvent} from './dafWeekly';

test('dafWeekly', (t) => {
  const daf1 = dafWeekly(new Date(2015, 8, 26));
  t.is(daf1.blatt, 88);
  t.is(daf1.name, 'Yoma');
  const daf2 = dafWeekly(new Date(2015, 8, 27));
  t.is(daf2.blatt, 2);
  t.is(daf2.name, 'Sukkah');
  const daf3 = dafWeekly(new Date(2057, 1, 17));
  t.is(daf3.blatt, 73);
  t.is(daf3.name, 'Niddah');
});

test('dafWeekly-render', (t) => {
  const hd = new HDate(new Date(2008, 4, 9));
  const daf = dafWeekly(hd);
  const ev = new DafWeeklyEvent(hd, daf);
  t.is(ev.render('en'), 'Shabbat 104');
  t.is(ev.render('a'), 'Shabbos 104');
  t.is(ev.render('he'), 'שַׁבָּת דף ק״ד');
  t.is(ev.render('he-x-NoNikud'), 'שבת דף ק״ד');
  t.is(ev.url(), 'https://www.sefaria.org/Shabbat.104a?lang=bi');
});
