#!/usr/bin/env python3
"""Build the static pages search engines and AI assistants read without running JavaScript.

  python3 tools/build.py [site_dir]

Reads template.html + data/latest.json + data/history.json and the texts in app.js, then writes
  index.html (English), ar/index.html, vi/index.html  – plan already written into the HTML,
  sitemap.xml, llms.txt.
app.js still runs on top for visitors (local time, alerts, tabs). Run after every data change.
"""
import html, json, os, re, subprocess, sys, datetime as dt

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..'))
SITE = 'https://nexuscore.trade'
LANGS = ['en', 'ar', 'vi']
PATH = {'en': '/', 'ar': '/ar/', 'vi': '/vi/'}
LOCALE = {'en': 'en_US', 'ar': 'ar_AR', 'vi': 'vi_VN'}
ED_TIME = {'0700': '07:00', '1345': '13:45', '1930': '19:30'}
ED_ORDER = ['0700', '1345', '1930']
TZ_VN = dt.timezone(dt.timedelta(hours=7))
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
try:
    H = json.loads(read('data/history.json'))
except Exception:
    H = {'days': []}
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


def history_html(doc, lang):
    days = sorted(H.get('days') or [], key=lambda d: d['date'], reverse=True)
    items = []
    for d in days[:60]:
        side = (d.get('lean') or '') if d.get('bias') in ('TWO_WAY', 'STAND_ASIDE') else d.get('bias')
        lab = t(lang, d.get('bias', '')) + (' · ' + t(lang, d['lean']) if d.get('bias') == 'TWO_WAY' and d.get('lean') else '')
        res = t(lang, d['result']) if d.get('result') else t(lang, 'pending')
        items.append(f'<div class="card sig"><div class="stack-sm"><div class="h"><strong>{esc(day_label(dt.date.fromisoformat(d["date"]), lang))}</strong> '
                     f'<span class="pill {side_cls(side)}">{esc(lab)}</span></div><span class="muted">{esc(res)}'
                     f'{" · " + num(fmt(d["main_zone"], lang)) if d.get("main_zone") else ""}</span></div></div>')
    return fill(doc, 'hist-list', ''.join(items))


def head(p, lang):
    d0 = dt.date.fromisoformat(p['date'])
    upd = updated_dt(p)
    bias = bias_label(p, lang)
    title = f"{t(lang, 'plan_of')} {day_label(d0, lang)} · {bias} — XAUUSD | NEXUS CORE"
    mz = p.get('main_zone')
    desc = L(p.get('headline'), lang)
    if mz: desc += f" — {t(lang, 'main_zone')}: {rng(mz['lo'], mz['hi'], lang)}."
    desc += ' ' + t(lang, 'ed').get(p['edition'], '') + '.'
    desc = desc[:300]
    url = SITE + PATH[lang]
    src = chart_for(p, lang)
    img = SITE + '/' + src if src else SITE + '/assets/logo-banner.png'
    alts = ''.join(f'\n<link rel="alternate" hreflang="{l}" href="{SITE}{PATH[l]}">' for l in LANGS)
    alts += f'\n<link rel="alternate" hreflang="x-default" href="{SITE}/">'
    og_alt = ''.join(f'\n<meta property="og:locale:alternate" content="{LOCALE[l]}">' for l in LANGS if l != lang)
    return (f'<title>{esc(title)}</title>\n'
            f'<meta name="description" content="{esc(desc)}">\n'
            f'<link rel="canonical" href="{url}">{alts}\n'
            f'<meta name="robots" content="index, follow, max-image-preview:large">\n'
            f'<meta property="og:type" content="article">\n'
            f'<meta property="og:site_name" content="NEXUS CORE">\n'
            f'<meta property="og:url" content="{url}">\n'
            f'<meta property="og:title" content="{esc(title)}">\n'
            f'<meta property="og:description" content="{esc(desc)}">\n'
            f'<meta property="og:image" content="{img}">\n'
            f'<meta property="og:image:width" content="1800">\n<meta property="og:image:height" content="1110">\n'
            f'<meta property="og:locale" content="{LOCALE[lang]}">{og_alt}\n'
            f'<meta property="article:published_time" content="{upd.isoformat()}">\n'
            f'<meta property="article:modified_time" content="{upd.isoformat()}">\n'
            f'<meta name="twitter:card" content="summary_large_image">\n'
            f'<meta name="twitter:site" content="@XAU_CRYPTO">\n'
            f'<meta name="twitter:title" content="{esc(title)}">\n'
            f'<meta name="twitter:description" content="{esc(desc)}">\n'
            f'<meta name="twitter:image" content="{img}">'), title, desc, url, img, upd


def jsonld(p, lang, title, desc, url, img, upd):
    org = {'@type': 'Organization', '@id': SITE + '/#org', 'name': 'NEXUS CORE AI', 'url': SITE + '/',
           'logo': {'@type': 'ImageObject', 'url': SITE + '/assets/icon-512.png', 'width': 512, 'height': 512}, 'sameAs': SAME_AS}
    site = {'@type': 'WebSite', '@id': SITE + '/#website', 'name': 'NEXUS CORE', 'url': SITE + '/', 'publisher': {'@id': SITE + '/#org'},
            'inLanguage': LANGS, 'description': SITE_DESC['en']}
    art = {'@type': 'Article', '@id': url + '#plan', 'headline': title[:110], 'description': desc, 'image': [img],
           'datePublished': upd.isoformat(), 'dateModified': upd.isoformat(), 'inLanguage': lang,
           'author': {'@id': SITE + '/#org'}, 'publisher': {'@id': SITE + '/#org'}, 'mainEntityOfPage': url,
           'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD)'},
           'isAccessibleForFree': True}
    mz = p.get('main_zone')
    qa = [(FAQ[lang][0], bias_label(p, lang) + ' — ' + L(p.get('headline'), lang))]
    if mz: qa.append((FAQ[lang][1], f"{t(lang, mz['side'])} {rng(mz['lo'], mz['hi'], lang)} ({t(lang, 'ed').get(p['edition'], '')})"))
    if p.get('invalidation'): qa.append((FAQ[lang][2], L(p['invalidation'], lang)))
    faq = {'@type': 'FAQPage', '@id': url + '#faq', 'inLanguage': lang, 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a + ' ' + t(lang, 'disclaimer').split('.')[0] + '.'}} for q, a in qa]}
    data = {'@context': 'https://schema.org', '@graph': [org, site, art, faq]}
    s = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    return '<script type="application/ld+json">' + s + '</script>'


def page(lang):
    doc = read('template.html')
    doc = doc.replace('{{LANG}}', lang).replace('{{DIR}}', 'rtl' if lang == 'ar' else 'ltr').replace('{{HOME}}', PATH[lang])
    for k, v in T[lang].items():
        if isinstance(v, str) and k != 'loading':
            doc = re.sub(r'(data-i18n="%s"[^>]*>)(</)' % re.escape(k), lambda m: m.group(1) + esc(v) + m.group(2), doc)
    doc = re.sub(r'(<a role="button" href="[^"]*" data-lang="%s")' % lang, r'\1 aria-pressed="true" aria-current="page"', doc)
    doc = doc.replace('<a href="#plan" data-tab="plan"', '<a href="#plan" aria-current="page" data-tab="plan"', 1)
    h, title, desc, url, img, upd = head(P, lang)
    doc = doc.replace('{{HEAD}}', h)
    doc = plan_html(doc, P, lang)
    doc = history_html(doc, lang)
    doc = doc.replace('{{JSONLD}}', jsonld(P, lang, title, desc, url, img, upd))
    if '{{' in doc: raise SystemExit('template placeholder left: ' + re.search(r'\{\{\w+\}\}', doc).group(0))
    return doc


def sitemap():
    lm = updated_dt(P).isoformat()
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for lang in LANGS:
        out.append(f'  <url>\n    <loc>{SITE}{PATH[lang]}</loc>\n    <lastmod>{lm}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>')
        for l in LANGS: out.append(f'    <xhtml:link rel="alternate" hreflang="{l}" href="{SITE}{PATH[l]}"/>')
        out.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}/"/>\n  </url>')
    out.append('</urlset>')
    return '\n'.join(out) + '\n'


def llms():
    p, lang = P, 'en'
    mz = p.get('main_zone')
    lines = ['# NEXUS CORE', '',
             '> ' + SITE_DESC['en'], '',
             'NEXUS CORE AI publishes a free, AI-built trading plan for gold (XAUUSD) three times each trading day: '
             'before the Asia session (07:00 GMT+7), before London (13:45 GMT+7) and before New York (19:30 GMT+7). '
             'Each plan gives the bias, the main zone, targets, the level that invalidates the view, scenarios with rough probabilities, '
             'and the economic calendar. Plans are graded in public after the daily close. Analysis only, not financial advice.', '',
             f'## Latest plan ({p["date"]}, {t(lang, "ed").get(p["edition"], p["edition"])}, updated {p["updated_vn"]} GMT+7)', '',
             f'- Bias: {bias_label(p, lang)}',
             f'- Summary: {L(p.get("headline"), lang)}']
    if mz: lines.append(f'- Main zone: {t(lang, mz["side"])} {rng(mz["lo"], mz["hi"], lang)}')
    for x in p.get('targets') or []: lines.append(f'- Target {x["label"]}: {rng(x["lo"], x["hi"], lang)}')
    if p.get('range'): lines.append(f'- Expected range: {rng(p["range"]["lo"], p["range"]["hi"], lang)}')
    if p.get('invalidation'): lines.append(f'- View is wrong if: {L(p["invalidation"], lang)}')
    for i, s in enumerate(p.get('scenarios') or []):
        lines.append(f'- {"Main" if i == 0 else "Alternate"} scenario (~{s["prob"]}%, {t(lang, s["side"])}): {L(s["text"], lang)}')
    lines += ['', '## Pages', '',
              f'- [Today\'s gold plan (English)]({SITE}/): latest XAUUSD plan with chart, zones and scenarios',
              f'- [خطة الذهب اليوم (العربية)]({SITE}/ar/): the same plan in Arabic',
              f'- [Plan vàng hôm nay (Tiếng Việt)]({SITE}/vi/): the same plan in Vietnamese',
              f'- [Plan data (JSON)]({SITE}/data/latest.json): machine-readable latest plan',
              f'- [Track record (JSON)]({SITE}/data/history.json): every plan and its grade', '',
              '## Optional', '',
              '- [Telegram channel](https://t.me/nexuscorefx): every plan as it is published',
              '- [X @XAU_CRYPTO](https://x.com/XAU_CRYPTO)', '- [YouTube @nexuscorefx](https://www.youtube.com/@nexuscorefx)', '',
              'Risk: ' + t('en', 'disclaimer'), '']
    return '\n'.join(lines)


if __name__ == '__main__':
    for lang in LANGS:
        write(('' if lang == 'en' else lang + '/') + 'index.html', page(lang))
    write('sitemap.xml', sitemap())
    write('llms.txt', llms())
    print('built: index.html ar/index.html vi/index.html sitemap.xml llms.txt –', P['date'], P['edition'])
