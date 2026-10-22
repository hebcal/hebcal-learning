#!/usr/bin/env node
// Builds src/tanyaYomi.json from one or more Sefaria crawls produced by
// fetch_sefaria.py.
//
// Usage (from the repo root, after `npm ci`):
//   node tools/tanya-yomi/build_table.mjs test/tanyaYomi.sefaria.json > src/tanyaYomi.json
//
// The schedule is keyed by Hebrew month + day, with one table for cycles
// containing a leap year and one for regular cycles. A cycle runs from
// 19 Kislev through 18 Kislev of the following year, so for 1 Tishrei
// through 18 Kislev the relevant year is the *previous* Hebrew year.
// The script aborts if two crawled days with the same key disagree, or if
// either table is missing a day.
import fs from 'node:fs';
import {HDate, months} from '@hebcal/hdate';

const PREFIX = /^Tanya, Part [IV]+; /;

// Book abbreviations keep the table small; tanyaYomiBase.ts expands them.
const ABBR = {
  'Likkutei Amarim': 'LA',
  'Shaar HaYichud VehaEmunah': 'SY',
  'Iggeret HaTeshuvah': 'IT',
  'Iggeret HaKodesh': 'IK',
  'Kuntres Acharon': 'KA',
};
const BOOK = new RegExp(`^(${Object.keys(ABBR).join('|')})(?=[ ,])`);

function cycleYear(hd) {
  const mm = hd.getMonth();
  const before =
    mm === months.TISHREI || mm === months.CHESHVAN || (mm === months.KISLEV && hd.getDate() < 19);
  return before ? hd.getFullYear() - 1 : hd.getFullYear();
}

const tables = {regular: {}, leap: {}};
for (const file of process.argv.slice(2)) {
  for (const [iso, ref] of JSON.parse(fs.readFileSync(file, 'utf8'))) {
    if (!ref) continue;
    const hd = new HDate(new Date(iso + 'T12:00:00'));
    const kind = HDate.isLeapYear(cycleYear(hd)) ? 'leap' : 'regular';
    const month = (tables[kind][hd.getMonthName()] ??= []);
    const short = ref.replace(PREFIX, '').replace(BOOK, b => ABBR[b]);
    const prev = month[hd.getDate() - 1];
    if (prev && prev !== short) {
      throw new Error(`${iso} ${kind} ${hd}: ${prev} != ${short}`);
    }
    month[hd.getDate() - 1] = short;
  }
}

const order = {
  regular: ['Tishrei', 'Cheshvan', 'Kislev', 'Tevet', "Sh'vat", 'Adar'],
  leap: ['Tishrei', 'Cheshvan', 'Kislev', 'Tevet', "Sh'vat", 'Adar I', 'Adar II'],
};
const rest = ['Nisan', 'Iyyar', 'Sivan', 'Tamuz', 'Av', 'Elul'];
const daysIn = {Iyyar: 29, Tamuz: 29, Elul: 29, Tevet: 29, Adar: 29, 'Adar II': 29};
const out = {};
for (const kind of ['regular', 'leap']) {
  out[kind] = {};
  for (const name of [...order[kind], ...rest]) {
    const arr = tables[kind][name] ?? [];
    const len = daysIn[name] ?? 30;
    for (let i = 0; i < len; i++) {
      if (!arr[i]) throw new Error(`missing ${kind} ${i + 1} ${name}`);
    }
    if (arr.length !== len) throw new Error(`${kind} ${name} has ${arr.length} days`);
    out[kind][name] = arr;
  }
}
const lines = ['{'];
const kinds = Object.keys(out);
kinds.forEach((kind, k) => {
  lines.push(`"${kind}": {`);
  const names = Object.keys(out[kind]);
  names.forEach((name, n) => {
    const body = out[kind][name].map(s => JSON.stringify(s)).join(',\n');
    lines.push(`${JSON.stringify(name)}: [\n${body}\n]${n < names.length - 1 ? ',' : ''}`);
  });
  lines.push(`}${k < kinds.length - 1 ? ',' : ''}`);
});
lines.push('}');
console.log(lines.join('\n'));
