// Runs before first paint: saved choice, else light (the default look since 17/11/2026).
(function () {
  var t = null;
  try { t = localStorage.getItem('nc_theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
