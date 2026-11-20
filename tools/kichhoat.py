#!/usr/bin/env python3
"""Break-and-retest zones ("VÙNG CHỜ PHÁ", added 20/11/2026) from the plan text into data/latest.json.

Usage:  python3 tools/kichhoat.py <repo root> <plan.md> <0700|1345|1930> [latest.json]

Reads every line of the edition's part of the plan that starts with "KICHHOAT:", e.g.
    KICHHOAT: SELL 3968.8–3983.8 | trigger M15 close_below 3968.8 | void 3983.8 | t1 3938.8
    KICHHOAT: BUY 4010.2–4025.2 | trigger M15 close_above 4025.2 | void 4010.2 | t1 4055.2
and adds one zone per line to "zones" (never to main_zone; bias and the other zones are not touched):
    {"side", "lo", "hi", "void", "t1", "grade": "B", "trigger": {"tf": "M15", "close_below"|"close_above": L},
     "status": {vi, en, ar, zh}}
The status text uses the same "valid only after an M15 close below …" wording the site already shows for break zones,
plus "not active yet". A zone already listed with the same side and edges is turned into the trigger zone instead of
being added twice. A line that does not match the format is skipped and logged; the rest of the plan is unaffected.

Edition parts: 0700 = text before "## Cập nhật 13:45"; 1345 = the "## Cập nhật 13:45" section; 1930 = the whole file.
Prints "kichhoat: <n> zone(s) added, <m> line(s) skipped".
"""
import json, os, re, sys

LINE = re.compile(r'^\s*KICHHOAT:\s*(SELL|BUY)\s+([\d.]+)\s*[–-]\s*([\d.]+)\s*\|\s*trigger\s+(M15)\s+(close_below|close_above)\s+([\d.]+)'
                  r'\s*\|\s*void\s+([\d.]+)\s*\|\s*t1\s+([\d.]+)\s*$', re.I)
UPD = re.compile(r'^##\s*Cập nhật 13:45', re.M)


def part(text, edition):
    m = UPD.search(text)
    if edition == '0700': return text[:m.start()] if m else text
    if edition == '1345':
        if not m: return ''
        rest = text[m.end():]
        nxt = re.search(r'^##\s', rest, re.M)          # stop at the next "## " section, if any
        return rest[:nxt.start()] if nxt else rest
    return text


def f(x):
    return ('%g' % round(float(x), 1))


def status(side, kind, L, void, t1):
    below = kind == 'close_below'
    L, void, t1 = f(L), f(void), f(t1)
    return {
        'vi': f"Vùng chờ phá, chưa kích hoạt; chỉ có hiệu lực sau khi M15 đóng {'dưới' if below else 'trên'} {L}; "
              f"huỷ nếu M15 đóng {'trên' if side == 'SELL' else 'dưới'} {void}; mục tiêu {t1}",
        'en': f"Break-and-retest zone, not active yet; valid only after an M15 close {'below' if below else 'above'} {L}; "
              f"void on an M15 close {'above' if side == 'SELL' else 'below'} {void}; target {t1}",
        'ar': f"منطقة انتظار الكسر، غير مفعّلة بعد، صالحة فقط بعد إغلاق M15 {'أسفل' if below else 'فوق'} {L}؛ "
              f"تُلغى بإغلاق M15 {'فوق' if side == 'SELL' else 'أسفل'} {void}؛ الهدف {t1}",
        'zh': f"等待突破區域，尚未啟動，僅在 M15 收在 {L} 之{'下' if below else '上'}後生效；"
              f"M15 收在 {void} 之{'上' if side == 'SELL' else '下'}則失效；目標 {t1}",
    }


def parse(text, edition, log=print):
    zones, skipped = [], 0
    for ln in part(text, edition).splitlines():
        if not ln.strip().upper().startswith('KICHHOAT:'): continue
        m = LINE.match(ln)
        if not m:
            skipped += 1; log(f'kichhoat: skipped (format): {ln.strip()}'); continue
        side, a, b, tf, kind, L, void, t1 = m.groups()
        side, kind = side.upper(), kind.lower()
        lo, hi = sorted([float(a), float(b)])
        L, void, t1 = float(L), float(void), float(t1)
        ok = (void >= hi and t1 < lo) if side == 'SELL' else (void <= lo and t1 > hi)
        if not ok or not (lo - 1 <= L <= hi + 1):
            skipped += 1; log(f'kichhoat: skipped (levels do not fit the side): {ln.strip()}'); continue
        zones.append({'side': side, 'lo': lo, 'hi': hi, 'grade': 'B', 'void': void, 't1': t1,
                      'trigger': {'tf': tf.upper(), kind: L}, 'status': status(side, kind, L, void, t1)})
    return zones, skipped


def apply(p, zones):
    out = list(p.get('zones') or [])
    for z in zones:
        same = next((x for x in out if x.get('side') == z['side'] and abs(float(x['lo']) - z['lo']) < 0.05 and abs(float(x['hi']) - z['hi']) < 0.05), None)
        if same is not None: same.clear(); same.update(z)
        else: out.append(z)
    p['zones'] = out
    return p


def main():
    a = sys.argv[1:]
    if len(a) < 3 or a[2] not in ('0700', '1345', '1930'): raise SystemExit(__doc__)
    root, plan, ed = a[0], a[1], a[2]
    lp = a[3] if len(a) > 3 else os.path.join(root, 'data', 'latest.json')
    zones, skipped = parse(open(plan, encoding='utf-8').read(), ed)
    if zones:
        p = json.load(open(lp, encoding='utf-8'))
        apply(p, zones)
        with open(lp, 'w', encoding='utf-8') as fh:
            json.dump(p, fh, ensure_ascii=False, indent=1)
            fh.write('\n')
    print(f'kichhoat: {len(zones)} zone(s) added, {skipped} line(s) skipped')


if __name__ == '__main__':
    main()
