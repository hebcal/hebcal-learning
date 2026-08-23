#!/usr/bin/env node
// Emit a Gregorian -> Hebrew date map for make_transcripts.py, so its tables can
// show the printed Hebrew date beside its decoded value.
//
//     node hebrew_dates.mjs 2020-06-01 2026-10-01 hebrew_dates.json
//
// The conversion lives here rather than in Python so that @hebcal/hdate -- the
// same library the calendar itself uses -- stays the single authority.
import fs from 'node:fs';
import {HDate, greg} from '@hebcal/hdate';

const [from, to, out] = process.argv.slice(2);
const iso = s => {
  const [y, m, d] = s.split('-').map(Number);
  return greg.greg2abs(new Date(y, m - 1, d));
};

const map = {};
for (let abs = iso(from); abs <= iso(to); abs++) {
  const hd = new HDate(abs);
  map[greg.abs2greg(abs).toISOString().slice(0, 10)] = {
    d: hd.getDate(),
    m: hd.getMonthName(),
    y: hd.getFullYear(),
    gematriya: hd.renderGematriya(true),
  };
}
fs.writeFileSync(out, JSON.stringify(map));
console.log(`wrote ${out} (${Object.keys(map).length} days, ${from} .. ${to})`);
