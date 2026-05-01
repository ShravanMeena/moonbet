export default function InstallPage({ onIosClick, onAndroidClick }) {
  return (
    <div className="container">
      <div className="hero">
        <span className="logo">🌙</span>
        <h1>MoonBet</h1>
        <p className="subtitle">Install our app for the best experience</p>
      </div>

      <div className="buttons">
        <button className="btn btn-ios" onClick={onIosClick}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53
                     0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39
                     c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07
                     3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02
                     2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83
                     1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83
                     1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div className="btn-label">
            Install on iOS
            <span>Safari required</span>
          </div>
        </button>

        <button className="btn btn-android" onClick={onAndroidClick}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
            <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88
                     3.24C14.86 8.33 13.46 8 12 8s-2.86.33-4.47.91L5.65 5.67c-.19-.28-.54-.37
                     -.83-.22-.3.16-.42.54-.26.85L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22
                     c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25S6.31
                     12.75 7 12.75s1.25.56 1.25 1.25S7.69 15.25 7 15.25zm10 0c-.69
                     0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25
                     1.25z"/>
          </svg>
          <div className="btn-label">
            Install on Android
            <span>Chrome required</span>
          </div>
        </button>
      </div>

      <div className="features">
        <div className="feature"><span>⚡</span><p>Fast &amp; Offline</p></div>
        <div className="feature"><span>🔔</span><p>Notifications</p></div>
        <div className="feature"><span>📱</span><p>Native Feel</p></div>
      </div>
    </div>
  )
}
