// Trang nội bộ VIP Plan (giao diện như /today/): so plan đang chạy với bản nháp. Bản nháp nằm trên máy chủ ở dạng đã mã hoá;
// mật khẩu mở khoá riêng NGAY TRONG TRÌNH DUYỆT (Web Crypto). Không gửi mật khẩu đi đâu, không lưu mật khẩu.
// Khoá đã mở chỉ giữ trong phiên của tab này (sessionStorage) – đóng tab là hết.
(function () {
  'use strict';
  var DATA = '/data/nhap/', GAP = 3, SK = 'nb_khoa';
  var $ = function (s) { return document.querySelector(s); };
  var index = null, keyblock = null, priv = null, cur = null, selEd = null;

  // ---------- tiện ích ----------
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function f(n) { return n == null ? '—' : (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function rng(z) { return z.lo === z.hi ? f(z.lo) : f(z.lo) + '–' + f(z.hi); }
  function SIDE(s) { return s === 'SELL' ? 'BÁN' : s === 'BUY' ? 'MUA' : s === 'TWO_WAY' ? 'HAI CHIỀU' : s === 'STAND_ASIDE' ? 'ĐỨNG NGOÀI' : '—'; }
  function sideVi(s) { return s === 'SELL' ? 'bán' : s === 'BUY' ? 'mua' : s === 'TWO_WAY' ? 'hai chiều' : s === 'STAND_ASIDE' ? 'đứng ngoài' : 'khác'; }
  function sideCls(s) { return s === 'SELL' ? 'sell' : s === 'BUY' ? 'buy' : ''; }
  function hex2buf(h) { var a = new Uint8Array(h.length / 2); for (var i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
  function buf2hex(b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function getJSON(u) { return fetch(u, { cache: 'no-store', credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); }); }

  // ---------- khoá ----------
  function importPriv(pkcs8) { return crypto.subtle.importKey('pkcs8', pkcs8, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']); }
  function unlock(password) {
    var p = keyblock.priv;
    return crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) { return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: hex2buf(p.salt), iterations: p.iter }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']); })
      .then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: hex2buf(p.iv) }, k, hex2buf(p.ct)); })
      .then(function (pkcs8) {
        return importPriv(pkcs8).then(function (key) {
          priv = key;
          try { sessionStorage.setItem(SK, keyblock.kid + ':' + buf2hex(pkcs8)); } catch (e) {}
        });
      });
  }
  function restore() {
    var s = null; try { s = sessionStorage.getItem(SK); } catch (e) {}
    if (!s || !keyblock) return Promise.resolve();
    var i = s.indexOf(':');
    if (s.slice(0, i) !== keyblock.kid) { try { sessionStorage.removeItem(SK); } catch (e) {} return Promise.resolve(); }
    return importPriv(hex2buf(s.slice(i + 1))).then(function (k) { priv = k; }).catch(function () {});
  }
  function lock() { priv = null; try { sessionStorage.removeItem(SK); } catch (e) {} show(); }
  function decryptFile(o) {
    return crypto.subtle.decrypt({ name: 'RSA-OAEP' }, priv, hex2buf(o.ek))
      .then(function (raw) { return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']); })
      .then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: hex2buf(o.iv) }, k, hex2buf(o.ct)); })
      .then(function (pt) { return JSON.parse(new TextDecoder().decode(pt)); });
  }

  // ---------- dữ liệu vùng ----------
  function planZones(p) {
    return p.zones.map(function (z) { return { side: z.side, lo: z.lo, hi: z.hi, main: !!z.main, vai: (z.main ? 'vùng chính' : 'vùng') + (z.grade ? ' · hạng ' + z.grade : '') }; })
      .concat(p.watch.map(function (w) { return { side: null, lo: w.lo, hi: w.hi, vai: 'mức theo dõi' }; }));
  }
  function nhapZones(n) { return n.vung.map(function (z) { return { side: z.chieu, lo: z.lo, hi: z.hi, vai: z.vai || 'vùng' }; }); }
  function byHi(a, b) { return b.hi - a.hi; }
  function row(k, v, cls, sec) {
    var r = el('div', 'row' + (sec ? ' sec' : '')); r.appendChild(el('span', 'k', k));
    if (v != null) { var s = el('span', 'v num' + (cls ? ' ' + cls : ''), v); s.setAttribute('dir', 'ltr'); r.appendChild(s); }
    return r;
  }
  function pxs(txt) { var b = el('b', 'px', txt); b.setAttribute('dir', 'ltr'); return b; }

  // ---------- hero (bản nháp) ----------
  function renderHero(p, n, why) {
    var card = $('#bias-card'), chip = $('#main-chip'), hl = clear($('#headline')), keys = clear($('#hero-keys'));
    card.className = 'hero card ' + (n ? (sideCls(n.phia) || 'neutral') : 'neutral');
    chip.className = 'mchip' + (n && sideCls(n.phia) ? ' ' + sideCls(n.phia) : '');
    function key(k, v) { var d = el('div', 'key'); d.appendChild(el('span', 'k', k)); var s = el('span', 'v num', v); s.setAttribute('dir', 'ltr'); d.appendChild(s); keys.appendChild(d); }
    if (!n) {
      $('#bias-val').textContent = why === 'khoá' ? 'ĐANG KHOÁ' : 'CHƯA CÓ';
      chip.textContent = '';
      $('#bias-sub').textContent = why === 'khoá' ? 'Bản nháp của bản này đã có. Nhập mật khẩu phía trên để xem.' : (why || 'Chưa có bản nháp cho bản này.');
      if (p) { key('Plan đang chạy', SIDE(p.bias)); var m = p.zones.filter(function (z) { return z.main; })[0]; if (m) key('Vùng chính plan', rng(m)); }
      return;
    }
    $('#bias-val').textContent = SIDE(n.phia);
    chip.textContent = n.tinh_huong ? 'Tình huống ' + n.tinh_huong : '';
    var zs = nhapZones(n), same = zs.filter(function (z) { return z.side === n.phia; });
    var near = (same.length ? same : zs).slice().sort(function (a, b) {
      var g = n.gia == null ? 0 : n.gia;
      return Math.min(Math.abs(a.lo - g), Math.abs(a.hi - g)) - Math.min(Math.abs(b.lo - g), Math.abs(b.hi - g));
    })[0];
    var l1 = el('span', 'hl1');
    if (near) { l1.appendChild(document.createTextNode('Vùng gần nhất: ' + sideVi(near.side) + ' ')); l1.appendChild(pxs(rng(near))); l1.appendChild(document.createTextNode(' · ' + near.vai)); }
    else l1.textContent = 'Bản nháp không có vùng';
    hl.appendChild(l1);
    if (n.dich.length) {
      var ul = el('ul', 'hl'), li = el('li'); li.appendChild(document.createTextNode('Đích '));
      n.dich.slice(0, 3).forEach(function (d, i) { if (i) li.appendChild(document.createTextNode(' / ')); li.appendChild(pxs(f(d.muc))); });
      ul.appendChild(li); hl.appendChild(ul);
    }
    $('#bias-sub').textContent = 'Lập lúc ' + (n.lap || '—') + ', giá lúc lập ' + f(n.gia) + (n.moc.length ? '. Mốc đổi: ' + n.moc.map(f).join(' · ') : '') + '.';
    if (near) key('Vùng gần (' + SIDE(near.side) + ')', rng(near));
    key('Đích 1', n.dich.length ? f(n.dich[0].muc) : '—');
    key('So với plan', !p ? 'chưa có plan' : p.bias === n.phia ? 'cùng phía' : 'khác phía');
  }

  // ---------- tab: các vùng / mốc giá / plan ----------
  function renderZones(n, why) {
    var box = clear($('#zones'));
    if (!n) { var c = el('div', 'card nb-card'); c.appendChild(el('p', 'none', why === 'khoá' ? 'Đang khoá – nhập mật khẩu để xem.' : (why || 'chưa có'))); box.appendChild(c); return; }
    var zs = nhapZones(n).sort(byHi);
    if (!zs.length) { var c2 = el('div', 'card nb-card'); c2.appendChild(el('p', 'none', 'không có vùng')); box.appendChild(c2); return; }
    zs.forEach(function (z) {
      var c = el('div', 'card nb-zone'), h = el('div', 'zh');
      h.appendChild(el('span', 'pill ' + sideCls(z.side), z.side === 'SELL' ? 'Vùng bán' : z.side === 'BUY' ? 'Vùng mua' : 'Vùng'));
      var r = el('span', 'zr num', rng(z)); r.setAttribute('dir', 'ltr'); h.appendChild(r);
      h.appendChild(el('span', 'g', z.vai));
      c.appendChild(h);
      if (n.gia != null) c.appendChild(el('p', 's', z.lo > n.gia ? 'Trên giá lúc lập ' + f(z.lo - n.gia) + ' giá' : z.hi < n.gia ? 'Dưới giá lúc lập ' + f(n.gia - z.hi) + ' giá' : 'Giá lúc lập nằm trong vùng'));
      box.appendChild(c);
    });
  }
  function renderLevels(n, why) {
    var box = clear($('#levels'));
    if (!n) { box.appendChild(row(why === 'khoá' ? 'Đang khoá – nhập mật khẩu để xem.' : (why || 'chưa có'), null)); return; }
    box.appendChild(row('Giờ lập', n.lap || '—'));
    box.appendChild(row('Giá lúc lập', f(n.gia), 'main'));
    n.dich.forEach(function (d, i) { box.appendChild(row('Đích T' + (i + 1), f(d.muc))); });
    n.moc.forEach(function (m, i) { box.appendChild(row('Mốc đổi ' + (i + 1), f(m), 'sell')); });
    if (!n.dich.length && !n.moc.length) box.appendChild(row('Đích / mốc đổi', 'không có', 'mut'));
  }
  function renderPlan(p) {
    var box = clear($('#plan'));
    if (!p) { box.appendChild(row('Plan đang chạy', 'chưa có', 'mut')); return; }
    box.appendChild(row('Phía', SIDE(p.bias), sideCls(p.bias)));
    box.appendChild(row('Giờ lập', p.lap || '—'));
    box.appendChild(row('Giá lúc lập', 'file plan không ghi', 'mut'));
    var zs = planZones(p).sort(byHi);
    [['SELL', 'Vùng bán'], ['BUY', 'Vùng mua'], [null, 'Mức theo dõi (không chấm)']].forEach(function (g) {
      var l = zs.filter(function (z) { return z.side === g[0]; });
      box.appendChild(row(g[1], l.length ? null : 'không có', 'mut', true));
      l.forEach(function (z) { box.appendChild(row(z.vai, rng(z), z.main ? 'main' : sideCls(z.side))); });
    });
    box.appendChild(row('Mốc huỷ', p.moc.length ? p.moc.map(f).join(' · ') : '—', 'sell'));
    box.appendChild(row('Đích', p.targets.length ? p.targets.map(rng).join(' · ') : '—'));
  }

  // ---------- thang giá ----------
  var NS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, text) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; }
  function renderLadder(p, n) {
    var box = clear($('#ladder'));
    var L = p ? planZones(p) : [], R = n ? nhapZones(n) : [], all = L.concat(R);
    if (!all.length) { box.appendChild(el('p', 'nb-note', 'chưa có vùng nào')); return; }
    var lo = Math.min.apply(null, all.map(function (z) { return z.lo; })), hi = Math.max.apply(null, all.map(function (z) { return z.hi; }));
    if (n && n.gia != null) { lo = Math.min(lo, n.gia); hi = Math.max(hi, n.gia); }
    var pad = Math.max(4, (hi - lo) * 0.04); lo -= pad; hi += pad;
    var W = 640, H = Math.max(420, Math.min(760, Math.round((hi - lo) * 3.6))), top = 34, bot = 12, X0 = 56, CW = 110, XL = 64, XR = 352;
    var y = function (v) { return top + (hi - v) / (hi - lo) * (H - top - bot); };
    var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Thang giá: plan đang chạy và bản nháp' });
    var step = [5, 10, 20, 25, 50, 100].filter(function (s) { return (hi - lo) / s <= 14; })[0] || 100;
    for (var v = Math.ceil(lo / step) * step; v <= hi; v += step) {
      svg.appendChild(sv('line', { x1: X0, x2: W - 6, y1: y(v), y2: y(v), class: 'grid' }));
      svg.appendChild(sv('text', { x: X0 - 6, y: y(v) + 4, 'text-anchor': 'end', class: 'ax' }, f(v)));
    }
    svg.appendChild(sv('line', { x1: (XL + CW + XR) / 2 + 40, x2: (XL + CW + XR) / 2 + 40, y1: top - 6, y2: H - bot, class: 'mid' }));
    svg.appendChild(sv('text', { x: XL, y: 18, class: 'hd' }, 'Plan đang chạy'));
    svg.appendChild(sv('text', { x: XR, y: 18, class: 'hd' }, n ? 'Bản nháp' : 'Bản nháp (khoá / chưa có)'));
    function col(zs, x0) {
      zs.forEach(function (z) {
        var y1 = y(z.hi), h = Math.max(3, y(z.lo) - y1);
        svg.appendChild(sv('rect', { x: x0, y: y1, width: CW, height: h, rx: 4, class: (z.side === 'SELL' ? 'z-sell' : z.side === 'BUY' ? 'z-buy' : 'z-watch') + (z.main ? ' z-main' : '') }));
        svg.appendChild(sv('text', { x: x0 + CW + 6, y: y1 + h / 2 + 4 }, rng(z)));
      });
    }
    col(L, XL); col(R, XR);
    if (n && n.gia != null) {
      svg.appendChild(sv('line', { x1: X0, x2: W - 6, y1: y(n.gia), y2: y(n.gia), class: 'pxl' }));
      svg.appendChild(sv('text', { x: W - 8, y: y(n.gia) - 6, 'text-anchor': 'end', class: 'pxt' }, 'giá lúc lập ' + f(n.gia)));
    }
    box.appendChild(svg);
  }

  // ---------- lệch ở đâu ----------
  function rel(d, p) {            // d: vùng nháp, p: vùng plan → null | {kind, gap, dlo, dhi}
    if (p.side && p.side !== d.side) return null;
    var ov = Math.min(d.hi, p.hi) - Math.max(d.lo, p.lo), kind = null;
    if (ov > 0) kind = 'trùng';
    else if (Math.abs(ov) < 1e-9 && (d.lo === d.hi || p.lo === p.hi)) kind = 'trùng';
    else if (-ov <= GAP + 1e-9) kind = 'kề';
    return kind ? { kind: kind, gap: ov < 0 ? -ov : 0, dlo: d.lo - p.lo, dhi: d.hi - p.hi } : null;
  }
  function sg(x) { x = Math.round(x * 10) / 10; return (x > 0 ? '+' : x < 0 ? '−' : '') + f(Math.abs(x)); }
  function renderDiff(p, n, why) {
    var box = clear($('#diff'));
    function card(title, wide) { var c = el('div', 'card nb-card' + (wide ? ' wide' : '')); c.appendChild(el('h3', null, title)); box.appendChild(c); return c; }
    function list(c, items) {
      if (!items.length) { c.appendChild(el('p', 'none', 'không có')); return; }
      var ul = el('ul', 'ideas'); items.forEach(function (t) { var li = el('li'); if (t instanceof Node) li.appendChild(t); else li.textContent = t; ul.appendChild(li); }); c.appendChild(ul);
    }
    if (!p || !n) {
      var c0 = card('Chưa so được', true);
      c0.appendChild(el('p', 'none', !p && !n ? 'chưa có cả hai bản' : !p ? 'chưa có plan đang chạy cho bản này' : why === 'khoá' ? 'bản nháp đang khoá – nhập mật khẩu để so' : 'chưa có bản nháp cho bản này'));
      return;
    }
    var same = p.bias === n.phia, c1 = card('1 · Phía', true), pp = el('p');
    pp.appendChild(el('span', 'tag ' + (same ? 'same' : 'diff'), same ? 'giống' : 'khác'));
    pp.appendChild(document.createTextNode('Plan đang chạy: ' + sideVi(p.bias) + ' · Bản nháp: ' + sideVi(n.phia)));
    c1.appendChild(pp);
    var P = planZones(p), N = nhapZones(n), usedP = {}, usedN = {}, pairs = [];
    N.forEach(function (d, i) { P.forEach(function (q, j) { var r = rel(d, q); if (r) { usedN[i] = usedP[j] = 1; pairs.push({ d: d, q: q, r: r }); } }); });
    pairs.sort(function (a, b) { return b.d.hi - a.d.hi; });
    list(card('2 · Vùng trùng hoặc kề', true), pairs.map(function (x) {
      var s = el('span');
      s.appendChild(el('span', 'tag ' + (x.r.kind === 'trùng' ? 'same' : 'diff'), x.r.kind));
      s.appendChild(document.createTextNode('Nháp ' + sideVi(x.d.side) + ' ')); s.appendChild(pxs(rng(x.d)));
      s.appendChild(document.createTextNode(' (' + x.d.vai + ') ↔ plan ')); s.appendChild(pxs(rng(x.q)));
      s.appendChild(document.createTextNode(' (' + x.q.vai + ')' + (x.r.kind === 'kề' ? ', cách ' + f(x.r.gap) + ' giá' : '') + '. Mép dưới nháp lệch ' + sg(x.r.dlo) + ', mép trên lệch ' + sg(x.r.dhi) + ' giá.'));
      return s;
    }));
    list(card('3 · Chỉ plan đang chạy có'), P.filter(function (_, j) { return !usedP[j]; }).sort(byHi).map(function (z) { return (z.side ? sideVi(z.side) + ' ' : '') + rng(z) + ' (' + z.vai + ')'; }));
    list(card('4 · Chỉ bản nháp có'), N.filter(function (_, i) { return !usedN[i]; }).sort(byHi).map(function (z) { return sideVi(z.side) + ' ' + rng(z) + ' (' + z.vai + ')'; }));
    var near = function (a, arr) { return arr.some(function (b) { return Math.abs(a - b) <= 0.05; }); };
    var both = p.moc.filter(function (a) { return near(a, n.moc); }), op = p.moc.filter(function (a) { return !near(a, n.moc); }), on = n.moc.filter(function (a) { return !near(a, p.moc); });
    list(card('5 · Mốc', true), ['Hai bên cùng có: ' + (both.length ? both.map(f).join(' · ') : 'không có'),
      'Chỉ plan đang chạy (mốc huỷ): ' + (op.length ? op.map(f).join(' · ') : 'không có'),
      'Chỉ bản nháp (mốc đổi): ' + (on.length ? on.map(f).join(' · ') : 'không có')]);
  }

  // ---------- điều khiển ----------
  var DAYS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  function dayLabel(d) { var p = d.split('-'), w = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay(); return DAYS[w] + ', ' + p[2] + '/' + p[1]; }
  function item() { var d = $('#s-date').value; return (index.items || []).filter(function (i) { return i.date === d && i.ed === selEd; })[0] || null; }
  function fillEd(keep) {
    var d = $('#s-date').value, have = index.items.filter(function (i) { return i.date === d; }).map(function (i) { return i.ed; }).sort();
    if (!keep || have.indexOf(selEd) < 0) selEd = have.length ? have[have.length - 1] : null;
    Array.prototype.forEach.call(document.querySelectorAll('.ed'), function (b) {
      var e = b.getAttribute('data-ed'), ok = have.indexOf(e) >= 0;
      b.disabled = !ok; b.classList.toggle('on', e === selEd); b.setAttribute('aria-pressed', e === selEd ? 'true' : 'false');
    });
    $('#nb-day').textContent = d ? dayLabel(d) : '—';
  }
  function show() {
    var it = item(), token = cur = {};
    $('#lock').hidden = !!priv || !keyblock; $('#b-lock').hidden = !priv;
    var p = it && it.plan;
    $('#nb-lap').textContent = selEd ? { '0700': 'Bản phiên Á', '1345': 'Bản phiên Âu', '1930': 'Bản phiên Mỹ' }[selEd] || selEd : '—';
    renderPlan(p);
    function done(n, why) { if (cur !== token) return; renderHero(p, n, why); renderZones(n, why); renderLevels(n, why); renderLadder(p, n); renderDiff(p, n, why); }
    $('#state').textContent = keyblock ? '' : 'Chưa cài khoá: bản nháp chưa được đồng bộ.';
    if (!it) return done(null);
    if (!it.nhap) return done(null, 'Chưa có bản nháp cho bản này.');
    if (!keyblock) return done(null, 'Chưa cài khoá – chưa xem được.');
    if (!priv) return done(null, 'khoá');
    getJSON(DATA + it.date + '-' + it.ed + '.json').then(function (o) {
      if (o.kid !== keyblock.kid) throw new Error('kid');
      return decryptFile(o);
    }).then(function (n) { done(n); }).catch(function () { done(null, 'Không giải mã được bản này (có thể được mã hoá bằng khoá cũ).'); });
  }
  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('#ptabs [role="tab"]'));
    function pick(name, focus) {
      tabs.forEach(function (b) {
        var on = b.getAttribute('data-p') === name;
        b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
        document.getElementById('p-' + b.getAttribute('data-p')).classList.toggle('on', on);
        if (on && focus) b.focus();
      });
    }
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b.getAttribute('data-p')); });
      b.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
        e.preventDefault(); pick(tabs[(i + k + tabs.length) % tabs.length].getAttribute('data-p'), true);
      });
    });
    pick('diff');
  }
  function initTheme() {
    var b = $('#theme-btn'); if (!b) return;
    b.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('nc_theme', next); } catch (e) {}
    });
  }

  function start() {
    initTheme(); initTabs();
    getJSON(DATA + 'index.json').then(function (ix) {
      index = ix;
      var dates = []; ix.items.forEach(function (i) { if (dates.indexOf(i.date) < 0) dates.push(i.date); });
      dates.sort().reverse().forEach(function (d) { var o = el('option', null, d.split('-').reverse().join('/')); o.value = d; $('#s-date').appendChild(o); });
      fillEd(false);
      return getJSON(DATA + 'khoa.json').then(function (k) { keyblock = k; }, function () { keyblock = null; });
    }).then(restore).then(function () {
      show();
    }).catch(function () { $('#state').textContent = 'Không tải được dữ liệu.'; });

    $('#s-date').addEventListener('change', function () { fillEd(false); show(); });
    Array.prototype.forEach.call(document.querySelectorAll('.ed'), function (b) {
      b.addEventListener('click', function () { if (b.disabled) return; selEd = b.getAttribute('data-ed'); fillEd(true); show(); });
    });
    $('#b-lock').addEventListener('click', lock);
    $('#f-pw').addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = $('#pw'), msg = $('#pw-msg'), pw = inp.value; inp.value = '';
      msg.hidden = true;
      if (!keyblock || !pw) return;
      $('#state').textContent = 'Đang mở khoá…';
      unlock(pw).then(function () { show(); }, function () { msg.textContent = 'Sai mật khẩu.'; msg.hidden = false; $('#state').textContent = ''; show(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
