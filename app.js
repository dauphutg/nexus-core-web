(function () {
  'use strict';

  var T = {
    en: {
      skip: 'Skip to content', to_light: 'Switch to light theme', to_dark: 'Switch to dark theme', loading: 'Loading plan…', tab_plan: 'Daily plan', tab_signals: 'Signals', tab_history: 'Track record',
      lede: 'AI-built game plan for gold (XAUUSD): key zones, scenarios and the level that proves the view wrong — refreshed before Asia, London and New York.',
      bias: 'Bias', levels: 'Key levels', scenarios: 'Scenarios', zones: 'Zones on the chart', news: 'Economic calendar',
      main_zone: 'Main zone', invalid: 'View is wrong if', range: 'Expected range', target: 'Target',
      plan_of: 'Gold plan', ed: { '0700': 'Asia plan', '1345': 'Pre-London update', '1930': 'Pre-New York plan' },
      ed_short: { '0700': 'Asia', '1345': 'London', '1930': 'New York' },
      updated: 'updated', next: 'Next update', main: 'Main', alt: 'Alternate', key: 'Key zone',
      tz: 'All times shown in your local time', your_time: 'your time',
      active: 'Active', closed: 'Closed',
      signals_sub: 'Every signal is tied to the plan in force and posted here and on Telegram at the same moment.',
      no_active: 'No live signal right now — the next one lands here when price reaches a plan zone.',
      no_closed: 'No closed signals yet.', entry: 'Entry', sl: 'Stop', tp: 'Target',
      tg_title: 'Get every plan and signal on Telegram', tg_sub: 'Free channel · no sign-up',
      history_sub: 'Every plan is graded in public at the daily close — right or wrong, it stays on the record.',
      h_days: 'Days graded', h_right: 'Direction right', h_r: 'Total R', pending: 'Pending',
      right: 'Right', wrong: 'Wrong', void: 'Void / stood aside',
      SELL: 'SELL', BUY: 'BUY', TWO_WAY: 'TWO-WAY', STAND_ASIDE: 'STAND ASIDE', lean: 'leaning',
      live: 'LIVE', stale: 'LAST PLAN', err: 'Could not load data. Please reload the page.',
      nt_title: 'New-plan alerts', nt_sub: 'Get a notification on this device the moment a new plan is published.', nt_on_btn: 'Turn on alerts', nt_off_btn: 'Turn off alerts', nt_on: 'Alerts are on for this device.', nt_denied: 'Notifications are blocked for this site. Allow them in your browser settings to turn alerts on.', nt_ios: 'On iPhone: tap the Share button, choose “Add to Home Screen”, then open NEXUS CORE from your home screen and turn on alerts.', nt_err: 'Could not change alerts. Please try again.',
      wl_title: 'Email alerts & waitlist', wl_sub: 'Get new plans by email and be first to get the NEXUS CORE app. No spam, unsubscribe any time.', wl_label: 'Email address', wl_btn: 'Join waitlist', wl_ok: 'You are on the list.', wl_bad: 'Please enter a valid email address.', wl_err: 'Could not sign you up. Please try again.', wl_privacy: 'We use your email only for NEXUS CORE updates and never share it. You can ask to be removed at any time.',
      nt_old_ios: 'Alerts need iOS 16.4 or later. Update your iPhone in Settings → General → Software Update, then turn alerts on here.', nt_unsup: 'This browser cannot show alerts. Open the site in Chrome, Edge, Firefox or Safari — or follow the Telegram channel.',
      nt_retry: 'Connecting… please tap the button again.',
      nt_alt: 'Works on every phone, including older iPhones:', nt_tg: 'Alerts on Telegram', nt_mail: 'Alerts by email',
      risk_title: 'Risk warning',
      disclaimer: 'Market analysis for information only — not investment advice or a solicitation to trade. Leveraged products such as gold CFDs carry a high risk of losing money rapidly. Past performance does not guarantee future results. Trade only with money you can afford to lose.'
    },
    ar: {
      skip: 'انتقل إلى المحتوى', to_light: 'التبديل إلى الوضع الفاتح', to_dark: 'التبديل إلى الوضع الداكن', loading: 'جارٍ تحميل الخطة…', tab_plan: 'الخطة اليومية', tab_signals: 'الإشارات', tab_history: 'سجل النتائج',
      lede: 'خطة للذهب (XAUUSD) مبنية بالذكاء الاصطناعي: مناطق رئيسية، سيناريوهات، والمستوى الذي يُلغي الفكرة — تُحدَّث قبل جلسات آسيا ولندن ونيويورك.',
      bias: 'الاتجاه', levels: 'المستويات الرئيسية', scenarios: 'السيناريوهات', zones: 'المناطق على الرسم', news: 'المفكرة الاقتصادية',
      main_zone: 'المنطقة الرئيسية', invalid: 'تُلغى الفكرة إذا', range: 'النطاق المتوقع', target: 'الهدف',
      plan_of: 'خطة الذهب', ed: { '0700': 'خطة آسيا', '1345': 'تحديث ما قبل لندن', '1930': 'خطة ما قبل نيويورك' },
      ed_short: { '0700': 'آسيا', '1345': 'لندن', '1930': 'نيويورك' },
      updated: 'آخر تحديث', next: 'التحديث القادم', main: 'الرئيسي', alt: 'البديل', key: 'منطقة رئيسية',
      tz: 'جميع الأوقات بتوقيتك المحلي', your_time: 'بتوقيتك',
      active: 'نشطة', closed: 'مغلقة',
      signals_sub: 'كل إشارة مرتبطة بالخطة السارية وتُنشر هنا وعلى تيليجرام في اللحظة نفسها.',
      no_active: 'لا توجد إشارة نشطة الآن — ستظهر الإشارة التالية هنا عند وصول السعر إلى منطقة الخطة.',
      no_closed: 'لا توجد إشارات مغلقة بعد.', entry: 'الدخول', sl: 'الوقف', tp: 'الهدف',
      tg_title: 'استلم كل خطة وإشارة عبر تيليجرام', tg_sub: 'قناة مجانية · بدون تسجيل',
      history_sub: 'تُقيَّم كل خطة علنًا عند الإغلاق اليومي — صحيحة كانت أم خاطئة، تبقى في السجل.',
      h_days: 'أيام مُقيَّمة', h_right: 'اتجاه صحيح', h_r: 'مجموع R', pending: 'قيد التقييم',
      right: 'صحيحة', wrong: 'خاطئة', void: 'ملغاة / خارج السوق',
      SELL: 'بيع', BUY: 'شراء', TWO_WAY: 'اتجاهان', STAND_ASIDE: 'خارج السوق', lean: 'ميل إلى',
      live: 'مباشر', stale: 'آخر خطة', err: 'تعذّر تحميل البيانات. يرجى إعادة تحميل الصفحة.',
      nt_title: 'تنبيهات الخطة الجديدة', nt_sub: 'استلم إشعارًا على هذا الجهاز فور نشر خطة جديدة.', nt_on_btn: 'تفعيل التنبيهات', nt_off_btn: 'إيقاف التنبيهات', nt_on: 'التنبيهات مفعّلة على هذا الجهاز.', nt_denied: 'الإشعارات محظورة لهذا الموقع. اسمح بها من إعدادات المتصفح لتفعيل التنبيهات.', nt_ios: 'على الآيفون: اضغط زر المشاركة، اختر «إضافة إلى الشاشة الرئيسية»، ثم افتح NEXUS CORE من الشاشة الرئيسية وفعّل التنبيهات.', nt_err: 'تعذّر تغيير التنبيهات. حاول مرة أخرى.',
      wl_title: 'تنبيهات البريد وقائمة الانتظار', wl_sub: 'استلم الخطط الجديدة عبر البريد وكن أول من يحصل على تطبيق NEXUS CORE. بلا إزعاج، ويمكنك إلغاء الاشتراك متى شئت.', wl_label: 'البريد الإلكتروني', wl_btn: 'انضم الآن', wl_ok: 'تم تسجيلك في القائمة.', wl_bad: 'يرجى إدخال بريد إلكتروني صحيح.', wl_err: 'تعذّر التسجيل. حاول مرة أخرى.', wl_privacy: 'نستخدم بريدك لتحديثات NEXUS CORE فقط ولا نشاركه مع أحد. يمكنك طلب الحذف في أي وقت.',
      nt_old_ios: 'التنبيهات تتطلب iOS 16.4 أو أحدث. حدّث الآيفون من الإعدادات ← عام ← تحديث البرامج ثم فعّل التنبيهات هنا.', nt_unsup: 'هذا المتصفح لا يدعم التنبيهات. افتح الموقع في Chrome أو Edge أو Firefox أو Safari — أو تابع قناة تيليجرام.',
      nt_retry: 'جارٍ الاتصال… اضغط الزر مرة أخرى.',
      nt_alt: 'تعمل على كل الهواتف، بما فيها أجهزة الآيفون القديمة:', nt_tg: 'تنبيهات عبر تيليجرام', nt_mail: 'تنبيهات بالبريد',
      risk_title: 'تحذير المخاطر',
      disclaimer: 'تحليل للسوق لأغراض المعلومات فقط — ليس نصيحة استثمارية ولا دعوة للتداول. المنتجات ذات الرافعة المالية مثل عقود الذهب تنطوي على مخاطر عالية بخسارة الأموال سريعًا. الأداء السابق لا يضمن النتائج المستقبلية. تداول فقط بما تستطيع تحمّل خسارته.'
    },
    vi: {
      skip: 'Tới nội dung', to_light: 'Chuyển sang giao diện sáng', to_dark: 'Chuyển sang giao diện tối', loading: 'Đang tải plan…', tab_plan: 'Plan ngày', tab_signals: 'Signal', tab_history: 'Lịch sử',
      lede: 'Plan vàng (XAUUSD) do AI lập: vùng giá chính, kịch bản và mốc cho biết nhận định sai — cập nhật trước phiên Á, Âu và Mỹ.',
      bias: 'Xu hướng', levels: 'Mức giá chính', scenarios: 'Kịch bản', zones: 'Các vùng trên chart', news: 'Lịch tin',
      main_zone: 'Vùng chính', invalid: 'Sai khi', range: 'Vùng giá dự kiến', target: 'Mục tiêu',
      plan_of: 'Plan vàng', ed: { '0700': 'Plan phiên Á', '1345': 'Cập nhật trước phiên Âu', '1930': 'Plan trước phiên Mỹ' },
      ed_short: { '0700': 'Phiên Á', '1345': 'Phiên Âu', '1930': 'Phiên Mỹ' },
      updated: 'cập nhật', next: 'Lần cập nhật tới', main: 'Chính', alt: 'Phụ', key: 'Vùng chính',
      tz: 'Mọi giờ hiển thị theo giờ máy của bạn', your_time: 'giờ của bạn',
      active: 'Đang chạy', closed: 'Đã đóng',
      signals_sub: 'Mỗi signal gắn với plan đang hiệu lực, đăng cùng lúc ở đây và trên Telegram.',
      no_active: 'Chưa có signal — signal tiếp theo hiện ở đây khi giá vào vùng plan.',
      no_closed: 'Chưa có signal nào đóng.', entry: 'Entry', sl: 'SL', tp: 'TP',
      tg_title: 'Nhận plan và signal qua Telegram', tg_sub: 'Kênh miễn phí · không cần đăng ký',
      history_sub: 'Mọi plan đều được chấm công khai khi nến ngày đóng — đúng hay sai đều giữ lại.',
      h_days: 'Ngày đã chấm', h_right: 'Đúng hướng', h_r: 'Tổng R', pending: 'Chờ chấm',
      right: 'Đúng', wrong: 'Sai', void: 'Huỷ / đứng ngoài',
      SELL: 'BÁN', BUY: 'MUA', TWO_WAY: '2 CHIỀU', STAND_ASIDE: 'ĐỨNG NGOÀI', lean: 'nghiêng',
      live: 'LIVE', stale: 'PLAN CŨ', err: 'Không tải được dữ liệu. Thử tải lại trang.',
      nt_title: 'Thông báo plan mới', nt_sub: 'Nhận thông báo trên máy này ngay khi có plan mới.', nt_on_btn: 'Bật thông báo', nt_off_btn: 'Tắt thông báo', nt_on: 'Đã bật thông báo trên máy này.', nt_denied: 'Trình duyệt đang chặn thông báo của trang này. Hãy cho phép trong cài đặt trình duyệt để bật.', nt_ios: 'Trên iPhone: bấm nút Chia sẻ, chọn “Thêm vào MH chính”, rồi mở NEXUS CORE từ màn hình chính và bật thông báo.', nt_err: 'Không đổi được thông báo. Thử lại sau.',
      wl_title: 'Nhận plan qua email & danh sách chờ', wl_sub: 'Nhận plan mới qua email và có app NEXUS CORE sớm nhất. Không spam, huỷ bất cứ lúc nào.', wl_label: 'Địa chỉ email', wl_btn: 'Đăng ký', wl_ok: 'Bạn đã có tên trong danh sách.', wl_bad: 'Vui lòng nhập email hợp lệ.', wl_err: 'Chưa đăng ký được. Thử lại sau.', wl_privacy: 'Email chỉ dùng để gửi tin NEXUS CORE, không chia sẻ cho ai. Bạn có thể yêu cầu xoá bất cứ lúc nào.',
      nt_old_ios: 'Thông báo cần iOS 16.4 trở lên. Cập nhật iPhone trong Cài đặt → Cài đặt chung → Cập nhật phần mềm, rồi bật thông báo tại đây.', nt_unsup: 'Trình duyệt này không hỗ trợ thông báo. Mở trang bằng Chrome, Edge, Firefox hoặc Safari — hoặc theo dõi kênh Telegram.',
      nt_retry: 'Đang kết nối… bấm nút thêm lần nữa.',
      nt_alt: 'Cách này chạy trên mọi điện thoại, kể cả iPhone đời cũ:', nt_tg: 'Nhận qua Telegram', nt_mail: 'Nhận qua email',
      risk_title: 'Cảnh báo rủi ro',
      disclaimer: 'Nội dung chỉ để tham khảo, không phải lời khuyên đầu tư hay lời mời giao dịch. Sản phẩm có đòn bẩy như vàng CFD có rủi ro mất tiền nhanh. Kết quả quá khứ không đảm bảo tương lai. Chỉ giao dịch bằng số tiền bạn chấp nhận mất.'
    }
  };
  var LINKS = {
    tg: { ar: 'https://t.me/nexuscoreArabic', _: 'https://t.me/nexuscorefx' },
    x: { ar: 'https://x.com/froggtrading', _: 'https://x.com/XAU_CRYPTO' }
  };
  var ED_TIME = { '0700': '07:00', '1345': '13:45', '1930': '19:30' };
  var ED_ORDER = ['0700', '1345', '1930'];

  var saved = null;
  try { saved = localStorage.getItem('nc_lang'); } catch (e) {}
  var nav = (navigator.language || '').toLowerCase();
  var lang = T[saved] ? saved : (nav.indexOf('vi') === 0 ? 'vi' : nav.indexOf('ar') === 0 ? 'ar' : 'en');
  var data = { plan: null, signals: null, history: null };
  var seg = 'active';

  var themeBtn;
  function t(k) { return T[lang][k] != null ? T[lang][k] : k; }
  function L(o) {
    if (o == null) return '';
    var s = typeof o === 'string' ? o : (o[lang] || o.en || o.vi || '');
    // keep price ranges left-to-right inside Arabic sentences (4058–4068, not 4068–4058)
    if (lang === 'ar') s = s.replace(/(\d[\d.,:]*)\s*[–-]\s*(\d[\d.,:]*)/g, '\u2066$1–$2\u2069');
    return s;
  }
  function locale() { return lang === 'vi' ? 'vi-VN' : lang === 'ar' ? 'ar-u-nu-latn' : (nav.indexOf('en') === 0 ? navigator.language : 'en-GB'); }
  function fmt(n) { if (n == null || n === '') return ''; var s = String(n); return lang === 'vi' ? s.replace('.', ',') : s; }
  function rng(lo, hi) { return lo === hi || hi == null ? fmt(lo) : fmt(lo) + '–' + fmt(hi); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function add(p) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) p.appendChild(arguments[i]); return p; }
  function clear(id) { var n = document.getElementById(id); n.textContent = ''; return n; }
  function sideCls(s) { return s === 'SELL' ? 'sell' : s === 'BUY' ? 'buy' : 'neutral'; }
  function row(k, v, vcls, text) {
    var r = el('div', 'row' + (text ? ' text' : ''));
    return add(r, el('span', 'k', k), el('span', 'v' + (text ? '' : ' num') + (vcls ? ' ' + vcls : ''), v));
  }

  // Plan times are Vietnam time (UTC+7); show them in the visitor's own time zone.
  function vn(dateStr, hm) { return new Date(dateStr + 'T' + hm + ':00+07:00'); }
  function tf(d, opt) { try { return new Intl.DateTimeFormat(locale(), opt).format(d); } catch (e) { return d.toISOString().slice(0, 16).replace('T', ' '); } }
  function hm(d) { return tf(d, { hour: '2-digit', minute: '2-digit' }); }
  function hmz(d) { return tf(d, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }); }
  function dayHm(d) { return tf(d, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  function dayOnly(d) { return tf(d, { weekday: 'short', day: 'numeric', month: 'short' }); }
  function addDays(dateStr, n) { var d = new Date(dateStr + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function nextEdition(p) {
    var i = ED_ORDER.indexOf(p.edition);
    if (i < 0) return null;
    if (i < 2) return { ed: ED_ORDER[i + 1], at: vn(p.date, ED_TIME[ED_ORDER[i + 1]]) };
    var d = addDays(p.date, 1), wd = new Date(d + 'T00:00:00Z').getUTCDay();
    if (wd === 6) d = addDays(d, 2); else if (wd === 0) d = addDays(d, 1);
    return { ed: '0700', at: vn(d, '07:00') };
  }
  function newsTime(s, year) {
    var m = /^(\d{2})\/(\d{2})(?:\s+(\d{2}):(\d{2}))?$/.exec(String(s || '').trim());
    if (!m) return String(s || '');
    var ds = year + '-' + m[2] + '-' + m[1];
    return m[3] ? dayHm(vn(ds, m[3] + ':' + m[4])) : dayOnly(vn(ds, '12:00'));
  }

  function load(path) {
    return fetch(path + '?t=' + Date.now(), { cache: 'no-store', credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error(path);
      return r.json();
    });
  }

  function renderStatic() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
    var tg = LINKS.tg[lang] || LINKS.tg._, x = LINKS.x[lang] || LINKS.x._;
    ['tg-cta', 'tg-link', 's-tg', 'nt-tg'].forEach(function (id) { document.getElementById(id).href = tg; });
    document.getElementById('s-x').href = x;
    if (themeBtn) themeLabel();
    notifyRender();
    wlRender();
  }

  function renderPlan() {
    var p = data.plan; if (!p) return;
    var upd = vn(p.updated_vn.slice(0, 10), p.updated_vn.slice(11));
    document.getElementById('plan-title').textContent = t('plan_of') + ' · ' + dayOnly(vn(p.date, '12:00'));
    document.getElementById('plan-meta').textContent = p.symbol + ' · ' + (t('ed')[p.edition] || p.edition) + ' · ' + t('updated') + ' ' + hmz(upd);

    var eds = clear('editions');
    ED_ORDER.forEach(function (e) {
      var c = el('div', 'ed' + (e === p.edition ? ' on' : ''));
      add(eds, add(c, el('span', 'k', t('ed_short')[e]), el('span', 'v num', hm(vn(p.date, ED_TIME[e])))));
    });

    var cb = document.getElementById('chart-box');
    var ch = p.chart || {};
    var src = ch[lang] || ch.en || ch.vi || '';
    // only accept our own chart files – never an arbitrary URL from the data file
    if (src && !/^data\/charts\/[0-9]{4}-[0-9]{2}-[0-9]{2}-(0700|1345|1930)-(vi|en)\.png$/.test(src)) src = '';
    if (src) {
      cb.hidden = false;
      var im = document.getElementById('chart-img');
      im.src = src; im.alt = 'XAUUSD H1 – ' + document.getElementById('plan-title').textContent;
      document.getElementById('chart-link').href = src;
    } else cb.hidden = true;

    var al = document.getElementById('alert');
    if (p.alert && L(p.alert)) { al.hidden = false; document.getElementById('alert-text').textContent = L(p.alert); } else al.hidden = true;

    var bc = document.getElementById('bias-card');
    var side = p.bias === 'TWO_WAY' || p.bias === 'STAND_ASIDE' ? (p.lean || '') : p.bias;
    bc.className = 'hero card ' + sideCls(side);
    var bv = t(p.bias);
    if (p.bias === 'TWO_WAY' && p.lean) bv += ' · ' + t('lean') + ' ' + t(p.lean);
    document.getElementById('bias-val').textContent = bv;
    document.getElementById('day-type').textContent = L(p.day_type);
    document.getElementById('headline').textContent = L(p.headline);

    var hk = clear('hero-keys');
    function key(k, v) { add(hk, add(el('div', 'key'), el('span', 'k', k), el('span', 'v num', v))); }
    if (p.main_zone) key(t('main_zone') + ' · ' + t(p.main_zone.side), rng(p.main_zone.lo, p.main_zone.hi));
    if (p.targets && p.targets[0]) key(t('target') + ' ' + p.targets[0].label, rng(p.targets[0].lo, p.targets[0].hi));
    if (p.range) key(t('range'), rng(p.range.lo, p.range.hi));

    var lv = clear('levels');
    if (p.main_zone) add(lv, row(t('main_zone') + ' (' + t(p.main_zone.side) + ')', rng(p.main_zone.lo, p.main_zone.hi), 'main'));
    (p.targets || []).forEach(function (x) { add(lv, row(t('target') + ' ' + x.label, rng(x.lo, x.hi))); });
    if (p.range) add(lv, row(t('range'), rng(p.range.lo, p.range.hi)));
    if (p.invalidation) add(lv, row(t('invalid'), L(p.invalidation), 'bad', true));

    var cx = clear('context');
    (p.context || []).forEach(function (c) { add(cx, add(el('div', 'stat'), el('span', 'k', L(c.k)), el('span', 'v', L(c.v)))); });

    var sc = clear('scenarios');
    (p.scenarios || []).forEach(function (s, i) {
      var c = el('div', 'card scen ' + sideCls(s.side));
      var head = add(el('div', 't'), el('span', null, (i === 0 ? t('main') : t('alt')) + ' · ' + t(s.side)), el('span', 'num muted', '~' + s.prob + '%'));
      var bar = el('div', 'bar'); var bi = el('i'); bi.style.width = Math.max(0, Math.min(100, s.prob)) + '%'; bar.appendChild(bi);
      add(sc, add(c, head, el('p', null, L(s.text)), bar));
    });

    var zn = clear('zones');
    var mz = p.main_zone;
    (p.zones || []).forEach(function (z) {
      var isMain = mz && z.lo === mz.lo && z.hi === mz.hi && z.side === mz.side;
      var c = el('div', 'card zone' + (isMain ? ' is-main' : ''));
      var h = add(el('div', 'h'), el('span', 'pill ' + sideCls(z.side), t(z.side)), el('span', 'num', rng(z.lo, z.hi)));
      add(zn, add(c, add(el('div', 'l'), h, el('span', 's', L(z.status))), el('span', 'g', isMain ? t('key') : String(z.grade || ''))));
    });

    var nw = clear('news');
    var yr = p.date.slice(0, 4);
    (p.news || []).forEach(function (n) {
      var r = el('div', 'row news-row');
      add(nw, add(r, add(el('span', 'k'), el('span', 'imp ' + (n.impact || 'low')), el('span', null, L(n.text))), el('span', 'v', newsTime(n.time, yr))));
    });
    var tzn = '';
    try { new Intl.DateTimeFormat(locale(), { timeZoneName: 'short' }).formatToParts(new Date()).forEach(function (x) { if (x.type === 'timeZoneName') tzn = x.value; }); } catch (e) {}
    document.getElementById('tznote').textContent = t('tz') + (tzn ? ' (' + tzn + ')' : '') + '.';

    var nx = clear('next'), ne = nextEdition(p);
    if (ne) add(nx, el('strong', null, t('next') + ' · ' + t('ed')[ne.ed]), el('span', 'num', dayHm(ne.at)));
    else add(nx, el('strong', null, t('next')), el('span', null, L(p.next_update)));

    // LIVE badge goes grey when the plan is more than 30 hours old
    var age = (Date.now() - upd.getTime()) / 36e5;
    document.getElementById('live').classList.toggle('stale', age > 30);
    document.getElementById('live-text').textContent = age > 30 ? t('stale') : t('live');
  }

  function rSpan(r) { return r == null ? null : el('span', 'num ' + (r > 0 ? 'r-up' : r < 0 ? 'r-down' : 'r-flat'), (r > 0 ? '+' : '') + fmt(r) + 'R'); }

  function renderSignals() {
    var s = data.signals || { active: [], closed: [] };
    document.querySelectorAll('.seg button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.seg === seg ? 'true' : 'false'); });
    var list = clear('signal-list');
    var items = s[seg] || [];
    if (!items.length) { add(list, el('div', 'card empty', seg === 'active' ? t('no_active') : t('no_closed'))); return; }
    items.forEach(function (x) {
      var c = el('div', 'card sig');
      var left = add(el('div', 'stack-sm'),
        add(el('div', 'h'), el('span', 'pill ' + sideCls(x.side), t(x.side)), document.createTextNode(' '), el('span', 'muted', x.time || '')),
        add(el('div', 'nums'), el('span', 'lab', t('entry')), el('span', 'lab', t('sl')), el('span', 'lab', t('tp')),
          el('span', 'num', fmt(x.entry)), el('span', 'num', fmt(x.sl)), el('span', 'num', (x.tp || []).map(fmt).join(' / '))));
      if (x.note) add(left, el('span', 'muted', L(x.note)));
      add(list, add(c, left, rSpan(x.r)));
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
      var side = d.bias === 'TWO_WAY' || d.bias === 'STAND_ASIDE' ? (d.lean || '') : d.bias;
      var lab = t(d.bias) + (d.bias === 'TWO_WAY' && d.lean ? ' · ' + t(d.lean) : '');
      var res = d.result ? t(d.result) : t('pending');
      var left = add(el('div', 'stack-sm'),
        add(el('div', 'h'), el('strong', null, dayOnly(vn(d.date, '12:00'))), document.createTextNode(' '), el('span', 'pill ' + sideCls(side), lab)),
        add(el('span', 'muted'), document.createTextNode(res + (d.main_zone ? ' · ' : '')), d.main_zone ? el('span', 'num', fmt(d.main_zone)) : null));
      add(list, add(c, left, rSpan(d.r)));
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
      notifyLang();
    });
  });
  document.querySelectorAll('.seg button').forEach(function (b) {
    b.addEventListener('click', function () { seg = b.dataset.seg; renderSignals(); });
  });
  themeBtn = document.getElementById('theme-btn');
  function themeLabel() {
    var dark = document.documentElement.getAttribute('data-theme') !== 'light';
    themeBtn.setAttribute('aria-label', dark ? t('to_light') : t('to_dark'));
    themeBtn.title = themeBtn.getAttribute('aria-label');
  }
  themeBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('nc_theme', next); } catch (e) {}
    themeLabel();
  });
  window.addEventListener('hashchange', route);

  // ---- new-plan alerts (web push) ----
  var PUSH_API = 'https://push.nexuscore.trade';
  var push = { ready: false, key: '', state: 'off', busy: false, err: false, reg: null };
  var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var standalone = navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var canPush = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  function keyBytes(s) {
    var b = atob(s.replace(/-/g, '+').replace(/_/g, '/')), o = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) o[i] = b.charCodeAt(i);
    return o;
  }
  function post(path, body) {
    return fetch(PUSH_API + path, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw new Error(path); });
  }
  function notifyRender() {
    var card = document.getElementById('notify'), sub = document.getElementById('notify-sub'), btn = document.getElementById('notify-btn');
    if (!card) return;
    var iosHint = isIOS && !standalone;
    card.hidden = false;
    if (!canPush && !iosHint) {   // say why instead of hiding the card
      btn.hidden = true;
      sub.textContent = isIOS ? t('nt_old_ios') : t('nt_unsup');
      return;
    }
    card.hidden = false;
    var denied = canPush && Notification.permission === 'denied';
    btn.hidden = iosHint && !canPush || denied;
    btn.disabled = push.busy;
    btn.className = 'btn big' + (push.state === 'on' ? ' on' : '');
    document.getElementById('notify-btn-t').textContent = push.state === 'on' ? t('nt_off_btn') : t('nt_on_btn');
    sub.textContent = push.err ? (canPush && Notification.permission === 'denied' ? t('nt_denied') : push.errName === 'retry' ? t('nt_retry') : t('nt_err') + (push.errName ? ' (' + push.errName + ')' : '')) : (!canPush ? t('nt_ios') : denied ? t('nt_denied') : push.state === 'on' ? t('nt_on') : t('nt_sub'));
  }
  // iPhone/Safari only allow the permission prompt and the subscription when they start
  // directly from the tap, so the subscribe call happens synchronously inside the click handler.
  function notifyToggle() {
    if (push.busy) return;
    push.err = false; push.errName = '';
    var job;
    if (push.state === 'on' && push.reg) {
      job = push.reg.pushManager.getSubscription().then(function (s) {
        if (!s) return;
        var ep = s.endpoint;
        return s.unsubscribe().then(function () { return post('/unsubscribe', { endpoint: ep }).catch(function () {}); });
      }).then(function () { push.state = 'off'; });
    } else if (push.reg && push.key) {
      var sub;
      try {
        sub = push.reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(push.key) });   // shows the iOS "Allow notifications" prompt
      } catch (e) { sub = Promise.reject(e); }
      job = sub.then(function (s) { return post('/subscribe', { sub: s.toJSON(), lang: lang }); })
               .then(function () { push.state = 'on'; });
    } else {
      // service not reachable yet: retry setup, then ask the user to tap again
      job = pushInit().then(function () { throw new Error('retry'); });
    }
    push.busy = true; notifyRender();
    job.catch(function (e) {
      push.err = true;
      push.errName = (e && (e.name || e.message)) || '';
      if (push.errName === 'Error') push.errName = (e && e.message) || '';
    }).then(function () { push.busy = false; notifyRender(); });
  }
  function notifyLang() {   // keep the alert language in step with the page language
    if (push.state !== 'on' || !push.reg) return;
    push.reg.pushManager.getSubscription().then(function (s) { if (s) return post('/subscribe', { sub: s.toJSON(), lang: lang }); }).catch(function () {});
  }
  document.getElementById('notify-btn').addEventListener('click', notifyToggle);

  // ---- waitlist ----
  var wl = { state: 'idle' };
  function wlRender() {
    var card = document.getElementById('waitlist');
    if (!card) return;
    card.hidden = false;
    var msg = document.getElementById('wl-msg');
    document.getElementById('wl-form').hidden = wl.state === 'ok';
    document.getElementById('wl-btn').disabled = wl.state === 'busy';
    document.getElementById('wl-email').placeholder = 'you@example.com';
    msg.className = 'wl-msg' + (wl.state === 'ok' ? ' ok' : (wl.state === 'bad' || wl.state === 'err') ? ' bad' : '');
    msg.textContent = wl.state === 'ok' ? t('wl_ok') : wl.state === 'bad' ? t('wl_bad') : wl.state === 'err' ? t('wl_err') : '';
  }
  document.getElementById('wl-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (wl.state === 'busy') return;
    var email = document.getElementById('wl-email').value.trim();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,24}$/.test(email)) { wl.state = 'bad'; wlRender(); return; }
    wl.state = 'busy'; wlRender();
    post('/waitlist', { email: email, lang: lang, website: document.getElementById('wl-hp').value })
      .then(function () { wl.state = 'ok'; }, function () { wl.state = 'err'; }).then(wlRender);
  });
  function pushInit() {   // fetch the service key and register the service worker (retried on demand)
    if (push.init) return push.init;
    push.init = fetch(PUSH_API + '/key', { credentials: 'omit' }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (k) {
      if (!/^[A-Za-z0-9_-]{80,100}$/.test(k)) throw 0;
      push.key = k; push.ready = true;
      if (!canPush) return;
      return navigator.serviceWorker.register('sw.js').then(function () { return navigator.serviceWorker.ready; }).then(function (reg) {
        push.reg = reg;
        return reg.pushManager.getSubscription();
      }).then(function (s) { push.state = s ? 'on' : 'off'; });
    });
    push.init.catch(function () { push.init = null; });
    return push.init;
  }
  pushInit().catch(function () {}).then(function () { notifyRender(); wlRender(); });

  renderStatic();
  Promise.all([load('data/latest.json'), load('data/signals.json').catch(function () { return null; }), load('data/history.json').catch(function () { return null; })])
    .then(function (r) {
      data.plan = r[0]; data.signals = r[1]; data.history = r[2];
      document.getElementById('loading').hidden = true;
      renderAll();
    })
    .catch(function () { document.getElementById('loading').textContent = t('err'); });
})();
