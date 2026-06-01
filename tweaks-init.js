/* Tweaks: apply defaults without React/Babel (production-safe) */
(function () {
  var d = { palette: 'earth', font: 'cormorant', layout: 'grid' };
  var r = document.documentElement;
  if (d.palette !== 'earth') r.setAttribute('data-palette', d.palette);
  if (d.font !== 'cormorant') r.setAttribute('data-font', d.font);
  /* layout applied by app.js renderGallery */
})();
