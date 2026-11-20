#!/usr/bin/env python3
"""data/ea-zones.json – the zones of the current plan in a machine-readable form, for the MT5 EA "NexusWebTKG".

Usage:  python3 tools/ea_zones.py <repo root> [plan json] [output json]
        (defaults: <root>/data/latest.json → <root>/data/ea-zones.json)

The zone list and every level (edge, void, t1) come from tools/grade.py (zone_levels), the same function that grades
the public track record – no rule is copied here. A break-and-retest zone keeps its "trigger" key
({"tf": "M15", "close_below": L} or "close_above"); EA v2.06 waits for that close (beyond L by more than 1 dollar). The EA compares date / edition / updated_vn with data/latest.json
and ignores this file when they differ.
"""
import importlib.util, json, os, sys


def load_grade(root):
    spec = importlib.util.spec_from_file_location('nc_grade', os.path.join(root, 'tools', 'grade.py'))
    g = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(g)
    return g


def ea_zones(p, g):
    zones = []
    if p.get('bias') != 'STAND_ASIDE':
        mz = p.get('main_zone')
        for z in p.get('zones') or []:
            # main zone: same test as grade_plan_zones in tools/grade.py
            main = bool(mz) and z.get('side') == mz.get('side') and abs(float(z['lo']) - float(mz['lo'])) < 0.05 and abs(float(z['hi']) - float(mz['hi'])) < 0.05
            lv = g.zone_levels(p, z, main)
            if not lv: continue
            side, lo, hi, void, t1 = lv
            ez = {'side': side, 'lo': lo, 'hi': hi, 'edge': lo if side == 'SELL' else hi,
                  'void': void, 't1': t1, 'main': main, 'grade': z.get('grade')}
            if g.trigger_of(z):   # break-and-retest zone (EA v2.06): inactive until an M15 close beyond the level by > 1 dollar
                ez['main'] = False
                ez['trigger'] = dict(z['trigger'])
            zones.append(ez)
    return {'v': 1, 'rules': g.RULES, 'date': p['date'], 'edition': p['edition'], 'updated_vn': p['updated_vn'],
            'daily_close_vn': g.daily_close(p['date']).astimezone(g.VN).strftime('%Y-%m-%d %H:%M'),
            'bias': p.get('bias'), 'zones': zones}


def write(root, src=None, out=None):
    src = src or os.path.join(root, 'data', 'latest.json')
    out = out or os.path.join(root, 'data', 'ea-zones.json')
    g = load_grade(root)
    p = json.load(open(src, encoding='utf-8'))
    d = ea_zones(p, g)
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(f"ea-zones: {d['date']} {d['edition']} – {len(d['zones'])} zone(s) → {out}")
    return d


if __name__ == '__main__':
    a = sys.argv[1:]
    write(a[0] if a else '.', a[1] if len(a) > 1 else None, a[2] if len(a) > 2 else None)
