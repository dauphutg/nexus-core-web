// NEXUS CORE – new-plan push notifications (Cloudflare Worker, free plan).
//
// What it does
//   • GET  /key          → public VAPID key (generated once, kept in KV)
//   • POST /subscribe    → store a browser push subscription  {sub, lang}
//   • POST /unsubscribe  → remove it                          {endpoint}
//   • POST /waitlist     → store a waitlist email             {email, lang, src, page}
//       (read the list in the Cloudflare dashboard: KV namespace → keys starting with  w: )
//   • POST /hit          → count one visit per browser session          {src, page, lang, app}
//       (counts only – no IP, no cookie id; one KV record per day  c:<yyyy-mm-dd>, Vietnam date)
//   • GET  /stats?days=30 with header  X-Stats-Key: <key>  → totals only (never an email or endpoint):
//       visits by day / source / language / page, alert sign-ups and emails by day / source / language / page.
//       Only the SHA-256 of the key is in this file; the key itself is kept privately by the owner.
//   • every 2 minutes (Cron Trigger): reads https://nexuscore.trade/data/latest.json;
//     when a new plan edition appears it sends one notification to every subscriber.
//
// Setup (Cloudflare dashboard): KV namespace bound as  SUBS , Cron Trigger  */2 * * * * ,
// custom domain  push.nexuscore.trade , and route  nexuscore.trade/api/*  (same-domain address:
// any phone that can open the site can reach the service). No secrets to copy: the signing key is created on first run.

const SITE = 'https://nexuscore.trade';
const BATCH = 40;                       // pushes per run (free plan allows 50 outgoing requests)
const MAX_AGE_H = 6;                    // never announce a plan older than this
const PUSH_HOST = /(^|\.)fcm\.googleapis\.com$|\.push\.apple\.com$|^updates\.push\.services\.mozilla\.com$|\.notify\.windows\.com$/;

const TXT = {
  en: { ed: { '0700': 'Asia plan', '1345': 'Pre-London update', '1930': 'Pre-New York plan' }, plan: 'Gold plan',
        b: { SELL: 'Bias SELL', BUY: 'Bias BUY', TWO_WAY: 'Two-way', STAND_ASIDE: 'Stand aside' }, lean: 'leaning', s: { SELL: 'SELL', BUY: 'BUY' }, zone: 'Main zone' },
  ar: { ed: { '0700': 'خطة آسيا', '1345': 'تحديث ما قبل لندن', '1930': 'خطة ما قبل نيويورك' }, plan: 'خطة الذهب',
        b: { SELL: 'الاتجاه بيع', BUY: 'الاتجاه شراء', TWO_WAY: 'اتجاهان', STAND_ASIDE: 'خارج السوق' }, lean: 'ميل إلى', s: { SELL: 'بيع', BUY: 'شراء' }, zone: 'المنطقة الرئيسية' },
  vi: { ed: { '0700': 'Plan phiên Á', '1345': 'Cập nhật trước phiên Âu', '1930': 'Plan trước phiên Mỹ' }, plan: 'Plan vàng',
        b: { SELL: 'Xu hướng BÁN', BUY: 'Xu hướng MUA', TWO_WAY: '2 chiều', STAND_ASIDE: 'Đứng ngoài' }, lean: 'nghiêng', s: { SELL: 'BÁN', BUY: 'MUA' }, zone: 'Vùng chính' },
  'zh-hant': { ed: { '0700': '亞洲盤計畫', '1345': '倫敦盤前更新', '1930': '紐約盤前計畫' }, plan: '黃金計畫',
        b: { SELL: '方向：偏空', BUY: '方向：偏多', TWO_WAY: '雙向', STAND_ASIDE: '觀望' }, lean: '傾向', s: { SELL: '偏空', BUY: '偏多' }, zone: '主要區域' },
};
const LANGS = ['en', 'ar', 'vi', 'zh-hant'];
const STATS_HASH = '9033bf708eb416a76841b768ddaf2ea2ef8e0b22a6f8c93a35a3e04568547b00';
const HIT_CAP = 900;                    // KV free plan: 1,000 writes a day – stop counting visits before that
const vnDate = (ms) => new Date((ms || Date.now()) + 7 * 3600e3).toISOString().slice(0, 10);
const pageGroup = (pg) => { const m = /^\/(?:(ar|vi|zh-hant|en)\/)?([a-z-]+)?/.exec(pg || '/'); return '/' + (m && m[1] ? m[1] + '/' : '') + (m && m[2] ? m[2] + '/' : ''); };
const bump = (o, k) => { o[k] = (o[k] || 0) + 1; };
const HOME = { en: '/', ar: '/ar/', vi: '/vi/', 'zh-hant': '/zh-hant/' };

const cleanSrc = (s) => { s = String(s || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 40); return s || 'direct'; };
const cleanPage = (s) => { s = String(s || '/'); return /^\/[A-Za-z0-9\/_.-]{0,80}$/.test(s) ? s : '/'; };
const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(String(s).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

function cors(extra) {
  return Object.assign({ 'Access-Control-Allow-Origin': SITE, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' }, extra || {});
}
const reply = (status, body, type) => new Response(body, { status, headers: cors({ 'Content-Type': type || 'text/plain; charset=utf-8' }) });

async function vapid(env) {
  let v = await env.SUBS.get('vapid', 'json');
  if (!v) {
    const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    v = { jwk: await crypto.subtle.exportKey('jwk', kp.privateKey), pub: b64u(await crypto.subtle.exportKey('raw', kp.publicKey)) };
    await env.SUBS.put('vapid', JSON.stringify(v));
  }
  return v;
}

async function vapidAuth(v, endpoint, cache) {
  const aud = new URL(endpoint).origin;
  if (!cache[aud]) {
    const key = await crypto.subtle.importKey('jwk', v.jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
    const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
    const body = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SITE })));
    const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(head + '.' + body));
    cache[aud] = 'vapid t=' + head + '.' + body + '.' + b64u(sig) + ', k=' + v.pub;
  }
  return cache[aud];
}

// RFC 8291 (aes128gcm) message encryption for Web Push
async function encrypt(p256dh, auth, plaintext) {
  const uaPub = unb64u(p256dh), authSecret = unb64u(auth);
  const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, eph.privateKey, 256);
  const hkdf = async (salt, ikm, info, len) => new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info }, await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']), len * 8));
  const ikm = await hkdf(authSecret, shared, cat(enc.encode('WebPush: info\0'), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(enc.encode(plaintext), new Uint8Array([2]))));
  return cat(salt, new Uint8Array([0, 0, 16, 0]), new Uint8Array([asPub.length]), asPub, ct);
}

async function pushOne(v, s, payload, cache) {
  const body = await encrypt(s.p, s.a, JSON.stringify(payload));
  const r = await fetch(s.e, { method: 'POST', body, headers: {
    'Authorization': await vapidAuth(v, s.e, cache), 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream',
    'TTL': '21600', 'Urgency': 'normal', 'Topic': 'plan' } });
  return r.status;
}

function rng(lo, hi, vi) { const f = (n) => (vi ? String(n).replace('.', ',') : String(n)); return lo === hi ? f(lo) : f(lo) + '–' + f(hi); }
function buildPayloads(p) {
  const out = {};
  for (const lang of LANGS) {
    const t = TXT[lang];
    let bias = t.b[p.bias] || '';
    if (p.bias === 'TWO_WAY' && p.lean && t.s[p.lean]) bias += ' · ' + t.lean + ' ' + t.s[p.lean];
    const parts = [bias];
    if (p.main_zone) parts.push(t.zone + ' ' + (t.s[p.main_zone.side] || '') + ' ' + rng(p.main_zone.lo, p.main_zone.hi, lang === 'vi'));
    const body = parts.filter(Boolean).join(' — ');
    out[lang] = { title: t.plan + ' · ' + (t.ed[p.edition] || ''), body, url: HOME[lang], tag: 'plan', lang: lang === 'zh-hant' ? 'zh-Hant' : lang, dir: lang === 'ar' ? 'rtl' : 'ltr' };
  }
  return out;
}

async function sendBatch(env, state) {
  const v = await vapid(env), cache = {};
  const page = await env.SUBS.list({ prefix: 's:', limit: BATCH, cursor: state.job.cursor || undefined });
  await Promise.all(page.keys.map(async (k) => {
    try {
      const s = await env.SUBS.get(k.name, 'json');
      if (!s) return;
      const st = await pushOne(v, s, state.job.payloads[s.l] || state.job.payloads.en, cache);
      if (st === 404 || st === 410) await env.SUBS.delete(k.name);   // subscription expired or revoked
    } catch (e) { /* one bad subscription must not stop the batch */ }
  }));
  state.job = page.list_complete ? null : Object.assign(state.job, { cursor: page.cursor });
  await env.SUBS.put('state', JSON.stringify(state));
}

async function tick(env) {
  const state = (await env.SUBS.get('state', 'json')) || { last: null, job: null };
  if (state.job) return sendBatch(env, state);
  const r = await fetch(SITE + '/data/latest.json?t=' + Date.now(), { cf: { cacheTtl: 0 } });
  if (!r.ok) return;
  const p = await r.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date || '') || !TXT.en.ed[p.edition]) return;
  const id = p.date + '|' + p.edition;
  if (id === state.last) return;
  const ageH = (Date.now() - Date.parse(String(p.updated_vn).replace(' ', 'T') + ':00+07:00')) / 36e5;
  const first = state.last === null;
  state.last = id;
  if (first || !(ageH >= -1 && ageH <= MAX_AGE_H)) {   // first run, or a stale plan: remember it, send nothing
    return env.SUBS.put('state', JSON.stringify(state));
  }
  state.job = { payloads: buildPayloads(p), cursor: null };
  return sendBatch(env, state);
}

async function stats(env, days) {
  const out = { generated: new Date().toISOString(), days, visits: { total: 0, app: 0, by_day: {}, src: {}, lang: {}, pg: {} } };
  for (let i = days - 1; i >= 0; i--) {
    const d = vnDate(Date.now() - i * 864e5), c = await env.SUBS.get('c:' + d, 'json');
    if (!c) continue;
    out.visits.by_day[d] = c.n; out.visits.total += c.n; out.visits.app += c.app || 0;
    for (const f of ['src', 'lang', 'pg']) for (const [kk, v] of Object.entries(c[f] || {})) out.visits[f][kk] = (out.visits[f][kk] || 0) + v;
  }
  const since = vnDate(Date.now() - (days - 1) * 864e5);
  const group = async (prefix) => {
    const g = { total: 0, new_in_period: 0, by_day: {}, src: {}, lang: {}, pg: {} };
    let cursor;
    do {
      const page = await env.SUBS.list({ prefix, cursor, limit: 1000 });
      for (const key of page.keys) {
        const r = await env.SUBS.get(key.name, 'json');
        if (!r) continue;
        g.total++;
        const d = r.t ? vnDate(Date.parse(r.t)) : 'unknown';
        if (d >= since) { g.new_in_period++; bump(g.by_day, d); }
        bump(g.src, r.src || 'unknown'); bump(g.lang, r.l || 'en'); bump(g.pg, pageGroup(r.pg || '/'));
      }
      cursor = page.list_complete ? null : page.cursor;
    } while (cursor && g.total < 5000);
    return g;
  };
  out.alerts = await group('s:');            // active app-alert subscriptions
  const em = await group('w:');              // emails (plan by email + Signals waitlist) – counts only
  out.emails = em;
  out.signals_waitlist = Object.entries(em.pg).filter(([kk]) => /signals\/$/.test(kk)).reduce((n, [, v]) => n + v, 0);
  return out;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.hostname === 'nexuscore.trade' || url.hostname === 'www.nexuscore.trade') {
      // reached through the route nexuscore.trade/api/* – anything else on the site is not ours to answer
      if (!url.pathname.startsWith('/api/')) return fetch(req);
      url.pathname = url.pathname.slice(4);
    }
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
    try {
      if (req.method === 'GET' && url.pathname === '/key') return reply(200, (await vapid(env)).pub);
      if (req.method === 'GET' && url.pathname === '/') return reply(200, 'NEXUS CORE push: ok');
      if (req.method === 'POST' && (url.pathname === '/subscribe' || url.pathname === '/unsubscribe')) {
        if (req.headers.get('Origin') !== SITE) return reply(403, 'forbidden');
        const raw = await req.text();
        if (raw.length > 4000) return reply(413, 'too large');
        const d = JSON.parse(raw);
        const endpoint = String((d.sub && d.sub.endpoint) || d.endpoint || '');
        let u; try { u = new URL(endpoint); } catch (e) { return reply(400, 'bad endpoint'); }
        if (u.protocol !== 'https:' || !PUSH_HOST.test(u.hostname) || endpoint.length > 1000) return reply(400, 'bad endpoint');
        const id = 's:' + hex(await crypto.subtle.digest('SHA-256', enc.encode(endpoint)));
        if (url.pathname === '/unsubscribe') { await env.SUBS.delete(id); return reply(200, 'ok'); }
        const k = (d.sub && d.sub.keys) || {};
        if (!/^[A-Za-z0-9_-]{80,100}$/.test(k.p256dh || '') || !/^[A-Za-z0-9_-]{16,32}$/.test(k.auth || '')) return reply(400, 'bad keys');
        const lang = LANGS.includes(d.lang) ? d.lang : 'en';
        const old = await env.SUBS.get(id, 'json');   // keep where the visitor first came from
        await env.SUBS.put(id, JSON.stringify({ e: endpoint, p: k.p256dh, a: k.auth, l: lang,
          src: (old && old.src) || cleanSrc(d.src), pg: (old && old.pg) || cleanPage(d.page), t: (old && old.t) || new Date().toISOString() }));
        return reply(201, 'ok');
      }
      if (req.method === 'POST' && url.pathname === '/hit') {
        if (req.headers.get('Origin') !== SITE) return reply(403, 'forbidden');
        const raw = await req.text();
        if (raw.length > 500) return reply(413, 'too large');
        const d = JSON.parse(raw), day = 'c:' + vnDate();
        const c = (await env.SUBS.get(day, 'json')) || { n: 0, app: 0, src: {}, lang: {}, pg: {} };
        if (c.n >= HIT_CAP) return new Response(null, { status: 204, headers: cors() });
        c.n++; if (d.app) c.app++;
        bump(c.src, cleanSrc(d.src)); bump(c.lang, LANGS.includes(d.lang) ? d.lang : 'en'); bump(c.pg, pageGroup(cleanPage(d.page)));
        await env.SUBS.put(day, JSON.stringify(c), { expirationTtl: 400 * 86400 });
        return new Response(null, { status: 204, headers: cors() });
      }
      if (req.method === 'GET' && url.pathname === '/stats') {
        const k = req.headers.get('X-Stats-Key') || '';
        if (!k || hex(await crypto.subtle.digest('SHA-256', enc.encode(k))) !== STATS_HASH) return reply(403, 'forbidden');
        return reply(200, JSON.stringify(await stats(env, Math.min(90, Math.max(1, parseInt(url.searchParams.get('days') || '30', 10) || 30)))), 'application/json');
      }
      if (req.method === 'POST' && url.pathname === '/waitlist') {
        if (req.headers.get('Origin') !== SITE) return reply(403, 'forbidden');
        const raw = await req.text();
        if (raw.length > 1000) return reply(413, 'too large');
        const d = JSON.parse(raw);
        if (d.website) return reply(200, 'ok');                       // hidden field: only bots fill it in
        const email = String(d.email || '').trim().toLowerCase();
        if (email.length > 254 || !/^[a-z0-9._%+-]{1,64}@[a-z0-9.-]{1,180}\.[a-z]{2,24}$/.test(email)) return reply(400, 'bad email');
        const key = 'w:' + email;
        if (!(await env.SUBS.get(key))) {
          await env.SUBS.put(key, JSON.stringify({ l: LANGS.includes(d.lang) ? d.lang : 'en', t: new Date().toISOString(), src: cleanSrc(d.src), pg: cleanPage(d.page) }));
        }
        return reply(201, 'ok');
      }
      return reply(404, 'not found');
    } catch (e) {
      return reply(400, 'bad request');
    }
  },
  async scheduled(event, env, ctx) { ctx.waitUntil(tick(env)); },
};
