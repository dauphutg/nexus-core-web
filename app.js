(function () {
  'use strict';

  var T = {
    en: {
      pp_best: 'Max favourable move (MFE)', pp_best_note: 'Furthest move in the zone’s direction after it was reached, until invalidation or the daily close, shows how good the read was; it is not a trade result and is never added to R.', tr_best: 'Avg MFE', kp_real: 'Real result', tr_winrate: 'Win rate', tr_netpips: 'Net pips', tr_signals: 'Trades', tr_entry: 'Entry', tr_sl: 'Stop loss', tr_max: 'max run', tr_detail: 'Details', tr_notrade: 'Plans with no entry', tr_perf: 'Performance', gold_usd: 'Gold / USD', rv_h: 'See before / after', rv_go: 'Full result of this plan', rv_alt: 'Before and after: the plan chart as published and the real 15-minute candles until the session ended', rv_cap: 'Top: the H1 chart as published. Bottom: the same H1 chart with the real candles until the session ended, the arrow marks when the plan was drawn.', kp_plans: 'plans', kp_zones: 'zones reached', kp_real_note: 'Losing days included.', kp_move: 'How far price ran', kp_avg: 'average per zone', kp_max: 'Biggest', kp_avg_usd: 'Average in $', kp_move_note: 'From zone touch to the furthest price. Not a trade profit.', z_near_short: 'Just missed the zone', std_r: 'std (1R = 10 $)', z_near: 'Reacted just short of the zone', near_det: 'Closest {gap} $ from the zone at {at}, then {move} $ in the zone’s direction', near_note: 'Near-zone reaction: price turned within 2 $ of the zone without reaching it. Shown for transparency only, not a touch, not in the hit rate, never added to R.', tr_near: 'Near-zone reactions', 
      chart_hint: 'Tap the chart to view it full screen', lb_hint: 'Tap anywhere to close, pinch to zoom', 
      tab_learn: 'Learn', ln_eyebrow: 'Gold trading Q&A', ln_short: 'Short answer', ln_example: 'Live example from the latest NEXUS CORE plan', ln_faq: 'Quick answers', ln_related: 'Related questions', ln_updated: 'Updated', see_plan: 'See the full plan →', see_track: 'See the track record →',
      ln_index_h1: 'Learn to read the gold market', ln_index_lede: 'Plain answers to the questions gold traders actually ask, each one tied to a real, graded NEXUS CORE plan.', ln_all: 'All questions', ln_sessions_note: 'Plan times: Asia 00:00 UTC, London update 06:45 UTC, New York 12:30 UTC.',
      mv_eyebrow: 'Why gold moved', mv_h1: 'Why gold moved', mv_change: 'Day change', mv_oc: 'Open → close', mv_hl: 'High / low', mv_big: 'Biggest hourly move', mv_reasons: 'What moved it', mv_sources: 'Sources', mv_method: 'Numbers from 15-minute XAUUSD candles (OANDA feed). Trading day = 17:00 New York to 17:00 New York. Reasons come only from published news and data; when none fits, we say so.', mv_plans: 'Plans for this day', mv_recent: 'Why gold moved, recent days',
      skip: 'Skip to content', to_light: 'Switch to light theme', to_dark: 'Switch to dark theme', tab_plan: 'Daily plan', tab_signals: 'Signals', tab_history: 'Track record', tab_ea: 'Gold EA',
      lede: 'AI-built game plan for gold (XAUUSD): key zones, scenarios and the level that proves the view wrong, refreshed before Asia, London and New York.',
      bias: 'Bias', levels: 'Key levels', scenarios: 'Scenarios', zones: 'Zones on the chart', news: 'Economic calendar',
      main_zone: 'Main zone', watch: 'Watch level', invalid: 'View is wrong if', range: 'Expected range', target: 'Target',
      plan_of: 'Gold plan', ed: { '0700': 'Asia plan', '1345': 'Pre-London update', '1930': 'Pre-New York plan' },
      ed_short: { '0700': 'Asia', '1345': 'London', '1930': 'New York' },
      updated: 'updated', next: 'Next update', main: 'Main', alt: 'Alternate', zsell: 'Sell zone', zbuy: 'Buy zone', fl_sb: 'Becomes new resistance (a sell zone) after an {tf} close below {x} (a closed candle, a wick does not count)', fl_ba: 'Becomes new support (a buy zone) after an {tf} close above {x} (a closed candle, a wick does not count)', fl_sa: 'Becomes a sell zone only after an {tf} close above {x}', fl_bb: 'Becomes a buy zone only after an {tf} close below {x}', pill_s: 'Resistance, sell zone', pill_b: 'Support, buy zone', pill_fs: 'Support, sell on a break', pill_fb: 'Resistance, buy on a break', br_res: 'Resistance breaks on an {tf} close above {x} and may then turn into new support', br_sup: 'Support breaks on an {tf} close below {x} and may then turn into new resistance', hold_sup: 'If an {tf} closes back above {x}, the support holds and the sell zone is cancelled', hold_res: 'If an {tf} closes back below {x}, the resistance holds and the buy zone is cancelled', grade: 'Grade', key: 'Key zone',
      tz: 'All times in UK time', your_time: 'your time',
      tg_title: 'Get every plan on Telegram', tg_sub: 'Free channel, no sign-up',
      SELL: 'SELL', BUY: 'BUY', TWO_WAY: 'TWO-WAY', STAND_ASIDE: 'STAND ASIDE', lean: 'leaning',
      live: 'LIVE', stale: 'LAST PLAN', err: 'Could not load data. Please reload the page.',
      cta_title: 'Get the next plan before London opens', cta_sub: 'A free alert the moment each plan is published, Asia, London and New York. Takes five seconds.', cta_push: 'Alert on this device',
      nt_title: 'New-plan alerts', nt_sub: 'Get a notification on this device the moment a new plan is published.', nt_on_btn: 'Turn on alerts', nt_off_btn: 'Turn off alerts', nt_on: 'Alerts are on for this device.', nt_denied: 'Notifications are blocked for this site. Allow them in your browser settings to turn alerts on.', nt_ios: 'On iPhone: tap the Share button, choose “Add to Home Screen”, then open NEXUS CORE from your home screen and turn on alerts.', nt_err: 'Could not change alerts. Please try again.',
      wl_title: 'Plan by email – coming soon', wl_sub: 'Email delivery is being set up. Leave your address and every new plan will reach your inbox as soon as it starts, plus first access to the NEXUS CORE app. No spam, unsubscribe any time.', wl_label: 'Email address', wl_btn: 'Join waitlist', wl_ok: 'You are on the list.', wl_bad: 'Please enter a valid email address.', wl_err: 'Could not sign you up. Please try again.', wl_privacy: 'We use your email only for NEXUS CORE updates and never share it. You can ask to be removed at any time.',
      nt_old_ios: 'Alerts need iOS 16.4 or later. Update your iPhone in Settings → General → Software Update, then turn alerts on here.', nt_unsup: 'This browser cannot show alerts. Open the site in Chrome, Edge, Firefox or Safari, or follow the Telegram channel.',
      nt_retry: 'Connecting… please tap the button again.',
      nt_alt: 'Works on every phone, including older iPhones:', nt_tg: 'Alerts on Telegram', nt_mail: 'Alerts by email',
      permalink: 'Permanent link to this plan',
      res_mixed: 'Mixed', res_no_trigger: 'Not triggered', res_gap: 'Skipped – market opened past the invalidation (not counted)', pp_trig: 'Triggered at', tg_wait: 'Waiting for an {tf} close {d} {x}', tg_below: 'below', tg_above: 'above', pp_zones: 'Zones graded', z_earlier: 'Counted in the earlier update', pp_follow: 'Followed until', z_main: 'Main zone', res_hit: 'Target 1 reached', res_void: 'Invalidated', res_no_touch: 'Zone not reached', res_expired: 'Closed at session end', res_carried: 'Followed by the next update', z_carried_to: 'Still open at the end of the session, the next update follows it and grades it there.', tr_r_closed: 'R, target or invalidation', tr_r_session: 'R, closed at session end', z_carried_from: 'Open trade carried over from the previous update', z_see_next: 'See the next update →', res_aside: 'Stood aside', pending: 'Pending',
      res_pending_note: 'Graded after the daily close (17:00 New York).',
      pp_result: 'How this plan played out', pp_touched: 'Zone reached', pp_event: 'Decided at', pp_window: 'Graded window', pp_hl: 'High / low in window', pp_last: 'Last price in window', pp_t1: 'Target 1', pp_void: 'Invalidation level',
      prev_plan: '← Previous plan', next_plan: 'Next plan →', today_plan: 'Today’s plan', all_month: 'All plans this month',
      tr_h1: 'Gold plan track record', tr_lede: 'Every NEXUS CORE gold plan this month and how it played out. Wins, losses and misses all stay on the record, nothing is deleted.',
      tr_plans: 'Plans published', tr_graded: 'Graded', tr_reached: 'Zones reached', tr_hit: 'Target 1 reached', tr_void: 'Invalidated', tr_r: 'Total R',
      tr_list: 'Every plan', tr_none: 'No plans yet this month.', tr_method: 'How plans are graded', tr_prev_m: '← Previous month', tr_next_m: 'Next month →', view: 'View plan',
      tr_m: ['Every tradeable zone in each published plan is graded automatically against real XAUUSD prices (OANDA feed) once its session is over. Watch-only zones are not scored.',
        'A zone counts only if price reaches it during the plan\'s session. It is then settled as “Target 1 reached”, “Invalidated” or “Closed at session end”.',
        'R compares each result with the zone\'s planned risk (+1R = won as much as was risked, −1R = lost it). A plan\'s R is the sum of its zones; wins and losses count alike.',
        'Results are hypothetical: spread, slippage and fees are not included, and they are not real-money trades.',
        'Stand-aside plans are not scored. Nothing is ever deleted from the record.',
        'Rules v4, 14 Nov 2026. Every earlier plan was re-graded once under these rules.'],
      sg_h1: 'NEXUS CORE Signals', sg_lede: 'Exact trade signals built on the daily plan, for members only. The daily plan stays free for everyone.', sg_soon: 'Members only, launching soon', sg_what: 'What members get',
      sg_b: ['A real-time alert when price reaches a plan zone and the setup confirms, entry, stop and targets.', 'Every signal tied to the plan in force, so you always know why it exists.', 'Priority alerts in the app and a private Telegram group.', 'Every signal recorded and graded, win or loss.'],
      sg_wl_title: 'Join the Signals waitlist', sg_wl_sub: 'Be first to know when Signals opens, with early-member pricing. No spam.', sg_free: 'Only need the free plan?', sg_free_link: 'See today’s gold plan →',
      sg_note: 'Signals are trade ideas for information only, not personal advice. Availability may depend on your country.',
      risk_title: 'Risk warning',
      disclaimer: 'Market analysis for information only, not investment advice or a solicitation to trade. Leveraged products such as gold CFDs carry a high risk of losing money rapidly. Past performance does not guarantee future results. Trade only with money you can afford to lose.'
    },
    ar: {
      pp_best: 'أقصى حركة مواتية (MFE)', pp_best_note: 'أبعد حركة باتجاه المنطقة بعد الوصول إليها حتى الإلغاء أو الإغلاق اليومي، تُظهر دقة القراءة، وليست نتيجة صفقة ولا تُضاف إلى R.', tr_best: 'متوسط MFE', kp_real: 'النتيجة الفعلية', tr_winrate: 'نسبة النجاح', tr_netpips: 'صافي النقاط', tr_signals: 'صفقات', tr_entry: 'الدخول', tr_sl: 'وقف الخسارة', tr_max: 'أقصى حركة', tr_detail: 'التفاصيل', tr_notrade: 'خطط بلا دخول', tr_perf: 'الأداء', gold_usd: 'الذهب / الدولار', rv_h: 'عرض قبل / بعد', rv_go: 'النتيجة الكاملة لهذه الخطة', rv_alt: 'قبل وبعد: مخطط الخطة كما نُشر وشموع 15 دقيقة الفعلية حتى نهاية الجلسة', rv_cap: 'في الأعلى: مخطط H1 كما نُشر. في الأسفل: مخطط H1 نفسه مع الشموع الفعلية حتى نهاية الجلسة، السهم يحدد وقت رسم الخطة.', kp_plans: 'خطط', kp_zones: 'مناطق تم الوصول إليها', kp_real_note: 'الأيام الخاسرة مشمولة.', kp_move: 'إلى أي مدى تحرك السعر', kp_avg: 'متوسط لكل منطقة', kp_max: 'الأكبر', kp_avg_usd: 'المتوسط بالدولار', kp_move_note: 'من لمس المنطقة حتى أبعد سعر. ليس ربح صفقة.', z_near_short: 'فاتته المنطقة بقليل', std_r: 'قياسي (1R = 10 $)', z_near: 'ارتداد قرب المنطقة', near_det: 'أقرب نقطة على بعد {gap} $ من المنطقة عند {at}، ثم تحرك {move} $ باتجاه المنطقة', near_note: 'ارتداد قرب المنطقة: انعكس السعر على بعد 2 $ أو أقل دون أن يصل إليها. يُعرض للشفافية فقط، لا يُعد وصولًا ولا يدخل في نسبة النجاح ولا يُضاف إلى R.', tr_near: 'ارتدادات قرب المنطقة', 
      chart_hint: 'اضغط على الرسم لعرضه بملء الشاشة', lb_hint: 'اضغط في أي مكان للإغلاق، كبّر بإصبعين', 
      tab_learn: 'تعلّم', ln_eyebrow: 'أسئلة وأجوبة تداول الذهب', ln_short: 'الإجابة المختصرة', ln_example: 'مثال حي من أحدث خطة NEXUS CORE', ln_faq: 'إجابات سريعة', ln_related: 'أسئلة ذات صلة', ln_updated: 'آخر تحديث', see_plan: 'شاهد الخطة كاملة', see_track: 'شاهد سجل النتائج',
      ln_index_h1: 'تعلّم قراءة سوق الذهب', ln_index_lede: 'إجابات واضحة عن الأسئلة التي يطرحها متداولو الذهب فعلًا، كل إجابة مرتبطة بخطة حقيقية من NEXUS CORE وتم تقييمها.', ln_all: 'كل الأسئلة', ln_sessions_note: 'أوقات الخطط: آسيا 00:00 UTC، تحديث لندن 06:45 UTC، نيويورك 12:30 UTC.',
      mv_eyebrow: 'لماذا تحرك الذهب', mv_h1: 'لماذا تحرك الذهب', mv_change: 'تغيّر اليوم', mv_oc: 'الافتتاح ← الإغلاق', mv_hl: 'أعلى / أدنى', mv_big: 'أكبر حركة في ساعة', mv_reasons: 'ما الذي حرّكه', mv_sources: 'المصادر', mv_method: 'الأرقام من شموع XAUUSD لفترة 15 دقيقة (بيانات OANDA). يوم التداول = من 17:00 إلى 17:00 بتوقيت نيويورك. الأسباب من الأخبار والبيانات المنشورة فقط؛ وإن لم يوجد سبب واضح نقول ذلك.', mv_plans: 'خطط هذا اليوم', mv_recent: 'لماذا تحرك الذهب، الأيام الأخيرة',
      skip: 'انتقل إلى المحتوى', to_light: 'التبديل إلى الوضع الفاتح', to_dark: 'التبديل إلى الوضع الداكن', tab_plan: 'الخطة اليومية', tab_signals: 'الإشارات', tab_history: 'سجل النتائج', tab_ea: 'Gold EA',
      lede: 'خطة للذهب (XAUUSD) مبنية بالذكاء الاصطناعي: مناطق رئيسية، سيناريوهات، والمستوى الذي يُلغي الفكرة، تُحدَّث قبل جلسات آسيا ولندن ونيويورك.',
      bias: 'الاتجاه', levels: 'المستويات الرئيسية', scenarios: 'السيناريوهات', zones: 'المناطق على الرسم', news: 'المفكرة الاقتصادية',
      main_zone: 'المنطقة الرئيسية', watch: 'مستوى للمراقبة', invalid: 'تُلغى الفكرة إذا', range: 'النطاق المتوقع', target: 'الهدف',
      plan_of: 'خطة الذهب', ed: { '0700': 'خطة آسيا', '1345': 'تحديث ما قبل لندن', '1930': 'خطة ما قبل نيويورك' },
      ed_short: { '0700': 'آسيا', '1345': 'لندن', '1930': 'نيويورك' },
      updated: 'آخر تحديث', next: 'التحديث القادم', main: 'الرئيسي', alt: 'البديل', zsell: 'منطقة بيع', zbuy: 'منطقة شراء', fl_sb: 'تتحول إلى مقاومة جديدة (منطقة بيع) بعد إغلاق {tf} دون {x} (إغلاق شمعة كاملة، الذيل لا يُحتسب)', fl_ba: 'تتحول إلى دعم جديد (منطقة شراء) بعد إغلاق {tf} فوق {x} (إغلاق شمعة كاملة، الذيل لا يُحتسب)', fl_sa: 'تصبح منطقة بيع فقط بعد إغلاق {tf} فوق {x}', fl_bb: 'تصبح منطقة شراء فقط بعد إغلاق {tf} دون {x}', pill_s: 'مقاومة، منطقة بيع', pill_b: 'دعم، منطقة شراء', pill_fs: 'دعم، بيع عند الكسر', pill_fb: 'مقاومة، شراء عند الاختراق', br_res: 'تنكسر المقاومة بإغلاق {tf} فوق {x} وقد تتحول بعدها إلى دعم جديد', br_sup: 'ينكسر الدعم بإغلاق {tf} دون {x} وقد يتحول بعدها إلى مقاومة جديدة', hold_sup: 'إذا أغلقت {tf} مجددًا فوق {x} يصمد الدعم وتُلغى منطقة البيع', hold_res: 'إذا أغلقت {tf} مجددًا دون {x} تصمد المقاومة وتُلغى منطقة الشراء', grade: 'الدرجة', key: 'منطقة رئيسية',
      tz: 'جميع الأوقات بتوقيت مكة المكرمة', your_time: 'بتوقيتك',
      tg_title: 'استلم كل خطة عبر تيليجرام', tg_sub: 'قناة مجانية، بدون تسجيل',
      SELL: 'بيع', BUY: 'شراء', TWO_WAY: 'اتجاهان', STAND_ASIDE: 'خارج السوق', lean: 'ميل إلى',
      live: 'مباشر', stale: 'آخر خطة', err: 'تعذّر تحميل البيانات. يرجى إعادة تحميل الصفحة.',
      cta_title: 'احصل على الخطة القادمة قبل افتتاح لندن', cta_sub: 'تنبيه مجاني لحظة نشر كل خطة، آسيا ولندن ونيويورك. التفعيل في خمس ثوانٍ.', cta_push: 'تنبيه على هذا الجهاز',
      nt_title: 'تنبيهات الخطة الجديدة', nt_sub: 'استلم إشعارًا على هذا الجهاز فور نشر خطة جديدة.', nt_on_btn: 'تفعيل التنبيهات', nt_off_btn: 'إيقاف التنبيهات', nt_on: 'التنبيهات مفعّلة على هذا الجهاز.', nt_denied: 'الإشعارات محظورة لهذا الموقع. اسمح بها من إعدادات المتصفح لتفعيل التنبيهات.', nt_ios: 'على الآيفون: اضغط زر المشاركة، اختر «إضافة إلى الشاشة الرئيسية»، ثم افتح NEXUS CORE من الشاشة الرئيسية وفعّل التنبيهات.', nt_err: 'تعذّر تغيير التنبيهات. حاول مرة أخرى.',
      wl_title: 'الخطة بالبريد – قريبًا', wl_sub: 'نعمل على تجهيز الإرسال بالبريد. اترك بريدك وستصلك كل خطة جديدة فور بدء الخدمة، مع وصول مبكر إلى تطبيق NEXUS CORE. بلا إزعاج، ويمكنك الإلغاء متى شئت.', wl_label: 'البريد الإلكتروني', wl_btn: 'انضم الآن', wl_ok: 'تم تسجيلك في القائمة.', wl_bad: 'يرجى إدخال بريد إلكتروني صحيح.', wl_err: 'تعذّر التسجيل. حاول مرة أخرى.', wl_privacy: 'نستخدم بريدك لتحديثات NEXUS CORE فقط ولا نشاركه مع أحد. يمكنك طلب الحذف في أي وقت.',
      nt_old_ios: 'التنبيهات تتطلب iOS 16.4 أو أحدث. حدّث الآيفون من الإعدادات ← عام ← تحديث البرامج ثم فعّل التنبيهات هنا.', nt_unsup: 'هذا المتصفح لا يدعم التنبيهات. افتح الموقع في Chrome أو Edge أو Firefox أو Safari، أو تابع قناة تيليجرام.',
      nt_retry: 'جارٍ الاتصال… اضغط الزر مرة أخرى.',
      nt_alt: 'تعمل على كل الهواتف، بما فيها أجهزة الآيفون القديمة:', nt_tg: 'تنبيهات عبر تيليجرام', nt_mail: 'تنبيهات بالبريد',
      permalink: 'رابط دائم لهذه الخطة',
      res_mixed: 'نتائج مختلطة', res_no_trigger: 'لم تُفعَّل', res_gap: 'مستبعدة – افتتح السوق بعد مستوى الإلغاء (لا تُحتسب)', pp_trig: 'تفعّلت عند', tg_wait: 'بانتظار إغلاق {tf} {d} {x}', tg_below: 'أسفل', tg_above: 'فوق', pp_zones: 'المناطق المُقيَّمة', z_earlier: 'احتُسبت في التحديث السابق', pp_follow: 'المتابعة حتى', z_main: 'المنطقة الرئيسية', res_hit: 'تحقق الهدف الأول', res_void: 'أُلغيت الفكرة', res_no_touch: 'لم يصل السعر إلى المنطقة', res_expired: 'إغلاق نهاية الجلسة', res_carried: 'تتابعه الخطة التالية', z_carried_to: 'بقيت مفتوحة عند نهاية الجلسة، يتابعها التحديث التالي وتُقيَّم هناك.', tr_r_closed: 'R، هدف أو إلغاء', tr_r_session: 'R، إغلاق نهاية الجلسة', z_carried_from: 'صفقة مفتوحة منقولة من التحديث السابق', z_see_next: 'عرض التحديث التالي ←', res_aside: 'خارج السوق', pending: 'قيد التقييم',
      res_pending_note: 'تُقيَّم بعد الإغلاق اليومي (17:00 بتوقيت نيويورك).',
      pp_result: 'نتيجة هذه الخطة', pp_touched: 'وصول السعر إلى المنطقة', pp_event: 'حُسمت النتيجة', pp_window: 'فترة التقييم', pp_hl: 'أعلى / أدنى سعر في الفترة', pp_last: 'آخر سعر في الفترة', pp_t1: 'الهدف الأول', pp_void: 'مستوى الإلغاء',
      prev_plan: 'الخطة السابقة', next_plan: 'الخطة التالية', today_plan: 'خطة اليوم', all_month: 'كل خطط الشهر',
      tr_h1: 'سجل نتائج خطط الذهب', tr_lede: 'كل خطط NEXUS CORE للذهب هذا الشهر وكيف انتهت. الرابحة والخاسرة وغير المُفعّلة تبقى في السجل، لا نحذف شيئًا.',
      tr_plans: 'خطط منشورة', tr_graded: 'مُقيَّمة', tr_reached: 'مناطق وصلها السعر', tr_hit: 'تحقق الهدف الأول', tr_void: 'أُلغيت', tr_r: 'مجموع R',
      tr_list: 'كل خطة', tr_none: 'لا توجد خطط هذا الشهر بعد.', tr_method: 'كيف نُقيّم الخطط', tr_prev_m: 'الشهر السابق', tr_next_m: 'الشهر التالي', view: 'عرض الخطة',
      tr_m: ['تُقيَّم كل منطقة قابلة للتداول في كل خطة منشورة تلقائيًا على أسعار XAUUSD الحقيقية (بيانات OANDA) بعد انتهاء جلستها. مناطق المراقبة فقط لا تُحتسب.',
        'لا تُحتسب المنطقة إلا إذا وصل إليها السعر خلال جلسة الخطة، ثم تُسوّى بإحدى النتائج: «تحقق الهدف 1» أو «أُلغيت» أو «أُغلقت بنهاية الجلسة».',
        '‏R تقارن كل نتيجة بالمخاطرة المخطط لها للمنطقة (+1R = ربح يساوي المخاطرة، −1R = خسارتها). R الخطة هو مجموع مناطقها، والأرباح والخسائر تُحتسب بالتساوي.',
        'النتائج افتراضية: لا تشمل الفروقات أو الانزلاق أو الرسوم، وليست صفقات بأموال حقيقية.',
        'خطط «خارج السوق» لا تُقيَّم. لا يُحذف أي شيء من السجل.',
        'القواعد الإصدار 4، 14 نوفمبر 2026. أُعيد تقييم كل الخطط السابقة مرة واحدة وفق هذه القواعد.'],
      sg_h1: 'إشارات NEXUS CORE', sg_lede: 'إشارات تداول دقيقة مبنية على الخطة اليومية، للأعضاء فقط. تبقى الخطة اليومية مجانية للجميع.', sg_soon: 'للأعضاء فقط، قريبًا', sg_what: 'ما يحصل عليه الأعضاء',
      sg_b: ['تنبيه فوري عند وصول السعر إلى منطقة الخطة وتأكيد الإعداد، الدخول والوقف والأهداف.', 'كل إشارة مرتبطة بالخطة السارية، فتعرف دائمًا سببها.', 'تنبيهات ذات أولوية في التطبيق ومجموعة تيليجرام خاصة.', 'كل إشارة تُسجَّل وتُقيَّم، رابحة كانت أم خاسرة.'],
      sg_wl_title: 'انضم إلى قائمة انتظار الإشارات', sg_wl_sub: 'كن أول من يعلم عند إطلاق الإشارات، مع سعر خاص للأعضاء الأوائل. بلا إزعاج.', sg_free: 'تريد الخطة المجانية فقط؟', sg_free_link: 'شاهد خطة الذهب اليوم',
      sg_note: 'الإشارات أفكار تداول لأغراض المعلومات فقط وليست نصيحة شخصية. قد لا تتوفر في بعض الدول.',
      risk_title: 'تحذير المخاطر',
      disclaimer: 'تحليل للسوق لأغراض المعلومات فقط، ليس نصيحة استثمارية ولا دعوة للتداول. المنتجات ذات الرافعة المالية مثل عقود الذهب تنطوي على مخاطر عالية بخسارة الأموال سريعًا. الأداء السابق لا يضمن النتائج المستقبلية. تداول فقط بما تستطيع تحمّل خسارته.'
    },
    vi: {
      pp_best: 'Giá chạy xa nhất (MFE)', pp_best_note: 'Quãng giá xa nhất theo hướng của vùng sau khi chạm, tới khi bị huỷ hoặc đóng nến ngày, cho thấy nhận định chuẩn tới đâu; không phải kết quả lệnh và không cộng vào R.', tr_best: 'MFE trung bình', kp_real: 'Kết quả thật', tr_winrate: 'Tỉ lệ thắng', tr_netpips: 'Pip ròng', tr_signals: 'Lệnh', tr_entry: 'Vào lệnh', tr_sl: 'Cắt lỗ', tr_max: 'chạy xa nhất', tr_detail: 'Chi tiết', tr_notrade: 'Plan không vào lệnh', tr_perf: 'Hiệu suất', gold_usd: 'Vàng / USD', rv_h: 'Xem trước / sau', rv_go: 'Xem kết quả chi tiết của plan', rv_alt: 'Trước và sau: chart plan lúc đăng và nến 15 phút thật tới khi hết phiên', rv_cap: 'Trên: chart H1 lúc đăng. Dưới: cùng khung H1 với nến thật tới khi hết phiên, mũi tên đánh dấu lúc vẽ plan.', kp_plans: 'plan', kp_zones: 'vùng được chạm', kp_real_note: 'Có cả ngày sai.', kp_move: 'Giá đã chạy bao xa', kp_avg: 'trung bình mỗi vùng', kp_max: 'Xa nhất', kp_avg_usd: 'Trung bình theo giá', kp_move_note: 'Từ lúc chạm vùng tới giá xa nhất. Không phải lợi nhuận lệnh.', z_near_short: 'Suýt chạm vùng', std_r: 'chuẩn (1R = 10 giá)', z_near: 'Phản ứng sát vùng', near_det: 'Gần nhất cách vùng {gap} $ lúc {at}, sau đó chạy {move} $ theo hướng của vùng', near_note: 'Phản ứng sát vùng: giá quay đầu khi còn cách vùng ≤ 2 $ mà chưa chạm. Chỉ hiển thị để minh bạch, không tính là chạm, không vào tỉ lệ chạm mục tiêu, không cộng vào R.', tr_near: 'Phản ứng sát vùng', 
      chart_hint: 'Chạm vào chart để xem toàn màn hình', lb_hint: 'Chạm bất kỳ đâu để đóng, dùng 2 ngón để phóng to', 
      tab_learn: 'Kiến thức', ln_eyebrow: 'Hỏi đáp giao dịch vàng', ln_short: 'Trả lời ngắn', ln_example: 'Ví dụ thật từ plan NEXUS CORE mới nhất', ln_faq: 'Trả lời nhanh', ln_related: 'Câu hỏi liên quan', ln_updated: 'Cập nhật', see_plan: 'Xem plan đầy đủ →', see_track: 'Xem kết quả chấm →',
      ln_index_h1: 'Học cách đọc thị trường vàng', ln_index_lede: 'Trả lời rõ ràng cho những câu người giao dịch vàng hay hỏi, mỗi câu gắn với plan NEXUS CORE thật đã được chấm.', ln_all: 'Mọi câu hỏi', ln_sessions_note: 'Giờ plan: phiên Á 00:00 UTC, cập nhật phiên Âu 06:45 UTC, phiên Mỹ 12:30 UTC.',
      mv_eyebrow: 'Vì sao vàng chạy', mv_h1: 'Vì sao vàng chạy', mv_change: 'Thay đổi trong ngày', mv_oc: 'Mở → đóng', mv_hl: 'Cao / thấp', mv_big: 'Giờ chạy mạnh nhất', mv_reasons: 'Nguyên nhân', mv_sources: 'Nguồn', mv_method: 'Số liệu từ nến 15 phút XAUUSD (dữ liệu OANDA). Ngày giao dịch = 17:00 tới 17:00 giờ New York. Nguyên nhân chỉ lấy từ tin và số liệu đã công bố; không có lý do rõ thì ghi đúng như vậy.', mv_plans: 'Plan của ngày này', mv_recent: 'Vì sao vàng chạy, các ngày gần đây',
      skip: 'Tới nội dung', to_light: 'Chuyển sang giao diện sáng', to_dark: 'Chuyển sang giao diện tối', tab_plan: 'Plan ngày', tab_signals: 'Signal', tab_history: 'Kết quả', tab_ea: 'Gold EA',
      lede: 'Plan vàng (XAUUSD) do AI lập: vùng giá chính, kịch bản và mốc cho biết nhận định sai, cập nhật trước phiên Á, Âu và Mỹ.',
      bias: 'Xu hướng', levels: 'Mức giá chính', scenarios: 'Kịch bản', zones: 'Các vùng trên chart', news: 'Lịch tin',
      main_zone: 'Vùng chính', watch: 'Mức theo dõi', invalid: 'Nhận định sai khi', range: 'Vùng giá dự kiến', target: 'Mục tiêu',
      plan_of: 'Plan vàng', ed: { '0700': 'Plan phiên Á', '1345': 'Cập nhật trước phiên Âu', '1930': 'Plan trước phiên Mỹ' },
      ed_short: { '0700': 'Phiên Á', '1345': 'Phiên Âu', '1930': 'Phiên Mỹ' },
      updated: 'cập nhật', next: 'Lần cập nhật tới', main: 'Chính', alt: 'Phụ', zsell: 'Vùng bán', zbuy: 'Vùng mua', fl_sb: 'Thành kháng cự mới (vùng bán) khi {tf} đóng dưới {x} (nến phải đóng hẳn, râu nến không tính)', fl_ba: 'Thành hỗ trợ mới (vùng mua) khi {tf} đóng trên {x} (nến phải đóng hẳn, râu nến không tính)', fl_sa: 'Chỉ thành vùng bán khi {tf} đóng trên {x}', fl_bb: 'Chỉ thành vùng mua khi {tf} đóng dưới {x}', pill_s: 'Kháng cự, vùng bán', pill_b: 'Hỗ trợ, vùng mua', pill_fs: 'Hỗ trợ, bán khi phá', pill_fb: 'Kháng cự, mua khi phá', br_res: 'Kháng cự bị phá khi {tf} đóng trên {x}, sau đó có thể thành hỗ trợ mới', br_sup: 'Hỗ trợ bị phá khi {tf} đóng dưới {x}, sau đó có thể thành kháng cự mới', hold_sup: 'Nếu {tf} đóng lại trên {x}: hỗ trợ vẫn giữ, bỏ vùng bán', hold_res: 'Nếu {tf} đóng lại dưới {x}: kháng cự vẫn giữ, bỏ vùng mua', grade: 'Hạng', key: 'Vùng chính',
      tz: 'Mọi giờ theo giờ Việt Nam', your_time: 'giờ của bạn',
      tg_title: 'Nhận mọi plan qua Telegram', tg_sub: 'Kênh miễn phí, không cần đăng ký',
      SELL: 'BÁN', BUY: 'MUA', TWO_WAY: '2 CHIỀU', STAND_ASIDE: 'ĐỨNG NGOÀI', lean: 'nghiêng',
      live: 'LIVE', stale: 'PLAN CŨ', err: 'Không tải được dữ liệu. Thử tải lại trang.',
      cta_title: 'Nhận plan tiếp theo trước giờ mở cửa phiên London', cta_sub: 'Thông báo miễn phí ngay khi mỗi plan được đăng, phiên Á, Âu và Mỹ. Bật trong 5 giây.', cta_push: 'Thông báo trên máy này',
      nt_title: 'Thông báo plan mới', nt_sub: 'Nhận thông báo trên máy này ngay khi có plan mới.', nt_on_btn: 'Bật thông báo', nt_off_btn: 'Tắt thông báo', nt_on: 'Đã bật thông báo trên máy này.', nt_denied: 'Trình duyệt đang chặn thông báo của trang này. Hãy cho phép trong cài đặt trình duyệt để bật.', nt_ios: 'Trên iPhone: bấm nút Chia sẻ, chọn “Thêm vào MH chính”, rồi mở NEXUS CORE từ màn hình chính và bật thông báo.', nt_err: 'Không đổi được thông báo. Thử lại sau.',
      wl_title: 'Nhận plan qua email – sắp mở', wl_sub: 'Đang chuẩn bị gửi qua email. Để lại địa chỉ, khi bắt đầu gửi bạn sẽ nhận mỗi plan mới trong hộp thư, kèm quyền dùng app NEXUS CORE sớm nhất. Không spam, huỷ bất cứ lúc nào.', wl_label: 'Địa chỉ email', wl_btn: 'Đăng ký', wl_ok: 'Bạn đã có tên trong danh sách.', wl_bad: 'Vui lòng nhập email hợp lệ.', wl_err: 'Chưa đăng ký được. Thử lại sau.', wl_privacy: 'Email chỉ dùng để gửi tin NEXUS CORE, không chia sẻ cho ai. Bạn có thể yêu cầu xoá bất cứ lúc nào.',
      nt_old_ios: 'Thông báo cần iOS 16.4 trở lên. Cập nhật iPhone trong Cài đặt → Cài đặt chung → Cập nhật phần mềm, rồi bật thông báo tại đây.', nt_unsup: 'Trình duyệt này không hỗ trợ thông báo. Mở trang bằng Chrome, Edge, Firefox hoặc Safari, hoặc theo dõi kênh Telegram.',
      nt_retry: 'Đang kết nối… bấm nút thêm lần nữa.',
      nt_alt: 'Cách này chạy trên mọi điện thoại, kể cả iPhone đời cũ:', nt_tg: 'Nhận qua Telegram', nt_mail: 'Nhận qua email',
      permalink: 'Link cố định của plan này',
      res_mixed: 'Có thắng có thua', res_no_trigger: 'Không kích hoạt', res_gap: 'Bỏ qua – thị trường mở cửa đã vượt mốc huỷ (không tính)', pp_trig: 'Kích hoạt lúc', tg_wait: 'Chờ {tf} đóng {d} {x}', tg_below: 'dưới', tg_above: 'trên', pp_zones: 'Các vùng được chấm', z_earlier: 'Đã tính ở bản cập nhật trước', pp_follow: 'Theo dõi tới', z_main: 'Vùng chính', res_hit: 'Chạm mục tiêu 1', res_void: 'Bị huỷ (sai)', res_no_touch: 'Giá không tới vùng', res_expired: 'Chốt cuối phiên', res_carried: 'Bản sau theo dõi tiếp', z_carried_to: 'Còn mở khi hết phiên, bản sau theo dõi tiếp và chấm ở đó.', tr_r_closed: 'R, chạm mục tiêu / bị huỷ', tr_r_session: 'R, chốt cuối phiên', z_carried_from: 'Lệnh còn mở chuyển từ bản trước', z_see_next: 'Xem bản sau →', res_aside: 'Đứng ngoài', pending: 'Chờ chấm',
      res_pending_note: 'Chấm sau khi nến ngày đóng (17:00 giờ New York).',
      pp_result: 'Kết quả của plan này', pp_touched: 'Giá chạm vùng', pp_event: 'Chốt kết quả lúc', pp_window: 'Khung giờ chấm', pp_hl: 'Cao / thấp trong khung', pp_last: 'Giá cuối khung', pp_t1: 'Mục tiêu 1', pp_void: 'Mốc huỷ',
      prev_plan: '← Plan trước', next_plan: 'Plan sau →', today_plan: 'Plan hôm nay', all_month: 'Mọi plan trong tháng',
      tr_h1: 'Kết quả plan vàng', tr_lede: 'Mọi plan vàng NEXUS CORE trong tháng và kết quả thật. Đúng, sai hay không chạy đều giữ lại, không xoá plan nào.',
      tr_plans: 'Plan đã đăng', tr_graded: 'Đã chấm', tr_reached: 'Vùng được chạm', tr_hit: 'Chạm mục tiêu 1', tr_void: 'Bị huỷ', tr_r: 'Tổng R',
      tr_list: 'Từng plan', tr_none: 'Tháng này chưa có plan.', tr_method: 'Cách chấm plan', tr_prev_m: '← Tháng trước', tr_next_m: 'Tháng sau →', view: 'Xem plan',
      tr_m: ['Mọi vùng giao dịch được của từng plan đã đăng được chấm tự động trên giá XAUUSD thật (dữ liệu OANDA) sau khi phiên của plan kết thúc. Vùng chỉ để theo dõi không tính điểm.',
        'Vùng chỉ được tính nếu giá chạm tới trong phiên của plan. Sau đó vùng được chốt là “Đạt mục tiêu 1”, “Mất hiệu lực” hoặc “Đóng khi hết phiên”.',
        'R so sánh mỗi kết quả với mức rủi ro dự kiến của vùng (+1R = lãi bằng đúng rủi ro, −1R = mất đúng rủi ro). R của plan là tổng các vùng; lãi và lỗ đều được tính như nhau.',
        'Kết quả là giả định: chưa tính spread, trượt giá và phí, không phải lệnh tiền thật.',
        'Plan đứng ngoài không tính điểm. Không có gì bị xoá khỏi bảng kết quả.',
        'Luật v4, 14/11/2026. Mọi plan trước đó đã được chấm lại một lần theo luật này.'],
      sg_h1: 'NEXUS CORE Signals', sg_lede: 'Tín hiệu vào lệnh cụ thể dựa trên plan ngày, chỉ dành cho thành viên. Plan ngày vẫn miễn phí cho mọi người.', sg_soon: 'Chỉ cho thành viên, sắp mở', sg_what: 'Thành viên nhận được',
      sg_b: ['Báo ngay khi giá vào vùng plan và tín hiệu xác nhận, điểm vào, dừng lỗ và mục tiêu.', 'Mỗi tín hiệu gắn với plan đang hiệu lực, luôn biết vì sao có lệnh.', 'Thông báo ưu tiên trong app và nhóm Telegram riêng.', 'Mọi tín hiệu được ghi lại và chấm, thắng hay thua.'],
      sg_wl_title: 'Đăng ký chờ gói Signals', sg_wl_sub: 'Biết đầu tiên khi Signals mở, kèm giá ưu đãi cho thành viên sớm. Không spam.', sg_free: 'Chỉ cần plan miễn phí?', sg_free_link: 'Xem plan vàng hôm nay →',
      sg_note: 'Tín hiệu chỉ là ý tưởng giao dịch để tham khảo, không phải lời khuyên cá nhân. Có thể chưa mở ở một số quốc gia.',
      risk_title: 'Cảnh báo rủi ro',
      disclaimer: 'Nội dung chỉ để tham khảo, không phải lời khuyên đầu tư hay lời mời giao dịch. Sản phẩm có đòn bẩy như vàng CFD có rủi ro mất tiền nhanh. Kết quả quá khứ không đảm bảo tương lai. Chỉ giao dịch bằng số tiền bạn chấp nhận mất.'
    },
    'zh-hant': {
      pp_best: '最大順向波動（MFE）', pp_best_note: '區域被觸及後，價格朝該區域方向走得最遠的距離，計至失效或每日收盤，反映判讀品質，並非交易結果，也不計入 R。', tr_best: '平均 MFE', kp_real: '實際結果', tr_winrate: '勝率', tr_netpips: '淨點數', tr_signals: '交易', tr_entry: '進場', tr_sl: '停損', tr_max: '最大走勢', tr_detail: '詳情', tr_notrade: '未進場的計畫', tr_perf: '績效', gold_usd: '黃金 / 美元', rv_h: '查看前後對照', rv_go: '查看本計畫完整結果', rv_alt: '前後對照：計畫發布時的圖表與至時段結束的實際 15 分鐘 K 線', rv_cap: '上方：發布時的 H1 圖表。下方：同為 H1，顯示至時段結束的實際 K 線，箭頭標示計畫繪製時間。', kp_plans: '份計畫', kp_zones: '個區域被觸及', kp_real_note: '虧損日也計入。', kp_move: '價格走了多遠', kp_avg: '每個區域平均', kp_max: '最大', kp_avg_usd: '美元平均', kp_move_note: '自觸及區域起至最遠價格。並非交易獲利。', z_near_short: '差一點觸及區域', std_r: '標準（1R = 10 美元）', z_near: '逼近區域後反轉', near_det: '最接近時距區域 {gap} $（{at}），其後朝區域方向走了 {move} $', near_note: '逼近區域後反轉：價格在距區域 2 $ 以內反轉、未觸及區域。僅為透明揭露，不算觸及、不計入達標率，也永不計入 R。', tr_near: '逼近區域後反轉',
      chart_hint: '點擊圖表可全螢幕檢視', lb_hint: '點擊任意處關閉，雙指可放大',
      tab_learn: '學習', ln_eyebrow: '黃金交易問答', ln_short: '簡短回答', ln_example: '最新 NEXUS CORE 計畫的即時範例', ln_faq: '快速問答', ln_related: '相關問題', ln_updated: '更新於', see_plan: '查看完整計畫 →', see_track: '查看成績紀錄 →',
      ln_index_h1: '學會解讀黃金市場', ln_index_lede: '用白話回答黃金交易者最常問的問題，每一題都對應一份真實、已公開評分的 NEXUS CORE 計畫。', ln_all: '全部問題', ln_sessions_note: '計畫發布時間：亞洲盤 08:00，倫敦盤前 14:45，紐約盤前 20:30（台北／香港時間）。',
      mv_eyebrow: '黃金為何波動', mv_h1: '黃金為何波動', mv_change: '當日漲跌', mv_oc: '開盤 → 收盤', mv_hl: '最高 / 最低', mv_big: '單小時最大波動', mv_reasons: '波動原因', mv_sources: '資料來源', mv_method: '數據來自 XAUUSD 15 分鐘 K 線（OANDA）。交易日 = 紐約時間 17:00 至隔日 17:00。原因僅取自已公布的新聞與數據；找不到明確原因時會如實說明。', mv_plans: '當日計畫', mv_recent: '黃金為何波動，近期',
      skip: '跳至內容', to_light: '切換為淺色主題', to_dark: '切換為深色主題', tab_plan: '每日計畫', tab_signals: '訊號', tab_history: '成績紀錄', tab_ea: '黃金 EA',
      lede: 'AI 輔助製作的黃金（XAUUSD）交易計畫：關鍵區域、情境推演，以及判斷觀點失效的價位，於亞洲、倫敦、紐約盤前更新。',
      bias: '方向', levels: '關鍵價位', scenarios: '情境', zones: '圖表上的區域', news: '經濟日曆',
      main_zone: '主要區域', watch: '觀察價位', invalid: '觀點失效條件', range: '預期區間', target: '目標',
      plan_of: '黃金計畫', ed: { '0700': '亞洲盤計畫', '1345': '倫敦盤前更新', '1930': '紐約盤前計畫' },
      ed_short: { '0700': '亞洲盤', '1345': '倫敦盤', '1930': '紐約盤' },
      updated: '更新於', next: '下次更新', main: '主要', alt: '備選', zsell: '偏空區域', zbuy: '偏多區域', fl_sb: '{tf} 收在 {x} 之下後轉為新的壓力（偏空區域）（須收盤確認，影線不算）', fl_ba: '{tf} 收在 {x} 之上後轉為新的支撐（偏多區域）（須收盤確認，影線不算）', fl_sa: '{tf} 收在 {x} 之上後才成為偏空區域', fl_bb: '{tf} 收在 {x} 之下後才成為偏多區域', pill_s: '壓力，偏空區域', pill_b: '支撐，偏多區域', pill_fs: '支撐，跌破後偏空', pill_fb: '壓力，突破後偏多', br_res: '{tf} 收在 {x} 之上即突破壓力，之後可能轉為新的支撐', br_sup: '{tf} 收在 {x} 之下即跌破支撐，之後可能轉為新的壓力', hold_sup: '{tf} 重新收在 {x} 之上：支撐守住，偏空區域取消', hold_res: '{tf} 重新收在 {x} 之下：壓力守住，偏多區域取消', grade: '等級', key: '主要區域',
      tz: '所有時間皆為台北／香港時間', your_time: '您的時間',
      tg_title: '在 Telegram 接收每一份計畫', tg_sub: '免費頻道，無需註冊',
      SELL: '偏空', BUY: '偏多', TWO_WAY: '雙向', STAND_ASIDE: '觀望', lean: '傾向',
      live: 'LIVE', stale: '最新計畫', err: '資料載入失敗，請重新整理頁面。',
      cta_title: '在倫敦開盤前收到下一份計畫', cta_sub: '每份計畫發布時立即免費通知，亞洲、倫敦、紐約盤。五秒完成設定。', cta_push: '在此裝置接收通知',
      nt_title: '新計畫通知', nt_sub: '新計畫發布時，立即在此裝置收到通知。', nt_on_btn: '開啟通知', nt_off_btn: '關閉通知', nt_on: '此裝置已開啟通知。', nt_denied: '瀏覽器已封鎖本站通知，請在瀏覽器設定中允許後再開啟。', nt_ios: 'iPhone：點擊「分享」，選擇「加入主畫面」，再從主畫面開啟 NEXUS CORE 並開啟通知。', nt_err: '無法變更通知設定，請再試一次。',
      wl_title: '以電子郵件接收計畫（即將推出）', wl_sub: '電子郵件寄送正在準備中。留下信箱，開始寄送後每份新計畫都會寄到您的信箱，並優先取得 NEXUS CORE App。不寄垃圾郵件，可隨時取消。', wl_label: '電子郵件', wl_btn: '加入名單', wl_ok: '您已加入名單。', wl_bad: '請輸入有效的電子郵件地址。', wl_err: '登記失敗，請再試一次。', wl_privacy: '您的電子郵件僅用於 NEXUS CORE 通知，絕不分享給他人，可隨時要求刪除。',
      nt_old_ios: '通知功能需要 iOS 16.4 以上。請至「設定 → 一般 → 軟體更新」更新後再開啟。', nt_unsup: '此瀏覽器不支援通知。請使用 Chrome、Edge、Firefox 或 Safari 開啟本站，或追蹤 Telegram 頻道。',
      nt_retry: '連線中……請再點一次按鈕。',
      nt_alt: '所有手機皆可使用，包括舊款 iPhone：', nt_tg: '透過 Telegram 接收', nt_mail: '透過電子郵件接收',
      permalink: '此計畫的永久連結',
      res_mixed: '有盈有虧', res_no_trigger: '未啟動', res_gap: '略過 – 開盤即越過失效價位（不計入）', pp_trig: '啟動時間', tg_wait: '等待 {tf} 收在 {x} 之{d}', tg_below: '下', tg_above: '上', pp_zones: '評分區域', z_earlier: '已於先前更新計入', pp_follow: '追蹤至', z_main: '主要區域', res_hit: '達到目標 1', res_void: '觀點失效', res_no_touch: '價格未觸及區域', res_expired: '時段結束結算', res_carried: '由下一份更新接續追蹤', z_carried_to: '時段結束時仍未結束，由下一份更新接續追蹤並於該份評分。', tr_r_closed: 'R，達標或失效', tr_r_session: 'R，時段結束結算', z_carried_from: '自上一份更新接續的未結束交易', z_see_next: '查看下一份更新 →', res_aside: '觀望', pending: '待評分',
      res_pending_note: '於每日收盤（紐約時間 17:00）後評分。',
      pp_result: '本計畫的結果', pp_touched: '觸及區域', pp_event: '結果判定時間', pp_window: '評分時段', pp_hl: '時段內最高 / 最低', pp_last: '時段結束價', pp_t1: '目標 1', pp_void: '失效價位',
      prev_plan: '← 上一份計畫', next_plan: '下一份計畫 →', today_plan: '今日計畫', all_month: '本月所有計畫',
      tr_h1: '黃金計畫成績紀錄', tr_lede: '本月每一份 NEXUS CORE 黃金計畫及其結果。對、錯、未觸發都保留在紀錄上，不刪除任何一筆。',
      tr_plans: '已發布計畫', tr_graded: '已評分', tr_reached: '被觸及的區域', tr_hit: '達到目標 1', tr_void: '觀點失效', tr_r: '累計 R',
      tr_list: '每一份計畫', tr_none: '本月尚無計畫。', tr_method: '評分方式', tr_prev_m: '← 上個月', tr_next_m: '下個月 →', view: '查看計畫',
      tr_m: ['每份已發布計畫中的每個可交易區域，都會在其時段結束後以真實 XAUUSD 價格（OANDA 數據）自動評分。僅供觀察的區域不計分。',
        '只有價格在計畫時段內到達的區域才會計入，之後結算為「達到目標 1」、「失效」或「時段結束平倉」。',
        'R 以每個結果對比該區域的計畫風險（+1R = 獲利等於風險，−1R = 虧損等於風險）。計畫的 R 為各區域加總，盈虧同等計算。',
        '結果為假設性質：未計入點差、滑價與費用，並非真實資金交易。',
        '觀望計畫不計分。紀錄中的任何內容都不會被刪除。',
        '規則第 4 版，2026 年 11 月 14 日。所有較早的計畫都已依此規則重新評分一次。'],
      sg_h1: 'NEXUS CORE 訊號', sg_lede: '以每日計畫為基礎的精確交易訊號，僅限會員。每日計畫永久免費。', sg_soon: '僅限會員，即將推出', sg_what: '會員可獲得',
      sg_b: ['價格進入計畫區域且型態確認時即時通知，進場、停損與目標。', '每個訊號都對應當時有效的計畫，清楚知道訊號的依據。', 'App 內優先通知與專屬 Telegram 群組。', '每個訊號都會記錄並評分，無論盈虧。'],
      sg_wl_title: '加入訊號等候名單', sg_wl_sub: '訊號開放時第一時間通知您，並享早鳥價格。不寄垃圾郵件。', sg_free: '只需要免費計畫？', sg_free_link: '查看今日黃金計畫 →',
      sg_note: '訊號僅為交易想法，供參考之用，並非個人化建議。部分國家或地區可能無法提供。',
      risk_title: '風險警示',
      disclaimer: '僅供分析，不構成投資建議或交易邀約。黃金差價合約等槓桿產品具有快速虧損的高風險。過往績效不保證未來結果。請僅以可承受損失的資金進行交易。'
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
  // Page kind is set by tools/build.py: home (intro + plan preview), today (latest plan), plan (one archived plan), track, signals, learn, legal.
  var KIND = document.body.getAttribute('data-page') || 'home';
  // Where a visitor came from (?src=x / utm_source, else the referring site) and which page they signed up on – stored with email/alerts.
  var SRC = '', PAGE = location.pathname.slice(0, 80);
  try {
    var qs = new URLSearchParams(location.search);
    var s0 = (qs.get('src') || qs.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
    if (!s0 && document.referrer) { try { var rh = new URL(document.referrer).hostname.replace(/^www\./, ''); if (rh && rh !== location.hostname) s0 = rh.replace(/[^a-z0-9.-]/g, '').slice(0, 40); } catch (e) {} }
    SRC = s0 || sessionStorage.getItem('nc_src') || 'direct';
    if (s0) sessionStorage.setItem('nc_src', s0);
  } catch (e) { SRC = SRC || 'direct'; }
  // Owner's own devices are not counted (23/11/2026): open any page with ?nc_me=1 (undo: ?nc_me=0), or – inside the
  // installed app, which has no address bar – tap an empty part of the footer 7 times quickly to switch it on/off.
  var ME = false;
  try {
    var me0 = new URLSearchParams(location.search).get('nc_me');
    if (me0 === '1') localStorage.setItem('nc_me', '1'); else if (me0 === '0') localStorage.removeItem('nc_me');
    ME = localStorage.getItem('nc_me') === '1';
  } catch (e) {}
  (function (fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); })(function () {
    var ft = document.querySelector('footer.foot') || document.querySelector('footer'), taps = [];
    if (!ft) return;
    ft.addEventListener('click', function (ev) {
      if (ev.target.closest('a,button,input,select')) return;
      var now = Date.now(); taps = taps.filter(function (x) { return now - x < 4000; }); taps.push(now);
      if (taps.length < 7) return;
      taps = [];
      var on = false;
      try { if (localStorage.getItem('nc_me') === '1') localStorage.removeItem('nc_me'); else { localStorage.setItem('nc_me', '1'); on = true; } } catch (e) {}
      var d = document.createElement('div');
      d.textContent = on ? 'This device is no longer counted in visits' : 'This device is counted again';
      d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#0C2237;color:#fff;padding:10px 16px;border-radius:10px;z-index:9999;font-size:14px';
      document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2500);
    });
  });
  // language dropdown: close when tapping outside or pressing Escape
  document.addEventListener('click', function (ev) { var d = document.getElementById('lang-dd'); if (d && d.open && !d.contains(ev.target)) d.open = false; });
  document.addEventListener('keydown', function (ev) { var d = document.getElementById('lang-dd'); if (ev.key === 'Escape' && d && d.open) { d.open = false; d.querySelector('summary').focus(); } });
  // one visit count per browser session (counts only – source, language, page; no IP, no id) → /api/stats for the weekly report
  try {
    if (!ME && !sessionStorage.getItem('nc_hit') && !/bot|crawl|spider|preview|lighthouse|headless/i.test(navigator.userAgent)) {
      sessionStorage.setItem('nc_hit', '1');
      var hitApp = navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
      var hitLang = /^\/ar(\/|$)/.test(location.pathname) ? 'ar' : /^\/vi(\/|$)/.test(location.pathname) ? 'vi' : /^\/zh-hant(\/|$)/.test(location.pathname) ? 'zh-hant' : 'en';
      fetch('/api/hit', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src: SRC, page: PAGE, lang: hitLang, app: hitApp ? 1 : 0 }) }).catch(function () {});
    }
  } catch (e) {}
  // The address decides the language: / and /en/… = English, /ar/… = Arabic, /vi/… = Vietnamese.
  var PATH_LANG = /^\/ar(\/|$)/.test(location.pathname) ? 'ar' : /^\/vi(\/|$)/.test(location.pathname) ? 'vi' : /^\/zh-hant(\/|$)/.test(location.pathname) ? 'zh-hant' : 'en';
  // a returning visitor who picked Arabic/Vietnamese and lands on the English home page goes to their language
  if ((KIND === 'home' || KIND === 'today') && PATH_LANG === 'en' && (saved === 'ar' || saved === 'vi' || saved === 'zh-hant') && /^\/(index\.html|today\/?)?$/.test(location.pathname)) {
    location.replace('/' + saved + location.pathname.replace(/^\/(index\.html)?/, '/').replace(/^\/\//, '/') + location.search + location.hash);
  }
  // the server sends first-time visitors to their language by IP country unless cookie nc_lang says what they picked:
  // keep the cookie in step with the saved choice, and a visitor who picked English but was sent to another language goes back
  function langCookie(l) { try { document.cookie = 'nc_lang=' + l + '; path=/; max-age=31536000; SameSite=Lax; Secure'; } catch (e) {} }
  if (saved === 'en' || saved === 'ar' || saved === 'vi' || saved === 'zh-hant') {
    langCookie(saved);
    if (saved === 'en' && PATH_LANG !== 'en' && (KIND === 'home' || KIND === 'today') && /^\/(ar|vi|zh-hant)\/(today\/)?$/.test(location.pathname)) {
      location.replace(location.pathname.replace(/^\/(ar|vi|zh-hant)/, '') + location.search + location.hash);
    }
  }
  // old in-page tabs (#signals, #history) now have their own pages
  if (KIND === 'home' && (location.hash === '#signals' || location.hash === '#history')) {
    var tl = document.querySelector('.tabs [data-tab="' + (location.hash === '#signals' ? 'signals' : 'track') + '"]');
    if (tl) location.replace(tl.getAttribute('href'));
  }
  var lang = PATH_LANG;
  var data = { plan: null };

  var themeBtn;
  function t(k) { return T[lang][k] != null ? T[lang][k] : k; }
  // Plain, human punctuation for text written by the plan schedules (same rules as tidy() in tools/build.py):
  // no spaced dashes or middle dots between clauses, ranges as 3880–3887, "~15" as "about 15".
  var ABOUT = { en: 'about ', vi: 'khoảng ', ar: 'نحو ', 'zh-hant': '約' };
  function tidy(s) {
    if (!s) return '';
    var zh = lang === 'zh-hant', ar = lang === 'ar';
    var comma = zh ? '，' : ar ? '، ' : ', ', colon = zh ? '：' : ': ';
    s = s.split('——').join(zh ? '，' : ' – ');
    s = s.replace(/(\d)\s+[–—]\s+(\d)/g, '$1–$2').replace(/\s*·\s*/g, comma);
    var out = '', pos = 0, re = /\s+[–—-]\s+/g, m;
    while ((m = re.exec(s))) {
      out += s.slice(pos, m.index);
      var cut = -1, cs = '.;:!?\n。；：؛,，،(（';
      for (var k = 0; k < cs.length; k++) cut = Math.max(cut, out.lastIndexOf(cs[k]));
      var cl = out.slice(cut + 1).trim();
      var short = zh ? cl.length <= 6 : cl.split(/\s+/).length <= (lang === 'vi' ? 3 : 2);
      out += cl && short && !/[:：]/.test(cl) ? colon : comma;
      pos = m.index + m[0].length;
    }
    s = out + s.slice(pos);
    s = s.replace(/~\s*(?=[\d$+−-])/g, ABOUT[lang] || 'about ').replace(/([,，،:：])\s*([,，،])/g, '$1');
    s = s.replace(/  +/g, ' ').trim();
    if (!ar) s = s.replace(/(\d)–(\d)/g, '$1\u2060–\u2060$2');   // never break a price range across lines
    return s;
  }
  function L(o) {
    if (o == null) return '';
    var s = tidy(typeof o === 'string' ? o : (o[lang === 'zh-hant' ? 'zh' : lang] || o.en || o.vi || ''));
    // keep price ranges left-to-right inside Arabic sentences (4058–4068, not 4068–4058)
    if (lang === 'ar') s = s.replace(/(\d(?:[\d.,:]*\d)?)\s*[–-]\s*(\d(?:[\d.,:]*\d)?)/g, '⁦$1–$2⁩');
    return s;
  }
  function locale() { return lang === 'vi' ? 'vi-VN' : lang === 'ar' ? 'ar-u-nu-latn' : lang === 'zh-hant' ? 'zh-Hant' : (nav.indexOf('en') === 0 ? navigator.language : 'en-GB'); }
  function fmt(n) { if (n == null || n === '') return ''; return typeof n === 'number' ? String(Math.round(n * 10) / 10) : String(n); }
  // the card already says Main / Alternate: drop the same word at the start of the scenario text
  function scenText(s) { s = s.replace(/^(Chính|Phụ|Main|Alt(ernate)?|Primary|Secondary|主要|次要|الرئيسي|البديل)[^:：]{0,14}[:：]\s*/i, ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  // A scenario sentence as a short path (same as scen_steps in tools/build.py): one group per sentence or ';' clause,
  // one step per '→' (or '←' in Arabic); prices in bold. Built with text nodes only.
  var PRICE = /(\d{3,5}(?:\.\d+)?(?:\u2060?[–-]\u2060?\d{3,5}(?:\.\d+)?)?)/;
  function scenSteps(text) {
    var ol = el('ol', 'steps'), first = true;
    text.split(/(?:(?<=\.)\s+|。|[;；؛]\s*)/).forEach(function (g) {
      var parts = g.split(/\s*[→←]\s*/).map(function (x) { return x.replace(/^[\s,，،.。]+|[\s,，،.。]+$/g, ''); }).filter(Boolean);
      parts.forEach(function (x, i) {
        x = x.charAt(0).toUpperCase() + x.slice(1);
        var li = el('li', (i === 0 ? 'c' : 'o') + (i === parts.length - 1 ? ' e' : '') + (i === 0 && !first ? ' g' : ''));
        x.split(PRICE).forEach(function (bit, k) { if (bit) li.appendChild(k % 2 ? el('b', 'px', bit) : document.createTextNode(bit)); });
        ol.appendChild(li);
      });
      if (parts.length) first = false;
    });
    return ol;
  }
  // Headline wording a reader understands (same rules as _HL_FIX / headline_html in tools/build.py).
  var HL_FIX = {
    vi: [[/[,;]?\s*\bsai trên\s+/g, '; Nhận định sai nếu giá vượt lên trên '], [/[,;]?\s*\bsai dưới\s+/g, '; Nhận định sai nếu giá xuống dưới '],
         [/[,;]?\s*(?<!định )\bsai nếu\s+/g, '; Nhận định sai nếu ']],
    en: [[/[,;]?\s*\bvoid above\s+/g, '; The view is wrong if price goes above '], [/[,;]?\s*\bvoid below\s+/g, '; The view is wrong if price goes below '],
         [/[,;]?\s*\bvoid on\s+/g, '; The view is wrong on '], [/^SELL rallies into\b/, 'Sell the rally into'], [/^BUY dips into\b/, 'Buy the dip into']],
    ar: [[/[،,؛]?\s*و?تُلغى فوق\s+/g, '؛ تُلغى الفكرة إذا صعد السعر فوق '], [/[،,؛]?\s*و?تُلغى (?:تحت|دون|أسفل)\s+/g, '؛ تُلغى الفكرة إذا هبط السعر دون ']],
    'zh-hant': [[/[，,]\s*(?=[\d\u2060]+(?:\.\d+)?\s*之[上下]觀點失效)/g, '；'], [/(\d+(?:\.\d+)?)\s*之上觀點失效/g, '價格站上 $1 則觀點失效'],
                [/(\d+(?:\.\d+)?)\s*之下觀點失效/g, '價格跌破 $1 則觀點失效']]
  };
  function clearHeadline(p) {
    var s = L(p.headline);
    (HL_FIX[lang] || []).forEach(function (r) { s = s.replace(r[0], r[1]); });
    return s.replace(/^[;؛；\s]+/, '');
  }
  function headlineInto(node, s) {
    node.textContent = '';
    var parts = s.split(/\s*[;；؛]\s*/).map(function (x) { return x.replace(/^[\s,，،]+|[\s,，،]+$/g, ''); }).filter(Boolean)
      .map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1); });
    if (!parts.length) return;
    node.appendChild(el('span', 'hl1', parts[0]));
    if (parts.length < 2) return;
    var ul = el('ul', 'hl');
    parts.slice(1).forEach(function (x) {
      var li = el('li', /Nhận định sai|view is wrong|تُلغى|失效/.test(x) ? 'inv' : null);
      x.split(PRICE).forEach(function (bit, k) { if (bit) li.appendChild(k % 2 ? el('b', 'px', bit) : document.createTextNode(bit)); });
      ul.appendChild(li);
    });
    node.appendChild(ul);
  }
  // Long level texts as one line per idea (same as ideas_html in tools/build.py).
  function pxInto(node, x) { x.split(PRICE).forEach(function (bit, k) { if (bit) node.appendChild(k % 2 ? el('b', 'px', bit) : document.createTextNode(bit)); }); return node; }
  var INV_RE = /huỷ|hủy|\bvoid\b|失效|تُلغى|تلغى|bị phá|\bbreaks\b|تنكسر|ينكسر|即突破|即跌破|bỏ vùng|is cancelled|取消/i, VALID_RE = /hiệu lực|\bvalid\b|有效|صالحة/i;
  function ideasEl(text, mark, skipLab) {
    var ul = el('ul', 'ideas'), arrow = lang === 'ar' ? '←' : '→';
    if (skipLab && text.toLowerCase().indexOf(skipLab.toLowerCase()) === 0) text = text.slice(skipLab.length).replace(/^[\s:：,，،–-]+/, '');
    function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
    function trim(x) { return x.replace(/^[\s,，،.。]+|[\s,，،.。]+$/g, ''); }
    text.split(/(?:(?<=\.)\s+|。|[;；؛]\s*)/).forEach(function (g) {
      g = trim(g); if (!g) return;
      var lab = '', m = /^([^\d:：]{2,80}?)\s*[:：]\s*(.+)$/.exec(g);
      if (m) {
        if (skipLab && m[1].trim().toLowerCase() === skipLab.toLowerCase()) lab = '';
        else if (m[1].length > 26 || /[,，،]/.test(m[1])) ul.appendChild(el('li', 'nt', cap(m[1].trim()))); else lab = m[1].trim();
        g = m[2];
      }
      var parts = g.split(/\s*[→←]\s*/).map(trim).filter(Boolean).map(cap);
      if (!parts.length) return;
      var cls = (parts.length > 1 ? 'ar' : '') + (mark && INV_RE.test(g) ? ' inv' : mark && VALID_RE.test(g) ? ' tm' : '');
      var li = el('li', cls.trim() || null);
      if (lab) { li.appendChild(el('b', 'lbl', cap(lab) + (lang === 'zh-hant' ? '：' : ':'))); li.appendChild(document.createTextNode(' ')); }
      if (parts.length > 1) {
        li.appendChild(pxInto(el('span', 'cd'), parts[0]));
        var to = el('span', 'to', arrow); to.setAttribute('aria-hidden', 'true'); li.appendChild(to);
        li.appendChild(pxInto(el('span', 'rs'), parts.slice(1).join(' ' + arrow + ' ')));
      } else pxInto(li, parts[0]);
      ul.appendChild(li);
    });
    return ul;
  }
  // Market context card: label, a coloured verdict (text before ":"), then one line per idea; a list of "name price" pairs as a table.
  function verdictCls(v) {
    if (/hồi|rebound|反彈|ارتداد|trung tính|neutral|中性|محايد|đi ngang|range|整理/i.test(v)) return 'neutral';
    if (/giảm|bear|偏空|下跌|هابط/i.test(v)) return 'sell';
    if (/tăng|bull|偏多|上漲|صاعد/i.test(v)) return 'buy';
    return 'neutral';
  }
  function ctxCard(k, v) {
    var card = el('div', 'stat ctx'), head = add(el('div', 'ch'), el('span', 'k', k));
    card.appendChild(head);
    var m = /^([^\d:：]{2,40}?)\s*[:：]\s*(.+)$/.exec(v);
    if (!m && lang === 'zh-hant') m = /^(偏空|偏多|中性|雙向|震盪|整理)[，,]\s*(.+)$/.exec(v);
    if (m && !/[,，،]/.test(m[1])) { head.appendChild(el('span', 'vd ' + verdictCls(m[1]), m[1].charAt(0).toUpperCase() + m[1].slice(1))); v = m[2]; }
    var items = v.split(/\s*[;；؛]\s*/).map(function (x) { return x.replace(/[\s.。]+$/, ''); }).filter(Boolean);
    var kv = items.length > 1 && items.every(function (x) { var q = /^(.+?)\s+(\d{3,5}(?:\.\d+)?)$/.exec(x.trim()); return q && /[^\d\s\/.:-]/.test(q[1]); });
    if (kv) {
      var tb = el('div', 'kv');
      items.forEach(function (x) { var mm = /^(.*?)\s+(\d{3,5}(?:\.\d+)?)$/.exec(x.trim()); add(tb, el('span', 'kk', mm[1].charAt(0).toUpperCase() + mm[1].slice(1)), el('b', 'px', mm[2])); });
      card.appendChild(tb);
    } else card.appendChild(ideasEl(v));
    return card;
  }
  // Warning box: badge, the release and its time in this page's clock, then only the advice about it (same as alert_html).
  var NEWS_RE = /tin đỏ|giờ tin|sau tin|trước tin|tin tức|news|release|\bdata\b|數據|公布|بيانات|الخبر|الإصدار/i;
  var STOP = { early: 1, late: 1, session: 1, york: 1, high: 1, impact: 1, 'with': 1, from: 1, speaks: 1, into: 1, today: 1, tomorrow: 1, turn: 1, core: 1 };
  function words(x) { var o = {}; ((x || '').toLowerCase().match(/[a-z]{4,}/g) || []).forEach(function (w) { if (!STOP[w]) o[w] = 1; }); return o; }
  function overlap(a, b) { var k = 0; for (var w in a) if (b[w]) k++; return k; }
  function alertNews(p) {
    var highs = (p.news || []).filter(function (n) { return n.impact === 'high'; });
    if (!highs.length) return null;
    var aw = words(p.alert && p.alert.en), best = highs[0], bs = -1;
    highs.forEach(function (n) { var k = overlap(aw, words(n.text && n.text.en)); if (k > bs) { bs = k; best = n; } });
    return bs > 0 ? best : highs[0];
  }
  function alertInto(node, p) {
    node.textContent = '';
    var o = p.alert, raw = typeof o === 'string' ? o : (o[lang === 'zh-hant' ? 'zh' : lang] || o.en || o.vi || '');
    function split(x) { return x.split(/(?<!\d)\s+[–—]\s+(?!\d)|——|[;；؛]\s*/).map(function (y) { return y.replace(/^[\s,，،.。]+|[\s,，،.。]+$/g, ''); }).filter(Boolean); }
    function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
    var sents = raw.split(/(?<=\.)\s+|。/).filter(function (x) { return x.trim(); });
    var first = sents.length ? split(sents[0]) : [];
    if (!first.length) return;
    var notes = first.slice(1);
    sents.slice(1).forEach(function (x) { split(x).forEach(function (y) { if (NEWS_RE.test(y)) notes.push(y); }); });
    var head = L(first[0]), t = el('div', 'al-t'), m = /^([^\d:：]{2,30}?)\s*[:：]\s*(.+)$/.exec(head);
    if (m) { t.appendChild(el('span', 'al-b', m[1])); head = m[2]; }
    var n = alertNews(p);
    if (n) head = L(n.text);
    t.appendChild(pxInto(el('b', 'al-h'), cap(head)));
    if (n) { var nt = newsTime(n.time, p.date.slice(0, 4)); var te = el('span', 'al-time', / \d{2}:\d{2}$/.test(nt) ? nt + ' ' + tzName(new Date()) : nt); te.dir = 'auto'; t.appendChild(te); }
    node.appendChild(t);
    if (notes.length) {
      var ul = el('ul', 'ideas');
      notes.forEach(function (x) { ul.appendChild(pxInto(el('li'), cap(L(x)))); });
      node.appendChild(ul);
    }
  }
  // Zones as support / resistance with the condition to turn into the other (same as zone_view in tools/build.py).
  var ACT = { vi: /[,;]?\s*(?:chỉ\s+)?có hiệu lực sau khi (M15|H1|H4|D1) đóng (dưới|trên) (\d+(?:\.\d+)?)/i,
    en: /[,;]?\s*(?:only\s+)?valid (?:only\s+)?after an? (M15|H1|H4|D1) close (below|above) (\d+(?:\.\d+)?)/i,
    ar: /[،,]?\s*(?:تصبح\s+)?صالحة فقط بعد إغلاق (M15|H1|H4|D1) (أسفل|دون|تحت|فوق|أعلى) (\d+(?:\.\d+)?)/,
    'zh-hant': /[，,]?\s*僅在\s*(M15|H1|H4|D1) 收在 (\d+(?:\.\d+)?) 之(下|上)後生效/ };
  var VOID = { vi: /(?:huỷ|hủy) nếu (M15|H1|H4|D1) đóng (?:lại )?(trên|dưới) (\d+(?:\.\d+)?)/gi,
    en: /void on an? (M15|H1|H4|D1) close (?:back )?(above|below) (\d+(?:\.\d+)?)/gi,
    ar: /تُلغى بإغلاق (M15|H1|H4|D1) (?:مجددًا )?(فوق|أعلى|دون|أسفل|تحت) (\d+(?:\.\d+)?)/g,
    'zh-hant': /(M15|H1|H4|D1) (?:重新)?收在 (\d+(?:\.\d+)?) 之(上|下)則失效/g };
  var BELOW = { 'dưới': 1, below: 1, 'أسفل': 1, 'دون': 1, 'تحت': 1, '下': 1 };
  function tdx(m) { return lang === 'zh-hant' ? [m[1], m[3] === '下' ? 'below' : 'above', m[2]] : [m[1], BELOW[m[2].toLowerCase()] ? 'below' : 'above', m[3]]; }
  function fillT(k, a) { return t(k).replace('{tf}', a[0]).replace('{x}', a[2]); }
  function zoneView(z) {
    var st = L(z.status), sell = z.side === 'SELL', flipLine = '', flip = false, m = ACT[lang].exec(st);
    if (m) {
      var a = tdx(m);
      flip = (sell && a[1] === 'below') || (!sell && a[1] === 'above');
      flipLine = fillT(flip ? (sell ? 'fl_sb' : 'fl_ba') : (sell ? 'fl_sa' : 'fl_bb'), a);
      st = (st.slice(0, m.index) + st.slice(m.index + m[0].length)).replace(/\s*[:：]\s*(?=[;；؛]|$)/g, '').replace(/^[\s,;،，:：]+|[\s,;،，:：]+$/g, '');
    }
    st = st.replace(VOID[lang], function () {
      var mm = Array.prototype.slice.call(arguments, 0, 4), a = tdx(mm);
      if (flip) return fillT(sell ? 'hold_sup' : 'hold_res', a);
      if (sell && a[1] === 'above') return fillT('br_res', a);
      if (!sell && a[1] === 'below') return fillT('br_sup', a);
      return mm[0];
    });
    return { pill: t(flip ? (sell ? 'pill_fs' : 'pill_fb') : (sell ? 'pill_s' : 'pill_b')), flip: flipLine, st: st,
      cls: flip ? (sell ? 'buy fz' : 'sell fz') : sideCls(z.side) };   // colour = what the zone is now
  }
  function trigWait(z) {   // break-and-retest zone (20/11/2026): 'Waiting for an M15 close below L'
    var g = z.trigger; if (!g) return '';
    var b = typeof g.close_below === 'number', x = b ? g.close_below : g.close_above;
    if (typeof x !== 'number') return '';
    return t('tg_wait').replace('{tf}', g.tf || 'M15').replace('{d}', t(b ? 'tg_below' : 'tg_above')).replace('{x}', fmt(x));
  }
  function par(x) { return lang === 'zh-hant' ? '（' + x + '）' : ' (' + x + ')'; }
  function rng(lo, hi) { return lo === hi || hi == null ? fmt(lo) : fmt(lo) + '–' + fmt(hi); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function add(p) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) p.appendChild(arguments[i]); return p; }
  function clear(id) { var n = document.getElementById(id); n.textContent = ''; return n; }
  function sideCls(s) { return s === 'SELL' ? 'sell' : s === 'BUY' ? 'buy' : 'neutral'; }
  function row(k, v, vcls, text) {
    var r = el('div', 'row' + (text ? ' text' : ''));
    return add(r, el('span', 'k', k), el('span', 'v' + (text ? '' : ' num') + (vcls ? ' ' + vcls : ''), v));
  }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  // Plan times are Vietnam time (UTC+7). Each language shows them in its readers' clock (user, 17/11/2026):
  // EN = UK time, AR = Mecca time, VI = Vietnam time, 繁中 = Taipei / Hong Kong time (same as tools/build.py TZ_LANG).
  var TZ = { en: 'Europe/London', ar: 'Asia/Riyadh', vi: 'Asia/Ho_Chi_Minh', 'zh-hant': 'Asia/Taipei' };
  function vn(dateStr, hm) { return new Date(dateStr + 'T' + hm + ':00+07:00'); }
  function tf(d, opt) { opt = opt || {}; opt.timeZone = TZ[lang] || 'Asia/Ho_Chi_Minh'; try { return new Intl.DateTimeFormat(locale(), opt).format(d); } catch (e) { return d.toISOString().slice(0, 16).replace('T', ' '); } }
  // 24-hour clock in every language (13:49, not 01:49 PM), time zone as a plain short name without brackets
  function hm(d) { return tf(d, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); }
  function tzName(d) {
    var z = '';
    try { new Intl.DateTimeFormat('en-GB', { timeZone: TZ[lang] || 'Asia/Ho_Chi_Minh', timeZoneName: 'short' }).formatToParts(d).forEach(function (x) { if (x.type === 'timeZoneName') z = x.value; }); } catch (e) {}
    return z.replace(/^UTC$/, 'GMT');
  }
  function hmz(d) { var z = tzName(d); return hm(d) + (z ? ' ' + z : ''); }
  function sep() { return lang === 'ar' ? '، ' : lang === 'zh-hant' ? '，' : ', '; }
  function dayHm(d) { return tf(d, { weekday: 'short', day: 'numeric', month: 'short' }) + (lang === 'zh-hant' ? ' ' : sep()) + hm(d); }
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
    document.documentElement.lang = lang === 'zh-hant' ? 'zh-Hant' : lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    each('[data-i18n]', function (n) { var v = t(n.getAttribute('data-i18n')); if (typeof v === 'string') n.textContent = v; });
    each('.lang [data-lang]', function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
    var tg = LINKS.tg[lang] || LINKS.tg._, x = LINKS.x[lang] || LINKS.x._;
    each('.js-tg', function (a) { a.href = tg; });
    var sx = document.getElementById('s-x'); if (sx) sx.href = x;
    if (themeBtn) themeLabel();
    notifyRender();
    wlRender();
  }

  // Home page only: the plan is already in the HTML; this refreshes it (a newer plan may exist) and shows local times.
  function renderPlan() {
    var p = data.plan; if (!p) return;
    var same = document.body.getAttribute('data-plan') === p.date + '-' + p.edition;
    if (!same) { ['result', 'plan-link'].forEach(function (id) { var n = document.getElementById(id); if (n) n.hidden = true; }); }
    var upd = vn(p.updated_vn.slice(0, 10), p.updated_vn.slice(11));
    add(clear('plan-title'), document.createTextNode(t('plan_of') + ' '), el('span', 'd', dayOnly(vn(p.date, '12:00'))));
    add(clear('plan-meta'), el('span', null, p.symbol), el('span', null, t('ed')[p.edition] || p.edition), el('span', null, hmz(upd)));

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
      im.src = '/' + src; im.alt = 'XAUUSD H1 – ' + document.getElementById('plan-title').textContent;
      document.getElementById('chart-link').href = '/' + src;
      // the portrait phone chart (…-m.png) exists for plans the site built itself; for a newer plan than this page, use the wide one
      var cm = document.getElementById('chart-m');
      if (cm && !same) cm.removeAttribute('srcset');
      // WebP copies match this page's own chart only: for a newer plan fall back to the PNG set above
      ['chart-mw', 'chart-w'].forEach(function (id) { var w = document.getElementById(id); if (w && !same) w.removeAttribute('srcset'); });
    } else cb.hidden = true;

    var al = document.getElementById('alert');
    if (p.alert && L(p.alert)) { al.hidden = false; alertInto(document.getElementById('alert-text'), p); } else al.hidden = true;

    var bc = document.getElementById('bias-card');
    var side = p.bias === 'TWO_WAY' || p.bias === 'STAND_ASIDE' ? (p.lean || '') : p.bias;
    bc.className = 'hero card ' + sideCls(side);
    var mc = document.getElementById('main-chip'), s0 = (p.scenarios || [])[0];
    if (mc) { mc.textContent = s0 ? t('main') + ' ' + s0.prob + '%' : ''; mc.className = 'mchip' + (s0 ? ' ' + sideCls(s0.side) : ''); }
    var bv = t(p.bias);
    if (p.bias === 'TWO_WAY' && p.lean) bv += ', ' + t('lean') + ' ' + t(p.lean);
    document.getElementById('bias-val').textContent = bv;
    document.getElementById('day-type').textContent = L(p.day_type);
    headlineInto(document.getElementById('headline'), clearHeadline(p));

    var hk = clear('hero-keys');
    function key(k, v) { add(hk, add(el('div', 'key'), el('span', 'k', k), el('span', 'v num', v))); }
    if (p.main_zone) key(t('main_zone') + par(t(p.main_zone.side)), rng(p.main_zone.lo, p.main_zone.hi));
    if (p.targets && p.targets[0]) key(t('target') + ' ' + p.targets[0].label, rng(p.targets[0].lo, p.targets[0].hi));
    if (p.range) key(t('range'), rng(p.range.lo, p.range.hi));

    var lv = clear('levels');
    if (p.main_zone) add(lv, row(t('main_zone') + par(t(p.main_zone.side)), rng(p.main_zone.lo, p.main_zone.hi), 'main'));
    (p.targets || []).forEach(function (x) { add(lv, row(t('target') + ' ' + x.label, rng(x.lo, x.hi))); });
    if (p.range) add(lv, row(t('range'), rng(p.range.lo, p.range.hi)));
    function trow(k, kpx, text, cls) {
      var r = el('div', 'row text ideas-row ' + cls), kk = el('span', 'k', k);
      if (kpx) { kk.appendChild(document.createTextNode(' ')); kk.appendChild(el('b', 'px', kpx)); }
      return add(r, kk, add(el('div', 'v'), ideasEl(text)));
    }
    (p.watch || []).forEach(function (w) { add(lv, trow(t('watch'), rng(w.lo, w.hi), L(w.text), 'watch')); });
    if (p.invalidation) add(lv, trow(t('invalid'), '', L(p.invalidation), 'inv'));

    var cx = clear('context');
    (p.context || []).forEach(function (c) { cx.appendChild(ctxCard(L(c.k), L(c.v))); });

    var sc = clear('scenarios');
    (p.scenarios || []).forEach(function (s, i) {
      var c = el('div', 'card scen ' + sideCls(s.side));
      var head = add(el('div', 't'), el('span', null, (i === 0 ? t('main') : t('alt')) + par(t(s.side))), el('span', 'pct num', s.prob + '%'));
      var bar = el('div', 'bar'); var bi = el('i', 'w' + Math.round(Math.max(0, Math.min(100, s.prob)) / 5) * 5); bar.appendChild(bi);
      add(sc, add(c, head, bar, scenSteps(scenText(L(s.text)))));
    });

    var zn = clear('zones');
    var mz = p.main_zone;
    (p.zones || []).forEach(function (z) {
      var isMain = mz && z.lo === mz.lo && z.hi === mz.hi && z.side === mz.side;
      var c = el('div', 'card zone' + (isMain ? ' is-main' : ''));
      var zv = zoneView(z);
      var h = add(el('div', 'zh'), el('span', 'pill ' + zv.cls, zv.pill), el('span', 'zr num', rng(z.lo, z.hi)),
        el('span', 'g' + (isMain ? ' main' : ''), isMain ? t('key') : (trigWait(z) || (z.grade ? t('grade') + ' ' + z.grade : ''))));
      add(c, h);
      if (zv.flip) c.appendChild(pxInto(el('p', 'flip'), zv.flip));
      add(zn, add(c, ideasEl(zv.st, true, t('main_zone'))));
    });

    var nw = clear('news');
    var yr = p.date.slice(0, 4);
    (p.news || []).forEach(function (n) {
      var r = el('div', 'row news-row');
      add(nw, add(r, add(el('span', 'k'), el('span', 'imp ' + (n.impact || 'low')), el('span', null, L(n.text))), el('span', 'v', newsTime(n.time, yr))));
    });
    var tzn = tzName(new Date());
    document.getElementById('tznote').textContent = t('tz') + (tzn ? par(tzn) : '') + (lang === 'zh-hant' ? '。' : '.');

    var nv = document.getElementById('next-v'), ne = nextEdition(p);
    if (nv) nv.textContent = ne ? t('ed')[ne.ed] + sep() + dayHm(ne.at) : L(p.next_update);

    // LIVE badge goes grey when the plan is more than 30 hours old
    var age = (Date.now() - upd.getTime()) / 36e5;
    document.getElementById('live').classList.toggle('stale', age > 30);
    document.getElementById('live-text').textContent = age > 30 ? t('stale') : t('live');
  }

  // Home page: short preview of the latest plan, refreshed from latest.json, times in the visitor's zone.
  function renderHome() {
    var p = data.plan; if (!p) return;
    var same = document.body.getAttribute('data-plan') === p.date + '-' + p.edition;
    var upd = vn(p.updated_vn.slice(0, 10), p.updated_vn.slice(11));
    function set(id, v) { var n = document.getElementById(id); if (n) n.textContent = v; return n; }
    var pub = document.getElementById('hp-pub');
    if (pub && pub.getAttribute('data-tpl')) pub.textContent = pub.getAttribute('data-tpl').replace('{ed}', t('ed')[p.edition] || p.edition).replace('{time}', hmz(upd));
    var he = document.getElementById('hp-ed');
    if (he) { he.textContent = (t('ed')[p.edition] || p.edition) + (lang === 'ar' ? '، ' : lang === 'zh-hant' ? '，' : ', '); he.appendChild(el('span', 'num', hmz(upd))); }
    var age = (Date.now() - upd.getTime()) / 36e5;
    document.getElementById('live').classList.toggle('stale', age > 30);
    document.getElementById('live-text').textContent = age > 30 ? t('stale') : t('live');
    if (same) return;
    set('hp-day', dayOnly(vn(p.date, '12:00')));
    var side = p.bias === 'TWO_WAY' || p.bias === 'STAND_ASIDE' ? (p.lean || '') : p.bias;
    var card = document.getElementById('hp-card'); if (card) card.className = 'hero card ' + sideCls(side);
    var bv = t(p.bias); if (p.bias === 'TWO_WAY' && p.lean) bv += ', ' + t('lean') + ' ' + t(p.lean);
    set('hp-bias', bv); var hh = document.getElementById('hp-headline'); if (hh) headlineInto(hh, clearHeadline(p)); set('hp-type', L(p.day_type));
    var hk = document.getElementById('hp-keys'); if (hk) hk.hidden = true;   // built for the older plan
    var ci = document.querySelector('.chart-card img'), ch = p.chart || {}, src = ch[lang] || ch.en || ch.vi || '';
    if (ci && /^data\/charts\/[0-9]{4}-[0-9]{2}-[0-9]{2}-(0700|1345|1930)-(vi|en)\.png$/.test(src)) {
      var cs = document.querySelector('.chart-card source'); if (cs) cs.parentNode.removeChild(cs);   // phone image of the old plan
      ci.src = '/' + src;
    }
  }

  // Plan pages: Scenarios / Key levels / Zones / Market context / News as tabs (without JavaScript every panel simply shows).
  function initTabs() {
    var bar = document.getElementById('ptabs'), box = document.getElementById('panels');
    if (!bar || !box) return;
    var tabs = Array.prototype.slice.call(bar.querySelectorAll('[role="tab"]'));
    function pick(name, focus, keepHash) {
      tabs.forEach(function (b) {
        var on = b.getAttribute('data-p') === name;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        document.getElementById('p-' + b.getAttribute('data-p')).classList.toggle('on', on);
        if (on && focus) b.focus();
        if (on) {   // keep the chosen tab in view inside the bar without scrolling the page
          var l = b.offsetLeft - bar.offsetLeft, r = l + b.offsetWidth;
          if (l < bar.scrollLeft) bar.scrollLeft = l - 8; else if (r > bar.scrollLeft + bar.clientWidth) bar.scrollLeft = r - bar.clientWidth + 8;
        }
      });
      if (!keepHash && history.replaceState) history.replaceState(null, '', location.pathname + location.search + '#p-' + name);
    }
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b.getAttribute('data-p')); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, rtl = document.documentElement.dir === 'rtl', n = tabs.length, j;
        if (k === 'ArrowRight') j = rtl ? i - 1 : i + 1; else if (k === 'ArrowLeft') j = rtl ? i + 1 : i - 1;
        else if (k === 'Home') j = 0; else if (k === 'End') j = n - 1; else return;
        e.preventDefault(); pick(tabs[(j + n) % n].getAttribute('data-p'), true);
      });
    });
    bar.classList.add('on'); box.classList.add('tabbed');
    var m = /^#p-(scen|levels|zones|context|news)$/.exec(location.hash);
    pick(m ? m[1] : 'scen', false, true);
    window.addEventListener('hashchange', function () {   // links to #p-zones etc. on the same page
      var h = /^#p-(scen|levels|zones|context|news)$/.exec(location.hash);
      if (h) pick(h[1], false, true);
    });
  }
  function headerHeight() {
    var h = document.querySelector('.top');
    if (h) document.documentElement.style.setProperty('--hh', h.offsetHeight + 'px');
  }
  headerHeight(); window.addEventListener('resize', headerHeight);
  initTabs();

  each('.lang [data-lang]', function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var l = b.dataset.lang;
      try { localStorage.setItem('nc_lang', l); } catch (x) {}
      langCookie(l);
      if (l !== PATH_LANG) { location.href = b.getAttribute('href') + (KIND === 'home' || KIND === 'today' ? location.search + location.hash : ''); return; }
      lang = l; renderStatic(); notifyLang();
    });
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

  // ---- chart viewer: full screen inside the app instead of opening the image in a new tab ----
  var lb = document.getElementById('lb');
  function lbClose() { if (!lb || lb.hidden) return; lb.hidden = true; document.documentElement.classList.remove('lb-open'); }
  var cl = document.getElementById('chart-link');
  if (cl && lb) {
    cl.addEventListener('click', function (e) {
      var href = cl.getAttribute('href') || '';
      if (!/^\/data\/charts\/[0-9]{4}-[0-9]{2}-[0-9]{2}-(0700|1345|1930)-(vi|en)\.png$/.test(href)) return;
      e.preventDefault();
      document.getElementById('lb-img').src = href;
      document.getElementById('lb-img').alt = document.getElementById('chart-img').alt;
      lb.hidden = false; document.documentElement.classList.add('lb-open');
      document.getElementById('lb-x').focus();
    });
    lb.addEventListener('click', lbClose);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lbClose(); });
  }

  // ---- new-plan alerts (web push) – every .js-notify block on the page shares one state ----
  // Several addresses for the same service: if a phone or network cannot reach the first one
  // (DNS not refreshed yet, blocked by a filter…), the next one is tried automatically.
  var PUSH_APIS = ['/api', 'https://push.nexuscore.trade'];
  var PUSH_API = PUSH_APIS[0];
  function apiFetch(path, opt, i) {
    i = i || 0;
    var base = i === 0 ? PUSH_API : PUSH_APIS[(PUSH_APIS.indexOf(PUSH_API) + i) % PUSH_APIS.length];
    function next(e) { if (i + 1 >= PUSH_APIS.length) throw e; return apiFetch(path, opt, i + 1); }
    return fetch(base + path, opt).then(function (r) {
      // 404/405/5xx = this address does not lead to the service (yet): try the next one
      if (r.status === 404 || r.status === 405 || r.status >= 500) { if (i + 1 < PUSH_APIS.length) return next(new Error('HTTP ' + r.status)); }
      PUSH_API = base; return r;
    }, next);
  }
  var push = { ready: false, key: '', state: 'off', busy: false, err: false, reg: null };
  var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var standalone = navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var canPush = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  function keyBytes(s) {
    var b = atob(s.replace(/-/g, '+').replace(/_/g, '/')), o = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) o[i] = b.charCodeAt(i);
    return o;
  }
  function post(path, body, tries) {   // retries: the first request to a sleeping worker can drop on mobile networks
    tries = tries == null ? 3 : tries;
    return apiFetch(path, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) { var e = new Error('HTTP ' + r.status); e.name = 'Server'; throw e; } })
      .catch(function (e) {
        if (tries <= 1 || (e && e.name === 'Server')) { try { e.step = 'save'; } catch (x) {} throw e; }
        return new Promise(function (ok) { setTimeout(ok, 1200); }).then(function () { return post(path, body, tries - 1); });
      });
  }
  function notifyRender() {
    var iosHint = isIOS && !standalone;
    var denied = canPush && Notification.permission === 'denied';
    var msg = push.err ? (denied ? t('nt_denied') : push.errName === 'retry' ? t('nt_retry') : t('nt_err') + (push.errName ? ' (' + push.errName + ')' : ''))
      : (!canPush ? t('nt_ios') : denied ? t('nt_denied') : push.state === 'on' ? t('nt_on') : t('nt_sub'));
    each('.js-notify', function (card) {
      var sub = card.querySelector('.notify-sub'), btn = card.querySelector('.notify-btn');
      card.hidden = false;
      if (!canPush && !iosHint) {   // say why instead of hiding the card
        btn.hidden = true;
        sub.textContent = isIOS ? t('nt_old_ios') : t('nt_unsup');
        return;
      }
      btn.hidden = iosHint && !canPush || denied;
      btn.disabled = push.busy;
      btn.className = 'btn big notify-btn' + (push.state === 'on' ? ' on' : '');
      card.querySelector('.notify-btn-t').textContent = push.state === 'on' ? t('nt_off_btn') : t('nt_on_btn');
      sub.textContent = msg;
    });
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
      job = sub.then(function (s) { return s; }, function (e) { try { e.step = 'allow'; } catch (x) {} throw e; })
               .then(function (s) { return post('/subscribe', { sub: s.toJSON(), lang: lang, src: SRC, page: PAGE }); })
               .then(function () { push.state = 'on'; try { localStorage.setItem('nc_push_lang', lang); } catch (e) {} });
    } else {
      // service not reachable yet: retry setup, then ask the user to tap again
      job = pushInit().then(function () { throw new Error('retry'); }, function (e) { try { e.step = 'connect'; } catch (x) {} throw e; });
    }
    push.busy = true; notifyRender();
    job.catch(function (e) {
      push.err = true;
      push.errName = ((e && e.step) ? e.step + ' · ' : '') + ((e && e.name) || '') + (e && e.message ? ': ' + String(e.message).slice(0, 80) : '');
    }).then(function () { push.busy = false; notifyRender(); });
  }
  function notifyLang() {   // keep the alert language in step with the page language
    if (push.state !== 'on' || !push.reg) return;
    var had = null; try { had = localStorage.getItem('nc_push_lang'); } catch (e) {}
    if (had === lang) return;
    try { localStorage.setItem('nc_push_lang', lang); } catch (e) {}
    push.reg.pushManager.getSubscription().then(function (s) { if (s) return post('/subscribe', { sub: s.toJSON(), lang: lang }); }).catch(function () {});
  }
  each('.js-notify .notify-btn', function (b) { b.addEventListener('click', notifyToggle); });

  // ---- email / waitlist – each .js-wl block keeps its own state; the page address tells plan vs Signals sign-ups apart ----
  function wlRender() {
    each('.js-wl', function (card) {
      var st = card._wl || 'idle';
      card.hidden = false;
      var msg = card.querySelector('.wl-msg');
      card.querySelector('.wl-form').hidden = st === 'ok';
      card.querySelector('.wl-btn').disabled = st === 'busy';
      card.querySelector('.wl-email').placeholder = 'you@example.com';
      msg.className = 'wl-msg' + (st === 'ok' ? ' ok' : (st === 'bad' || st === 'err') ? ' bad' : '');
      msg.textContent = st === 'ok' ? t('wl_ok') : st === 'bad' ? t('wl_bad') : st === 'err' ? t('wl_err') : '';
    });
  }
  each('.js-wl', function (card) {
    card.querySelector('.wl-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (card._wl === 'busy') return;
      var email = card.querySelector('.wl-email').value.trim();
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,24}$/.test(email)) { card._wl = 'bad'; wlRender(); return; }
      card._wl = 'busy'; wlRender();
      post('/waitlist', { email: email, lang: lang, src: SRC, page: PAGE, website: card.querySelector('.wl-hp').value })
        .then(function () { card._wl = 'ok'; }, function () { card._wl = 'err'; }).then(wlRender);
    });
  });
  function pushInit() {   // fetch the service key and register the service worker (retried on demand)
    if (push.init) return push.init;
    push.init = apiFetch('/key', { credentials: 'omit' }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (k) {
      if (!/^[A-Za-z0-9_-]{80,100}$/.test(k)) throw 0;
      push.key = k; push.ready = true;
      if (!canPush) return;
      return navigator.serviceWorker.register('/sw.js').then(function () { return navigator.serviceWorker.ready; }).then(function (reg) {
        push.reg = reg;
        return reg.pushManager.getSubscription();
      }).then(function (s) { push.state = s ? 'on' : 'off'; notifyLang(); });
    });
    push.init.catch(function () { push.init = null; });
    return push.init;
  }
  pushInit().catch(function () {}).then(function () { notifyRender(); wlRender(); });

  renderStatic();
  if (KIND === 'today') {
    load('/data/latest.json').then(function (p) { data.plan = p; renderPlan(); }).catch(function () {});
  } else if (KIND === 'home') {
    load('/data/latest.json').then(function (p) { data.plan = p; renderHome(); }).catch(function () {});
  }
})();
