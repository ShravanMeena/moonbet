require('dotenv').config();
const express = require('express');
const webpush  = require('web-push');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve icons and splash (always)
app.use('/icons',  express.static(path.join(__dirname, 'icons')));
app.use('/splash', express.static(path.join(__dirname, 'splash')));

// Serve React build in production, root dir in dev
const isProd = process.env.NODE_ENV === 'production';
app.use(express.static(path.join(__dirname, isProd ? 'dist' : '.')));

// ── VAPID setup ──────────────────────────────────────────────
const VAPID_PUBLIC_KEY  = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL       = process.env.VAPID_EMAIL || 'mailto:admin@moonbet.com';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('\n VAPID keys missing!');
  console.error(' Run: npm run generate-keys');
  console.error(' Then copy the keys into your .env file\n');
  process.exit(1);
}

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// ── Subscription store (file-based) ─────────────────────────
const SUBS_FILE = path.join(__dirname, 'subscriptions.json');
let subscriptions = [];

if (fs.existsSync(SUBS_FILE)) {
  try { subscriptions = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8')); }
  catch (_) { subscriptions = []; }
}

function saveSubs() {
  fs.writeFileSync(SUBS_FILE, JSON.stringify(subscriptions, null, 2));
}

// ── Routes ───────────────────────────────────────────────────

// Frontend fetches this to subscribe to push
app.get('/vapid-public-key', (_, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

// Save a new push subscription
app.post('/subscribe', (req, res) => {
  const sub = req.body;
  if (!sub || !sub.endpoint) return res.status(400).json({ error: 'Invalid subscription' });

  const exists = subscriptions.find(s => s.endpoint === sub.endpoint);
  if (!exists) {
    subscriptions.push(sub);
    saveSubs();
  }

  res.json({ success: true });
});

// Send push notification with deep link
// POST body: { title, body, url }
// Example: { title: "New Offer!", body: "50% bonus today", url: "/offers/50bonus" }
app.post('/send-notification', async (req, res) => {
  const { title = 'MoonBet', body = 'You have a new update!', url = '/' } = req.body;

  const payload = JSON.stringify({ title, body, url });

  const results = await Promise.allSettled(
    subscriptions.map(sub => webpush.sendNotification(sub, payload))
  );

  // Remove expired/invalid subscriptions
  const expired = [];
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const status = r.reason?.statusCode;
      if (status === 410 || status === 404) expired.push(i);
    }
  });
  if (expired.length) {
    subscriptions = subscriptions.filter((_, i) => !expired.includes(i));
    saveSubs();
  }

  const sent   = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.length - sent;

  res.json({ success: true, sent, failed, total: subscriptions.length });
});

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n MoonBet server running at http://localhost:${PORT}`);
  console.log(` To send a test notification:`);
  console.log(`   curl -X POST http://localhost:${PORT}/send-notification \\`);
  console.log(`        -H "Content-Type: application/json" \\`);
  console.log(`        -d '{"title":"Test","body":"Hello!","url":"/offers"}'`);
  console.log('');
});
