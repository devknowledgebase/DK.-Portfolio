// GTM deferred loader — moves all GTM triggering out of the inline script
// so we don't need 'unsafe-inline' in script-src.
// Strategy: load on first user interaction (scroll/click/touch/keydown) OR
// after load + idleCallback + 3-4s — whichever comes first.
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  function loadGTM() {
    if (window._gtmLoaded) return;
    window._gtmLoaded = true;
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-KM5L238X');
  }

  // Delay until idle + 3.5 s after page load
  function scheduleIdle() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(function () { setTimeout(loadGTM, 2000); }, { timeout: 5000 });
    } else {
      setTimeout(loadGTM, 3500);
    }
  }

  if (document.readyState === 'complete') {
    scheduleIdle();
  } else {
    window.addEventListener('load', scheduleIdle, { once: true });
  }

  // Also trigger on first meaningful interaction (passive, non-blocking)
  ['scroll', 'keydown', 'touchstart', 'click', 'pointerdown'].forEach(function (evt) {
    window.addEventListener(evt, loadGTM, { once: true, passive: true });
  });
})();
