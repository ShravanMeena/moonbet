export default function WelcomePage({ notifEnabled, onEnableNotif }) {
  return (
    <div className="welcome-screen visible">
      <div className="welcome-bg-glow" />

      <div className="welcome-top">
        <span className="welcome-logo">🌙</span>
        <h1 className="welcome-title">MoonBet</h1>
        <p className="welcome-tag">Welcome back!</p>
      </div>

      <div className="welcome-card">
        <div className="welcome-card-icon">🎯</div>
        <div className="welcome-card-text">
          <strong>Ready to Play</strong>
          <span>Your app is installed &amp; running</span>
        </div>
      </div>

      <div className="welcome-stats">
        <div className="stat">
          <span className="stat-val">Live</span>
          <span className="stat-label">Status</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-val">{notifEnabled ? 'On' : 'Off'}</span>
          <span className="stat-label">Notifications</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-val">PWA</span>
          <span className="stat-label">Mode</span>
        </div>
      </div>

      <button
        className={`welcome-notif-btn${notifEnabled ? ' enabled' : ''}`}
        onClick={notifEnabled ? undefined : onEnableNotif}
      >
        {notifEnabled ? '✅ Notifications Enabled' : '🔔 Enable Notifications'}
      </button>
    </div>
  )
}
