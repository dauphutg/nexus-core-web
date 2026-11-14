#!/usr/bin/env python3
"""Grade every published plan against real 15-minute XAUUSD candles – wins, losses and misses all stay on the record.

  python3 tools/grade.py <site_dir> <m15.json> [--now <unix>]

<m15.json>: TradingView OHLCV for OANDA:XAUUSD 15m (rows [{t,o,h,l,c}] or columns {t:[],o:[],...}; may be nested under "bars").
Reads data/plans/*.json, writes data/grades.json. Only plans whose grading window has fully closed are graded;
a plan already graded is never changed (fix by hand only if the candles were wrong).

Rules v2 (13/11/2026 – the same text is shown on the Track Record pages):
- Every tradeable zone of a plan is graded on its own: the main zone plus every other zone with a published invalidation
  level. Watch-only zones and zones that are "only in play after…" a break are not scored.
- Touch window: from the plan's publish time until the next plan of the same day replaces it, or the daily close
  (17:00 New York). A zone counts only if price trades into it inside that window.
- After the touch the zone is followed until the daily close, even if a newer plan is published: Target 1 first → "hit";
  a 15-minute CLOSE beyond the zone's invalidation level first → "void" (-1R). Targets only count from the candle after the
  touch; on the same candle the invalidation wins. Neither → "expired", scored at the daily close (capped -1R … Target 1 R).
- R from the zone edge price touches first (SELL: lower edge, BUY: upper edge): reward / (distance to invalidation).
- The same zone repeated in a later update of the same day is counted once (where it was first reached).
- Plan result = its counted zones: all hit → hit, all void → void, all expired → expired, otherwise mixed; plan R = sum.
- STAND_ASIDE plans → "aside", not scored.
- MFE (maximum favourable excursion), shown separately and never mixed into R: the furthest price travelled in the
  zone's direction from the zone edge, from the touch until the invalidation close or the daily close.
- Near-zone reaction (added 14/11/2026, label only – never counted as a touch, never added to R or the hit rate):
  a zone not reached whose closest approach inside the touch window was within NEAR (2.00 dollars) of its edge records
  "near" = {gap, at, price, move}: move = furthest price then travelled in the zone's direction from that closest price,
  until a 15-minute close beyond the invalidation level or the daily close. Back-filled once on earlier no-touch zones
  when the candles cover them (results and R unchanged).
"""
import glob, json, os, re, sys, datetime as dt
from zoneinfo import ZoneInfo

VN = dt.timezone(dt.timedelta(hours=7))
NY = ZoneInfo('America/New_York')
ED_ORDER = ['0700', '1345', '1930']
BAR = 900  # seconds in a 15-minute candle
NEAR = 2.0  # dollars: closest approach to a zone edge that still earns the "near-zone reaction" label


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


RULES = 2
SKIP = re.compile(r'watch only|not active|only in play|only after|no entry', re.I)


def zone_levels(p, z, main):
    """(side, lo, hi, void, t1) for a gradable zone, else None."""
    side = z.get('side')
    if side not in ('SELL', 'BUY'): return None
    lo, hi = sorted([float(z['lo']), float(z['hi'])])
    st = (z.get('status') or {}).get('en', '') if isinstance(z.get('status'), dict) else str(z.get('status') or '')
    if not main and (str(z.get('grade', '')).upper().startswith('C') or SKIP.search(st)): return None
    cand = []
    if isinstance(z.get('void'), (int, float)): cand.append(float(z['void']))
    if main and isinstance(p.get('void'), (int, float)): cand.append(float(p['void']))
    cand += [float(m.group(2)) for m in re.finditer(r'close (above|below) (\d{4,5}(?:\.\d+)?)', st)]
    if main:
        inv = p.get('invalidation') or {}
        cand += nums(inv.get('en') if isinstance(inv, dict) else str(inv))
    void = next((v for v in cand if (v > hi if side == 'SELL' else v < lo)), None)
    tg = [x for t in p.get('targets') or [] for x in (t['lo'], t['hi'])]
    if isinstance(z.get('t1'), (int, float)): t1 = float(z['t1'])
    elif side == 'SELL': t1 = max([x for x in tg if x < lo], default=None)
    else: t1 = min([x for x in tg if x > hi], default=None)
    if void is None or t1 is None: return None
    return side, lo, hi, void, t1


def grade_zone(side, lo, hi, void, t1, bars, start, touch_end, end):
    """Touch must happen in [start, touch_end); outcome followed until end (daily close)."""
    edge = lo if side == 'SELL' else hi
    risk = abs(void - edge)
    r_hit = round(abs(edge - t1) / risk, 2) if risk else 0
    w = [b for b in bars if b['t'] >= start and b['t'] + BAR <= end]
    base = {'side': side, 'zone': [lo, hi], 'edge': edge, 'void': void, 't1': t1}
    touch = next((i for i, b in enumerate(w) if b['t'] < touch_end and ((side == 'SELL' and b['h'] >= lo) or (side == 'BUY' and b['l'] <= hi))), None)
    if touch is None:
        out = dict(base, result='no_touch', r=0)
        nr = near_reaction(side, lo, hi, void, w, touch_end)
        if nr: out['near'] = nr
        return out
    base['touched'] = fmt_vn(w[touch]['t'])
    def mfe(upto):
        seg = w[touch:upto + 1]
        mv = (edge - min(b['l'] for b in seg)) if side == 'SELL' else (max(b['h'] for b in seg) - edge)
        mv = max(0.0, round(mv, 2))
        return {'best': mv, 'best_r': round(mv / risk, 2) if risk else None}
    def void_at(k):
        return next((j for j in range(k, len(w)) if (side == 'SELL' and w[j]['c'] > void) or (side == 'BUY' and w[j]['c'] < void)), len(w) - 1)
    for i in range(touch, len(w)):
        b = w[i]
        if (side == 'SELL' and b['c'] > void) or (side == 'BUY' and b['c'] < void):
            return dict(base, result='void', r=-1.0, at=fmt_vn(b['t'] + BAR), **mfe(i))
        if i > touch and ((side == 'SELL' and b['l'] <= t1) or (side == 'BUY' and b['h'] >= t1)):
            return dict(base, result='hit', r=r_hit, at=fmt_vn(b['t']), **mfe(void_at(i)))
    last = w[-1]['c']
    r = (edge - last) / risk if side == 'SELL' else (last - edge) / risk
    return dict(base, result='expired', r=round(max(-1.0, min(r_hit, r)), 2), last=last, **mfe(len(w) - 1))


def near_reaction(side, lo, hi, void, w, touch_end):
    """Label for a zone missed by <= NEAR dollars: closest approach in the touch window, then the move in the zone's direction."""
    tw = [i for i, b in enumerate(w) if b['t'] < touch_end]
    if not tw: return None
    if side == 'SELL':
        k = max(tw, key=lambda i: (w[i]['h'], -i)); px = w[k]['h']; gap = lo - px
    else:
        k = min(tw, key=lambda i: (w[i]['l'], i)); px = w[k]['l']; gap = px - hi
    if gap < 0 or gap > NEAR: return None
    end = next((j for j in range(k, len(w)) if (side == 'SELL' and w[j]['c'] > void) or (side == 'BUY' and w[j]['c'] < void)), len(w) - 1)
    seg = w[k:end + 1]
    mv = (px - min(b['l'] for b in seg)) if side == 'SELL' else (max(b['h'] for b in seg) - px)
    return {'gap': round(gap, 2), 'at': fmt_vn(w[k]['t']), 'price': px, 'move': max(0.0, round(mv, 2))}


def backfill_near(plans, grades, bars):
    """Add the near-zone label to earlier no-touch zones (rules v2) when the candles cover them. Results and R never change."""
    added = []
    for k, g in grades.items():
        if g.get('rules') != RULES or k not in plans or not g.get('zones') or not g.get('window'): continue
        p = plans[k]
        start = int(vn_dt(g['window'][0]).timestamp()); touch_end = int(vn_dt(g['window'][1]).timestamp())
        end = int(daily_close(p['date']).timestamp())
        if start < bars[0]['t'] or end > bars[-1]['t'] + BAR: continue
        w = [b for b in bars if b['t'] >= start and b['t'] + BAR <= end]
        for z in g['zones']:
            if z.get('result') != 'no_touch' or 'near' in z or z.get('void') is None: continue
            nr = near_reaction(z['side'], z['zone'][0], z['zone'][1], z['void'], w, touch_end)
            if nr: z['near'] = nr; added.append(f"{k} {z['zone'][0]}-{z['zone'][1]}")
        set_plan_near(g)
    return added


def set_plan_near(g):
    """Plan-level copy of the best near-zone reaction, only when no zone of the plan was reached."""
    if g.get('result') != 'no_touch': return
    ns = [z['near'] for z in g.get('zones') or [] if z.get('near')]
    if ns: g['near'] = max(ns, key=lambda n: n['move'])


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
        if k in grades and grades[k].get('rules') == RULES: continue   # graded under the current rules: never changed
        p = plans[k]
        start = int(vn_dt(p['updated_vn']).timestamp())
        end = int(daily_close(p['date']).timestamp())
        later = [e for e in ED_ORDER[ED_ORDER.index(p['edition']) + 1:] if f"{p['date']}-{e}" in plans]
        touch_end = min(end, int(vn_dt(plans[f"{p['date']}-{later[0]}"]['updated_vn']).timestamp())) if later else end
        if end > covered_to: continue          # day not closed yet
        if start < covered_from: print('skip (candles do not reach back):', k); continue
        w = [b for b in bars if b['t'] >= start and b['t'] + BAR <= touch_end]
        if not w: print('skip (no candles in window):', k); continue
        g = {'rules': RULES, 'window': [fmt_vn(start), fmt_vn(touch_end)], 'followed_to': fmt_vn(end),
             'high': max(b['h'] for b in w), 'low': min(b['l'] for b in w), 'last': w[-1]['c']}
        mz = p.get('main_zone')
        if p.get('bias') == 'STAND_ASIDE' or not p.get('zones'):
            g.update(result='aside', r=None, zones=[])
        else:
            # zones already reached in an earlier plan of the same day are counted there
            earlier = [grades[f"{p['date']}-{e}"] for e in ED_ORDER[:ED_ORDER.index(p['edition'])] if f"{p['date']}-{e}" in grades]
            seen = {(z['side'], z['zone'][0], z['zone'][1]) for eg in earlier for z in eg.get('zones', []) if z['result'] != 'no_touch'}
            zs = []
            for z in p['zones']:
                main = bool(mz) and z.get('side') == mz.get('side') and abs(float(z['lo']) - float(mz['lo'])) < 0.05 and abs(float(z['hi']) - float(mz['hi'])) < 0.05
                lv = zone_levels(p, z, main)
                if not lv: continue
                side, lo, hi, void, t1 = lv
                if (side, lo, hi) in seen:
                    zs.append({'side': side, 'zone': [lo, hi], 'main': main, 'grade': z.get('grade'), 'result': 'counted_earlier', 'r': None}); continue
                zg = grade_zone(side, lo, hi, void, t1, bars, start, touch_end, end)
                zg.update(main=main, grade=z.get('grade'))
                zs.append(zg)
            zs.sort(key=lambda z: (not z['main'], z['zone'][0]))
            counted = [z for z in zs if z['result'] in ('hit', 'void', 'expired')]
            res = {z['result'] for z in counted}
            g['zones'] = zs
            if not counted: g.update(result='no_touch', r=0)
            else:
                g.update(result=res.pop() if len(res) == 1 else 'mixed', r=round(sum(z['r'] for z in counted), 2))
                top = max(counted, key=lambda z: z.get('best') or 0)
                g.update(best=top.get('best'), best_r=top.get('best_r'))
            if mz:   # summary of the main zone (kept for older readers)
                m = next((z for z in zs if z['main']), None)
                if m: g.update({kk: m[kk] for kk in ('side', 'zone', 'edge', 'void', 't1') if kk in m})
        set_plan_near(g)
        g['graded_utc'] = dt.datetime.fromtimestamp(now, dt.timezone.utc).strftime('%Y-%m-%dT%H:%MZ')
        if k in grades: g['regraded'] = 'rules v2 (13/11/2026)'
        grades[k] = g
        done.append(f"{k} {g['result']} {g['r']}" + (f" MFE {g.get('best')}" if g.get('best') is not None else ''))
    nb = backfill_near(plans, grades, bars)
    if nb: print('near-zone labels added:', ', '.join(nb))
    with open(gpath, 'w', encoding='utf-8') as f:
        json.dump(dict(sorted(grades.items())), f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('graded:', ', '.join(done) if done else 'nothing new')


if __name__ == '__main__':
    main()
