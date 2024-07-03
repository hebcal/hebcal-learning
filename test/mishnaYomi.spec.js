import {MishnaYomiIndex} from '../src/mishnaYomi';

test('year1', () => {
  const index = new MishnaYomiIndex();
  const day1 = index.lookup(new Date(1947, 4, 20));
  expect(day1).toEqual([{k: 'Berakhot', v: '1:1'}, {k: 'Berakhot', v: '1:2'}]);
  const day7 = index.lookup(new Date(1947, 4, 26));
  expect(day7).toEqual([{k: 'Berakhot', v: '2:8'}, {k: 'Berakhot', v: '3:1'}]);
  const day10 = index.lookup(new Date(1947, 4, 29));
  expect(day10).toEqual([{k: 'Berakhot', v: '3:6'}, {k: 'Berakhot', v: '4:1'}]);
});

test('start-dates', () => {
  const index = new MishnaYomiIndex();
  const dates = `1947-05-20
1953-02-13
1958-11-10
1964-08-06
1970-05-03
1976-01-28
1981-10-24
1987-07-21
1993-04-16
1999-01-11
2004-10-07
2010-07-04
2016-03-30
2021-12-25
2027-09-21
2033-06-17
2039-03-14
2044-12-08
2050-09-04
2056-05-31`.split('\n');
  for (const str of dates) {
    const s = str.split('-');
    const date = new Date(parseInt(s[0], 10), parseInt(s[1], 10) - 1, parseInt(s[2], 10));
    const day1 = index.lookup(date);
    expect(day1).toEqual([{k: 'Berakhot', v: '1:1'}, {k: 'Berakhot', v: '1:2'}], str);
  }
});

test('throws-lookup-string', () => {
  const index = new MishnaYomiIndex();
  expect(() => {
    index.lookup('17 Cheshvan 5759');
  }).toThrow('Invalid date: 17 Cheshvan 5759');
});

test('throws-lookup-too-earch', () => {
  const index = new MishnaYomiIndex();
  expect(() => {
    index.lookup(new Date(1923, 1, 1));
  }).toThrow('Date 1923-02-01 too early; Mishna Yomi cycle began on 1947-05-20');
});

test('2021-cycle', () => {
  const index = new MishnaYomiIndex();
  const day1 = index.lookup(new Date(2021, 11, 25));
  expect(day1).toEqual([{k: 'Berakhot', v: '1:1'}, {k: 'Berakhot', v: '1:2'}]);
  const day10 = index.lookup(new Date(2022, 0, 3));
  expect(day10).toEqual([{k: 'Berakhot', v: '3:6'}, {k: 'Berakhot', v: '4:1'}]);
  const day28 = index.lookup(new Date(2022, 0, 22));
  expect(day28).toEqual([{k: 'Berakhot', v: '9:5'}, {k: 'Peah', v: '1:1'}]);
  expect(index.lookup(new Date(2022, 7, 1))).toEqual([{k: 'Terumot', v: '11:3'}, {k: 'Terumot', v: '11:4'}]);
  expect(index.lookup(new Date(2023, 2, 26))).toEqual([{k: 'Pesachim', v: '3:8'}, {k: 'Pesachim', v: '4:1'}]);
  expect(index.lookup(new Date(2024, 3, 5))).toEqual([{k: 'Nedarim', v: '11:12'}, {k: 'Nazir', v: '1:1'}]);
  expect(index.lookup(new Date(2024, 10, 5))).toEqual([{k: 'Bava Metzia', v: '10:5'}, {k: 'Bava Metzia', v: '10:6'}]);
  expect(index.lookup(new Date(2027, 8, 20))).toEqual([{k: 'Oktzin', v: '3:11'}, {k: 'Oktzin', v: '3:12'}]);
});
