export default function NotifModal({ open, onClose, onAllow, onSkip }) {
  return (
    <div className={`modal-overlay${open ? ' active' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle" />
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="notif-content">
          <div className="notif-icon">🔔</div>
          <h2>Enable Notifications</h2>
          <p>Stay updated with live alerts, exclusive offers, and important updates delivered directly to your device.</p>
          <button className="btn-primary" onClick={onAllow}>Allow Notifications</button>
          <button className="btn-secondary" onClick={onSkip}>Maybe Later</button>
        </div>
      </div>
    </div>
  )
}
