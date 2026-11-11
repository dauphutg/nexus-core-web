#!/usr/bin/env python3
"""Build the static pages search engines and AI assistants read without running JavaScript.

  python3 tools/build.py [site_dir]

Reads template.html + data/latest.json + data/plans/*.json + data/grades.json and the texts in app.js, then writes
  data/plans/<date>-<edition>.json      – archive copy of latest.json (never edited by hand)
  data/history.json                     – every plan with its grade (generated)
  index.html (EN), ar/index.html, vi/index.html, today/ (+ ar/, vi/)   – latest plan
  <en|ar|vi>/plan/<date>-<asia|london|newyork>/index.html             – one page per plan
  <en|ar|vi>/track-record/<yyyy-mm>/index.html                        – monthly track record
  <en|ar|vi>/signals/index.html                                       – Signals (members only) + waitlist
  en/index.html (points to /), sitemap.xml, llms.txt.
app.js still runs on top for visitors (local time, alerts, email). Run after every data change.
"""
import glob, html, json, os, re, subprocess, sys, datetime as dt

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..'))
SITE = 'https://nexuscore.trade'
LANGS = ['en', 'ar', 'vi']
PATH = {'en': '/', 'ar': '/ar/', 'vi': '/vi/'}
PFX = {'en': '/en', 'ar': '/ar', 'vi': '/vi'}
SESSION = {'0700': 'asia', '1345': 'london', '1930': 'newyork'}
LOCALE = {'en': 'en_US', 'ar': 'ar_AR', 'vi': 'vi_VN'}
ED_TIME = {'0700': '07:00', '1345': '13:45', '1930': '19:30'}
ED_ORDER = ['0700', '1345', '1930']
TZ_VN = dt.timezone(dt.timedelta(hours=7))
MON_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
DAY = {'en': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
       'vi': ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
       'ar': ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']}
MON_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
VN_TZ_LABEL = {'en': 'GMT+7', 'ar': 'غرينتش+7', 'vi': 'giờ VN'}
FAQ = {
    'en': ('What is the gold (XAUUSD) bias today?', 'Where is the main gold zone today?', 'What would make today\'s gold view wrong?'),
    'ar': ('ما اتجاه الذهب (XAUUSD) اليوم؟', 'أين المنطقة الرئيسية للذهب اليوم؟', 'ما الذي يُلغي نظرة اليوم على الذهب؟'),
    'vi': ('Xu hướng vàng (XAUUSD) hôm nay thế nào?', 'Vùng giá chính của vàng hôm nay ở đâu?', 'Khi nào nhận định vàng hôm nay sai?'),
}
SITE_DESC = {
    'en': 'Free AI-built gold (XAUUSD) game plan: key zones, scenarios and the level that proves the view wrong — refreshed before the Asia, London and New York sessions, every plan graded in public.',
    'ar': 'خطة مجانية للذهب (XAUUSD) مبنية بالذكاء الاصطناعي: مناطق رئيسية وسيناريوهات ومستوى إلغاء الفكرة — تُحدَّث قبل جلسات آسيا ولندن ونيويورك وتُقيَّم كل خطة علنًا.',
    'vi': 'Plan vàng (XAUUSD) miễn phí do AI lập: vùng giá chính, kịch bản và mốc cho biết nhận định sai — cập nhật trước phiên Á, Âu và Mỹ, mọi plan được chấm công khai.',
}
SAME_AS = ['https://t.me/nexuscorefx', 'https://x.com/XAU_CRYPTO', 'https://www.youtube.com/@nexuscorefx']


def read(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()


def write(p, s):
    fp = os.path.join(ROOT, p)
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    open(fp, 'w', encoding='utf-8').write(s)


def load_texts():
    """The interface texts live in app.js (object T); read them with node so there is one source."""
    js = ("const fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');"
          "const i=s.indexOf('var T = ');const j=s.indexOf('var LINKS');"
          "const T=(new Function('return '+s.slice(i+8,j).trim().replace(/;$/,'')))();"
          "process.stdout.write(JSON.stringify(T));")
    out = subprocess.run(['node', '-e', js, os.path.join(ROOT, 'app.js')], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


T = load_texts()
P = json.loads(read('data/latest.json'))
esc = lambda s: html.escape(str(s), quote=True)


def L(o, lang):
    if o is None: return ''
    if isinstance(o, str): return o
    return o.get(lang) or o.get('en') or o.get('vi') or ''


def fmt(n, lang):
    s = ('%g' % n) if isinstance(n, (int, float)) else str(n)
    return s.replace('.', ',') if lang == 'vi' else s


def rng(lo, hi, lang):
    return fmt(lo, lang) if hi is None or lo == hi else fmt(lo, lang) + '–' + fmt(hi, lang)


def num(s): return '<span class="num" dir="ltr">' + esc(s) + '</span>'


def t(lang, k):
    v = T[lang].get(k, k)
    return v


def side_cls(s): return 'sell' if s == 'SELL' else 'buy' if s == 'BUY' else 'neutral'


def day_label(d, lang):
    if lang == 'en': return f"{DAY['en'][d.weekday()]}, {MON[d.month-1]} {d.day}"
    if lang == 'vi': return f"{DAY['vi'][d.weekday()]}, {d.day:02d}/{d.month:02d}"
    return f"{DAY['ar'][d.weekday()]}، {d.day} {MON_AR[d.month-1]}"


def bias_label(p, lang):
    b = t(lang, p['bias'])
    if p['bias'] == 'TWO_WAY' and p.get('lean'):
        b += ' · ' + t(lang, 'lean') + ' ' + t(lang, p['lean'])
    return b


def updated_dt(p):
    return dt.datetime.strptime(p['updated_vn'], '%Y-%m-%d %H:%M').replace(tzinfo=TZ_VN)


def chart_for(p, lang):
    ch = p.get('chart') or {}
    src = ch.get(lang) or ch.get('en') or ch.get('vi') or ''
    return src if re.fullmatch(r'data/charts/\d{4}-\d{2}-\d{2}-(0700|1345|1930)-(vi|en)\.png', src or '') else ''


def fill(doc, el_id, inner):
    """Put prerendered HTML inside the (empty) element with this id in the template."""
    pat = re.compile(r'(<(\w+)\b[^>]*\bid="%s"[^>]*>)(</\2>)' % re.escape(el_id))
    new, n = pat.subn(lambda m: m.group(1) + inner + m.group(3), doc, count=1)
    if n != 1: raise SystemExit('template: element #%s not found or not empty' % el_id)
    return new


def unhide(doc, el_id):
    return re.sub(r'(<\w+\b[^>]*\bid="%s"[^>]*?)\s+hidden(\s|>)' % re.escape(el_id), r'\1\2', doc, count=1)


def plan_html(doc, p, lang):
    d0 = dt.date.fromisoformat(p['date'])
    upd = updated_dt(p)
    doc = fill(doc, 'plan-meta', esc(f"{p['symbol']} · {t(lang, 'ed').get(p['edition'], p['edition'])} · {t(lang, 'updated')} {upd:%H:%M} {VN_TZ_LABEL[lang]}"))
    doc = fill(doc, 'plan-title', esc(t(lang, 'plan_of') + ' · ' + day_label(d0, lang)))
    eds = ''.join(f'<div class="ed{" on" if e == p["edition"] else ""}"><span class="k">{esc(t(lang, "ed_short")[e])}</span>'
                  f'<span class="v num">{ED_TIME[e]}</span></div>' for e in ED_ORDER)
    doc = fill(doc, 'editions', eds)
    if p.get('alert') and L(p['alert'], lang):
        doc = unhide(doc, 'alert')
        doc = fill(doc, 'alert-text', esc(L(p['alert'], lang)))
    side = (p.get('lean') or '') if p['bias'] in ('TWO_WAY', 'STAND_ASIDE') else p['bias']
    doc = doc.replace('class="hero card" id="bias-card"', f'class="hero card {side_cls(side)}" id="bias-card"', 1)
    doc = fill(doc, 'bias-val', esc(bias_label(p, lang)))
    doc = fill(doc, 'day-type', esc(L(p.get('day_type'), lang)))
    doc = fill(doc, 'headline', esc(L(p.get('headline'), lang)))
    keys, mz = [], p.get('main_zone')
    if mz: keys.append((t(lang, 'main_zone') + ' · ' + t(lang, mz['side']), rng(mz['lo'], mz['hi'], lang)))
    if p.get('targets'): keys.append((t(lang, 'target') + ' ' + p['targets'][0]['label'], rng(p['targets'][0]['lo'], p['targets'][0]['hi'], lang)))
    if p.get('range'): keys.append((t(lang, 'range'), rng(p['range']['lo'], p['range']['hi'], lang)))
    doc = fill(doc, 'hero-keys', ''.join(f'<div class="key"><span class="k">{esc(k)}</span><span class="v num" dir="ltr">{esc(v)}</span></div>' for k, v in keys))
    src = chart_for(p, lang)
    if src:
        doc = unhide(doc, 'chart-box')
        alt = f"XAUUSD H1 – {t(lang, 'plan_of')} · {day_label(d0, lang)}"
        doc = doc.replace('<a id="chart-link" href="#"', f'<a id="chart-link" href="/{src}"', 1)
        doc = doc.replace('<img id="chart-img" alt=""', f'<img id="chart-img" src="/{src}" alt="{esc(alt)}"', 1)
    rows = []
    row = lambda k, v, cls='', text=False: (f'<div class="row{" text" if text else ""}"><span class="k">{esc(k)}</span>'
                                            f'<span class="v{"" if text else " num"}{(" " + cls) if cls else ""}"{"" if text else " dir=\"ltr\""}>{esc(v)}</span></div>')
    if mz: rows.append(row(t(lang, 'main_zone') + ' (' + t(lang, mz['side']) + ')', rng(mz['lo'], mz['hi'], lang), 'main'))
    for x in p.get('targets') or []: rows.append(row(t(lang, 'target') + ' ' + x['label'], rng(x['lo'], x['hi'], lang)))
    if p.get('range'): rows.append(row(t(lang, 'range'), rng(p['range']['lo'], p['range']['hi'], lang)))
    if p.get('invalidation'): rows.append(row(t(lang, 'invalid'), L(p['invalidation'], lang), 'bad', True))
    doc = fill(doc, 'levels', ''.join(rows))
    doc = fill(doc, 'context', ''.join(f'<div class="stat"><span class="k">{esc(L(c["k"], lang))}</span><span class="v">{esc(L(c["v"], lang))}</span></div>' for c in p.get('context') or []))
    sc = []
    for i, s in enumerate(p.get('scenarios') or []):
        w = max(0, min(100, s['prob']))
        sc.append(f'<div class="card scen {side_cls(s["side"])}"><div class="t"><span>{esc((t(lang, "main") if i == 0 else t(lang, "alt")) + " · " + t(lang, s["side"]))}</span>'
                  f'<span class="num muted">~{esc(s["prob"])}%</span></div><p>{esc(L(s["text"], lang))}</p><div class="bar"><i class="w{int(round(w / 5.0) * 5)}"></i></div></div>')
    doc = fill(doc, 'scenarios', ''.join(sc))
    zs = []
    for z in p.get('zones') or []:
        is_main = bool(mz) and z['lo'] == mz['lo'] and z['hi'] == mz['hi'] and z['side'] == mz['side']
        zs.append(f'<div class="card zone{" is-main" if is_main else ""}"><div class="l"><div class="h"><span class="pill {side_cls(z["side"])}">{esc(t(lang, z["side"]))}</span>'
                  f'{num(rng(z["lo"], z["hi"], lang))}</div><span class="s">{esc(L(z.get("status"), lang))}</span></div>'
                  f'<span class="g">{esc(t(lang, "key") if is_main else z.get("grade", ""))}</span></div>')
    doc = fill(doc, 'zones', ''.join(zs))
    nw = ''.join(f'<div class="row news-row"><span class="k"><span class="imp {esc(n.get("impact", "low"))}"></span><span>{esc(L(n["text"], lang))}</span></span>'
                 f'<span class="v">{esc(n.get("time", ""))} {esc(VN_TZ_LABEL[lang]) if " " in str(n.get("time", "")) else ""}</span></div>' for n in p.get('news') or [])
    doc = fill(doc, 'news', nw)
    doc = fill(doc, 'next', f'<strong>{esc(t(lang, "next"))}</strong><span>{esc(L(p.get("next_update"), lang))}</span>')
    return doc




# ---------- archive, grades, history ----------

def key_of(p): return f"{p['date']}-{p['edition']}"


def archive_latest():
    """Keep a copy of every published plan: data/plans/<date>-<edition>.json (the latest correction of an edition wins)."""
    os.makedirs(os.path.join(ROOT, 'data', 'plans'), exist_ok=True)
    path = f'data/plans/{key_of(P)}.json'
    new = json.dumps(P, ensure_ascii=False, indent=1) + '\n'
    try: old = read(path)
    except Exception: old = None
    if old != new: write(path, new)


def load_plans():
    out = {}
    for f in glob.glob(os.path.join(ROOT, 'data', 'plans', '*.json')):
        p = json.load(open(f, encoding='utf-8'))
        if re.fullmatch(r'\d{4}-\d{2}-\d{2}-(0700|1345|1930)', key_of(p)) and os.path.basename(f) == key_of(p) + '.json':
            out[key_of(p)] = p
    return dict(sorted(out.items()))


archive_latest()
PLANS = load_plans()
KEYS = list(PLANS)
try:
    G = json.loads(read('data/grades.json'))
except Exception:
    G = {}
RESULTS = ('hit', 'void', 'no_touch', 'expired', 'aside')


def grade_of(k):
    g = G.get(k)
    return g if g and g.get('result') in RESULTS else None


def plan_path(lang, k): return f"{PFX[lang]}/plan/{k[:10]}-{SESSION[k[11:]]}/"
def track_path(lang, ym): return f"{PFX[lang]}/track-record/{ym}/"
def signals_path(lang): return f"{PFX[lang]}/signals/"


CUR_MONTH = P['date'][:7]
MONTHS = sorted({k[:7] for k in KEYS} | {CUR_MONTH})


def month_label(ym, lang):
    y, m = int(ym[:4]), int(ym[5:])
    return f"{MON_FULL[m-1]} {y}" if lang == 'en' else f"{MON_AR[m-1]} {y}" if lang == 'ar' else f"Tháng {m}/{y}"


def vn_label(s, lang, with_day=True):
    d = dt.datetime.strptime(s, '%Y-%m-%d %H:%M')
    return (day_label(d.date(), lang) + ' ' if with_day else '') + f"{d:%H:%M} {VN_TZ_LABEL[lang]}"


def r_text(r, lang, nd=2):
    if r is None: return ''
    v = round(r, nd)
    s = ('+' if v > 0 else '') + ('%g' % v)
    return (s.replace('.', ',') if lang == 'vi' else s) + 'R'


def res_cls(res): return 'good' if res == 'hit' else 'bad' if res == 'void' else 'neutral'


def res_label(g, lang): return t(lang, 'res_' + g['result']) if g else t(lang, 'pending')


def history_json():
    days = []
    for k in reversed(KEYS):
        p, g = PLANS[k], grade_of(k)
        mz = p.get('main_zone')
        days.append({'date': p['date'], 'edition': p['edition'], 'session': SESSION[p['edition']], 'bias': p['bias'], 'lean': p.get('lean'),
                     'main_zone': f"{mz['lo']:g}–{mz['hi']:g}" if mz else None, 'result': g['result'] if g else None,
                     'r': g.get('r') if g else None, 'url': SITE + plan_path('en', k)})
    return json.dumps({'note': 'Generated by tools/build.py from data/plans and data/grades.json – grading rules: ' + SITE + track_path('en', CUR_MONTH) + '#method',
                       'days': days}, ensure_ascii=False, indent=1) + '\n'


# ---------- page shell ----------

def side_of(p): return (p.get('lean') or '') if p['bias'] in ('TWO_WAY', 'STAND_ASIDE') else p['bias']


def shell(lang, kind, paths):
    """Template with texts, tabs and language links filled in. paths = this page's address in each language."""
    doc = read('template.html')
    doc = (doc.replace('{{LANG}}', lang).replace('{{DIR}}', 'rtl' if lang == 'ar' else 'ltr').replace('{{HOME}}', PATH[lang])
           .replace('{{TRACK}}', track_path(lang, CUR_MONTH)).replace('{{SIGNALS}}', signals_path(lang)).replace('{{KIND}}', kind))
    for k, v in T[lang].items():
        if isinstance(v, str):
            doc = re.sub(r'(data-i18n="%s"[^>]*>)(</)' % re.escape(k), lambda m: m.group(1) + esc(v) + m.group(2), doc)
    for l in LANGS:
        doc = re.sub(r'href="[^"]*"( data-lang="%s")' % l, lambda m: f'href="{paths[l]}"' + m.group(1), doc, count=1)
    doc = re.sub(r'(<a role="button" href="[^"]*" data-lang="%s")' % lang, r'\1 aria-pressed="true" aria-current="page"', doc)
    tab = {'home': 'plan', 'plan': 'plan', 'track': 'track', 'signals': 'signals'}[kind]
    doc = doc.replace(f' data-tab="{tab}"', f' aria-current="page" data-tab="{tab}"', 1)
    if kind != 'home':
        doc = doc.replace('<span class="live" id="live">', '<span class="live" id="live" hidden>', 1)
    return doc


def set_view(doc, body):
    a, b = doc.index('<!-- VIEW -->'), doc.index('<!-- /VIEW -->')
    return doc[:a] + body + '\n' + doc[b:]


def hide(doc, el_id):
    return re.sub(r'(<\w+\b[^>]*\bid="%s")' % re.escape(el_id), r'\1 hidden', doc, count=1)


def finish(doc, head_html, ld):
    doc = doc.replace('{{HEAD}}', head_html).replace('{{JSONLD}}', ld)
    if '{{' in doc: raise SystemExit('template placeholder left: ' + re.search(r'\{\{\w+\}\}', doc).group(0))
    return doc


def head_tags(lang, title, desc, paths, img, pub=None, mod=None, og='article'):
    url = SITE + paths[lang]
    alts = ''.join(f'\n<link rel="alternate" hreflang="{l}" href="{SITE}{paths[l]}">' for l in LANGS)
    alts += f'\n<link rel="alternate" hreflang="x-default" href="{SITE}{paths["en"]}">'
    og_alt = ''.join(f'\n<meta property="og:locale:alternate" content="{LOCALE[l]}">' for l in LANGS if l != lang)
    times = (f'\n<meta property="article:published_time" content="{pub.isoformat()}">'
             f'\n<meta property="article:modified_time" content="{(mod or pub).isoformat()}">') if pub and og == 'article' else ''
    size = '\n<meta property="og:image:width" content="1800">\n<meta property="og:image:height" content="1110">' if '/data/charts/' in img else ''
    return (f'<title>{esc(title)}</title>\n'
            f'<meta name="description" content="{esc(desc)}">\n'
            f'<link rel="canonical" href="{url}">{alts}\n'
            f'<meta name="robots" content="index, follow, max-image-preview:large">\n'
            f'<meta property="og:type" content="{og}">\n'
            f'<meta property="og:site_name" content="NEXUS CORE">\n'
            f'<meta property="og:url" content="{url}">\n'
            f'<meta property="og:title" content="{esc(title)}">\n'
            f'<meta property="og:description" content="{esc(desc)}">\n'
            f'<meta property="og:image" content="{img}">{size}\n'
            f'<meta property="og:locale" content="{LOCALE[lang]}">{og_alt}{times}\n'
            f'<meta name="twitter:card" content="summary_large_image">\n'
            f'<meta name="twitter:site" content="@XAU_CRYPTO">\n'
            f'<meta name="twitter:title" content="{esc(title)}">\n'
            f'<meta name="twitter:description" content="{esc(desc)}">\n'
            f'<meta name="twitter:image" content="{img}">')


ORG = {'@type': 'Organization', '@id': SITE + '/#org', 'name': 'NEXUS CORE AI', 'url': SITE + '/',
       'logo': {'@type': 'ImageObject', 'url': SITE + '/assets/icon-512.png', 'width': 512, 'height': 512}, 'sameAs': SAME_AS}
WEBSITE = {'@type': 'WebSite', '@id': SITE + '/#website', 'name': 'NEXUS CORE', 'url': SITE + '/', 'publisher': {'@id': SITE + '/#org'},
           'inLanguage': LANGS, 'description': SITE_DESC['en']}


def ld(*items):
    s = json.dumps({'@context': 'https://schema.org', '@graph': [ORG, WEBSITE] + list(items)}, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    return '<script type="application/ld+json">' + s + '</script>'


def crumbs(lang, items):
    return {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': SITE + u} for i, (n, u) in enumerate(items)]}


def img_for(p, lang):
    src = chart_for(p, lang)
    return SITE + '/' + src if src else SITE + '/assets/logo-banner.png'


def plan_title(p, lang):
    d0 = dt.date.fromisoformat(p['date'])
    return f"{t(lang, 'plan_of')} {day_label(d0, lang)} · {t(lang, 'ed').get(p['edition'], '')} · {bias_label(p, lang)} — XAUUSD | NEXUS CORE"


def plan_desc(p, lang, g=None):
    mz = p.get('main_zone')
    desc = L(p.get('headline'), lang)
    if mz: desc += f" — {t(lang, 'main_zone')}: {rng(mz['lo'], mz['hi'], lang)}."
    if g: desc += f" {t(lang, 'pp_result')}: {res_label(g, lang)}{(' ' + r_text(g.get('r'), lang)) if g.get('r') is not None else ''}."
    else: desc += ' ' + t(lang, 'ed').get(p['edition'], '') + '.'
    return desc[:300]


# ---------- blocks ----------

def result_block(k, lang):
    g = grade_of(k)
    out = [f'<h2>{esc(t(lang, "pp_result"))}</h2>']
    if not g:
        out.append(f'<div class="res-top"><span class="pill neutral">{esc(t(lang, "pending"))}</span></div>'
                   f'<p class="muted">{esc(t(lang, "res_pending_note"))}</p>')
    else:
        rr = f'<span class="num r {"r-up" if (g.get("r") or 0) > 0 else "r-down" if (g.get("r") or 0) < 0 else "r-flat"}" dir="ltr">{esc(r_text(g.get("r"), lang))}</span>' if g.get('r') is not None else ''
        out.append(f'<div class="res-top"><span class="pill {res_cls(g["result"])}">{esc(res_label(g, lang))}</span>{rr}</div>')
        rows = []
        row = lambda kk, v, num_=True: rows.append(f'<div class="row"><span class="k">{esc(kk)}</span><span class="v{" num" if num_ else ""}"{" dir=\"ltr\"" if num_ else ""}>{esc(v)}</span></div>')
        if g.get('window'): row(t(lang, 'pp_window'), f"{vn_label(g['window'][0], lang)} → {vn_label(g['window'][1], lang)}", False)
        if g.get('touched'): row(t(lang, 'pp_touched'), vn_label(g['touched'], lang), False)
        if g.get('at'): row(t(lang, 'pp_event'), vn_label(g['at'], lang), False)
        if g.get('t1') is not None: row(t(lang, 'pp_t1'), fmt(g['t1'], lang))
        if g.get('void') is not None: row(t(lang, 'pp_void'), fmt(g['void'], lang))
        if g.get('high') is not None: row(t(lang, 'pp_hl'), f"{fmt(g['high'], lang)} / {fmt(g['low'], lang)}")
        if g.get('last') is not None: row(t(lang, 'pp_last'), fmt(g['last'], lang))
        if rows: out.append('<div class="list">' + ''.join(rows) + '</div>')
    out.append(f'<p class="small"><a href="{track_path(lang, k[:7])}#method">{esc(t(lang, "tr_method"))}</a></p>')
    return ''.join(out)


def plan_nav(k, lang):
    i = KEYS.index(k)
    links = []
    if i > 0: links.append(f'<a class="btn alt" href="{plan_path(lang, KEYS[i-1])}" rel="prev">{esc(t(lang, "prev_plan"))}</a>')
    if i + 1 < len(KEYS): links.append(f'<a class="btn alt" href="{plan_path(lang, KEYS[i+1])}" rel="next">{esc(t(lang, "next_plan"))}</a>')
    links.append(f'<a class="btn alt" href="{track_path(lang, k[:7])}">{esc(t(lang, "all_month"))}</a>')
    links.append(f'<a class="btn alt" href="{PATH[lang]}">{esc(t(lang, "today_plan"))}</a>')
    return ''.join(links)


# ---------- pages ----------

def home_page(lang):
    k = key_of(P)
    doc = shell(lang, 'home', PATH)
    doc = doc.replace('<body data-page="home">', f'<body data-page="home" data-plan="{k}">', 1)
    doc = plan_html(doc, P, lang)
    doc = unhide(doc, 'plan-link')
    doc = doc.replace('<a class="permalink" id="plan-link" href="#"', f'<a class="permalink" id="plan-link" href="{plan_path(lang, k)}"', 1)
    doc = fill(doc, 'plan-link', esc(t(lang, 'permalink')) + ' →' if lang != 'ar' else esc(t(lang, 'permalink')))
    if grade_of(k):
        doc = unhide(doc, 'result'); doc = fill(doc, 'result', result_block(k, lang))
    title, desc, img, upd = plan_title(P, lang), plan_desc(P, lang), img_for(P, lang), updated_dt(P)
    url = SITE + PATH[lang]
    mz = P.get('main_zone')
    art = {'@type': 'Article', '@id': url + '#plan', 'headline': title[:110], 'description': desc, 'image': [img],
           'datePublished': upd.isoformat(), 'dateModified': upd.isoformat(), 'inLanguage': lang,
           'author': {'@id': SITE + '/#org'}, 'publisher': {'@id': SITE + '/#org'}, 'mainEntityOfPage': url,
           'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD)'}, 'isAccessibleForFree': True}
    qa = [(FAQ[lang][0], bias_label(P, lang) + ' — ' + L(P.get('headline'), lang))]
    if mz: qa.append((FAQ[lang][1], f"{t(lang, mz['side'])} {rng(mz['lo'], mz['hi'], lang)} ({t(lang, 'ed').get(P['edition'], '')})"))
    if P.get('invalidation'): qa.append((FAQ[lang][2], L(P['invalidation'], lang)))
    faq = {'@type': 'FAQPage', '@id': url + '#faq', 'inLanguage': lang, 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a + ' ' + t(lang, 'disclaimer').split('.')[0] + '.'}} for q, a in qa]}
    return finish(doc, head_tags(lang, title, desc, PATH, img, upd), ld(art, faq))


def plan_page(k, lang):
    p, g = PLANS[k], grade_of(k)
    paths = {l: plan_path(l, k) for l in LANGS}
    doc = shell(lang, 'plan', paths)
    doc = plan_html(doc, p, lang)
    doc = hide(doc, 'next')
    doc = unhide(doc, 'result'); doc = fill(doc, 'result', result_block(k, lang))
    doc = unhide(doc, 'pnav'); doc = fill(doc, 'pnav', plan_nav(k, lang))
    title, desc, img, upd = plan_title(p, lang), plan_desc(p, lang, g), img_for(p, lang), updated_dt(p)
    mod = dt.datetime.strptime(g['graded_utc'], '%Y-%m-%dT%H:%MZ').replace(tzinfo=dt.timezone.utc) if g and g.get('graded_utc') else upd
    url = SITE + paths[lang]
    art = {'@type': 'Article', '@id': url + '#plan', 'headline': title[:110], 'description': desc, 'image': [img],
           'datePublished': upd.isoformat(), 'dateModified': mod.isoformat(), 'inLanguage': lang,
           'author': {'@id': SITE + '/#org'}, 'publisher': {'@id': SITE + '/#org'}, 'mainEntityOfPage': url,
           'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD)'}, 'isAccessibleForFree': True}
    bc = crumbs(lang, [('NEXUS CORE', PATH[lang]), (t(lang, 'tab_history') + ' · ' + month_label(k[:7], lang), track_path(lang, k[:7])),
                       (f"{day_label(dt.date.fromisoformat(p['date']), lang)} · {t(lang, 'ed_short')[p['edition']]}", paths[lang])])
    return finish(doc, head_tags(lang, title, desc, paths, img, upd, mod), ld(art, bc))


def month_stats(keys):
    gs = [grade_of(k) for k in keys]
    graded = [g for g in gs if g]
    reached = [g for g in graded if g['result'] in ('hit', 'void', 'expired')]
    hit = sum(1 for g in reached if g['result'] == 'hit')
    void = sum(1 for g in reached if g['result'] == 'void')
    tot = round(sum(g.get('r') or 0 for g in reached), 2)
    return len(keys), len(graded), len(reached), hit, void, tot


def track_page(ym, lang):
    keys = [k for k in KEYS if k.startswith(ym)]
    paths = {l: track_path(l, ym) for l in LANGS}
    doc = shell(lang, 'track', paths)
    n, ng, nr, hit, void, tot = month_stats(keys)
    st = lambda k, v: f'<div class="stat"><span class="k">{esc(t(lang, k))}</span><span class="v num" dir="ltr">{esc(v)}</span></div>'
    stats = (st('tr_plans', str(n)) + st('tr_graded', str(ng)) + st('tr_reached', str(nr)) +
             st('tr_hit', f'{hit}/{nr}' if nr else '—') + st('tr_void', f'{void}/{nr}' if nr else '—') + st('tr_r', r_text(tot, lang, 1) if nr else '—'))
    rows = []
    for k in reversed(keys):
        p, g = PLANS[k], grade_of(k)
        mz = p.get('main_zone')
        lab = t(lang, p['bias']) + (' · ' + t(lang, p['lean']) if p['bias'] == 'TWO_WAY' and p.get('lean') else '')
        rr = f'<span class="num r" dir="ltr">{esc(r_text(g.get("r"), lang))}</span>' if g and g.get('r') is not None else ''
        rows.append(f'<a class="card trow" href="{plan_path(lang, k)}"><span class="l"><strong>{esc(day_label(dt.date.fromisoformat(p["date"]), lang))} · {esc(t(lang, "ed_short")[p["edition"]])}</strong>'
                    f'<span class="h"><span class="pill {side_cls(side_of(p))}">{esc(lab)}</span>{(" " + num(rng(mz["lo"], mz["hi"], lang))) if mz else ""}</span></span>'
                    f'<span class="rt"><span class="pill {res_cls(g["result"]) if g else "neutral"}">{esc(res_label(g, lang))}</span>{rr}</span></a>')
    i = MONTHS.index(ym)
    nav = []
    if i > 0: nav.append(f'<a class="btn alt" href="{track_path(lang, MONTHS[i-1])}">{esc(t(lang, "tr_prev_m"))}</a>')
    if i + 1 < len(MONTHS): nav.append(f'<a class="btn alt" href="{track_path(lang, MONTHS[i+1])}">{esc(t(lang, "tr_next_m"))}</a>')
    nav.append(f'<a class="btn alt" href="{PATH[lang]}">{esc(t(lang, "today_plan"))}</a>')
    h1 = f"{t(lang, 'tr_h1')} · {month_label(ym, lang)}"
    body = (f'  <section id="view-track">\n    <div class="plan-head"><div><p class="eyebrow">XAUUSD · NEXUS CORE</p><h1>{esc(h1)}</h1>'
            f'<p class="lede">{esc(t(lang, "tr_lede"))}</p></div></div>\n'
            f'    <div class="stats">{stats}</div>\n'
            f'    <h2>{esc(t(lang, "tr_list"))}</h2>\n'
            f'    <div class="stack-sm">{"".join(rows) if rows else "<div class=\"card empty\">" + esc(t(lang, "tr_none")) + "</div>"}</div>\n'
            f'    <nav class="pnav">{"".join(nav)}</nav>\n'
            f'    <h2 id="method">{esc(t(lang, "tr_method"))}</h2>\n'
            f'    <ol class="card method">{"".join("<li>" + esc(x) + "</li>" for x in t(lang, "tr_m"))}</ol>\n  </section>')
    doc = set_view(doc, body)
    title = f"{h1} — XAUUSD | NEXUS CORE"
    desc = (f"{t(lang, 'tr_lede')} {t(lang, 'tr_plans')}: {n} · {t(lang, 'tr_hit')}: {hit}/{nr} · {t(lang, 'tr_r')}: {r_text(tot, lang, 1)}." if nr
            else f"{t(lang, 'tr_lede')} {t(lang, 'tr_plans')}: {n}.")[:300]
    url = SITE + paths[lang]
    page_ld = {'@type': 'CollectionPage', '@id': url, 'name': h1, 'description': desc, 'inLanguage': lang, 'isPartOf': {'@id': SITE + '/#website'},
               'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD)'},
               'mainEntity': {'@type': 'ItemList', 'numberOfItems': n, 'itemListElement': [
                   {'@type': 'ListItem', 'position': j + 1, 'url': SITE + plan_path(lang, k)} for j, k in enumerate(reversed(keys))]}}
    bc = crumbs(lang, [('NEXUS CORE', PATH[lang]), (h1, paths[lang])])
    return finish(doc, head_tags(lang, title, desc, paths, SITE + '/assets/logo-banner.png', og='website'), ld(page_ld, bc))


def signals_page(lang):
    paths = {l: signals_path(l) for l in LANGS}
    doc = shell(lang, 'signals', paths)
    body = (f'  <section id="view-signals">\n    <div class="plan-head"><div><p class="eyebrow">{esc(t(lang, "sg_soon"))}</p><h1>{esc(t(lang, "sg_h1"))}</h1>'
            f'<p class="lede">{esc(t(lang, "sg_lede"))}</p></div></div>\n'
            f'    <div class="layout">\n      <div class="stack">\n        <h2>{esc(t(lang, "sg_what"))}</h2>\n'
            f'        <ul class="card ticks">{"".join("<li>" + esc(x) + "</li>" for x in t(lang, "sg_b"))}</ul>\n'
            f'        <p class="muted small">{esc(t(lang, "sg_note"))}</p>\n      </div>\n      <div class="stack">\n'
            f'        <div class="card wl js-wl sg-wl" data-topic="signals">\n'
            f'          <div class="wl-t"><strong>{esc(t(lang, "sg_wl_title"))}</strong><span>{esc(t(lang, "sg_wl_sub"))}</span></div>\n'
            f'          <form class="wl-form" novalidate>\n'
            f'            <label class="sr" for="wl-email-s">{esc(t(lang, "wl_label"))}</label>\n'
            f'            <input type="email" id="wl-email-s" class="wl-email" name="email" autocomplete="email" inputmode="email" maxlength="254" required>\n'
            f'            <input type="text" class="hp wl-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">\n'
            f'            <button type="submit" class="btn solid wl-btn">{esc(t(lang, "wl_btn"))}</button>\n'
            f'          </form>\n          <p class="wl-msg" role="status" aria-live="polite"></p>\n'
            f'          <p class="wl-note muted">{esc(t(lang, "wl_privacy"))}</p>\n        </div>\n'
            f'        <a class="card next" href="{PATH[lang]}"><strong>{esc(t(lang, "sg_free"))}</strong><span>{esc(t(lang, "sg_free_link"))}</span></a>\n'
            f'      </div>\n    </div>\n  </section>')
    doc = set_view(doc, body)
    title = f"{t(lang, 'sg_h1')} — {t(lang, 'sg_soon')} | NEXUS CORE"
    desc = t(lang, 'sg_lede')
    url = SITE + paths[lang]
    page_ld = {'@type': 'WebPage', '@id': url, 'name': t(lang, 'sg_h1'), 'description': desc, 'inLanguage': lang, 'isPartOf': {'@id': SITE + '/#website'}}
    return finish(doc, head_tags(lang, title, desc, paths, SITE + '/assets/logo-banner.png', og='website'), ld(page_ld, crumbs(lang, [('NEXUS CORE', PATH[lang]), (t(lang, 'sg_h1'), paths[lang])])))


EN_ROOT = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>NEXUS CORE – gold plan</title>
<meta name="robots" content="noindex, follow"><link rel="canonical" href="https://nexuscore.trade/">
<meta http-equiv="refresh" content="0; url=/"></head>
<body><p><a href="/">NEXUS CORE – today's gold plan</a></p></body></html>
'''


# ---------- sitemap + llms.txt ----------

def sitemap():
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']

    def url(paths, lastmod=None, freq=None, prio=None):
        for lang in LANGS:
            s = f'  <url>\n    <loc>{SITE}{paths[lang]}</loc>'
            if lastmod: s += f'\n    <lastmod>{lastmod}</lastmod>'
            if freq: s += f'\n    <changefreq>{freq}</changefreq>'
            if prio: s += f'\n    <priority>{prio}</priority>'
            out.append(s)
            for l in LANGS: out.append(f'    <xhtml:link rel="alternate" hreflang="{l}" href="{SITE}{paths[l]}"/>')
            out.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{paths["en"]}"/>\n  </url>')

    def mod(k):
        g = grade_of(k)
        if g and g.get('graded_utc'): return dt.datetime.strptime(g['graded_utc'], '%Y-%m-%dT%H:%MZ').replace(tzinfo=dt.timezone.utc).isoformat()
        return updated_dt(PLANS[k]).isoformat()

    url(PATH, updated_dt(P).isoformat(), 'hourly', '1.0')
    for ym in reversed(MONTHS):
        ks = [k for k in KEYS if k.startswith(ym)]
        url({l: track_path(l, ym) for l in LANGS}, max((mod(k) for k in ks), default=None), 'daily', '0.8')
    url({l: signals_path(l) for l in LANGS}, None, 'monthly', '0.6')
    for k in reversed(KEYS):
        url({l: plan_path(l, k) for l in LANGS}, mod(k), None, '0.7')
    out.append('</urlset>')
    return '\n'.join(out) + '\n'


def llms():
    p, lang = P, 'en'
    mz = p.get('main_zone')
    n, ng, nr, hit, void, tot = month_stats([k for k in KEYS if k.startswith(CUR_MONTH)])
    lines = ['# NEXUS CORE', '',
             '> ' + SITE_DESC['en'], '',
             'NEXUS CORE AI publishes a free, AI-built trading plan for gold (XAUUSD) three times each trading day: '
             'before the Asia session (07:00 GMT+7), before London (13:45 GMT+7) and before New York (19:30 GMT+7). '
             'Each plan gives the bias, the main zone, targets, the level that invalidates the view, scenarios with rough probabilities, '
             'and the economic calendar. Every plan is graded in public on 15-minute candles after it expires — wins, losses and misses '
             'all stay on the record. Analysis only, not financial advice.', '',
             f'## Latest plan ({p["date"]}, {t(lang, "ed").get(p["edition"], p["edition"])}, updated {p["updated_vn"]} GMT+7)', '',
             f'- Permanent page: {SITE}{plan_path("en", key_of(p))}',
             f'- Bias: {bias_label(p, lang)}',
             f'- Summary: {L(p.get("headline"), lang)}']
    if mz: lines.append(f'- Main zone: {t(lang, mz["side"])} {rng(mz["lo"], mz["hi"], lang)}')
    for x in p.get('targets') or []: lines.append(f'- Target {x["label"]}: {rng(x["lo"], x["hi"], lang)}')
    if p.get('range'): lines.append(f'- Expected range: {rng(p["range"]["lo"], p["range"]["hi"], lang)}')
    if p.get('invalidation'): lines.append(f'- View is wrong if: {L(p["invalidation"], lang)}')
    for i, s in enumerate(p.get('scenarios') or []):
        lines.append(f'- {"Main" if i == 0 else "Alternate"} scenario (~{s["prob"]}%, {t(lang, s["side"])}): {L(s["text"], lang)}')
    lines += ['', f'## Track record ({month_label(CUR_MONTH, "en")})', '',
              f'- Plans published: {n}; graded: {ng}; zone reached: {nr}; Target 1 reached: {hit}; invalidated: {void}; total: {r_text(tot, "en", 1) if nr else "n/a"}',
              f'- Full list and grading rules: {SITE}{track_path("en", CUR_MONTH)}', '',
              '## Recent plans', '']
    for k in list(reversed(KEYS))[:12]:
        q, g = PLANS[k], grade_of(k)
        qz = q.get('main_zone')
        lines.append(f'- [{q["date"]} {t("en", "ed")[q["edition"]]}]({SITE}{plan_path("en", k)}): {bias_label(q, "en")}'
                     f'{(", main zone " + rng(qz["lo"], qz["hi"], "en")) if qz else ""} — {res_label(g, "en")}{(" " + r_text(g.get("r"), "en")) if g and g.get("r") is not None else ""}')
    lines += ['', '## Pages', '',
              f'- [Today\'s gold plan (English)]({SITE}/): latest XAUUSD plan with chart, zones and scenarios',
              f'- [خطة الذهب اليوم (العربية)]({SITE}/ar/): the same plan in Arabic',
              f'- [Plan vàng hôm nay (Tiếng Việt)]({SITE}/vi/): the same plan in Vietnamese',
              f'- [Track record]({SITE}{track_path("en", CUR_MONTH)}): every plan this month and how it played out',
              f'- [Signals]({SITE}{signals_path("en")}): members-only trade signals (waitlist)',
              f'- [Plan data (JSON)]({SITE}/data/latest.json): machine-readable latest plan',
              f'- [All plans with grades (JSON)]({SITE}/data/history.json)', '',
              '## Optional', '',
              '- [Telegram channel](https://t.me/nexuscorefx): every plan as it is published',
              '- [X @XAU_CRYPTO](https://x.com/XAU_CRYPTO)', '- [YouTube @nexuscorefx](https://www.youtube.com/@nexuscorefx)', '',
              'Risk: ' + t('en', 'disclaimer'), '']
    return '\n'.join(lines)


if __name__ == '__main__':
    write('data/history.json', history_json())
    for lang in LANGS:
        doc = home_page(lang)
        write(('' if lang == 'en' else lang + '/') + 'index.html', doc)
        # /today (bio links on TikTok/Instagram/YouTube) = same page; canonical stays on the language home
        write(('' if lang == 'en' else lang + '/') + 'today/index.html', doc)
        for k in KEYS:
            write(plan_path(lang, k).strip('/') + '/index.html', plan_page(k, lang))
        for ym in MONTHS:
            write(track_path(lang, ym).strip('/') + '/index.html', track_page(ym, lang))
        write(signals_path(lang).strip('/') + '/index.html', signals_page(lang))
    write('en/index.html', EN_ROOT)
    write('sitemap.xml', sitemap())
    write('llms.txt', llms())
    print(f'built: home + today, {len(KEYS)} plan page(s) x3, {len(MONTHS)} track-record month(s) x3, signals x3, sitemap.xml, llms.txt –', P['date'], P['edition'])
