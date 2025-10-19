import {expect, test} from 'vitest';
import {KitzurShulchanAruchEvent} from '../src/KitzurShulchanAruchEvent';
import {kitzurShulchanAruch} from '../src/kitzurShulchanAruchBase';
import {HDate, months} from '@hebcal/hdate';
import '../src/locale';

test('year', () => {
  const startAbs = HDate.hebrew2abs(5787, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(5788, months.TISHREI, 1) - 1;
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const hd = new HDate(abs);
    const reading = kitzurShulchanAruch(hd, 'A');
    const mm = hd.getMonth();
    if (hd.getDate() === 30 && (mm === months.ADAR_I || mm === months.CHESHVAN)) {
      expect(reading).toBeUndefined();
    } else {
      expect(reading).not.toBeUndefined();
      const ev = new KitzurShulchanAruchEvent(hd, reading!);
      expect(ev.renderBrief('he')).toBeTypeOf('string');
    }
  }
});
