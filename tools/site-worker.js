// Worker "nexus-site": serves ./public (static assets) and, for the two entry pages only
// (/ and /today/), sends a first-time human visitor to their language by IP country.
// - A language the visitor picked themselves (cookie nc_lang, set by app.js) always wins.
// - Search engines / link-preview bots are never redirected (every language stays indexable).
// - Countries without a translation stay on English (the default).
const AR = new Set(['SA','AE','QA','KW','BH','OM','EG','JO','LB','IQ','MA','DZ','TN','LY','SD','YE','SY','PS','MR']);
const ZH = new Set(['TW','HK','MO']);
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|whatsapp|telegram|discord|skype|linkedin|pinterest|lighthouse|headless|bingpreview|google-|curl|wget|python|httpclient/i;

function langFor(country) {
  if (country === 'VN') return 'vi';
  if (AR.has(country)) return 'ar';
  if (ZH.has(country)) return 'zh-hant';
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/today/' || url.pathname === '/today')) {
      const cookie = request.headers.get('Cookie') || '';
      const ua = request.headers.get('User-Agent') || '';
      const picked = /(?:^|;\s*)nc_lang=/.test(cookie);
      const optOut = url.searchParams.has('lang') || url.searchParams.has('nc_lang');
      const lang = (!picked && !optOut && ua && !BOT.test(ua)) ? langFor((request.cf && request.cf.country) || '') : null;
      if (lang) {
        const path = url.pathname === '/' ? '/' : '/today/';
        return new Response(null, {
          status: 302,
          headers: {
            'Location': `/${lang}${path}${url.search}`,
            'Cache-Control': 'private, no-store',
            'Vary': 'Cookie, User-Agent'
          }
        });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
