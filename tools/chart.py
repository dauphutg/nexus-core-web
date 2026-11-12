#!/usr/bin/env python3
"""Branded XAUUSD H1 chart for the website, drawn from data/latest.json.

Usage: python3 tools/chart.py <h1.json> <latest.json> <vi|en> <out.png> [logo.png]
  h1.json     = mcp-tv-get-ohlcv OANDA:XAUUSD 1h format columns (key "bars"), >= 100 bars
  latest.json = the plan the website shows (zones, targets, scenarios)
Writes TWO images: <out.png> (wide, for desktop and social cards) and <out>-m.png (portrait, zoomed in,
larger text – shown on phones). Only closed H1 candles are drawn. No network access.
"""
import json, sys, time, math, datetime as dt
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from PIL import Image

h1f, planf, lang, outf = sys.argv[1:5]
logof = sys.argv[5] if len(sys.argv) > 5 else None
UP, DN, GRAY, TXT, ORG, NAVY, GOLD = '#089981', '#F23645', '#787B86', '#131722', '#E8A317', '#0C2237', '#E3B341'
P = json.load(open(planf, encoding='utf-8'))
L = lambda o: (o or {}).get(lang) or (o or {}).get('en') or ''
num = lambda v: (f'{v:,.1f}' if round(v % 1, 2) else f'{v:,.0f}').replace(',', '')
fmt = (lambda v: num(v).replace('.', ',')) if lang == 'vi' else num
W = {
    'vi': dict(sell='Bán', buy='Mua', main='KỊCH BẢN CHÍNH', alt='Kịch bản phụ', key='VÙNG CHÍNH', zone='Vùng', tgt='Mục tiêu',
               ed={'0700': 'Plan sáng', '1345': 'Cập nhật 13:45', '1930': 'Plan tối'}, bias={'SELL': 'BÁN', 'BUY': 'MUA', 'TWO_WAY': '2 CHIỀU', 'STAND_ASIDE': 'ĐỨNG NGOÀI'},
               lean='nghiêng', disc='Chỉ là phân tích, không phải lời khuyên đầu tư', tz='giờ VN'),
    'en': dict(sell='Sell', buy='Buy', main='MAIN SCENARIO', alt='Alternate', key='KEY ZONE', zone='Zone', tgt='Target',
               ed={'0700': 'Morning plan', '1345': '13:45 update', '1930': 'Evening plan'}, bias={'SELL': 'SELL', 'BUY': 'BUY', 'TWO_WAY': 'TWO-WAY', 'STAND_ASIDE': 'STAND ASIDE'},
               lean='leaning', disc='Analysis only, not financial advice', tz='GMT+7'),
}[lang]
MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

def render(outf, mob):
    K = 1.3 if mob else 1.0
    B = json.load(open(h1f)); B = B.get('bars', B)
    now = time.time()
    idx = [i for i, t in enumerate(B['t']) if t + 3600 <= now][-(50 if mob else 110):]
    t = [B['t'][i] for i in idx]; o = [B['o'][i] for i in idx]; h = [B['h'][i] for i in idx]
    l = [B['l'][i] for i in idx]; c = [B['c'][i] for i in idx]
    n = len(t); fut = 24 if mob else 42; px = c[-1]; x = n - 1

    fig = plt.figure(figsize=(8, 10) if mob else (12, 7.4), dpi=150, facecolor='white')
    ax = fig.add_axes([0.03, 0.05, 0.86, 0.80] if mob else [0.035, 0.07, 0.885, 0.74])
    ax.set_facecolor('white')
    for i in range(n):
        col = UP if c[i] >= o[i] else DN
        ax.vlines(i, l[i], h[i], color=col, lw=0.9, zorder=3)
        ax.add_patch(Rectangle((i - 0.32, min(o[i], c[i])), 0.64, max(abs(c[i] - o[i]), 0.3), color=col, zorder=3))

    X0, X1 = (n - 30, n + fut) if mob else (n - 55, n + fut)
    lo_v, hi_v = (min(l[-40:]), max(h[-40:])) if mob else (min(l[-90:]), max(h[-90:]))
    vis = (lambda y: lo_v - 40 <= y <= hi_v + 40) if mob else (lambda y: lo_v - 70 <= y <= hi_v + 70)
    mz = P.get('main_zone') or {}
    shown = []
    for z in P.get('zones') or []:
        a, b = sorted([z['lo'], z['hi']])
        if not (vis(a) or vis(b)): continue
        red = z['side'] == 'SELL'; edge = DN if red else UP
        main = mz and abs(a - min(mz['lo'], mz['hi'])) < 0.01 and abs(b - max(mz['lo'], mz['hi'])) < 0.01
        watch = str(z.get('grade', '')).startswith('C')
        face = (DN if main else '#F7C6CB') if red else (UP if main else '#B7E1C4')
        ax.add_patch(Rectangle((X0, a), X1 - X0, max(b - a, 0.8), facecolor=face, alpha=0.32 if main else (0.10 if watch else 0.18), zorder=0))
        ax.add_patch(Rectangle((X0, a), X1 - X0, max(b - a, 0.8), facecolor='none', edgecolor=edge, lw=2.2 if main else 0.9,
                               alpha=1 if main else 0.65, ls='--' if watch else '-', zorder=1))
        lab = (W['key'] + ' ' if main else W['zone'] + ' ') + (W['sell'] if red else W['buy']).lower() + f' {fmt(a)}–{fmt(b)}'
        if main: lab = W['key'] + f" · {W['sell'] if red else W['buy']} {fmt(a)}–{fmt(b)}"
        ax.text(X1 - 1, (a + b) / 2, lab, ha='right', va='center', fontsize=(10 if main else 8.5) * K, color=edge,
                fontweight='bold' if main else 'normal', zorder=8, bbox=dict(fc='white', ec='none', alpha=0.92, pad=0.6))  # labels sit above the scenario arrows
        shown += [a, b]
    for tg in P.get('targets') or []:
        y = (tg['lo'] + tg['hi']) / 2
        if not vis(y): continue
        ax.hlines(y, X0, X1, color=GRAY, lw=0.9, ls=(0, (4, 3)), zorder=1)
        ax.text(X0 + 1, y, f"{W['tgt']} {tg['label']} {fmt(tg['lo']) if tg['lo'] == tg['hi'] else fmt(tg['lo']) + '–' + fmt(tg['hi'])}",
                color=GRAY, fontsize=8.5 * K, ha='left', va='bottom', zorder=8, bbox=dict(fc='white', ec='none', alpha=0.85, pad=0.4))
        shown.append(y)
    ax.axhline(px, color=GRAY, lw=0.6, ls=(0, (2, 3)))

    # scenario arrows: main = solid, alternate = dashed
    paths = []
    sc = P.get('scenarios') or []
    tg_mid = [(q['lo'] + q['hi']) / 2 for q in P.get('targets') or []]
    zl = [(min(z['lo'], z['hi']), max(z['lo'], z['hi'])) for z in P.get('zones') or []]
    def path_for(s, main):
        # The arrow's foot is where price BREAKS the zone that stands in the way – never the current price.
        # 1) scenario "path" written by the plan task: [break level, waypoint, ...] → used as is.
        # 2) otherwise: waypoints = main zone (main scenario, same side) then targets; foot = far edge of the
        #    nearest zone between the current price and the first waypoint (none in the way → current price).
        sgn = -1 if s['side'] == 'SELL' else 1
        col = (DN if sgn < 0 else UP) if main else ORG
        lab = f"{W['main'] if main else W['alt']} ~{s['prob']}%"
        pth = [float(v) for v in (s.get('path') or []) if isinstance(v, (int, float))]
        if len(pth) >= 2:
            return dict(gia=pth[1:], foot=pth[0], col=col, dut=not main, nhan=lab)
        if mz and main and ((mz['side'] == 'SELL') == (sgn < 0)) and abs((mz['lo'] + mz['hi']) / 2 - px) > 3:
            pts = [(mz['lo'] + mz['hi']) / 2]
        else:
            pts = []
        base = pts[-1] if pts else px
        goals = [g for g in tg_mid if (g - base) * sgn > 0][:2] if main else []
        if not goals: goals = [base + 22 * sgn]
        gia = pts + goals
        first, foot = gia[0], px
        up = first > px
        block = [(a, b) for a, b in zl if px < a and b < first - 2] if up else [(a, b) for a, b in zl if first + 2 < a and b < px]
        if block:
            a, b = min(block) if up else max(block)
            foot = b if up else a
        return dict(gia=gia, foot=foot, col=col, dut=not main, nhan=lab)
    if sc: paths.append(path_for(sc[0], True))
    if len(sc) > 1: paths.append(path_for(sc[1], False))

    ys = [px, lo_v, hi_v] + [g + (8 if g > px else -8) for q in paths for g in q['gia'] + [q['foot']]] + shown
    ax.set_xlim(0, n + fut); ax.set_ylim(min(ys) - 12, max(ys) + 12)
    fig.canvas.draw()
    def steep(x0, y0, prices, ang=16):
        (xa, xb), (ya, yb) = ax.get_xlim(), ax.get_ylim()
        wpx, hpx = ax.bbox.width / (xb - xa), ax.bbox.height / (yb - ya)
        pts, xx, yy = [(x0, y0)], x0, y0
        for p in prices:
            dx = max(abs(p - yy) * hpx * math.tan(math.radians(ang)) / wpx, 1.8 if mob else 2.6); xx, yy = xx + dx, p; pts.append((xx, yy))
        return pts
    used = []
    for q in paths:
        x0 = x + ((2.0 if mob else 3.0) if abs(q['foot'] - px) > 1 else 0)
        pts = steep(x0, q['foot'], q['gia']); xs, ys_ = zip(*pts); lw = 1.9 if q['dut'] else 2.3
        ax.plot(xs, ys_, color=q['col'], lw=lw, ls='--' if q['dut'] else '-', zorder=5)
        ax.plot([x0], [q['foot']], marker='o', ms=5.5 * K, mfc='white', mec=q['col'], mew=1.8, zorder=6)   # break point
        (a1, b1), (a2, b2) = pts[-2], pts[-1]
        ax.annotate('', xy=(a2, b2), xytext=(a1 + (a2 - a1) * 0.6, b1 + (b2 - b1) * 0.6), zorder=6,
                    arrowprops=dict(arrowstyle='->,head_length=0.9,head_width=0.45', color=q['col'], lw=lw, shrinkA=0, shrinkB=0))
        yy = b2
        for (lx, ly) in used:
            if abs(lx - a2) < 14 and abs(ly - yy) < 8: yy = ly - 9 if b2 <= ly else ly + 9
        used.append((a2, yy))
        up = b2 > b1
        ax.text(a2, yy + (3 if up else -3), q['nhan'], ha='center', va='bottom' if up else 'top', color=q['col'], fontsize=10 * K,
                fontweight='bold', zorder=9, bbox=dict(fc='white', ec='none', alpha=0.9, pad=1))

    ax.yaxis.tick_right(); ax.grid(color='#F0F3FA', lw=1)
    for s_ in ax.spines.values(): s_.set_color('#E0E3EB')
    tk, tl, prev = [], [], None
    for i, tt in enumerate(t):
        d = dt.datetime.fromtimestamp(tt + 7 * 3600, dt.timezone.utc)
        if d.day != prev:
            if tk and i - tk[-1] <= 8: tk.pop(); tl.pop()
            tk.append(i); tl.append(f'{d.day:02d}/{d.month:02d}' if lang == 'vi' else f'{d.day:02d} {MON[d.month-1]}')
        prev = d.day
    ax.set_xticks(tk); ax.set_xticklabels(tl, fontsize=9 * K)
    ax.tick_params(axis='y', labelsize=9 * K)
    bias = P.get('bias')
    side = P.get('lean') if bias in ('TWO_WAY', 'STAND_ASIDE') else bias
    ax.text(1.003, px, f' {fmt(px)} ', transform=ax.get_yaxis_transform(), va='center', fontsize=8.5 * K, color='white',
            bbox=dict(boxstyle='square,pad=0.2', fc=DN if side == 'SELL' else (UP if side == 'BUY' else GRAY), ec='none'))
    ax.text(0.01, 0.015, f"NEXUS CORE AI · {W['disc']}", transform=ax.transAxes, fontsize=8.5 * (1.15 if mob else 1), color=GRAY)

    # brand header band
    BY, BH = (0.885, 0.115) if mob else (0.86, 0.14)
    band = fig.add_axes([0, BY, 1, BH]); band.set_axis_off()
    band.add_patch(Rectangle((0, 0), 1, 1, transform=band.transAxes, color=NAVY))
    d0 = dt.date.fromisoformat(P['date'])
    day = f'{d0.day:02d}/{d0.month:02d}/{d0.year}' if lang == 'vi' else f"{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][d0.weekday()]} {d0.day:02d} {MON[d0.month-1]} {d0.year}"
    bl = W['bias'].get(bias, bias) + (f" · {W['lean']} {W['bias'][P['lean']]}" if bias == 'TWO_WAY' and P.get('lean') else '')
    if mob:
        band.text(0.975, 0.66, f"XAUUSD H1 · {W['ed'].get(P['edition'], P['edition'])}", ha='right', va='center', color='white', fontsize=15, fontweight='bold')
        band.text(0.975, 0.30, f"{day} · " + bl, ha='right', va='center', color=GOLD, fontsize=13.5, fontweight='bold')
    else:
        band.text(0.985, 0.62, f"XAUUSD H1 · {W['ed'].get(P['edition'], P['edition'])} · {day}", ha='right', va='center', color='white', fontsize=13, fontweight='bold')
    if not mob: band.text(0.985, 0.28, ('Xu hướng: ' if lang == 'vi' else 'Bias: ') + bl + f"  ·  {P['updated_vn'][11:]} {W['tz']}", ha='right', va='center', color=GOLD, fontsize=11, fontweight='bold')
    if logof:
        lg = Image.open(logof).convert('RGBA')
        hpx = fig.get_figheight() * fig.dpi * BH * (0.5 if mob else 0.62)
        wpx = hpx * lg.width / lg.height
        fw, fh = fig.get_figwidth() * fig.dpi, fig.get_figheight() * fig.dpi
        lax = fig.add_axes([0.025, BY + BH * (0.25 if mob else 0.19), wpx / fw, hpx / fh]); lax.set_axis_off()
        lax.imshow(lg);
    plt.savefig(outf, facecolor='white'); plt.close(fig)
    print(f'chart: {outf} | {n} bars | price {px:.1f}')


render(outf, False)
render(outf[:-4] + '-m.png' if outf.endswith('.png') else outf + '-m.png', True)
