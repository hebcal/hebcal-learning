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

// Sefer Chofetz Chaim was published in 1873 CE
const startDate = new HDate(1, TISHREI, 5634);
export const chofetzChaimStart = startDate.abs();

const Hakdamah = 'Hakdamah';
const Psichah = 'Psichah';
const Lavin = 'Lavin';
const Asin = 'Asin';
const Arurin = 'Arurin';
export const HilchosLH = 'HilchosLH';
export const HilchosRechilus = 'HilchosRechilus';
export const Tziyurim = 'Tziyurim';

const intro = 'Introduction to the Laws of the Prohibition of Lashon Hara and Rechilut';
export const englishNames: Record<string, string> = {
  Hakdamah: 'Preface',
  Psichah: `${intro}, Opening Comments`,
  Lavin: `${intro}, Negative Commandments`,
  Asin: `${intro}, Positive Commandments`,
  Arurin: `${intro}, Curses`,
  HilchosLH: 'Part One, The Prohibition Against Lashon Hara',
  HilchosRechilus: 'Part Two, The Prohibition Against Rechilut',
  Tziyurim: 'Illustrations',
};

type Entry = [
  [number, number, number, number, number, number], // dates in years 1, 2 and 3
  string, // Book name
  (number | string)?, // begin chapter (absent when the whole section is read)
  (number | string | number[])?, // end chapter
  string?, // Hebrew incipit
  string?, // Hebrew explicit
];

const simple: Entry[] = [
  [[1, TISHREI, 1, SHVAT, 1, SIVAN], Hakdamah, 1, 4, 'ברוך ד׳', 'שכינתו בתוכנו'],
  [[2, TISHREI, 2, SHVAT, 2, SIVAN], Hakdamah, 5, 10, 'וכאשר נחפשה', 'מגדל העון'],
  [[3, TISHREI, 3, SHVAT, 3, SIVAN], Hakdamah, 11, 16, 'ונראה פשוט', 'לאין שעור'],
  [[4, TISHREI, 4, SHVAT, 4, SIVAN], Hakdamah, 17, 22, 'ואחשבה', 'בפנים הספר'],
  [[5, TISHREI, 5, SHVAT, 5, SIVAN], Hakdamah, 23, 27, 'על כן', 'צד הדי'],
  [[6, TISHREI, 6, SHVAT, 6, SIVAN], Hakdamah, 28, [33, 34], 'ואחלה להקורא', 'במהרה בימינו אמן'],
  [[7, TISHREI, 6, SHVAT, 6, SIVAN], Hakdamah, 29, 32, 'ואל יפלא', 'לעון כלל'],
  [[8, TISHREI, 7, SHVAT, 7, SIVAN], Psichah, 1, 4],
  [[9, TISHREI, 8, SHVAT, 8, SIVAN], Psichah, 5, 11],
  [[10, TISHREI, 9, SHVAT, 9, SIVAN], Lavin, 1, 2],
  [[11, TISHREI, 10, SHVAT, 10, SIVAN], Lavin, 3, 4],
  [[12, TISHREI, 11, SHVAT, 11, SIVAN], Lavin, 5, 6],
  [[13, TISHREI, 12, SHVAT, 12, SIVAN], Lavin, 7, 9],
  [[14, TISHREI, 13, SHVAT, 13, SIVAN], Lavin, 10, 11],
  [[15, TISHREI, 14, SHVAT, 14, SIVAN], Lavin, 12, 13],
  [[16, TISHREI, 15, SHVAT, 15, SIVAN], Lavin, 14, 15],
  [[17, TISHREI, 16, SHVAT, 16, SIVAN], Lavin, 16, 17],
  [[18, TISHREI, 17, SHVAT, 17, SIVAN], Asin, 1, 2],
  [[19, TISHREI, 18, SHVAT, 18, SIVAN], Asin, 3, 4],
  [[20, TISHREI, 19, SHVAT, 19, SIVAN], Asin, 5, 6],
  [[21, TISHREI, 20, SHVAT, 20, SIVAN], Asin, 7, 8],
  [[22, TISHREI, 21, SHVAT, 21, SIVAN], Asin, 9, 10],
  [[23, TISHREI, 22, SHVAT, 22, SIVAN], Asin, 11, 12],
  [[24, TISHREI, 23, SHVAT, 23, SIVAN], Asin, 13, 14],
  [[25, TISHREI, 24, SHVAT, 24, SIVAN], Arurin],
  [[26, TISHREI, 25, SHVAT, 25, SIVAN], HilchosLH, 1.1, 1.2],
  [[27, TISHREI, 26, SHVAT, 26, SIVAN], HilchosLH, 1.3, 1.4],
  [[28, TISHREI, 27, SHVAT, 27, SIVAN], HilchosLH, 1.5, 1.6],
  [[29, TISHREI, 28, SHVAT, 28, SIVAN], HilchosLH, 1.7, 1.9],
  [[30, TISHREI, 29, SHVAT, 29, SIVAN], HilchosLH, 2.1, 2.2],
  [[1, CHESHVAN, 30, SHVAT, 30, SIVAN], HilchosLH, 2.3, 2.4],
  [[2, CHESHVAN, 1, ADAR_I, 1, TAMUZ], HilchosLH, 2.5, 2.6],
  [[3, CHESHVAN, 2, ADAR_I, 2, TAMUZ], HilchosLH, 2.7, 2.8],
  [[4, CHESHVAN, 3, ADAR_I, 3, TAMUZ], HilchosLH, 2.9, '2.10'],
  [[5, CHESHVAN, 4, ADAR_I, 4, TAMUZ], HilchosLH, 2.11],
  [[6, CHESHVAN, 5, ADAR_I, 5, TAMUZ], HilchosLH, 2.12, 2.13],
  [[7, CHESHVAN, 6, ADAR_I, 6, TAMUZ], HilchosLH, 3.1, 3.2],
  [[8, CHESHVAN, 7, ADAR_I, 7, TAMUZ], HilchosLH, 3.3, 3.4],
  [[9, CHESHVAN, 8, ADAR_I, 8, TAMUZ], HilchosLH, 3.5, 3.6],
  [[10, CHESHVAN, 9, ADAR_I, 9, TAMUZ], HilchosLH, 3.7, 3.8],
  [[11, CHESHVAN, 10, ADAR_I, 10, TAMUZ], HilchosLH, 4.1, 4.2],
  [[12, CHESHVAN, 11, ADAR_I, 11, TAMUZ], HilchosLH, 4.3, 4.4],
  [[13, CHESHVAN, 12, ADAR_I, 12, TAMUZ], HilchosLH, 4.5, 4.6],
  [[14, CHESHVAN, 13, ADAR_I, 13, TAMUZ], HilchosLH, 4.7, 4.8],
  [[15, CHESHVAN, 14, ADAR_I, 14, TAMUZ], HilchosLH, 4.9, '4.10'],
  [[16, CHESHVAN, 15, ADAR_I, 15, TAMUZ], HilchosLH, 4.11],
  [[17, CHESHVAN, 16, ADAR_I, 16, TAMUZ], HilchosLH, 4.12, 5.1],
  [[18, CHESHVAN, 17, ADAR_I, 17, TAMUZ], HilchosLH, 5.2, 5.4],
  [[19, CHESHVAN, 18, ADAR_I, 18, TAMUZ], HilchosLH, 5.5, 5.6],
  [[20, CHESHVAN, 19, ADAR_I, 19, TAMUZ], HilchosLH, 5.7, 5.8],
  [[21, CHESHVAN, 20, ADAR_I, 20, TAMUZ], HilchosLH, 6.1, 6.2],
  [[22, CHESHVAN, 21, ADAR_I, 21, TAMUZ], HilchosLH, 6.3, 6.4],
  [[23, CHESHVAN, 22, ADAR_I, 22, TAMUZ], HilchosLH, 6.5, 6.6],
  [[24, CHESHVAN, 23, ADAR_I, 23, TAMUZ], HilchosLH, 6.7, 6.8],
  [[25, CHESHVAN, 24, ADAR_I, 24, TAMUZ], HilchosLH, 6.9, '6.10'],
  [[26, CHESHVAN, 25, ADAR_I, 25, TAMUZ], HilchosLH, 6.11, 6.12],
  [[27, CHESHVAN, 26, ADAR_I, 26, TAMUZ], HilchosLH, 7.1, 7.2],
  [[28, CHESHVAN, 27, ADAR_I, 27, TAMUZ], HilchosLH, 7.3, 7.4],
  [[29, CHESHVAN, 28, ADAR_I, 28, TAMUZ], HilchosLH, 7.5, 7.6],
  [[30, CHESHVAN, 29, ADAR_I, 29, TAMUZ], HilchosLH, 7.7, 7.8],
  [[1, KISLEV, 1, NISAN, 1, AV], HilchosLH, 7.9],
  [[2, KISLEV, 2, NISAN, 2, AV], HilchosLH, '7.10', 7.12],
  [[3, KISLEV, 3, NISAN, 3, AV], HilchosLH, 7.13, 7.14],
  [[4, KISLEV, 4, NISAN, 4, AV], HilchosLH, 8.1, 8.2],
  [[5, KISLEV, 5, NISAN, 5, AV], HilchosLH, 8.3, 8.4],
  [[6, KISLEV, 6, NISAN, 6, AV], HilchosLH, 8.5, 8.7],
  [[7, KISLEV, 7, NISAN, 7, AV], HilchosLH, 8.8, 8.9],
  [[8, KISLEV, 8, NISAN, 8, AV], HilchosLH, '8.10', 8.11],
  [[9, KISLEV, 9, NISAN, 9, AV], HilchosLH, 8.12],
  [[10, KISLEV, 10, NISAN, 10, AV], HilchosLH, 8.13, 8.14],
  [[11, KISLEV, 11, NISAN, 11, AV], HilchosLH, 9.1, 9.2],
  [[12, KISLEV, 12, NISAN, 12, AV], HilchosLH, 9.3, 9.4],
  [[13, KISLEV, 13, NISAN, 13, AV], HilchosLH, 9.5, 9.6],
  [[14, KISLEV, 14, NISAN, 14, AV], HilchosLH, 10.1, 10.2],
  [[15, KISLEV, 15, NISAN, 15, AV], HilchosLH, 10.3, 10.4],
  [[16, KISLEV, 16, NISAN, 16, AV], HilchosLH, 10.5, 10.6],
  [[17, KISLEV, 17, NISAN, 17, AV], HilchosLH, 10.7, 10.8],
  [[18, KISLEV, 18, NISAN, 18, AV], HilchosLH, 10.9, '10.10'],
  [[19, KISLEV, 19, NISAN, 19, AV], HilchosLH, 10.11, 10.12],
  [[20, KISLEV, 20, NISAN, 20, AV], HilchosLH, 10.13, 10.14],
  [[21, KISLEV, 21, NISAN, 21, AV], HilchosLH, 10.15, 10.16],
  [[22, KISLEV, 22, NISAN, 22, AV], HilchosLH, 10.17],
  [[23, KISLEV, 23, NISAN, 23, AV], HilchosRechilus, 1.1, 1.3],
  [[24, KISLEV, 24, NISAN, 24, AV], HilchosRechilus, 1.4, 1.5],
  [[25, KISLEV, 25, NISAN, 25, AV], HilchosRechilus, 1.6, 1.7],
  [[26, KISLEV, 26, NISAN, 26, AV], HilchosRechilus, 1.8, 1.9],
  [[27, KISLEV, 27, NISAN, 27, AV], HilchosRechilus, '1.10', 1.11],
  [[28, KISLEV, 28, NISAN, 28, AV], HilchosRechilus, 2.1, 2.2],
  [[29, KISLEV, 29, NISAN, 29, AV], HilchosRechilus, 2.3, 2.4],
  [[30, KISLEV, 30, NISAN, 30, AV], HilchosRechilus, 3.1],
  [[1, TEVET, 1, IYYAR, 1, ELUL], HilchosRechilus, 3.2, 3.4],
  [[2, TEVET, 2, IYYAR, 2, ELUL], HilchosRechilus, 4.1, 4.3],
  [[3, TEVET, 3, IYYAR, 3, ELUL], HilchosRechilus, 5.1, 5.2],
  [[4, TEVET, 4, IYYAR, 4, ELUL], HilchosRechilus, 5.3, 5.4],
  [[5, TEVET, 5, IYYAR, 5, ELUL], HilchosRechilus, 5.5],
  [[6, TEVET, 6, IYYAR, 6, ELUL], HilchosRechilus, 5.6, 5.7],
  [[7, TEVET, 7, IYYAR, 7, ELUL], HilchosRechilus, 6.1, 6.2],
  [[8, TEVET, 8, IYYAR, 8, ELUL], HilchosRechilus, 6.3, 6.4],
  [[9, TEVET, 9, IYYAR, 9, ELUL], HilchosRechilus, 6.5, 6.7],
  [[10, TEVET, 10, IYYAR, 10, ELUL], HilchosRechilus, 6.8, '6.10'],
  [[11, TEVET, 11, IYYAR, 11, ELUL], HilchosRechilus, 7.1],
  [[12, TEVET, 12, IYYAR, 12, ELUL], HilchosRechilus, 7.2],
  [[13, TEVET, 13, IYYAR, 13, ELUL], HilchosRechilus, 7.3, 7.4],
  [[14, TEVET, 14, IYYAR, 14, ELUL], HilchosRechilus, 7.5],
  [[15, TEVET, 15, IYYAR, 15, ELUL], HilchosRechilus, 8.1, 8.3],
  [[16, TEVET, 16, IYYAR, 16, ELUL], HilchosRechilus, 8.4, 8.5],
  [[17, TEVET, 17, IYYAR, 17, ELUL], HilchosRechilus, 9.1, 9.2],
  [[18, TEVET, 18, IYYAR, 18, ELUL], HilchosRechilus, 9.3, 9.4],
  [[19, TEVET, 19, IYYAR, 19, ELUL], HilchosRechilus, 9.5, 9.6],
  [[20, TEVET, 20, IYYAR, 20, ELUL], HilchosRechilus, 9.7, 9.9],
  [[21, TEVET, 21, IYYAR, 21, ELUL], HilchosRechilus, '9.10'],
  [[22, TEVET, 22, IYYAR, 22, ELUL], HilchosRechilus, 9.11, 9.12],
  [[23, TEVET, 23, IYYAR, 23, ELUL], HilchosRechilus, 9.13],
  [[24, TEVET, 24, IYYAR, 24, ELUL], HilchosRechilus, 9.14, 9.15],
  [[25, TEVET, 25, IYYAR, 25, ELUL], Tziyurim, 1, 3],
  [[26, TEVET, 26, IYYAR, 26, ELUL], Tziyurim, 4, 5],
  [[27, TEVET, 27, IYYAR, 27, ELUL], Tziyurim, 6, 7],
  [[28, TEVET, 28, IYYAR, 28, ELUL], Tziyurim, 8, 9],
  [[29, TEVET, 29, IYYAR, 29, ELUL], Tziyurim, 10, 11],
];

const leap: Entry[] = [
  [[1, TISHREI, 11, SHVAT, 20, IYYAR], Hakdamah, 1, 4, 'ברוך ד׳', 'שכינתו בתוכנו'],
  [[2, TISHREI, 12, SHVAT, 21, IYYAR], Hakdamah, 5, 10, 'וכאשר נחפשה', 'מגדל העון'],
  [[3, TISHREI, 13, SHVAT, 22, IYYAR], Hakdamah, 11, 16, 'ונראה פשוט', 'לאין שעור'],
  [[4, TISHREI, 14, SHVAT, 23, IYYAR], Hakdamah, 17, 22, 'ואחשבה', 'בפנים הספר'],
  [[5, TISHREI, 15, SHVAT, 24, IYYAR], Hakdamah, 23, 27, 'על כן', 'צד הדי'],
  [[6, TISHREI, 16, SHVAT, 25, IYYAR], Hakdamah, 28, [33, 34], 'ואחלה להקורא', 'במהרה בימינו אמן'],
  [[7, TISHREI, 16, SHVAT, 25, IYYAR], Hakdamah, 29, 32, 'ואל יפלא', 'לעון כלל'],
  [[8, TISHREI, 17, SHVAT, 26, IYYAR], Psichah, 1, 4],
  [[9, TISHREI, 18, SHVAT, 27, IYYAR], Psichah, 5, 11],
  [[10, TISHREI, 19, SHVAT, 28, IYYAR], Lavin, 1, 2],
  [[11, TISHREI, 20, SHVAT, 29, IYYAR], Lavin, 3, 4],
  [[12, TISHREI, 21, SHVAT, 1, SIVAN], Lavin, 5, 6],
  [[13, TISHREI, 22, SHVAT, 2, SIVAN], Lavin, 7, 9],
  [[14, TISHREI, 23, SHVAT, 3, SIVAN], Lavin, 10, 11],
  [[15, TISHREI, 24, SHVAT, 4, SIVAN], Lavin, 12, 13],
  [[16, TISHREI, 25, SHVAT, 5, SIVAN], Lavin, 14, 15],
  [[17, TISHREI, 26, SHVAT, 6, SIVAN], Lavin, 16, 17],
  [[18, TISHREI, 27, SHVAT, 7, SIVAN], Asin, 1, 2],
  [[19, TISHREI, 28, SHVAT, 8, SIVAN], Asin, 3, 4],
  [[20, TISHREI, 29, SHVAT, 9, SIVAN], Asin, 5, 6],
  [[21, TISHREI, 30, SHVAT, 10, SIVAN], Asin, 7, 8],
  [[22, TISHREI, 1, ADAR_I, 11, SIVAN], Asin, 9, 10],
  [[23, TISHREI, 2, ADAR_I, 12, SIVAN], Asin, 11, 12],
  [[24, TISHREI, 3, ADAR_I, 13, SIVAN], Asin, 13, 14],
  [[25, TISHREI, 4, ADAR_I, 14, SIVAN], Arurin],
  [[26, TISHREI, 5, ADAR_I, 15, SIVAN], HilchosLH, 1.1, 1.2],
  [[27, TISHREI, 6, ADAR_I, 16, SIVAN], HilchosLH, 1.3, 1.4],
  [[28, TISHREI, 7, ADAR_I, 17, SIVAN], HilchosLH, 1.5, 1.6],
  [[29, TISHREI, 8, ADAR_I, 18, SIVAN], HilchosLH, 1.7, 1.9],
  [[30, TISHREI, 9, ADAR_I, 19, SIVAN], HilchosLH, 2.1, 2.2],
  [[1, CHESHVAN, 10, ADAR_I, 20, SIVAN], HilchosLH, 2.3, 2.4],
  [[2, CHESHVAN, 11, ADAR_I, 21, SIVAN], HilchosLH, 2.5, 2.6],
  [[3, CHESHVAN, 12, ADAR_I, 22, SIVAN], HilchosLH, 2.7, 2.8],
  [[4, CHESHVAN, 13, ADAR_I, 23, SIVAN], HilchosLH, 2.9, '2.10'],
  [[5, CHESHVAN, 14, ADAR_I, 24, SIVAN], HilchosLH, 2.11],
  [[6, CHESHVAN, 15, ADAR_I, 25, SIVAN], HilchosLH, 2.12, 2.13],
  [[7, CHESHVAN, 16, ADAR_I, 26, SIVAN], HilchosLH, 3.1, 3.2],
  [[8, CHESHVAN, 17, ADAR_I, 27, SIVAN], HilchosLH, 3.3, 3.4],
  [[9, CHESHVAN, 18, ADAR_I, 28, SIVAN], HilchosLH, 3.5, 3.6],
  [[10, CHESHVAN, 19, ADAR_I, 29, SIVAN], HilchosLH, 3.7, 3.8],
  [[11, CHESHVAN, 20, ADAR_I, 30, SIVAN], HilchosLH, 4.1, 4.2],
  [[12, CHESHVAN, 21, ADAR_I, 1, TAMUZ], HilchosLH, 4.3, 4.4],
  [[13, CHESHVAN, 22, ADAR_I, 2, TAMUZ], HilchosLH, 4.5, 4.6],
  [[14, CHESHVAN, 23, ADAR_I, 3, TAMUZ], HilchosLH, 4.7, 4.8],
  [[15, CHESHVAN, 24, ADAR_I, 4, TAMUZ], HilchosLH, 4.9, '4.10'],
  [[16, CHESHVAN, 25, ADAR_I, 5, TAMUZ], HilchosLH, 4.11],
  [[17, CHESHVAN, 26, ADAR_I, 6, TAMUZ], HilchosLH, 4.12, 4.12],
  [[18, CHESHVAN, 27, ADAR_I, 7, TAMUZ], HilchosLH, 5.1, 5.1],
  [[19, CHESHVAN, 28, ADAR_I, 8, TAMUZ], HilchosLH, 5.2, 5.2],
  [[20, CHESHVAN, 29, ADAR_I, 9, TAMUZ], HilchosLH, 5.3, 5.4],
  [[21, CHESHVAN, 30, ADAR_I, 10, TAMUZ], HilchosLH, 5.5, 5.6],
  [[22, CHESHVAN, 1, ADAR_II, 11, TAMUZ], HilchosLH, 5.7, 5.8],
  [[23, CHESHVAN, 2, ADAR_II, 12, TAMUZ], HilchosLH, 6.1, 6.2],
  [[24, CHESHVAN, 3, ADAR_II, 13, TAMUZ], HilchosLH, 6.3, 6.4],
  [[25, CHESHVAN, 4, ADAR_II, 14, TAMUZ], HilchosLH, 6.5, 6.6],
  [[26, CHESHVAN, 5, ADAR_II, 15, TAMUZ], HilchosLH, 6.7, 6.8],
  [[27, CHESHVAN, 6, ADAR_II, 16, TAMUZ], HilchosLH, 6.9, '6.10'],
  [[28, CHESHVAN, 7, ADAR_II, 17, TAMUZ], HilchosLH, 6.11, 6.12],
  [[29, CHESHVAN, 8, ADAR_II, 18, TAMUZ], HilchosLH, 7.1, 7.2],
  [[30, CHESHVAN, 9, ADAR_II, 19, TAMUZ], HilchosLH, 7.3, 7.4],
  [[1, KISLEV, 10, ADAR_II, 20, TAMUZ], HilchosLH, 7.5, 7.6],
  [[2, KISLEV, 11, ADAR_II, 21, TAMUZ], HilchosLH, 7.7, 7.8],
  [[3, KISLEV, 12, ADAR_II, 22, TAMUZ], HilchosLH, 7.9],
  [[4, KISLEV, 13, ADAR_II, 23, TAMUZ], HilchosLH, '7.10'],
  [[5, KISLEV, 14, ADAR_II, 24, TAMUZ], HilchosLH, 7.11, 7.12],
  [[6, KISLEV, 15, ADAR_II, 25, TAMUZ], HilchosLH, 7.13, 7.14],
  [[7, KISLEV, 16, ADAR_II, 26, TAMUZ], HilchosLH, 8.1, 8.2],
  [[8, KISLEV, 17, ADAR_II, 27, TAMUZ], HilchosLH, 8.3, 8.4],
  [[9, KISLEV, 18, ADAR_II, 28, TAMUZ], HilchosLH, 8.5, 8.5],
  [[10, KISLEV, 19, ADAR_II, 29, TAMUZ], HilchosLH, 8.6, 8.7],
  [[11, KISLEV, 20, ADAR_II, 1, AV], HilchosLH, 8.8, 8.9],
  [[12, KISLEV, 21, ADAR_II, 2, AV], HilchosLH, '8.10', 8.11],
  [[13, KISLEV, 22, ADAR_II, 3, AV], HilchosLH, 8.12],
  [[14, KISLEV, 23, ADAR_II, 4, AV], HilchosLH, 8.13, 8.14],
  [[15, KISLEV, 24, ADAR_II, 5, AV], HilchosLH, 9.1, 9.2],
  [[16, KISLEV, 25, ADAR_II, 6, AV], HilchosLH, 9.3, 9.4],
  [[17, KISLEV, 26, ADAR_II, 7, AV], HilchosLH, 9.5, 9.6],
  [[18, KISLEV, 27, ADAR_II, 8, AV], HilchosLH, 10.1, 10.2],
  [[19, KISLEV, 28, ADAR_II, 9, AV], HilchosLH, 10.3, 10.3],
  [[20, KISLEV, 29, ADAR_II, 10, AV], HilchosLH, 10.4, 10.4],
  [[21, KISLEV, 1, NISAN, 11, AV], HilchosLH, 10.5, 10.6],
  [[22, KISLEV, 2, NISAN, 12, AV], HilchosLH, 10.7, 10.8],
  [[23, KISLEV, 3, NISAN, 13, AV], HilchosLH, 10.9, '10.10'],
  [[24, KISLEV, 4, NISAN, 14, AV], HilchosLH, 10.11, 10.12],
  [[25, KISLEV, 5, NISAN, 15, AV], HilchosLH, 10.13, 10.13],
  [[26, KISLEV, 6, NISAN, 16, AV], HilchosLH, 10.14, 10.14],
  [[27, KISLEV, 7, NISAN, 17, AV], HilchosLH, 10.15, 10.16],
  [[28, KISLEV, 8, NISAN, 18, AV], HilchosLH, 10.17],
  [[29, KISLEV, 9, NISAN, 19, AV], HilchosRechilus, 1.1, 1.2],
  [[30, KISLEV, 10, NISAN, 20, AV], HilchosRechilus, 1.3, 1.3],
  [[1, TEVET, 11, NISAN, 21, AV], HilchosRechilus, 1.4, 1.5],
  [[2, TEVET, 12, NISAN, 22, AV], HilchosRechilus, 1.6, 1.7],
  [[3, TEVET, 13, NISAN, 23, AV], HilchosRechilus, 1.8, 1.9],
  [[4, TEVET, 14, NISAN, 24, AV], HilchosRechilus, '1.10', 1.11],
  [[5, TEVET, 15, NISAN, 25, AV], HilchosRechilus, 2.1, 2.2],
  [[6, TEVET, 16, NISAN, 26, AV], HilchosRechilus, 2.3, 2.4],
  [[7, TEVET, 17, NISAN, 27, AV], HilchosRechilus, 3.1],
  [[8, TEVET, 18, NISAN, 28, AV], HilchosRechilus, 3.2, 3.4],
  [[9, TEVET, 19, NISAN, 29, AV], HilchosRechilus, 4.1, 4.3],
  [[10, TEVET, 20, NISAN, 30, AV], HilchosRechilus, 5.1, 5.2],
  [[11, TEVET, 21, NISAN, 1, ELUL], HilchosRechilus, 5.3, 5.4],
  [[12, TEVET, 22, NISAN, 2, ELUL], HilchosRechilus, 5.5],
  [[13, TEVET, 23, NISAN, 3, ELUL], HilchosRechilus, 5.6, 5.7],
  [[14, TEVET, 24, NISAN, 4, ELUL], HilchosRechilus, 6.1, 6.2],
  [[15, TEVET, 25, NISAN, 5, ELUL], HilchosRechilus, 6.3, 6.4],
  [[16, TEVET, 26, NISAN, 6, ELUL], HilchosRechilus, 6.5, 6.6],
  [[17, TEVET, 27, NISAN, 7, ELUL], HilchosRechilus, 6.7, 6.7],
  [[18, TEVET, 28, NISAN, 8, ELUL], HilchosRechilus, 6.8, 6.9],
  [[19, TEVET, 29, NISAN, 9, ELUL], HilchosRechilus, '6.10'],
  [[20, TEVET, 30, NISAN, 10, ELUL], HilchosRechilus, 7.1],
  [[21, TEVET, 1, IYYAR, 11, ELUL], HilchosRechilus, 7.2],
  [[22, TEVET, 2, IYYAR, 12, ELUL], HilchosRechilus, 7.3, 7.4],
  [[23, TEVET, 3, IYYAR, 13, ELUL], HilchosRechilus, 7.5],
  [[24, TEVET, 4, IYYAR, 14, ELUL], HilchosRechilus, 8.1, 8.3],
  [[25, TEVET, 5, IYYAR, 15, ELUL], HilchosRechilus, 8.4, 8.5],
  [[26, TEVET, 6, IYYAR, 16, ELUL], HilchosRechilus, 9.1, 9.2],
  [[27, TEVET, 7, IYYAR, 17, ELUL], HilchosRechilus, 9.3, 9.4],
  [[28, TEVET, 8, IYYAR, 18, ELUL], HilchosRechilus, 9.5, 9.6],
  [[29, TEVET, 9, IYYAR, 19, ELUL], HilchosRechilus, 9.7, 9.9],
  [[1, SHVAT, 10, IYYAR, 20, ELUL], HilchosRechilus, '9.10'],
  [[2, SHVAT, 11, IYYAR, 21, ELUL], HilchosRechilus, 9.11, 9.12],
  [[3, SHVAT, 12, IYYAR, 22, ELUL], HilchosRechilus, 9.13],
  [[4, SHVAT, 13, IYYAR, 23, ELUL], HilchosRechilus, 9.14, 9.15],
  [[5, SHVAT, 14, IYYAR, 24, ELUL], Tziyurim, 1, 2],
  [[6, SHVAT, 15, IYYAR, 25, ELUL], Tziyurim, 3, 3],
  [[7, SHVAT, 16, IYYAR, 26, ELUL], Tziyurim, 4, 5],
  [[8, SHVAT, 17, IYYAR, 27, ELUL], Tziyurim, 6, 7],
  [[9, SHVAT, 18, IYYAR, 28, ELUL], Tziyurim, 8, 9],
  [[10, SHVAT, 19, IYYAR, 29, ELUL], Tziyurim, 10, 11],
];

/**
 * Describes one day's reading in the Sefer Chofetz Chaim calendar.
 */
export type ChofetzChaimReading = {
  /**
   * Book/section code. One of `"Hakdamah"` (Preface), `"Psichah"`
   * (Opening Comments), `"Lavin"` (Negative Commandments), `"Asin"`
   * (Positive Commandments), `"Arurin"` (Curses), `"HilchosLH"`
   * (Part One — Lashon Hara), `"HilchosRechilus"` (Part Two —
   * Rechilut), or `"Tziyurim"` (Illustrations). Translate via the
   * `englishNames` map exported from this module.
   */
  k: string;
  /**
   * Beginning of the day's reading. A halacha/principle number for
   * the introductory sections (e.g. `1` for Hakdamah halacha 1), or
   * a `principle.halacha` style number for HilchosLH/Rechilus
   * (e.g. `1.1`).
   */
  b: string | number;
  /**
   * End of the day's reading. Same format as `b`. May be an array
   * (a few entries in the Hakdamah section study several distinct
   * halachas), or may equal `b` when only one halacha is studied.
   */
  e: string | number | number[];
  /**
   * Optional Hebrew incipit ("opening words") of the day's text,
   * used by some calendar consumers as a study aid.
   */
  textBegin?: string;
  /**
   * Optional Hebrew explicit ("closing words") of the day's text.
   */
  textEnd?: string;
};

/**
 * Returns the Sefer Chofetz Chaim reading scheduled for the given
 * Hebrew date.
 *
 * Sefer Chofetz Chaim (Rabbi Yisrael Meir Kagan, published 1873)
 * covers the Jewish ethics and laws of speech. The schedule is
 * Hebrew-calendar driven: the same Hebrew date in different years
 * receives the same reading, in a 3-year mini-cycle that repeats. The
 * implementation handles short Cheshvan and short Kislev by folding
 * the missing 30th day's reading into the 29th.
 *
 * Unlike most other calendars in this package, this function only
 * accepts an `HDate` (not a Gregorian `Date` or absolute day number).
 *
 * @param hdate - Hebrew date to look up.
 * @returns A {@link ChofetzChaimReading} for the given date. Always
 *   returns a reading once the cycle has begun; there are no skip
 *   days.
 * @throws {RangeError} if `hdate` is before 1 Tishrei 5634
 *   (~22 September 1873).
 * @throws {TypeError} if `hdate` is not an `HDate`.
 */
export function chofetzChaim(hdate: HDate): ChofetzChaimReading {
  if (!HDate.isHDate(hdate)) {
    throw new TypeError(`Invalid date: ${hdate}`);
  }
  const cday = hdate.abs();
  if (cday < chofetzChaimStart) {
    throw new RangeError(
      `Date ${hdate} too early; Sefer Chofetz Chaim cycle began on ${startDate}`
    );
  }

  const readings = hdate.isLeapYear() ? leap : simple;
  const day = hdate.getDate();
  const month = hdate.getMonth();
  const result = lookupReading(readings, day, month);

  const year = hdate.getFullYear();
  if (
    day === 29 &&
    ((month === KISLEV && shortKislev(year)) || (month === CHESHVAN && !longCheshvan(year)))
  ) {
    const extra = lookupReading(readings, 30, month);
    result.e = extra.e;
  }

  return result;
}

function lookupReading(readings: Entry[], day: number, month: number): ChofetzChaimReading {
  let k = '';
  let b: string | number | undefined = 0;
  let e: string | number | number[] | undefined = 0;
  let textBegin = '';
  let textEnd = '';
  for (const reading of readings) {
    const dates = reading[0];
    for (let i = 0; i < dates.length; i += 2) {
      const dd = dates[i];
      const mm = dates[i + 1];
      if (dd === day && mm === month) {
        if (!k) {
          k = reading[1];
          b = reading[2];
          if (typeof reading[4] === 'string') {
            textBegin = reading[4];
          }
        }
        // Handle weird Sefaria layout of Hakdamah
        if (Array.isArray(e)) {
          e = e[e.length - 1];
        } else {
          e = reading[3];
        }
        if (typeof reading[5] === 'string') {
          textEnd = reading[5];
        }
      }
    }
  }
  // `b` and `e` are undefined for whole-section readings (e.g. Arurin), which
  // the public ChofetzChaimReading type does not admit; formatReadingPages()
  // and ChofetzChaimEvent.url() already check for it.
  const result = {k, b, e} as ChofetzChaimReading;
  if (textBegin) {
    result.textBegin = textBegin;
  }
  if (textEnd) {
    result.textEnd = textEnd;
  }
  return result;
}

export function formatReadingPages(reading: ChofetzChaimReading): string {
  let str = '';
  if (reading.b !== undefined) {
    str += ' ' + reading.b;
    if (Array.isArray(reading.e)) {
      str += ', ' + reading.e.join(', ');
    } else if (reading.e !== undefined && reading.e !== reading.b) {
      str += '-' + reading.e;
    }
  }
  return str;
}
