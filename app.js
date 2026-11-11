(function () {
  'use strict';

  var T = {
    en: {
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
      res_hit: 'Target 1 reached', res_void: 'Invalidated', res_no_touch: 'Zone not reached', res_expired: 'No follow-through', res_aside: 'Stood aside', pending: 'Pending',
      res_pending_note: 'Graded after the daily close (17:00 New York).',
      pp_result: 'How this plan played out', pp_touched: 'Zone reached', pp_event: 'Decided at', pp_window: 'Graded window', pp_hl: 'High / low in window', pp_last: 'Last price in window', pp_t1: 'Target 1', pp_void: 'Invalidation level',
      prev_plan: '← Previous plan', next_plan: 'Next plan →', today_plan: 'Today’s plan', all_month: 'All plans this month',
      tr_h1: 'Gold plan track record', tr_lede: 'Every NEXUS CORE gold plan this month and how it played out. Wins, losses and misses all stay on the record — nothing is deleted.',
      tr_plans: 'Plans published', tr_graded: 'Graded', tr_reached: 'Zone reached', tr_hit: 'Target 1 reached', tr_void: 'Invalidated', tr_r: 'Total R',
      tr_list: 'Every plan', tr_none: 'No plans yet this month.', tr_method: 'How plans are graded', tr_prev_m: '← Previous month', tr_next_m: 'Next month →', view: 'View plan',
      tr_m: ['Each plan is graded on 15-minute XAUUSD candles (OANDA feed) from the moment it is published until the next plan replaces it, or the daily close (17:00 New York) — whichever comes first.',
        'Zone reached: a candle trades into the main zone. If it never does, the plan is marked “Zone not reached” and scores 0R.',
        'Once the zone is reached, whichever comes first decides: Target 1 → “Target 1 reached”; a 15-minute close beyond the invalidation level → “Invalidated” (−1R).',
        'If neither happens before the window ends → “No follow-through”, scored at the last price.',
        'R = distance from the zone edge to Target 1 (or the last price) divided by the distance from the zone edge to the invalidation level. When both happen in the same candle, it counts against the plan.',
        'Stand-aside plans are not scored.'],
      sg_h1: 'NEXUS CORE Signals', sg_lede: 'Exact trade signals built on the daily plan — for members only. The daily plan stays free for everyone.', sg_soon: 'Members only · launching soon', sg_what: 'What members get',
      sg_b: ['A real-time alert when price reaches a plan zone and the setup confirms — entry, stop and targets.', 'Every signal tied to the plan in force, so you always know why it exists.', 'Priority alerts in the app and a private Telegram group.', 'Every signal recorded and graded, win or loss.'],
      sg_wl_title: 'Join the Signals waitlist', sg_wl_sub: 'Be first to know when Signals opens, with early-member pricing. No spam.', sg_free: 'Only need the free plan?', sg_free_link: 'See today’s gold plan →',
      sg_note: 'Signals are trade ideas for information only, not personal advice. Availability may depend on your country.',
      risk_title: 'Risk warning',
      disclaimer: 'Market analysis for information only — not investment advice or a solicitation to trade. Leveraged products such as gold CFDs carry a high risk of losing money rapidly. Past performance does not guarantee future results. Trade only with money you can afford to lose.'
    },
    ar: {
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
      res_hit: 'تحقق الهدف الأول', res_void: 'أُلغيت الفكرة', res_no_touch: 'لم يصل السعر إلى المنطقة', res_expired: 'بلا متابعة', res_aside: 'خارج السوق', pending: 'قيد التقييم',
      res_pending_note: 'تُقيَّم بعد الإغلاق اليومي (17:00 بتوقيت نيويورك).',
      pp_result: 'نتيجة هذه الخطة', pp_touched: 'وصول السعر إلى المنطقة', pp_event: 'حُسمت النتيجة', pp_window: 'فترة التقييم', pp_hl: 'أعلى / أدنى سعر في الفترة', pp_last: 'آخر سعر في الفترة', pp_t1: 'الهدف الأول', pp_void: 'مستوى الإلغاء',
      prev_plan: 'الخطة السابقة', next_plan: 'الخطة التالية', today_plan: 'خطة اليوم', all_month: 'كل خطط الشهر',
      tr_h1: 'سجل نتائج خطط الذهب', tr_lede: 'كل خطط NEXUS CORE للذهب هذا الشهر وكيف انتهت. الرابحة والخاسرة وغير المُفعّلة تبقى في السجل — لا نحذف شيئًا.',
      tr_plans: 'خطط منشورة', tr_graded: 'مُقيَّمة', tr_reached: 'وصل السعر إلى المنطقة', tr_hit: 'تحقق الهدف الأول', tr_void: 'أُلغيت', tr_r: 'مجموع R',
      tr_list: 'كل خطة', tr_none: 'لا توجد خطط هذا الشهر بعد.', tr_method: 'كيف نُقيّم الخطط', tr_prev_m: 'الشهر السابق', tr_next_m: 'الشهر التالي', view: 'عرض الخطة',
      tr_m: ['تُقيَّم كل خطة على شموع XAUUSD لفترة 15 دقيقة (بيانات OANDA) من لحظة نشرها حتى تحل محلها الخطة التالية، أو حتى الإغلاق اليومي (17:00 بتوقيت نيويورك) — أيهما أسبق.',
        'الوصول إلى المنطقة: شمعة تتداول داخل المنطقة الرئيسية. إن لم يحدث ذلك تُسجَّل «لم يصل السعر إلى المنطقة» بنتيجة 0R.',
        'بعد الوصول إلى المنطقة، ما يحدث أولًا يحسم النتيجة: بلوغ الهدف الأول ← «تحقق الهدف الأول»؛ إغلاق شمعة 15 دقيقة بعد مستوى الإلغاء ← «أُلغيت الفكرة» (‎−1R).',
        'إن لم يحدث أيٌّ منهما قبل نهاية الفترة ← «بلا متابعة» وتُحتسب بآخر سعر.',
        'R = المسافة من حافة المنطقة إلى الهدف الأول (أو آخر سعر) مقسومة على المسافة من حافة المنطقة إلى مستوى الإلغاء. إذا وقع الأمران في الشمعة نفسها تُحتسب ضد الخطة.',
        'خطط «خارج السوق» لا تُحتسب.'],
      sg_h1: 'إشارات NEXUS CORE', sg_lede: 'إشارات تداول دقيقة مبنية على الخطة اليومية — للأعضاء فقط. تبقى الخطة اليومية مجانية للجميع.', sg_soon: 'للأعضاء فقط · قريبًا', sg_what: 'ما يحصل عليه الأعضاء',
      sg_b: ['تنبيه فوري عند وصول السعر إلى منطقة الخطة وتأكيد الإعداد — الدخول والوقف والأهداف.', 'كل إشارة مرتبطة بالخطة السارية، فتعرف دائمًا سببها.', 'تنبيهات ذات أولوية في التطبيق ومجموعة تيليجرام خاصة.', 'كل إشارة تُسجَّل وتُقيَّم، رابحة كانت أم خاسرة.'],
      sg_wl_title: 'انضم إلى قائمة انتظار الإشارات', sg_wl_sub: 'كن أول من يعلم عند إطلاق الإشارات، مع سعر خاص للأعضاء الأوائل. بلا إزعاج.', sg_free: 'تريد الخطة المجانية فقط؟', sg_free_link: 'شاهد خطة الذهب اليوم',
      sg_note: 'الإشارات أفكار تداول لأغراض المعلومات فقط وليست نصيحة شخصية. قد لا تتوفر في بعض الدول.',
      risk_title: 'تحذير المخاطر',
      disclaimer: 'تحليل للسوق لأغراض المعلومات فقط — ليس نصيحة استثمارية ولا دعوة للتداول. المنتجات ذات الرافعة المالية مثل عقود الذهب تنطوي على مخاطر عالية بخسارة الأموال سريعًا. الأداء السابق لا يضمن النتائج المستقبلية. تداول فقط بما تستطيع تحمّل خسارته.'
    },
    vi: {
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
      res_hit: 'Chạm mục tiêu 1', res_void: 'Bị huỷ (sai)', res_no_touch: 'Giá không tới vùng', res_expired: 'Không chạy', res_aside: 'Đứng ngoài', pending: 'Chờ chấm',
      res_pending_note: 'Chấm sau khi nến ngày đóng (17:00 giờ New York).',
      pp_result: 'Kết quả của plan này', pp_touched: 'Giá chạm vùng', pp_event: 'Chốt kết quả lúc', pp_window: 'Khung giờ chấm', pp_hl: 'Cao / thấp trong khung', pp_last: 'Giá cuối khung', pp_t1: 'Mục tiêu 1', pp_void: 'Mốc huỷ',
      prev_plan: '← Plan trước', next_plan: 'Plan sau →', today_plan: 'Plan hôm nay', all_month: 'Mọi plan trong tháng',
      tr_h1: 'Kết quả plan vàng', tr_lede: 'Mọi plan vàng NEXUS CORE trong tháng và kết quả thật. Đúng, sai hay không chạy đều giữ lại — không xoá plan nào.',
      tr_plans: 'Plan đã đăng', tr_graded: 'Đã chấm', tr_reached: 'Giá tới vùng', tr_hit: 'Chạm mục tiêu 1', tr_void: 'Bị huỷ', tr_r: 'Tổng R',
      tr_list: 'Từng plan', tr_none: 'Tháng này chưa có plan.', tr_method: 'Cách chấm plan', tr_prev_m: '← Tháng trước', tr_next_m: 'Tháng sau →', view: 'Xem plan',
      tr_m: ['Mỗi plan được chấm trên nến 15 phút XAUUSD (dữ liệu OANDA) từ lúc đăng đến khi plan sau thay thế, hoặc đến khi nến ngày đóng (17:00 giờ New York) — tuỳ cái nào đến trước.',
        'Giá tới vùng: có nến chạm vào vùng chính. Không chạm → “Giá không tới vùng”, tính 0R.',
        'Sau khi chạm vùng, điều gì đến trước quyết định: chạm Mục tiêu 1 → “Chạm mục tiêu 1”; nến 15 phút đóng vượt mốc huỷ → “Bị huỷ” (−1R).',
        'Hết khung giờ mà chưa có điều nào → “Không chạy”, tính theo giá cuối.',
        'R = khoảng cách từ mép vùng tới Mục tiêu 1 (hoặc giá cuối) chia cho khoảng cách từ mép vùng tới mốc huỷ. Hai việc xảy ra trong cùng một nến thì tính bất lợi cho plan.',
        'Plan đứng ngoài không tính điểm.'],
      sg_h1: 'NEXUS CORE Signals', sg_lede: 'Tín hiệu vào lệnh cụ thể dựa trên plan ngày — chỉ dành cho thành viên. Plan ngày vẫn miễn phí cho mọi người.', sg_soon: 'Chỉ cho thành viên · sắp mở', sg_what: 'Thành viên nhận được',
      sg_b: ['Báo ngay khi giá vào vùng plan và tín hiệu xác nhận — điểm vào, dừng lỗ và mục tiêu.', 'Mỗi tín hiệu gắn với plan đang hiệu lực, luôn biết vì sao có lệnh.', 'Thông báo ưu tiên trong app và nhóm Telegram riêng.', 'Mọi tín hiệu được ghi lại và chấm, thắng hay thua.'],
      sg_wl_title: 'Đăng ký chờ gói Signals', sg_wl_sub: 'Biết đầu tiên khi Signals mở, kèm giá ưu đãi cho thành viên sớm. Không spam.', sg_free: 'Chỉ cần plan miễn phí?', sg_free_link: 'Xem plan vàng hôm nay →',
      sg_note: 'Tín hiệu chỉ là ý tưởng giao dịch để tham khảo, không phải lời khuyên cá nhân. Có thể chưa mở ở một số quốc gia.',
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
  var PATH_LANG = /^\/ar(\/|$)/.test(location.pathname) ? 'ar' : /^\/vi(\/|$)/.test(location.pathname) ? 'vi' : 'en';
  // a returning visitor who picked Arabic/Vietnamese and lands on the English home page goes to their language
  if (KIND === 'home' && PATH_LANG === 'en' && (saved === 'ar' || saved === 'vi') && /^\/(index\.html|today\/?)?$/.test(location.pathname)) {
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
    var s = typeof o === 'string' ? o : (o[lang] || o.en || o.vi || '');
    // keep price ranges left-to-right inside Arabic sentences (4058–4068, not 4068–4058)
    if (lang === 'ar') s = s.replace(/(\d[\d.,:]*)\s*[–-]\s*(\d[\d.,:]*)/g, '⁦$1–$2⁩');
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
    document.documentElement.lang = lang;
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
