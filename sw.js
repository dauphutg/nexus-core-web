// NEXUS CORE service worker: shows new-plan notifications. No caching – the site always loads fresh data.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  var title = typeof d.title === 'string' && d.title ? d.title.slice(0, 120) : 'NEXUS CORE';
  e.waitUntil(self.registration.showNotification(title, {
    body: typeof d.body === 'string' ? d.body.slice(0, 400) : '',
    icon: 'assets/icon-192.png',
    badge: 'assets/icon-192.png',
    tag: 'plan',
    renotify: true,
    lang: d.lang === 'ar' || d.lang === 'vi' ? d.lang : 'en',
    dir: d.dir === 'rtl' ? 'rtl' : 'ltr',
    data: { url: typeof d.url === 'string' ? d.url : '/' }
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var target = self.location.origin + '/';
  try {
    // only ever open a page of this site
    var u = new URL((e.notification.data && e.notification.data.url) || '/', self.location.origin);
    if (u.origin === self.location.origin) target = u.href;
  } catch (err) {}
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if ('focus' in list[i]) { if ('navigate' in list[i]) list[i].navigate(target); return list[i].focus(); }
    }
    return self.clients.openWindow(target);
  }));
});
