import {HDate, months, shortKislev, longCheshvan} from '@hebcal/hdate';

const {
  TISHREI,
  CHESHVAN,
  KISLEV,
  TEVET,
  SHVAT,
  ADAR_I,
  ADAR_II,
  NISAN,
  IYYAR,
  SIVAN,
  TAMUZ,
  AV,
  ELUL,
} = months;

// Sefer Shemirat HaLashon was written 1865-1875 CE
// יום ד׳ כ״א ימים לחודש שבט שנת תרל״ו לפ״ק
const startDate = new HDate(21, SHVAT, 5636);
export const shemiratHaLashonStart = startDate.abs();

const Book1 = 1;
const Book2 = 2;
const Hakdamah = 'Hakdamah';
const Shar_Hazechira = 'Shar Hazechira';
const Shar_Hatorah = 'Shar Hatorah';
const Shar_Hatvuna = 'Shar Hatvuna';
const Epilogue = 'Chasimas Hasefer';
export const Chapters = 'x';

export const englishNames: Record<string, string | null> = {
  Hakdamah: 'Introduction',
  Shar_Hazechira: 'The Gate of Remembering',
  Shar_Hatvuna: 'The Gate of Discerning',
  Shar_Hatorah: 'The Gate of Torah',
  Chasimas_Hasefer: 'Epilogue',
  x: null,
};

type Entry = [
  [number, number], // normal
  [number, number], // leap
  number, // Book1 or Book2
  string, // Sub-book name
  number | string, // begin chapter
  number | string | undefined, // end chapter
];

const schedule: Entry[] = [
  [[1, TISHREI], [1, TISHREI], Book1, Hakdamah, 1, 2],
  [[2, TISHREI], [2, TISHREI], Book1, Hakdamah, 3, 4],
  [[3, TISHREI], [3, TISHREI], Book1, Hakdamah, 5, 6],
  [[4, TISHREI], [4, TISHREI], Book1, Hakdamah, 7, 13],
  [[5, TISHREI], [5, TISHREI], Book1, Hakdamah, 14, 15],
  [[6, TISHREI], [6, TISHREI], Book1, Hakdamah, 16, undefined],
  [[7, TISHREI], [7, TISHREI], Book1, Hakdamah, 17, undefined],
  [[8, TISHREI], [8, TISHREI], Book1, Hakdamah, 18, 20],
  [[9, TISHREI], [9, TISHREI], Book1, Hakdamah, 21, 22],
  [[10, TISHREI], [10, TISHREI], Book1, Hakdamah, 23, 24],
  [[11, TISHREI], [11, TISHREI], Book1, Shar_Hazechira, 1.1, 1.4],
  [[12, TISHREI], [12, TISHREI], Book1, Shar_Hazechira, 1.5, 1.6],
  [[13, TISHREI], [13, TISHREI], Book1, Shar_Hazechira, 1.7, undefined],
  [[14, TISHREI], [14, TISHREI], Book1, Shar_Hazechira, 2.1, 2.5],
  [[15, TISHREI], [15, TISHREI], Book1, Shar_Hazechira, 2.6, 2.8],
  [[15, TISHREI], [16, TISHREI], Book1, Shar_Hazechira, 2.9, undefined],
  [[16, TISHREI], [17, TISHREI], Book1, Shar_Hazechira, '2.10', 2.11],
  [[16, TISHREI], [18, TISHREI], Book1, Shar_Hazechira, 2.12, undefined],
  [[17, TISHREI], [19, TISHREI], Book1, Shar_Hazechira, 2.13, 2.14],
  [[18, TISHREI], [20, TISHREI], Book1, Shar_Hazechira, 3.1, 3.5],
  [[18, TISHREI], [21, TISHREI], Book1, Shar_Hazechira, 3.6, undefined],
  [[19, TISHREI], [22, TISHREI], Book1, Shar_Hazechira, 3.7, 3.8],
  [[20, TISHREI], [23, TISHREI], Book1, Shar_Hazechira, 4.1, 4.2],
  [[20, TISHREI], [24, TISHREI], Book1, Shar_Hazechira, 4.3, 4.4],
  [[21, TISHREI], [25, TISHREI], Book1, Shar_Hazechira, 4.5, 4.6],
  [[22, TISHREI], [26, TISHREI], Book1, Shar_Hazechira, 4.7, 4.9],
  [[23, TISHREI], [27, TISHREI], Book1, Shar_Hazechira, '4.10', 4.16],
  [[24, TISHREI], [28, TISHREI], Book1, Shar_Hazechira, 4.17, 4.19],
  [[25, TISHREI], [29, TISHREI], Book1, Shar_Hazechira, 5.1, 5.4],
  [[26, TISHREI], [30, TISHREI], Book1, Shar_Hazechira, 5.5, 5.6],
  [[27, TISHREI], [1, CHESHVAN], Book1, Shar_Hazechira, 5.7, undefined],
  [[27, TISHREI], [2, CHESHVAN], Book1, Shar_Hazechira, 5.8, '5.10'],
  [[28, TISHREI], [3, CHESHVAN], Book1, Shar_Hazechira, 6.1, 6.4],
  [[29, TISHREI], [4, CHESHVAN], Book1, Shar_Hazechira, 6.5, 6.6],
  [[29, TISHREI], [5, CHESHVAN], Book1, Shar_Hazechira, 6.7, 6.9],
  [[30, TISHREI], [6, CHESHVAN], Book1, Shar_Hazechira, '6.10', undefined],
  [[1, CHESHVAN], [7, CHESHVAN], Book1, Shar_Hazechira, 7.1, 7.7],
  [[2, CHESHVAN], [8, CHESHVAN], Book1, Shar_Hazechira, 7.8, 7.11],
  [[3, CHESHVAN], [9, CHESHVAN], Book1, Shar_Hazechira, 7.12, 7.15],
  [[4, CHESHVAN], [10, CHESHVAN], Book1, Shar_Hazechira, 7.16, 7.17],
  [[5, CHESHVAN], [11, CHESHVAN], Book1, Shar_Hazechira, 7.18, 7.19],
  [[6, CHESHVAN], [12, CHESHVAN], Book1, Shar_Hazechira, 8.1, 8.4],
  [[7, CHESHVAN], [13, CHESHVAN], Book1, Shar_Hazechira, 8.5, undefined],
  [[7, CHESHVAN], [14, CHESHVAN], Book1, Shar_Hazechira, 8.6, undefined],
  [[8, CHESHVAN], [15, CHESHVAN], Book1, Shar_Hazechira, 8.7, 8.9],
  [[9, CHESHVAN], [16, CHESHVAN], Book1, Shar_Hazechira, '8.10', 8.13],
  [[10, CHESHVAN], [17, CHESHVAN], Book1, Shar_Hazechira, 9.1, 9.4],
  [[11, CHESHVAN], [18, CHESHVAN], Book1, Shar_Hazechira, 9.5, undefined],
  [[12, CHESHVAN], [19, CHESHVAN], Book1, Shar_Hazechira, 9.6, 9.7],
  [[13, CHESHVAN], [20, CHESHVAN], Book1, Shar_Hazechira, 10.1, 10.2],
  [[14, CHESHVAN], [21, CHESHVAN], Book1, Shar_Hazechira, 10.3, undefined],
  [[15, CHESHVAN], [22, CHESHVAN], Book1, Shar_Hazechira, 10.4, 10.6],
  [[16, CHESHVAN], [23, CHESHVAN], Book1, Shar_Hazechira, 11.1, 11.2],
  [[16, CHESHVAN], [24, CHESHVAN], Book1, Shar_Hazechira, 11.3, 11.6],
  [[17, CHESHVAN], [25, CHESHVAN], Book1, Shar_Hazechira, 11.7, 11.9],
  [[18, CHESHVAN], [26, CHESHVAN], Book1, Shar_Hazechira, '11.10', undefined],
  [[19, CHESHVAN], [27, CHESHVAN], Book1, Shar_Hazechira, 11.11, undefined],
  [[20, CHESHVAN], [28, CHESHVAN], Book1, Shar_Hazechira, 11.12, 11.15],
  [[21, CHESHVAN], [29, CHESHVAN], Book1, Shar_Hazechira, 12.1, 12.3],
  [[22, CHESHVAN], [30, CHESHVAN], Book1, Shar_Hazechira, 12.4, undefined],
  [[23, CHESHVAN], [1, KISLEV], Book1, Shar_Hazechira, 12.5, 12.6],
  [[24, CHESHVAN], [2, KISLEV], Book1, Shar_Hazechira, 13.1, 13.3],
  [[25, CHESHVAN], [3, KISLEV], Book1, Shar_Hazechira, 13.4, undefined],
  [[26, CHESHVAN], [4, KISLEV], Book1, Shar_Hazechira, 13.5, undefined],
  [[27, CHESHVAN], [5, KISLEV], Book1, Shar_Hazechira, 13.6, 13.7],
  [[28, CHESHVAN], [6, KISLEV], Book1, Shar_Hazechira, 14.1, 14.2],
  [[29, CHESHVAN], [7, KISLEV], Book1, Shar_Hazechira, 14.3, 14.4],
  [[30, CHESHVAN], [8, KISLEV], Book1, Shar_Hazechira, 14.5, undefined],
  [[1, KISLEV], [9, KISLEV], Book1, Shar_Hazechira, 15.1, 15.3],
  [[2, KISLEV], [10, KISLEV], Book1, Shar_Hazechira, 15.4, 15.7],
  [[3, KISLEV], [11, KISLEV], Book1, Shar_Hazechira, 15.8, '15.10'],
  [[3, KISLEV], [12, KISLEV], Book1, Shar_Hazechira, 15.11, undefined],
  [[4, KISLEV], [13, KISLEV], Book1, Shar_Hazechira, 15.12, 15.15],
  [[5, KISLEV], [14, KISLEV], Book1, Shar_Hazechira, 16.1, 16.2],
  [[6, KISLEV], [15, KISLEV], Book1, Shar_Hazechira, 16.3, 16.4],
  [[7, KISLEV], [16, KISLEV], Book1, Shar_Hazechira, 16.5, undefined],
  [[8, KISLEV], [17, KISLEV], Book1, Shar_Hazechira, 16.6, undefined],
  [[9, KISLEV], [18, KISLEV], Book1, Shar_Hazechira, 16.7, undefined],
  [[10, KISLEV], [19, KISLEV], Book1, Shar_Hazechira, 17.1, 17.2],
  [[10, KISLEV], [20, KISLEV], Book1, Shar_Hazechira, 17.3, undefined],
  [[11, KISLEV], [21, KISLEV], Book1, Shar_Hazechira, 17.4, 17.6],
  [[12, KISLEV], [22, KISLEV], Book1, Shar_Hazechira, 17.7, undefined],
  [[13, KISLEV], [23, KISLEV], Book1, Shar_Hatvuna, 1.1, 1.2],
  [[14, KISLEV], [24, KISLEV], Book1, Shar_Hatvuna, 1.3, undefined],
  [[15, KISLEV], [25, KISLEV], Book1, Shar_Hatvuna, 1.4, undefined],
  [[16, KISLEV], [26, KISLEV], Book1, Shar_Hatvuna, 2.1, 2.2],
  [[17, KISLEV], [27, KISLEV], Book1, Shar_Hatvuna, 2.3, undefined],
  [[18, KISLEV], [28, KISLEV], Book1, Shar_Hatvuna, 2.4, undefined],
  [[19, KISLEV], [29, KISLEV], Book1, Shar_Hatvuna, 2.5, undefined],
  [[20, KISLEV], [30, KISLEV], Book1, Shar_Hatvuna, 2.6, '2.10'],
  [[21, KISLEV], [1, TEVET], Book1, Shar_Hatvuna, 3.1, 3.2],
  [[22, KISLEV], [2, TEVET], Book1, Shar_Hatvuna, 3.3, undefined],
  [[23, KISLEV], [3, TEVET], Book1, Shar_Hatvuna, 3.4, 3.5],
  [[24, KISLEV], [4, TEVET], Book1, Shar_Hatvuna, 3.6, undefined],
  [[25, KISLEV], [5, TEVET], Book1, Shar_Hatvuna, 3.7, 3.8],
  [[26, KISLEV], [6, TEVET], Book1, Shar_Hatvuna, 4.1, 4.3],
  [[27, KISLEV], [7, TEVET], Book1, Shar_Hatvuna, 4.4, undefined],
  [[28, KISLEV], [8, TEVET], Book1, Shar_Hatvuna, 4.5, 4.6],
  [[29, KISLEV], [9, TEVET], Book1, Shar_Hatvuna, 5.1, 5.2],
  [[30, KISLEV], [10, TEVET], Book1, Shar_Hatvuna, 5.3, 5.4],
  [[1, TEVET], [11, TEVET], Book1, Shar_Hatvuna, 5.5, 5.6],
  [[2, TEVET], [12, TEVET], Book1, Shar_Hatvuna, 6.1, 6.5],
  [[3, TEVET], [13, TEVET], Book1, Shar_Hatvuna, 6.6, undefined],
  [[4, TEVET], [14, TEVET], Book1, Shar_Hatvuna, 6.7, 6.8],
  [[5, TEVET], [15, TEVET], Book1, Shar_Hatvuna, 6.9, 6.13],
  [[6, TEVET], [16, TEVET], Book1, Shar_Hatvuna, 7.1, 7.2],
  [[7, TEVET], [17, TEVET], Book1, Shar_Hatvuna, 7.3, 7.5],
  [[8, TEVET], [18, TEVET], Book1, Shar_Hatvuna, 7.6, 7.9],
  [[9, TEVET], [19, TEVET], Book1, Shar_Hatvuna, '7.10', 7.11],
  [[10, TEVET], [20, TEVET], Book1, Shar_Hatvuna, 7.12, undefined],
  [[11, TEVET], [21, TEVET], Book1, Shar_Hatvuna, 8.1, 8.3],
  [[12, TEVET], [22, TEVET], Book1, Shar_Hatvuna, 8.4, 8.5],
  [[13, TEVET], [23, TEVET], Book1, Shar_Hatvuna, 8.6, 8.7],
  [[14, TEVET], [24, TEVET], Book1, Shar_Hatvuna, 8.8, 8.9],
  [[15, TEVET], [25, TEVET], Book1, Shar_Hatvuna, '8.10', 8.12],
  [[16, TEVET], [26, TEVET], Book1, Shar_Hatvuna, 8.13, undefined],
  [[17, TEVET], [27, TEVET], Book1, Shar_Hatvuna, 9.1, 9.2],
  [[18, TEVET], [28, TEVET], Book1, Shar_Hatvuna, 9.3, undefined],
  [[19, TEVET], [29, TEVET], Book1, Shar_Hatvuna, 9.4, undefined],
  [[20, TEVET], [1, SHVAT], Book1, Shar_Hatvuna, 9.5, 9.6],
  [[21, TEVET], [2, SHVAT], Book1, Shar_Hatvuna, 10.1, 10.3],
  [[22, TEVET], [3, SHVAT], Book1, Shar_Hatvuna, 10.4, undefined],
  [[23, TEVET], [4, SHVAT], Book1, Shar_Hatvuna, 10.5, undefined],
  [[24, TEVET], [5, SHVAT], Book1, Shar_Hatvuna, 10.6, undefined],
  [[25, TEVET], [6, SHVAT], Book1, Shar_Hatvuna, 11.1, 11.2],
  [[26, TEVET], [7, SHVAT], Book1, Shar_Hatvuna, 11.3, 11.4],
  [[27, TEVET], [8, SHVAT], Book1, Shar_Hatvuna, 11.5, 11.7],
  [[28, TEVET], [9, SHVAT], Book1, Shar_Hatvuna, 12.1, 12.2],
  [[29, TEVET], [10, SHVAT], Book1, Shar_Hatvuna, 12.3, undefined],
  [[1, SHVAT], [11, SHVAT], Book1, Shar_Hatvuna, 12.4, undefined],
  [[2, SHVAT], [12, SHVAT], Book1, Shar_Hatvuna, 12.5, 12.6],
  [[3, SHVAT], [13, SHVAT], Book1, Shar_Hatvuna, 13.1, 13.2],
  [[4, SHVAT], [14, SHVAT], Book1, Shar_Hatvuna, 13.3, 13.4],
  [[5, SHVAT], [15, SHVAT], Book1, Shar_Hatvuna, 13.5, undefined],
  [[5, SHVAT], [16, SHVAT], Book1, Shar_Hatvuna, 13.6, undefined],
  [[6, SHVAT], [17, SHVAT], Book1, Shar_Hatvuna, 13.7, 13.8],
  [[7, SHVAT], [18, SHVAT], Book1, Shar_Hatvuna, 13.9, undefined],
  [[8, SHVAT], [19, SHVAT], Book1, Shar_Hatvuna, '13.10', undefined],
  [[9, SHVAT], [20, SHVAT], Book1, Shar_Hatvuna, 13.11, 13.13],
  [[10, SHVAT], [21, SHVAT], Book1, Shar_Hatvuna, 14.1, 14.3],
  [[11, SHVAT], [22, SHVAT], Book1, Shar_Hatvuna, 14.4, undefined],
  [[12, SHVAT], [23, SHVAT], Book1, Shar_Hatvuna, 14.5, 14.6],
  [[13, SHVAT], [24, SHVAT], Book1, Shar_Hatvuna, 14.7, 14.8],
  [[14, SHVAT], [25, SHVAT], Book1, Shar_Hatvuna, 15.1, 15.3],
  [[15, SHVAT], [26, SHVAT], Book1, Shar_Hatvuna, 15.4, 15.5],
  [[16, SHVAT], [27, SHVAT], Book1, Shar_Hatvuna, 15.6, undefined],
  [[17, SHVAT], [28, SHVAT], Book1, Shar_Hatvuna, 16.1, 16.3],
  [[18, SHVAT], [29, SHVAT], Book1, Shar_Hatvuna, 16.4, 16.8],
  [[19, SHVAT], [30, SHVAT], Book1, Shar_Hatvuna, 16.9, 16.11],
  [[20, SHVAT], [1, ADAR_I], Book1, Shar_Hatvuna, 16.12, undefined],
  [[21, SHVAT], [2, ADAR_I], Book1, Shar_Hatvuna, 16.13, undefined],
  [[22, SHVAT], [3, ADAR_I], Book1, Shar_Hatvuna, 16.14, 16.15],
  [[23, SHVAT], [4, ADAR_I], Book1, Shar_Hatvuna, 17.1, 17.4],
  [[23, SHVAT], [5, ADAR_I], Book1, Shar_Hatvuna, 17.5, 17.6],
  [[24, SHVAT], [6, ADAR_I], Book1, Shar_Hatvuna, 17.7, 17.9],
  [[25, SHVAT], [7, ADAR_I], Book1, Shar_Hatvuna, '17.10', undefined],
  [[26, SHVAT], [8, ADAR_I], Book1, Shar_Hatvuna, 17.11, 17.12],
  [[27, SHVAT], [9, ADAR_I], Book1, Shar_Hatorah, 1.1, 1.3],
  [[28, SHVAT], [10, ADAR_I], Book1, Shar_Hatorah, 1.4, undefined],
  [[29, SHVAT], [11, ADAR_I], Book1, Shar_Hatorah, 1.5, 1.7],
  [[30, SHVAT], [12, ADAR_I], Book1, Shar_Hatorah, 1.8, 1.9],
  [[1, ADAR_I], [13, ADAR_I], Book1, Shar_Hatorah, '1.10', undefined],
  [[2, ADAR_I], [14, ADAR_I], Book1, Shar_Hatorah, 1.11, 1.12],
  [[3, ADAR_I], [15, ADAR_I], Book1, Shar_Hatorah, 1.13, undefined],
  [[4, ADAR_I], [16, ADAR_I], Book1, Shar_Hatorah, 1.14, 1.16],
  [[5, ADAR_I], [17, ADAR_I], Book1, Shar_Hatorah, 2.1, 2.3],
  [[6, ADAR_I], [18, ADAR_I], Book1, Shar_Hatorah, 2.4, 2.9],
  [[7, ADAR_I], [19, ADAR_I], Book1, Shar_Hatorah, '2.10', undefined],
  [[8, ADAR_I], [20, ADAR_I], Book1, Shar_Hatorah, 2.11, undefined],
  [[9, ADAR_I], [21, ADAR_I], Book1, Shar_Hatorah, 2.12, 2.16],
  [[10, ADAR_I], [22, ADAR_I], Book1, Shar_Hatorah, 2.17, 2.19],
  [[10, ADAR_I], [23, ADAR_I], Book1, Shar_Hatorah, '2.20', 2.23],
  [[11, ADAR_I], [24, ADAR_I], Book1, Shar_Hatorah, 2.24, 2.25],
  [[11, ADAR_I], [25, ADAR_I], Book1, Shar_Hatorah, 2.26, 2.27],
  [[12, ADAR_I], [26, ADAR_I], Book1, Shar_Hatorah, 3.1, 3.3],
  [[13, ADAR_I], [27, ADAR_I], Book1, Shar_Hatorah, 3.4, 3.6],
  [[13, ADAR_I], [28, ADAR_I], Book1, Shar_Hatorah, 3.7, undefined],
  [[14, ADAR_I], [29, ADAR_I], Book1, Shar_Hatorah, 3.8, undefined],
  [[15, ADAR_I], [30, ADAR_I], Book1, Shar_Hatorah, 3.9, 3.12],
  [[16, ADAR_I], [1, ADAR_II], Book1, Shar_Hatorah, 3.13, 3.14],
  [[17, ADAR_I], [2, ADAR_II], Book1, Shar_Hatorah, 3.15, undefined],
  [[18, ADAR_I], [3, ADAR_II], Book1, Shar_Hatorah, 3.16, 3.19],
  [[19, ADAR_I], [4, ADAR_II], Book1, Shar_Hatorah, 4.1, 4.3],
  [[20, ADAR_I], [5, ADAR_II], Book1, Shar_Hatorah, 4.4, 4.5],
  [[21, ADAR_I], [6, ADAR_II], Book1, Shar_Hatorah, 4.6, 4.7],
  [[22, ADAR_I], [7, ADAR_II], Book1, Shar_Hatorah, 4.8, 4.11],
  [[23, ADAR_I], [8, ADAR_II], Book1, Shar_Hatorah, 4.12, 4.16],
  [[24, ADAR_I], [9, ADAR_II], Book1, Shar_Hatorah, 4.17, 4.19],
  [[25, ADAR_I], [10, ADAR_II], Book1, Shar_Hatorah, '4.20', 4.25],
  [[26, ADAR_I], [11, ADAR_II], Book1, Shar_Hatorah, 4.26, undefined],
  [[27, ADAR_I], [12, ADAR_II], Book1, Shar_Hatorah, 4.27, 4.29],
  [[28, ADAR_I], [13, ADAR_II], Book1, Shar_Hatorah, 5.1, 5.2],
  [[29, ADAR_I], [14, ADAR_II], Book1, Shar_Hatorah, 5.3, 5.4],
  [[1, NISAN], [15, ADAR_II], Book1, Shar_Hatorah, 5.5, undefined],
  [[2, NISAN], [16, ADAR_II], Book1, Shar_Hatorah, 5.6, 5.8],
  [[3, NISAN], [17, ADAR_II], Book1, Shar_Hatorah, 5.9, 5.11],
  [[4, NISAN], [18, ADAR_II], Book1, Shar_Hatorah, 5.12, 5.13],
  [[5, NISAN], [19, ADAR_II], Book1, Shar_Hatorah, 5.14, 5.15],
  [[6, NISAN], [20, ADAR_II], Book1, Shar_Hatorah, 5.16, 5.17],
  [[7, NISAN], [21, ADAR_II], Book1, Shar_Hatorah, 6.1, 6.3],
  [[8, NISAN], [22, ADAR_II], Book1, Shar_Hatorah, 6.4, 6.5],
  [[9, NISAN], [23, ADAR_II], Book1, Shar_Hatorah, 6.6, 6.9],
  [[10, NISAN], [24, ADAR_II], Book1, Shar_Hatorah, '6.10', 6.14],
  [[11, NISAN], [25, ADAR_II], Book1, Shar_Hatorah, 6.15, 6.16],
  [[12, NISAN], [26, ADAR_II], Book1, Shar_Hatorah, 7.1, 7.2],
  [[13, NISAN], [27, ADAR_II], Book1, Shar_Hatorah, 7.3, 7.4],
  [[14, NISAN], [28, ADAR_II], Book1, Shar_Hatorah, 7.5, 7.6],
  [[15, NISAN], [29, ADAR_II], Book1, Shar_Hatorah, 7.7, 7.8],
  [[16, NISAN], [1, NISAN], Book1, Shar_Hatorah, 7.9, undefined],
  [[17, NISAN], [2, NISAN], Book1, Shar_Hatorah, '7.10', 7.11],
  [[18, NISAN], [3, NISAN], Book1, Shar_Hatorah, 7.12, 7.14],
  [[19, NISAN], [4, NISAN], Book1, Shar_Hatorah, 7.15, 7.17],
  [[20, NISAN], [5, NISAN], Book1, Shar_Hatorah, 7.18, undefined],
  [[21, NISAN], [6, NISAN], Book1, Shar_Hatorah, 7.19, undefined],
  [[22, NISAN], [7, NISAN], Book1, Shar_Hatorah, 8.1, 8.3],
  [[23, NISAN], [8, NISAN], Book1, Shar_Hatorah, 8.4, undefined],
  [[24, NISAN], [9, NISAN], Book1, Shar_Hatorah, 8.5, 8.6],
  [[25, NISAN], [10, NISAN], Book1, Shar_Hatorah, 8.7, undefined],
  [[26, NISAN], [11, NISAN], Book1, Shar_Hatorah, 8.8, undefined],
  [[27, NISAN], [12, NISAN], Book1, Shar_Hatorah, 8.9, '8.10'],
  [[28, NISAN], [13, NISAN], Book1, Shar_Hatorah, 9.1, 9.5],
  [[29, NISAN], [14, NISAN], Book1, Shar_Hatorah, 9.6, 9.7],
  [[30, NISAN], [15, NISAN], Book1, Shar_Hatorah, 9.8, 9.11],
  [[1, IYYAR], [16, NISAN], Book1, Shar_Hatorah, 9.12, undefined],
  [[2, IYYAR], [17, NISAN], Book1, Shar_Hatorah, 9.13, 9.14],
  [[3, IYYAR], [18, NISAN], Book1, Shar_Hatorah, 9.15, 9.17],
  [[4, IYYAR], [19, NISAN], Book1, Shar_Hatorah, 10.1, 10.4],
  [[5, IYYAR], [20, NISAN], Book1, Shar_Hatorah, 10.5, 10.7],
  [[6, IYYAR], [21, NISAN], Book1, Shar_Hatorah, 10.8, 10.9],
  [[7, IYYAR], [22, NISAN], Book1, Shar_Hatorah, '10.10', 10.11],
  [[8, IYYAR], [23, NISAN], Book1, Epilogue, 1.1, 1.4],
  [[9, IYYAR], [24, NISAN], Book1, Epilogue, 1.5, undefined],
  [[10, IYYAR], [25, NISAN], Book1, Epilogue, 2.1, 2.4],
  [[11, IYYAR], [26, NISAN], Book1, Epilogue, 2.5, undefined],
  [[12, IYYAR], [27, NISAN], Book1, Epilogue, 3.1, 3.2],
  [[13, IYYAR], [28, NISAN], Book1, Epilogue, 3.3, 3.4],
  [[14, IYYAR], [29, NISAN], Book1, Epilogue, 3.5, undefined],
  [[15, IYYAR], [30, NISAN], Book1, Epilogue, 3.6, undefined],
  [[16, IYYAR], [1, IYYAR], Book1, Epilogue, 4.1, 4.3],
  [[17, IYYAR], [2, IYYAR], Book1, Epilogue, 4.4, 4.5],
  [[18, IYYAR], [3, IYYAR], Book1, Epilogue, 4.6, 4.8],
  [[19, IYYAR], [4, IYYAR], Book1, Epilogue, 5.1, 5.3],
  [[20, IYYAR], [5, IYYAR], Book1, Epilogue, 6.1, 6.2],
  [[21, IYYAR], [6, IYYAR], Book1, Epilogue, 6.3, 6.4],
  [[22, IYYAR], [7, IYYAR], Book1, Epilogue, 6.5, 6.6],
  [[23, IYYAR], [8, IYYAR], Book1, Epilogue, 6.7, 6.9],
  [[24, IYYAR], [9, IYYAR], Book1, Epilogue, '6.10', 6.11],
  [[25, IYYAR], [10, IYYAR], Book1, Epilogue, 7.1, 7.5],
  [[26, IYYAR], [11, IYYAR], Book1, Epilogue, 7.6, undefined],
  [[27, IYYAR], [12, IYYAR], Book1, Epilogue, 7.7, 7.8],
  [[28, IYYAR], [13, IYYAR], Book1, Epilogue, 7.9, undefined],
  [[29, IYYAR], [14, IYYAR], Book1, Epilogue, '7.10', undefined],
  [[1, SIVAN], [15, IYYAR], Book1, Epilogue, 7.11, undefined],
  [[2, SIVAN], [16, IYYAR], Book1, Epilogue, 7.12, 7.13],
  [[3, SIVAN], [17, IYYAR], Book2, Chapters, 1.1, 1.2],
  [[4, SIVAN], [18, IYYAR], Book2, Chapters, 1.3, 1.5],
  [[5, SIVAN], [19, IYYAR], Book2, Chapters, 1.6, 1.7],
  [[6, SIVAN], [20, IYYAR], Book2, Chapters, 1.8, undefined],
  [[7, SIVAN], [21, IYYAR], Book2, Chapters, 2.1, 2.4],
  [[8, SIVAN], [22, IYYAR], Book2, Chapters, 2.5, 2.6],
  [[9, SIVAN], [23, IYYAR], Book2, Chapters, 2.7, undefined],
  [[10, SIVAN], [24, IYYAR], Book2, Chapters, 2.8, undefined],
  [[10, SIVAN], [25, IYYAR], Book2, Chapters, 2.9, undefined],
  [[11, SIVAN], [26, IYYAR], Book2, Chapters, '2.10', undefined],
  [[12, SIVAN], [27, IYYAR], Book2, Chapters, 2.11, undefined],
  [[13, SIVAN], [28, IYYAR], Book2, Chapters, 3.1, 3.2],
  [[14, SIVAN], [29, IYYAR], Book2, Chapters, 3.3, 3.4],
  [[15, SIVAN], [1, SIVAN], Book2, Chapters, 3.5, 3.6],
  [[16, SIVAN], [2, SIVAN], Book2, Chapters, 3.7, undefined],
  [[17, SIVAN], [3, SIVAN], Book2, Chapters, 4.1, 4.5],
  [[18, SIVAN], [4, SIVAN], Book2, Chapters, 4.6, 4.7],
  [[19, SIVAN], [5, SIVAN], Book2, Chapters, 5.1, 5.3],
  [[20, SIVAN], [6, SIVAN], Book2, Chapters, 5.4, 5.5],
  [[21, SIVAN], [7, SIVAN], Book2, Chapters, 5.6, 5.7],
  [[22, SIVAN], [8, SIVAN], Book2, Chapters, 6.1, 6.3],
  [[23, SIVAN], [9, SIVAN], Book2, Chapters, 6.4, 6.5],
  [[24, SIVAN], [10, SIVAN], Book2, Chapters, 7.1, 7.3],
  [[25, SIVAN], [11, SIVAN], Book2, Chapters, 7.4, undefined],
  [[25, SIVAN], [12, SIVAN], Book2, Chapters, 7.5, 7.6],
  [[26, SIVAN], [13, SIVAN], Book2, Chapters, 7.7, 7.9],
  [[27, SIVAN], [14, SIVAN], Book2, Chapters, 8.1, 8.3],
  [[28, SIVAN], [15, SIVAN], Book2, Chapters, 8.4, 8.5],
  [[29, SIVAN], [16, SIVAN], Book2, Chapters, 8.6, 8.7],
  [[30, SIVAN], [17, SIVAN], Book2, Chapters, 8.8, undefined],
  [[1, TAMUZ], [18, SIVAN], Book2, Chapters, 9.1, 9.5],
  [[2, TAMUZ], [19, SIVAN], Book2, Chapters, 9.6, 9.7],
  [[3, TAMUZ], [20, SIVAN], Book2, Chapters, 9.8, '9.10'],
  [[4, TAMUZ], [21, SIVAN], Book2, Chapters, 10.1, 10.4],
  [[5, TAMUZ], [22, SIVAN], Book2, Chapters, 11.1, 11.3],
  [[5, TAMUZ], [23, SIVAN], Book2, Chapters, 11.4, 11.6],
  [[6, TAMUZ], [24, SIVAN], Book2, Chapters, 11.7, 11.8],
  [[7, TAMUZ], [25, SIVAN], Book2, Chapters, 11.9, '11.10'],
  [[8, TAMUZ], [26, SIVAN], Book2, Chapters, 11.11, 11.12],
  [[9, TAMUZ], [27, SIVAN], Book2, Chapters, 11.13, undefined],
  [[10, TAMUZ], [28, SIVAN], Book2, Chapters, 11.14, 11.17],
  [[11, TAMUZ], [29, SIVAN], Book2, Chapters, 11.18, 11.19],
  [[12, TAMUZ], [30, SIVAN], Book2, Chapters, '11.20', 11.21],
  [[13, TAMUZ], [1, TAMUZ], Book2, Chapters, 11.22, 11.25],
  [[14, TAMUZ], [2, TAMUZ], Book2, Chapters, 12.1, 12.3],
  [[15, TAMUZ], [3, TAMUZ], Book2, Chapters, 12.4, undefined],
  [[16, TAMUZ], [4, TAMUZ], Book2, Chapters, 12.5, undefined],
  [[17, TAMUZ], [5, TAMUZ], Book2, Chapters, 12.6, undefined],
  [[18, TAMUZ], [6, TAMUZ], Book2, Chapters, 12.7, undefined],
  [[18, TAMUZ], [7, TAMUZ], Book2, Chapters, 12.8, undefined],
  [[19, TAMUZ], [8, TAMUZ], Book2, Chapters, 12.9, '12.10'],
  [[19, TAMUZ], [9, TAMUZ], Book2, Chapters, 12.11, undefined],
  [[20, TAMUZ], [10, TAMUZ], Book2, Chapters, 13.1, 13.4],
  [[21, TAMUZ], [11, TAMUZ], Book2, Chapters, 13.5, 13.7],
  [[22, TAMUZ], [12, TAMUZ], Book2, Chapters, 13.8, 13.13],
  [[23, TAMUZ], [13, TAMUZ], Book2, Chapters, 14.1, 14.4],
  [[24, TAMUZ], [14, TAMUZ], Book2, Chapters, 14.5, 14.7],
  [[25, TAMUZ], [15, TAMUZ], Book2, Chapters, 15.1, 15.3],
  [[26, TAMUZ], [16, TAMUZ], Book2, Chapters, 15.4, 15.6],
  [[27, TAMUZ], [17, TAMUZ], Book2, Chapters, 15.7, 15.8],
  [[28, TAMUZ], [18, TAMUZ], Book2, Chapters, 16.1, 16.4],
  [[29, TAMUZ], [19, TAMUZ], Book2, Chapters, 16.5, undefined],
  [[29, TAMUZ], [20, TAMUZ], Book2, Chapters, 16.6, '16.10'],
  [[1, AV], [21, TAMUZ], Book2, Chapters, 16.11, 16.12],
  [[2, AV], [22, TAMUZ], Book2, Chapters, 16.13, undefined],
  [[3, AV], [23, TAMUZ], Book2, Chapters, 16.14, undefined],
  [[3, AV], [24, TAMUZ], Book2, Chapters, 16.15, undefined],
  [[4, AV], [25, TAMUZ], Book2, Chapters, 17.1, 17.2],
  [[5, AV], [26, TAMUZ], Book2, Chapters, 17.3, undefined],
  [[6, AV], [27, TAMUZ], Book2, Chapters, 17.4, undefined],
  [[6, AV], [28, TAMUZ], Book2, Chapters, 17.5, undefined],
  [[7, AV], [29, TAMUZ], Book2, Chapters, 18.1, 18.7],
  [[8, AV], [1, AV], Book2, Chapters, 19.1, 19.2],
  [[9, AV], [2, AV], Book2, Chapters, 19.3, 19.4],
  [[10, AV], [3, AV], Book2, Chapters, 19.5, 19.6],
  [[11, AV], [4, AV], Book2, Chapters, 19.7, 19.8],
  [[12, AV], [5, AV], Book2, Chapters, 19.9, '19.10'],
  [[13, AV], [6, AV], Book2, Chapters, 19.11, 19.12],
  // this footnote is not a separate rule like some of them are. It may be easier if Sefaria adds it as its own rule
  [[14, AV], [7, AV], Book2, Chapters, '19.Footnote_in_11', undefined],
  [[15, AV], [8, AV], Book2, Chapters, 19.12, 19.14],
  [[15, AV], [9, AV], Book2, Chapters, 19.15, undefined],
  [[16, AV], [10, AV], Book2, Chapters, 20.1, 20.4],
  [[17, AV], [11, AV], Book2, Chapters, 20.5, 20.6],
  [[18, AV], [12, AV], Book2, Chapters, 21.1, 21.4],
  [[19, AV], [13, AV], Book2, Chapters, 21.5, '21.10'],
  [[20, AV], [14, AV], Book2, Chapters, 21.11, 21.13],
  [[21, AV], [15, AV], Book2, Chapters, 21.14, undefined],
  [[22, AV], [16, AV], Book2, Chapters, 21.15, undefined],
  [[23, AV], [17, AV], Book2, Chapters, 22.1, 22.3],
  [[24, AV], [18, AV], Book2, Chapters, 22.4, undefined],
  [[25, AV], [19, AV], Book2, Chapters, 22.5, 22.6],
  [[26, AV], [20, AV], Book2, Chapters, 23.1, 23.2],
  [[27, AV], [21, AV], Book2, Chapters, 23.3, undefined],
  [[27, AV], [22, AV], Book2, Chapters, 23.4, 23.5],
  [[28, AV], [23, AV], Book2, Chapters, 24.1, 24.3],
  [[29, AV], [24, AV], Book2, Chapters, 25.1, 25.3],
  [[30, AV], [25, AV], Book2, Chapters, 26.1, 26.4],
  [[1, ELUL], [26, AV], Book2, Chapters, 26.5, undefined],
  [[2, ELUL], [27, AV], Book2, Chapters, 26.6, 26.11],
  [[3, ELUL], [28, AV], Book2, Chapters, 27.1, 27.2],
  [[4, ELUL], [29, AV], Book2, Chapters, 27.3, undefined],
  [[4, ELUL], [30, AV], Book2, Chapters, 27.4, undefined],
  [[5, ELUL], [1, ELUL], Book2, Chapters, 27.5, undefined],
  [[6, ELUL], [2, ELUL], Book2, Chapters, 27.6, 27.7],
  [[7, ELUL], [3, ELUL], Book2, Chapters, 28.1, 28.2],
  [[8, ELUL], [4, ELUL], Book2, Chapters, 28.3, undefined],
  [[9, ELUL], [5, ELUL], Book2, Chapters, 29.1, 29.8],
  [[10, ELUL], [6, ELUL], Book2, Chapters, 29.9, 29.13],
  [[11, ELUL], [7, ELUL], Book2, Chapters, 29.14, 29.16],
  [[12, ELUL], [8, ELUL], Book2, Chapters, 29.17, undefined],
  [[13, ELUL], [9, ELUL], Book2, Chapters, 29.18, '29.20'],
  [[14, ELUL], [10, ELUL], Book2, Chapters, 30.1, 30.5],
  [[15, ELUL], [11, ELUL], Book2, Chapters, 30.6, 30.9],
  [[16, ELUL], [12, ELUL], Book2, Chapters, '30.10', 30.12],
  [[17, ELUL], [13, ELUL], Book2, Chapters, 30.13, 30.14],
  [[18, ELUL], [14, ELUL], Book2, Chapters, 30.15, 30.16],
  [[19, ELUL], [15, ELUL], Book2, Chapters, 30.17, undefined],
  [[19, ELUL], [16, ELUL], Book2, Chapters, 30.18, '30.20'],
  [[20, ELUL], [17, ELUL], Book2, Epilogue, 1.1, 1.2],
  [[21, ELUL], [18, ELUL], Book2, Epilogue, 1.3, undefined],
  [[22, ELUL], [19, ELUL], Book2, Epilogue, 1.4, 1.6],
  [[23, ELUL], [20, ELUL], Book2, Epilogue, 1.7, undefined],
  [[23, ELUL], [21, ELUL], Book2, Epilogue, 1.8, undefined],
  [[24, ELUL], [22, ELUL], Book2, Epilogue, 1.9, 1.12],
  [[25, ELUL], [23, ELUL], Book2, Epilogue, 1.13, 1.16],
  [[26, ELUL], [24, ELUL], Book2, Epilogue, 1.17, undefined],
  [[26, ELUL], [25, ELUL], Book2, Epilogue, 1.18, undefined],
  [[26, ELUL], [26, ELUL], Book2, Epilogue, 1.19, undefined],
  [[27, ELUL], [27, ELUL], Book2, Epilogue, 2.1, 2.2],
  [[28, ELUL], [28, ELUL], Book2, Epilogue, 3.1, 3.4],
  // 3 and on was written as an additive for previous discussions in Sefer Chofetz Chaim and Shmiras Halashon
  [[29, ELUL], [29, ELUL], Book2, Epilogue, 4.1, 4.2],
];

/**
 * Describes one day's reading in the Sefer Shemirat HaLashon calendar.
 */
export type ShemiratHaLashonReading = {
  /**
   * Book number — `1` for Book I (Sha'ar HaZechira / HaTvuna /
   * HaTorah / Epilogue) or `2` for Book II (numbered chapters).
   */
  bk: number;
  /**
   * Section name. For Book I one of `"Hakdamah"`, `"Shar Hazechira"`,
   * `"Shar Hatvuna"`, `"Shar Hatorah"`, or `"Chasimas Hasefer"`
   * (Epilogue). For Book II this is always `"x"` (a sentinel meaning
   * "no sub-section"). Translate via the `englishNames` map exported
   * from this module.
   */
  k: string;
  /**
   * Beginning of the day's reading — usually a `chapter.halacha`
   * number (e.g. `1.1`) but occasionally a plain integer for sections
   * that aren't subdivided into halachot.
   */
  b: number | string;
  /**
   * End of the day's reading. Same format as `b`. Equals `b` when
   * only one halacha is studied.
   */
  e: number | string;
};

/**
 * Returns the Sefer Shemirat HaLashon reading scheduled for the
 * given Hebrew date.
 *
 * Sefer Shemirat HaLashon (Rabbi Yisrael Meir Kagan, completed 1876)
 * is a companion volume to the Chofetz Chaim. Like its companion the
 * schedule is Hebrew-calendar driven: the same Hebrew date in
 * different years receives the same reading, with separate tracks
 * for common and leap years. Short Cheshvan and short Kislev fold
 * the missing 30th day's reading into the 29th.
 *
 * Unlike most other calendars in this package, this function only
 * accepts an `HDate` (not a Gregorian `Date` or absolute day number).
 *
 * @param hdate - Hebrew date to look up.
 * @returns A {@link ShemiratHaLashonReading} for the given date.
 *   Always returns a reading once the cycle has begun.
 * @throws {RangeError} if `hdate` is before 21 Sh'vat 5636
 *   (~16 February 1876).
 * @throws {TypeError} if `hdate` is not an `HDate`.
 */
export function shemiratHaLashon(hdate: HDate): ShemiratHaLashonReading {
  if (!HDate.isHDate(hdate)) {
    throw new TypeError(`Invalid date: ${hdate}`);
  }
  const cday = hdate.abs();
  if (cday < shemiratHaLashonStart) {
    throw new RangeError(
      `Date ${hdate} too early; Sefer Shemirat HaLashon cycle began on ${startDate}`
    );
  }

  const day = hdate.getDate();
  const month = hdate.getMonth();
  const isLeapYear = hdate.isLeapYear();
  const result = lookupReading(day, month, isLeapYear);

  // check for 29th of Kislev or Cheshvan
  const year = hdate.getFullYear();
  if (
    day === 29 &&
    ((month === KISLEV && shortKislev(year)) || (month === CHESHVAN && !longCheshvan(year)))
  ) {
    const extra = lookupReading(30, month, isLeapYear);
    result.e = extra.e;
  }
  return result;
}

function lookupReading(day: number, month: number, isLeapYear: boolean): ShemiratHaLashonReading {
  let bk = 0;
  let k = '';
  let b: number | string = 0;
  let e: number | string = 0;
  for (const reading of schedule) {
    const dates = reading[isLeapYear ? 1 : 0];
    const dd = dates[0];
    const mm = dates[1];
    if (dd === day && mm === month) {
      if (!k) {
        bk = reading[2]; // Book 1 or 2
        k = reading[3]; // section
        b = reading[4]; // begin
      }
      e = reading[5] || reading[4]; // end
    }
  }
  return {bk, k, b, e};
}
