const sharp = require('sharp');
const fs = require('fs');

// Moon + Stars SVG — matches the yellow moon icon
function moonSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <!-- Background -->
  <rect width="100" height="100" fill="#13103a"/>

  <!-- Moon body -->
  <circle cx="46" cy="54" r="28" fill="#FFCC00"/>

  <!-- Cut-out to make crescent -->
  <circle cx="55" cy="51" r="21" fill="#13103a"/>

  <!-- Big star (top-left) -->
  <polygon points="22,22 25.5,32 36,32 27.5,38 30.5,48 22,42 13.5,48 16.5,38 8,32 18.5,32"
    fill="#FFCC00"/>

  <!-- Small star (top-right) -->
  <polygon points="64,16 66.3,22.5 73,22.5 67.5,26.5 69.8,33 64,29 58.2,33 60.5,26.5 55,22.5 61.7,22.5"
    fill="#FFCC00"/>
</svg>`;
}

function splashSVG(width, height) {
  const iconSize = Math.round(Math.min(width, height) * 0.26);
  const ix = Math.round((width - iconSize) / 2);
  const iy = Math.round(height / 2 - iconSize * 0.7);
  const fontSize = Math.round(iconSize * 0.28);
  const textY = Math.round(iy + iconSize + fontSize * 1.1);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="#13103a"/>
  <!-- Icon group -->
  <g transform="translate(${ix}, ${iy})">
    <rect width="${iconSize}" height="${iconSize}" rx="${iconSize*0.18}" fill="#1e1650"/>
    <circle cx="${iconSize*0.46}" cy="${iconSize*0.54}" r="${iconSize*0.28}" fill="#FFCC00"/>
    <circle cx="${iconSize*0.55}" cy="${iconSize*0.51}" r="${iconSize*0.21}" fill="#1e1650"/>
    <polygon points="${star5(iconSize*0.22, iconSize*0.22, iconSize*0.092, iconSize*0.038)}" fill="#FFCC00"/>
    <polygon points="${star5(iconSize*0.64, iconSize*0.16, iconSize*0.060, iconSize*0.025)}" fill="#FFCC00"/>
  </g>
  <text x="${width/2}" y="${textY}" font-family="Arial" font-size="${fontSize}" font-weight="800"
    fill="white" text-anchor="middle">MoonBet</text>
</svg>`;
}

function star5(cx, cy, r, ir) {
  let pts = '';
  for (let i = 0; i < 5; i++) {
    const oa = (i * 4 * Math.PI / 5) - Math.PI / 2;
    const ia = oa + Math.PI / 5;
    pts += `${(cx + Math.cos(oa)*r).toFixed(1)},${(cy + Math.sin(oa)*r).toFixed(1)} `;
    pts += `${(cx + Math.cos(ia)*ir).toFixed(1)},${(cy + Math.sin(ia)*ir).toFixed(1)} `;
  }
  return pts.trim();
}

async function run() {
  if (!fs.existsSync('icons'))  fs.mkdirSync('icons');
  if (!fs.existsSync('splash')) fs.mkdirSync('splash');

  // App icons
  for (const size of [180, 192, 512]) {
    await sharp(Buffer.from(moonSVG(size)))
      .png()
      .toFile(`icons/icon-${size}.png`);
  }
  // moon.png alias
  await sharp(Buffer.from(moonSVG(512))).png().toFile('icons/moon.png');
  console.log('Icons generated: icon-180, icon-192, icon-512, moon.png');

  // iOS splash screens
  const splashes = [
    [640,  1136, 'iphone-se'],
    [750,  1334, 'iphone-8'],
    [1125, 2436, 'iphone-x'],
    [1170, 2532, 'iphone-12'],
    [1284, 2778, 'iphone-12-max'],
    [828,  1792,  'iphone-xr'],
  ];
  for (const [w, h, name] of splashes) {
    await sharp(Buffer.from(splashSVG(w, h))).png().toFile(`splash/${name}.png`);
  }
  console.log('Splash screens generated');
}

run().catch(console.error);
