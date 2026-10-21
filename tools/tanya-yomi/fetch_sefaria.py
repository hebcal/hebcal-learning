#!/usr/bin/env python3
"""Download Sefaria's Tanya Yomi entries for a range of Gregorian dates.

Usage: fetch_sefaria.py START END OUT.json   (dates as YYYY-MM-DD, inclusive)

Writes a JSON list of [iso-date, sefaria-ref] pairs (ref is null when Sefaria
has no Tanya Yomi entry for that day). Sefaria rate-limits aggressively, so
requests are few at a time with exponential backoff.
"""
import concurrent.futures
import datetime
import json
import sys
import time
import urllib.request


def fetch(d):
    url = f'https://www.sefaria.org/api/calendars?year={d.year}&month={d.month}&day={d.day}'
    err = None
    for attempt in range(7):
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                j = json.load(resp)
            for item in j['calendar_items']:
                if item['title']['en'] == 'Tanya Yomi':
                    return [d.isoformat(), item['ref']]
            return [d.isoformat(), None]
        except Exception as e:  # noqa: BLE001
            err = e
            time.sleep(3 * 2**attempt)
    raise RuntimeError(f'{d}: {err}')


def main():
    start = datetime.date.fromisoformat(sys.argv[1])
    end = datetime.date.fromisoformat(sys.argv[2])
    days = [start + datetime.timedelta(i) for i in range((end - start).days + 1)]
    with concurrent.futures.ThreadPoolExecutor(3) as ex:
        res = list(ex.map(fetch, days))
    with open(sys.argv[3], 'w') as f:
        f.write('[\n' + ',\n'.join(json.dumps(r) for r in res) + '\n]\n')


if __name__ == '__main__':
    main()
