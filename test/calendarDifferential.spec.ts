import {expect, test} from 'vitest';
import {calculate929, nine29Start} from '../src/929Base';
import {yerushalmiYomi, vilna, schottenstein} from '../src/yerushalmiBase';
import {tanakhYomi, tanakhYomiStart} from '../src/tanakhYomiBase';

/**
 * Exhaustive day-by-day regression coverage for the three calendars whose
 * cycle math was converted from "walk forward from the epoch" to closed-form
 * arithmetic.
 *
 * Every day in the supported range is evaluated and folded into an FNV-1a
 * checksum, one block at a time so a failure points at a date range. The
 * expected checksums below were generated from the ORIGINAL implementation
 * (git 7ff78e0) before the optimization, so any change in output for any
 * single day in ~200 years will fail here.
 *
 * The one deliberate exception is documented on the Vilna table.
 */

/** FNV-1a, 32-bit. @private */
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function serialize(v: any): string {
  if (v === null || v === undefined) {
    return 'null';
  }
  if ('cycleChap' in v) {
    return `${v.cycleNum}|${v.cycleChap}|${v.book}|${v.bookChap}`;
  }
  if ('ed' in v) {
    return `${v.ed}|${v.name}|${v.blatt}`;
  }
  return `${v.getName()}|${v.getBlatt()}|${v.verses}|${v.render('en')}|${v.render('he')}`;
}

/** [startAbs, endAbs, numDays, expectedChecksum] */
type Block = [number, number, number, number];

function checkBlocks(blocks: Block[], fn: (abs: number) => unknown): void {
  for (const [startAbs, endAbs, numDays, expected] of blocks) {
    let str = '';
    let n = 0;
    for (let abs = startAbs; abs <= endAbs; abs++) {
      str += abs + '\t' + serialize(fn(abs)) + '\n';
      n++;
    }
    const actual = fnv1a(str);
    // Include the range in the failure message rather than asserting bare numbers
    expect({startAbs, endAbs, n, checksum: actual.toString(16)}).toEqual({
      startAbs,
      endAbs,
      n: numDays,
      checksum: expected.toString(16),
    });
  }
}

test('929-differential-through-2200', () => {
  const blocks: Block[] = [
    [735588, 744364, 8777, 0xf892e9a3],
    [744365, 753495, 9131, 0xf1ca53cf],
    [753496, 762627, 9132, 0x9023d295],
    [762628, 771757, 9130, 0xb549556e],
    [771758, 780888, 9131, 0xb42e598f],
    [780889, 790019, 9131, 0xd46b8808],
    [790020, 799151, 9132, 0xcf2564b8],
    [799152, 803533, 4382, 0xafbc6327],
  ];
  expect(blocks[0][0]).toBe(nine29Start);
  checkBlocks(blocks, abs => calculate929(abs));
});

test('yerushalmi-schottenstein-differential-through-2200', () => {
  const blocks: Block[] = [
    [738473, 747286, 8814, 0x3a69294b],
    [747287, 756417, 9131, 0x716f3c7e],
    [756418, 765549, 9132, 0xc580a991],
    [765550, 774679, 9130, 0x12a933a1],
    [774680, 783810, 9131, 0x4b82d25d],
    [783811, 792941, 9131, 0x5fd5e81f],
    [792942, 802073, 9132, 0xf8dc0ec1],
    [802074, 803533, 1460, 0x2c239f6b],
  ];
  expect(blocks[0][0]).toBe(schottenstein.startAbs);
  checkBlocks(blocks, abs => yerushalmiYomi(abs, schottenstein));
});

test('tanakhYomi-differential-through-2200', () => {
  const blocks: Block[] = [
    [711426, 720258, 8833, 0x610d492e],
    [720259, 729389, 9131, 0x65ed7a99],
    [729390, 738520, 9131, 0x49cac80c],
    [738521, 747651, 9131, 0x653f4cf5],
    [747652, 756783, 9132, 0xf8fedf8c],
    [756784, 765914, 9131, 0xc6533744],
    [765915, 775044, 9130, 0x84caa6c1],
    [775045, 784175, 9131, 0x7b198f31],
    [784176, 793307, 9132, 0xd305e72c],
    [793308, 802438, 9131, 0xdf58e4d2],
    [802439, 803533, 1095, 0x350da8f0],
  ];
  expect(blocks[0][0]).toBe(tanakhYomiStart);
  checkBlocks(blocks, abs => tanakhYomi(abs));
});

test('yerushalmi-vilna-differential-matches-original-through-2172', () => {
  // Byte-for-byte identical to the pre-optimization implementation for the
  // 70,315 days from 1980-02-02 up to the cycle rollover on 2172-08-08.
  const blocks: Block[] = [
    [722847, 731977, 9131, 0xd972b71a],
    [731978, 741108, 9131, 0xd05f841f],
    [741109, 750239, 9131, 0x12e406fd],
    [750240, 759370, 9131, 0x80fa6c91],
    [759371, 768501, 9131, 0xbb2c2e13],
    [768502, 777632, 9131, 0x8f98a83d],
    [777633, 786763, 9131, 0xdc4f88c9],
    [786764, 793161, 6398, 0xf019973c],
  ];
  expect(blocks[0][0]).toBe(vilna.startAbs);
  checkBlocks(blocks, abs => yerushalmiYomi(abs, vilna));
});

test('yerushalmi-vilna-differential-after-rollover-fix', () => {
  // Past 2172-08-08 the original implementation threw "this code should be
  // unreachable" and was thereafter permanently one daf behind, so these
  // checksums intentionally differ from the original. See the rollover test.
  const blocks: Block[] = [
    [793162, 802292, 9131, 0x5e59804d],
    [802293, 803533, 1241, 0xf9e75eac],
  ];
  checkBlocks(blocks, abs => yerushalmiYomi(abs, vilna));
});
