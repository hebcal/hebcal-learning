#!/usr/bin/env node
// Adds Gregorian dates to extract_hebrew_luach.py output and checks that the
// Sunday-Thursday learning / Friday-Shabbat chazarah rule holds.
//
//     node date_hebrew_luach.mjs rows.json [dated.json]
//
// The Hebrew luachs carry no year, so each booklet needs an entry in START:
// [first Hebrew year, ordinal of its first month with Tishrei = 1]. A booklet
// spans under a year, so any month ordinal below the first belongs to year + 1.
import fs from 'node:fs';
import {HDate, months} from '@hebcal/hdate';

const MONTHS = {
  תשרי: [months.TISHREI, 1],
  חשון: [months.CHESHVAN, 2],
  מרחשון: [months.CHESHVAN, 2],
  כסלו: [months.KISLEV, 3],
  טבת: [months.TEVET, 4],
  שבט: [months.SHVAT, 5],
  אדר: [months.ADAR_I, 6],
  'אדר א': [months.ADAR_I, 6],
  'אדר ב': [months.ADAR_II, 7],
  ניסן: [months.NISAN, 8],
  אייר: [months.IYYAR, 9],
  סיון: [months.SIVAN, 10],
  סיוון: [months.SIVAN, 10],
  תמוז: [months.TAMUZ, 11],
  אב: [months.AV, 12],
  אלול: [months.ELUL, 13],
};
const START = {
  'bb66b78a-57805781.pdf': [5780, 11], // Tamuz 5780 -> Nisan 5781, cycle 2
  '1f7b0998-luach_tashpa1.pdf': [5781, 9], // Iyar 5781 -> Adar I 5782, end of cycle 2
  'e139a915-luach57821.pdf': [5782, 6], // Adar I 5782 -> Elul 5782, start of cycle 3
};
const DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const bySrc = {};
for (const r of rows) (bySrc[r.src] ||= []).push(r);

const dated = [];
for (const [src, list] of Object.entries(bySrc)) {
  const start = START[src];
  if (!start) {
    console.error(`no START entry for ${src} -- add its Hebrew year`);
    continue;
  }
  const [y0, ord0] = start;
  for (const r of list) {
    const m = MONTHS[r.anchorMonth];
    if (!m) {
      console.error('unknown month', r.anchorMonth);
      continue;
    }
    const [mon, ord] = m;
    let anchor;
    try {
      anchor = new HDate(r.anchorDay, mon, ord >= ord0 ? y0 : y0 + 1);
    } catch {
      continue;
    }
    // panels run over consecutive days, so the anchor plus the row's slot gives
    // the date even where the booklet's date cell was lost in extraction
    const abs = anchor.abs() + r.slot;
    const hd = new HDate(abs);
    dated.push({
      ...r,
      abs,
      greg: hd.greg().toISOString().slice(0, 10),
      dow: abs % 7,
      hebrew: r.printed || hd.renderGematriya(true),
      computedDate: !r.printed,
    });
  }
}
dated.sort((a, b) => a.abs - b.abs);

// one record per day, preferring the one that carried text
const byAbs = new Map();
for (const r of dated)
  if (!byAbs.has(r.abs) || (r.text && !byAbs.get(r.abs).text)) byAbs.set(r.abs, r);
// rejoin a chazarah cell that wrapped onto the Shabbat row
for (const r of byAbs.values()) {
  if (r.dow !== 5) continue;
  const sat = byAbs.get(r.abs + 1);
  if (sat && sat.text && !sat.text.includes('חזרה')) {
    r.text = ((r.text || '') + ' ' + sat.text).trim();
    sat.text = null;
  }
}

const stats = {};
for (const r of byAbs.values()) {
  const text = r.text || '';
  const kind = !text ? 'blank' : text.includes('חזרה') ? 'review' : 'learn';
  const expected = r.dow <= 4 ? 'learn' : r.dow === 5 ? 'review' : 'blank';
  const s = (stats[r.src] ||= {
    learn: 0,
    review: 0,
    blank: 0,
    mismatch: 0,
    first: r.greg,
    last: r.greg,
  });
  s[kind]++;
  s.last = r.greg;
  if (kind !== expected) {
    s.mismatch++;
    if (s.mismatch <= 5)
      console.error(
        `  ${r.src.slice(0, 8)} ${r.greg} ${DOWS[r.dow]}: expected ${expected}, got ${kind} | ${text.slice(0, 60)}`
      );
  }
}
for (const [src, s] of Object.entries(stats)) console.log(src.padEnd(30), JSON.stringify(s));
if (process.argv[3])
  fs.writeFileSync(process.argv[3], JSON.stringify([...byAbs.values()], null, 0));
