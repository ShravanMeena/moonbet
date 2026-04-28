// ─── Helpers ────────────────────────────────────────────────
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isIOSSafari = () => isIOS() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS/.test(navigator.userAgent);
const isAndroid = () => /Android/.test(navigator.userAgent);
const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});

// ─── Page Switch: Install vs Welcome ────────────────────────
function showWelcomePage() {
  document.getElementById('installPage').style.display = 'none';
  const wp = document.getElementById('welcomePage');
  wp.classList.add('visible');

  // Update notification status badge
  if (Notification.permission === 'granted') {
    document.getElementById('notifStatus').textContent = 'On';
    const btn = document.getElementById('welcomeNotifBtn');
    btn.textContent = '✅ Notifications Enabled';
    btn.classList.add('enabled');
  }
}

function showInstallPage() {
  document.getElementById('welcomePage').classList.remove('visible');
  document.getElementById('installPage').style.display = '';
}

window.addEventListener('load', () => {
  if (isInstalled()) {
    showWelcomePage();
  }
});

// ─── Capture Android Install Prompt ─────────────────────────
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  showToast('App installed successfully!');
  setTimeout(() => openModal('notifModal'), 2000);
});

// ─── iOS Button ──────────────────────────────────────────────
document.getElementById('iosBtn').addEventListener('click', () => {
  const warning = document.getElementById('iosSafariWarning');
  warning.style.display = (isIOS() && !isIOSSafari()) ? 'block' : 'none';
  openModal('iosModal');
});
document.getElementById('closeIosModal').addEventListener('click', () => closeModal('iosModal'));

// ─── Android Button ──────────────────────────────────────────
document.getElementById('androidBtn').addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (outcome === 'accepted') {
      showToast('Installing app...');
    } else {
      showToast('Installation cancelled');
    }
  } else if (isAndroid()) {
    showToast('Open this page in Chrome to install');
  } else {
    showToast('Use an Android device with Chrome to install');
  }
});
document.getElementById('closeAndroidModal').addEventListener('click', () => closeModal('androidModal'));

// ─── Push Notification Modal ─────────────────────────────────
document.getElementById('closeNotifModal').addEventListener('click', () => closeModal('notifModal'));
document.getElementById('skipNotifBtn').addEventListener('click', () => {
  closeModal('notifModal');
  showToast('You can enable notifications anytime');
});
document.getElementById('allowNotifBtn').addEventListener('click', async () => {
  closeModal('notifModal');
  await subscribeToNotifications();
});

// Welcome screen notification button
document.getElementById('welcomeNotifBtn').addEventListener('click', async () => {
  if (Notification.permission === 'granted') return;
  await subscribeToNotifications();
  if (Notification.permission === 'granted') {
    document.getElementById('notifStatus').textContent = 'On';
    const btn = document.getElementById('welcomeNotifBtn');
    btn.textContent = '✅ Notifications Enabled';
    btn.classList.add('enabled');
  }
});

// ─── Push Notifications ──────────────────────────────────────
async function subscribeToNotifications() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    showToast('Notifications not supported on this browser');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    showToast('Notifications blocked. Check browser settings.');
    return;
  }

  try {
    const keyRes = await fetch('/vapid-public-key');
    const { publicKey } = await keyRes.json();

    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    await fetch('/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    showToast('Notifications enabled!');
  } catch (err) {
    console.error(err);
    showToast('Could not enable notifications');
  }
}

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  return new Uint8Array([...atob(b64)].map(c => c.charCodeAt(0)));
}

// ─── Register Service Worker ─────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}

// ─── Auto prompt notifications if already installed ──────────
if (isInstalled()) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (Notification.permission === 'default') openModal('notifModal');
    }, 2000);
  });
}
