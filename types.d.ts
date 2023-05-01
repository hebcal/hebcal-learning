/// <reference types="node"/>

import {HDate, Event} from '@hebcal/core';

declare module '@hebcal/learning' {
  /**
   * Returns the Daf Yomi for given date
   */
  export class DafYomi {
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

  export class DafYomiEvent extends Event {
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

  export class NachYomiEvent extends Event {
    constructor(date: HDate, nachYomi: any);
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
}
