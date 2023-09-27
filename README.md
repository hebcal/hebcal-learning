# hebcal-learning
Javascript Daily Learning Schedules

[![Build Status](https://github.com/hebcal/hebcal-learning/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-learning/actions/workflows/node.js.yml)

Supports several learning schedules

* Daf Yomi (Babylonian Talmud / Bavli) - `dafYomi`
* Mishna Yomi - `mishnaYomi`
* Nach Yomi - `nachYomi`
* Psalms / Tehillim (30 day cycle) - `psalms`
* Yerushalmi Yomi (Jerusalem Talmud)
  * Vilna edition - `yerushalmi-vilna`
  * Schottenstein edition - `yerushalmi-schottenstein`
* Daily Rambam (Mishneh Torah)
  * 1 chapter a day cycle - `rambam1`
* Chofetz Chaim - `chofetzChaim`
* Sefer Shemirat HaLashon - `shemiratHaLashon`
* Daf-a-Week
  * Daily - `dafWeekly`
  * Sundays only - `dafWeeklySunday`

## Installation
```bash
$ npm install @hebcal/learning
```

## Synopsis
```javascript
import {HDate, DailyLearning} from '@hebcal/core';
import '@hebcal/learning';

const dt = new Date();
const hd = new HDate(dt);
const ev = DailyLearning.lookup('dafYomi', hd);
console.log(dt.toLocaleDateString(), hd.toString(), ev.render('en'));
```

## Classes

<dl>
<dt><a href="#DafPage">DafPage</a></dt>
<dd><p>Represents a tractate and page number</p>
</dd>
<dt><a href="#DafYomi">DafYomi</a></dt>
<dd><p>Returns the Daf Yomi for given date</p>
</dd>
<dt><a href="#DafPageEvent">DafPageEvent</a></dt>
<dd><p>Event wrapper around a DafPage instance</p>
</dd>
<dt><a href="#DafYomiEvent">DafYomiEvent</a></dt>
<dd><p>Event wrapper around a DafYomi instance</p>
</dd>
<dt><a href="#MishnaYomiEvent">MishnaYomiEvent</a></dt>
<dd><p>Event wrapper around a Mishna Yomi instance</p>
</dd>
<dt><a href="#MishnaYomiIndex">MishnaYomiIndex</a></dt>
<dd><p>A program of daily learning in which participants study two Mishnahs
each day in order to finish the entire Mishnah in ~6 years.</p>
</dd>
<dt><a href="#NachYomiEvent">NachYomiEvent</a></dt>
<dd><p>Event wrapper around a Nach Yomi instance</p>
</dd>
<dt><a href="#NachYomiIndex">NachYomiIndex</a></dt>
<dd><p>A daily regimen of learning the books of Nevi&#39;im (Prophets)
and Ketuvim (Writings).</p>
</dd>
<dt><a href="#YerushalmiYomiEvent">YerushalmiYomiEvent</a></dt>
<dd><p>Event wrapper around a Yerushalmi Yomi result</p>
</dd>
<dt><a href="#ChofetzChaimEvent">ChofetzChaimEvent</a></dt>
<dd><p>Event wrapper around a Chofetz Chaim instance</p>
</dd>
<dt><a href="#DailyRambamEvent">DailyRambamEvent</a></dt>
<dd><p>Event wrapper around a Daily Rambam instance</p>
</dd>
<dt><a href="#ShemiratHaLashonEvent">ShemiratHaLashonEvent</a></dt>
<dd><p>Event wrapper around a Sefer Shemirat HaLashon instance</p>
</dd>
<dt><a href="#PsalmsEvent">PsalmsEvent</a></dt>
<dd><p>Event wrapper around a daily Psalms / Tehillim</p>
</dd>
<dt><a href="#DafWeeklyEvent">DafWeeklyEvent</a></dt>
<dd><p>Event wrapper around a daily weekly</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#vilna">vilna</a></dt>
<dd><p>Yerushalmi Yomi configuration for Vilna Edition</p>
</dd>
<dt><a href="#schottenstein">schottenstein</a></dt>
<dd><p>Yerushalmi Yomi configuration for Schottenstein Edition</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#yerushalmiYomi">yerushalmiYomi(date, config)</a> ⇒ <code>any</code></dt>
<dd><p>Using the Vilna edition, the Yerushalmi Daf Yomi program takes
~4.25 years or 51 months.
Unlike the Daf Yomi Bavli cycle, this Yerushalmi cycle skips both
Yom Kippur and Tisha B&#39;Av (returning <code>null</code>).
The page numbers are according to the Vilna
Edition which is used since 1900.</p>
<p>The Schottenstein edition uses different page numbers and takes
~6 years to complete.</p>
<p>Throws an exception if the date is before Daf Yomi Yerushalmi
cycle began (2 February 1980 for Vilna,
14 November 2022 for Schottenstein).</p>
</dd>
<dt><a href="#chofetzChaim">chofetzChaim(hdate)</a> ⇒ <code>any</code></dt>
<dd><p>Looks up Chofetz Chaim Calendar for date</p>
</dd>
<dt><a href="#dailyRambam1">dailyRambam1(date)</a> ⇒ <code>any</code></dt>
<dd><p>Calculates Daily Rambam (Mishneh Torah) for 1 chapter a day cycle.</p>
</dd>
<dt><a href="#shemiratHaLashon">shemiratHaLashon(hdate)</a> ⇒ <code>any</code></dt>
<dd><p>Looks up Sefer Shemirat HaLashon Calendar for date</p>
</dd>
<dt><a href="#dailyPsalms">dailyPsalms(date)</a> ⇒ <code>any</code></dt>
<dd><p>Calculates Daily Psalms (Tehillim) for 30-day cycle.</p>
</dd>
<dt><a href="#dafWeekly">dafWeekly(date)</a> ⇒ <code><a href="#DafPage">DafPage</a></code></dt>
<dd><p>Daf-a-Week</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#MishnaYomi">MishnaYomi</a> : <code>Object</code></dt>
<dd><p>Describes a mishna to be read</p>
</dd>
<dt><a href="#NachYomi">NachYomi</a> : <code>Object</code></dt>
<dd><p>Describes a chapter to be read</p>
</dd>
</dl>

<a name="DafPage"></a>

## DafPage
Represents a tractate and page number

**Kind**: global class  

* [DafPage](#DafPage)
    * [new DafPage(name, blatt)](#new_DafPage_new)
    * [.getBlatt()](#DafPage+getBlatt) ⇒ <code>number</code>
    * [.getName()](#DafPage+getName) ⇒ <code>string</code>
    * [.render([locale])](#DafPage+render) ⇒ <code>string</code>

<a name="new_DafPage_new"></a>

### new DafPage(name, blatt)
Initializes a daf yomi instance


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| blatt | <code>number</code> | 

<a name="DafPage+getBlatt"></a>

### dafPage.getBlatt() ⇒ <code>number</code>
**Kind**: instance method of [<code>DafPage</code>](#DafPage)  
<a name="DafPage+getName"></a>

### dafPage.getName() ⇒ <code>string</code>
**Kind**: instance method of [<code>DafPage</code>](#DafPage)  
<a name="DafPage+render"></a>

### dafPage.render([locale]) ⇒ <code>string</code>
Formats (with translation) the dafyomi result as a string like "Pesachim 34"

**Kind**: instance method of [<code>DafPage</code>](#DafPage)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafYomi"></a>

## DafYomi
Returns the Daf Yomi for given date

**Kind**: global class  
<a name="new_DafYomi_new"></a>

### new DafYomi(date)
Initializes a daf yomi instance


| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> \| <code>HDate</code> \| <code>number</code> | Gregorian or Hebrew date |

<a name="DafPageEvent"></a>

## DafPageEvent
Event wrapper around a DafPage instance

**Kind**: global class  

* [DafPageEvent](#DafPageEvent)
    * [new DafPageEvent(date, daf)](#new_DafPageEvent_new)
    * [.render([locale])](#DafPageEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#DafPageEvent+renderBrief) ⇒ <code>string</code>
    * [.url()](#DafPageEvent+url) ⇒ <code>string</code>

<a name="new_DafPageEvent_new"></a>

### new DafPageEvent(date, daf)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| daf | [<code>DafPage</code>](#DafPage) | 

<a name="DafPageEvent+render"></a>

### dafPageEvent.render([locale]) ⇒ <code>string</code>
Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").

**Kind**: instance method of [<code>DafPageEvent</code>](#DafPageEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafPageEvent+renderBrief"></a>

### dafPageEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns Daf Yomi name without the 'Daf Yomi: ' prefix (e.g. "Pesachim 107").

**Kind**: instance method of [<code>DafPageEvent</code>](#DafPageEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafPageEvent+url"></a>

### dafPageEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org or dafyomi.org

**Kind**: instance method of [<code>DafPageEvent</code>](#DafPageEvent)  
<a name="DafYomiEvent"></a>

## DafYomiEvent
Event wrapper around a DafYomi instance

**Kind**: global class  

* [DafYomiEvent](#DafYomiEvent)
    * [new DafYomiEvent(date)](#new_DafYomiEvent_new)
    * [.render([locale])](#DafYomiEvent+render) ⇒ <code>string</code>
    * [.getCategories()](#DafYomiEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_DafYomiEvent_new"></a>

### new DafYomiEvent(date)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 

<a name="DafYomiEvent+render"></a>

### dafYomiEvent.render([locale]) ⇒ <code>string</code>
Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").

**Kind**: instance method of [<code>DafYomiEvent</code>](#DafYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafYomiEvent+getCategories"></a>

### dafYomiEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>DafYomiEvent</code>](#DafYomiEvent)  
<a name="MishnaYomiEvent"></a>

## MishnaYomiEvent
Event wrapper around a Mishna Yomi instance

**Kind**: global class  

* [MishnaYomiEvent](#MishnaYomiEvent)
    * [new MishnaYomiEvent(date, mishnaYomi)](#new_MishnaYomiEvent_new)
    * [.render([locale])](#MishnaYomiEvent+render) ⇒ <code>string</code>
    * [.url()](#MishnaYomiEvent+url) ⇒ <code>string</code>
    * [.getCategories()](#MishnaYomiEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_MishnaYomiEvent_new"></a>

### new MishnaYomiEvent(date, mishnaYomi)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| mishnaYomi | [<code>Array.&lt;MishnaYomi&gt;</code>](#MishnaYomi) | 

<a name="MishnaYomiEvent+render"></a>

### mishnaYomiEvent.render([locale]) ⇒ <code>string</code>
Returns Mishna Yomi name (e.g. "Bava Metzia 10:5-6" or "Berakhot 9:5-Peah 1:1").

**Kind**: instance method of [<code>MishnaYomiEvent</code>](#MishnaYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="MishnaYomiEvent+url"></a>

### mishnaYomiEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org

**Kind**: instance method of [<code>MishnaYomiEvent</code>](#MishnaYomiEvent)  
<a name="MishnaYomiEvent+getCategories"></a>

### mishnaYomiEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>MishnaYomiEvent</code>](#MishnaYomiEvent)  
<a name="MishnaYomiIndex"></a>

## MishnaYomiIndex
A program of daily learning in which participants study two Mishnahs
each day in order to finish the entire Mishnah in ~6 years.

**Kind**: global class  

* [MishnaYomiIndex](#MishnaYomiIndex)
    * [new MishnaYomiIndex()](#new_MishnaYomiIndex_new)
    * [.days](#MishnaYomiIndex+days) : [<code>Array.&lt;MishnaYomi&gt;</code>](#MishnaYomi)
    * [.lookup(date)](#MishnaYomiIndex+lookup) ⇒ [<code>Array.&lt;MishnaYomi&gt;</code>](#MishnaYomi)

<a name="new_MishnaYomiIndex_new"></a>

### new MishnaYomiIndex()
Initializes a Mishna Yomi instance

<a name="MishnaYomiIndex+days"></a>

### mishnaYomiIndex.days : [<code>Array.&lt;MishnaYomi&gt;</code>](#MishnaYomi)
**Kind**: instance property of [<code>MishnaYomiIndex</code>](#MishnaYomiIndex)  
<a name="MishnaYomiIndex+lookup"></a>

### mishnaYomiIndex.lookup(date) ⇒ [<code>Array.&lt;MishnaYomi&gt;</code>](#MishnaYomi)
Looks up a Mishna Yomi

**Kind**: instance method of [<code>MishnaYomiIndex</code>](#MishnaYomiIndex)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> \| <code>HDate</code> \| <code>number</code> | Gregorian date |

<a name="NachYomiEvent"></a>

## NachYomiEvent
Event wrapper around a Nach Yomi instance

**Kind**: global class  

* [NachYomiEvent](#NachYomiEvent)
    * [new NachYomiEvent(date, nachYomi)](#new_NachYomiEvent_new)
    * [.render([locale])](#NachYomiEvent+render) ⇒ <code>string</code>
    * [.url()](#NachYomiEvent+url) ⇒ <code>string</code>
    * [.getCategories()](#NachYomiEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_NachYomiEvent_new"></a>

### new NachYomiEvent(date, nachYomi)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| nachYomi | [<code>NachYomi</code>](#NachYomi) | 

<a name="NachYomiEvent+render"></a>

### nachYomiEvent.render([locale]) ⇒ <code>string</code>
Returns name of tractate and page (e.g. "Beitzah 21").

**Kind**: instance method of [<code>NachYomiEvent</code>](#NachYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="NachYomiEvent+url"></a>

### nachYomiEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org

**Kind**: instance method of [<code>NachYomiEvent</code>](#NachYomiEvent)  
<a name="NachYomiEvent+getCategories"></a>

### nachYomiEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>NachYomiEvent</code>](#NachYomiEvent)  
<a name="NachYomiIndex"></a>

## NachYomiIndex
A daily regimen of learning the books of Nevi'im (Prophets)
and Ketuvim (Writings).

**Kind**: global class  

* [NachYomiIndex](#NachYomiIndex)
    * [new NachYomiIndex()](#new_NachYomiIndex_new)
    * [.lookup(date)](#NachYomiIndex+lookup) ⇒ [<code>NachYomi</code>](#NachYomi)

<a name="new_NachYomiIndex_new"></a>

### new NachYomiIndex()
Initializes a Nach Yomi instance

<a name="NachYomiIndex+lookup"></a>

### nachYomiIndex.lookup(date) ⇒ [<code>NachYomi</code>](#NachYomi)
Looks up a Mishna Yomi

**Kind**: instance method of [<code>NachYomiIndex</code>](#NachYomiIndex)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> \| <code>HDate</code> \| <code>number</code> | Gregorian date |

<a name="YerushalmiYomiEvent"></a>

## YerushalmiYomiEvent
Event wrapper around a Yerushalmi Yomi result

**Kind**: global class  

* [YerushalmiYomiEvent](#YerushalmiYomiEvent)
    * [new YerushalmiYomiEvent(date, daf)](#new_YerushalmiYomiEvent_new)
    * [.render([locale])](#YerushalmiYomiEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#YerushalmiYomiEvent+renderBrief) ⇒ <code>string</code>
    * [.url()](#YerushalmiYomiEvent+url) ⇒ <code>string</code>
    * [.getCategories()](#YerushalmiYomiEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_YerushalmiYomiEvent_new"></a>

### new YerushalmiYomiEvent(date, daf)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| daf | <code>any</code> | 

<a name="YerushalmiYomiEvent+render"></a>

### yerushalmiYomiEvent.render([locale]) ⇒ <code>string</code>
Returns name of tractate and page (e.g. "Yerushalmi Beitzah 21").

**Kind**: instance method of [<code>YerushalmiYomiEvent</code>](#YerushalmiYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="YerushalmiYomiEvent+renderBrief"></a>

### yerushalmiYomiEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns name of tractate and page (e.g. "Beitzah 21").

**Kind**: instance method of [<code>YerushalmiYomiEvent</code>](#YerushalmiYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="YerushalmiYomiEvent+url"></a>

### yerushalmiYomiEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org

**Kind**: instance method of [<code>YerushalmiYomiEvent</code>](#YerushalmiYomiEvent)  
<a name="YerushalmiYomiEvent+getCategories"></a>

### yerushalmiYomiEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>YerushalmiYomiEvent</code>](#YerushalmiYomiEvent)  
<a name="ChofetzChaimEvent"></a>

## ChofetzChaimEvent
Event wrapper around a Chofetz Chaim instance

**Kind**: global class  

* [ChofetzChaimEvent](#ChofetzChaimEvent)
    * [new ChofetzChaimEvent(date, reading)](#new_ChofetzChaimEvent_new)
    * [.render([locale])](#ChofetzChaimEvent+render) ⇒ <code>string</code>
    * [.url()](#ChofetzChaimEvent+url) ⇒ <code>string</code>
    * [.getCategories()](#ChofetzChaimEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_ChofetzChaimEvent_new"></a>

### new ChofetzChaimEvent(date, reading)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| reading | <code>any</code> | 

<a name="ChofetzChaimEvent+render"></a>

### chofetzChaimEvent.render([locale]) ⇒ <code>string</code>
Returns name of reading

**Kind**: instance method of [<code>ChofetzChaimEvent</code>](#ChofetzChaimEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="ChofetzChaimEvent+url"></a>

### chofetzChaimEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org
 e.g. https://www.sefaria.org/Chofetz_Chaim%2C_Part_One%2C_The_Prohibition_Against_Lashon_Hara%2C_Principle_7.7

**Kind**: instance method of [<code>ChofetzChaimEvent</code>](#ChofetzChaimEvent)  
<a name="ChofetzChaimEvent+getCategories"></a>

### chofetzChaimEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>ChofetzChaimEvent</code>](#ChofetzChaimEvent)  
<a name="DailyRambamEvent"></a>

## DailyRambamEvent
Event wrapper around a Daily Rambam instance

**Kind**: global class  

* [DailyRambamEvent](#DailyRambamEvent)
    * [new DailyRambamEvent(date, reading)](#new_DailyRambamEvent_new)
    * [.render([locale])](#DailyRambamEvent+render) ⇒ <code>string</code>
    * [.url()](#DailyRambamEvent+url) ⇒ <code>string</code>
    * [.getCategories()](#DailyRambamEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_DailyRambamEvent_new"></a>

### new DailyRambamEvent(date, reading)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| reading | <code>any</code> | 

<a name="DailyRambamEvent+render"></a>

### dailyRambamEvent.render([locale]) ⇒ <code>string</code>
Returns name of reading

**Kind**: instance method of [<code>DailyRambamEvent</code>](#DailyRambamEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DailyRambamEvent+url"></a>

### dailyRambamEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org

**Kind**: instance method of [<code>DailyRambamEvent</code>](#DailyRambamEvent)  
<a name="DailyRambamEvent+getCategories"></a>

### dailyRambamEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>DailyRambamEvent</code>](#DailyRambamEvent)  
<a name="ShemiratHaLashonEvent"></a>

## ShemiratHaLashonEvent
Event wrapper around a Sefer Shemirat HaLashon instance

**Kind**: global class  

* [ShemiratHaLashonEvent](#ShemiratHaLashonEvent)
    * [new ShemiratHaLashonEvent(date, reading)](#new_ShemiratHaLashonEvent_new)
    * [.render([locale])](#ShemiratHaLashonEvent+render) ⇒ <code>string</code>
    * [.url()](#ShemiratHaLashonEvent+url) ⇒ <code>string</code>
    * [.getCategories()](#ShemiratHaLashonEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_ShemiratHaLashonEvent_new"></a>

### new ShemiratHaLashonEvent(date, reading)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| reading | <code>any</code> | 

<a name="ShemiratHaLashonEvent+render"></a>

### shemiratHaLashonEvent.render([locale]) ⇒ <code>string</code>
Returns name of reading

**Kind**: instance method of [<code>ShemiratHaLashonEvent</code>](#ShemiratHaLashonEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="ShemiratHaLashonEvent+url"></a>

### shemiratHaLashonEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org
 e.g. https://www.sefaria.org/Shemirat_HaLashon%2C_Book_I%2C_The_Gate_of_Torah.4.2?lang=b

**Kind**: instance method of [<code>ShemiratHaLashonEvent</code>](#ShemiratHaLashonEvent)  
<a name="ShemiratHaLashonEvent+getCategories"></a>

### shemiratHaLashonEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>ShemiratHaLashonEvent</code>](#ShemiratHaLashonEvent)  
<a name="PsalmsEvent"></a>

## PsalmsEvent
Event wrapper around a daily Psalms / Tehillim

**Kind**: global class  

* [PsalmsEvent](#PsalmsEvent)
    * [new PsalmsEvent(date, reading)](#new_PsalmsEvent_new)
    * [.render([locale])](#PsalmsEvent+render) ⇒ <code>string</code>
    * [.url()](#PsalmsEvent+url) ⇒ <code>string</code>
    * [.getCategories()](#PsalmsEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_PsalmsEvent_new"></a>

### new PsalmsEvent(date, reading)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| reading | <code>Array.&lt;number&gt;</code> \| <code>Array.&lt;string&gt;</code> | 

<a name="PsalmsEvent+render"></a>

### psalmsEvent.render([locale]) ⇒ <code>string</code>
Returns name of reading

**Kind**: instance method of [<code>PsalmsEvent</code>](#PsalmsEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="PsalmsEvent+url"></a>

### psalmsEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org
 e.g. https://www.sefaria.org/Psalms.1-9?lang=b

**Kind**: instance method of [<code>PsalmsEvent</code>](#PsalmsEvent)  
<a name="PsalmsEvent+getCategories"></a>

### psalmsEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>PsalmsEvent</code>](#PsalmsEvent)  
<a name="DafWeeklyEvent"></a>

## DafWeeklyEvent
Event wrapper around a daily weekly

**Kind**: global class  

* [DafWeeklyEvent](#DafWeeklyEvent)
    * [new DafWeeklyEvent(date, daf)](#new_DafWeeklyEvent_new)
    * [.getCategories()](#DafWeeklyEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_DafWeeklyEvent_new"></a>

### new DafWeeklyEvent(date, daf)

| Param | Type |
| --- | --- |
| date | <code>HDate</code> | 
| daf | [<code>DafPage</code>](#DafPage) | 

<a name="DafWeeklyEvent+getCategories"></a>

### dafWeeklyEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>DafWeeklyEvent</code>](#DafWeeklyEvent)  
<a name="vilna"></a>

## vilna
Yerushalmi Yomi configuration for Vilna Edition

**Kind**: global constant  
**Read only**: true  
<a name="schottenstein"></a>

## schottenstein
Yerushalmi Yomi configuration for Schottenstein Edition

**Kind**: global constant  
**Read only**: true  
<a name="yerushalmiYomi"></a>

## yerushalmiYomi(date, config) ⇒ <code>any</code>
Using the Vilna edition, the Yerushalmi Daf Yomi program takes
~4.25 years or 51 months.
Unlike the Daf Yomi Bavli cycle, this Yerushalmi cycle skips both
Yom Kippur and Tisha B'Av (returning `null`).
The page numbers are according to the Vilna
Edition which is used since 1900.

The Schottenstein edition uses different page numbers and takes
~6 years to complete.

Throws an exception if the date is before Daf Yomi Yerushalmi
cycle began (2 February 1980 for Vilna,
14 November 2022 for Schottenstein).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>HDate</code> \| <code>Date</code> \| <code>number</code> | Hebrew or Gregorian date |
| config | <code>any</code> | either vilna or schottenstein |

<a name="chofetzChaim"></a>

## chofetzChaim(hdate) ⇒ <code>any</code>
Looks up Chofetz Chaim Calendar for date

**Kind**: global function  

| Param | Type |
| --- | --- |
| hdate | <code>HDate</code> | 

<a name="dailyRambam1"></a>

## dailyRambam1(date) ⇒ <code>any</code>
Calculates Daily Rambam (Mishneh Torah) for 1 chapter a day cycle.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>HDate</code> \| <code>Date</code> \| <code>number</code> | Hebrew or Gregorian date |

<a name="shemiratHaLashon"></a>

## shemiratHaLashon(hdate) ⇒ <code>any</code>
Looks up Sefer Shemirat HaLashon Calendar for date

**Kind**: global function  

| Param | Type |
| --- | --- |
| hdate | <code>HDate</code> | 

<a name="dailyPsalms"></a>

## dailyPsalms(date) ⇒ <code>any</code>
Calculates Daily Psalms (Tehillim) for 30-day cycle.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>HDate</code> \| <code>Date</code> \| <code>number</code> | Hebrew or Gregorian date |

<a name="dafWeekly"></a>

## dafWeekly(date) ⇒ [<code>DafPage</code>](#DafPage)
Daf-a-Week

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>HDate</code> \| <code>Date</code> \| <code>number</code> | Hebrew or Gregorian date |

<a name="MishnaYomi"></a>

## MishnaYomi : <code>Object</code>
Describes a mishna to be read

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| k | <code>string</code> | tractate name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan") |
| v | <code>string</code> | verse (e.g. "2:1") |

<a name="NachYomi"></a>

## NachYomi : <code>Object</code>
Describes a chapter to be read

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| k | <code>string</code> | book name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan") |
| v | <code>number</code> | chapter (e.g. "2:1") |

