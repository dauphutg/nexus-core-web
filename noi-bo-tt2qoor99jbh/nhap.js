// Trang nội bộ: so plan đang chạy với bản nháp. Bản nháp nằm trên máy chủ ở dạng đã mã hoá;
// mật khẩu mở khoá riêng NGAY TRONG TRÌNH DUYỆT (Web Crypto). Không gửi mật khẩu đi đâu, không lưu mật khẩu.
// Khoá đã mở chỉ giữ trong phiên của tab này (sessionStorage) – đóng tab là hết.
(function () {
  'use strict';
  var DATA = '/data/nhap/', GAP = 3, SK = 'nb_khoa';
  var $ = function (s) { return document.querySelector(s); };
  var index = null, keyblock = null, priv = null, cur = null;

  // ---------- tiện ích ----------
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function f(n) { return n == null ? '—' : (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, '').replace('.', ','); }
  function rng(z) { return z.lo === z.hi ? f(z.lo) : f(z.lo) + '–' + f(z.hi); }
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

  // ---------- dựng cột ----------
  function kv(rows) {
    var dl = el('dl', 'kv');
    rows.forEach(function (r) { dl.appendChild(el('dt', null, r[0])); var dd = el('dd'); if (r[1] instanceof Node) dd.appendChild(r[1]); else dd.textContent = r[1]; dl.appendChild(dd); });
    return dl;
  }
  function zoneTable(title, zs) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el('h3', null, title));
    if (!zs.length) { frag.appendChild(el('p', 'none', 'không có')); return frag; }
    var t = el('table'), h = el('tr'); ['Vùng', 'Vai'].forEach(function (x) { h.appendChild(el('th', null, x)); }); t.appendChild(h);
    zs.slice().sort(function (a, b) { return b.hi - a.hi; }).forEach(function (z) {
      var tr = el('tr'); tr.appendChild(el('td', sideCls(z.side), rng(z))); tr.appendChild(el('td', null, z.vai)); t.appendChild(tr);
    });
    frag.appendChild(t); return frag;
  }
  function planZones(p) {
    return p.zones.map(function (z) { return { side: z.side, lo: z.lo, hi: z.hi, vai: (z.main ? 'vùng chính' : 'vùng') + (z.grade ? ' · hạng ' + z.grade : '') }; })
      .concat(p.watch.map(function (w) { return { side: null, lo: w.lo, hi: w.hi, vai: 'mức theo dõi' }; }));
  }
  function nhapZones(n) { return n.vung.map(function (z) { return { side: z.chieu, lo: z.lo, hi: z.hi, vai: z.vai }; }); }

  function renderPlan(p) {
    var b = clear($('#col-plan .body'));
    if (!p) { b.appendChild(el('p', 'none', 'chưa có')); return; }
    var zs = planZones(p);
    b.appendChild(kv([['Phía', el('span', sideCls(p.bias), sideVi(p.bias))], ['Giờ lập', p.lap || '—'], ['Giá lúc lập', 'file plan không ghi'],
      ['Mốc huỷ', p.moc.length ? p.moc.map(f).join(' · ') : '—'], ['Đích', p.targets.length ? p.targets.map(rng).join(' · ') : '—']]));
    b.appendChild(zoneTable('Vùng bán', zs.filter(function (z) { return z.side === 'SELL'; })));
    b.appendChild(zoneTable('Vùng mua', zs.filter(function (z) { return z.side === 'BUY'; })));
    b.appendChild(zoneTable('Mức theo dõi (không chấm)', zs.filter(function (z) { return !z.side; })));
  }
  function renderNhap(n, why) {
    var b = clear($('#col-nhap .body'));
    if (!n) { b.appendChild(el('p', 'none', why || 'chưa có')); return; }
    var zs = nhapZones(n);
    b.appendChild(kv([['Phía', el('span', sideCls(n.phia), sideVi(n.phia))], ['Giờ lập', n.lap || '—'], ['Giá lúc lập', f(n.gia)], ['Tình huống', n.tinh_huong || '—'],
      ['Mốc đổi', n.moc.length ? n.moc.map(f).join(' · ') : '—'], ['Đích', n.dich.length ? n.dich.map(function (d) { return f(d.muc); }).join(' · ') : '—']]));
    b.appendChild(zoneTable('Vùng bán', zs.filter(function (z) { return z.side === 'SELL'; })));
    b.appendChild(zoneTable('Vùng mua', zs.filter(function (z) { return z.side === 'BUY'; })));
  }

  // ---------- thang giá ----------
  var NS = 'http://www.w3.org/2000/svg';
  function sv(tag, attrs, text) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; }
  function renderLadder(p, n) {
    var box = clear($('#ladder'));
    var L = p ? planZones(p) : [], R = n ? nhapZones(n) : [], all = L.concat(R);
    if (!all.length) { box.appendChild(el('p', 'none', 'chưa có vùng nào')); return; }
    var lo = Math.min.apply(null, all.map(function (z) { return z.lo; })), hi = Math.max.apply(null, all.map(function (z) { return z.hi; }));
    if (n && n.gia != null) { lo = Math.min(lo, n.gia); hi = Math.max(hi, n.gia); }
    var pad = Math.max(4, (hi - lo) * 0.04); lo -= pad; hi += pad;
    var W = 760, H = Math.max(420, Math.min(900, Math.round((hi - lo) * 4.2))), top = 28, bot = 14;
    var y = function (v) { return top + (hi - v) / (hi - lo) * (H - top - bot); };
    var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Thang giá so hai bản' });
    var step = [5, 10, 20, 25, 50, 100].filter(function (s) { return (hi - lo) / s <= 14; })[0] || 100;
    for (var v = Math.ceil(lo / step) * step; v <= hi; v += step) {
      svg.appendChild(sv('line', { x1: 70, x2: W - 10, y1: y(v), y2: y(v), class: 'grid' }));
      svg.appendChild(sv('text', { x: 62, y: y(v) + 4, 'text-anchor': 'end', class: 'ax' }, f(v)));
    }
    svg.appendChild(sv('text', { x: 235, y: 16, 'text-anchor': 'middle', class: 'ax' }, 'Plan đang chạy'));
    svg.appendChild(sv('text', { x: 575, y: 16, 'text-anchor': 'middle', class: 'ax' }, 'Bản nháp'));
    function col(zs, x0) {
      zs.forEach(function (z) {
        var y1 = y(z.hi), h = Math.max(3, y(z.lo) - y1);
        svg.appendChild(sv('rect', { x: x0, y: y1, width: 150, height: h, rx: 3, class: z.side === 'SELL' ? 'z-sell' : z.side === 'BUY' ? 'z-buy' : 'z-watch' }));
        svg.appendChild(sv('text', { x: x0 + 158, y: y1 + h / 2 + 4 }, rng(z) + ' · ' + z.vai));
      });
    }
    col(L, 80); col(R, 420);
    if (n && n.gia != null) {
      svg.appendChild(sv('line', { x1: 70, x2: W - 10, y1: y(n.gia), y2: y(n.gia), class: 'px' }));
      svg.appendChild(sv('text', { x: W - 12, y: y(n.gia) - 5, 'text-anchor': 'end', class: 'pxt' }, 'giá lúc lập ' + f(n.gia)));
    }
    box.appendChild(svg);
  }

  // ---------- lệch ở đâu ----------
  function rel(d, p) {            // d: vùng nháp, p: vùng plan → null | {kind, dlo, dhi}
    if (p.side && p.side !== d.side) return null;
    var ov = Math.min(d.hi, p.hi) - Math.max(d.lo, p.lo), kind = null;
    if (ov > 0) kind = 'trùng';
    else if (Math.abs(ov) < 1e-9 && (d.lo === d.hi || p.lo === p.hi)) kind = 'trùng';
    else if (-ov <= GAP + 1e-9) kind = 'kề';
    return kind ? { kind: kind, gap: ov < 0 ? -ov : 0, dlo: d.lo - p.lo, dhi: d.hi - p.hi } : null;
  }
  function sg(x) { x = Math.round(x * 10) / 10; return (x > 0 ? '+' : x < 0 ? '−' : '') + f(Math.abs(x)); }
  function renderDiff(p, n) {
    var box = clear($('#diff'));
    if (!p || !n) { box.appendChild(el('p', 'none', !p && !n ? 'chưa có cả hai bản' : !p ? 'chưa có plan đang chạy cho bản này – không so được' : 'chưa có bản nháp (hoặc chưa mở khoá) – không so được')); return; }
    function head(t) { box.appendChild(el('h3', null, t)); }
    function list(items) { if (!items.length) { box.appendChild(el('p', 'none', 'không có')); return; } var ul = el('ul'); items.forEach(function (t) { ul.appendChild(el('li', null, t)); }); box.appendChild(ul); }
    head('1. Phía');
    var same = p.bias === n.phia, pp = el('p');
    pp.appendChild(el('span', 'tag ' + (same ? 'same' : 'diff'), same ? 'giống' : 'khác'));
    pp.appendChild(document.createTextNode(' plan đang chạy: ' + sideVi(p.bias) + ' · bản nháp: ' + sideVi(n.phia)));
    box.appendChild(pp);
    var P = planZones(p), N = nhapZones(n), usedP = {}, usedN = {}, pairs = [];
    N.forEach(function (d, i) { P.forEach(function (q, j) { var r = rel(d, q); if (r) { usedN[i] = usedP[j] = 1; pairs.push({ d: d, q: q, r: r }); } }); });
    head('2. Vùng trùng hoặc kề');
    list(pairs.map(function (x) {
      return 'Nháp ' + sideVi(x.d.side) + ' ' + rng(x.d) + ' (' + x.d.vai + ') ' + x.r.kind + ' ' + rng(x.q) + ' của plan (' + x.q.vai + ')' +
        (x.r.kind === 'kề' ? ', cách ' + f(x.r.gap) + ' giá' : '') + ' — mép dưới nháp lệch ' + sg(x.r.dlo) + ', mép trên lệch ' + sg(x.r.dhi) + ' giá';
    }));
    head('3. Vùng chỉ plan đang chạy có');
    list(P.filter(function (_, j) { return !usedP[j]; }).sort(function (a, b) { return b.hi - a.hi; }).map(function (z) { return (z.side ? sideVi(z.side) + ' ' : '') + rng(z) + ' (' + z.vai + ')'; }));
    head('4. Vùng chỉ bản nháp có');
    list(N.filter(function (_, i) { return !usedN[i]; }).sort(function (a, b) { return b.hi - a.hi; }).map(function (z) { return sideVi(z.side) + ' ' + rng(z) + ' (' + z.vai + ')'; }));
    head('5. Mốc');
    var near = function (a, arr) { return arr.some(function (b) { return Math.abs(a - b) <= 0.05; }); };
    var both = p.moc.filter(function (a) { return near(a, n.moc); }), op = p.moc.filter(function (a) { return !near(a, n.moc); }), on = n.moc.filter(function (a) { return !near(a, p.moc); });
    list(['Hai bên cùng có: ' + (both.length ? both.map(f).join(' · ') : 'không có'),
      'Chỉ plan đang chạy (mốc huỷ): ' + (op.length ? op.map(f).join(' · ') : 'không có'),
      'Chỉ bản nháp (mốc đổi): ' + (on.length ? on.map(f).join(' · ') : 'không có')]);
  }

  // ---------- điều khiển ----------
  function item() { var d = $('#s-date').value, e = $('#s-ed').value; return (index.items || []).filter(function (i) { return i.date === d && i.ed === e; })[0] || null; }
  function fillEd() {
    var d = $('#s-date').value, s = clear($('#s-ed')), names = { '0700': 'sáng', '1345': '13:45', '1930': 'tối' };
    index.items.filter(function (i) { return i.date === d; }).sort(function (a, b) { return a.ed < b.ed ? 1 : -1; }).forEach(function (i) { var o = el('option', null, names[i.ed] || i.ed); o.value = i.ed; s.appendChild(o); });
  }
  function show() {
    var it = item(), token = cur = {};
    $('#lock').hidden = !!priv || !keyblock; $('#b-lock').hidden = !priv;
    var p = it && it.plan;
    renderPlan(p);
    function done(n, why) { if (cur !== token) return; renderNhap(n, why); renderLadder(p, n); renderDiff(p, n); }
    $('#state').textContent = keyblock ? '' : 'Chưa cài khoá: bản nháp chưa được đồng bộ.';
    if (!it) return done(null);
    if (!it.nhap) return done(null, 'chưa có');
    if (!keyblock) return done(null, 'chưa cài khoá – chưa xem được');
    if (!priv) return done(null, 'đã có, đang khoá – nhập mật khẩu để xem');
    getJSON(DATA + it.date + '-' + it.ed + '.json').then(function (o) {
      if (o.kid !== keyblock.kid) throw new Error('kid');
      return decryptFile(o);
    }).then(function (n) { done(n); }).catch(function () { done(null, 'không giải mã được bản này (có thể được mã hoá bằng khoá cũ)'); });
  }

  function start() {
    getJSON(DATA + 'index.json').then(function (ix) {
      index = ix;
      var dates = []; ix.items.forEach(function (i) { if (dates.indexOf(i.date) < 0) dates.push(i.date); });
      dates.sort().reverse().forEach(function (d) { var o = el('option', null, d.split('-').reverse().join('/')); o.value = d; $('#s-date').appendChild(o); });
      fillEd();
      return getJSON(DATA + 'khoa.json').then(function (k) { keyblock = k; }, function () { keyblock = null; });
    }).then(restore).then(function () {
      if (!keyblock) $('#state').textContent = 'Chưa cài khoá: bản nháp chưa được đồng bộ.';
      show();
    }).catch(function () { $('#state').textContent = 'Không tải được dữ liệu.'; });

    $('#s-date').addEventListener('change', function () { fillEd(); show(); });
    $('#s-ed').addEventListener('change', show);
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
