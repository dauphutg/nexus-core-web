// Runs before first paint: saved choice, else the device setting, else dark.
(function () {
  var t = null;
  try { t = localStorage.getItem('nc_theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
})();
