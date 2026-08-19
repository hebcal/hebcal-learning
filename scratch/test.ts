import { dafYomi, formatWithCycle, DafYomiRangeError } from "./dafYomi.js";
let failures = 0;
function check(y: number, m: number, d: number, expected: string, cycle?: number) {
  const r = dafYomi({ year: y, month: m, day: d });
  const got = r.toString();
  const ok = got === expected && (cycle === undefined || r.cycle === cycle);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}  cycle ${r.cycle} ${got}${ok ? "" : `   (expected ${expected})`}`);
}
console.log("--- the stated test case ---");
check(2026, 8, 19, "Chullin 111", 14);
console.log("\n--- cycle boundaries ---");
check(1923, 9, 11, "Berachos 2", 1);
check(1975, 6, 23, "Niddah 73", 7);
check(1975, 6, 24, "Berachos 2", 8);
check(2020, 1, 4, "Niddah 73", 13);
check(2020, 1, 5, "Berachos 2", 14);
check(2027, 6, 7, "Niddah 73", 14);
check(2027, 6, 8, "Berachos 2", 15);
console.log("\n--- the odd numbering near the end of the cycle ---");
check(2027, 3, 12, "Meilah 22");
check(2027, 3, 13, "Kinnim 23");
check(2027, 3, 15, "Kinnim 25");
check(2027, 3, 16, "Tamid 26");
check(2027, 3, 23, "Tamid 33");
check(2027, 3, 24, "Midos 34");
check(2027, 3, 27, "Midos 37");
check(2027, 3, 28, "Niddah 2");
console.log("\n--- Shekalim: 13 dafim in cycles 1-7, 22 from cycle 8 ---");
check(1969, 4, 28, "Shekalim 13", 7);
check(1969, 4, 29, "Yoma 2", 7);
check(2021, 4, 12, "Shekalim 22", 14);
check(2021, 4, 13, "Yoma 2", 14);
console.log("\n--- consecutive days advance by exactly one ---");
{
  let prev = dafYomi({ year: 2026, month: 8, day: 14 });
  for (let d = 15; d <= 20; d++) {
    const cur = dafYomi({ year: 2026, month: 8, day: d });
    const ok = cur.tractate === prev.tractate && cur.daf === prev.daf + 1;
    if (!ok) failures++;
    console.log(`${ok ? "PASS" : "FAIL"}  2026-08-${d}: ${cur}`);
    prev = cur;
  }
}
console.log("\n--- structural: full cycles are covered exactly once ---");
for (const [label, startUTC, len, cyc] of [["cycle 14", Date.UTC(2020,0,5), 2711, 14], ["cycle 7", Date.UTC(1969,0,1) , 0, 7]] as const) {
  if (len === 0) continue;
  const seen = new Set<string>();
  let bad = 0;
  for (let i = 0; i < len; i++) {
    const dt = new Date(startUTC + i * 86400000);
    const r = dafYomi({ year: dt.getUTCFullYear(), month: dt.getUTCMonth()+1, day: dt.getUTCDate() });
    if (r.cycle !== cyc || r.daf < 2) bad++;
    seen.add(r.toString());
  }
  const ok = seen.size === len && bad === 0;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${seen.size} distinct dafim over ${len} days, ${bad} anomalies`);
}
console.log("\n--- error handling ---");
{
  let ok = false;
  try { dafYomi({ year: 1923, month: 9, day: 10 }); } catch (e) { ok = e instanceof DafYomiRangeError; }
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  1923-09-10 rejected as pre-cycle`);
  let ok2 = false;
  try { dafYomi({ year: 2026, month: 2, day: 30 }); } catch (e) { ok2 = e instanceof RangeError; }
  if (!ok2) failures++;
  console.log(`${ok2 ? "PASS" : "FAIL"}  2026-02-30 rejected as invalid`);
}
console.log(`\n${formatWithCycle(dafYomi({ year: 2026, month: 8, day: 19 }))}`);
console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
