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
    'vi': dict(before='TRƯỚC', after='SAU', b_sub='Plan lúc đăng · nến cuối = lúc vẽ {t}', a_sub='Nến 15 phút thật tới khi hết phiên {t}',
               drawn='Lúc vẽ plan {t}', end='Hết phiên {t}', ed={'0700': 'Plan sáng', '1345': 'Cập nhật 13:45', '1930': 'Plan tối'},
               res={'hit': 'Chạm mục tiêu 1', 'void': 'Bị huỷ', 'expired': 'Chốt cuối phiên', 'no_touch': 'Giá không tới vùng',
                    'carried': 'Bản sau theo dõi tiếp', 'mixed': 'Có thắng có thua', 'aside': 'Đứng ngoài'},
               result='Kết quả', sell='Bán', buy='Mua', t1='Mục tiêu 1', touch='chạm vùng', ran='chạy {p} pip', near='suýt chạm · thiếu {g}',
               disc='Chấm tự động theo luật công khai · không phải lời khuyên đầu tư', tz='giờ VN'),
    'en': dict(before='BEFORE', after='AFTER', b_sub='Plan as published · last candle = drawn at {t}', a_sub='Real 15-minute candles until the session ended {t}',
               drawn='Plan drawn {t}', end='Session end {t}', ed={'0700': 'Morning plan', '1345': '13:45 update', '1930': 'Evening plan'},
               res={'hit': 'Target 1 reached', 'void': 'Invalidated', 'expired': 'Closed at session end', 'no_touch': 'Zone not reached',
                    'carried': 'Followed by the next update', 'mixed': 'Mixed', 'aside': 'Stood aside'},
               result='Result', sell='Sell', buy='Buy', t1='Target 1', touch='zone reached', ran='ran {p} pips', near='just missed · {g} short',
               disc='Graded automatically by published rules · not financial advice', tz='GMT+7'),
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


def ts(s): return dt.datetime.strptime(s, '%Y-%m-%d %H:%M').replace(tzinfo=VN).timestamp()
def hm(s): return s[11:16]


def fnum(v, lang):
    s = (f'{v:,.1f}' if round(v % 1, 2) else f'{v:,.0f}').replace(',', '')
    return s.replace('.', ',') if lang == 'vi' else s


def rtxt(r, lang):
    if r is None: return ''
    s = ('+' if r > 0 else '') + ('%g' % round(r, 2)) + 'R'
    return s.replace('.', ',') if lang == 'vi' else s


def after_chart(p, g, bars, lang, out):
    T = W[lang]
    t_pub, t_end = ts(g['window'][0]), ts(g['window'][1])
    zs = [z for z in g.get('zones') or [] if z.get('zone')]
    t_first = min([t_pub] + [ts(z['touched']) for z in zs if z.get('touched')])
    t0 = t_first - 6 * 3600
    B = [b for b in bars if t0 <= b['t'] and b['t'] + BAR <= t_end]
    n = len(B)
    xi = lambda t: next((i for i, b in enumerate(B) if b['t'] >= t), n) - 0.5   # x of a moment (candle boundary)
    fig = plt.figure(figsize=(12, 7.4), dpi=150, facecolor='white')
    ax = fig.add_axes([0.035, 0.12, 0.885, 0.69])
    # session shading
    xp, xe = xi(t_pub), n - 0.5
    ax.axvspan(xp, xe, color=GOLD, alpha=0.07, zorder=0)
    for i, b in enumerate(B):
        col = UP if b['c'] >= b['o'] else DN
        ax.vlines(i, b['l'], b['h'], color=col, lw=0.8, zorder=3)
        ax.add_patch(Rectangle((i - 0.32, min(b['o'], b['c'])), 0.64, max(abs(b['c'] - b['o']), 0.25), color=col, zorder=3))
    lo, hi = min(b['l'] for b in B), max(b['h'] for b in B)
    ys = [lo, hi]
    labels = []
    t1_drawn = set()
    tz_ = [z for z in zs if z.get('touched')]
    best_z = next((z for z in tz_ if z.get('main') and not z.get('carried_from')), None) or max(tz_, key=lambda z: z.get('best') or 0, default=None)
    def mark(z):   # target reached = star, invalidation close = cross
        if z.get('result') == 'hit' and z.get('at'):
            k = int(xi(ts(z['at'])) + 0.5)
            if 0 <= k < n: ax.plot([k], [z['t1']], marker='*', ms=17, color=UP, mec='white', mew=1, zorder=9)
        if z.get('result') == 'void' and z.get('at'):
            k = int(xi(ts(z['at'])) + 0.5) - 1
            if 0 <= k < n: ax.plot([k], [z['void']], marker='X', ms=12, color=DN, mec='white', mew=1, zorder=9)
    for z in zs:
        a, c_ = z['zone']
        res = z.get('result')
        if res == 'no_touch' and not z.get('near') and (a > hi + 15 or c_ < lo - 15): continue   # far away, never in play
        if not (lo - 60 <= a <= hi + 60): continue
        red = z['side'] == 'SELL'; edge = DN if red else UP
        strong = res in ('hit', 'void', 'expired', 'carried') or z.get('main')
        ax.add_patch(Rectangle((-0.5, a), n, max(c_ - a, 0.8), facecolor=edge, alpha=0.20 if strong else 0.08, zorder=1))
        ax.add_patch(Rectangle((-0.5, a), n, max(c_ - a, 0.8), facecolor='none', edgecolor=edge, lw=1.8 if strong else 0.8, alpha=0.9, zorder=1))
        ys += [a, c_]
        lab = f"{T['sell'] if red else T['buy']} {fnum(a, lang)}–{fnum(c_, lang)} · {T['res'].get(res, res)}" + (f" {rtxt(z.get('r'), lang)}" if z.get('r') else '')
        if z.get('near') and res == 'no_touch': lab += ' · ' + T['near'].format(g=fnum(z['near']['gap'], lang))
        labels.append(((a + c_) / 2, lab, edge, strong))
        if res in ('hit', 'void', 'expired', 'carried') and z.get('t1') is not None and z['t1'] not in t1_drawn and lo - 60 <= z['t1'] <= hi + 60:
            t1_drawn.add(z['t1'])
            ax.hlines(z['t1'], -0.5, n - 0.5, color=GRAY, lw=1, ls=(0, (4, 3)), zorder=2)
            ax.text(-0.3, z['t1'], f" {T['t1']} {fnum(z['t1'], lang)}", color=GRAY, fontsize=8.5, va='bottom', ha='left', zorder=8,
                    bbox=dict(fc='white', ec='none', alpha=0.85, pad=0.3))
            ys.append(z['t1'])
        if z.get('touched'):
            k = int(xi(ts(z['touched'])) + 0.5)
            if z is not best_z:
                if 0 <= k < n: ax.plot([k], [z['edge']], marker='o', ms=7, mfc='white', mec=edge, mew=2, zorder=7)
                mark(z); continue
            if 0 <= k < n:
                e = z['edge']
                ax.plot([k], [e], marker='o', ms=8, mfc='white', mec=edge, mew=2.2, zorder=7)
                seg = B[k:]
                if seg:
                    j = min(range(k, n), key=lambda i: B[i]['l']) if red else max(range(k, n), key=lambda i: B[i]['h'])
                    ext = B[j]['l'] if red else B[j]['h']
                    mv = (e - ext) if red else (ext - e)
                    if mv > 1:
                        ax.annotate('', xy=(j, ext), xytext=(k, e), zorder=7,
                                    arrowprops=dict(arrowstyle='->,head_length=0.8,head_width=0.45', color=GOLD, lw=2.4, shrinkA=6, shrinkB=0))
                        ax.text(j + 0.6, ext, f" {T['ran'].format(p=f'{round(mv * 10):,}'.replace(',', '.' if lang == 'vi' else ','))}",
                                color='#9A6A00', fontsize=10, fontweight='bold', va='center', zorder=8, bbox=dict(fc='white', ec=GOLD, alpha=0.95, pad=0.35, boxstyle='round'))
        mark(z)
    ymin, ymax = min(ys) - 10, max(ys) + 22
    ax.set_ylim(ymin, ymax); ax.set_xlim(-0.5, n + max(6, n * 0.32))
    gap = (ymax - ymin) * 0.045
    labels.sort(key=lambda q: q[0])
    placed = []
    for y, lab, col, strong in labels:
        if placed and y - placed[-1] < gap: y = placed[-1] + gap
        placed.append(y)
    if placed and placed[-1] > ymax - gap:          # pushed off the top: shift the stack down
        sh = placed[-1] - (ymax - gap); placed = [v - sh for v in placed]
    for (y0, lab, col, strong), y in zip(labels, placed):
        ax.text(n + max(6, n * 0.32) - 0.6, y, lab, ha='right', va='center', fontsize=9.5 if strong else 8.5, color=col,
                fontweight='bold' if strong else 'normal', zorder=9, bbox=dict(fc='white', ec='none', alpha=0.92, pad=0.5))
    # the moment the plan was drawn + session end
    ax.axvline(xp, color=NAVY, lw=1.6, ls=(0, (5, 3)), zorder=4)
    ax.annotate(T['drawn'].format(t=hm(g['window'][0])), xy=(xp, ymax - (ymax - ymin) * 0.06), xytext=(xp, ymax - (ymax - ymin) * 0.005),
                ha='center', va='top', fontsize=10.5, fontweight='bold', color='white', zorder=10,
                bbox=dict(boxstyle='round,pad=0.35', fc=NAVY, ec='none'),
                arrowprops=dict(arrowstyle='-|>,head_length=0.7,head_width=0.4', color=NAVY, lw=2))
    ax.axvline(xe, color=GRAY, lw=1.2, ls=(0, (2, 2)), zorder=4)
    ax.text(xe, ymin + (ymax - ymin) * 0.02, f" {T['end'].format(t=hm(g['window'][1]))}", color=GRAY, fontsize=9, ha='left', va='bottom', zorder=8)
    # axes cosmetics
    ax.yaxis.tick_right(); ax.grid(color='#F0F3FA', lw=1)
    for s_ in ax.spines.values(): s_.set_color('#E0E3EB')
    step = 2 if n <= 64 else 4
    tk = []
    for i, b in enumerate(B):
        d_ = dt.datetime.fromtimestamp(b['t'], VN)
        if d_.minute == 0 and d_.hour % step == 0 and (not tk or i - tk[-1] >= 6): tk.append(i)
    ax.set_xticks(tk); ax.set_xticklabels([dt.datetime.fromtimestamp(B[i]['t'], VN).strftime('%H:%M') for i in tk], fontsize=8.5)
    ax.tick_params(axis='y', labelsize=9)
    ax.text(0.01, 0.015, f"NEXUS CORE AI · {T['disc']}", transform=ax.transAxes, fontsize=8.5, color=GRAY)
    # header band
    band = fig.add_axes([0, 0.86, 1, 0.14]); band.set_axis_off()
    band.add_patch(Rectangle((0, 0), 1, 1, transform=band.transAxes, color=NAVY))
    d0 = dt.date.fromisoformat(p['date'])
    day = f'{d0.day:02d}/{d0.month:02d}/{d0.year}'
    band.text(0.985, 0.62, f"XAUUSD M15 · {T['ed'].get(p['edition'], p['edition'])} · {day}", ha='right', va='center', color='white', fontsize=13, fontweight='bold')
    band.text(0.985, 0.27, f"{T['result']}: {T['res'].get(g['result'], g['result'])}" + (f"  {rtxt(g.get('r'), lang)}" if g.get('r') else ''),
              ha='right', va='center', color=GOLD, fontsize=12, fontweight='bold')
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
        if bars[0]['t'] > t_first - 6 * 3600 or bars[-1]['t'] + BAR < t_end: continue
        for lang in ('vi', 'en'):
            before = os.path.join(ROOT, 'data', 'charts', f'{k}-{lang}.png')
            out = os.path.join(ROOT, 'data', 'charts', f'{k}-{lang}-review.png')
            if not os.path.exists(before) or (os.path.exists(out) and not redo): continue
            tmp = out + '.after.png'
            after_chart(p, g, bars, lang, tmp)
            compose(before, tmp, g, lang, out); os.remove(tmp)
            done.append(os.path.basename(out))
    print('review:', ', '.join(done) if done else 'nothing new')


if __name__ == '__main__':
    main()
