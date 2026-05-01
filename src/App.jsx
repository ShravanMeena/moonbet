import { useState, useEffect, useRef } from 'react'
import SplashScreen  from './components/SplashScreen'
import InstallPage   from './components/InstallPage'
import WelcomePage   from './components/WelcomePage'
import IosModal      from './components/IosModal'
import NotifModal    from './components/NotifModal'
import Toast         from './components/Toast'

const isIOS       = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const isAndroid   = () => /Android/.test(navigator.userAgent)
const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  return new Uint8Array([...atob(b64)].map(c => c.charCodeAt(0)))
}

export default function App() {
  const [splashVisible, setSplashVisible]   = useState(true)
  const [installed, setInstalled]           = useState(false)
  const [activeModal, setActiveModal]       = useState(null) // 'ios' | 'notif' | null
  const [toast, setToast]                   = useState('')
  const [notifEnabled, setNotifEnabled]     = useState(false)
  const deferredPrompt = useRef(null)

  useEffect(() => {
    // Hide splash after 1.4s
    const t = setTimeout(() => setSplashVisible(false), 1400)

    // Detect installed state
    setInstalled(isInstalled())
    if (Notification.permission === 'granted') setNotifEnabled(true)

    // Capture Android install prompt
    const onPrompt = e => { e.preventDefault(); deferredPrompt.current = e }
    window.addEventListener('beforeinstallprompt', onPrompt)

    // After Android install
    const onInstalled = () => {
      deferredPrompt.current = null
      showToast('App installed successfully!')
      setTimeout(() => setActiveModal('notif'), 2000)
    }
    window.addEventListener('appinstalled', onInstalled)

    // Auto-show notif modal if already in PWA
    if (isInstalled() && Notification.permission === 'default') {
      setTimeout(() => setActiveModal('notif'), 2000)
    }

    return () => {
      clearTimeout(t)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleAndroidInstall() {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt()
      const { outcome } = await deferredPrompt.current.userChoice
      deferredPrompt.current = null
      showToast(outcome === 'accepted' ? 'Installing app...' : 'Installation cancelled')
    } else if (isAndroid()) {
      showToast('Open this page in Chrome to install')
    } else {
      showToast('Use an Android device with Chrome to install')
    }
  }

  async function subscribeToNotifications() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      showToast('Notifications not supported')
      return
    }
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      showToast('Notifications blocked. Check browser settings.')
      return
    }
    try {
      const { publicKey } = await fetch('/vapid-public-key').then(r => r.json())
      const reg = await navigator.serviceWorker.ready
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      })
      await fetch('/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      })
      setNotifEnabled(true)
      showToast('Notifications enabled!')
    } catch (err) {
      console.error(err)
      showToast('Could not enable notifications')
    }
  }

  return (
    <>
      <SplashScreen visible={splashVisible} />

      {!splashVisible && (
        installed
          ? <WelcomePage notifEnabled={notifEnabled} onEnableNotif={subscribeToNotifications} />
          : <InstallPage onIosClick={() => setActiveModal('ios')} onAndroidClick={handleAndroidInstall} />
      )}

      <IosModal
        open={activeModal === 'ios'}
        onClose={() => setActiveModal(null)}
      />

      <NotifModal
        open={activeModal === 'notif'}
        onClose={() => setActiveModal(null)}
        onAllow={async () => { setActiveModal(null); await subscribeToNotifications() }}
        onSkip={() => { setActiveModal(null); showToast('You can enable notifications anytime') }}
      />

      <Toast message={toast} />
    </>
  )
}
