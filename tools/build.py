#!/usr/bin/env python3
"""Build the static pages search engines and AI assistants read without running JavaScript.

  python3 tools/build.py [site_dir]

Reads template.html + data/latest.json + data/plans/*.json + data/grades.json and the texts in app.js, then writes
  data/plans/<date>-<edition>.json      – archive copy of latest.json (never edited by hand)
  data/history.json                     – every plan with its grade (generated)
  index.html (EN), ar/, vi/, zh-hant/                                  – home page (intro + today's plan preview)
  today/ (+ ar/today/, vi/today/, zh-hant/today/)                   – latest plan with tabs
  <lang>/terms/, <lang>/privacy/, <lang>/risk-disclosure/           – legal pages (texts in tools/site_copy.py)
  <en|ar|vi>/plan/<date>-<asia|london|newyork>/index.html             – one page per plan
  <en|ar|vi>/track-record/<yyyy-mm>/index.html                        – monthly track record
  <en|ar|vi>/signals/index.html                                       – Signals (members only) + waitlist
  <en|ar|vi|zh-hant>/ea/index.html                                    – NEXUS CORE Gold EA landing page (copy in tools/ea_copy.py)
  en/index.html (points to /), sitemap.xml, llms.txt.
app.js still runs on top for visitors (local time, alerts, email). Run after every data change.
"""
import glob, html, json, os, re, subprocess, sys, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from site_copy import COPY, UPDATED
from zoneinfo import ZoneInfo
ZoneInfoNY = ZoneInfo('America/New_York')

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..'))
SITE = 'https://nexuscore.trade'
LANGS = ['en', 'ar', 'vi', 'zh-hant']
HL = {'en': 'en', 'ar': 'ar', 'vi': 'vi', 'zh-hant': 'zh-Hant'}   # html lang / hreflang code
PATH = {'en': '/', 'ar': '/ar/', 'vi': '/vi/', 'zh-hant': '/zh-hant/'}
PFX = {'en': '/en', 'ar': '/ar', 'vi': '/vi', 'zh-hant': '/zh-hant'}
SESSION = {'0700': 'asia', '1345': 'london', '1930': 'newyork'}
LOCALE = {'en': 'en_US', 'ar': 'ar_AR', 'vi': 'vi_VN', 'zh-hant': 'zh_TW'}
ED_TIME = {'0700': '07:00', '1345': '13:45', '1930': '19:30'}
ED_ORDER = ['0700', '1345', '1930']
TZ_VN = dt.timezone(dt.timedelta(hours=7))
MON_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
DAY = {'en': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
       'vi': ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
       'ar': ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
       'zh-hant': ['週一', '週二', '週三', '週四', '週五', '週六', '週日']}
MON_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
VN_TZ_LABEL = {'en': 'GMT+7', 'ar': 'غرينتش+7', 'vi': 'giờ VN', 'zh-hant': 'GMT+7'}
# Each language shows times in its readers' clock (user, 17/11/2026): EN = UK time, AR = Mecca time,
# VI = Vietnam time, 繁中 = Taipei / Hong Kong time. Plan data stays in Vietnam time (GMT+7) and is converted here.
TZ_LANG = {'en': ZoneInfo('Europe/London'), 'ar': ZoneInfo('Asia/Riyadh'), 'vi': ZoneInfo('Asia/Ho_Chi_Minh'), 'zh-hant': ZoneInfo('Asia/Taipei')}


def to_local(d, lang):
    """Vietnam-time datetime (naive or aware) → the language's own clock."""
    if d.tzinfo is None: d = d.replace(tzinfo=TZ_VN)
    return d.astimezone(TZ_LANG[lang])


def tz_label(d, lang):
    """Short zone name for a local datetime: GMT / BST in the UK, otherwise GMT+n."""
    off = int(d.utcoffset().total_seconds() // 3600)
    if lang == 'en': return 'BST' if off == 1 else 'GMT'
    return f'GMT+{off}' if off else 'GMT'


def hm_local(d, lang):
    x = to_local(d, lang)
    return f'{x:%H:%M} {tz_label(x, lang)}'


def vn_news_time(s, year, lang):
    """News time "dd/mm HH:MM" (Vietnam time) → "dd/mm HH:MM <zone>" in the language's clock; "dd/mm" stays as is."""
    m = re.fullmatch(r'(\d{2})/(\d{2})(?:\s+(\d{2}):(\d{2}))?', str(s or '').strip())
    if not m: return str(s or '')
    if not m.group(3): return f'{m.group(1)}/{m.group(2)}'
    x = to_local(dt.datetime(int(year), int(m.group(2)), int(m.group(1)), int(m.group(3)), int(m.group(4))), lang)
    return f'{x:%d/%m %H:%M} {tz_label(x, lang)}'
FAQ = {
    'en': ('What is the gold (XAUUSD) bias today?', 'Where is the main gold zone today?', 'What would make today\'s gold view wrong?'),
    'ar': ('ما اتجاه الذهب (XAUUSD) اليوم؟', 'أين المنطقة الرئيسية للذهب اليوم؟', 'ما الذي يُلغي نظرة اليوم على الذهب؟'),
    'vi': ('Xu hướng vàng (XAUUSD) hôm nay thế nào?', 'Vùng giá chính của vàng hôm nay ở đâu?', 'Khi nào nhận định vàng hôm nay sai?'),
    'zh-hant': ('今日黃金（XAUUSD）方向如何？', '今日黃金的主要區域在哪裡？', '什麼情況代表今日的黃金觀點失效？'),
}
SITE_DESC = {
    'en': 'Free AI-built gold (XAUUSD) game plan: key zones, scenarios and the level that proves the view wrong, refreshed before the Asia, London and New York sessions, every plan graded in public.',
    'ar': 'خطة مجانية للذهب (XAUUSD) مبنية بالذكاء الاصطناعي: مناطق رئيسية وسيناريوهات ومستوى إلغاء الفكرة، تُحدَّث قبل جلسات آسيا ولندن ونيويورك وتُقيَّم كل خطة علنًا.',
    'vi': 'Plan vàng (XAUUSD) miễn phí do AI lập: vùng giá chính, kịch bản và mốc cho biết nhận định sai, cập nhật trước phiên Á, Âu và Mỹ, mọi plan được chấm công khai.',
    'zh-hant': '免費的 AI 輔助黃金（XAUUSD）交易計畫：關鍵區域、情境推演與觀點失效價位，於亞洲、倫敦、紐約盤前更新，每份計畫皆公開評分。',
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
from ea_copy import EA
P = json.loads(read('data/latest.json'))
esc = lambda s: html.escape(str(s), quote=True)


_ABOUT = {'en': 'about ', 'vi': 'khoảng ', 'ar': 'نحو ', 'zh-hant': '約'}
_CLAUSE = re.compile(r'[.;:!?\n。；：؛,，،(（]')


def tidy(s, lang):
    """Plain, human punctuation for text written by the plan schedules: no spaced dashes or middle dots
    between clauses (a short label before the dash becomes "label: …", anything longer gets a comma),
    number ranges as 3880–3887, "~15" as "about 15". Same rules as tidy() in app.js."""
    if not s or not isinstance(s, str): return s or ''
    zh, ar = lang == 'zh-hant', lang == 'ar'
    s = s.replace('——', '，' if zh else ' – ')
    s = re.sub(r'(\d)\s+[–—]\s+(\d)', r'\1–\2', s)
    comma, colon = ('，', '：') if zh else ('، ', ': ') if ar else (', ', ': ')
    s = re.sub(r'\s*·\s*', comma, s)
    out, pos = [], 0
    for m in re.finditer(r'\s+[–—-]\s+', s):
        left = s[pos:m.start()]
        out.append(left)
        done = ''.join(out)
        cut = max((done.rfind(c) for c in '.;:!?\n。；：؛,，،(（'), default=-1)
        clause = done[cut + 1:].strip()
        short = len(clause) <= 6 if zh else len(clause.split()) <= (3 if lang == 'vi' else 2)
        out.append(colon if clause and short and not re.search(r'[:：]', clause) else comma)
        pos = m.end()
    out.append(s[pos:])
    s = ''.join(out)
    s = re.sub(r'~\s*(?=[\d$+−-])', _ABOUT.get(lang, 'about '), s)
    s = re.sub(r'([,，،:：])\s*([,，،])', r'\1', s)
    s = re.sub(r'  +', ' ', s).strip()
    if not ar: s = re.sub(r'(\d)–(\d)', '\\1\u2060–\u2060\\2', s)   # never break a price range across lines
    return s


def raw_of(o, lang):
    if o is None: return ''
    return o if isinstance(o, str) else (o.get('zh' if lang == 'zh-hant' else lang) or o.get('en') or o.get('vi') or '')


def L(o, lang):
    if o is None: return ''
    s = tidy(raw_of(o, lang), lang)
    # Arabic: keep price ranges left to right inside the sentence (3912–3932.1, not 3932.1–3912), same as app.js
    if lang == 'ar': s = re.sub(r'(\d(?:[\d.,:]*\d)?)\s*[–-]\s*(\d(?:[\d.,:]*\d)?)', '\u2066\\1–\\2\u2069', s)
    return s


def fmt(n, lang):
    s = ('%g' % round(n, 1)) if isinstance(n, (int, float)) else str(n)   # prices shown to 0.1, like the plan
    return s


def pips(n, lang):
    """XAUUSD convention: 1 pip = 0.10 USD"""
    v = int(round(float(n) * 10))
    return f'{v:,} ' + pip_word(v, lang)


def pip_word(v, lang): return 'pips' if lang == 'en' and abs(v) != 1 else 'pip'


STD_R = 10.0   # fixed comparison unit for MFE: 1 standard R = 10 dollars (not the trade's own R)


def std_r(n, lang):
    return r_text(round(float(n) / STD_R, 1), lang, 1) + ' ' + t(lang, 'std_r')


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
    if lang == 'zh-hant': return f"{d.month}月{d.day}日（{DAY['zh-hant'][d.weekday()]}）"
    return f"{DAY['ar'][d.weekday()]}، {d.day} {MON_AR[d.month-1]}"


def bias_label(p, lang):
    b = t(lang, p['bias'])
    if p['bias'] == 'TWO_WAY' and p.get('lean'):
        b += ', ' + t(lang, 'lean') + ' ' + t(lang, p['lean'])
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


def par(x, lang): return f'（{x}）' if lang == 'zh-hant' else f' ({x})'


def scen_text(s):
    """The card already says Main / Alternate: drop the same word at the start of the scenario text (same as app.js)."""
    s = re.sub(r'^(Chính|Phụ|Main|Alt(ernate)?|Primary|Secondary|主要|次要|الرئيسي|البديل)[^:：]{0,14}[:：]\s*', '', s, flags=re.I)
    return s[:1].upper() + s[1:]


_STEP_PRICE = re.compile('\\d{3,5}(?:\\.\\d+)?(?:\u2060?[–-]\u2060?\\d{3,5}(?:\\.\\d+)?)?')


def scen_steps(text, lang):
    """A scenario sentence as a short path (same as scenSteps in app.js): one group per sentence or ';' clause,
    one step per '→' (or '←' in Arabic). First step of a group = the setup, the next ones = what follows. Prices in bold."""
    out, first = [], True
    for g in re.split(r'(?:(?<=\.)\s+|。|[;；؛]\s*)', text):
        parts = [x.strip(' ,，،.。') for x in re.split(r'\s*[→←]\s*', g)]
        parts = [x[:1].upper() + x[1:] for x in parts if x]
        for i, x in enumerate(parts):
            cls = ('c' if i == 0 else 'o') + (' e' if i == len(parts) - 1 else '') + (' g' if i == 0 and not first else '')
            out.append(f'<li class="{cls}">' + _STEP_PRICE.sub(lambda m: '<b class="px">' + m.group(0) + '</b>', esc(x)) + '</li>')
        if parts: first = False
    return '<ol class="steps">' + ''.join(out) + '</ol>'


# Headline wording a reader understands (user, 17/11/2026: "sai trên nghĩa là gì"): the short "void above X" /
# "sai trên X" becomes a full phrase and its own idea. Same rules as clearHeadline() in app.js.
_HL_FIX = {
    'vi': [(r'[,;]?\s*\bsai trên\s+', '; Nhận định sai nếu giá vượt lên trên '), (r'[,;]?\s*\bsai dưới\s+', '; Nhận định sai nếu giá xuống dưới '),
           (r'[,;]?\s*(?<!định )\bsai nếu\s+', '; Nhận định sai nếu ')],
    'en': [(r'[,;]?\s*\bvoid above\s+', '; The view is wrong if price goes above '), (r'[,;]?\s*\bvoid below\s+', '; The view is wrong if price goes below '),
           (r'[,;]?\s*\bvoid on\s+', '; The view is wrong on '), (r'^SELL rallies into\b', 'Sell the rally into'), (r'^BUY dips into\b', 'Buy the dip into')],
    'ar': [(r'[،,؛]?\s*و?تُلغى فوق\s+', '؛ تُلغى الفكرة إذا صعد السعر فوق '), (r'[،,؛]?\s*و?تُلغى (?:تحت|دون|أسفل)\s+', '؛ تُلغى الفكرة إذا هبط السعر دون ')],
    'zh-hant': [(r'[，,]\s*(?=[\d⁠]+(?:\.\d+)?\s*之[上下]觀點失效)', '；'), (r'(\d+(?:\.\d+)?)\s*之上觀點失效', r'價格站上 \1 則觀點失效'),
                (r'(\d+(?:\.\d+)?)\s*之下觀點失效', r'價格跌破 \1 則觀點失效')],
}


def plan_headline(p, lang):
    s = L(p.get('headline'), lang)
    for a, b in _HL_FIX.get(lang, []): s = re.sub(a, b, s)
    return s.lstrip('; ؛；')


def headline_html(s, lang):
    """First idea large (what to do), each further idea on its own line; the "wrong if" idea marked."""
    parts = [x.strip(' ,，،') for x in re.split(r'\s*[;；؛]\s*', s) if x.strip(' ,，،')]
    parts = [x[:1].upper() + x[1:] for x in parts]
    if not parts: return ''
    inv = re.compile(r'Nhận định sai|view is wrong|تُلغى|失效')
    li = ''.join(f'<li{" class=\"inv\"" if inv.search(x) else ""}>' + _STEP_PRICE.sub(lambda m: '<b class="px">' + m.group(0) + '</b>', esc(x)) + '</li>' for x in parts[1:])
    return f'<span class="hl1">{esc(parts[0])}</span>' + (f'<ul class="hl">{li}</ul>' if li else '')


INV_RE = re.compile(r'huỷ|hủy|\bvoid\b|失效|تُلغى|تلغى|bị phá|\bbreaks\b|تنكسر|ينكسر|即突破|即跌破|bỏ vùng|is cancelled|取消', re.I)
VALID_RE = re.compile(r'hiệu lực|\bvalid\b|有效|صالحة', re.I)


def ideas_html(text, lang, mark=False, skip_lab=''):
    """Long level texts (watch level, "view is wrong if") as one line per idea (same as ideasEl in app.js):
    a long "Label: …" opener becomes a small note, a short "Label:" is bold, "A → B" shows condition → result. Prices in bold."""
    px = lambda x: _STEP_PRICE.sub(lambda m: '<b class="px">' + m.group(0) + '</b>', esc(x))
    cap = lambda x: x[:1].upper() + x[1:]
    arrow = '←' if lang == 'ar' else '→'
    out = []
    if skip_lab and text.lower().startswith(skip_lab.lower()):   # "Main zone: …" under a "Main zone" chip
        text = text[len(skip_lab):].lstrip(' :：,，،–-')
    for g in re.split(r'(?:(?<=\.)\s+|。|[;；؛]\s*)', text):
        g = g.strip(' ,，،.。')
        if not g: continue
        lab = ''
        m = re.match(r'^([^\d:：]{2,80}?)\s*[:：]\s*(.+)$', g)
        if m:
            if skip_lab and m.group(1).strip().lower() == skip_lab.lower(): pass
            elif len(m.group(1)) > 26 or re.search(r'[,，،]', m.group(1)): out.append(f'<li class="nt">{esc(cap(m.group(1).strip()))}</li>')
            else: lab = m.group(1).strip()
            g = m.group(2)
        parts = [cap(x.strip(' ,，،')) for x in re.split(r'\s*[→←]\s*', g) if x.strip(' ,，،')]
        if not parts: continue
        head = f'<b class="lbl">{esc(cap(lab))}{"：" if lang == "zh-hant" else ":"}</b> ' if lab else ''
        mk = (' inv' if INV_RE.search(g) else ' tm' if VALID_RE.search(g) else '') if mark else ''
        if len(parts) > 1:
            out.append(f'<li class="ar{mk}">{head}<span class="cd">{px(parts[0])}</span><span class="to" aria-hidden="true">{arrow}</span>'
                       f'<span class="rs">{f" {arrow} ".join(px(x) for x in parts[1:])}</span></li>')
        else:
            out.append(f'<li{(" class=" + chr(34) + mk.strip() + chr(34)) if mk else ""}>{head}{px(parts[0])}</li>')
    return '<ul class="ideas">' + ''.join(out) + '</ul>'


def verdict_cls(v):
    if re.search(r'hồi|rebound|反彈|ارتداد|trung tính|neutral|中性|محايد|đi ngang|range|整理', v, re.I): return 'neutral'
    if re.search(r'giảm|bear|偏空|下跌|هابط', v, re.I): return 'sell'
    if re.search(r'tăng|bull|偏多|上漲|صاعد', v, re.I): return 'buy'
    return 'neutral'


def ctx_card(k, v, lang):
    """Market context card (same as ctxCard in app.js): label, coloured verdict, one line per idea, or a name/price table."""
    head = f'<span class="k">{esc(k)}</span>'
    m = re.match(r'^([^\d:：]{2,40}?)\s*[:：]\s*(.+)$', v)
    if not m and lang == 'zh-hant': m = re.match(r'^(偏空|偏多|中性|雙向|震盪|整理)[，,]\s*(.+)$', v)
    if m and not re.search(r'[,，،]', m.group(1)):
        head += f'<span class="vd {verdict_cls(m.group(1))}">{esc(m.group(1)[:1].upper() + m.group(1)[1:])}</span>'
        v = m.group(2)
    items = [x.rstrip(' .。') for x in re.split(r'\s*[;；؛]\s*', v) if x.strip(' .。')]
    pairs = [re.match(r'^(.+?)\s+(\d{3,5}(?:\.\d+)?)$', x.strip()) for x in items]
    if len(items) > 1 and all(q and re.search(r'[^\d\s/.:-]', q.group(1)) for q in pairs):
        body = '<div class="kv">' + ''.join(f'<span class="kk">{esc(q.group(1)[:1].upper() + q.group(1)[1:])}</span><b class="px">{esc(q.group(2))}</b>' for q in pairs) + '</div>'
    else:
        body = ideas_html(v, lang)
    return f'<div class="stat ctx"><div class="ch">{head}</div>{body}</div>'


_NEWS_RE = re.compile(r'tin đỏ|giờ tin|sau tin|trước tin|tin tức|news|release|\bdata\b|數據|公布|بيانات|الخبر|الإصدار', re.I)
_STOP = {'early', 'late', 'session', 'york', 'high', 'impact', 'with', 'from', 'speaks', 'into', 'today', 'tomorrow', 'turn', 'core'}


def alert_news(p):
    """The high-impact release the warning is about: best word match with the English alert, else the first high-impact item."""
    highs = [n for n in p.get('news') or [] if n.get('impact') == 'high']
    if not highs: return None
    words = lambda x: {w for w in re.findall(r'[a-z]{4,}', (x or '').lower())} - _STOP
    aw = words(raw_of(p.get('alert'), 'en'))
    best = max(highs, key=lambda n: len(aw & words(raw_of(n.get('text'), 'en'))))
    return best if aw & words(raw_of(best.get('text'), 'en')) else highs[0]


def alert_html(p, lang):
    """Warning box (user, 17/11/2026: "chỉ cần tin gì, lúc mấy giờ, cần lưu ý gì"): badge, the release and its time in the
    page's clock, then only the advice about it. Same as alertInto in app.js."""
    raw = raw_of(p.get('alert'), lang)
    sents = [x for x in re.split(r'(?<=\.)\s+|。', raw) if x.strip()]
    split = lambda x: [y.strip(' ,，،.。') for y in re.split(r'(?<!\d)\s+[–—]\s+(?!\d)|——|[;；؛]\s*', x) if y.strip(' ,，،.。')]
    first = split(sents[0]) if sents else []
    if not first: return ''
    notes = first[1:] + [y for x in sents[1:] for y in split(x) if _NEWS_RE.search(y)]
    px = lambda x: _STEP_PRICE.sub(lambda m: '<b class="px">' + m.group(0) + '</b>', esc(x))
    cap = lambda x: x[:1].upper() + x[1:]
    head, badge = L(first[0], lang), ''
    m = re.match(r'^([^\d:：]{2,30}?)\s*[:：]\s*(.+)$', head)
    if m: badge, head = m.group(1), m.group(2)
    n = alert_news(p)
    if n:
        head = L(n.get('text'), lang)
        when = f'<span class="al-time num" dir="ltr">{esc(vn_news_time(n.get("time", ""), p["date"][:4], lang))}</span>'
    else:
        when = ''
    top = (f'<span class="al-b">{esc(badge)}</span>' if badge else '') + f'<b class="al-h">{px(cap(head))}</b>' + when
    li = ''.join(f'<li>{px(cap(L(x, lang)))}</li>' for x in notes)
    return f'<div class="al-t">{top}</div>' + (f'<ul class="ideas">{li}</ul>' if li else '')


# Zones as support / resistance (user, 17/11/2026): say which one it is, and the condition for it to turn into the other.
# "only valid after an M15 close below X" on a sell zone = a support that becomes new resistance after a closed break.
_ACT = {'vi': r'[,;]?\s*(?:chỉ\s+)?có hiệu lực sau khi (M15|H1|H4|D1) đóng (dưới|trên) (\d+(?:\.\d+)?)',
        'en': r'[,;]?\s*(?:only\s+)?valid (?:only\s+)?after an? (M15|H1|H4|D1) close (below|above) (\d+(?:\.\d+)?)',
        'ar': r'[،,]?\s*(?:تصبح\s+)?صالحة فقط بعد إغلاق (M15|H1|H4|D1) (أسفل|دون|تحت|فوق|أعلى) (\d+(?:\.\d+)?)',
        'zh-hant': r'[，,]?\s*僅在\s*(M15|H1|H4|D1) 收在 (\d+(?:\.\d+)?) 之(下|上)後生效'}
_VOID = {'vi': r'(?:huỷ|hủy) nếu (M15|H1|H4|D1) đóng (?:lại )?(trên|dưới) (\d+(?:\.\d+)?)',
         'en': r'void on an? (M15|H1|H4|D1) close (?:back )?(above|below) (\d+(?:\.\d+)?)',
         'ar': r'تُلغى بإغلاق (M15|H1|H4|D1) (?:مجددًا )?(فوق|أعلى|دون|أسفل|تحت) (\d+(?:\.\d+)?)',
         'zh-hant': r'(M15|H1|H4|D1) (?:重新)?收在 (\d+(?:\.\d+)?) 之(上|下)則失效'}
_BELOW = {'dưới', 'below', 'أسفل', 'دون', 'تحت', '下'}


def _tdx(m, lang):
    """(timeframe, 'below'|'above', level) from an _ACT/_VOID match; Chinese puts the level before the direction."""
    if lang == 'zh-hant': return m.group(1), ('below' if m.group(3) == '下' else 'above'), m.group(2)
    return m.group(1), ('below' if m.group(2) in _BELOW else 'above'), m.group(3)


def zone_view(z, lang):
    """(pill text, flip line or '', status text with the break conditions rewritten). Same as zoneView in app.js."""
    st = L(z.get('status'), lang)
    sell = z.get('side') == 'SELL'
    flip_line, flip = '', False
    m = re.search(_ACT[lang], st, re.I)
    if m:
        tf, d, x = _tdx(m, lang)
        flip = (sell and d == 'below') or (not sell and d == 'above')
        key = ('fl_sb' if sell else 'fl_ba') if flip else ('fl_sa' if sell else 'fl_bb')
        flip_line = t(lang, key).format(tf=tf, x=x)
        st = re.sub(r'\s*[:：]\s*(?=[;；؛]|$)', '', st[:m.start()] + st[m.end():]).strip(' ,;،，:：')
    def void(mm):
        tf, d, x = _tdx(mm, lang)
        if flip: return t(lang, 'hold_sup' if sell else 'hold_res').format(tf=tf, x=x)
        if sell and d == 'above': return t(lang, 'br_res').format(tf=tf, x=x)
        if not sell and d == 'below': return t(lang, 'br_sup').format(tf=tf, x=x)
        return mm.group(0)
    st = re.sub(_VOID[lang], void, st, flags=re.I)
    pill = t(lang, ('pill_fs' if sell else 'pill_fb') if flip else ('pill_s' if sell else 'pill_b'))
    # colour follows what the zone is NOW: a support still holding is green, a resistance still holding is red
    cls = ('buy fz' if sell else 'sell fz') if flip else side_cls(z.get('side'))
    return pill, flip_line, st, cls


def trig_wait(z, lang):
    """chip of a break-and-retest zone (20/11/2026): 'Chờ M15 đóng dưới L'. Same as trigWait in app.js."""
    g = z.get('trigger')
    if not isinstance(g, dict): return ''
    b = isinstance(g.get('close_below'), (int, float))
    x = g.get('close_below') if b else g.get('close_above')
    if not isinstance(x, (int, float)): return ''
    return t(lang, 'tg_wait').replace('{tf}', g.get('tf') or 'M15').replace('{d}', t(lang, 'tg_below' if b else 'tg_above')).replace('{x}', fmt(x, lang))


def plan_html(doc, p, lang):
    d0 = dt.date.fromisoformat(p['date'])
    upd = updated_dt(p)
    doc = fill(doc, 'plan-meta', ''.join(f'<span>{esc(x)}</span>' for x in (p['symbol'], t(lang, 'ed').get(p['edition'], p['edition']), hm_local(upd, lang))))
    doc = fill(doc, 'plan-title', esc(t(lang, 'plan_of')) + ' <span class="d">' + esc(day_label(d0, lang)) + '</span>')
    eds = ''.join(f'<div class="ed{" on" if e == p["edition"] else ""}"><span class="k">{esc(t(lang, "ed_short")[e])}</span>'
                  f'<span class="v num">{to_local(dt.datetime.strptime(p["date"] + " " + ED_TIME[e], "%Y-%m-%d %H:%M"), lang):%H:%M}</span></div>' for e in ED_ORDER)
    doc = fill(doc, 'editions', eds)
    if p.get('alert') and L(p['alert'], lang):
        doc = unhide(doc, 'alert')
        doc = fill(doc, 'alert-text', alert_html(p, lang))
    side = (p.get('lean') or '') if p['bias'] in ('TWO_WAY', 'STAND_ASIDE') else p['bias']
    doc = doc.replace('class="hero card" id="bias-card"', f'class="hero card {side_cls(side)}" id="bias-card"', 1)
    doc = fill(doc, 'bias-val', esc(bias_label(p, lang)))
    doc = fill(doc, 'day-type', esc(L(p.get('day_type'), lang)))
    doc = fill(doc, 'headline', headline_html(plan_headline(p, lang), lang))
    sc0 = (p.get('scenarios') or [None])[0]
    doc = fill(doc, 'main-chip', esc(f"{t(lang, 'main')} {sc0['prob']}%") if sc0 else '')
    if sc0: doc = doc.replace('class="mchip" id="main-chip"', f'class="mchip {side_cls(sc0["side"])}" id="main-chip"', 1)
    keys, mz = [], p.get('main_zone')
    if mz: keys.append((t(lang, 'main_zone') + par(t(lang, mz['side']), lang), rng(mz['lo'], mz['hi'], lang)))
    if p.get('targets'): keys.append((t(lang, 'target') + ' ' + p['targets'][0]['label'], rng(p['targets'][0]['lo'], p['targets'][0]['hi'], lang)))
    if p.get('range'): keys.append((t(lang, 'range'), rng(p['range']['lo'], p['range']['hi'], lang)))
    doc = fill(doc, 'hero-keys', ''.join(f'<div class="key"><span class="k">{esc(k)}</span><span class="v num" dir="ltr">{esc(v)}</span></div>' for k, v in keys))
    src = chart_for(p, lang)
    if src:
        doc = unhide(doc, 'chart-box')
        alt = f"XAUUSD H1, {t(lang, 'plan_of')} {day_label(d0, lang)}"
        doc = doc.replace('<a id="chart-link" href="#"', f'<a id="chart-link" href="/{src}"', 1)
        doc = doc.replace('<img id="chart-img" alt=""', f'<img id="chart-img" src="/{src}" alt="{esc(alt)}"', 1)
        msrc = src[:-4] + '-m.png'
        if os.path.isfile(os.path.join(ROOT, msrc)):
            doc = doc.replace('<source id="chart-m"', f'<source id="chart-m" srcset="/{msrc}"', 1)
        else:
            doc = doc.replace('<source id="chart-m" media="(max-width: 640px)" width="1200" height="1500">', '', 1)
        # WebP first (SEO F3); a source is only kept when its file exists, the PNG <img> stays the fallback
        for sid, png, tag in (('chart-mw', msrc, '<source id="chart-mw" type="image/webp" media="(max-width: 640px)" width="1200" height="1500">'),
                              ('chart-w', src, '<source id="chart-w" type="image/webp" width="1800" height="1110">')):
            wp = png[:-4] + '.webp'
            if os.path.isfile(os.path.join(ROOT, wp)) and os.path.isfile(os.path.join(ROOT, png)):
                doc = doc.replace(f'<source id="{sid}"', f'<source id="{sid}" srcset="/{wp}"', 1)
            else:
                doc = doc.replace(tag, '', 1)
    rows = []
    row = lambda k, v, cls='', text=False: (f'<div class="row{" text" if text else ""}"><span class="k">{esc(k)}</span>'
                                            f'<span class="v{"" if text else " num"}{(" " + cls) if cls else ""}"{"" if text else " dir=\"ltr\""}>{esc(v)}</span></div>')
    if mz: rows.append(row(t(lang, 'main_zone') + par(t(lang, mz['side']), lang), rng(mz['lo'], mz['hi'], lang), 'main'))
    for x in p.get('targets') or []: rows.append(row(t(lang, 'target') + ' ' + x['label'], rng(x['lo'], x['hi'], lang)))
    if p.get('range'): rows.append(row(t(lang, 'range'), rng(p['range']['lo'], p['range']['hi'], lang)))
    trow = lambda k, v, cls='': f'<div class="row text ideas-row{(" " + cls) if cls else ""}"><span class="k">{k}</span><div class="v">{v}</div></div>'
    for w in p.get('watch') or []:
        rows.append(trow(esc(t(lang, 'watch')) + ' <b class="px">' + esc(rng(w['lo'], w['hi'], lang)) + '</b>', ideas_html(L(w.get('text'), lang), lang), 'watch'))
    if p.get('invalidation'): rows.append(trow(esc(t(lang, 'invalid')), ideas_html(L(p['invalidation'], lang), lang), 'inv'))
    doc = fill(doc, 'levels', ''.join(rows))
    doc = fill(doc, 'context', ''.join(ctx_card(L(c['k'], lang), L(c['v'], lang), lang) for c in p.get('context') or []))
    sc = []
    for i, s in enumerate(p.get('scenarios') or []):
        w = max(0, min(100, s['prob']))
        sc.append(f'<div class="card scen {side_cls(s["side"])}"><div class="t"><span>{esc((t(lang, "main") if i == 0 else t(lang, "alt")) + par(t(lang, s["side"]), lang))}</span>'
                  f'<span class="pct num">{esc(s["prob"])}%</span></div><div class="bar"><i class="w{int(round(w / 5.0) * 5)}"></i></div>{scen_steps(scen_text(L(s["text"], lang)), lang)}</div>')
    doc = fill(doc, 'scenarios', ''.join(sc))
    zs = []
    for z in p.get('zones') or []:
        is_main = bool(mz) and z['lo'] == mz['lo'] and z['hi'] == mz['hi'] and z['side'] == mz['side']
        chip = t(lang, 'key') if is_main else (trig_wait(z, lang) or (f"{t(lang, 'grade')} {z['grade']}" if z.get('grade') else ''))
        pill, flip_line, st, pcls = zone_view(z, lang)
        fl = f'<p class="flip">{_STEP_PRICE.sub(lambda m: "<b class=" + chr(34) + "px" + chr(34) + ">" + m.group(0) + "</b>", esc(flip_line))}</p>' if flip_line else ''
        zs.append(f'<div class="card zone{" is-main" if is_main else ""}"><div class="zh"><span class="pill {pcls}">{esc(pill)}</span>'
                  f'<span class="zr num" dir="ltr">{esc(rng(z["lo"], z["hi"], lang))}</span><span class="g{" main" if is_main else ""}">{esc(chip)}</span></div>'
                  f'{fl}{ideas_html(st, lang, True, t(lang, "main_zone"))}</div>')
    doc = fill(doc, 'zones', ''.join(zs))
    nw = ''.join(f'<div class="row news-row"><span class="k"><span class="imp {esc(n.get("impact", "low"))}"></span><span>{esc(L(n["text"], lang))}</span></span>'
                 f'<span class="v">{esc(vn_news_time(n.get("time", ""), p["date"][:4], lang))}</span></div>' for n in p.get('news') or [])
    doc = fill(doc, 'news', nw)
    doc = fill(doc, 'next', f'<span><strong>{esc(t(lang, "next"))}:</strong> <span id="next-v">{esc(L(p.get("next_update"), lang))}</span></span>'
                            f'<a href="#cta">{esc(C(lang, "next_alert"))}</a>')
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
RESULTS = ('hit', 'void', 'no_touch', 'expired', 'aside', 'mixed', 'carried')


def grade_of(k):
    g = G.get(k)
    return g if g and g.get('result') in RESULTS else None


def plan_path(lang, k): return f"{PFX[lang]}/plan/{k[:10]}-{SESSION[k[11:]]}/"
def track_path(lang, ym): return f"{PFX[lang]}/track-record/{ym}/"
def signals_path(lang): return f"{PFX[lang]}/signals/"
def ea_path(lang): return f"{PFX[lang]}/ea/"
def learn_index_path(lang): return f"{PFX[lang]}/learn/"
def today_path(lang): return '/today/' if lang == 'en' else f"{PFX[lang]}/today/"
LEGAL = {'terms': 'terms', 'privacy': 'privacy', 'risk': 'risk-disclosure'}
def legal_path(lang, kind): return f"{PFX[lang]}/{LEGAL[kind]}/"
def C(lang, k): return COPY[lang][k]
def learn_path(lang, slug): return f"{PFX[lang]}/learn/{slug}/"
def move_path(lang, m): return f"{PFX[lang]}/why-gold-moved/{m['date']}-{m['tag']}/"


# ---------- learn (Q&A) pages: data/learn/<en|ar>.json, each page goes live on its "publish" date (GMT+7) ----------
TODAY_VN = os.environ.get('NC_TODAY') or dt.datetime.now(TZ_VN).date().isoformat()   # NC_TODAY: preview future pages locally
LEARN_LANGS = ['en', 'ar', 'zh-hant']
def learn_home(lang): return learn_index_path(lang if lang in LEARN_LANGS else 'en')
SLUG_RE = re.compile(r'[a-z0-9]+(?:-[a-z0-9]+){0,8}')


def load_learn():
    out = {}
    for lang in LEARN_LANGS:
        try: items = json.loads(read(f'data/learn/{lang}.json'))
        except FileNotFoundError: items = []
        out[lang] = {x['slug']: tidy_tree(x, lang) for x in items if SLUG_RE.fullmatch(x.get('slug', '')) and str(x.get('publish', '9999')) <= TODAY_VN}
    return out


def tidy_tree(o, lang, key=''):
    """tidy() every reader-facing text in a learn page (not slugs, dates or links)."""
    if isinstance(o, dict): return {k: tidy_tree(v, lang, k) for k, v in o.items()}
    if isinstance(o, list): return [tidy_tree(v, lang, key) for v in o]
    if isinstance(o, str) and key not in ('slug', 'publish', 'related', 'example', 'url', 'href'): return tidy(o, lang)
    return o


LEARN = load_learn()


def learn_pair(lang, slug):
    """same question in the other language (pages share the slug)"""
    return {l: learn_path(l, slug) for l in LEARN_LANGS if slug in LEARN[l]}


# ---------- why gold moved: data/moves/<date>.json (numbers from tools/move.py, text from real news) ----------
MOVE_TAGS = {'cpi', 'ppi', 'nfp', 'jobs', 'fed', 'fomc', 'powell', 'dollar', 'yields', 'gdp', 'pce', 'retail-sales', 'pmi',
             'geopolitics', 'tariffs', 'holiday', 'risk-off', 'risk-on', 'profit-taking', 'technical', 'no-major-news', 'central-banks', 'data-mix'}


def load_moves():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'moves', '*.json'))):
        try: m = json.load(open(f, encoding='utf-8'))
        except Exception: continue
        ok = (m.get('tag') in MOVE_TAGS and isinstance(m.get('headline'), dict) and all(m['headline'].get(l) for l in ('en', 'ar', 'vi'))
              and m.get('reasons') and all(isinstance(r, dict) and all(r.get(l) for l in ('en', 'ar', 'vi')) for r in m['reasons'])
              and re.fullmatch(r'\d{4}-\d{2}-\d{2}', m.get('date', '')) and os.path.basename(f) == m['date'] + '.json')
        if ok: out.append(m)
    return out


MOVES = load_moves()


CUR_MONTH = P['date'][:7]
MONTHS = sorted({k[:7] for k in KEYS} | {CUR_MONTH})


def month_label(ym, lang):
    y, m = int(ym[:4]), int(ym[5:])
    if lang == 'zh-hant': return f"{y}年{m}月"
    return f"{MON_FULL[m-1]} {y}" if lang == 'en' else f"{MON_AR[m-1]} {y}" if lang == 'ar' else f"Tháng {m}/{y}"


def vn_label(s, lang, with_day=True):
    d = to_local(dt.datetime.strptime(s, '%Y-%m-%d %H:%M'), lang)
    return (day_label(d.date(), lang) + ' ' if with_day else '') + f"{d:%H:%M} {tz_label(d, lang)}"


def r_text(r, lang, nd=2):
    if r is None: return ''
    v = round(r, nd)
    s = ('+' if v > 0 else '') + ('%g' % v)
    return s + 'R'


def res_cls(res): return 'good' if res == 'hit' else 'bad' if res == 'void' else 'neutral'


def counted_zones(g):
    """zones that count in R (rules v2); older grades without a zone list count as one zone"""
    if not g: return []
    if 'zones' in g: return [z for z in g['zones'] if z.get('result') in ('hit', 'void', 'expired')]
    return [g] if g.get('result') in ('hit', 'void', 'expired') else []


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


GF_ALL = ('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800'
          '&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap')
GF_URL = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800{fam}&display=swap'
GF_FAM = {'en': '', 'vi': '', 'ar': '&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700',
          'zh-hant': '&family=Noto+Sans+TC:wght@400;500;700'}


def shell(lang, kind, paths):
    """Template with texts, tabs and language links filled in. paths = this page's address in each language."""
    doc = read('template.html')
    doc = (doc.replace('{{LANG}}', HL[lang]).replace('{{DIR}}', 'rtl' if lang == 'ar' else 'ltr').replace('{{HOME}}', PATH[lang])
           .replace('{{TRACK}}', track_path(lang, CUR_MONTH)).replace('{{SIGNALS}}', signals_path(lang)).replace('{{EA}}', ea_path(lang)).replace('{{LANGCODE}}', {'en': 'EN', 'ar': 'عربي', 'vi': 'VI', 'zh-hant': '繁中'}[lang]).replace('{{KIND}}', kind)
           .replace('{{LEARN}}', learn_home(lang)).replace('{{TODAY}}', today_path(lang)).replace('{{FOOTER}}', footer_html(lang)))
    doc = re.sub(r'\{\{C:(\w+)\}\}', lambda m: esc(COPY[lang][m.group(1)]), doc)
    # each language loads only the font families it shows (Core Web Vitals, 21/11/2026): Latin pages no longer download
    # the Arabic and Chinese fonts just for the language menu
    doc = doc.replace(GF_ALL, GF_URL.format(fam=GF_FAM[lang]))
    for k, v in T[lang].items():
        if isinstance(v, str):
            doc = re.sub(r'(data-i18n="%s"[^>]*>)(</)' % re.escape(k), lambda m: m.group(1) + esc(v) + m.group(2), doc)
    for l in LANGS:
        doc = re.sub(r'href="[^"]*"( data-lang="%s")' % l, lambda m: f'href="{paths[l]}"' + m.group(1), doc, count=1)
    doc = re.sub(r'(<a role="button" href="[^"]*" data-lang="%s")' % lang, r'\1 aria-pressed="true" aria-current="page"', doc)
    tab = {'home': None, 'today': 'plan', 'plan': 'plan', 'track': 'track', 'signals': 'signals', 'ea': 'ea', 'learn': 'learn', 'move': 'learn', 'legal': None}[kind]
    if tab: doc = doc.replace(f' data-tab="{tab}"', f' aria-current="page" data-tab="{tab}"', 1)
    if kind not in ('home', 'today'):
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


# SEO length rules (đề xuất F, người dùng duyệt 21/11/2026): <title> about 50–60 and meta description about 150–160,
# measured in display width (a CJK character counts 2, so Chinese pages get about half as many characters).
# Social cards (og:/twitter:) keep the full text.
TAIL = {'en': ['Free daily gold plans, graded after the move: wins and losses.', 'Free, graded in public after the move.', 'Graded after the move.'],
        'vi': ['Plan vàng miễn phí mỗi ngày, chấm điểm công khai sau khi giá chạy.', 'Miễn phí, chấm điểm công khai.', 'Chấm điểm sau.'],
        'ar': ['خطط ذهب مجانية يوميًا، تُقيَّم علنًا بعد الحركة: الربح والخسارة.', 'مجانية وتُقيَّم علنًا بعد الحركة.', 'تقييم بعد الحركة.'],
        'zh-hant': ['每日免費黃金計畫，行情走完後公開評分。', '免費，事後公開評分。', '事後評分。']}


def _w(s):
    import unicodedata
    return sum(2 if unicodedata.east_asian_width(ch) in 'WF' else 1 for ch in s)


def _cut(s, limit, ell='…'):
    """shorten to display width <= limit at a word (or CJK character) boundary"""
    if _w(s) <= limit: return s
    out, w = '', 0
    for ch in s:
        if w + _w(ch) > limit - _w(ell): break
        out += ch; w += _w(ch)
    if ' ' in out and not any(_w(ch) == 2 for ch in out[-3:]): out = out[:out.rfind(' ')]
    return out.rstrip(' ,;:–-|·') + ell


def seo_title(title, lang):
    t = title
    for drop in (' | XAUUSD', ' | NEXUS CORE'):
        if _w(t) > 60 and drop in t: t = t.replace(drop, '')
    if _w(t) > 60: t = _cut(t, 60)
    if _w(t) < 50 and 'NEXUS CORE' not in t and _w(t + ' | NEXUS CORE') <= 60: t += ' | NEXUS CORE'
    return t


def seo_desc(desc, lang):
    d = re.sub(r'\s+', ' ', desc or '').strip()
    if _w(d) > 160:
        cut = ''
        for m in re.finditer(r'[.!?。！？](?=\s|$)', d):     # whole sentences first
            if _w(d[:m.end()]) <= 160: cut = d[:m.end()]
        d = cut if _w(cut) >= 120 else _cut(d, 160)
    if _w(d) < 150:
        zh = lang == 'zh-hant'
        if d and d[-1] not in '.!?。！？…': d += '。' if zh else '.'
        for tail in TAIL.get(lang, TAIL['en']):
            nd = d + tail if zh else d + ' ' + tail
            if _w(nd) <= 160: d = nd; break
    return d


def head_tags(lang, title, desc, paths, img, pub=None, mod=None, og='article', langs=None):
    url = SITE + paths[lang]
    langs = langs or LANGS
    alts = ''
    if len(langs) > 1:
        alts = ''.join(f'\n<link rel="alternate" hreflang="{HL[l]}" href="{SITE}{paths[l]}">' for l in langs)
        alts += f'\n<link rel="alternate" hreflang="x-default" href="{SITE}{paths["en" if "en" in langs else langs[0]]}">'
    og_alt = ''.join(f'\n<meta property="og:locale:alternate" content="{LOCALE[l]}">' for l in langs if l != lang)
    times = (f'\n<meta property="article:published_time" content="{pub.isoformat()}">'
             f'\n<meta property="article:modified_time" content="{(mod or pub).isoformat()}">') if pub and og == 'article' else ''
    size = '\n<meta property="og:image:width" content="1800">\n<meta property="og:image:height" content="1110">' if '/data/charts/' in img else ''
    return (f'<title>{esc(seo_title(title, lang))}</title>\n'
            f'<meta name="description" content="{esc(seo_desc(desc, lang))}">\n'
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
           'inLanguage': [HL[l] for l in LANGS], 'description': SITE_DESC['en']}


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
    return f"{t(lang, 'plan_of')} {day_label(d0, lang)}, {t(lang, 'ed').get(p['edition'], '')}: {bias_label(p, lang)} | XAUUSD | NEXUS CORE"


def webp_source(png, w, h):
    """<source> for the WebP copy of a chart PNG, or '' when there is none (SEO F3)"""
    wp = png[:-4] + '.webp'
    return f'<source type="image/webp" srcset="/{wp}" width="{w}" height="{h}">' if os.path.isfile(os.path.join(ROOT, wp)) else ''


def plan_seo_title(p, lang):
    """<title> of a dated plan page: shorter than plan_title (session name instead of the long edition name)."""
    d0 = dt.date.fromisoformat(p['date'])
    return f"{t(lang, 'plan_of')} {day_label(d0, lang)}, {t(lang, 'ed_short').get(p['edition'], '')}: {bias_label(p, lang)} | XAUUSD"


def plan_desc(p, lang, g=None):
    mz = p.get('main_zone')
    desc = plan_headline(p, lang)
    if desc and desc[-1] not in '.!?。':
        desc += '。' if lang == 'zh-hant' else '.'
    if mz: desc += f" {t(lang, 'main_zone')}: {rng(mz['lo'], mz['hi'], lang)}."
    if g: desc += f" {t(lang, 'pp_result')}: {res_label(g, lang)}{(' ' + r_text(g.get('r'), lang)) if g.get('r') is not None else ''}."
    else: desc += ' ' + t(lang, 'ed').get(p['edition'], '') + ('。' if lang == 'zh-hant' else '.')
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
        if g.get('followed_to'): row(t(lang, 'pp_follow'), vn_label(g['followed_to'], lang), False)
        if g.get('high') is not None: row(t(lang, 'pp_hl'), f"{fmt(g['high'], lang)} / {fmt(g['low'], lang)}")
        if rows: out.append('<div class="list">' + ''.join(rows) + '</div>')
        zs = g.get('zones')
        if zs is None and g.get('zone'): zs = [dict(g, main=True)]
        if zs:
            out.append(f'<h3>{esc(t(lang, "pp_zones"))}</h3>')
            for z in zs:
                head = (f"{esc(t(lang, z['side']))} <span class=\"num\" dir=\"ltr\">{esc(rng(z['zone'][0], z['zone'][1], lang))}</span>"
                        + esc(f" ({t(lang, 'z_main')})" if z.get('main') else (f" ({z['grade']})" if z.get('grade') else '')))
                if z.get('result') == 'carried':
                    nk = z.get('carried_to', '')
                    lk = f' <a href="{plan_path(lang, nk)}">{esc(t(lang, "z_see_next"))}</a>' if nk in KEYS else ''
                    det0 = f"{t(lang, 'pp_touched')}: {vn_label(z['touched'], lang)}" if z.get('touched') else ''
                    out.append(f'<div class="zres"><div class="zt"><strong>{head}</strong><span class="pill neutral">{esc(t(lang, "res_carried"))}</span></div>'
                               f'<p class="muted small">{esc(det0)}{"; " if det0 else ""}{esc(t(lang, "z_carried_to"))}{lk}</p></div>'); continue
                if z.get('result') == 'counted_earlier':
                    out.append(f'<div class="zres"><div class="zt"><strong>{head}</strong><span class="pill neutral">{esc(t(lang, "z_earlier"))}</span></div></div>'); continue
                zr = z.get('r')
                rr = f'<span class="num r {"r-up" if (zr or 0) > 0 else "r-down" if (zr or 0) < 0 else "r-flat"}" dir="ltr">{esc(r_text(zr, lang))}</span>' if zr is not None else ''
                det = []
                if z.get('trigger'):     # break-and-retest zone: when it became active, or that it never did
                    det.append(f"{trig_wait(z, lang)}: {t(lang, 'pp_trig')} {vn_label(z['triggered'], lang)}" if z.get('triggered') else trig_wait(z, lang))
                if z.get('touched'): det.append(f"{t(lang, 'pp_touched')}: {vn_label(z['touched'], lang)}")
                if z.get('carried_from'): det.append(t(lang, 'z_carried_from'))
                if z.get('at'): det.append(f"{t(lang, 'pp_event')}: {vn_label(z['at'], lang)}")
                if z.get('t1') is not None: det.append(f"{t(lang, 'pp_t1')}: {fmt(z['t1'], lang)}")
                if z.get('void') is not None: det.append(f"{t(lang, 'pp_void')}: {fmt(z['void'], lang)}")
                mfe = ''
                if z.get('best') is not None:
                    br = f" ({std_r(z['best'], lang)})"
                    mfe = f'<div class="best"><span class="k">{esc(t(lang, "pp_best"))}</span><span class="v num" dir="ltr">+{esc(fmt(z["best"], lang))} $, {esc(pips(z["best"], lang))}{esc(br)}</span></div>'
                nr = z.get('near')
                if nr:
                    mfe += (f'<div class="best"><span class="k">{esc(t(lang, "z_near"))}</span><span class="v num" dir="ltr">'
                            f'{"↘" if z["side"] == "SELL" else "↗"} {esc(fmt(nr["move"], lang))} $, {esc(pips(nr["move"], lang))}</span></div>'
                            f'<p class="muted small">{esc(near_text(nr, lang))}</p>')
                out.append(f'<div class="zres"><div class="zt"><strong>{head}</strong><span class="pill {res_cls(z["result"])}">{esc(t(lang, "res_" + z["result"]))}</span>{rr}</div>'
                           f'<p class="muted small">{esc("; ".join(det))}</p>{mfe}</div>')
            if any(z.get('best') is not None for z in zs): out.append(f'<p class="muted small">{esc(t(lang, "pp_best_note"))}</p>')
            if any(z.get('near') for z in zs): out.append(f'<p class="muted small">{esc(t(lang, "near_note"))}</p>')
    out.append(f'<p class="small"><a href="{track_path(lang, k[:7])}#method">{esc(t(lang, "tr_method"))}</a></p>')
    return ''.join(out)


def near_text(nr, lang):
    return (t(lang, 'near_det').replace('{gap}', fmt(nr['gap'], lang)).replace('{at}', vn_label(nr['at'], lang))
            .replace('{move}', fmt(nr['move'], lang)))


def near_count(keys):
    return sum(1 for k in keys for z in ((grade_of(k) or {}).get('zones') or []) if z.get('near'))


def plan_nav(k, lang):
    i = KEYS.index(k)
    links = []
    if i > 0: links.append(f'<a class="btn alt" href="{plan_path(lang, KEYS[i-1])}" rel="prev">{esc(t(lang, "prev_plan"))}</a>')
    if i + 1 < len(KEYS): links.append(f'<a class="btn alt" href="{plan_path(lang, KEYS[i+1])}" rel="next">{esc(t(lang, "next_plan"))}</a>')
    links.append(f'<a class="btn alt" href="{track_path(lang, k[:7])}">{esc(t(lang, "all_month"))}</a>')
    links.append(f'<a class="btn alt" href="{today_path(lang)}">{esc(t(lang, "today_plan"))}</a>')
    return ''.join(links)


# ---------- pages ----------

ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
TICK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
CROSS = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/></svg>'
SHIELD = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z"/><path d="m9 12 2 2 4-4"/></svg>'
FEAT_ICONS = ['<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>', '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 4v16"/>',
              '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>']


def all_trades(keys=None):
    """Every zone price reached = one trade, same list and pip maths as the Track Record page. Returns (key, zone, pips)."""
    out = []
    for k in (KEYS if keys is None else keys):
        for z in counted_zones(grade_of(k)):
            if z.get('void') is None or z.get('edge') is None or z.get('r') is None: continue
            out.append((k, z, round(z['r'] * abs(z['void'] - z['edge']) * 10)))
    return out


def signed_pips(pp, lang): return ('+' if pp > 0 else '') + pips(pp / 10, lang).split(' ')[0]


SEP = {'en': ', ', 'vi': ', ', 'ar': '، ', 'zh-hant': '，'}


def ed_time_label(p, lang):
    return f"{t(lang, 'ed').get(p['edition'], p['edition'])}{SEP[lang]}{C(lang, 'published')} {hm_local(updated_dt(p), lang)}"


TODAY_SEO = {
    'en': ('XAUUSD Analysis Today: Free Gold Plan and Key Levels', "Today's free gold plan, updated before Asia, London and New York:"),
    'vi': ('Phân tích XAUUSD hôm nay: plan vàng miễn phí, vùng giá chính', 'Plan vàng hôm nay, cập nhật trước phiên Á, Âu và Mỹ:'),
    'ar': ('تحليل الذهب XAUUSD اليوم: خطة مجانية والمستويات الرئيسية', 'خطة الذهب اليوم، تُحدَّث قبل جلسات آسيا ولندن ونيويورك:'),
    'zh-hant': ('今日黃金 XAUUSD 分析：免費計畫與關鍵價位', '今日黃金計畫，於亞洲盤、倫敦盤與紐約盤前更新：'),
}


def today_page(lang):
    """The latest plan with tabs (was the home page until 17/11/2026). Canonical address: /today/."""
    k = key_of(P)
    paths = {l: today_path(l) for l in LANGS}
    doc = shell(lang, 'today', paths)
    doc = doc.replace('<body data-page="today">', f'<body data-page="today" data-plan="{k}">', 1)
    doc = plan_html(doc, P, lang)
    doc = unhide(doc, 'plan-link')
    doc = doc.replace('<a class="permalink" id="plan-link" href="#"', f'<a class="permalink" id="plan-link" href="{plan_path(lang, k)}"', 1)
    doc = fill(doc, 'plan-link', esc(t(lang, 'permalink')) + ' →' if lang != 'ar' else esc(t(lang, 'permalink')))
    if grade_of(k):
        doc = unhide(doc, 'result'); doc = fill(doc, 'result', result_block(k, lang))
    nums = record_numbers()
    if nums['TR_TRADES'] != '0':
        doc = unhide(doc, 'proof')
        doc = doc.replace('<a class="proof" id="proof" href="#"', f'<a class="proof" id="proof" href="{track_path(lang, CUR_MONTH)}"', 1)
        doc = fill(doc, 'proof', '<span class="pf">'
                   f'<span><b class="num wr" dir="ltr">{esc(nums["TR_WINRATE"])}</b> {esc(C(lang, "proof_wr"))}</span>'
                   f'<span><b class="num {"up" if nums["TR_NETPIPS"].startswith("+") else "down"}" dir="ltr">{esc(nums["TR_NETPIPS"])}</b> {esc(C(lang, "proof_net"))}</span>'
                   f'<span><b class="num" dir="ltr">{esc(nums["TR_TRADES"])}</b> {esc(C(lang, "proof_tr"))}</span></span>'
                   f'<span class="go">{esc(C(lang, "proof_go"))}</span>')
    title, desc, img, upd = plan_title(P, lang), plan_desc(P, lang), img_for(P, lang), updated_dt(P)
    # /today is the evergreen page for "XAUUSD analysis today"; the dated plan page keeps the dated title (F4, 21/11/2026)
    title, desc = TODAY_SEO[lang][0], TODAY_SEO[lang][1] + ' ' + plan_headline(P, lang)
    url = SITE + paths[lang]
    mz = P.get('main_zone')
    art = {'@type': 'Article', '@id': url + '#plan', 'headline': title[:110], 'description': desc, 'image': [img],
           'datePublished': upd.isoformat(), 'dateModified': upd.isoformat(), 'inLanguage': HL[lang],
           'author': {'@id': SITE + '/#org'}, 'publisher': {'@id': SITE + '/#org'}, 'mainEntityOfPage': url,
           'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD)'}, 'isAccessibleForFree': True}
    qa = [(FAQ[lang][0], bias_label(P, lang) + '. ' + plan_headline(P, lang))]
    if mz: qa.append((FAQ[lang][1], f"{t(lang, mz['side'])} {rng(mz['lo'], mz['hi'], lang)} ({t(lang, 'ed').get(P['edition'], '')})"))
    if P.get('invalidation'): qa.append((FAQ[lang][2], L(P['invalidation'], lang)))
    faq = {'@type': 'FAQPage', '@id': url + '#faq', 'inLanguage': HL[lang], 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a + ' ' + t(lang, 'disclaimer').split('.')[0] + '.'}} for q, a in qa]}
    bc = crumbs(lang, [('NEXUS CORE', PATH[lang]), (t(lang, 'today_plan'), paths[lang])])
    return finish(doc, head_tags(lang, title, desc, paths, img, upd), ld(art, faq, bc))


def home_page(lang):
    """Intro page: what NEXUS CORE is, today's plan in short, the record, why a plan helps. Numbers are live."""
    c = COPY[lang]
    p, k = P, key_of(P)
    d0 = dt.date.fromisoformat(p['date'])
    doc = shell(lang, 'home', PATH)
    doc = doc.replace('<body data-page="home">', f'<body data-page="home" data-plan="{k}">', 1)
    nums = record_numbers()
    tp, tr = today_path(lang), track_path(lang, CUR_MONTH)
    side = side_of(p)
    first = min((x for x in KEYS if grade_of(x)), default=None)
    since = day_label(dt.date.fromisoformat(first[:10]), lang).split(', ')[-1].split('，')[-1].split('، ')[-1] if first else ''
    if lang == 'zh-hant' and first: since = f"{int(first[5:7])}月{int(first[8:10])}日"
    netcls = 'up' if nums['TR_NETPIPS'].startswith('+') else 'down' if nums['TR_NETPIPS'].startswith('-') else ''
    tiles = ''
    if nums['TR_TRADES'] != '0':
        tiles = (f'<div class="h-tiles"><div class="h-tile"><div class="v num wr" dir="ltr">{esc(nums["TR_WINRATE"])}</div><div class="k">{esc(c["tile_wr"].format(since=since))}</div></div>'
                 f'<div class="h-tile"><div class="v num {netcls}" dir="ltr">{esc(nums["TR_NETPIPS"])} {pip_word(2, lang)}</div><div class="k">{esc(c["tile_net"])}</div></div>'
                 f'<div class="h-tile"><div class="v num" dir="ltr">{esc(nums["TR_TRADES"])}</div><div class="k">{esc(c["tile_tr"])}</div></div></div>'
                 f'<p class="h-note">{esc(c["tiles_note"])}</p>')
    hero = (f'  <section class="h-hero bleed"><div class="h-in">\n'
            f'    <div class="h-chips"><span class="c0">{esc(c["chip"])}</span><span class="c1" id="hp-ed">{esc(t(lang, "ed").get(p["edition"], ""))}{SEP[lang]}<span class="num" dir="ltr">{esc(hm_local(updated_dt(p), lang))}</span></span></div>\n'
            f'    <h1 class="h-h1">{esc(c["h1"][0])}<br><span class="gold-tx">{esc(c["h1"][1])}</span></h1>\n'
            f'    <p class="h-lede">{esc(c["lede"])}</p>\n'
            f'    <div class="h-btns"><a class="b-navy" href="{tp}">{esc(c["btn_plan"])}{ARROW}</a><a class="b-ghost" href="{tr}">{esc(c["btn_record"])}</a></div>\n'
            f'    {tiles}\n'
            f'    <div class="h-checks">{"".join(f"<span>{TICK}{esc(x)}</span>" for x in c["checks"])}</div>\n'
            f'  </div></section>\n')
    mz = p.get('main_zone')
    src = chart_for(p, lang)
    pv = (f'  <section class="h-sec" id="today-preview">\n'
          f'    <div class="h-row"><div><p class="eyebrow">{esc(c["plan_eyebrow"])}</p><h2 class="h-h2" id="hp-day">{esc(day_label(d0, lang))}</h2></div>'
          f'<span class="muted" id="hp-pub" data-tpl="{{ed}}{SEP[lang]}{esc(c["published"])} {{time}}">{esc(ed_time_label(p, lang))}</span></div>\n'
          f'    <div class="sum">\n'
          f'      <div class="hero card {side_cls(side)}" id="hp-card"><p class="eyebrow">{esc(c["bias_k"])}</p><p class="bias-val" id="hp-bias">{esc(bias_label(p, lang))}</p>'
          f'<div class="headline" id="hp-headline">{headline_html(plan_headline(p, lang), lang)}</div>'
          f'<p class="bias-sub" id="hp-type">{esc(L(p.get("day_type"), lang))}</p>'
          f'<div class="hero-keys" id="hp-keys">{home_keys(p, lang)}</div>'
          f'<a class="b-navy" href="{tp}">{esc(c["open_plan"])}{ARROW}</a></div>\n'
          + (f'      <a class="chart-card" href="{tp}"><picture>'
             + (f'<source type="image/webp" media="(max-width: 640px)" srcset="/{src[:-4]}-m.webp" width="1200" height="1500">' if os.path.isfile(os.path.join(ROOT, src[:-4] + '-m.webp')) and os.path.isfile(os.path.join(ROOT, src[:-4] + '-m.png')) else '')
             + (f'<source media="(max-width: 640px)" srcset="/{src[:-4]}-m.png" width="1200" height="1500">' if os.path.isfile(os.path.join(ROOT, src[:-4] + '-m.png')) else '')
             + (f'<source type="image/webp" srcset="/{src[:-4]}.webp" width="1800" height="1110">' if os.path.isfile(os.path.join(ROOT, src[:-4] + '.webp')) else '')
             + f'<img src="/{src}" alt="{esc(c["chart_alt"])}" width="1800" height="1110" loading="lazy"></picture></a>\n' if src else '')
          + '    </div>\n  </section>\n')
    rows = []
    for kk, z, pp in list(reversed(all_trades()))[:4]:
        when = f"{day_label(dt.date.fromisoformat(kk[:10]), lang)}, {t(lang, 'ed_short')[kk[11:]]}"
        what = f"{t(lang, 'tr_entry')} <span class=\"num\" dir=\"ltr\">{esc(fmt(z['edge'], lang))}</span>, {esc(t(lang, 'res_' + z['result']))}"
        chip = (f'<span class="chip bad">{esc(t(lang, "tr_sl"))}</span>' if z['result'] == 'void' else
                f'<span class="chip {"good" if pp > 0 else "bad" if pp < 0 else "flat"} num" dir="ltr">{esc(signed_pips(pp, lang))} {pip_word(pp, lang)}</span>')
        rows.append(f'<a class="h-trade" href="{plan_path(lang, kk)}#result"><span class="l"><span class="w"><span class="pill {side_cls(z["side"])}">{esc(t(lang, z["side"]))}</span> {esc(when)}</span>'
                    f'<span class="s">{what}</span></span>{chip}</a>')
    feats = ''.join(f'<div class="h-feat"><span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{FEAT_ICONS[i]}</svg></span>'
                    f'<div><b>{esc(a)}</b><p>{esc(b)}</p></div></div>' for i, (a, b) in enumerate(c['feats']))
    rec = (f'  <section class="h-band bleed" id="record"><div class="h-split">\n'
           + (f'    <div class="h-list"><div class="hl-top"><b>{esc(c["rec_head"])}</b><span class="ok">{SHIELD}{esc(c["auto"])}</span></div>{"".join(rows)}</div>\n' if rows else '')
           + f'    <div class="h-why"><h2 class="h-h2">{esc(c["rec_h2"][0])} <span class="gold-tx">{esc(c["rec_h2"][1])}</span></h2>{feats}'
           f'<a class="b-navy" href="{tr}">{esc(c["open_record"])}{ARROW}</a></div>\n  </div></section>\n')
    pains = (f'  <section class="h-sec"><h2 class="h-h2">{esc(c["pain_h2"])}</h2>\n'
             f'    <div class="h-pains">{"".join(f"<div>{CROSS}<span>{esc(x)}</span></div>" for x in c["pains"])}</div>\n'
             f'    <p class="h-punch">{esc(c["pain_end"][0])} <span class="gold-tx">{esc(c["pain_end"][1])}</span></p>\n  </section>\n')
    cmp_ = (f'  <section class="h-sec"><h2 class="h-h2">{esc(c["cmp_h2"])}</h2><p class="h-sub">{esc(c["cmp_sub"])}</p>\n'
            f'    <div class="h-cmp"><div class="a"><p>{esc(c["cmp_a_t"])}</p>{"".join(f"<div>{esc(x)}</div>" for x in c["cmp_a"])}</div>'
            f'<div class="b"><p>{esc(c["cmp_b_t"])}</p>{"".join(f"<div>{TICK}<span>{esc(x)}</span></div>" for x in c["cmp_b"])}</div></div>\n  </section>\n')
    nb = (f'  <section class="h-sec"><h2 class="h-h2">{esc(c["num_h2"])}</h2>\n'
          f'    <div class="h-nums">{"".join(f"<div><b>{esc(v.format(plans=nums["TR_PLANS"]))}</b><span>{esc(kk)}</span></div>" for v, kk in c["nums"])}</div>\n  </section>\n')
    doc = set_view(doc, '  <div id="view-home">\n' + hero + pv + rec + pains + cmp_ + nb + '  </div>')
    title, desc = c['home_title'], c['home_desc']
    url = SITE + PATH[lang]
    page = {'@type': 'WebPage', '@id': url, 'url': url, 'name': title, 'description': desc, 'inLanguage': HL[lang],
            'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD)'},
            'primaryImageOfPage': {'@type': 'ImageObject', 'url': img_for(p, lang)}}
    return finish(doc, head_tags(lang, title, desc, PATH, img_for(p, lang), og='website'), ld(page))


def home_keys(p, lang):
    """Key numbers in the home preview: main zone, Target 1, the first watch level (else the expected range)."""
    ks, mz = [], p.get('main_zone')
    if mz: ks.append((t(lang, 'main_zone') + par(t(lang, mz['side']), lang), rng(mz['lo'], mz['hi'], lang)))
    if p.get('targets'): ks.append((t(lang, 'target') + ' ' + p['targets'][0]['label'], rng(p['targets'][0]['lo'], p['targets'][0]['hi'], lang)))
    if p.get('watch'): ks.append((t(lang, 'watch'), rng(p['watch'][0]['lo'], p['watch'][0]['hi'], lang)))
    elif p.get('range'): ks.append((t(lang, 'range'), rng(p['range']['lo'], p['range']['hi'], lang)))
    return ''.join(f'<div class="key"><span class="k">{esc(k)}</span><span class="v num" dir="ltr">{esc(v)}</span></div>' for k, v in ks)


def footer_html(lang):
    c = COPY[lang]
    ql = lang if lang in LEARN_LANGS else 'en'
    cols = []
    for head, slugs in c['f_groups']:
        links = ''.join(f'<a href="{learn_path(ql, s)}">{esc(LEARN[ql][s]["q"])}</a>' for s in slugs if s in LEARN[ql])
        if links: cols.append(f'<div class="fcol"><p class="fh">{esc(head)}</p>{links}</div>')
    fl = c['f_links']
    tg = 'https://t.me/nexuscoreArabic' if lang == 'ar' else 'https://t.me/nexuscorefx'
    xl = 'https://x.com/froggtrading' if lang == 'ar' else 'https://x.com/XAU_CRYPTO'
    cols.append(f'<div class="fcol"><p class="fh">{esc(c["f_nexus"])}</p>'
                f'<a href="{today_path(lang)}">{esc(fl["plan"])}</a><a href="{track_path(lang, CUR_MONTH)}">{esc(fl["record"])}</a>'
                f'<a href="{track_path(lang, CUR_MONTH)}#method">{esc(fl["grading"])}</a><a href="{signals_path(lang)}">{esc(fl["signals"])}</a><a href="{ea_path(lang)}">{esc(EA[lang]["tab"])}</a>'
                f'<a id="s-tg" class="js-tg" href="{tg}" target="_blank" rel="noopener noreferrer">{esc(fl["tg"])}</a>'
                f'<a id="s-x" href="{xl}" target="_blank" rel="noopener noreferrer">{esc(fl["x"])}</a>'
                f'<a id="s-yt" href="https://www.youtube.com/@nexuscorefx" target="_blank" rel="noopener noreferrer">{esc(fl["yt"])}</a></div>')
    names = c['legal_names']
    lk = lambda kind: f'<a href="{legal_path(lang, kind)}">{esc(names[kind])}</a>'
    note = esc(c['f_note']).replace('{terms}', lk('terms')).replace('{risk}', lk('risk'))
    terms = ''.join(f'<li>{("<b>" + esc(a) + "</b> ") if a else ""}{esc(b)}</li>' for a, b in c['f_terms'])
    return (f'<footer class="foot">\n  <div class="wrap foot-in">\n'
            f'    <div class="fl">{"".join(cols)}</div>\n'
            f'    <a class="f-all" href="{learn_home(lang)}">{esc(c["f_all"])}{ARROW}</a>\n'
            f'    <div class="legal">\n      <p class="fh">{esc(c["f_legal_h"])}</p>\n      <p>{esc(c["f_intro"])}</p>\n      <ul>{terms}</ul>\n'
            f'      <p class="fh">{esc(c["f_risk_h"])}</p>\n      <p>{esc(c["f_risk"])}</p>\n      <p>{note}</p>\n    </div>\n'
            f'    <div class="foot-row"><span>{esc(c["f_copy"])}</span><nav class="fnav" aria-label="Legal">{lk("terms")}{lk("privacy")}{lk("risk")}'
            f'<a href="{track_path(lang, CUR_MONTH)}#method">{esc(fl["grading"])}</a></nav></div>\n'
            f'  </div>\n</footer>')


def legal_page(lang, kind):
    c = COPY[lang]
    x = c['legal'][kind]
    paths = {l: legal_path(l, kind) for l in LANGS}
    doc = shell(lang, 'legal', paths)
    name = c['legal_names'][kind]
    body = []
    for h, items in x['sections']:
        body.append(f'<h2 class="ah">{esc(h)}</h2>')
        for it in items:
            body.append('<ul>' + ''.join(f'<li>{esc(li)}</li>' for li in it) + '</ul>' if isinstance(it, list) else f'<p>{esc(it)}</p>')
    others = ''.join(f'<a class="btn alt" href="{legal_path(lang, o)}">{esc(c["legal_names"][o])}</a>' for o in LEGAL if o != kind)
    view = (f'  <section id="view-legal">\n    <div class="plan-head"><div><p class="eyebrow mx"><span>{esc(c["legal_eyebrow"])}</span>'
            f'<span>{esc(c["legal_updated"])} {esc(UPDATED[lang])}</span></p><h1>{esc(name)}</h1><p class="lede">{esc(x["lede"])}</p></div></div>\n'
            f'    <article class="card prose legal-doc">{"".join(body)}</article>\n'
            f'    <nav class="pnav">{others}</nav>\n  </section>')
    doc = set_view(doc, view)
    doc = doc.replace('<section class="cta-box" id="cta"', '<section class="cta-box" id="cta" hidden', 1)
    title = f"{name} | NEXUS CORE"
    url = SITE + paths[lang]
    page = {'@type': 'WebPage', '@id': url, 'name': name, 'description': x['desc'], 'inLanguage': HL[lang], 'isPartOf': {'@id': SITE + '/#website'}}
    return finish(doc, head_tags(lang, title, x['desc'], paths, SITE + '/assets/logo-banner.png', og='website'),
                  ld(page, crumbs(lang, [('NEXUS CORE', PATH[lang]), (name, paths[lang])])))


def plan_page(k, lang):
    p, g = PLANS[k], grade_of(k)
    paths = {l: plan_path(l, k) for l in LANGS}
    doc = shell(lang, 'plan', paths)
    doc = plan_html(doc, p, lang)
    doc = hide(doc, 'next')
    doc = unhide(doc, 'result'); doc = fill(doc, 'result', result_block(k, lang))
    doc = unhide(doc, 'pnav'); doc = fill(doc, 'pnav', plan_nav(k, lang))
    title, desc, img, upd = plan_seo_title(p, lang), plan_desc(p, lang, g), img_for(p, lang), updated_dt(p)
    mod = dt.datetime.strptime(g['graded_utc'], '%Y-%m-%dT%H:%MZ').replace(tzinfo=dt.timezone.utc) if g and g.get('graded_utc') else upd
    url = SITE + paths[lang]
    art = {'@type': 'Article', '@id': url + '#plan', 'headline': title[:110], 'description': desc, 'image': [img],
           'datePublished': upd.isoformat(), 'dateModified': mod.isoformat(), 'inLanguage': HL[lang],
           'author': {'@id': SITE + '/#org'}, 'publisher': {'@id': SITE + '/#org'}, 'mainEntityOfPage': url,
           'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD)'}, 'isAccessibleForFree': True}
    bc = crumbs(lang, [('NEXUS CORE', PATH[lang]), (t(lang, 'tab_history') + ' ' + month_label(k[:7], lang), track_path(lang, k[:7])),
                       (f"{day_label(dt.date.fromisoformat(p['date']), lang)}, {t(lang, 'ed_short')[p['edition']]}", paths[lang])])
    return finish(doc, head_tags(lang, title, desc, paths, img, upd, mod), ld(art, bc))


def month_stats(keys):
    gs = [grade_of(k) for k in keys]
    graded = [g for g in gs if g]
    zs = [z for g in graded for z in counted_zones(g)]
    hit = sum(1 for z in zs if z['result'] == 'hit')
    void = sum(1 for z in zs if z['result'] == 'void')
    tot = round(sum(z.get('r') or 0 for z in zs), 2)
    return len(keys), len(graded), len(zs), hit, void, tot


def avg_best_usd(keys):
    """average MFE in dollars over the zones that count in R"""
    bs = [z['best'] for k in keys for z in counted_zones(grade_of(k)) if z.get('best') is not None]
    return round(sum(bs) / len(bs), 2) if bs else None


def avg_best(keys):
    bs = [z['best_r'] for k in keys for z in counted_zones(grade_of(k)) if z.get('best_r') is not None]
    return round(sum(bs) / len(bs), 1) if bs else None


def track_page(ym, lang):
    keys = [k for k in KEYS if k.startswith(ym)]
    paths = {l: track_path(l, ym) for l in LANGS}
    doc = shell(lang, 'track', paths)
    n, ng, nr, hit, void, tot = month_stats(keys)
    # app-style record: one card per trade (a zone that price reached), realised pips = R × risk (1 pip = 0.10 $)
    trades = []
    for k in keys:
        g = grade_of(k)
        for z in counted_zones(g):
            if z.get('void') is None or z.get('edge') is None or z.get('r') is None: continue
            pp = round(z['r'] * abs(z['void'] - z['edge']) * 10)
            trades.append((k, z, pp))
    nt = len(trades); wins = sum(1 for *_, pp in trades if pp > 0); net = sum(pp for *_, pp in trades)
    sgn = lambda v: ('+' if v > 0 else '') + pips(v / 10, lang).split(' ')[0]
    tile = lambda v, k, c='': f'<div class="ktile"><span class="kv num {c}" dir="ltr">{esc(v)}</span><span class="kk">{esc(t(lang, k))}</span></div>'
    stats = (tile(f'{round(wins / nt * 100)}%' if nt else '—', 'tr_winrate', 'wr') + tile(sgn(net) if nt else '—', 'tr_netpips', 'r-up' if net > 0 else 'r-down' if net < 0 else '')
             + tile(str(nt), 'tr_signals'))
    rows = []
    for k, z, pp in reversed(trades):
        side = z['side']
        if z['result'] == 'void': chip = f'<span class="chip bad">✗ {esc(t(lang, "tr_sl"))}</span>'
        else: chip = f'<span class="chip {"good" if pp > 0 else "bad" if pp < 0 else "flat"} num" dir="ltr">{"✓ " if pp > 0 else ""}{esc(sgn(pp))} {pip_word(pp, lang)}</span>'
        how = t(lang, 'res_' + z['result'])
        rv = f"data/charts/{k}-{'vi' if lang == 'vi' else 'en'}-review.png"
        has_rv = os.path.exists(os.path.join(ROOT, rv))
        rows.append(f'<div class="tcard"><div class="tc-top"><a class="tc-h" href="{plan_path(lang, k)}#result"><b class="sym">XAUUSD</b><span class="sub mx"><span>{esc(t(lang, "gold_usd"))}</span><span>{esc(day_label(dt.date.fromisoformat(k[:10]), lang))}</span><span>{esc(t(lang, "ed_short")[k[11:]])}</span></span></a>'
                    f'<span class="sidebadge {side_cls(side)}">{esc(t(lang, side))}</span></div>'
                    f'<div class="tc-mid"><span class="entry">{esc(t(lang, "tr_entry"))} <b class="num" dir="ltr">{esc(fmt(z["edge"], lang))}</b></span>{chip}</div>'
                    f'<div class="tc-bot"><span class="muted small">{esc(how)}' + (f', {esc(t(lang, "tr_max"))} <span class="num" dir="ltr">+{esc(pips(z["best"], lang))}</span>' if z.get('best') is not None else '') + '</span>'
                    + (f'</div><details class="rv"><summary class="tbtn">{esc(t(lang, "rv_h"))}</summary><a href="{plan_path(lang, k)}#result"><picture>{webp_source(rv, 1800, 2412)}<img src="/{rv}" alt="{esc(t(lang, "rv_alt"))}" loading="lazy" width="1800" height="2412"></picture></a>'
                       f'<p class="small"><a href="{plan_path(lang, k)}#result">{esc(t(lang, "rv_go"))} →</a></p></details>' if has_rv
                       else f'<a class="tbtn" href="{plan_path(lang, k)}#result">{esc(t(lang, "tr_detail"))}</a></div>')
                    + '</div>')
    # plans where price never reached a zone stay on the record, listed compactly
    idle = [k for k in reversed(keys) if grade_of(k) and not counted_zones(grade_of(k))]
    if idle:
        rows.append(f'<details class="idle"><summary>{esc(t(lang, "tr_notrade"))} ({len(idle)})</summary><div class="stack-sm">'
                    + ''.join(f'<a class="idle-row" href="{plan_path(lang, k)}#result"><span>{esc(day_label(dt.date.fromisoformat(k[:10]), lang))}, {esc(t(lang, "ed_short")[k[11:]])}</span>'
                              f'<span class="muted small">{esc(t(lang, "z_near_short") if grade_of(k).get("near") else res_label(grade_of(k), lang))}</span></a>' for k in idle)
                    + '</div></details>')
    i = MONTHS.index(ym)
    nav = []
    if i > 0: nav.append(f'<a class="btn alt" href="{track_path(lang, MONTHS[i-1])}">{esc(t(lang, "tr_prev_m"))}</a>')
    if i + 1 < len(MONTHS): nav.append(f'<a class="btn alt" href="{track_path(lang, MONTHS[i+1])}">{esc(t(lang, "tr_next_m"))}</a>')
    nav.append(f'<a class="btn alt" href="{today_path(lang)}">{esc(t(lang, "today_plan"))}</a>')
    h1 = f"{t(lang, 'tr_h1')} {month_label(ym, lang)}"
    body = (f'  <section id="view-track">\n    <div class="plan-head"><div><p class="eyebrow mx"><span>XAUUSD</span><span>NEXUS CORE</span></p><h1>{esc(t(lang, 'tr_h1'))} <span class="d">{esc(month_label(ym, lang))}</span></h1>'
            f'<p class="lede">{esc(t(lang, "tr_lede"))}</p></div></div>\n'
            f'    <p class="eyebrow tperf">{esc(t(lang, "tr_perf"))} {esc(month_label(ym, lang))}</p><div class="ktiles">{stats}</div>\n'
            f'    <h2>{esc(t(lang, "tr_list"))}</h2>\n'
            f'    <div class="stack-sm">{"".join(rows) if rows else "<div class=\"card empty\">" + esc(t(lang, "tr_none")) + "</div>"}</div>\n'
            f'    <nav class="pnav">{"".join(nav)}</nav>\n'
            f'    <h2 id="method">{esc(t(lang, "tr_method"))}</h2>\n'
            f'    <ol class="card method">{"".join("<li>" + esc(x) + "</li>" for x in t(lang, "tr_m"))}</ol>\n  </section>')
    doc = set_view(doc, body)
    title = f"{h1} | XAUUSD | NEXUS CORE"
    desc = (f"{t(lang, 'tr_lede')} {t(lang, 'tr_plans')}: {n}, {t(lang, 'tr_hit')}: {hit}/{nr}, {t(lang, 'tr_r')}: {r_text(tot, lang, 1)}." if nr
            else f"{t(lang, 'tr_lede')} {t(lang, 'tr_plans')}: {n}.")[:300]
    url = SITE + paths[lang]
    page_ld = {'@type': 'CollectionPage', '@id': url, 'name': h1, 'description': desc, 'inLanguage': HL[lang], 'isPartOf': {'@id': SITE + '/#website'},
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
            f'        <a class="card next" href="{today_path(lang)}"><strong>{esc(t(lang, "sg_free"))}</strong><span>{esc(t(lang, "sg_free_link"))}</span></a>\n'
            f'      </div>\n    </div>\n  </section>')
    doc = set_view(doc, body)
    title = f"{t(lang, 'sg_h1')}: {t(lang, 'sg_soon')} | NEXUS CORE"
    desc = t(lang, 'sg_lede')
    url = SITE + paths[lang]
    page_ld = {'@type': 'WebPage', '@id': url, 'name': t(lang, 'sg_h1'), 'description': desc, 'inLanguage': HL[lang], 'isPartOf': {'@id': SITE + '/#website'}}
    return finish(doc, head_tags(lang, title, desc, paths, SITE + '/assets/logo-banner.png', og='website'), ld(page_ld, crumbs(lang, [('NEXUS CORE', PATH[lang]), (t(lang, 'sg_h1'), paths[lang])])))



def ea_page(lang):
    """NEXUS CORE Gold EA landing page (owner's brief 23/11/2026). Benefits only – no method, no internal numbers,
    no performance figures (links to the Track Record instead); every buy/contact button goes to Telegram."""
    from ea_copy import EA as E_, TG
    c = E_[lang]
    paths = {l: ea_path(l) for l in LANGS}
    doc = shell(lang, 'ea', paths)
    tg = f'href="{TG}" target="_blank" rel="noopener noreferrer"'
    chips = ''.join(f'<li>{esc(x)}</li>' for x in c['chips'])
    feats = ''.join(f'<li class="card"><h3>{esc(a)}</h3><p>{esc(b)}</p></li>' for a, b in c['feats'])
    steps = ''.join(f'<li class="card"><span class="ea-n num">{i + 1}</span><h3>{esc(a)}</h3><p>{esc(b)}</p></li>' for i, (a, b) in enumerate(c['steps']))
    plans = ''.join(
        f'<li class="card ea-plan{" hot" if j == 2 else ""}">' + (f'<span class="ea-badge">{esc(tag)}</span>' if tag else '')
        + f'<h3>{esc(name)}</h3><ul class="ticks">{"".join("<li>" + esc(x) + "</li>" for x in pts)}</ul>'
        + f'<p class="muted small">{esc(c["price"])}</p><a class="btn{" solid" if j == 2 else ""} ea-btn" {tg}>{esc(c["plan_btn"])}</a></li>'
        for j, (name, tag, pts) in enumerate(c['plans']))
    faq = ''.join(f'<details class="card ea-q"><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in c['faq'])
    body = (f'  <section id="view-ea" class="ea">\n'
            f'    <div class="ea-hero card"><p class="eyebrow">{esc(c["eyebrow"])}</p><h1>{esc(c["h1"])}</h1><p class="lede">{esc(c["lede"])}</p>\n'
            f'      <div class="ea-cta"><a class="btn big" {tg}>{esc(c["cta"])}{ARROW}</a><a class="btn alt" href="{today_path(lang)}">{esc(c["cta2"])}</a></div>\n'
            f'      <ul class="ea-chips">{chips}</ul><p class="muted small ea-rs">{esc(c["risk_short"])}</p></div>\n'
            f'    <h2>{esc(c["feat_h"])}</h2>\n    <ul class="ea-grid">{feats}</ul>\n'
            f'    <h2>{esc(c["how_h"])}</h2>\n    <ol class="ea-grid ea-steps">{steps}</ol>\n'
            f'    <h2>{esc(c["plans_h"])}</h2>\n    <ul class="ea-grid ea-plans">{plans}</ul>\n'
            f'    <div class="card ea-see"><div><h3>{esc(c["see_h"])}</h3><p>{esc(c["see_p"])}</p></div>'
            f'<div class="ea-cta"><a class="btn alt" href="{today_path(lang)}">{esc(c["see_today"])}</a><a class="btn alt" href="{track_path(lang, CUR_MONTH)}">{esc(c["see_track"])}</a></div></div>\n'
            f'    <h2>{esc(c["faq_h"])}</h2>\n    <div class="stack-sm">{faq}</div>\n'
            f'    <div class="card ea-end"><h3>{esc(c["end_h"])}</h3><p>{esc(c["end_p"])}</p><div class="ea-cta"><a class="btn big" {tg}>{esc(c["cta"])}{ARROW}</a></div></div>\n'
            f'    <aside class="card ea-risk" role="note"><h3>{esc(c["risk_h"])}</h3><p>{esc(c["risk"])}</p><p>{esc(c["diff"])}</p>'
            f'<p class="small"><a href="{legal_path(lang, "terms")}">{esc(c["terms"])}</a> · <a href="{legal_path(lang, "risk")}">{esc(c["riskdoc"])}</a></p></aside>\n'
            f'  </section>')
    doc = set_view(doc, body)
    url = SITE + paths[lang]
    page_ld = {'@type': 'WebPage', '@id': url, 'name': c['h1'], 'description': c['desc'], 'inLanguage': HL[lang], 'isPartOf': {'@id': SITE + '/#website'}}
    fq = {'@type': 'FAQPage', '@id': url + '#faq', 'inLanguage': HL[lang], 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in c['faq']]}
    return finish(doc, head_tags(lang, c['title'], c['desc'], paths, SITE + '/assets/logo-banner.png', og='website'),
                  ld(page_ld, fq, crumbs(lang, [('NEXUS CORE', PATH[lang]), (c['tab'], paths[lang])])))


def example_box(kind, lang):
    """A live box built from the latest plan, so every Q&A page shows real, current numbers."""
    p, k = P, key_of(P)
    mz = p.get('main_zone')
    head = f'{t(lang, "plan_of")} {day_label(dt.date.fromisoformat(p["date"]), lang)}, {t(lang, "ed")[p["edition"]]}'
    rows = []
    row = lambda kk, v, n=True: rows.append(f'<div class="row{"" if n else " text"}"><span class="k">{esc(kk)}</span><span class="v{" num" if n else ""}"{" dir=\"ltr\"" if n else ""}>{esc(v)}</span></div>')
    row(t(lang, 'bias'), bias_label(p, lang), False)
    if kind in ('zone', 'invalidation', 'plan', 'scenarios', 'context', 'news', 'session') and mz:
        row(t(lang, 'main_zone') + par(t(lang, mz['side']), lang), rng(mz['lo'], mz['hi'], lang))
    if kind == 'zone':
        for z in (p.get('zones') or [])[:4]:
            if mz and z['lo'] == mz['lo'] and z['hi'] == mz['hi']: continue
            row(t(lang, z['side']) + ': ' + L(z.get('status'), lang)[:70], rng(z['lo'], z['hi'], lang))
    if kind in ('invalidation', 'plan', 'zone') and p.get('invalidation'):
        row(t(lang, 'invalid'), L(p['invalidation'], lang), False)
    if kind in ('plan', 'invalidation') and p.get('targets'):
        x = p['targets'][0]; row(t(lang, 'target') + ' ' + x['label'], rng(x['lo'], x['hi'], lang))
    if kind == 'scenarios':
        for i, sc in enumerate(p.get('scenarios') or []):
            row(f"{t(lang, 'main') if i == 0 else t(lang, 'alt')} ({t(lang, sc['side'])}, {sc['prob']}%)", scen_text(L(sc['text'], lang)), False)
    if kind == 'context':
        for c in p.get('context') or []: row(L(c['k'], lang), L(c['v'], lang), False)
    if kind == 'news':
        for n in p.get('news') or []: row(L(n['text'], lang), vn_news_time(n.get('time', ''), p['date'][:4], lang), False)
    if kind == 'session':
        for e in ED_ORDER: row(t(lang, 'ed')[e], f"{hm_local(dt.datetime.strptime(p['date'] + ' ' + ED_TIME[e], '%Y-%m-%d %H:%M'), lang)} ({['00:00', '06:45', '12:30'][ED_ORDER.index(e)]} UTC)")
    if kind == 'track':
        n, ng, nr, hit, void, tot = month_stats([x for x in KEYS if x.startswith(CUR_MONTH)])
        row(t(lang, 'tr_plans'), str(n)); row(t(lang, 'tr_graded'), str(ng)); row(t(lang, 'tr_reached'), str(nr))
        row(t(lang, 'tr_hit'), f'{hit}/{nr}' if nr else '—'); row(t(lang, 'tr_r'), r_text(tot, lang, 1) if nr else '—')
    if kind != 'track':
        g = grade_of(k)
        row(t(lang, 'pp_result'), res_label(g, lang) + ((' ' + r_text(g.get('r'), lang)) if g and g.get('r') is not None else ''), False)
    pl = plan_path(lang if lang in PFX else 'en', k)
    links = f'<a href="{pl}">{esc(t(lang, "see_plan"))}</a><br><a href="{track_path(lang, CUR_MONTH)}">{esc(t(lang, "see_track"))}</a>'
    return (f'<aside class="card example"><p class="eyebrow">{esc(t(lang, "ln_example"))}</p><strong>{esc(head)}</strong>'
            f'<div class="list">{"".join(rows)}</div><p class="small">{links}</p></aside>')


def learn_page(lang, slug):
    x = LEARN[lang][slug]
    pair = learn_pair(lang, slug)
    paths = {l: pair.get(l) or (learn_index_path(l) if l in LEARN_LANGS else PATH[l]) for l in LANGS}
    paths[lang] = learn_path(lang, slug)
    doc = shell(lang, 'learn', paths)
    secs = []
    for sec in x.get('sections') or []:
        h = f'<h2 class="ah">{esc(sec["h"])}</h2>' if sec.get('h') else ''
        ps = ''.join(f'<p>{esc(pp)}</p>' for pp in sec.get('p') or [])
        ul = ('<ul>' + ''.join(f'<li>{esc(li)}</li>' for li in sec['ul']) + '</ul>') if sec.get('ul') else ''
        ol = ('<ol>' + ''.join(f'<li>{esc(li)}</li>' for li in sec['ol']) + '</ol>') if sec.get('ol') else ''
        secs.append(h + ps + ul + ol)
    faq = x.get('faq') or []
    faq_html = ''.join(f'<details class="card qa"><summary>{esc(f["q"])}</summary><p>{esc(f["a"])}</p></details>' for f in faq)
    rel = [r for r in x.get('related') or [] if r in LEARN[lang] and r != slug][:6]
    rel_html = ''.join(f'<a class="card rel" href="{learn_path(lang, r)}">{esc(LEARN[lang][r]["q"])}</a>' for r in rel)
    body = (f'  <section id="view-learn">\n    <div class="plan-head"><div><p class="eyebrow"><a href="{learn_index_path(lang)}">{esc(t(lang, "ln_eyebrow"))}</a></p>'
            f'<h1>{esc(x["q"])}</h1></div></div>\n'
            f'    <div class="card answer"><p class="eyebrow">{esc(t(lang, "ln_short"))}</p><p>{esc(x["answer"])}</p></div>\n'
            f'    <div class="layout">\n      <article class="stack prose">{"".join(secs)}</article>\n'
            f'      <div class="stack">{example_box(x.get("example") or "plan", lang)}'
            f'{("<h2>" + esc(t(lang, "ln_related")) + "</h2><div class=\"stack-sm\">" + rel_html + "</div>") if rel_html else ""}</div>\n    </div>\n'
            f'    {("<h2>" + esc(t(lang, "ln_faq")) + "</h2><div class=\"stack-sm\">" + faq_html + "</div>") if faq_html else ""}\n'
            f'    <p class="muted small">{esc(t(lang, "ln_updated"))} {esc(x["publish"])}, NEXUS CORE AI</p>\n  </section>')
    doc = set_view(doc, body)
    title = (x.get('title') or x['q']) + ' | NEXUS CORE'
    desc = (x.get('desc') or x['answer'])[:300]
    url = SITE + paths[lang]
    pub = dt.datetime.fromisoformat(x['publish'] + 'T08:00:00+07:00')
    art = {'@type': 'Article', '@id': url + '#article', 'headline': x['q'][:110], 'description': desc, 'inLanguage': HL[lang],
           'datePublished': pub.isoformat(), 'dateModified': updated_dt(P).isoformat() if updated_dt(P) > pub else pub.isoformat(),
           'author': {'@id': SITE + '/#org'}, 'publisher': {'@id': SITE + '/#org'}, 'mainEntityOfPage': url, 'image': [img_for(P, 'en')],
           'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD) trading'}}
    fq = {'@type': 'FAQPage', '@id': url + '#faq', 'inLanguage': HL[lang], 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in [(x['q'], x['answer'])] + [(f['q'], f['a']) for f in faq]]}
    bc = crumbs(lang, [('NEXUS CORE', PATH[lang]), (t(lang, 'ln_eyebrow'), learn_index_path(lang)), (x['q'], paths[lang])])
    langs = [l for l in LEARN_LANGS if l in pair]
    return finish(doc, head_tags(lang, title, desc, paths, img_for(P, 'en'), pub, og='article', langs=langs if len(langs) > 1 else [lang]), ld(art, fq, bc))


def move_page(lang, m):
    paths = {l: move_path(l, m) for l in LANGS}
    doc = shell(lang, 'move', paths)
    d0 = dt.date.fromisoformat(m['date'])
    pct = m['change_pct']
    sign = '+' if pct > 0 else ''
    cls = 'r-up' if pct > 0 else 'r-down' if pct < 0 else 'r-flat'
    st = lambda k, v, c='': f'<div class="stat"><span class="k">{esc(t(lang, k))}</span><span class="v num {c}" dir="ltr">{esc(v)}</span></div>'
    bh = m.get('biggest_hour') or {}
    stats = (st('mv_change', f"{sign}{fmt(pct, lang)}% ({sign}{fmt(m['change'], lang)})", cls) + st('mv_oc', f"{fmt(m['open'], lang)} → {fmt(m['close'], lang)}") +
             st('mv_hl', f"{fmt(m['high'], lang)} / {fmt(m['low'], lang)}") +
             (st('mv_big', f"{('+' if bh['move'] > 0 else '')}{fmt(bh['move'], lang)} ({hm_local(dt.datetime.strptime(bh['start_vn'][:16], '%Y-%m-%d %H:%M'), lang)})") if bh.get('start_vn') else ''))
    reasons = ''.join(f'<li>{esc(L(r, lang))}</li>' for r in m['reasons'])
    srcs = ', '.join(esc(s_) for s_ in (m.get('sources') or []) if isinstance(s_, str))
    dk = [k for k in KEYS if k.startswith(m['date'])]
    plans = ''.join(f'<a class="btn alt" href="{plan_path(lang, k)}">{esc(t(lang, "ed_short")[k[11:]])}</a>' for k in dk)
    others = [x for x in reversed(MOVES) if x['date'] != m['date']][:5]
    oth = ''.join(f'<a class="card rel" href="{move_path(lang, x)}">{esc(day_label(dt.date.fromisoformat(x["date"]), lang))}: {esc(L(x["headline"], lang))}</a>' for x in others)
    h1 = f"{t(lang, 'mv_h1')} {day_label(d0, lang)}"
    body = (f'  <section id="view-move">\n    <div class="plan-head"><div><p class="eyebrow"><a href="{learn_home(lang)}">{esc(t(lang, "mv_eyebrow"))} XAUUSD</a></p>'
            f'<h1>{esc(t(lang, "mv_h1"))} <span class="d">{esc(day_label(d0, lang))}</span></h1><p class="lede">{esc(L(m["headline"], lang))}</p></div></div>\n'
            f'    <div class="stats">{stats}</div>\n'
            f'    <div class="layout"><article class="stack prose"><h2 class="ah">{esc(t(lang, "mv_reasons"))}</h2><ul>{reasons}</ul>'
            f'{("<p class=\"muted small\">" + esc(t(lang, "mv_sources")) + ": " + srcs + "</p>") if srcs else ""}'
            f'<p class="muted small">{esc(t(lang, "mv_method"))}</p></article>\n'
            f'    <div class="stack">{("<h2>" + esc(t(lang, "mv_plans")) + "</h2><div class=\"pnav\">" + plans + "</div>") if plans else ""}'
            f'{("<h2>" + esc(t(lang, "mv_recent")) + "</h2><div class=\"stack-sm\">" + oth + "</div>") if oth else ""}</div></div>\n  </section>')
    doc = set_view(doc, body)
    title = f"{h1}: {L(m['headline'], lang)} | XAUUSD | NEXUS CORE"
    desc = f"{L(m['headline'], lang)} {t(lang, 'mv_change')}: {sign}{fmt(pct, lang)}%. " + ' '.join(L(r, lang) for r in m['reasons'][:2])
    desc = desc[:300]
    url = SITE + paths[lang]
    pub = dt.datetime.combine(d0, dt.time(17, 0), tzinfo=ZoneInfoNY)
    art = {'@type': 'Article', '@id': url + '#article', 'headline': h1[:110], 'description': desc, 'inLanguage': HL[lang],
           'datePublished': pub.isoformat(), 'author': {'@id': SITE + '/#org'}, 'publisher': {'@id': SITE + '/#org'}, 'mainEntityOfPage': url,
           'image': [img_for(P, 'en')], 'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Thing', 'name': 'Gold (XAUUSD)'}}
    bc = crumbs(lang, [('NEXUS CORE', PATH[lang]), (t(lang, 'mv_eyebrow'), learn_home(lang)), (h1, paths[lang])])
    return finish(doc, head_tags(lang, title, desc, paths, img_for(P, 'en'), pub, og='article'), ld(art, bc))


def learn_index(lang):
    paths = {l: (learn_index_path(l) if l in LEARN_LANGS else PATH[l]) for l in LANGS}
    doc = shell(lang, 'learn', paths)
    items = sorted(LEARN[lang].values(), key=lambda x: (x['publish'], x.get('order', 0)), reverse=True)
    ql = ''.join(f'<a class="card rel" href="{learn_path(lang, x["slug"])}"><strong>{esc(x["q"])}</strong><span class="muted">{esc(x["answer"][:150])}…</span></a>' for x in items)
    mv = ''.join(f'<a class="card rel" href="{move_path(lang, m)}">{esc(day_label(dt.date.fromisoformat(m["date"]), lang))}: {esc(L(m["headline"], lang))}</a>' for m in list(reversed(MOVES))[:10])
    body = (f'  <section id="view-learn">\n    <div class="plan-head"><div><p class="eyebrow">{esc(t(lang, "ln_eyebrow"))}</p><h1>{esc(t(lang, "ln_index_h1"))}</h1>'
            f'<p class="lede">{esc(t(lang, "ln_index_lede"))}</p></div></div>\n'
            f'    {("<h2>" + esc(t(lang, "mv_recent")) + "</h2><div class=\"stack-sm\">" + mv + "</div>") if mv else ""}\n'
            f'    <h2>{esc(t(lang, "ln_all"))}</h2>\n    <div class="qgrid">{ql}</div>\n  </section>')
    doc = set_view(doc, body)
    title = f"{t(lang, 'ln_index_h1')} | XAUUSD Q&A | NEXUS CORE"
    url = SITE + paths[lang]
    page_ld = {'@type': 'CollectionPage', '@id': url, 'name': t(lang, 'ln_index_h1'), 'description': t(lang, 'ln_index_lede'), 'inLanguage': HL[lang],
               'isPartOf': {'@id': SITE + '/#website'}, 'mainEntity': {'@type': 'ItemList', 'numberOfItems': len(items), 'itemListElement': [
                   {'@type': 'ListItem', 'position': i + 1, 'url': SITE + learn_path(lang, x['slug'])} for i, x in enumerate(items)]}}
    return finish(doc, head_tags(lang, title, t(lang, 'ln_index_lede'), paths, SITE + '/assets/logo-banner.png', og='website', langs=LEARN_LANGS), ld(page_ld))


EN_ROOT = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>NEXUS CORE: gold plan</title>
<meta name="robots" content="noindex, follow"><link rel="canonical" href="https://nexuscore.trade/">
<meta http-equiv="refresh" content="0; url=/"></head>
<body><p><a href="/">NEXUS CORE: today's gold plan</a></p></body></html>
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
            for l in LANGS: out.append(f'    <xhtml:link rel="alternate" hreflang="{HL[l]}" href="{SITE}{paths[l]}"/>')
            out.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{paths["en"]}"/>\n  </url>')

    def mod(k):
        g = grade_of(k)
        if g and g.get('graded_utc'): return dt.datetime.strptime(g['graded_utc'], '%Y-%m-%dT%H:%MZ').replace(tzinfo=dt.timezone.utc).isoformat()
        return updated_dt(PLANS[k]).isoformat()

    url(PATH, updated_dt(P).isoformat(), 'hourly', '1.0')
    url({l: today_path(l) for l in LANGS}, updated_dt(P).isoformat(), 'hourly', '0.9')
    for ym in reversed(MONTHS):
        ks = [k for k in KEYS if k.startswith(ym)]
        url({l: track_path(l, ym) for l in LANGS}, max((mod(k) for k in ks), default=None), 'daily', '0.8')
    url({l: signals_path(l) for l in LANGS}, None, 'monthly', '0.6')
    url({l: ea_path(l) for l in LANGS}, None, 'monthly', '0.6')
    for kind in LEGAL: url({l: legal_path(l, kind) for l in LANGS}, None, 'yearly', '0.3')
    for k in reversed(KEYS):
        url({l: plan_path(l, k) for l in LANGS}, mod(k), None, '0.7')
    for m in reversed(MOVES):
        url({l: move_path(l, m) for l in LANGS}, dt.datetime.combine(dt.date.fromisoformat(m['date']), dt.time(17, 0), tzinfo=ZoneInfoNY).isoformat(), None, '0.6')
    def one(lang, path, lastmod, prio, alts):
        s_ = f'  <url>\n    <loc>{SITE}{path}</loc>\n    <lastmod>{lastmod}</lastmod>\n    <priority>{prio}</priority>'
        out.append(s_)
        if len(alts) > 1:
            for l, pth in alts.items(): out.append(f'    <xhtml:link rel="alternate" hreflang="{HL[l]}" href="{SITE}{pth}"/>')
            out.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{alts.get("en", path)}"/>')
        out.append('  </url>')
    for lang in LEARN_LANGS:
        one(lang, learn_index_path(lang), updated_dt(P).isoformat(), '0.7', {l: learn_index_path(l) for l in LEARN_LANGS})
        for slug, x in LEARN[lang].items():
            one(lang, learn_path(lang, slug), x['publish'] + 'T08:00:00+07:00', '0.6', learn_pair(lang, slug))
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
             'and the economic calendar. Every plan is graded in public on 15-minute candles after it expires: wins, losses and misses '
             'all stay on the record. Analysis only, not financial advice.', '',
             f'## Latest plan ({p["date"]}, {t(lang, "ed").get(p["edition"], p["edition"])}, updated {p["updated_vn"]} GMT+7)', '',
             f'- Permanent page: {SITE}{plan_path("en", key_of(p))}',
             f'- Bias: {bias_label(p, lang)}',
             f'- Summary: {plan_headline(p, lang)}']
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
                     f'{(", main zone " + rng(qz["lo"], qz["hi"], "en")) if qz else ""}: {res_label(g, "en")}{(" " + r_text(g.get("r"), "en")) if g and g.get("r") is not None else ""}')
    if LEARN['en']:
        lines += ['', '## Gold trading Q&A', '']
        for x in sorted(LEARN['en'].values(), key=lambda x: x['publish']):
            lines.append(f'- [{x["q"]}]({SITE}{learn_path("en", x["slug"])}): {x["answer"][:160]}')
    if MOVES:
        lines += ['', '## Why gold moved (recent days)', '']
        for m in list(reversed(MOVES))[:10]:
            lines.append(f'- [{m["date"]}: {L(m["headline"], "en")}]({SITE}{move_path("en", m)}) ({m["change_pct"]:+}%)')
    lines += ['', '## Pages', '',
              f'- [Home]({SITE}/): what NEXUS CORE is, today\'s plan in short and the live track record',
              f'- [Today\'s gold plan (English)]({SITE}/today/): latest XAUUSD plan with chart, zones and scenarios',
              f'- [خطة الذهب اليوم (العربية)]({SITE}/ar/today/): the same plan in Arabic',
              f'- [Plan vàng hôm nay (Tiếng Việt)]({SITE}/vi/today/): the same plan in Vietnamese',
              f'- [今日黃金計畫（繁體中文）]({SITE}/zh-hant/today/): the same plan in Traditional Chinese',
              f'- [Terms of Use]({SITE}{legal_path("en", "terms")}), [Privacy Policy]({SITE}{legal_path("en", "privacy")}), [Risk Disclosure]({SITE}{legal_path("en", "risk")})',
              f'- [Track record]({SITE}{track_path("en", CUR_MONTH)}): every plan this month and how it played out',
              f'- [Signals]({SITE}{signals_path("en")}): members-only trade signals (waitlist)',
              f'- [NEXUS CORE Gold EA]({SITE}{ea_path("en")}): MetaTrader 5 Expert Advisor that trades the published daily plan (licence via Telegram)',
              f'- [Plan data (JSON)]({SITE}/data/latest.json): machine-readable latest plan',
              f'- [All plans with grades (JSON)]({SITE}/data/history.json)', '',
              '## Optional', '',
              '- [Telegram channel](https://t.me/nexuscorefx): every plan as it is published',
              '- [X @XAU_CRYPTO](https://x.com/XAU_CRYPTO)', '- [YouTube @nexuscorefx](https://www.youtube.com/@nexuscorefx)', '',
              'Risk: ' + t('en', 'disclaimer'), '']
    return '\n'.join(lines)


def record_numbers():
    """Live Track Record numbers for Q&A texts – same trade list and pip maths as the Track Record page (all months)."""
    graded = [k for k in KEYS if grade_of(k)]
    tr = []
    for k in graded:
        for z in counted_zones(grade_of(k)):
            if z.get('void') is None or z.get('edge') is None or z.get('r') is None: continue
            tr.append((round(z['r'] * abs(z['void'] - z['edge']) * 10), z.get('best')))
    nt, wins, net = len(tr), sum(1 for pp, _ in tr if pp > 0), sum(pp for pp, _ in tr)
    mfe = [b for _, b in tr if b is not None]
    first = min(graded) if graded else None
    return {'TR_SINCE': dt.date.fromisoformat(first[:10]).strftime('%-d %b %Y') if first else '—',
            'TR_PLANS': str(len(graded)), 'TR_TRADES': str(nt), 'TR_WINS': str(wins), 'TR_LOSSES': str(nt - wins),
            'TR_WINRATE': f'{round(wins / nt * 100)}%' if nt else '—',
            'TR_NETPIPS': (('+' if net > 0 else '') + f'{net:,}') if nt else '0',
            'TR_AVG_MFE': f'{sum(mfe) / len(mfe):.1f}' if mfe else '—',
            'TR_IDLE': str(len([k for k in graded if not counted_zones(grade_of(k))])),
            'TR_UPDATED': dt.datetime.now(TZ_VN).strftime('%-d %b %Y')}


def fill_learn():
    """Replace [[TR_…]] tokens in the Q&A data with the live numbers (every build), so answers never go stale."""
    nums = record_numbers()
    def sub(v):
        if isinstance(v, str):
            for kk, vv in nums.items(): v = v.replace('[[' + kk + ']]', vv)
            if '[[TR_' in v: raise SystemExit('unknown Q&A token: ' + re.search(r'\[\[TR_\w+\]\]', v).group(0))
            return v
        if isinstance(v, list): return [sub(x) for x in v]
        if isinstance(v, dict): return {kk: sub(x) for kk, x in v.items()}
        return v
    for lang in LEARN_LANGS:
        for slug in list(LEARN[lang]): LEARN[lang][slug] = sub(LEARN[lang][slug])


if __name__ == '__main__':
    try:   # WebP copies of new chart PNGs before the pages refer to them (SEO F3, 21/11/2026)
        import webp
        _n = webp.sweep(ROOT)
        if _n: print(f'webp: {_n} file(s) written')
    except Exception as e:
        print(f'webp: skipped ({type(e).__name__}: {e})')
    write('data/history.json', history_json())
    fill_learn()
    for lang in LANGS:
        write(('' if lang == 'en' else lang + '/') + 'index.html', home_page(lang))
        # /today = the latest plan with tabs (bio links on TikTok/Instagram/YouTube, X posts, alerts)
        write(today_path(lang).strip('/') + '/index.html', today_page(lang))
        for kind in LEGAL:
            write(legal_path(lang, kind).strip('/') + '/index.html', legal_page(lang, kind))
        for k in KEYS:
            write(plan_path(lang, k).strip('/') + '/index.html', plan_page(k, lang))
        for ym in MONTHS:
            write(track_path(lang, ym).strip('/') + '/index.html', track_page(ym, lang))
        write(signals_path(lang).strip('/') + '/index.html', signals_page(lang))
        write(ea_path(lang).strip('/') + '/index.html', ea_page(lang))
        for m in MOVES:
            write(move_path(lang, m).strip('/') + '/index.html', move_page(lang, m))
    for lang in LEARN_LANGS:
        write(learn_index_path(lang).strip('/') + '/index.html', learn_index(lang))
        for slug in LEARN[lang]:
            write(learn_path(lang, slug).strip('/') + '/index.html', learn_page(lang, slug))
            for old in LEARN[lang][slug].get('old_slugs') or []:   # renamed page: the old address forwards to the new one
                new = SITE + learn_path(lang, slug)
                write(learn_path(lang, old).strip('/') + '/index.html',
                      f'<!doctype html><html lang="{HL.get(lang, lang)}"><head><meta charset="utf-8"><meta name="robots" content="noindex">'
                      f'<meta http-equiv="refresh" content="0; url={esc(new)}"><link rel="canonical" href="{esc(new)}"><title>{esc(LEARN[lang][slug]["title"])}</title></head>'
                      f'<body><p><a href="{esc(new)}">{esc(LEARN[lang][slug]["title"])}</a></p></body></html>')
    write('en/index.html', EN_ROOT)
    write('sitemap.xml', sitemap())
    write('llms.txt', llms())
    # data/ea-zones.json for the MT5 EA (tools/ea_zones.py, levels from tools/grade.py); printed before "built:" so that line stays last
    # a failure here must not stop the web: the EA ignores a file whose date/edition/updated_vn differ from latest.json
    try:
        import ea_zones
        ea_zones.write(ROOT)
    except Exception as e:
        print(f'ea-zones: ERROR {type(e).__name__}: {e}')
    print(f'built: home + today + legal x3, {len(KEYS)} plan page(s) x{len(LANGS)}, {len(MONTHS)} track-record month(s) x{len(LANGS)}, signals x{len(LANGS)}, ea x{len(LANGS)}, {'+'.join(str(len(LEARN[l])) for l in LEARN_LANGS)} learn page(s) live (en+ar+zh), {len(MOVES)} why-gold-moved x{len(LANGS)}, sitemap.xml, llms.txt –', P['date'], P['edition'])
