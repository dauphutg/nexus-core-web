// Runs before first paint: saved choice, else light (the default look since 17/11/2026).
(function () {
  var t = null;
  try { t = localStorage.getItem('nc_theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
// Web fonts without blocking the first paint (SEO/Core Web Vitals, 21/11/2026): the page preloads the Google Fonts CSS
// (<link id="gf" rel="preload">); a stylesheet added by script does not block rendering. Text shows in the system font
// first and switches when the fonts arrive (display=swap). Without JavaScript the <noscript> stylesheet is used.
(function () {
  var g = document.getElementById('gf');
  if (!g || !g.href) return;
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = g.href;
  document.head.appendChild(l);
})();
