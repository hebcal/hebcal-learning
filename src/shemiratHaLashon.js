/* eslint-disable camelcase */
import {months, HDate, Event, flags, Locale} from '@hebcal/core';
import {formatReadingPages} from './chofetzChaim.js';

const Nisan = months.NISAN;
const Iyyar = months.IYYAR;
const Sivan = months.SIVAN;
const Tamuz = months.TAMUZ;
const Av = months.AV;
const Elul = months.ELUL;
const Tishrei = months.TISHREI;
const Cheshvan = months.CHESHVAN;
const Kislev = months.KISLEV;
const Teves = months.TEVET;
const Shvat = months.SHVAT;
const Adar = months.ADAR_I;
const Adar1 = months.ADAR_I;
const Adar2 = months.ADAR_II;

// Sefer Shemirat HaLashon was written 1865-1875 CE
// יום ד׳ כ״א ימים לחודש שבט שנת תרל״ו לפ״ק
const startDate = new HDate(21, Shvat, 5636);
export const shemiratHaLashonStart = startDate.abs();

const Book1 = 1;
const Book2 = 2;
const Hakdamah = 'Hakdamah';
const Shar_Hazechira = 'Shar Hazechira';
const Shar_Hatorah = 'Shar Hatorah';
const Shar_Hatvuna = 'Shar Hatvuna';
const Epilogue = 'Chasimas Hasefer';
const Chapters = 'x';

const englishNames = {
  Hakdamah: 'Introduction',
  Shar_Hazechira: 'The Gate of Remembering',
  Shar_Hatvuna: 'The Gate of Discerning',
  Shar_Hatorah: 'The Gate of Torah',
  Chasimas_Hasefer: 'Epilogue',
  x: null,
};

const schedule = [
  [[1, Tishrei], [1, Tishrei], Book1, Hakdamah, 1, 2],
  [[2, Tishrei], [2, Tishrei], Book1, Hakdamah, 3, 4],
  [[3, Tishrei], [3, Tishrei], Book1, Hakdamah, 5, 6],
  [[4, Tishrei], [4, Tishrei], Book1, Hakdamah, 7, 13],
  [[5, Tishrei], [5, Tishrei], Book1, Hakdamah, 14, 15],
  [[6, Tishrei], [6, Tishrei], Book1, Hakdamah, 16],
  [[7, Tishrei], [7, Tishrei], Book1, Hakdamah, 17],
  [[8, Tishrei], [8, Tishrei], Book1, Hakdamah, 18, 20],
  [[9, Tishrei], [9, Tishrei], Book1, Hakdamah, 21, 22],
  [[10, Tishrei], [10, Tishrei], Book1, Hakdamah, 23, 24],
  [[11, Tishrei], [11, Tishrei], Book1, Shar_Hazechira, 1.1, 1.4],
  [[12, Tishrei], [12, Tishrei], Book1, Shar_Hazechira, 1.5, 1.6],
  [[13, Tishrei], [13, Tishrei], Book1, Shar_Hazechira, 1.7],
  [[14, Tishrei], [14, Tishrei], Book1, Shar_Hazechira, 2.1, 2.5],
  [[15, Tishrei], [15, Tishrei], Book1, Shar_Hazechira, 2.6, 2.8],
  [[15, Tishrei], [16, Tishrei], Book1, Shar_Hazechira, 2.9],
  [[16, Tishrei], [17, Tishrei], Book1, Shar_Hazechira, '2.10', 2.11],
  [[16, Tishrei], [18, Tishrei], Book1, Shar_Hazechira, 2.12],
  [[17, Tishrei], [19, Tishrei], Book1, Shar_Hazechira, 2.13, 2.14],
  [[18, Tishrei], [20, Tishrei], Book1, Shar_Hazechira, 3.1, 3.5],
  [[18, Tishrei], [21, Tishrei], Book1, Shar_Hazechira, 3.6],
  [[19, Tishrei], [22, Tishrei], Book1, Shar_Hazechira, 3.7, 3.8],
  [[20, Tishrei], [23, Tishrei], Book1, Shar_Hazechira, 4.1, 4.2],
  [[20, Tishrei], [24, Tishrei], Book1, Shar_Hazechira, 4.3, 4.4],
  [[21, Tishrei], [25, Tishrei], Book1, Shar_Hazechira, 4.5, 4.6],
  [[22, Tishrei], [26, Tishrei], Book1, Shar_Hazechira, 4.7, 4.9],
  [[23, Tishrei], [27, Tishrei], Book1, Shar_Hazechira, '4.10', 4.16],
  [[24, Tishrei], [28, Tishrei], Book1, Shar_Hazechira, 4.17, 4.19],
  [[25, Tishrei], [29, Tishrei], Book1, Shar_Hazechira, 5.1, 5.4],
  [[26, Tishrei], [30, Tishrei], Book1, Shar_Hazechira, 5.5, 5.6],
  [[27, Tishrei], [1, Cheshvan], Book1, Shar_Hazechira, 5.7],
  [[27, Tishrei], [2, Cheshvan], Book1, Shar_Hazechira, 5.8, '5.10'],
  [[28, Tishrei], [3, Cheshvan], Book1, Shar_Hazechira, 6.1, 6.4],
  [[29, Tishrei], [4, Cheshvan], Book1, Shar_Hazechira, 6.5, 6.6],
  [[29, Tishrei], [5, Cheshvan], Book1, Shar_Hazechira, 6.7, 6.9],
  [[30, Tishrei], [6, Cheshvan], Book1, Shar_Hazechira, '6.10'],
  [[1, Cheshvan], [7, Cheshvan], Book1, Shar_Hazechira, 7.1, 7.7],
  [[2, Cheshvan], [8, Cheshvan], Book1, Shar_Hazechira, 7.8, 7.11],
  [[3, Cheshvan], [9, Cheshvan], Book1, Shar_Hazechira, 7.12, 7.15],
  [[4, Cheshvan], [10, Cheshvan], Book1, Shar_Hazechira, 7.16, 7.17],
  [[5, Cheshvan], [11, Cheshvan], Book1, Shar_Hazechira, 7.18, 7.19],
  [[6, Cheshvan], [12, Cheshvan], Book1, Shar_Hazechira, 8.1, 8.4],
  [[7, Cheshvan], [13, Cheshvan], Book1, Shar_Hazechira, 8.5],
  [[7, Cheshvan], [14, Cheshvan], Book1, Shar_Hazechira, 8.6],
  [[8, Cheshvan], [15, Cheshvan], Book1, Shar_Hazechira, 8.7, 8.9],
  [[9, Cheshvan], [16, Cheshvan], Book1, Shar_Hazechira, '8.10', 8.13],
  [[10, Cheshvan], [17, Cheshvan], Book1, Shar_Hazechira, 9.1, 9.4],
  [[11, Cheshvan], [18, Cheshvan], Book1, Shar_Hazechira, 9.5],
  [[12, Cheshvan], [19, Cheshvan], Book1, Shar_Hazechira, 9.6, 9.7],
  [[13, Cheshvan], [20, Cheshvan], Book1, Shar_Hazechira, 10.1, 10.2],
  [[14, Cheshvan], [21, Cheshvan], Book1, Shar_Hazechira, 10.3],
  [[15, Cheshvan], [22, Cheshvan], Book1, Shar_Hazechira, 10.4, 10.6],
  [[16, Cheshvan], [23, Cheshvan], Book1, Shar_Hazechira, 11.1, 11.2],
  [[16, Cheshvan], [24, Cheshvan], Book1, Shar_Hazechira, 11.3, 11.6],
  [[17, Cheshvan], [25, Cheshvan], Book1, Shar_Hazechira, 11.7, 11.9],
  [[18, Cheshvan], [26, Cheshvan], Book1, Shar_Hazechira, '11.10'],
  [[19, Cheshvan], [27, Cheshvan], Book1, Shar_Hazechira, 11.11],
  [[20, Cheshvan], [28, Cheshvan], Book1, Shar_Hazechira, 11.12, 11.15],
  [[21, Cheshvan], [29, Cheshvan], Book1, Shar_Hazechira, 12.1, 12.3],
  [[22, Cheshvan], [30, Cheshvan], Book1, Shar_Hazechira, 12.4],
  [[23, Cheshvan], [1, Kislev], Book1, Shar_Hazechira, 12.5, 12.6],
  [[24, Cheshvan], [2, Kislev], Book1, Shar_Hazechira, 13.1, 13.3],
  [[25, Cheshvan], [3, Kislev], Book1, Shar_Hazechira, 13.4],
  [[26, Cheshvan], [4, Kislev], Book1, Shar_Hazechira, 13.5],
  [[27, Cheshvan], [5, Kislev], Book1, Shar_Hazechira, 13.6, 13.7],
  [[28, Cheshvan], [6, Kislev], Book1, Shar_Hazechira, 14.1, 14.2],
  [[29, Cheshvan], [7, Kislev], Book1, Shar_Hazechira, 14.3, 14.4],
  [[30, Cheshvan], [8, Kislev], Book1, Shar_Hazechira, 14.5],
  [[1, Kislev], [9, Kislev], Book1, Shar_Hazechira, 15.1, 15.3],
  [[2, Kislev], [10, Kislev], Book1, Shar_Hazechira, 15.4, 15.7],
  [[3, Kislev], [11, Kislev], Book1, Shar_Hazechira, 15.8, '15.10'],
  [[3, Kislev], [12, Kislev], Book1, Shar_Hazechira, 15.11],
  [[4, Kislev], [13, Kislev], Book1, Shar_Hazechira, 15.12, 15.15],
  [[5, Kislev], [14, Kislev], Book1, Shar_Hazechira, 16.1, 16.2],
  [[6, Kislev], [15, Kislev], Book1, Shar_Hazechira, 16.3, 16.4],
  [[7, Kislev], [16, Kislev], Book1, Shar_Hazechira, 16.5],
  [[8, Kislev], [17, Kislev], Book1, Shar_Hazechira, 16.6],
  [[9, Kislev], [18, Kislev], Book1, Shar_Hazechira, 16.7],
  [[10, Kislev], [19, Kislev], Book1, Shar_Hazechira, 17.1, 17.2],
  [[10, Kislev], [20, Kislev], Book1, Shar_Hazechira, 17.3],
  [[11, Kislev], [21, Kislev], Book1, Shar_Hazechira, 17.4, 17.6],
  [[12, Kislev], [22, Kislev], Book1, Shar_Hazechira, 17.7],
  [[13, Kislev], [23, Kislev], Book1, Shar_Hatvuna, 1.1, 1.2],
  [[14, Kislev], [24, Kislev], Book1, Shar_Hatvuna, 1.3],
  [[15, Kislev], [25, Kislev], Book1, Shar_Hatvuna, 1.4],
  [[16, Kislev], [26, Kislev], Book1, Shar_Hatvuna, 2.1, 2.2],
  [[17, Kislev], [27, Kislev], Book1, Shar_Hatvuna, 2.3],
  [[18, Kislev], [28, Kislev], Book1, Shar_Hatvuna, 2.4],
  [[19, Kislev], [29, Kislev], Book1, Shar_Hatvuna, 2.5],
  [[20, Kislev], [30, Kislev], Book1, Shar_Hatvuna, 2.6, '2.10'],
  [[21, Kislev], [1, Teves], Book1, Shar_Hatvuna, 3.1, 3.2],
  [[22, Kislev], [2, Teves], Book1, Shar_Hatvuna, 3.3],
  [[23, Kislev], [3, Teves], Book1, Shar_Hatvuna, 3.4, 3.5],
  [[24, Kislev], [4, Teves], Book1, Shar_Hatvuna, 3.6],
  [[25, Kislev], [5, Teves], Book1, Shar_Hatvuna, 3.7, 3.8],
  [[26, Kislev], [6, Teves], Book1, Shar_Hatvuna, 4.1, 4.3],
  [[27, Kislev], [7, Teves], Book1, Shar_Hatvuna, 4.4],
  [[28, Kislev], [8, Teves], Book1, Shar_Hatvuna, 4.5, 4.6],
  [[29, Kislev], [9, Teves], Book1, Shar_Hatvuna, 5.1, 5.2],
  [[30, Kislev], [10, Teves], Book1, Shar_Hatvuna, 5.3, 5.4],
  [[1, Teves], [11, Teves], Book1, Shar_Hatvuna, 5.5, 5.6],
  [[2, Teves], [12, Teves], Book1, Shar_Hatvuna, 6.1, 6.5],
  [[3, Teves], [13, Teves], Book1, Shar_Hatvuna, 6.6],
  [[4, Teves], [14, Teves], Book1, Shar_Hatvuna, 6.7, 6.8],
  [[5, Teves], [15, Teves], Book1, Shar_Hatvuna, 6.9, 6.13],
  [[6, Teves], [16, Teves], Book1, Shar_Hatvuna, 7.1, 7.2],
  [[7, Teves], [17, Teves], Book1, Shar_Hatvuna, 7.3, 7.5],
  [[8, Teves], [18, Teves], Book1, Shar_Hatvuna, 7.6, 7.9],
  [[9, Teves], [19, Teves], Book1, Shar_Hatvuna, '7.10', 7.11],
  [[10, Teves], [20, Teves], Book1, Shar_Hatvuna, 7.12],
  [[11, Teves], [21, Teves], Book1, Shar_Hatvuna, 8.1, 8.3],
  [[12, Teves], [22, Teves], Book1, Shar_Hatvuna, 8.4, 8.5],
  [[13, Teves], [23, Teves], Book1, Shar_Hatvuna, 8.6, 8.7],
  [[14, Teves], [24, Teves], Book1, Shar_Hatvuna, 8.8, 8.9],
  [[15, Teves], [25, Teves], Book1, Shar_Hatvuna, '8.10', 8.12],
  [[16, Teves], [26, Teves], Book1, Shar_Hatvuna, 8.13],
  [[17, Teves], [27, Teves], Book1, Shar_Hatvuna, 9.1, 9.2],
  [[18, Teves], [28, Teves], Book1, Shar_Hatvuna, 9.3],
  [[19, Teves], [29, Teves], Book1, Shar_Hatvuna, 9.4],
  [[20, Teves], [1, Shvat], Book1, Shar_Hatvuna, 9.5, 9.6],
  [[21, Teves], [2, Shvat], Book1, Shar_Hatvuna, 10.1, 10.3],
  [[22, Teves], [3, Shvat], Book1, Shar_Hatvuna, 10.4],
  [[23, Teves], [4, Shvat], Book1, Shar_Hatvuna, 10.5],
  [[24, Teves], [5, Shvat], Book1, Shar_Hatvuna, 10.6],
  [[25, Teves], [6, Shvat], Book1, Shar_Hatvuna, 11.1, 11.2],
  [[26, Teves], [7, Shvat], Book1, Shar_Hatvuna, 11.3, 11.4],
  [[27, Teves], [8, Shvat], Book1, Shar_Hatvuna, 11.5, 11.7],
  [[28, Teves], [9, Shvat], Book1, Shar_Hatvuna, 12.1, 12.2],
  [[29, Teves], [10, Shvat], Book1, Shar_Hatvuna, 12.3],
  [[1, Shvat], [11, Shvat], Book1, Shar_Hatvuna, 12.4],
  [[2, Shvat], [12, Shvat], Book1, Shar_Hatvuna, 12.5, 12.6],
  [[3, Shvat], [13, Shvat], Book1, Shar_Hatvuna, 13.1, 13.2],
  [[4, Shvat], [14, Shvat], Book1, Shar_Hatvuna, 13.3, 13.4],
  [[5, Shvat], [15, Shvat], Book1, Shar_Hatvuna, 13.5],
  [[5, Shvat], [16, Shvat], Book1, Shar_Hatvuna, 13.6],
  [[6, Shvat], [17, Shvat], Book1, Shar_Hatvuna, 13.7, 13.8],
  [[7, Shvat], [18, Shvat], Book1, Shar_Hatvuna, 13.9],
  [[8, Shvat], [19, Shvat], Book1, Shar_Hatvuna, '13.10'],
  [[9, Shvat], [20, Shvat], Book1, Shar_Hatvuna, 13.11, 13.13],
  [[10, Shvat], [21, Shvat], Book1, Shar_Hatvuna, 14.1, 14.3],
  [[11, Shvat], [22, Shvat], Book1, Shar_Hatvuna, 14.4],
  [[12, Shvat], [23, Shvat], Book1, Shar_Hatvuna, 14.5, 14.6],
  [[13, Shvat], [24, Shvat], Book1, Shar_Hatvuna, 14.7, 14.8],
  [[14, Shvat], [25, Shvat], Book1, Shar_Hatvuna, 15.1, 15.3],
  [[15, Shvat], [26, Shvat], Book1, Shar_Hatvuna, 15.4, 15.5],
  [[16, Shvat], [27, Shvat], Book1, Shar_Hatvuna, 15.6],
  [[17, Shvat], [28, Shvat], Book1, Shar_Hatvuna, 16.1, 16.3],
  [[18, Shvat], [29, Shvat], Book1, Shar_Hatvuna, 16.4, 16.8],
  [[19, Shvat], [30, Shvat], Book1, Shar_Hatvuna, 16.9, 16.11],
  [[20, Shvat], [1, Adar1], Book1, Shar_Hatvuna, 16.12],
  [[21, Shvat], [2, Adar1], Book1, Shar_Hatvuna, 16.13],
  [[22, Shvat], [3, Adar1], Book1, Shar_Hatvuna, 16.14, 16.15],
  [[23, Shvat], [4, Adar1], Book1, Shar_Hatvuna, 17.1, 17.4],
  [[23, Shvat], [5, Adar1], Book1, Shar_Hatvuna, 17.5, 17.6],
  [[24, Shvat], [6, Adar1], Book1, Shar_Hatvuna, 17.7, 17.9],
  [[25, Shvat], [7, Adar1], Book1, Shar_Hatvuna, '17.10'],
  [[26, Shvat], [8, Adar1], Book1, Shar_Hatvuna, 17.11, 17.12],
  [[27, Shvat], [9, Adar1], Book1, Shar_Hatorah, 1.1, 1.3],
  [[28, Shvat], [10, Adar1], Book1, Shar_Hatorah, 1.4],
  [[29, Shvat], [11, Adar1], Book1, Shar_Hatorah, 1.5, 1.7],
  [[30, Shvat], [12, Adar1], Book1, Shar_Hatorah, 1.8, 1.9],
  [[1, Adar], [13, Adar1], Book1, Shar_Hatorah, '1.10'],
  [[2, Adar], [14, Adar1], Book1, Shar_Hatorah, 1.11, 1.12],
  [[3, Adar], [15, Adar1], Book1, Shar_Hatorah, 1.13],
  [[4, Adar], [16, Adar1], Book1, Shar_Hatorah, 1.14, 1.16],
  [[5, Adar], [17, Adar1], Book1, Shar_Hatorah, 2.1, 2.3],
  [[6, Adar], [18, Adar1], Book1, Shar_Hatorah, 2.4, 2.9],
  [[7, Adar], [19, Adar1], Book1, Shar_Hatorah, '2.10'],
  [[8, Adar], [20, Adar1], Book1, Shar_Hatorah, 2.11],
  [[9, Adar], [21, Adar1], Book1, Shar_Hatorah, 2.12, 2.16],
  [[10, Adar], [22, Adar1], Book1, Shar_Hatorah, 2.17, 2.19],
  [[10, Adar], [23, Adar1], Book1, Shar_Hatorah, '2.20', 2.23],
  [[11, Adar], [24, Adar1], Book1, Shar_Hatorah, 2.24, 2.25],
  [[11, Adar], [25, Adar1], Book1, Shar_Hatorah, 2.26, 2.27],
  [[12, Adar], [26, Adar1], Book1, Shar_Hatorah, 3.1, 3.3],
  [[13, Adar], [27, Adar1], Book1, Shar_Hatorah, 3.4, 3.6],
  [[13, Adar], [28, Adar1], Book1, Shar_Hatorah, 3.7],
  [[14, Adar], [29, Adar1], Book1, Shar_Hatorah, 3.8],
  [[15, Adar], [30, Adar1], Book1, Shar_Hatorah, 3.9, 3.12],
  [[16, Adar], [1, Adar2], Book1, Shar_Hatorah, 3.13, 3.14],
  [[17, Adar], [2, Adar2], Book1, Shar_Hatorah, 3.15],
  [[18, Adar], [3, Adar2], Book1, Shar_Hatorah, 3.16, 3.19],
  [[19, Adar], [4, Adar2], Book1, Shar_Hatorah, 4.1, 4.3],
  [[20, Adar], [5, Adar2], Book1, Shar_Hatorah, 4.4, 4.5],
  [[21, Adar], [6, Adar2], Book1, Shar_Hatorah, 4.6, 4.7],
  [[22, Adar], [7, Adar2], Book1, Shar_Hatorah, 4.8, 4.11],
  [[23, Adar], [8, Adar2], Book1, Shar_Hatorah, 4.12, 4.16],
  [[24, Adar], [9, Adar2], Book1, Shar_Hatorah, 4.17, 4.19],
  [[25, Adar], [10, Adar2], Book1, Shar_Hatorah, '4.20', 4.25],
  [[26, Adar], [11, Adar2], Book1, Shar_Hatorah, 4.26],
  [[27, Adar], [12, Adar2], Book1, Shar_Hatorah, 4.27, 4.29],
  [[28, Adar], [13, Adar2], Book1, Shar_Hatorah, 5.1, 5.2],
  [[29, Adar], [14, Adar2], Book1, Shar_Hatorah, 5.3, 5.4],
  [[1, Nisan], [15, Adar2], Book1, Shar_Hatorah, 5.5],
  [[2, Nisan], [16, Adar2], Book1, Shar_Hatorah, 5.6, 5.8],
  [[3, Nisan], [17, Adar2], Book1, Shar_Hatorah, 5.9, 5.11],
  [[4, Nisan], [18, Adar2], Book1, Shar_Hatorah, 5.12, 5.13],
  [[5, Nisan], [19, Adar2], Book1, Shar_Hatorah, 5.14, 5.15],
  [[6, Nisan], [20, Adar2], Book1, Shar_Hatorah, 5.16, 5.17],
  [[7, Nisan], [21, Adar2], Book1, Shar_Hatorah, 6.1, 6.3],
  [[8, Nisan], [22, Adar2], Book1, Shar_Hatorah, 6.4, 6.5],
  [[9, Nisan], [23, Adar2], Book1, Shar_Hatorah, 6.6, 6.9],
  [[10, Nisan], [24, Adar2], Book1, Shar_Hatorah, '6.10', 6.14],
  [[11, Nisan], [25, Adar2], Book1, Shar_Hatorah, 6.15, 6.16],
  [[12, Nisan], [26, Adar2], Book1, Shar_Hatorah, 7.1, 7.2],
  [[13, Nisan], [27, Adar2], Book1, Shar_Hatorah, 7.3, 7.4],
  [[14, Nisan], [28, Adar2], Book1, Shar_Hatorah, 7.5, 7.6],
  [[15, Nisan], [29, Adar2], Book1, Shar_Hatorah, 7.7, 7.8],
  [[16, Nisan], [1, Nisan], Book1, Shar_Hatorah, 7.9],
  [[17, Nisan], [2, Nisan], Book1, Shar_Hatorah, '7.10', 7.11],
  [[18, Nisan], [3, Nisan], Book1, Shar_Hatorah, 7.12, 7.14],
  [[19, Nisan], [4, Nisan], Book1, Shar_Hatorah, 7.15, 7.17],
  [[20, Nisan], [5, Nisan], Book1, Shar_Hatorah, 7.18],
  [[21, Nisan], [6, Nisan], Book1, Shar_Hatorah, 7.19],
  [[22, Nisan], [7, Nisan], Book1, Shar_Hatorah, 8.1, 8.3],
  [[23, Nisan], [8, Nisan], Book1, Shar_Hatorah, 8.4],
  [[24, Nisan], [9, Nisan], Book1, Shar_Hatorah, 8.5, 8.6],
  [[25, Nisan], [10, Nisan], Book1, Shar_Hatorah, 8.7],
  [[26, Nisan], [11, Nisan], Book1, Shar_Hatorah, 8.8],
  [[27, Nisan], [12, Nisan], Book1, Shar_Hatorah, 8.9, '8.10'],
  [[28, Nisan], [13, Nisan], Book1, Shar_Hatorah, 9.1, 9.5],
  [[29, Nisan], [14, Nisan], Book1, Shar_Hatorah, 9.6, 9.7],
  [[30, Nisan], [15, Nisan], Book1, Shar_Hatorah, 9.8, 9.11],
  [[1, Iyyar], [16, Nisan], Book1, Shar_Hatorah, 9.12],
  [[2, Iyyar], [17, Nisan], Book1, Shar_Hatorah, 9.13, 9.14],
  [[3, Iyyar], [18, Nisan], Book1, Shar_Hatorah, 9.15, 9.17],
  [[4, Iyyar], [19, Nisan], Book1, Shar_Hatorah, 10.1, 10.4],
  [[5, Iyyar], [20, Nisan], Book1, Shar_Hatorah, 10.5, 10.7],
  [[6, Iyyar], [21, Nisan], Book1, Shar_Hatorah, 10.8, 10.9],
  [[7, Iyyar], [22, Nisan], Book1, Shar_Hatorah, '10.10', 10.11],
  [[8, Iyyar], [23, Nisan], Book1, Epilogue, 1.1, 1.4],
  [[9, Iyyar], [24, Nisan], Book1, Epilogue, 1.5],
  [[10, Iyyar], [25, Nisan], Book1, Epilogue, 2.1, 2.4],
  [[11, Iyyar], [26, Nisan], Book1, Epilogue, 2.5],
  [[12, Iyyar], [27, Nisan], Book1, Epilogue, 3.1, 3.2],
  [[13, Iyyar], [28, Nisan], Book1, Epilogue, 3.3, 3.4],
  [[14, Iyyar], [29, Nisan], Book1, Epilogue, 3.5],
  [[15, Iyyar], [30, Nisan], Book1, Epilogue, 3.6],
  [[16, Iyyar], [1, Iyyar], Book1, Epilogue, 4.1, 4.3],
  [[17, Iyyar], [2, Iyyar], Book1, Epilogue, 4.4, 4.5],
  [[18, Iyyar], [3, Iyyar], Book1, Epilogue, 4.6, 4.8],
  [[19, Iyyar], [4, Iyyar], Book1, Epilogue, 5.1, 5.3],
  [[20, Iyyar], [5, Iyyar], Book1, Epilogue, 6.1, 6.2],
  [[21, Iyyar], [6, Iyyar], Book1, Epilogue, 6.3, 6.4],
  [[22, Iyyar], [7, Iyyar], Book1, Epilogue, 6.5, 6.6],
  [[23, Iyyar], [8, Iyyar], Book1, Epilogue, 6.7, 6.9],
  [[24, Iyyar], [9, Iyyar], Book1, Epilogue, '6.10', 6.11],
  [[25, Iyyar], [10, Iyyar], Book1, Epilogue, 7.1, 7.5],
  [[26, Iyyar], [11, Iyyar], Book1, Epilogue, 7.6],
  [[27, Iyyar], [12, Iyyar], Book1, Epilogue, 7.7, 7.8],
  [[28, Iyyar], [13, Iyyar], Book1, Epilogue, 7.9],
  [[29, Iyyar], [14, Iyyar], Book1, Epilogue, '7.10'],
  [[1, Sivan], [15, Iyyar], Book1, Epilogue, 7.11],
  [[2, Sivan], [16, Iyyar], Book1, Epilogue, 7.12, 7.13],
  [[3, Sivan], [17, Iyyar], Book2, Chapters, 1.1, 1.2],
  [[4, Sivan], [18, Iyyar], Book2, Chapters, 1.3, 1.5],
  [[5, Sivan], [19, Iyyar], Book2, Chapters, 1.6, 1.7],
  [[6, Sivan], [20, Iyyar], Book2, Chapters, 1.8],
  [[7, Sivan], [21, Iyyar], Book2, Chapters, 2.1, 2.4],
  [[8, Sivan], [22, Iyyar], Book2, Chapters, 2.5, 2.6],
  [[9, Sivan], [23, Iyyar], Book2, Chapters, 2.7],
  [[10, Sivan], [24, Iyyar], Book2, Chapters, 2.8],
  [[10, Sivan], [25, Iyyar], Book2, Chapters, 2.9],
  [[11, Sivan], [26, Iyyar], Book2, Chapters, '2.10'],
  [[12, Sivan], [27, Iyyar], Book2, Chapters, 2.11],
  [[13, Sivan], [28, Iyyar], Book2, Chapters, 3.1, 3.2],
  [[14, Sivan], [29, Iyyar], Book2, Chapters, 3.3, 3.4],
  [[15, Sivan], [1, Sivan], Book2, Chapters, 3.5, 3.6],
  [[16, Sivan], [2, Sivan], Book2, Chapters, 3.7],
  [[17, Sivan], [3, Sivan], Book2, Chapters, 4.1, 4.5],
  [[18, Sivan], [4, Sivan], Book2, Chapters, 4.6, 4.7],
  [[19, Sivan], [5, Sivan], Book2, Chapters, 5.1, 5.3],
  [[20, Sivan], [6, Sivan], Book2, Chapters, 5.4, 5.5],
  [[21, Sivan], [7, Sivan], Book2, Chapters, 5.6, 5.7],
  [[22, Sivan], [8, Sivan], Book2, Chapters, 6.1, 6.3],
  [[23, Sivan], [9, Sivan], Book2, Chapters, 6.4, 6.5],
  [[24, Sivan], [10, Sivan], Book2, Chapters, 7.1, 7.3],
  [[25, Sivan], [11, Sivan], Book2, Chapters, 7.4],
  [[25, Sivan], [12, Sivan], Book2, Chapters, 7.5, 7.6],
  [[26, Sivan], [13, Sivan], Book2, Chapters, 7.7, 7.9],
  [[27, Sivan], [14, Sivan], Book2, Chapters, 8.1, 8.3],
  [[28, Sivan], [15, Sivan], Book2, Chapters, 8.4, 8.5],
  [[29, Sivan], [16, Sivan], Book2, Chapters, 8.6, 8.7],
  [[30, Sivan], [17, Sivan], Book2, Chapters, 8.8],
  [[1, Tamuz], [18, Sivan], Book2, Chapters, 9.1, 9.5],
  [[2, Tamuz], [19, Sivan], Book2, Chapters, 9.6, 9.7],
  [[3, Tamuz], [20, Sivan], Book2, Chapters, 9.8, '9.10'],
  [[4, Tamuz], [21, Sivan], Book2, Chapters, 10.1, 10.4],
  [[5, Tamuz], [22, Sivan], Book2, Chapters, 11.1, 11.3],
  [[5, Tamuz], [23, Sivan], Book2, Chapters, 11.4, 11.6],
  [[6, Tamuz], [24, Sivan], Book2, Chapters, 11.7, 11.8],
  [[7, Tamuz], [25, Sivan], Book2, Chapters, 11.9, '11.10'],
  [[8, Tamuz], [26, Sivan], Book2, Chapters, 11.11, 11.12],
  [[9, Tamuz], [27, Sivan], Book2, Chapters, 11.13],
  [[10, Tamuz], [28, Sivan], Book2, Chapters, 11.14, 11.17],
  [[11, Tamuz], [29, Sivan], Book2, Chapters, 11.18, 11.19],
  [[12, Tamuz], [30, Sivan], Book2, Chapters, '11.20', 11.21],
  [[13, Tamuz], [1, Tamuz], Book2, Chapters, 11.22, 11.25],
  [[14, Tamuz], [2, Tamuz], Book2, Chapters, 12.1, 12.3],
  [[15, Tamuz], [3, Tamuz], Book2, Chapters, 12.4],
  [[16, Tamuz], [4, Tamuz], Book2, Chapters, 12.5],
  [[17, Tamuz], [5, Tamuz], Book2, Chapters, 12.6],
  [[18, Tamuz], [6, Tamuz], Book2, Chapters, 12.7],
  [[18, Tamuz], [7, Tamuz], Book2, Chapters, 12.8],
  [[19, Tamuz], [8, Tamuz], Book2, Chapters, 12.9, '12.10'],
  [[19, Tamuz], [9, Tamuz], Book2, Chapters, 12.11],
  [[20, Tamuz], [10, Tamuz], Book2, Chapters, 13.1, 13.4],
  [[21, Tamuz], [11, Tamuz], Book2, Chapters, 13.5, 13.7],
  [[22, Tamuz], [12, Tamuz], Book2, Chapters, 13.8, 13.13],
  [[23, Tamuz], [13, Tamuz], Book2, Chapters, 14.1, 14.4],
  [[24, Tamuz], [14, Tamuz], Book2, Chapters, 14.5, 14.7],
  [[25, Tamuz], [15, Tamuz], Book2, Chapters, 15.1, 15.3],
  [[26, Tamuz], [16, Tamuz], Book2, Chapters, 15.4, 15.6],
  [[27, Tamuz], [17, Tamuz], Book2, Chapters, 15.7, 15.8],
  [[28, Tamuz], [18, Tamuz], Book2, Chapters, 16.1, 16.4],
  [[29, Tamuz], [19, Tamuz], Book2, Chapters, 16.5],
  [[29, Tamuz], [20, Tamuz], Book2, Chapters, 16.6, '16.10'],
  [[1, Av], [21, Tamuz], Book2, Chapters, 16.11, 16.12],
  [[2, Av], [22, Tamuz], Book2, Chapters, 16.13],
  [[3, Av], [23, Tamuz], Book2, Chapters, 16.14],
  [[3, Av], [24, Tamuz], Book2, Chapters, 16.15],
  [[4, Av], [25, Tamuz], Book2, Chapters, 17.1, 17.2],
  [[5, Av], [26, Tamuz], Book2, Chapters, 17.3],
  [[6, Av], [27, Tamuz], Book2, Chapters, 17.4],
  [[6, Av], [28, Tamuz], Book2, Chapters, 17.5],
  [[7, Av], [29, Tamuz], Book2, Chapters, 18.1, 18.7],
  [[8, Av], [1, Av], Book2, Chapters, 19.1, 19.2],
  [[9, Av], [2, Av], Book2, Chapters, 19.3, 19.4],
  [[10, Av], [3, Av], Book2, Chapters, 19.5, 19.6],
  [[11, Av], [4, Av], Book2, Chapters, 19.7, 19.8],
  [[12, Av], [5, Av], Book2, Chapters, 19.9, '19.10'],
  [[13, Av], [6, Av], Book2, Chapters, 19.11, 19.12],
  // this footnote is not a separate rule like some of them are. It may be easier if Sefaria adds it as its own rule
  [[14, Av], [7, Av], Book2, Chapters, '19.Footnote_in_11'],
  [[15, Av], [8, Av], Book2, Chapters, 19.12, 19.14],
  [[15, Av], [9, Av], Book2, Chapters, 19.15],
  [[16, Av], [10, Av], Book2, Chapters, 20.1, 20.4],
  [[17, Av], [11, Av], Book2, Chapters, 20.5, 20.6],
  [[18, Av], [12, Av], Book2, Chapters, 21.1, 21.4],
  [[19, Av], [13, Av], Book2, Chapters, 21.5, '21.10'],
  [[20, Av], [14, Av], Book2, Chapters, 21.11, 21.13],
  [[21, Av], [15, Av], Book2, Chapters, 21.14],
  [[22, Av], [16, Av], Book2, Chapters, 21.15],
  [[23, Av], [17, Av], Book2, Chapters, 22.1, 22.3],
  [[24, Av], [18, Av], Book2, Chapters, 22.4],
  [[25, Av], [19, Av], Book2, Chapters, 22.5, 22.6],
  [[26, Av], [20, Av], Book2, Chapters, 23.1, 23.2],
  [[27, Av], [21, Av], Book2, Chapters, 23.3],
  [[27, Av], [22, Av], Book2, Chapters, 23.4, 23.5],
  [[28, Av], [23, Av], Book2, Chapters, 24.1, 24.3],
  [[29, Av], [24, Av], Book2, Chapters, 25.1, 25.3],
  [[30, Av], [25, Av], Book2, Chapters, 26.1, 26.4],
  [[1, Elul], [26, Av], Book2, Chapters, 26.5],
  [[2, Elul], [27, Av], Book2, Chapters, 26.6, 26.11],
  [[3, Elul], [28, Av], Book2, Chapters, 27.1, 27.2],
  [[4, Elul], [29, Av], Book2, Chapters, 27.3],
  [[4, Elul], [30, Av], Book2, Chapters, 27.4],
  [[5, Elul], [1, Elul], Book2, Chapters, 27.5],
  [[6, Elul], [2, Elul], Book2, Chapters, 27.6, 27.7],
  [[7, Elul], [3, Elul], Book2, Chapters, 28.1, 28.2],
  [[8, Elul], [4, Elul], Book2, Chapters, 28.3],
  [[9, Elul], [5, Elul], Book2, Chapters, 29.1, 29.8],
  [[10, Elul], [6, Elul], Book2, Chapters, 29.9, 29.13],
  [[11, Elul], [7, Elul], Book2, Chapters, 29.14, 29.16],
  [[12, Elul], [8, Elul], Book2, Chapters, 29.17],
  [[13, Elul], [9, Elul], Book2, Chapters, 29.18, '29.20'],
  [[14, Elul], [10, Elul], Book2, Chapters, 30.1, 30.5],
  [[15, Elul], [11, Elul], Book2, Chapters, 30.6, 30.9],
  [[16, Elul], [12, Elul], Book2, Chapters, '30.10', 30.12],
  [[17, Elul], [13, Elul], Book2, Chapters, 30.13, 30.14],
  [[18, Elul], [14, Elul], Book2, Chapters, 30.15, 30.16],
  [[19, Elul], [15, Elul], Book2, Chapters, 30.17],
  [[19, Elul], [16, Elul], Book2, Chapters, 30.18, '30.20'],
  [[20, Elul], [17, Elul], Book2, Epilogue, 1.1, 1.2],
  [[21, Elul], [18, Elul], Book2, Epilogue, 1.3],
  [[22, Elul], [19, Elul], Book2, Epilogue, 1.4, 1.6],
  [[23, Elul], [20, Elul], Book2, Epilogue, 1.7],
  [[23, Elul], [21, Elul], Book2, Epilogue, 1.8],
  [[24, Elul], [22, Elul], Book2, Epilogue, 1.9, 1.12],
  [[25, Elul], [23, Elul], Book2, Epilogue, 1.13, 1.16],
  [[26, Elul], [24, Elul], Book2, Epilogue, 1.17],
  [[26, Elul], [25, Elul], Book2, Epilogue, 1.18],
  [[26, Elul], [26, Elul], Book2, Epilogue, 1.19],
  [[27, Elul], [27, Elul], Book2, Epilogue, 2.1, 2.2],
  [[28, Elul], [28, Elul], Book2, Epilogue, 3.1, 3.4],
  // 3 and on was written as an additive for previous discussions in Sefer Chofetz Chaim and Shmiras Halashon
  [[29, Elul], [29, Elul], Book2, Epilogue, 4.1, 4.2],
];

/**
 * Looks up Sefer Shemirat HaLashon Calendar for date
 * @param {HDate} hdate
 * @return {any}
 */
export function shemiratHaLashon(hdate) {
  if (!HDate.isHDate(hdate)) {
    throw new TypeError(`Invalid date: ${hdate}`);
  }
  const cday = hdate.abs();
  if (cday < shemiratHaLashonStart) {
    throw new RangeError(`Date ${hdate} too early; Sefer Shemirat HaLashon cycle began on ${startDate}`);
  }

  const day = hdate.getDate();
  const month = hdate.getMonth();
  const isLeapYear = hdate.isLeapYear();
  const result = lookupReading(day, month, isLeapYear);

  // check for 29th of Kislev or Cheshvan
  const year = hdate.getFullYear();
  if (day === 29 &&
      ((month === Kislev && HDate.shortKislev(year)) ||
       (month === Cheshvan && !HDate.longCheshvan(year)))) {
    const extra = lookupReading(30, month, isLeapYear);
    result.e = extra.e;
  }
  return result;
}

/**
 * @private
 * @param {number} day
 * @param {number} month
 * @param {boolean} isLeapYear
 * @return {any}
 */
function lookupReading(day, month, isLeapYear) {
  const result = {};
  for (const reading of schedule) {
    const dates = reading[isLeapYear ? 1 : 0];
    const dd = dates[0];
    const mm = dates[1];
    if (dd === day && mm === month) {
      if (!result.k) {
        result.bk = reading[2]; // Book 1 or 2
        result.k = reading[3]; // section
        result.b = reading[4]; // begin
      }
      result.e = reading[5] || reading[4]; // end
    }
  }
  return result;
}

/**
 * Event wrapper around a Sefer Shemirat HaLashon instance
 */
export class ShemiratHaLashonEvent extends Event {
  /**
   * @param {HDate} date
   * @param {any} reading
   */
  constructor(date, reading) {
    const book = reading.bk === 1 ? 'Book I' : 'Book II';
    const section = reading.k === Chapters ? '' : `, ${reading.k}`;
    const desc = book + section + formatReadingPages(reading);
    super(date, desc, flags.USER_EVENT);
    this.reading = reading;
    this.memo = this.render('memo');
    this.alarm = false;
    this.category = 'Shemirat HaLashon';
  }
  /**
   * Returns name of reading
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const prefix = this.renderPrefix(locale);
    return prefix + formatReadingPages(this.reading);
  }

  /**
   * @private
   * @param {string} locale
   * @return {string}
   */
  renderPrefix(locale) {
    const reading = this.reading;
    const book = reading.bk === 1 ? 'Book I' : 'Book II';
    const section0 = reading.k.replace(/ /g, '_');
    const section = locale === 'memo' ? englishNames[section0] :
      reading.k === Chapters ? null : Locale.gettext(reading.k, locale);
    return section ? `${book}, ${section}` : book;
  }

  /**
   * Returns a link to sefaria.org
   *  e.g. https://www.sefaria.org/Shemirat_HaLashon%2C_Book_I%2C_The_Gate_of_Torah.4.2?lang=b
   * @return {string}
   */
  url() {
    const name = 'Shemirat HaLashon, ' + this.renderPrefix('memo') + '.' + this.reading.b;
    const urlName = encodeURIComponent(name.replace(/ /g, '_'));
    return `https://www.sefaria.org/${urlName}?lang=bi`;
  }
  /** @return {string[]} */
  getCategories() {
    return ['shemiratHaLashon'];
  }
}
