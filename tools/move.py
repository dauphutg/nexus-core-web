#!/usr/bin/env python3
"""Numbers for a "Why gold moved" page, computed from real 15-minute candles (no guessing).

  python3 tools/move.py <site_dir> <m15.json> [--day YYYY-MM-DD]

Trading day D = 17:00 New York on D-1 → 17:00 New York on D (the gold daily candle). Default D = the latest
day fully covered by the candles. Writes data/moves/<D>.json with the numbers and EMPTY text fields
("tag", "headline", "reasons", "sources") that the scheduled task fills from real news before building.
Refuses to overwrite a file that already has reasons.
"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from grade import load_bars, BAR  # same candle reader as the grader

NY = ZoneInfo('America/New_York')
VN = dt.timezone(dt.timedelta(hours=7))


def window(day):
    d = dt.date.fromisoformat(day)
    end = dt.datetime(d.year, d.month, d.day, 17, 0, tzinfo=NY)
    start = dt.datetime.combine(d - dt.timedelta(days=1), dt.time(17, 0), tzinfo=NY)
    return int(start.timestamp()), int(end.timestamp())


def main():
    a = sys.argv[1:]
    if len(a) < 2: raise SystemExit(__doc__)
    root, src = a[0], a[1]
    now = int(dt.datetime.now(dt.timezone.utc).timestamp())
    bars = [b for b in load_bars(src) if b['t'] + BAR <= now]
    if '--day' in a:
        day = a[a.index('--day') + 1]
    else:
        last_end = bars[-1]['t'] + BAR
        d = dt.datetime.fromtimestamp(last_end, NY).date()
        while True:
            s, e = window(d.isoformat())
            if e <= last_end and d.weekday() < 5: break
            d -= dt.timedelta(days=1)
        day = d.isoformat()
    s, e = window(day)
    w = [b for b in bars if s <= b['t'] and b['t'] + BAR <= e]
    if len(w) < 40: raise SystemExit(f'not enough candles for {day} ({len(w)})')
    o, c = w[0]['o'], w[-1]['c']
    hi, lo = max(b['h'] for b in w), min(b['l'] for b in w)
    hours = {}
    for b in w:
        k = b['t'] - b['t'] % 3600
        h = hours.setdefault(k, {'o': b['o'], 'c': b['c']})
        h['c'] = b['c']
    bk = max(hours, key=lambda k: abs(hours[k]['c'] - hours[k]['o']))
    path = os.path.join(root, 'data', 'moves', f'{day}.json')
    if os.path.exists(path):
        old = json.load(open(path, encoding='utf-8'))
        if old.get('reasons'): raise SystemExit(f'{path} already written – not overwriting')
    out = {'date': day, 'open': round(o, 2), 'close': round(c, 2), 'high': round(hi, 2), 'low': round(lo, 2),
           'change': round(c - o, 2), 'change_pct': round((c - o) / o * 100, 2),
           'biggest_hour': {'start_vn': dt.datetime.fromtimestamp(bk, VN).strftime('%Y-%m-%d %H:%M'),
                            'move': round(hours[bk]['c'] - hours[bk]['o'], 2)},
           'candles': len(w), 'tag': '', 'headline': None, 'reasons': [], 'sources': []}
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump(out, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('move:', day, f"{out['change_pct']:+}%", 'open', out['open'], 'close', out['close'], '->', path)


if __name__ == '__main__':
    main()
