export default function SplashScreen({ visible }) {
  return (
    <div className={`splash-screen${visible ? '' : ' hide'}`}>
      <div className="splash-glow" />
      <img src="/icons/icon-512.png?v=3" className="splash-icon" alt="MoonBet" />
      <div className="splash-name">MoonBet</div>
      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
    </div>
  )
}
