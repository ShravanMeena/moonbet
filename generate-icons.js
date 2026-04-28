const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Rounded square background
  const r = size * 0.22;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();

  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, '#1a1a3e');
  bg.addColorStop(1, '#0a0a1a');
  ctx.fillStyle = bg;
  ctx.fill();

  // Crescent moon
  const cx = size * 0.48;
  const cy = size * 0.52;
  const moonR = size * 0.27;

  ctx.beginPath();
  ctx.arc(cx, cy, moonR, 0, Math.PI * 2);
  ctx.fillStyle = '#c5a3ff';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + moonR * 0.42, cy - moonR * 0.1, moonR * 0.78, 0, Math.PI * 2);
  ctx.fillStyle = '#0d0d2b';
  ctx.fill();

  // Stars
  [
    [0.73, 0.27, 0.038],
    [0.69, 0.41, 0.026],
    [0.79, 0.37, 0.02],
  ].forEach(([x, y, rad]) => {
    ctx.beginPath();
    ctx.arc(x * size, y * size, rad * size, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  });

  return canvas.toBuffer('image/png');
}

if (!fs.existsSync('icons')) fs.mkdirSync('icons');
fs.writeFileSync('icons/icon-192.png', generateIcon(192));
fs.writeFileSync('icons/icon-512.png', generateIcon(512));
console.log('Icons generated: icons/icon-192.png, icons/icon-512.png');
