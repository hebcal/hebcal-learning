import {expect, test} from 'vitest';
import {NachYomiIndex} from '../src/nachYomi';

test('throws-lookup-string', () => {
  const index = new NachYomiIndex();
  expect(() => {
    index.lookup('17 Cheshvan 5759');
  }).toThrow('Invalid date: 17 Cheshvan 5759');
});

test('throws-lookup-too-earch', () => {
  const index = new NachYomiIndex();
  expect(() => {
    index.lookup(new Date(1923, 1, 1));
  }).toThrow('Date 1923-02-01 too early; Nach Yomi cycle began on 2007-11-01');
});

test('2022-cycle', () => {
  const index = new NachYomiIndex();
  expect(index.lookup(new Date(2022, 1, 26))).toEqual({k: 'Judges', v: 14});
  expect(index.lookup(new Date(2023, 2, 15))).toEqual({k: 'Psalms', v: 40});
  expect(index.lookup(new Date(2024, 0, 31))).toEqual({k: 'II Chronicles', v: 36});
});
