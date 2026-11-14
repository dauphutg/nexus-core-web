#!/usr/bin/env python3
"""Before / after image for every graded plan: the chart exactly as published (BEFORE) above the same plan
replayed on real 15-minute candles until its session ended (AFTER), with an arrow at the moment the plan was drawn.

  python3 tools/review.py <site_dir> <m15.json> [--redo]

Reads data/plans/*.json, data/grades.json, data/charts/<key>-<lang>.png (the published chart).
Writes data/charts/<key>-<lang>-review.png (vi, en) for graded plans that do not have one yet (--redo: rebuild all).
Skips a plan when the published chart is missing or the candles do not cover its window. No network access.
Everything drawn comes from the candles and data/grades.json – nothing is estimated.
"""
import glob, json, os, sys, datetime as dt
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from PIL import Image, ImageDraw, ImageFont

UP, DN, GRAY, TXT, NAVY, GOLD, ORG = '#089981', '#F23645', '#787B86', '#131722', '#0C2237', '#E3B341', '#E8A317'
VN = dt.timezone(dt.timedelta(hours=7))
BAR = 900
W = {
    'vi': dict(before='TRƯỚC', after='SAU', b_sub='lúc vẽ {t}', a_sub='hết phiên {t}',
               drawn='Lúc vẽ plan {t}', end='Hết phiên {t}', ed={'0700': 'Plan sáng', '1345': 'Cập nhật 13:45', '1930': 'Plan tối'},
               res={'hit': 'Chạm mục tiêu 1', 'void': 'Bị huỷ', 'expired': 'Chốt cuối phiên', 'no_touch': 'Giá không tới vùng',
                    'carried': 'Bản sau theo dõi tiếp', 'mixed': 'Có thắng có thua', 'aside': 'Đứng ngoài'},
               result='Kết quả', sell='Bán', buy='Mua', t1='Mục tiêu 1', touch='chạm vùng', ran='chạy {p} pip', near='suýt chạm · thiếu {g}',
               disc='Chấm tự động theo luật công khai · không phải lời khuyên đầu tư', tz='giờ VN', main='VÙNG CHÍNH', tgt='Mục tiêu',
               sc_main='Kịch bản chính', sc_alt='Kịch bản phụ', unknown='chưa biết giá sẽ đi thế nào', open_prev='lệnh đang mở từ bản trước', v_ok='✓ ĐÚNG', v_bad='✗ SAI', v_mix='± ĐÚNG MỘT PHẦN', v_none='○ GIÁ CHƯA TỚI VÙNG',
               bias={'SELL': 'BÁN', 'BUY': 'MUA', 'TWO_WAY': '2 CHIỀU', 'STAND_ASIDE': 'ĐỨNG NGOÀI'}, lean='nghiêng'),
    'en': dict(before='BEFORE', after='AFTER', b_sub='drawn {t}', a_sub='session end {t}',
               drawn='Plan drawn {t}', end='Session end {t}', ed={'0700': 'Morning plan', '1345': '13:45 update', '1930': 'Evening plan'},
               res={'hit': 'Target 1 reached', 'void': 'Invalidated', 'expired': 'Closed at session end', 'no_touch': 'Zone not reached',
                    'carried': 'Followed by the next update', 'mixed': 'Mixed', 'aside': 'Stood aside'},
               result='Result', sell='Sell', buy='Buy', t1='Target 1', touch='zone reached', ran='ran {p} pips', near='just missed · {g} short',
               disc='Graded automatically by published rules · not financial advice', tz='GMT+7', main='MAIN ZONE', tgt='Target',
               sc_main='Main scenario', sc_alt='Alternate', unknown='price path not known yet', open_prev='open trade from the previous update', v_ok='✓ RIGHT', v_bad='✗ WRONG', v_mix='± PARTLY RIGHT', v_none='○ ZONE NOT REACHED',
               bias={'SELL': 'SELL', 'BUY': 'BUY', 'TWO_WAY': 'TWO-WAY', 'STAND_ASIDE': 'STAND ASIDE'}, lean='leaning'),
}


def load_bars(path):
    d = json.load(open(path, encoding='utf-8'))
    for k in ('bars', 'data', 'result'):
        if isinstance(d, dict) and k in d and not ('t' in d and isinstance(d['t'], list)): d = d[k]
    if isinstance(d, dict): rows = [{x: d[x][i] for x in 'tohlc'} for i in range(len(d['t']))]
    else: rows = [{x: r[x] for x in 'tohlc'} for r in d]
    out = {}
    for r in rows: out[int(r['t'])] = {x: float(r[x]) for x in 'ohlc'} | {'t': int(r['t'])}
    return [out[t] for t in sorted(out)]


def to_h1(bars):
    """15-minute candles → H1 candles (hour buckets); the published plan charts are H1"""
    out = {}
    for b in bars:
        h = b['t'] - b['t'] % 3600
        if h not in out: out[h] = {'t': h, 'o': b['o'], 'h': b['h'], 'l': b['l'], 'c': b['c'], 'end': b['t'] + BAR}
        else:
            q = out[h]; q['h'] = max(q['h'], b['h']); q['l'] = min(q['l'], b['l']); q['c'] = b['c']; q['end'] = b['t'] + BAR
    return [out[k] for k in sorted(out)]


def ts(s): return dt.datetime.strptime(s, '%Y-%m-%d %H:%M').replace(tzinfo=VN).timestamp()
def hm(s): return s[11:16]


def fnum(v, lang):
    s = (f'{v:,.1f}' if round(v % 1, 2) else f'{v:,.0f}').replace(',', '')
    return s.replace('.', ',') if lang == 'vi' else s


def rtxt(r, lang):
    if r is None: return ''
    s = ('+' if r > 0 else '') + ('%g' % round(r, 2)) + 'R'
    return s.replace('.', ',') if lang == 'vi' else s


def verdict(g, T):
    """one-word verdict taken from the grade (never estimated)"""
    res, r = g.get('result'), g.get('r') or 0
    if res == 'hit' or (res == 'expired' and r > 0): return T['v_ok'], UP
    if res == 'void' or (res == 'expired' and r < 0): return T['v_bad'], DN
    if res == 'mixed': return T['v_mix'], GRAY
    return T['v_none'], GRAY


def panel(p, g, bars, lang, out, mode, tf='H1'):
    """mode 'before' = what was known when the plan was drawn (candles up to that moment, the plan's zones, targets and
    scenario arrows); 'after' = the same window, same scale, with the real candles to the session end and the result."""
    T = W[lang]
    after = mode == 'after'
    t_pub, t_end = ts(g['window'][0]), ts(g['window'][1])
    zs_all = [z for z in g.get('zones') or [] if z.get('zone')]
    t_first = min([t_pub] + [ts(z['touched']) for z in zs_all if z.get('touched')])
    if tf == 'H1':
        t0 = min(t_first - 6 * 3600, t_pub - 36 * 3600)
        B = [b for b in to_h1(bars) if t0 <= b['t'] and b['end'] <= t_end]
    else:
        t0 = min(t_first, t_pub - 8 * 3600) - 2 * 3600
        B = [b for b in bars if t0 <= b['t'] and b['t'] + BAR <= t_end]
    n = len(B)
    xi = lambda t: next((i for i, b in enumerate(B) if b['t'] >= t), n) - 0.5   # x of a moment (candle boundary)
    xp, xe = xi(t_pub), n - 0.5
    shown = [b for b in B if after or b['t'] < t_pub]
    lo, hi = min(b['l'] for b in B), max(b['h'] for b in B)          # same scale in both panels
    zs = zs_all   # trades carried in from the previous update were already open when this plan was drawn: shown in both panels
    fig = plt.figure(figsize=(12, 7.4), dpi=150, facecolor='white')
    ax = fig.add_axes([0.035, 0.12, 0.885, 0.69])
    ax.axvspan(xp, xe, color=GOLD, alpha=0.07, zorder=0)
    for i, b in enumerate(shown):
        col = UP if b['c'] >= b['o'] else DN
        ax.vlines(i, b['l'], b['h'], color=col, lw=0.8, zorder=3)
        ax.add_patch(Rectangle((i - 0.32, min(b['o'], b['c'])), 0.64, max(abs(b['c'] - b['o']), 0.25), color=col, zorder=3))
    ys = [lo, hi]
    inview = lambda y: lo - 25 <= y <= hi + 25
    zone_list = [z for z in zs_all if not (z.get('result') == 'no_touch' and not z.get('near') and (z['zone'][0] > hi + 15 or z['zone'][1] < lo - 15))]
    for z in zone_list: ys += z['zone']
    ys += [q['lo'] for q in p.get('targets') or [] if inview(q['lo'])]
    ymin, ymax = min(ys) - 10, max(ys) + 22
    XR = n + max(5, n * 0.25)
    def mark(z):   # target reached = star, invalidation close = cross
        if z.get('result') == 'hit' and z.get('at'):
            k = int(xi(ts(z['at'])) + 0.5)
            if 0 <= k < n: ax.plot([k], [z['t1']], marker='*', ms=20, color=UP, mec='white', mew=1, zorder=9)
        if z.get('result') == 'void' and z.get('at'):
            k = int(xi(ts(z['at'])) + 0.5) - 1
            if 0 <= k < n: ax.plot([k], [z['void']], marker='X', ms=14, color=DN, mec='white', mew=1, zorder=9)
    for z in zone_list:   # zones only, no text: the arrows are what the eye should compare
        a, c_ = z['zone']
        red = z['side'] == 'SELL'; edge = DN if red else UP
        strong = bool(z.get('main'))
        ax.add_patch(Rectangle((-0.5, a), XR, max(c_ - a, 0.8), facecolor=edge, alpha=0.16 if strong else 0.07, zorder=1))
        ax.add_patch(Rectangle((-0.5, a), XR, max(c_ - a, 0.8), facecolor='none', edgecolor=edge, lw=1.6 if strong else 0.7, alpha=0.8, zorder=1))
        if after and z.get('touched'):
            k = int(xi(ts(z['touched'])) + 0.5)
            if 0 <= k < n: ax.plot([k], [z['edge']], marker='o', ms=8, mfc='white', mec=edge, mew=2.2, zorder=7)
        if after: mark(z)
    for q in p.get('targets') or []:
        if not inview(q['lo']): continue
        ax.hlines(q['lo'], -0.5, XR, color=GRAY, lw=1, ls=(0, (4, 3)), zorder=2)
        ax.text(-0.3, q['lo'], f" {q.get('label', '')}", color=GRAY, fontsize=9, va='bottom', ha='left', zorder=8)
    # the plan's scenario arrows – identical in both panels
    cl = lambda y: max(ymin + 3, min(ymax - 3, y))
    for k_, sc in enumerate((p.get('scenarios') or [])[:2]):
        pth = [float(v) for v in sc.get('path') or [] if isinstance(v, (int, float))]
        if len(pth) < 2: continue
        col = (DN if sc['side'] == 'SELL' else UP) if k_ == 0 else ORG
        x0, x1 = xp + 0.6, xe + (XR - xe) * 0.55
        xs_ = [x0 + (x1 - x0) * m / (len(pth) - 1) for m in range(len(pth))]
        ys_ = [cl(v) for v in pth]
        lw = 3.2 if k_ == 0 else 2.4
        ax.plot(xs_, ys_, color=col, lw=lw, ls='-' if k_ == 0 else (0, (4, 2.5)), zorder=6, solid_capstyle='round')
        ax.plot([xs_[0]], [ys_[0]], marker='o', ms=7, mfc='white', mec=col, mew=2, zorder=7)
        ax.annotate('', xy=(xs_[-1], ys_[-1]), xytext=(xs_[-2] + (xs_[-1] - xs_[-2]) * 0.5, ys_[-2] + (ys_[-1] - ys_[-2]) * 0.5), zorder=7,
                    arrowprops=dict(arrowstyle='-|>,head_length=1.1,head_width=0.6', color=col, lw=lw, shrinkA=0, shrinkB=0))
    if after:
        # what price really did: from the close when the plan was drawn to the close at the session end
        # the real path after the plan: H1 closes from the moment of drawing to the session end
        pre = [b for b in B if b['t'] < t_pub]
        if pre and n - len(pre) >= 1:
            xs_r = list(range(len(pre) - 1, n)); ys_r = [B[i]['c'] for i in xs_r]
            ax.plot(xs_r, ys_r, color=NAVY, lw=3, alpha=0.85, zorder=8, solid_capstyle='round', solid_joinstyle='round')
            if len(xs_r) >= 2:
                ax.annotate('', xy=(xs_r[-1], ys_r[-1]), xytext=(xs_r[-2] + (xs_r[-1] - xs_r[-2]) * 0.4, ys_r[-2] + (ys_r[-1] - ys_r[-2]) * 0.4), zorder=8,
                            arrowprops=dict(arrowstyle='-|>,head_length=1.0,head_width=0.55', color=NAVY, lw=3, alpha=0.85, shrinkA=0, shrinkB=0))
        vt, vc = verdict(g, T)
        ax.text(0.015, 0.96, vt, transform=ax.transAxes, ha='left', va='top', fontsize=17, fontweight='bold', color='white', zorder=11,
                bbox=dict(boxstyle='round,pad=0.5', fc=vc, ec='none'))
    else:
        ax.text((xp + xe) / 2, (ymin + ymax) / 2, '?', ha='center', va='center', fontsize=64, fontweight='bold', color=GRAY, alpha=0.25, zorder=2)
    ax.set_ylim(ymin, ymax); ax.set_xlim(-0.5, XR)
    ax.axvline(xp, color=NAVY, lw=1.6, ls=(0, (5, 3)), zorder=4)
    ax.annotate(T['drawn'].format(t=hm(g['window'][0])), xy=(xp, ymax - (ymax - ymin) * 0.06), xytext=(xp, ymax - (ymax - ymin) * 0.005),
                ha='center', va='top', fontsize=10.5, fontweight='bold', color='white', zorder=10,
                bbox=dict(boxstyle='round,pad=0.35', fc=NAVY, ec='none'),
                arrowprops=dict(arrowstyle='-|>,head_length=0.7,head_width=0.4', color=NAVY, lw=2))
    ax.axvline(xe, color=GRAY, lw=1.2, ls=(0, (2, 2)), zorder=4)
    ax.yaxis.tick_right(); ax.grid(color='#F0F3FA', lw=1)
    for s_ in ax.spines.values(): s_.set_color('#E0E3EB')
    tk, tl = [], []
    if tf == 'H1':   # one tick per day, like the published chart
        prev = None
        for i, b in enumerate(B):
            d_ = dt.datetime.fromtimestamp(b['t'], VN)
            if d_.day != prev and (not tk or i - tk[-1] >= 6): tk.append(i); tl.append(f'{d_.day:02d}/{d_.month:02d}')
            prev = d_.day
    else:
        step = 2 if n <= 64 else 4
        for i, b in enumerate(B):
            d_ = dt.datetime.fromtimestamp(b['t'], VN)
            if d_.minute == 0 and d_.hour % step == 0 and (not tk or i - tk[-1] >= 6): tk.append(i); tl.append(d_.strftime('%H:%M'))
    ax.set_xticks(tk); ax.set_xticklabels(tl, fontsize=8.5)
    ax.tick_params(axis='y', labelsize=9)
    ax.text(0.01, 0.015, f"NEXUS CORE AI · {T['disc']}", transform=ax.transAxes, fontsize=8.5, color=GRAY)
    band = fig.add_axes([0, 0.86, 1, 0.14]); band.set_axis_off()
    band.add_patch(Rectangle((0, 0), 1, 1, transform=band.transAxes, color=NAVY))
    d0 = dt.date.fromisoformat(p['date'])
    band.text(0.985, 0.62, f"XAUUSD {tf} · {T['ed'].get(p['edition'], p['edition'])} · {d0.day:02d}/{d0.month:02d}/{d0.year}", ha='right', va='center', color='white', fontsize=13, fontweight='bold')
    if after:
        line2 = f"{T['result']}: {T['res'].get(g['result'], g['result'])}" + (f"  {rtxt(g.get('r'), lang)}" if g.get('r') else '')
    else:
        bias = p.get('bias'); line2 = T['bias'].get(bias, bias) + (f" · {T['lean']} {T['bias'].get(p['lean'], p['lean'])}" if bias == 'TWO_WAY' and p.get('lean') else '') + f"  ·  {hm(g['window'][0])} {T['tz']}"
    band.text(0.985, 0.27, line2, ha='right', va='center', color=GOLD, fontsize=12, fontweight='bold')
    logo = os.path.join(ROOT, 'assets', 'logo-banner.png')
    if os.path.exists(logo):
        lg = Image.open(logo).convert('RGBA')
        hpx = 7.4 * 150 * 0.14 * 0.55; wpx = hpx * lg.width / lg.height
        lax = fig.add_axes([0.025, 0.86 + 0.14 * 0.22, wpx / 1800, hpx / 1110]); lax.set_axis_off(); lax.imshow(lg)
    plt.savefig(out, facecolor='white'); plt.close(fig)


def font(sz, bold=True):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',):
        if os.path.exists(f): return ImageFont.truetype(f, sz)
    return ImageFont.load_default()


def compose(before, after, g, lang, out):
    T = W[lang]
    A, Bm = Image.open(before).convert('RGB'), Image.open(after).convert('RGB')
    w = 1800
    A = A.resize((w, round(A.height * w / A.width))); Bm = Bm.resize((w, round(Bm.height * w / Bm.width)))
    sh = 96
    img = Image.new('RGB', (w, A.height + Bm.height + 2 * sh), 'white')
    d = ImageDraw.Draw(img)
    def strip(y, tag, sub, col):
        d.rectangle([0, y, w, y + sh], fill='#F5F3EC')
        d.rounded_rectangle([40, y + 22, 40 + 30 + d.textlength(tag, font=font(34)), y + sh - 22], radius=10, fill=col)
        d.text((55, y + sh / 2), tag, font=font(34), fill='white', anchor='lm')
        d.text((40 + 60 + d.textlength(tag, font=font(34)), y + sh / 2), sub, font=font(28, False), fill='#122033', anchor='lm')
    strip(0, T['before'], T['b_sub'].format(t=hm(g['window'][0])), NAVY)
    img.paste(A, (0, sh))
    strip(sh + A.height, T['after'], T['a_sub'].format(t=hm(g['window'][1])), '#9A6A00')
    img.paste(Bm, (0, 2 * sh + A.height))
    img.save(out, optimize=True)


def main():
    global ROOT
    a = sys.argv[1:]
    if len(a) < 2: raise SystemExit(__doc__)
    ROOT, m15, redo = a[0], a[1], '--redo' in a
    bars = load_bars(m15)
    grades = json.load(open(os.path.join(ROOT, 'data', 'grades.json'), encoding='utf-8'))
    done = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'plans', '*.json'))):
        p = json.load(open(f, encoding='utf-8')); k = f"{p['date']}-{p['edition']}"
        g = grades.get(k)
        if not g or g.get('result') == 'aside' or not g.get('window'): continue
        t_pub, t_end = ts(g['window'][0]), ts(g['window'][1])
        t_first = min([t_pub] + [ts(z['touched']) for z in g.get('zones') or [] if z.get('touched')])
        if bars[0]['t'] > min(t_first - 6 * 3600, t_pub - 24 * 3600) or bars[-1]['t'] + BAR < t_end: continue
        for lang in ('vi', 'en'):
            before = os.path.join(ROOT, 'data', 'charts', f'{k}-{lang}.png')      # the chart exactly as published (H1)
            out = os.path.join(ROOT, 'data', 'charts', f'{k}-{lang}-review.png')
            if not os.path.exists(before) or (os.path.exists(out) and not redo): continue
            tb, ta = out + '.before.png', out + '.after.png'
            panel(p, g, bars, lang, tb, 'before', 'H1'); panel(p, g, bars, lang, ta, 'after', 'H1')   # same window, same scale
            compose(tb, ta, g, lang, out); os.remove(tb); os.remove(ta)
            done.append(os.path.basename(out))
    print('review:', ', '.join(done) if done else 'nothing new')


if __name__ == '__main__':
    main()
