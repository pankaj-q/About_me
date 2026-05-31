require('dotenv').config();

const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const ACTIVITY_FILE = path.join(__dirname, 'data', 'activity.json');
const DEFAULT_LAST_ACTIVE_HOURS_AGO = Number(process.env.LAST_ACTIVE_HOURS_AGO || 2);
const DEFAULT_LAST_ACTIVE_MS_AGO = DEFAULT_LAST_ACTIVE_HOURS_AGO * 60 * 60 * 1000;
const LIVE_WINDOW_MS = Number(process.env.LIVE_WINDOW_MS || 5 * 60 * 1000);
const ACTIVITY_API_KEY = process.env.ACTIVITY_API_KEY;
const MAX_TEXT_LENGTH = 180;
const postAttempts = new Map();

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});

async function readActivity() {
  try {
    const raw = await fs.readFile(ACTIVITY_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    const fallback = {
      title: 'Backend - Login/SignUp',
      description: 'Writing backend for a video watching app like YouTube.',
      lastActiveAt: new Date(Date.now() - DEFAULT_LAST_ACTIVE_MS_AGO).toISOString()
    };

    await writeActivity(fallback);
    return fallback;
  }
}

async function writeActivity(activity) {
  await fs.mkdir(path.dirname(ACTIVITY_FILE), { recursive: true });
  await fs.writeFile(ACTIVITY_FILE, `${JSON.stringify(activity, null, 2)}\n`);
}

function formatRelativeTime(date, now = new Date()) {
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function toStatus(activity) {
  const lastActive = new Date(activity.lastActiveAt);
  const now = new Date();
  const hasValidDate = !Number.isNaN(lastActive.getTime());
  const safeLastActive = hasValidDate ? lastActive : new Date(now.getTime() - DEFAULT_LAST_ACTIVE_MS_AGO);
  const isLive = now.getTime() - safeLastActive.getTime() <= LIVE_WINDOW_MS;

  return {
    title: activity.title,
    description: activity.description,
    isLive,
    lastActiveAt: safeLastActive.toISOString(),
    relativeTime: formatRelativeTime(safeLastActive, now),
    statusText: isLive ? 'live now' : `was live ${formatRelativeTime(safeLastActive, now)}`
  };
}

function requireActivityApiKey(req, res, next) {
  if (!ACTIVITY_API_KEY) {
    return res.status(503).json({ error: 'Activity updates are not configured' });
  }

  const key = req.get('x-api-key');
  if (key !== ACTIVITY_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

function rateLimitActivityUpdates(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 10;
  const attempts = (postAttempts.get(ip) || []).filter((time) => now - time < windowMs);

  if (attempts.length >= maxAttempts) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  attempts.push(now);
  postAttempts.set(ip, attempts);
  next();
}

function cleanText(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

function cleanDate(value) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'about-pankaj-backend' });
});

app.get('/api/profile/activity', async (req, res, next) => {
  try {
    const activity = await readActivity();
    res.json(toStatus(activity));
  } catch (error) {
    next(error);
  }
});

app.post('/api/profile/activity', requireActivityApiKey, rateLimitActivityUpdates, async (req, res, next) => {
  try {
    const current = await readActivity();
    const updated = {
      ...current,
      title: cleanText(req.body.title, current.title),
      description: cleanText(req.body.description, current.description),
      lastActiveAt: cleanDate(req.body.lastActiveAt)
    };

    await writeActivity(updated);
    res.json(toStatus(updated));
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Portfolio backend running at http://localhost:${PORT}`);
});
