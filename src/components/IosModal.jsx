const isIOS      = () => /iPad|iPhone|iPod/.test(navigator.userAgent)
const isIOSSafari = () => isIOS() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS/.test(navigator.userAgent)

export default function IosModal({ open, onClose }) {
  const showWarning = isIOS() && !isIOSSafari()

  return (
    <div className={`modal-overlay${open ? ' active' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal ios-modal">
        <div className="modal-handle" />
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="ios-app-preview">
          <div className="ios-app-icon">🌙</div>
          <div className="ios-app-info">
            <strong>MoonBet</strong>
            <span>moonbet.com</span>
          </div>
          <div className="ios-free-badge">FREE</div>
        </div>

        <div className="ios-modal-title">Add to Home Screen</div>
        <p className="ios-modal-sub">Follow these 3 quick steps in Safari</p>

        <div className="ios-steps">
          <div className="ios-step-card">
            <div className="ios-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="ios-step-text">
              <strong>Tap Share</strong>
              <span>Bottom bar mein share icon dabao</span>
            </div>
            <div className="ios-step-num">1</div>
          </div>

          <div className="ios-step-card">
            <div className="ios-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div className="ios-step-text">
              <strong>Add to Home Screen</strong>
              <span>Menu mein scroll karke select karo</span>
            </div>
            <div className="ios-step-num">2</div>
          </div>

          <div className="ios-step-card">
            <div className="ios-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="ios-step-text">
              <strong>Tap Add</strong>
              <span>Top right mein "Add" confirm karo</span>
            </div>
            <div className="ios-step-num">3</div>
          </div>
        </div>

        {showWarning && (
          <div className="ios-note">
            ⚠️ Safari mein open karo — Chrome/Firefox pe install nahi hoga
          </div>
        )}
      </div>
    </div>
  )
}
