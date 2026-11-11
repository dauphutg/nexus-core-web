(function () {
  'use strict';

  var T = {
    vi: {
      loading: 'Đang tải plan…', tab_plan: 'Plan ngày', tab_signals: 'Signal', tab_history: 'Lịch sử',
      bias: 'Xu hướng', scenarios: 'Kịch bản', zones: 'Các vùng giá', news: 'Lịch tin',
      main_zone: 'Vùng chính', invalid: 'Sai khi', range: 'Vùng giá dự kiến', target: 'Mục tiêu',
      plan_of: 'Plan ngày', edition: { '0700': 'bản 07:00', '1345': 'cập nhật 13:45', '1930': 'plan tối 19:30' },
      updated: 'cập nhật', next: 'Lần cập nhật tới', main: 'Chính', alt: 'Phụ',
      active: 'Đang chạy', closed: 'Đã đóng',
      no_active: 'Chưa có signal — signal tiếp theo hiện ở đây khi giá vào vùng plan.',
      no_closed: 'Chưa có signal nào đóng.',
      entry: 'Entry', sl: 'SL', tp: 'TP',
      tg_title: 'Nhận plan & signal qua Telegram', tg_sub: 'Miễn phí · kênh NEXUS CORE AI →',
      history_sub: 'Mọi plan đều được chấm công khai khi nến ngày đóng (04:00 VN) — đúng hay sai đều giữ lại.',
      h_days: 'Ngày đã chấm', h_right: 'Đúng hướng', h_r: 'Tổng R', pending: 'Chờ chấm',
      right: 'Đúng', wrong: 'Sai', void: 'Huỷ / đứng ngoài',
      SELL: 'BÁN', BUY: 'MUA', TWO_WAY: '2 CHIỀU', STAND_ASIDE: 'ĐỨNG NGOÀI', lean: 'nghiêng',
      stale: 'CŨ', err: 'Không tải được dữ liệu. Thử tải lại trang.',
      disclaimer: 'Nội dung chỉ để tham khảo, không phải lời khuyên đầu tư. Kết quả quá khứ không đảm bảo tương lai. Giao dịch vàng có đòn bẩy rủi ro cao.'
    },
    en: {
      loading: 'Loading plan…', tab_plan: 'Daily plan', tab_signals: 'Signals', tab_history: 'Track record',
      bias: 'Bias', scenarios: 'Scenarios', zones: 'Key zones', news: 'Economic calendar',
      main_zone: 'Main zone', invalid: 'Invalid if', range: 'Expected range', target: 'Target',
      plan_of: 'Daily plan', edition: { '0700': '07:00 edition', '1345': '13:45 update', '1930': 'evening plan 19:30' },
      updated: 'updated', next: 'Next update', main: 'Main', alt: 'Alternate',
      active: 'Active', closed: 'Closed',
      no_active: 'No live signal right now — the next one lands here when price reaches a plan zone.',
      no_closed: 'No closed signals yet.',
      entry: 'Entry', sl: 'SL', tp: 'TP',
      tg_title: 'Get plans & signals on Telegram', tg_sub: 'Free · NEXUS CORE AI channel →',
      history_sub: 'Every plan is graded in public at the daily close (04:00 VN time) — right or wrong, it stays.',
      h_days: 'Days graded', h_right: 'Direction right', h_r: 'Total R', pending: 'Pending',
      right: 'Right', wrong: 'Wrong', void: 'Void / stood aside',
      SELL: 'SELL', BUY: 'BUY', TWO_WAY: 'TWO-WAY', STAND_ASIDE: 'STAND ASIDE', lean: 'leaning',
      stale: 'OLD', err: 'Could not load data. Please reload the page.',
      disclaimer: 'For information only, not financial advice. Past results do not guarantee future results. Leveraged gold trading carries high risk.'
    }
  };

  var lang = 'vi';
  var saved = null;
  try { saved = localStorage.getItem('nc_lang'); } catch (e) {}
  lang = saved === 'vi' || saved === 'en' ? saved : ((navigator.language || '').toLowerCase().indexOf('vi') === 0 ? 'vi' : 'en');
  var data = { plan: null, signals: null, history: null };
  var seg = 'active';

  function t(k) { return T[lang][k] != null ? T[lang][k] : k; }
  function L(o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[lang] || o.vi || o.en || ''; }
  function fmt(n) {
    if (n == null || n === '') return '';
    var s = String(n);
    return lang === 'vi' ? s.replace('.', ',') : s;
  }
  function rng(lo, hi) { return lo === hi || hi == null ? fmt(lo) : fmt(lo) + '–' + fmt(hi); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function add(p) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) p.appendChild(arguments[i]); return p; }
  function clear(id) { var n = document.getElementById(id); n.textContent = ''; return n; }
  function sideCls(s) { return s === 'SELL' ? 'sell' : s === 'BUY' ? 'buy' : 'neutral'; }
  function row(k, v, vcls, text) {
    var r = el('div', 'row' + (text ? ' text' : ''));
    return add(r, el('span', 'k', k), el('span', 'v' + (vcls ? ' ' + vcls : ''), v));
  }

  function load(path) {
    return fetch(path + '?t=' + Date.now(), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(path);
      return r.json();
    });
  }

  function renderStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
  }

  function renderPlan() {
    var p = data.plan; if (!p) return;
    var d = p.date.split('-');
    var dateStr = d[2] + '/' + d[1] + '/' + d[0];
    document.getElementById('plan-title').textContent = t('plan_of') + ' ' + d[2] + '/' + d[1];
    document.getElementById('plan-meta').textContent = p.symbol + ' · ' + (t('edition')[p.edition] || p.edition) + ' · ' + t('updated') + ' ' + p.updated_vn.slice(11) + ' VN · ' + dateStr;

    var al = document.getElementById('alert');
    if (p.alert && L(p.alert)) { al.hidden = false; document.getElementById('alert-text').textContent = L(p.alert); } else al.hidden = true;

    var bc = document.getElementById('bias-card');
    var side = p.bias === 'TWO_WAY' || p.bias === 'STAND_ASIDE' ? (p.lean || '') : p.bias;
    bc.className = 'bias card ' + sideCls(side);
    var bv = t(p.bias);
    if ((p.bias === 'TWO_WAY') && p.lean) bv += ' · ' + t('lean') + ' ' + t(p.lean);
    document.getElementById('bias-val').textContent = bv;
    document.getElementById('day-type').textContent = L(p.day_type);
    document.getElementById('headline').textContent = L(p.headline);

    var lv = clear('levels');
    if (p.main_zone) add(lv, row(t('main_zone') + ' (' + t(p.main_zone.side) + ')', rng(p.main_zone.lo, p.main_zone.hi), 'main'));
    (p.targets || []).forEach(function (x) { add(lv, row(t('target') + ' ' + x.label, rng(x.lo, x.hi))); });
    if (p.range) add(lv, row(t('range'), rng(p.range.lo, p.range.hi)));
    if (p.invalidation) add(lv, row(t('invalid'), L(p.invalidation), 'bad', true));

    var cx = clear('context');
    (p.context || []).forEach(function (c) {
      add(cx, add(el('div', 'stat'), el('span', 'k', L(c.k)), el('span', 'v', L(c.v))));
    });

    var sc = clear('scenarios');
    (p.scenarios || []).forEach(function (s, i) {
      var c = el('div', 'card scen ' + sideCls(s.side));
      var head = add(el('div', 't'), el('span', null, (i === 0 ? t('main') : t('alt')) + ' · ' + t(s.side)), el('span', 'num muted', '~' + s.prob + '%'));
      var bar = el('div', 'bar'); var bi = el('i'); bi.style.width = Math.max(0, Math.min(100, s.prob)) + '%'; bar.appendChild(bi);
      add(sc, add(c, head, el('p', null, L(s.text)), bar));
    });

    var zn = clear('zones');
    (p.zones || []).forEach(function (z) {
      var c = el('div', 'card zone');
      var l = add(el('div', 'l'),
        add(el('div'), el('span', 'pill ' + sideCls(z.side), t(z.side)), document.createTextNode(' '), el('span', 'num', rng(z.lo, z.hi))),
        el('span', 's', L(z.status)));
      add(zn, add(c, l, el('span', 'g', z.grade)));
    });

    var nw = clear('news');
    (p.news || []).forEach(function (n) {
      var r = el('div', 'row news-row');
      var k = add(el('span', 'k'), el('span', 'imp ' + (n.impact || 'low')), document.createTextNode(L(n.text)));
      add(nw, add(r, k, el('span', 'v', n.time)));
    });

    var nx = clear('next');
    add(nx, el('strong', null, t('next')), el('span', null, L(p.next_update)));

    // LIVE badge goes grey when the plan is more than 30 hours old
    var age = (Date.now() - new Date(p.updated_vn.replace(' ', 'T') + ':00+07:00').getTime()) / 36e5;
    var live = document.querySelector('.live');
    if (age > 30) { live.classList.add('stale'); live.lastChild.textContent = t('stale'); }
  }

  function renderSignals() {
    var s = data.signals || { active: [], closed: [] };
    document.querySelectorAll('.seg button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.seg === seg ? 'true' : 'false'); });
    var list = clear('signal-list');
    var items = s[seg] || [];
    if (!items.length) { add(list, el('div', 'card empty', seg === 'active' ? t('no_active') : t('no_closed'))); return; }
    items.forEach(function (x) {
      var c = el('div', 'card sig');
      var left = add(el('div', 'stack-sm'),
        add(el('div'), el('span', 'pill ' + sideCls(x.side), t(x.side)), document.createTextNode(' '), el('span', 'muted', x.time || '')),
        add(el('div', 'nums'), el('span', null, t('entry')), el('span', null, t('sl')), el('span', null, t('tp')),
          el('span', null, fmt(x.entry)), el('span', null, fmt(x.sl)), el('span', null, (x.tp || []).map(fmt).join(' / '))));
      if (x.note) add(left, el('span', 'muted', L(x.note)));
      var right = null;
      if (x.r != null) right = el('span', 'num ' + (x.r > 0 ? 'r-up' : x.r < 0 ? 'r-down' : 'r-flat'), (x.r > 0 ? '+' : '') + fmt(x.r) + 'R');
      add(list, add(c, left, right));
    });
  }

  function renderHistory() {
    var h = (data.history && data.history.days) || [];
    var graded = h.filter(function (d) { return d.result; });
    var right = graded.filter(function (d) { return d.result === 'right'; }).length;
    var dir = graded.filter(function (d) { return d.result === 'right' || d.result === 'wrong'; }).length;
    var totalR = graded.reduce(function (a, d) { return a + (d.r || 0); }, 0);
    var st = clear('hist-stats');
    add(st,
      add(el('div', 'stat'), el('span', 'k', t('h_days')), el('span', 'v num', String(graded.length))),
      add(el('div', 'stat'), el('span', 'k', t('h_right')), el('span', 'v num', dir ? right + '/' + dir : '—')),
      add(el('div', 'stat'), el('span', 'k', t('h_r')), el('span', 'v num', graded.length ? (totalR > 0 ? '+' : '') + fmt(Math.round(totalR * 10) / 10) + 'R' : '—')));
    var list = clear('hist-list');
    h.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).forEach(function (d) {
      var c = el('div', 'card sig');
      var dd = d.date.split('-');
      var side = d.bias === 'TWO_WAY' || d.bias === 'STAND_ASIDE' ? (d.lean || '') : d.bias;
      var lab = t(d.bias) + (d.bias === 'TWO_WAY' && d.lean ? ' · ' + t(d.lean) : '');
      var res = d.result ? t(d.result) : t('pending');
      var left = add(el('div', 'stack-sm'),
        add(el('div'), el('strong', 'num', dd[2] + '/' + dd[1]), document.createTextNode(' '), el('span', 'pill ' + sideCls(side), lab)),
        el('span', 'muted', res + (d.main_zone ? ' · ' + d.main_zone : '') + (L(d.note) ? ' · ' + L(d.note) : '')));
      var right = d.r != null ? el('span', 'num ' + (d.r > 0 ? 'r-up' : d.r < 0 ? 'r-down' : 'r-flat'), (d.r > 0 ? '+' : '') + fmt(d.r) + 'R') : null;
      add(list, add(c, left, right));
    });
  }

  function route() {
    var tab = (location.hash || '#plan').slice(1);
    if (['plan', 'signals', 'history'].indexOf(tab) < 0) tab = 'plan';
    ['plan', 'signals', 'history'].forEach(function (v) { document.getElementById('view-' + v).hidden = v !== tab || !data.plan; });
    document.querySelectorAll('.tabs a').forEach(function (a) {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function renderAll() { renderStatic(); renderPlan(); renderSignals(); renderHistory(); route(); }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.lang;
      try { localStorage.setItem('nc_lang', lang); } catch (e) {}
      renderAll();
    });
  });
  document.querySelectorAll('.seg button').forEach(function (b) {
    b.addEventListener('click', function () { seg = b.dataset.seg; renderSignals(); });
  });
  window.addEventListener('hashchange', route);

  renderStatic();
  Promise.all([load('data/latest.json'), load('data/signals.json').catch(function () { return null; }), load('data/history.json').catch(function () { return null; })])
    .then(function (r) {
      data.plan = r[0]; data.signals = r[1]; data.history = r[2];
      document.getElementById('loading').hidden = true;
      renderAll();
    })
    .catch(function () { document.getElementById('loading').textContent = t('err'); });
})();
