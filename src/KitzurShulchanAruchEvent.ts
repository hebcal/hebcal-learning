import {Event, HDate, flags, Locale, months} from '@hebcal/core';
import {KitzurShulchanAruchReading} from './kitzurShulchanAruchBase';
import {gematriyaNN, formatBeginEndRange} from './common';
import './locale';

const BOOK_NAME = 'Kitzur Shulchan Arukh';

function gematriyaOrSof(s: string): string {
  return s === 'E' ? 'סוף' : gematriyaNN(s);
}

function renderReading(
  reading: KitzurShulchanAruchReading,
  locale?: string
): string {
  locale = locale || Locale.getLocaleName();
  if (typeof locale === 'string') {
    locale = locale.toLowerCase();
  }
  if (locale === 'he' || locale === 'he-x-nonikud') {
    if (reading.b === 'Klalim') {
      return Locale.gettext(reading.b, locale);
    }
    const cv1 = reading.b.split(':');
    const begin = cv1
      .map(s => {
        return s === 'Shmita' ? 'שמיטה' : gematriyaNN(s);
      })
      .join(':');
    if (reading.e) {
      const end = reading.e.split(':');
      const chap = gematriyaOrSof(end[0]);
      if (!end[1]) {
        return begin + `-${chap}`;
      }
      const verse = gematriyaOrSof(end[1]);
      const chapColon = end[0] === cv1[0] ? '' : chap + ':';
      return begin + `-${chapColon}${verse}`;
    }
    return begin;
  }
  const begin = reading.b;
  const end = reading.e;
  if (end) {
    return formatBeginEndRange(begin, end);
  }
  return begin;
}

/**
 * Event wrapper for
 * Pirkei Avot being studied on Shabbat between Pesach and Rosh Hashana
 */
export class KitzurShulchanAruchEvent extends Event {
  reading: KitzurShulchanAruchReading;
  optionB?: KitzurShulchanAruchReading;
  leapAdar2: boolean;
  category: string;
  constructor(
    date: HDate,
    reading: KitzurShulchanAruchReading,
    optionB?: KitzurShulchanAruchReading
  ) {
    let desc = reading.b;
    if (reading.e) {
      desc += '-' + reading.e;
    }
    if (optionB) {
      desc += ` / ${optionB.b}-${optionB.e}`;
    }
    super(date, desc, flags.DAILY_LEARNING);
    this.reading = reading;
    this.optionB = optionB;
    this.leapAdar2 = date.isLeapYear() && date.getMonth() === months.ADAR_II;
    this.alarm = false;
    this.category = BOOK_NAME;
  }
  /**
   * Returns name of reading
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const prefix = this.leapAdar2
      ? ''
      : Locale.gettext(BOOK_NAME, locale) + ' ';
    return prefix + this.renderBrief(locale);
  }
  /**
   * Returns a brief (translated) description of this event.
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    let str = '';
    if (this.leapAdar2) {
      str += Locale.gettext("Hilchot Shmita v'Terumah", locale) + ' ';
    }
    str += renderReading(this.reading, locale);
    if (this.optionB) {
      str += ' / ' + Locale.gettext("Hilchot Brachot v'Tefilah", locale) + ' ';
      str += renderReading(this.optionB, locale);
    }
    return str;
  }
  /**
   * Returns a link to sefaria.org
   */
  url(): string | undefined {
    if (this.leapAdar2) {
      return undefined;
    }
    const prefix = 'https://www.sefaria.org/Kitzur_Shulchan_Arukh';
    const reading = this.reading;
    const cv1 = reading.b;
    if (!reading.e || reading.e.endsWith(':E')) {
      const verse1 = cv1.replace(':', '.');
      return `${prefix}.${verse1}?lang=bi`;
    }
    const range = formatBeginEndRange(reading.b, reading.e);
    const rangeDot = range.replace(':', '.');
    return `${prefix}.${rangeDot}?lang=bi`;
  }
  getCategories(): string[] {
    return ['kitzurShulchanAruch'];
  }
}
