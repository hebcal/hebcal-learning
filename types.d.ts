/// <reference types="node"/>

import {HDate, Event} from '@hebcal/core';

declare module '@hebcal/learning' {
  export class DafPage {
    constructor(name: string, blatt: number);
    getBlatt(): number;
    getName(): string;
    /**
     * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
     * @param [locale] - Optional locale name (defaults to active locale).
     */
    render(locale?: string): string;
  }

  /**
   * Event wrapper around a DafPage instance
   */
  export class DafPageEvent extends Event {
    constructor(date: HDate, daf: DafPage, mask: number);
    /**
     * Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").
     * @param [locale] - Optional locale name (defaults to active locale).
     */
    render(locale?: string): string;
    /**
     * Returns Daf Yomi name without the 'Daf Yomi: ' prefix (e.g. "Pesachim 107").
     * @param [locale] - Optional locale name (defaults to active locale).
     */
    renderBrief(locale?: string): string;
    /**
     * Returns a link to sefaria.org or dafyomi.org
     */
    url(): string;
  }

  /**
   * Returns the Daf Yomi for given date
   */
  export class DafYomi extends DafPage {
    /**
     * Initializes a daf yomi instance
     * @param date Gregorian or Hebrew date
     */
    constructor(date: Date | HDate | number);
    getBlatt(): number;
    getName(): string;
    /**
     * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
     * @param [locale] Optional locale name (defaults to active locale).
     */
    render(locale?: string): string;
  }

  export class DafYomiEvent extends DafPageEvent {
    constructor(date: HDate);
    render(locale?: string): string;
    renderBrief(locale?: string): string;
    url(): string;
    getCategories(): string[];
    readonly daf: DafYomi;
  }

  /**
   * Describes a mishna to be read
   * @property k - tractate name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan")
   * @property v - verse (e.g. "2:1")
   */
  export type MishnaYomi = {
    k: string;
      v: string;
  };
  /**
   * Initializes a Mishna Yomi instance
   */
  export class MishnaYomiIndex {
    /**
     * Looks up a Mishna Yomi
     * @param date - Gregorian date
     */
    lookup(date: Date | HDate | number): MishnaYomi[];
  }
  /**
   * Event wrapper around a Mishna Yomi instance
   */
  export class MishnaYomiEvent extends Event {
    constructor(date: HDate, mishnaYomi: MishnaYomi[]);
    /**
     * Returns Mishna Yomi name (e.g. "Bava Metzia 10:5-6" or "Berakhot 9:5-Peah 1:1").
     * @param [locale] - Optional locale name (defaults to active locale).
     */
    render(locale?: string): string;
    /**
     * Returns a link to sefaria.org
     */
    url(): string;
    readonly mishnaYomi: MishnaYomi[];
  }

  /**
   * Using the Vilna edition, the Yerushalmi Daf Yomi program takes
   * ~4.25 years or 51 months.
   * Unlike the Daf Yomi Bavli cycle, this Yerushalmi cycle skips both
   * Yom Kippur and Tisha B'Av (returning `null`).
   * The page numbers are according to the Vilna
   * Edition which is used since 1900.
   *
   * The Schottenstein edition uses different page numbers and takes
   * ~6 years to complete.
   *
   * Throws an exception if the date is before Daf Yomi Yerushalmi
   * cycle began (2 February 1980 for Vilna,
   * 14 November 2022 for Schottenstein).
   *
   * @param date - Hebrew or Gregorian date
   * @param config - either vilna or schottenstein
   */
  export function yerushalmiYomi(date: Date | HDate | number, config: any): any;
  /** Yerushalmi Yomi configuration for Vilna Edition */
  export const vilna: any;
  /** Yerushalmi Yomi configuration for Schottenstein Edition */
  export const schottenstein: any;

  /**
   * Event wrapper around a Yerushalmi Yomi result
   */
   export class YerushalmiYomiEvent extends Event {
      constructor(date: HDate, daf: any);
      /**
       * Returns name of tractate and page (e.g. "Yerushalmi Beitzah 21").
       * @param [locale] - Optional locale name (defaults to active locale).
       */
      render(locale?: string): string;
      renderBrief(locale?: string): string;
      url(): string;
      readonly daf: any;
  }

  /**
   * Describes a chapter to be read
   * @property k - tractate name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan")
   * @property v - verse (e.g. "2:1")
   */
  export type NachYomi = {
    k: string;
    v: string;
  };

  /**
   * A daily regimen of learning the books of Nevi'im (Prophets)
   * and Ketuvim (Writings).
   */
  export class NachYomiIndex {
    constructor();
    /**
     * Looks up a Mishna Yomi
     */
    lookup(date: Date | HDate | number): NachYomi;
  }

  export class NachYomiEvent extends Event {
    constructor(date: HDate, nachYomi: NachYomi);
    render(locale?: string): string;
    url(): string;
    getCategories(): string[];
  }

  /**
   * Looks up Chofetz Chaim Calendar for date
   */
  export function chofetzChaim(hdate: HDate): any;

  export class ChofetzChaimEvent extends Event {
    constructor(date: HDate, reading: any);
    render(locale?: string): string;
    url(): string;
    getCategories(): string[];
  }

  /**
   * Calculates Daily Rambam (Mishneh Torah) for 1 chapter a day cycle
   */
  export function dailyRambam1(date: Date | HDate | number): any;

  export class DailyRambamEvent extends Event {
    constructor(date: HDate, reading: any);
    render(locale?: string): string;
    url(): string;
    getCategories(): string[];
  }

  /**
   * Looks up Sefer Shemirat HaLashon Calendar for date
   */
  export function shemiratHaLashon(hdate: HDate): any;

  export class ShemiratHaLashonEvent extends Event {
    constructor(date: HDate, reading: any);
    render(locale?: string): string;
    url(): string;
    getCategories(): string[];
  }

  /**
   * Calculates Daily Psalms (Tehillim) for 30-day cycle.
   * @param date - Hebrew or Gregorian date
   */
  export function dailyPsalms(date: Date | HDate | number): any;

  export class PsalmsEvent extends Event {
    constructor(date: HDate, reading: any);
    render(locale?: string): string;
    url(): string;
    getCategories(): string[];
  }

  /**
   * Daf-a-Week
   * @param date - Hebrew or Gregorian date
   */
  export function dafWeekly(date: HDate | Date | number): DafPage;

  /**
   * Event wrapper around a daily weekly
   */
  export class DafWeeklyEvent extends DafPageEvent {
      constructor(date: HDate, daf: DafPage);
      getCategories(): string[];
  }
}
