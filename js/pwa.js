// ===== PWA =====
(function() {
  // 1. Generate SVG icon as data URL
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="115" fill="#bd1105"/>
    <text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text>
    <text x="256" y="430" font-size="72" font-family="Arial" font-weight="900" text-anchor="middle" fill="white">MC</text>
  </svg>`;
  const iconUrl = 'data:image/svg+xml,' + encodeURIComponent(iconSvg);

  // Apply apple-touch-icon
  const appleIcon = document.getElementById('pwaAppleIcon');
  if (appleIcon) { appleIcon.rel='apple-touch-icon'; appleIcon.href=iconUrl; }

  // 2. Generate and inject manifest via Blob URL
  const manifest = {
    name: 'Most Computers',
    short_name: 'Most Computers',
    description: 'Онлайн магазин за електроника',
    start_url: './',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#bd1105',
    lang: 'bg',
    icons: [
      { src: iconUrl, sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
      { src: iconUrl, sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
    ],
    screenshots: [],
    categories: ['shopping', 'electronics'],
  };
  try {
    const blob = new Blob([JSON.stringify(manifest)], {type:'application/json'});
    const manifestUrl = URL.createObjectURL(blob);
    const manifestLink = document.getElementById('pwaManifest');
    if (manifestLink) manifestLink.href = manifestUrl;
  } catch(e) {}

  // 3. Service Worker — registers when hosted on HTTPS
  // (Blob URLs not supported for SW — browser security restriction)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => { console.log('MC SW ✓', reg.scope); window._mcSwReg = reg; })
      .catch(err => console.warn('MC SW:', err.message));
  }

  // 4. Install prompt logic
  let deferredPrompt = null;
  const banner = document.getElementById('pwaBanner');
  const dismissed = localStorage.getItem('mc_pwa_dismissed');
  const installed = localStorage.getItem('mc_pwa_installed');

  if (installed || dismissed) return; // already handled

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  // avoid errors during testing where matchMedia may be undefined
  const isInStandalone = window.navigator.standalone === true
    || (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches);

  if (isInStandalone) return; // already installed

  if (isIos) {
    // Show iOS instructions after 4s
    setTimeout(() => { if (banner) banner.classList.add('show'); }, 4000);
    window.__pwaIsIos = true;
  } else {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(() => { if (banner) banner.classList.add('show'); }, 3000);
    });
    window.__pwaPrompt = () => deferredPrompt;
  }
})();

function pwaInstall() {
  if (window.__pwaIsIos) {
    document.getElementById('pwaBanner').classList.remove('show');
    document.getElementById('pwaIosModal').classList.add('open');
    return;
  }
  const prompt = window.__pwaPrompt?.();
  if (prompt) {
    prompt.prompt();
    prompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        localStorage.setItem('mc_pwa_installed', '1');
        showToast('✓ Most Computers е инсталиран!');
      }
      document.getElementById('pwaBanner').classList.remove('show');
    });
  } else {
    // Fallback: show iOS style instructions
    document.getElementById('pwaBanner').classList.remove('show');
    document.getElementById('pwaIosModal').classList.add('open');
  }
}

function pwaDismiss() {
  document.getElementById('pwaBanner').classList.remove('show');
  localStorage.setItem('mc_pwa_dismissed', '1');
}

// helper called from data-action to scroll modal to top
function scrollProductModalTop() {
  const modal = document.getElementById('productModal');
  if (modal) modal.scrollTo({top:0,behavior:'smooth'});
}

function closePwaIos() {
  document.getElementById('pwaIosModal').classList.remove('open');
}



// ===== PUSH NOTIFICATIONS =====
async function requestPushPermission() {
  if (!('Notification' in window)) {
    showToast('⚠️ Браузърът ти не поддържа известия');
    return;
  }
  if (Notification.permission === 'granted') {
    showToast('✓ Известията вече са активирани!');
    return;
  }
  if (Notification.permission === 'denied') {
    showToast('⚠️ Известията са блокирани в браузъра');
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    showToast('🔔 Ще получаваш известия за горещи оферти!');
    localStorage.setItem('mc_push_granted', '1');
    // Demo: send a test notification after 3s
    setTimeout(() => {
      new Notification('Most Computers 🔥', {
        body: 'Добре дошъл! Следи за ексклузивни оферти.',
        icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text></svg>'),
        tag: 'mc-welcome'
      });
    }, 3000);
  } else {
    showToast('Известията не са активирани');
  }
}

function sendPromoNotification(title, body, url) {
  if (Notification.permission !== 'granted') return;
  const n = new Notification(title || 'Most Computers 🔥', {
    body: body || 'Нова оферта те очаква!',
    icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text></svg>'),
    tag: 'mc-promo',
    renotify: true
  });
  if (url) n.addEventListener('click', () => window.focus());
}

// Auto-show push opt-in after 30s (only once)
setTimeout(() => {
  if (localStorage.getItem('mc_push_granted')) return;
  if (localStorage.getItem('mc_push_dismissed')) return;
  if (!('Notification' in window) || Notification.permission !== 'default') return;
  const banner = document.getElementById('pushOptInBanner');
  if (banner) banner.classList.add('show');
}, 30000);

function dismissPushBanner() {
  const banner = document.getElementById('pushOptInBanner');
  if (banner) banner.classList.remove('show');
  localStorage.setItem('mc_push_dismissed', '1');
}


