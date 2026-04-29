const { createCanvas } = require('canvas');
const fs = require('fs');

function drawMoonIcon(canvas) {
  const ctx = canvas.getContext('2d');
  const s = canvas.width;

  // Background — dark purple
  const bg = ctx.createLinearGradient(0, 0, s, s);
  bg.addColorStop(0, '#1a1040');
  bg.addColorStop(1, '#0a0820');
  ctx.fillStyle = bg;
  ctx.roundRect(0, 0, s, s, s * 0.22);
  ctx.fill();

  const cx = s * 0.5;
  const cy = s * 0.52;

  // ── Crescent moon ──────────────────────────────────────────
  const moonR  = s * 0.30;
  const cutR   = s * 0.235;
  const cutOffX = s * 0.10;
  const cutOffY = s * -0.04;

  // Moon fill (gold gradient)
  const moonGrad = ctx.createRadialGradient(
    cx - moonR * 0.2, cy - moonR * 0.2, moonR * 0.1,
    cx, cy, moonR
  );
  moonGrad.addColorStop(0, '#FFE566');
  moonGrad.addColorStop(0.5, '#FFCC00');
  moonGrad.addColorStop(1, '#E6A800');

  // Right shading for 3D effect
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, moonR, 0, Math.PI * 2);
  ctx.fillStyle = moonGrad;
  ctx.fill();

  // Cut-out to make crescent
  ctx.beginPath();
  ctx.arc(cx + cutOffX, cy + cutOffY, cutR, 0, Math.PI * 2);
  ctx.fillStyle = '#0d0820';
  ctx.fill();

  // Right-edge shadow for depth
  ctx.beginPath();
  ctx.arc(cx, cy, moonR, 0, Math.PI * 2);
  const shadowGrad = ctx.createLinearGradient(cx - moonR, cy, cx + moonR, cy);
  shadowGrad.addColorStop(0, 'transparent');
  shadowGrad.addColorStop(0.7, 'transparent');
  shadowGrad.addColorStop(1, 'rgba(180,100,0,0.35)');
  ctx.fillStyle = shadowGrad;
  ctx.fill();

  // Cut-out again (clean)
  ctx.beginPath();
  ctx.arc(cx + cutOffX, cy + cutOffY, cutR, 0, Math.PI * 2);
  ctx.fillStyle = '#0d0820';
  ctx.fill();
  ctx.restore();

  // ── Stars ─────────────────────────────────────────────────
  function drawStar(x, y, r, color1, color2) {
    const grad = ctx.createRadialGradient(x - r*0.2, y - r*0.2, r*0.05, x, y, r);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);

    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + (2 * Math.PI) / 10;
      if (i === 0) ctx.moveTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r);
      else ctx.lineTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r);
      ctx.lineTo(Math.cos(innerAngle) * r * 0.42, Math.sin(innerAngle) * r * 0.42);
    }
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // Big star (top-left of moon)
  drawStar(cx - moonR * 0.55, cy - moonR * 0.62, s * 0.095, '#FFE566', '#FFAA00');
  // Small star (top-right)
  drawStar(cx + moonR * 0.28, cy - moonR * 0.78, s * 0.062, '#FFE566', '#FFAA00');
}

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  drawMoonIcon(canvas);
  return canvas.toBuffer('image/png');
}

function generateSplash(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#1a1040');
  bg.addColorStop(1, '#0a0820');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Glow
  const glow = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width*0.4);
  glow.addColorStop(0, 'rgba(108,99,255,0.18)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Centered icon
  const iconSize = Math.min(width, height) * 0.28;
  const iconCanvas = createCanvas(iconSize, iconSize);
  drawMoonIcon(iconCanvas);
  ctx.drawImage(iconCanvas, (width - iconSize) / 2, height / 2 - iconSize * 0.65, iconSize, iconSize);

  // App name
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${iconSize * 0.35}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MoonBet', width / 2, height / 2 + iconSize * 0.55);

  return canvas.toBuffer('image/png');
}

if (!fs.existsSync('icons')) fs.mkdirSync('icons');
if (!fs.existsSync('splash')) fs.mkdirSync('splash');

// App icons
fs.writeFileSync('icons/icon-192.png', generateIcon(192));
fs.writeFileSync('icons/icon-512.png', generateIcon(512));
fs.writeFileSync('icons/icon-180.png', generateIcon(180)); // iOS apple-touch-icon
console.log('Icons generated');

// iOS splash screens (key sizes)
const splashes = [
  [640,  1136, 'iphone-se'],
  [750,  1334, 'iphone-8'],
  [1125, 2436, 'iphone-x'],
  [1170, 2532, 'iphone-12'],
  [1284, 2778, 'iphone-12-max'],
  [828,  1792, 'iphone-xr'],
];
splashes.forEach(([w, h, name]) => {
  fs.writeFileSync(`splash/${name}.png`, generateSplash(w, h));
});
console.log('Splash screens generated');
