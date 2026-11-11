#!/usr/bin/env python3
"""Grade every published plan against real 15-minute XAUUSD candles – wins, losses and misses all stay on the record.

  python3 tools/grade.py <site_dir> <m15.json> [--now <unix>]

<m15.json>: TradingView OHLCV for OANDA:XAUUSD 15m (rows [{t,o,h,l,c}] or columns {t:[],o:[],...}; may be nested under "bars").
Reads data/plans/*.json, writes data/grades.json. Only plans whose grading window has fully closed are graded;
a plan already graded is never changed (fix by hand only if the candles were wrong).

Rules (the same text is shown on the Track Record pages):
- Window: from the plan's publish time until the next plan of the same day replaces it, or the daily close
  (17:00 New York time) – whichever comes first.
- Zone reached = a candle trades into the main zone. Never reached → "no_touch" (0R).
- After the zone is reached, whichever comes first decides: Target 1 → "hit"; a 15-minute CLOSE beyond the
  invalidation level → "void" (-1R). Targets only count from the candle after the touch; on the same candle the
  invalidation wins (ties count against the plan).
- Neither before the window ends → "expired", scored at the last close (capped between -1R and the Target 1 R).
- R measured from the zone edge price touches first (SELL: lower edge, BUY: upper edge): reward / (distance to invalidation).
- STAND_ASIDE plans (or plans without a main zone) → "aside", not scored.
- Extra, shown separately and labelled as such (never mixed into R): "best move after the zone" = the furthest price
  travelled in the plan's direction from the zone edge, from the touch until the invalidation close or the end of the window.
"""
import glob, json, os, re, sys, datetime as dt
from zoneinfo import ZoneInfo

VN = dt.timezone(dt.timedelta(hours=7))
NY = ZoneInfo('America/New_York')
ED_ORDER = ['0700', '1345', '1930']
BAR = 900  # seconds in a 15-minute candle


def load_bars(path):
    d = json.load(open(path, encoding='utf-8'))
    for k in ('bars', 'data', 'result'):
        if isinstance(d, dict) and k in d and not ('t' in d and isinstance(d['t'], list)):
            d = d[k]
    rows = []
    if isinstance(d, dict) and isinstance(d.get('t'), list):
        for i in range(len(d['t'])):
            rows.append({x: d[x][i] for x in ('t', 'o', 'h', 'l', 'c')})
    elif isinstance(d, list):
        rows = [{x: r[x] for x in ('t', 'o', 'h', 'l', 'c')} for r in d]
    else:
        raise SystemExit('m15 file: unknown format')
    rows = [{'t': int(r['t']), 'o': float(r['o']), 'h': float(r['h']), 'l': float(r['l']), 'c': float(r['c'])} for r in rows]
    rows.sort(key=lambda r: r['t'])
    out, seen = [], set()
    for r in rows:
        if r['t'] not in seen: seen.add(r['t']); out.append(r)
    return out


def vn_dt(s): return dt.datetime.strptime(s, '%Y-%m-%d %H:%M').replace(tzinfo=VN)


def daily_close(date_str):
    d = dt.date.fromisoformat(date_str)
    return dt.datetime(d.year, d.month, d.day, 17, 0, tzinfo=NY)


def nums(text):
    return [float(x) for x in re.findall(r'(?<![\d.])(\d{4,5}(?:\.\d+)?)(?![\d.])', text or '')]


def levels(p):
    """main zone side, edge, invalidation level, target 1 – or None when the plan cannot be scored."""
    mz = p.get('main_zone')
    if p.get('bias') == 'STAND_ASIDE' or not mz or mz.get('side') not in ('SELL', 'BUY'): return None
    side, lo, hi = mz['side'], float(mz['lo']), float(mz['hi'])
    inv = p.get('invalidation') or {}
    cand = [p['void']] if isinstance(p.get('void'), (int, float)) else []
    cand += nums(inv.get('en') if isinstance(inv, dict) else str(inv))
    rg = p.get('range') or {}
    if side == 'SELL':
        void = next((float(v) for v in cand if v > hi), None) or (float(rg['hi']) if rg.get('hi') and rg['hi'] > hi else None)
        tg = sorted([max(t['lo'], t['hi']) for t in p.get('targets') or [] if max(t['lo'], t['hi']) < lo], reverse=True)
        t1 = tg[0] if tg else (float(rg['lo']) if rg.get('lo') and rg['lo'] < lo else None)
        edge = lo
    else:
        void = next((float(v) for v in cand if v < lo), None) or (float(rg['lo']) if rg.get('lo') and rg['lo'] < lo else None)
        tg = sorted([min(t['lo'], t['hi']) for t in p.get('targets') or [] if min(t['lo'], t['hi']) > hi])
        t1 = tg[0] if tg else (float(rg['hi']) if rg.get('hi') and rg['hi'] > hi else None)
        edge = hi
    if void is None or t1 is None: return None
    return side, lo, hi, edge, void, t1


def fmt_vn(ts): return dt.datetime.fromtimestamp(ts, VN).strftime('%Y-%m-%d %H:%M')


def grade(p, bars, start, end):
    lv = levels(p)
    if not lv: return {'result': 'aside', 'r': None}
    side, lo, hi, edge, void, t1 = lv
    risk = abs(void - edge)
    r_hit = round(abs(edge - t1) / risk, 2) if risk else 0
    w = [b for b in bars if b['t'] >= start and b['t'] + BAR <= end]
    base = {'side': side, 'zone': [lo, hi], 'edge': edge, 'void': void, 't1': t1,
            'window': [fmt_vn(start), fmt_vn(end)], 'bars': len(w)}
    if not w: return dict(base, result='no_data', r=None)
    base.update({'high': max(b['h'] for b in w), 'low': min(b['l'] for b in w), 'last': w[-1]['c']})
    touch = None
    for i, b in enumerate(w):
        if (side == 'SELL' and b['h'] >= lo) or (side == 'BUY' and b['l'] <= hi):
            touch = i; break
    if touch is None: return dict(base, result='no_touch', r=0)
    base['touched'] = fmt_vn(w[touch]['t'])

    def best(upto):   # furthest favourable move from the zone edge, touch candle .. upto (inclusive)
        seg = w[touch:upto + 1]
        mv = (edge - min(b['l'] for b in seg)) if side == 'SELL' else (max(b['h'] for b in seg) - edge)
        mv = max(0.0, round(mv, 2))
        return {'best': mv, 'best_r': round(mv / risk, 2) if risk else None}
    def void_at(k):   # index of the first invalidation close from k on, else the last candle
        return next((j for j in range(k, len(w)) if (side == 'SELL' and w[j]['c'] > void) or (side == 'BUY' and w[j]['c'] < void)), len(w) - 1)
    for i in range(touch, len(w)):
        b = w[i]
        if (side == 'SELL' and b['c'] > void) or (side == 'BUY' and b['c'] < void):
            return dict(base, result='void', r=-1.0, at=fmt_vn(b['t'] + BAR), **best(i))
        if i > touch and ((side == 'SELL' and b['l'] <= t1) or (side == 'BUY' and b['h'] >= t1)):
            return dict(base, result='hit', r=r_hit, at=fmt_vn(b['t']), **best(void_at(i)))
    last = w[-1]['c']
    r = (edge - last) / risk if side == 'SELL' else (last - edge) / risk
    return dict(base, result='expired', r=round(max(-1.0, min(r_hit, r)), 2), **best(len(w) - 1))


def main():
    a = sys.argv[1:]
    if len(a) < 2: raise SystemExit(__doc__)
    root, m15 = a[0], a[1]
    now = int(a[a.index('--now') + 1]) if '--now' in a else int(dt.datetime.now(dt.timezone.utc).timestamp())
    bars = [b for b in load_bars(m15) if b['t'] + BAR <= now]   # drop the candle still forming
    if not bars: raise SystemExit('no candles')
    plans = {}
    for f in glob.glob(os.path.join(root, 'data', 'plans', '*.json')):
        p = json.load(open(f, encoding='utf-8'))
        plans[f"{p['date']}-{p['edition']}"] = p
    gpath = os.path.join(root, 'data', 'grades.json')
    grades = json.load(open(gpath, encoding='utf-8')) if os.path.exists(gpath) else {}
    covered_to, covered_from = bars[-1]['t'] + BAR, bars[0]['t']
    done = []
    for k in sorted(plans):
        if k in grades: continue
        p = plans[k]
        start = int(vn_dt(p['updated_vn']).timestamp())
        end = int(daily_close(p['date']).timestamp())
        later = [e for e in ED_ORDER[ED_ORDER.index(p['edition']) + 1:] if f"{p['date']}-{e}" in plans]
        if later: end = min(end, int(vn_dt(plans[f"{p['date']}-{later[0]}"]['updated_vn']).timestamp()))
        if end > covered_to: continue          # window still open
        if start < covered_from: print('skip (candles do not reach back):', k); continue
        g = grade(p, bars, start, end)
        if g['result'] == 'no_data': print('skip (no candles in window):', k); continue
        g['graded_utc'] = dt.datetime.fromtimestamp(now, dt.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
        grades[k] = g
        done.append(f"{k} {g['result']} {g['r']}")
    with open(gpath, 'w', encoding='utf-8') as f:
        json.dump(dict(sorted(grades.items())), f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('graded:', ', '.join(done) if done else 'nothing new')


if __name__ == '__main__':
    main()
