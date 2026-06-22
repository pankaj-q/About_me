require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
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
const heartbeatAttempts = new Map();

app.disable('x-powered-by');

const ALLOWED_ORIGINS = [
  'https://pankajb.online',
  'http://localhost:8000',
  'http://localhost:5002',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.get('Origin');
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const SELF = "'self'";
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [SELF],
      scriptSrc: [SELF],
      styleSrc: [SELF, "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: [SELF, 'https://fonts.gstatic.com'],
      imgSrc: [SELF, 'data:'],
      connectSrc: [SELF],
      frameAncestors: ["'none'"],
      baseUri: [SELF],
      formAction: [SELF],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(express.json({ limit: '2kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.static(path.join(__dirname, 'client', 'dist'), {
  maxAge: '1h',
  etag: true,
  immutable: true,
  setHeaders(res, p) {
    if (p.endsWith('index.html')) res.setHeader('Cache-Control', 'no-store, must-revalidate');
  },
}));

function csrfProtection(req, res, next) {
  if (req.method === 'GET') return next();
  const origin = req.get('Origin');
  const referer = req.get('Referer');
  const valid = origin
    ? ALLOWED_ORIGINS.includes(origin)
    : referer
      ? ALLOWED_ORIGINS.some(o => referer.startsWith(o))
      : false;
  if (!valid) return res.status(403).json({ error: 'Forbidden' });
  next();
}

async function readActivity() {
  try {
    const raw = await fs.readFile(ACTIVITY_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const fallback = {
      title: 'Backend - Login/SignUp',
      description: 'Writing backend for a video watching app like YouTube.',
      lastActiveAt: new Date(Date.now() - DEFAULT_LAST_ACTIVE_MS_AGO).toISOString(),
    };
    await writeActivity(fallback);
    return fallback;
  }
}

async function writeActivity(activity) {
  if (!activity || typeof activity !== 'object') throw new Error('Invalid activity data');
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
    title: String(activity.title || '').slice(0, MAX_TEXT_LENGTH),
    description: String(activity.description || '').slice(0, MAX_TEXT_LENGTH),
    isLive,
    lastActiveAt: safeLastActive.toISOString(),
    relativeTime: formatRelativeTime(safeLastActive, now),
    statusText: isLive ? 'live now' : `was live ${formatRelativeTime(safeLastActive, now)}`,
  };
}

function requireActivityApiKey(req, res, next) {
  if (!ACTIVITY_API_KEY || ACTIVITY_API_KEY === 'change-this-long-random-secret') {
    return res.status(503).json({ error: 'Activity updates are not configured. Set a secure ACTIVITY_API_KEY in .env' });
  }
  const key = req.get('x-api-key');
  if (!key || key !== ACTIVITY_API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

function validateIp(req) {
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

function rateLimitActivityUpdates(req, res, next) {
  const ip = validateIp(req);
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 10;
  const attempts = (postAttempts.get(ip) || []).filter((time) => now - time < windowMs);
  if (attempts.length >= maxAttempts) return res.status(429).json({ error: 'Too many requests' });
  attempts.push(now);
  postAttempts.set(ip, attempts);
  next();
}

function rateLimitHeartbeat(req, res, next) {
  const ip = validateIp(req);
  const now = Date.now();
  const windowMs = 30 * 1000;
  const attempts = (heartbeatAttempts.get(ip) || []).filter((t) => now - t < windowMs);
  if (attempts.length >= 1) return res.json({ ok: true });
  attempts.push(now);
  heartbeatAttempts.set(ip, attempts);
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
  if (typeof value !== 'string') return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function validateActivityBody(req, res, next) {
  const body = req.body || {};
  if (typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  next();
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'about-pankaj-backend' });
});

app.get('/api/profile/activity', csrfProtection, async (req, res, next) => {
  try {
    const activity = await readActivity();
    res.json(toStatus(activity));
  } catch (error) {
    next(error);
  }
});

app.post(
  '/api/profile/activity',
  csrfProtection,
  validateActivityBody,
  requireActivityApiKey,
  rateLimitActivityUpdates,
  async (req, res, next) => {
    try {
      const current = await readActivity();
      const updated = {
        ...current,
        title: cleanText(req.body.title, current.title),
        description: cleanText(req.body.description, current.description),
        lastActiveAt: cleanDate(req.body.lastActiveAt),
      };
      await writeActivity(updated);
      res.json(toStatus(updated));
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  '/api/profile/heartbeat',
  csrfProtection,
  rateLimitHeartbeat,
  async (req, res, next) => {
    try {
      const current = await readActivity();
      current.lastActiveAt = new Date().toISOString();
      await writeActivity(current);
      res.json(toStatus(current));
    } catch (error) {
      next(error);
    }
  },
);

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  }
  res.status(404).json({ error: 'Not found' });
});

app.use((error, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${error.message || 'Server error'}`);
  res.status(500).json({ error: 'Server error' });
});

function cleanup() {
  postAttempts.clear();
  heartbeatAttempts.clear();
}

process.on('SIGTERM', () => { cleanup(); process.exit(0); });
process.on('SIGINT', () => { cleanup(); process.exit(0); });
process.on('uncaughtException', (error) => {
  console.error(`[UNCAUGHT] ${error.message}`);
  cleanup();
  process.exit(1);
});

app.listen(PORT, () => {
  if (ACTIVITY_API_KEY === 'change-this-long-random-secret') {
    console.warn('[WARN] ACTIVITY_API_KEY is still the default value. Set a secure key in .env for production.');
  }
  console.log(`Portfolio backend running at http://localhost:${PORT}`);
});
