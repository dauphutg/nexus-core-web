#!/usr/bin/env python3
"""Validate data/latest.json, data/history.json, data/signals.json before pushing.
Usage: python3 tools/check.py [site_dir]   -> exit 0 if OK, prints problems otherwise."""
import json, re, sys, os

root = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..')
errs = []
SIDES = {'SELL', 'BUY'}
BIAS = {'SELL', 'BUY', 'TWO_WAY', 'STAND_ASIDE'}

def bi(o, where):
    if not (isinstance(o, dict) and isinstance(o.get('vi'), str) and isinstance(o.get('en'), str) and o['vi'].strip() and o['en'].strip()):
        errs.append(f'{where}: cần {{"vi": "...", "en": "..."}} đủ 2 thứ tiếng')

def num(x, where):
    if not isinstance(x, (int, float)) or not (1000 < x < 20000):
        errs.append(f'{where}: giá không hợp lệ ({x!r})')

def load(name):
    try:
        with open(os.path.join(root, 'data', name), encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        errs.append(f'{name}: không đọc được JSON – {e}')
        return None

p = load('latest.json')
if p:
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', str(p.get('date', ''))): errs.append('date phải dạng yyyy-mm-dd')
    if p.get('edition') not in ('0700', '1345', '1930'): errs.append('edition phải là 0700/1345/1930')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}', str(p.get('updated_vn', ''))): errs.append('updated_vn phải dạng "yyyy-mm-dd HH:MM"')
    if p.get('bias') not in BIAS: errs.append('bias phải là SELL/BUY/TWO_WAY/STAND_ASIDE')
    if p.get('lean') not in (None, 'SELL', 'BUY'): errs.append('lean phải là SELL/BUY hoặc bỏ trống')
    for k in ('day_type', 'headline', 'invalidation', 'next_update'): bi(p.get(k), k)
    if p.get('alert') is not None: bi(p['alert'], 'alert')
    mz = p.get('main_zone')
    if mz:
        if mz.get('side') not in SIDES: errs.append('main_zone.side sai')
        num(mz.get('lo'), 'main_zone.lo'); num(mz.get('hi'), 'main_zone.hi')
    for i, z in enumerate(p.get('zones') or []):
        if z.get('side') not in SIDES: errs.append(f'zones[{i}].side sai')
        num(z.get('lo'), f'zones[{i}].lo'); num(z.get('hi'), f'zones[{i}].hi'); bi(z.get('status'), f'zones[{i}].status')
    for i, t in enumerate(p.get('targets') or []):
        num(t.get('lo'), f'targets[{i}].lo'); num(t.get('hi'), f'targets[{i}].hi')
    sc = p.get('scenarios') or []
    if not sc: errs.append('scenarios trống')
    for i, s in enumerate(sc):
        if s.get('side') not in SIDES: errs.append(f'scenarios[{i}].side sai')
        if not isinstance(s.get('prob'), (int, float)) or not 0 <= s['prob'] <= 100: errs.append(f'scenarios[{i}].prob 0–100')
        bi(s.get('text'), f'scenarios[{i}].text')
    for i, c in enumerate(p.get('context') or []):
        bi(c.get('k'), f'context[{i}].k'); bi(c.get('v'), f'context[{i}].v')
    for i, n in enumerate(p.get('news') or []):
        if n.get('impact') not in ('high', 'medium', 'low', 'holiday'): errs.append(f'news[{i}].impact sai')
        bi(n.get('text'), f'news[{i}].text')
    if p.get('chart') is not None:
        bi(p['chart'], 'chart')
        for lg in ('vi', 'en'):
            f = (p['chart'] or {}).get(lg)
            if f and not os.path.isfile(os.path.join(root, f)): errs.append(f'chart.{lg}: không có file {f}')
    if p.get('range'):
        num(p['range'].get('lo'), 'range.lo'); num(p['range'].get('hi'), 'range.hi')

h = load('history.json')
if h is not None:
    days = h.get('days')
    if not isinstance(days, list): errs.append('history.days phải là mảng')
    else:
        seen = set()
        for i, d in enumerate(days):
            if d.get('date') in seen: errs.append(f'history: trùng ngày {d.get("date")}')
            seen.add(d.get('date'))
            if d.get('result') not in (None, 'right', 'wrong', 'void'): errs.append(f'history[{i}].result sai')
            if d.get('note') is not None: bi(d['note'], f'history[{i}].note')

s = load('signals.json')
if s is not None:
    for k in ('active', 'closed'):
        if not isinstance(s.get(k), list): errs.append(f'signals.{k} phải là mảng')

if errs:
    print('LỖI:\n- ' + '\n- '.join(errs)); sys.exit(1)
print('OK')
