(function () {
  'use strict';

  var T = {
    en: {
      pp_best: 'Max favourable move (MFE)', pp_best_note: 'Furthest move in the zone’s direction after it was reached, until invalidation or the daily close — shows how good the read was; it is not a trade result and is never added to R.', tr_best: 'Avg MFE', 
      chart_hint: 'Tap the chart to view it full screen', lb_hint: 'Tap anywhere to close · pinch to zoom', 
      tab_learn: 'Learn', ln_eyebrow: 'Gold trading Q&A', ln_short: 'Short answer', ln_example: 'Live example from the latest NEXUS CORE plan', ln_faq: 'Quick answers', ln_related: 'Related questions', ln_updated: 'Updated', see_plan: 'See the full plan →', see_track: 'See the track record →',
      ln_index_h1: 'Learn to read the gold market', ln_index_lede: 'Plain answers to the questions gold traders actually ask — each one tied to a real, graded NEXUS CORE plan.', ln_all: 'All questions', ln_sessions_note: 'Plan times: Asia 00:00 UTC · London update 06:45 UTC · New York 12:30 UTC.',
      mv_eyebrow: 'Why gold moved', mv_h1: 'Why gold moved', mv_change: 'Day change', mv_oc: 'Open → close', mv_hl: 'High / low', mv_big: 'Biggest hourly move', mv_reasons: 'What moved it', mv_sources: 'Sources', mv_method: 'Numbers from 15-minute XAUUSD candles (OANDA feed). Trading day = 17:00 New York to 17:00 New York. Reasons come only from published news and data; when none fits, we say so.', mv_plans: 'Plans for this day', mv_recent: 'Why gold moved – recent days',
      skip: 'Skip to content', to_light: 'Switch to light theme', to_dark: 'Switch to dark theme', tab_plan: 'Daily plan', tab_signals: 'Signals', tab_history: 'Track record',
      lede: 'AI-built game plan for gold (XAUUSD): key zones, scenarios and the level that proves the view wrong — refreshed before Asia, London and New York.',
      bias: 'Bias', levels: 'Key levels', scenarios: 'Scenarios', zones: 'Zones on the chart', news: 'Economic calendar',
      main_zone: 'Main zone', invalid: 'View is wrong if', range: 'Expected range', target: 'Target',
      plan_of: 'Gold plan', ed: { '0700': 'Asia plan', '1345': 'Pre-London update', '1930': 'Pre-New York plan' },
      ed_short: { '0700': 'Asia', '1345': 'London', '1930': 'New York' },
      updated: 'updated', next: 'Next update', main: 'Main', alt: 'Alternate', key: 'Key zone',
      tz: 'All times shown in your local time', your_time: 'your time',
      tg_title: 'Get every plan on Telegram', tg_sub: 'Free channel · no sign-up',
      SELL: 'SELL', BUY: 'BUY', TWO_WAY: 'TWO-WAY', STAND_ASIDE: 'STAND ASIDE', lean: 'leaning',
      live: 'LIVE', stale: 'LAST PLAN', err: 'Could not load data. Please reload the page.',
      cta_title: 'Get the next plan before London opens', cta_sub: 'A free alert the moment each plan is published — Asia, London and New York. Takes five seconds.', cta_push: 'Alert on this device',
      nt_title: 'New-plan alerts', nt_sub: 'Get a notification on this device the moment a new plan is published.', nt_on_btn: 'Turn on alerts', nt_off_btn: 'Turn off alerts', nt_on: 'Alerts are on for this device.', nt_denied: 'Notifications are blocked for this site. Allow them in your browser settings to turn alerts on.', nt_ios: 'On iPhone: tap the Share button, choose “Add to Home Screen”, then open NEXUS CORE from your home screen and turn on alerts.', nt_err: 'Could not change alerts. Please try again.',
      wl_title: 'Or get it by email', wl_sub: 'A copy of every new plan in your inbox, plus first access to the NEXUS CORE app. No spam, unsubscribe any time.', wl_label: 'Email address', wl_btn: 'Join waitlist', wl_ok: 'You are on the list.', wl_bad: 'Please enter a valid email address.', wl_err: 'Could not sign you up. Please try again.', wl_privacy: 'We use your email only for NEXUS CORE updates and never share it. You can ask to be removed at any time.',
      nt_old_ios: 'Alerts need iOS 16.4 or later. Update your iPhone in Settings → General → Software Update, then turn alerts on here.', nt_unsup: 'This browser cannot show alerts. Open the site in Chrome, Edge, Firefox or Safari — or follow the Telegram channel.',
      nt_retry: 'Connecting… please tap the button again.',
      nt_alt: 'Works on every phone, including older iPhones:', nt_tg: 'Alerts on Telegram', nt_mail: 'Alerts by email',
      permalink: 'Permanent link to this plan',
      res_mixed: 'Mixed', pp_zones: 'Zones graded', z_earlier: 'Counted in the earlier update', pp_follow: 'Followed until', z_main: 'Main zone', res_hit: 'Target 1 reached', res_void: 'Invalidated', res_no_touch: 'Zone not reached', res_expired: 'No follow-through', res_aside: 'Stood aside', pending: 'Pending',
      res_pending_note: 'Graded after the daily close (17:00 New York).',
      pp_result: 'How this plan played out', pp_touched: 'Zone reached', pp_event: 'Decided at', pp_window: 'Graded window', pp_hl: 'High / low in window', pp_last: 'Last price in window', pp_t1: 'Target 1', pp_void: 'Invalidation level',
      prev_plan: '← Previous plan', next_plan: 'Next plan →', today_plan: 'Today’s plan', all_month: 'All plans this month',
      tr_h1: 'Gold plan track record', tr_lede: 'Every NEXUS CORE gold plan this month and how it played out. Wins, losses and misses all stay on the record — nothing is deleted.',
      tr_plans: 'Plans published', tr_graded: 'Graded', tr_reached: 'Zones reached', tr_hit: 'Target 1 reached', tr_void: 'Invalidated', tr_r: 'Total R',
      tr_list: 'Every plan', tr_none: 'No plans yet this month.', tr_method: 'How plans are graded', tr_prev_m: '← Previous month', tr_next_m: 'Next month →', view: 'View plan',
      tr_m: ['Every tradeable zone in a plan is graded on its own on 15-minute XAUUSD candles (OANDA feed): the main zone plus every other zone with a published invalidation level. Watch-only zones and zones that are only in play after a break are not scored.',
        'A zone counts only if price trades into it while that plan is in force — from publication until the next update replaces it, or the daily close (17:00 New York).',
        'Once reached, the zone is followed until the daily close, even after a newer update: Target 1 first → “Target 1 reached”; a 15-minute close beyond the zone’s invalidation level first → “Invalidated” (−1R). Neither → “No follow-through”, scored at the daily close.',
        'R = distance from the zone edge to Target 1 (or the closing price) divided by the distance from the zone edge to the invalidation level. When both happen in the same candle, it counts against the plan.',
        'A zone repeated in a later update of the same day is counted once, where it was first reached. A plan’s R is the sum of its zones; wins and losses are counted alike.',
        'Stand-aside plans are not scored.',
        'MFE (maximum favourable excursion) is shown separately: the furthest price travelled in the zone’s direction from its edge, from the touch until invalidation or the daily close. It shows how good the read was — it is never added to R.',
        'Rules updated 13 Nov 2026 (all zones graded, reached zones followed to the daily close); every earlier plan was re-graded once under these rules.'],
      sg_h1: 'NEXUS CORE Signals', sg_lede: 'Exact trade signals built on the daily plan — for members only. The daily plan stays free for everyone.', sg_soon: 'Members only · launching soon', sg_what: 'What members get',
      sg_b: ['A real-time alert when price reaches a plan zone and the setup confirms — entry, stop and targets.', 'Every signal tied to the plan in force, so you always know why it exists.', 'Priority alerts in the app and a private Telegram group.', 'Every signal recorded and graded, win or loss.'],
      sg_wl_title: 'Join the Signals waitlist', sg_wl_sub: 'Be first to know when Signals opens, with early-member pricing. No spam.', sg_free: 'Only need the free plan?', sg_free_link: 'See today’s gold plan →',
      sg_note: 'Signals are trade ideas for information only, not personal advice. Availability may depend on your country.',
      risk_title: 'Risk warning',
      disclaimer: 'Market analysis for information only — not investment advice or a solicitation to trade. Leveraged products such as gold CFDs carry a high risk of losing money rapidly. Past performance does not guarantee future results. Trade only with money you can afford to lose.'
    },
    ar: {
      pp_best: 'أقصى حركة مواتية (MFE)', pp_best_note: 'أبعد حركة باتجاه المنطقة بعد الوصول إليها حتى الإلغاء أو الإغلاق اليومي — تُظهر دقة القراءة، وليست نتيجة صفقة ولا تُضاف إلى R.', tr_best: 'متوسط MFE', 
      chart_hint: 'اضغط على الرسم لعرضه بملء الشاشة', lb_hint: 'اضغط في أي مكان للإغلاق · كبّر بإصبعين', 
      tab_learn: 'تعلّم', ln_eyebrow: 'أسئلة وأجوبة تداول الذهب', ln_short: 'الإجابة المختصرة', ln_example: 'مثال حي من أحدث خطة NEXUS CORE', ln_faq: 'إجابات سريعة', ln_related: 'أسئلة ذات صلة', ln_updated: 'آخر تحديث', see_plan: 'شاهد الخطة كاملة', see_track: 'شاهد سجل النتائج',
      ln_index_h1: 'تعلّم قراءة سوق الذهب', ln_index_lede: 'إجابات واضحة عن الأسئلة التي يطرحها متداولو الذهب فعلًا — كل إجابة مرتبطة بخطة حقيقية من NEXUS CORE وتم تقييمها.', ln_all: 'كل الأسئلة', ln_sessions_note: 'أوقات الخطط: آسيا 00:00 UTC · تحديث لندن 06:45 UTC · نيويورك 12:30 UTC.',
      mv_eyebrow: 'لماذا تحرك الذهب', mv_h1: 'لماذا تحرك الذهب', mv_change: 'تغيّر اليوم', mv_oc: 'الافتتاح ← الإغلاق', mv_hl: 'أعلى / أدنى', mv_big: 'أكبر حركة في ساعة', mv_reasons: 'ما الذي حرّكه', mv_sources: 'المصادر', mv_method: 'الأرقام من شموع XAUUSD لفترة 15 دقيقة (بيانات OANDA). يوم التداول = من 17:00 إلى 17:00 بتوقيت نيويورك. الأسباب من الأخبار والبيانات المنشورة فقط؛ وإن لم يوجد سبب واضح نقول ذلك.', mv_plans: 'خطط هذا اليوم', mv_recent: 'لماذا تحرك الذهب – الأيام الأخيرة',
      skip: 'انتقل إلى المحتوى', to_light: 'التبديل إلى الوضع الفاتح', to_dark: 'التبديل إلى الوضع الداكن', tab_plan: 'الخطة اليومية', tab_signals: 'الإشارات', tab_history: 'سجل النتائج',
      lede: 'خطة للذهب (XAUUSD) مبنية بالذكاء الاصطناعي: مناطق رئيسية، سيناريوهات، والمستوى الذي يُلغي الفكرة — تُحدَّث قبل جلسات آسيا ولندن ونيويورك.',
      bias: 'الاتجاه', levels: 'المستويات الرئيسية', scenarios: 'السيناريوهات', zones: 'المناطق على الرسم', news: 'المفكرة الاقتصادية',
      main_zone: 'المنطقة الرئيسية', invalid: 'تُلغى الفكرة إذا', range: 'النطاق المتوقع', target: 'الهدف',
      plan_of: 'خطة الذهب', ed: { '0700': 'خطة آسيا', '1345': 'تحديث ما قبل لندن', '1930': 'خطة ما قبل نيويورك' },
      ed_short: { '0700': 'آسيا', '1345': 'لندن', '1930': 'نيويورك' },
      updated: 'آخر تحديث', next: 'التحديث القادم', main: 'الرئيسي', alt: 'البديل', key: 'منطقة رئيسية',
      tz: 'جميع الأوقات بتوقيتك المحلي', your_time: 'بتوقيتك',
      tg_title: 'استلم كل خطة عبر تيليجرام', tg_sub: 'قناة مجانية · بدون تسجيل',
      SELL: 'بيع', BUY: 'شراء', TWO_WAY: 'اتجاهان', STAND_ASIDE: 'خارج السوق', lean: 'ميل إلى',
      live: 'مباشر', stale: 'آخر خطة', err: 'تعذّر تحميل البيانات. يرجى إعادة تحميل الصفحة.',
      cta_title: 'احصل على الخطة القادمة قبل افتتاح لندن', cta_sub: 'تنبيه مجاني لحظة نشر كل خطة — آسيا ولندن ونيويورك. التفعيل في خمس ثوانٍ.', cta_push: 'تنبيه على هذا الجهاز',
      nt_title: 'تنبيهات الخطة الجديدة', nt_sub: 'استلم إشعارًا على هذا الجهاز فور نشر خطة جديدة.', nt_on_btn: 'تفعيل التنبيهات', nt_off_btn: 'إيقاف التنبيهات', nt_on: 'التنبيهات مفعّلة على هذا الجهاز.', nt_denied: 'الإشعارات محظورة لهذا الموقع. اسمح بها من إعدادات المتصفح لتفعيل التنبيهات.', nt_ios: 'على الآيفون: اضغط زر المشاركة، اختر «إضافة إلى الشاشة الرئيسية»، ثم افتح NEXUS CORE من الشاشة الرئيسية وفعّل التنبيهات.', nt_err: 'تعذّر تغيير التنبيهات. حاول مرة أخرى.',
      wl_title: 'أو استلمها بالبريد', wl_sub: 'نسخة من كل خطة جديدة في بريدك، مع وصول مبكر إلى تطبيق NEXUS CORE. بلا إزعاج، ويمكنك الإلغاء متى شئت.', wl_label: 'البريد الإلكتروني', wl_btn: 'انضم الآن', wl_ok: 'تم تسجيلك في القائمة.', wl_bad: 'يرجى إدخال بريد إلكتروني صحيح.', wl_err: 'تعذّر التسجيل. حاول مرة أخرى.', wl_privacy: 'نستخدم بريدك لتحديثات NEXUS CORE فقط ولا نشاركه مع أحد. يمكنك طلب الحذف في أي وقت.',
      nt_old_ios: 'التنبيهات تتطلب iOS 16.4 أو أحدث. حدّث الآيفون من الإعدادات ← عام ← تحديث البرامج ثم فعّل التنبيهات هنا.', nt_unsup: 'هذا المتصفح لا يدعم التنبيهات. افتح الموقع في Chrome أو Edge أو Firefox أو Safari — أو تابع قناة تيليجرام.',
      nt_retry: 'جارٍ الاتصال… اضغط الزر مرة أخرى.',
      nt_alt: 'تعمل على كل الهواتف، بما فيها أجهزة الآيفون القديمة:', nt_tg: 'تنبيهات عبر تيليجرام', nt_mail: 'تنبيهات بالبريد',
      permalink: 'رابط دائم لهذه الخطة',
      res_mixed: 'نتائج مختلطة', pp_zones: 'المناطق المُقيَّمة', z_earlier: 'احتُسبت في التحديث السابق', pp_follow: 'المتابعة حتى', z_main: 'المنطقة الرئيسية', res_hit: 'تحقق الهدف الأول', res_void: 'أُلغيت الفكرة', res_no_touch: 'لم يصل السعر إلى المنطقة', res_expired: 'بلا متابعة', res_aside: 'خارج السوق', pending: 'قيد التقييم',
      res_pending_note: 'تُقيَّم بعد الإغلاق اليومي (17:00 بتوقيت نيويورك).',
      pp_result: 'نتيجة هذه الخطة', pp_touched: 'وصول السعر إلى المنطقة', pp_event: 'حُسمت النتيجة', pp_window: 'فترة التقييم', pp_hl: 'أعلى / أدنى سعر في الفترة', pp_last: 'آخر سعر في الفترة', pp_t1: 'الهدف الأول', pp_void: 'مستوى الإلغاء',
      prev_plan: 'الخطة السابقة', next_plan: 'الخطة التالية', today_plan: 'خطة اليوم', all_month: 'كل خطط الشهر',
      tr_h1: 'سجل نتائج خطط الذهب', tr_lede: 'كل خطط NEXUS CORE للذهب هذا الشهر وكيف انتهت. الرابحة والخاسرة وغير المُفعّلة تبقى في السجل — لا نحذف شيئًا.',
      tr_plans: 'خطط منشورة', tr_graded: 'مُقيَّمة', tr_reached: 'مناطق وصلها السعر', tr_hit: 'تحقق الهدف الأول', tr_void: 'أُلغيت', tr_r: 'مجموع R',
      tr_list: 'كل خطة', tr_none: 'لا توجد خطط هذا الشهر بعد.', tr_method: 'كيف نُقيّم الخطط', tr_prev_m: 'الشهر السابق', tr_next_m: 'الشهر التالي', view: 'عرض الخطة',
      tr_m: ['تُقيَّم كل منطقة قابلة للتداول في الخطة على حدة على شموع XAUUSD لفترة 15 دقيقة (بيانات OANDA): المنطقة الرئيسية وكل منطقة أخرى لها مستوى إلغاء منشور. مناطق المراقبة فقط والمناطق التي لا تُفعَّل إلا بعد كسر لا تُحتسب.',
        'تُحتسب المنطقة فقط إذا وصلها السعر أثناء سريان الخطة — من نشرها حتى يحل محلها التحديث التالي أو حتى الإغلاق اليومي (17:00 بتوقيت نيويورك).',
        'بعد الوصول تُتابَع المنطقة حتى الإغلاق اليومي ولو صدر تحديث أحدث: بلوغ الهدف الأول أولًا ← «تحقق الهدف الأول»؛ إغلاق شمعة 15 دقيقة بعد مستوى إلغاء المنطقة أولًا ← «أُلغيت الفكرة» (‎−1R). إن لم يحدث أيٌّ منهما ← «بلا متابعة» وتُحتسب بسعر الإغلاق اليومي.',
        'R = المسافة من حافة المنطقة إلى الهدف الأول (أو سعر الإغلاق) مقسومة على المسافة من حافة المنطقة إلى مستوى الإلغاء. إذا وقع الأمران في الشمعة نفسها تُحتسب ضد الخطة.',
        'المنطقة المكررة في تحديث لاحق من اليوم نفسه تُحتسب مرة واحدة حيث وصلها السعر أولًا. R الخطة = مجموع مناطقها، والرابحة والخاسرة تُحتسب بالتساوي.',
        'خطط «خارج السوق» لا تُحتسب.',
        'MFE (أقصى حركة مواتية) تُعرض منفصلة: أبعد مسافة تحركها السعر باتجاه المنطقة من حافتها، من لحظة الوصول حتى الإلغاء أو الإغلاق اليومي. تُظهر دقة القراءة ولا تُضاف أبدًا إلى R.',
        'حُدّثت القواعد في 13 نوفمبر 2026 (تقييم كل المناطق ومتابعة المنطقة حتى الإغلاق اليومي)، وأُعيد تقييم كل الخطط السابقة مرة واحدة وفقها.'],
      sg_h1: 'إشارات NEXUS CORE', sg_lede: 'إشارات تداول دقيقة مبنية على الخطة اليومية — للأعضاء فقط. تبقى الخطة اليومية مجانية للجميع.', sg_soon: 'للأعضاء فقط · قريبًا', sg_what: 'ما يحصل عليه الأعضاء',
      sg_b: ['تنبيه فوري عند وصول السعر إلى منطقة الخطة وتأكيد الإعداد — الدخول والوقف والأهداف.', 'كل إشارة مرتبطة بالخطة السارية، فتعرف دائمًا سببها.', 'تنبيهات ذات أولوية في التطبيق ومجموعة تيليجرام خاصة.', 'كل إشارة تُسجَّل وتُقيَّم، رابحة كانت أم خاسرة.'],
      sg_wl_title: 'انضم إلى قائمة انتظار الإشارات', sg_wl_sub: 'كن أول من يعلم عند إطلاق الإشارات، مع سعر خاص للأعضاء الأوائل. بلا إزعاج.', sg_free: 'تريد الخطة المجانية فقط؟', sg_free_link: 'شاهد خطة الذهب اليوم',
      sg_note: 'الإشارات أفكار تداول لأغراض المعلومات فقط وليست نصيحة شخصية. قد لا تتوفر في بعض الدول.',
      risk_title: 'تحذير المخاطر',
      disclaimer: 'تحليل للسوق لأغراض المعلومات فقط — ليس نصيحة استثمارية ولا دعوة للتداول. المنتجات ذات الرافعة المالية مثل عقود الذهب تنطوي على مخاطر عالية بخسارة الأموال سريعًا. الأداء السابق لا يضمن النتائج المستقبلية. تداول فقط بما تستطيع تحمّل خسارته.'
    },
    vi: {
      pp_best: 'Giá chạy xa nhất (MFE)', pp_best_note: 'Quãng giá xa nhất theo hướng của vùng sau khi chạm, tới khi bị huỷ hoặc đóng nến ngày — cho thấy nhận định chuẩn tới đâu; không phải kết quả lệnh và không cộng vào R.', tr_best: 'MFE trung bình', 
      chart_hint: 'Chạm vào chart để xem toàn màn hình', lb_hint: 'Chạm bất kỳ đâu để đóng · dùng 2 ngón để phóng to', 
      tab_learn: 'Kiến thức', ln_eyebrow: 'Hỏi đáp giao dịch vàng', ln_short: 'Trả lời ngắn', ln_example: 'Ví dụ thật từ plan NEXUS CORE mới nhất', ln_faq: 'Trả lời nhanh', ln_related: 'Câu hỏi liên quan', ln_updated: 'Cập nhật', see_plan: 'Xem plan đầy đủ →', see_track: 'Xem kết quả chấm →',
      ln_index_h1: 'Học cách đọc thị trường vàng', ln_index_lede: 'Trả lời rõ ràng cho những câu người giao dịch vàng hay hỏi — mỗi câu gắn với plan NEXUS CORE thật đã được chấm.', ln_all: 'Mọi câu hỏi', ln_sessions_note: 'Giờ plan: phiên Á 00:00 UTC · cập nhật phiên Âu 06:45 UTC · phiên Mỹ 12:30 UTC.',
      mv_eyebrow: 'Vì sao vàng chạy', mv_h1: 'Vì sao vàng chạy', mv_change: 'Thay đổi trong ngày', mv_oc: 'Mở → đóng', mv_hl: 'Cao / thấp', mv_big: 'Giờ chạy mạnh nhất', mv_reasons: 'Nguyên nhân', mv_sources: 'Nguồn', mv_method: 'Số liệu từ nến 15 phút XAUUSD (dữ liệu OANDA). Ngày giao dịch = 17:00 tới 17:00 giờ New York. Nguyên nhân chỉ lấy từ tin và số liệu đã công bố; không có lý do rõ thì ghi đúng như vậy.', mv_plans: 'Plan của ngày này', mv_recent: 'Vì sao vàng chạy – các ngày gần đây',
      skip: 'Tới nội dung', to_light: 'Chuyển sang giao diện sáng', to_dark: 'Chuyển sang giao diện tối', tab_plan: 'Plan ngày', tab_signals: 'Signal', tab_history: 'Kết quả',
      lede: 'Plan vàng (XAUUSD) do AI lập: vùng giá chính, kịch bản và mốc cho biết nhận định sai — cập nhật trước phiên Á, Âu và Mỹ.',
      bias: 'Xu hướng', levels: 'Mức giá chính', scenarios: 'Kịch bản', zones: 'Các vùng trên chart', news: 'Lịch tin',
      main_zone: 'Vùng chính', invalid: 'Sai khi', range: 'Vùng giá dự kiến', target: 'Mục tiêu',
      plan_of: 'Plan vàng', ed: { '0700': 'Plan phiên Á', '1345': 'Cập nhật trước phiên Âu', '1930': 'Plan trước phiên Mỹ' },
      ed_short: { '0700': 'Phiên Á', '1345': 'Phiên Âu', '1930': 'Phiên Mỹ' },
      updated: 'cập nhật', next: 'Lần cập nhật tới', main: 'Chính', alt: 'Phụ', key: 'Vùng chính',
      tz: 'Mọi giờ hiển thị theo giờ máy của bạn', your_time: 'giờ của bạn',
      tg_title: 'Nhận mọi plan qua Telegram', tg_sub: 'Kênh miễn phí · không cần đăng ký',
      SELL: 'BÁN', BUY: 'MUA', TWO_WAY: '2 CHIỀU', STAND_ASIDE: 'ĐỨNG NGOÀI', lean: 'nghiêng',
      live: 'LIVE', stale: 'PLAN CŨ', err: 'Không tải được dữ liệu. Thử tải lại trang.',
      cta_title: 'Nhận plan tiếp theo trước giờ mở cửa phiên London', cta_sub: 'Thông báo miễn phí ngay khi mỗi plan được đăng — phiên Á, Âu và Mỹ. Bật trong 5 giây.', cta_push: 'Thông báo trên máy này',
      nt_title: 'Thông báo plan mới', nt_sub: 'Nhận thông báo trên máy này ngay khi có plan mới.', nt_on_btn: 'Bật thông báo', nt_off_btn: 'Tắt thông báo', nt_on: 'Đã bật thông báo trên máy này.', nt_denied: 'Trình duyệt đang chặn thông báo của trang này. Hãy cho phép trong cài đặt trình duyệt để bật.', nt_ios: 'Trên iPhone: bấm nút Chia sẻ, chọn “Thêm vào MH chính”, rồi mở NEXUS CORE từ màn hình chính và bật thông báo.', nt_err: 'Không đổi được thông báo. Thử lại sau.',
      wl_title: 'Hoặc nhận qua email', wl_sub: 'Bản sao mỗi plan mới gửi vào hộp thư, kèm quyền dùng app NEXUS CORE sớm nhất. Không spam, huỷ bất cứ lúc nào.', wl_label: 'Địa chỉ email', wl_btn: 'Đăng ký', wl_ok: 'Bạn đã có tên trong danh sách.', wl_bad: 'Vui lòng nhập email hợp lệ.', wl_err: 'Chưa đăng ký được. Thử lại sau.', wl_privacy: 'Email chỉ dùng để gửi tin NEXUS CORE, không chia sẻ cho ai. Bạn có thể yêu cầu xoá bất cứ lúc nào.',
      nt_old_ios: 'Thông báo cần iOS 16.4 trở lên. Cập nhật iPhone trong Cài đặt → Cài đặt chung → Cập nhật phần mềm, rồi bật thông báo tại đây.', nt_unsup: 'Trình duyệt này không hỗ trợ thông báo. Mở trang bằng Chrome, Edge, Firefox hoặc Safari — hoặc theo dõi kênh Telegram.',
      nt_retry: 'Đang kết nối… bấm nút thêm lần nữa.',
      nt_alt: 'Cách này chạy trên mọi điện thoại, kể cả iPhone đời cũ:', nt_tg: 'Nhận qua Telegram', nt_mail: 'Nhận qua email',
      permalink: 'Link cố định của plan này',
      res_mixed: 'Có thắng có thua', pp_zones: 'Các vùng được chấm', z_earlier: 'Đã tính ở bản cập nhật trước', pp_follow: 'Theo dõi tới', z_main: 'Vùng chính', res_hit: 'Chạm mục tiêu 1', res_void: 'Bị huỷ (sai)', res_no_touch: 'Giá không tới vùng', res_expired: 'Không chạy', res_aside: 'Đứng ngoài', pending: 'Chờ chấm',
      res_pending_note: 'Chấm sau khi nến ngày đóng (17:00 giờ New York).',
      pp_result: 'Kết quả của plan này', pp_touched: 'Giá chạm vùng', pp_event: 'Chốt kết quả lúc', pp_window: 'Khung giờ chấm', pp_hl: 'Cao / thấp trong khung', pp_last: 'Giá cuối khung', pp_t1: 'Mục tiêu 1', pp_void: 'Mốc huỷ',
      prev_plan: '← Plan trước', next_plan: 'Plan sau →', today_plan: 'Plan hôm nay', all_month: 'Mọi plan trong tháng',
      tr_h1: 'Kết quả plan vàng', tr_lede: 'Mọi plan vàng NEXUS CORE trong tháng và kết quả thật. Đúng, sai hay không chạy đều giữ lại — không xoá plan nào.',
      tr_plans: 'Plan đã đăng', tr_graded: 'Đã chấm', tr_reached: 'Vùng được chạm', tr_hit: 'Chạm mục tiêu 1', tr_void: 'Bị huỷ', tr_r: 'Tổng R',
      tr_list: 'Từng plan', tr_none: 'Tháng này chưa có plan.', tr_method: 'Cách chấm plan', tr_prev_m: '← Tháng trước', tr_next_m: 'Tháng sau →', view: 'Xem plan',
      tr_m: ['Mọi vùng giao dịch được trong plan đều được chấm riêng trên nến 15 phút XAUUSD (dữ liệu OANDA): vùng chính và mọi vùng khác có mốc huỷ công bố. Vùng chỉ theo dõi và vùng chỉ có hiệu lực sau khi phá không tính.',
        'Vùng chỉ được tính khi giá chạm vào trong lúc plan đó còn hiệu lực — từ lúc đăng tới khi bản cập nhật sau thay thế, hoặc tới khi nến ngày đóng (17:00 giờ New York).',
        'Đã chạm thì vùng được theo dõi tới khi nến ngày đóng, kể cả khi đã có bản mới: chạm Mục tiêu 1 trước → “Chạm mục tiêu 1”; nến 15 phút đóng vượt mốc huỷ của vùng trước → “Bị huỷ” (−1R). Không có điều nào → “Không chạy”, tính theo giá đóng nến ngày.',
        'R = khoảng cách từ mép vùng tới Mục tiêu 1 (hoặc giá đóng) chia cho khoảng cách từ mép vùng tới mốc huỷ. Hai việc xảy ra trong cùng một nến thì tính bất lợi cho plan.',
        'Vùng lặp lại ở bản cập nhật sau trong cùng ngày chỉ tính một lần, ở bản mà giá chạm trước. R của plan = tổng các vùng; vùng thắng và vùng thua tính như nhau.',
        'Plan đứng ngoài không tính điểm.',
        'MFE (giá chạy xa nhất) hiển thị riêng: quãng giá xa nhất theo hướng của vùng tính từ mép vùng, từ lúc chạm tới khi bị huỷ hoặc đóng nến ngày. Số này cho thấy nhận định chuẩn tới đâu – không bao giờ cộng vào R.',
        'Luật cập nhật ngày 13/11/2026 (chấm mọi vùng, theo dõi vùng đã chạm tới đóng nến ngày); mọi plan trước đó được chấm lại một lần theo luật này.'],
      sg_h1: 'NEXUS CORE Signals', sg_lede: 'Tín hiệu vào lệnh cụ thể dựa trên plan ngày — chỉ dành cho thành viên. Plan ngày vẫn miễn phí cho mọi người.', sg_soon: 'Chỉ cho thành viên · sắp mở', sg_what: 'Thành viên nhận được',
      sg_b: ['Báo ngay khi giá vào vùng plan và tín hiệu xác nhận — điểm vào, dừng lỗ và mục tiêu.', 'Mỗi tín hiệu gắn với plan đang hiệu lực, luôn biết vì sao có lệnh.', 'Thông báo ưu tiên trong app và nhóm Telegram riêng.', 'Mọi tín hiệu được ghi lại và chấm, thắng hay thua.'],
      sg_wl_title: 'Đăng ký chờ gói Signals', sg_wl_sub: 'Biết đầu tiên khi Signals mở, kèm giá ưu đãi cho thành viên sớm. Không spam.', sg_free: 'Chỉ cần plan miễn phí?', sg_free_link: 'Xem plan vàng hôm nay →',
      sg_note: 'Tín hiệu chỉ là ý tưởng giao dịch để tham khảo, không phải lời khuyên cá nhân. Có thể chưa mở ở một số quốc gia.',
      risk_title: 'Cảnh báo rủi ro',
      disclaimer: 'Nội dung chỉ để tham khảo, không phải lời khuyên đầu tư hay lời mời giao dịch. Sản phẩm có đòn bẩy như vàng CFD có rủi ro mất tiền nhanh. Kết quả quá khứ không đảm bảo tương lai. Chỉ giao dịch bằng số tiền bạn chấp nhận mất.'
    },
    'zh-hant': {
      pp_best: '最大順向波動（MFE）', pp_best_note: '區域被觸及後，價格朝該區域方向走得最遠的距離，計至失效或每日收盤——反映判讀品質，並非交易結果，也不計入 R。', tr_best: '平均 MFE',
      chart_hint: '點擊圖表可全螢幕檢視', lb_hint: '點擊任意處關閉 · 雙指可放大',
      tab_learn: '學習', ln_eyebrow: '黃金交易問答', ln_short: '簡短回答', ln_example: '最新 NEXUS CORE 計畫的即時範例', ln_faq: '快速問答', ln_related: '相關問題', ln_updated: '更新於', see_plan: '查看完整計畫 →', see_track: '查看成績紀錄 →',
      ln_index_h1: '學會解讀黃金市場', ln_index_lede: '用白話回答黃金交易者最常問的問題——每一題都對應一份真實、已公開評分的 NEXUS CORE 計畫。', ln_all: '全部問題', ln_sessions_note: '計畫發布時間：亞洲盤 08:00 · 倫敦盤前 14:45 · 紐約盤前 20:30（台北／香港時間）。',
      mv_eyebrow: '黃金為何波動', mv_h1: '黃金為何波動', mv_change: '當日漲跌', mv_oc: '開盤 → 收盤', mv_hl: '最高 / 最低', mv_big: '單小時最大波動', mv_reasons: '波動原因', mv_sources: '資料來源', mv_method: '數據來自 XAUUSD 15 分鐘 K 線（OANDA）。交易日 = 紐約時間 17:00 至隔日 17:00。原因僅取自已公布的新聞與數據；找不到明確原因時會如實說明。', mv_plans: '當日計畫', mv_recent: '黃金為何波動——近期',
      skip: '跳至內容', to_light: '切換為淺色主題', to_dark: '切換為深色主題', tab_plan: '每日計畫', tab_signals: '訊號', tab_history: '成績紀錄',
      lede: 'AI 輔助製作的黃金（XAUUSD）交易計畫：關鍵區域、情境推演，以及判斷觀點失效的價位——於亞洲、倫敦、紐約盤前更新。',
      bias: '方向', levels: '關鍵價位', scenarios: '情境', zones: '圖表上的區域', news: '經濟日曆',
      main_zone: '主要區域', invalid: '觀點失效條件', range: '預期區間', target: '目標',
      plan_of: '黃金計畫', ed: { '0700': '亞洲盤計畫', '1345': '倫敦盤前更新', '1930': '紐約盤前計畫' },
      ed_short: { '0700': '亞洲盤', '1345': '倫敦盤', '1930': '紐約盤' },
      updated: '更新於', next: '下次更新', main: '主要', alt: '備選', key: '主要區域',
      tz: '所有時間皆以您的當地時間顯示', your_time: '您的時間',
      tg_title: '在 Telegram 接收每一份計畫', tg_sub: '免費頻道 · 無需註冊',
      SELL: '偏空', BUY: '偏多', TWO_WAY: '雙向', STAND_ASIDE: '觀望', lean: '傾向',
      live: 'LIVE', stale: '最新計畫', err: '資料載入失敗，請重新整理頁面。',
      cta_title: '在倫敦開盤前收到下一份計畫', cta_sub: '每份計畫發布時立即免費通知——亞洲、倫敦、紐約盤。五秒完成設定。', cta_push: '在此裝置接收通知',
      nt_title: '新計畫通知', nt_sub: '新計畫發布時，立即在此裝置收到通知。', nt_on_btn: '開啟通知', nt_off_btn: '關閉通知', nt_on: '此裝置已開啟通知。', nt_denied: '瀏覽器已封鎖本站通知，請在瀏覽器設定中允許後再開啟。', nt_ios: 'iPhone：點擊「分享」，選擇「加入主畫面」，再從主畫面開啟 NEXUS CORE 並開啟通知。', nt_err: '無法變更通知設定，請再試一次。',
      wl_title: '或以電子郵件接收', wl_sub: '每份新計畫寄到您的信箱，並優先取得 NEXUS CORE App。不寄垃圾郵件，可隨時取消。', wl_label: '電子郵件', wl_btn: '加入名單', wl_ok: '您已加入名單。', wl_bad: '請輸入有效的電子郵件地址。', wl_err: '登記失敗，請再試一次。', wl_privacy: '您的電子郵件僅用於 NEXUS CORE 通知，絕不分享給他人，可隨時要求刪除。',
      nt_old_ios: '通知功能需要 iOS 16.4 以上。請至「設定 → 一般 → 軟體更新」更新後再開啟。', nt_unsup: '此瀏覽器不支援通知。請使用 Chrome、Edge、Firefox 或 Safari 開啟本站，或追蹤 Telegram 頻道。',
      nt_retry: '連線中……請再點一次按鈕。',
      nt_alt: '所有手機皆可使用，包括舊款 iPhone：', nt_tg: '透過 Telegram 接收', nt_mail: '透過電子郵件接收',
      permalink: '此計畫的永久連結',
      res_mixed: '有盈有虧', pp_zones: '評分區域', z_earlier: '已於先前更新計入', pp_follow: '追蹤至', z_main: '主要區域', res_hit: '達到目標 1', res_void: '觀點失效', res_no_touch: '價格未觸及區域', res_expired: '未延續', res_aside: '觀望', pending: '待評分',
      res_pending_note: '於每日收盤（紐約時間 17:00）後評分。',
      pp_result: '本計畫的結果', pp_touched: '觸及區域', pp_event: '結果判定時間', pp_window: '評分時段', pp_hl: '時段內最高 / 最低', pp_last: '時段結束價', pp_t1: '目標 1', pp_void: '失效價位',
      prev_plan: '← 上一份計畫', next_plan: '下一份計畫 →', today_plan: '今日計畫', all_month: '本月所有計畫',
      tr_h1: '黃金計畫成績紀錄', tr_lede: '本月每一份 NEXUS CORE 黃金計畫及其結果。對、錯、未觸發都保留在紀錄上——不刪除任何一筆。',
      tr_plans: '已發布計畫', tr_graded: '已評分', tr_reached: '被觸及的區域', tr_hit: '達到目標 1', tr_void: '觀點失效', tr_r: '累計 R',
      tr_list: '每一份計畫', tr_none: '本月尚無計畫。', tr_method: '評分方式', tr_prev_m: '← 上個月', tr_next_m: '下個月 →', view: '查看計畫',
      tr_m: ['計畫中每個可交易區域都以 XAUUSD 15 分鐘 K 線（OANDA）個別評分：主要區域，以及其他公布失效價位的區域。僅供觀察的區域與須突破後才生效的區域不計分。',
        '區域須在該計畫有效期間被觸及才計入——自發布起，至下一份更新取代或每日收盤（紐約時間 17:00）為止。',
        '觸及後持續追蹤至每日收盤，即使已發布新的更新：先達到目標 1 →「達到目標 1」；先有 15 分鐘 K 線收在該區域失效價位之外 →「觀點失效」（−1R）。兩者皆未發生 →「未延續」，以每日收盤價計算。',
        'R = 區域邊緣到目標 1（或收盤價）的距離，除以區域邊緣到失效價位的距離。兩者在同一根 K 線發生時，以不利於計畫的方式計算。',
        '同一天後續更新重複出現的區域只計一次，計於最先被觸及的那份。計畫的 R = 各區域加總；盈與虧同樣計入。',
        '「觀望」計畫不計分。',
        'MFE（最大順向波動）另行顯示：自觸及起至失效或每日收盤，價格自區域邊緣朝該區域方向走得最遠的距離。它反映判讀品質，永不計入 R。',
        '評分規則於 2026 年 11 月 13 日更新（所有區域皆評分、觸及後追蹤至每日收盤）；先前所有計畫均依新規則重新評分一次。'],
      sg_h1: 'NEXUS CORE 訊號', sg_lede: '以每日計畫為基礎的精確交易訊號——僅限會員。每日計畫永久免費。', sg_soon: '僅限會員 · 即將推出', sg_what: '會員可獲得',
      sg_b: ['價格進入計畫區域且型態確認時即時通知——進場、停損與目標。', '每個訊號都對應當時有效的計畫，清楚知道訊號的依據。', 'App 內優先通知與專屬 Telegram 群組。', '每個訊號都會記錄並評分，無論盈虧。'],
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
  // Page kind is set by tools/build.py: home (latest plan), plan (one archived plan), track (monthly record), signals.
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
  // The address decides the language: / and /en/… = English, /ar/… = Arabic, /vi/… = Vietnamese.
  var PATH_LANG = /^\/ar(\/|$)/.test(location.pathname) ? 'ar' : /^\/vi(\/|$)/.test(location.pathname) ? 'vi' : /^\/zh-hant(\/|$)/.test(location.pathname) ? 'zh-hant' : 'en';
  // a returning visitor who picked Arabic/Vietnamese and lands on the English home page goes to their language
  if (KIND === 'home' && PATH_LANG === 'en' && (saved === 'ar' || saved === 'vi' || saved === 'zh-hant') && /^\/(index\.html|today\/?)?$/.test(location.pathname)) {
    location.replace('/' + saved + location.pathname.replace(/^\/(index\.html)?/, '/').replace(/^\/\//, '/') + location.search + location.hash);
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
  function L(o) {
    if (o == null) return '';
    var s = typeof o === 'string' ? o : (o[lang === 'zh-hant' ? 'zh' : lang] || o.en || o.vi || '');
    // keep price ranges left-to-right inside Arabic sentences (4058–4068, not 4068–4058)
    if (lang === 'ar') s = s.replace(/(\d[\d.,:]*)\s*[–-]\s*(\d[\d.,:]*)/g, '⁦$1–$2⁩');
    return s;
  }
  function locale() { return lang === 'vi' ? 'vi-VN' : lang === 'ar' ? 'ar-u-nu-latn' : lang === 'zh-hant' ? 'zh-Hant' : (nav.indexOf('en') === 0 ? navigator.language : 'en-GB'); }
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
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

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
    document.documentElement.lang = lang === 'zh-hant' ? 'zh-Hant' : lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    each('[data-i18n]', function (n) { var v = t(n.getAttribute('data-i18n')); if (typeof v === 'string') n.textContent = v; });
    each('.lang [data-lang]', function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
    var tg = LINKS.tg[lang] || LINKS.tg._, x = LINKS.x[lang] || LINKS.x._;
    each('.js-tg', function (a) { a.href = tg; });
    document.getElementById('s-x').href = x;
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
      im.src = '/' + src; im.alt = 'XAUUSD H1 – ' + document.getElementById('plan-title').textContent;
      document.getElementById('chart-link').href = '/' + src;
      // the portrait phone chart (…-m.png) exists for plans the site built itself; for a newer plan than this page, use the wide one
      var cm = document.getElementById('chart-m');
      if (cm && !same) cm.removeAttribute('srcset');
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
      var bar = el('div', 'bar'); var bi = el('i', 'w' + Math.round(Math.max(0, Math.min(100, s.prob)) / 5) * 5); bar.appendChild(bi);
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

  each('.lang [data-lang]', function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var l = b.dataset.lang;
      try { localStorage.setItem('nc_lang', l); } catch (x) {}
      if (l !== PATH_LANG) { location.href = b.getAttribute('href') + (KIND === 'home' ? location.search + location.hash : ''); return; }
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
  if (KIND === 'home') {
    load('/data/latest.json').then(function (p) { data.plan = p; renderPlan(); }).catch(function () {});
  }
})();
