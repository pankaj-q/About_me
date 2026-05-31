const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const ACTIVITY_FILE = path.join(__dirname, 'data', 'activity.json');
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const LIVE_WINDOW_MS = Number(process.env.LIVE_WINDOW_MS || 5 * 60 * 1000);

app.use(express.json());
app.use(express.static(__dirname));

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
      lastActiveAt: new Date(Date.now() - LAST_ACTIVE_MS_AGO).toISOString()
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
  const isLive = now.getTime() - lastActive.getTime() <= LIVE_WINDOW_MS;

  return {
    title: activity.title,
    description: activity.description,
    isLive,
    lastActiveAt: activity.lastActiveAt,
    relativeTime: formatRelativeTime(lastActive, now),
    statusText: isLive ? 'live now' : `was live ${formatRelativeTime(lastActive, now)}`
  };
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

app.post('/api/profile/activity', async (req, res, next) => {
  try {
    const current = await readActivity();
    const updated = {
      ...current,
      title: req.body.title || current.title,
      description: req.body.description || current.description,
      lastActiveAt: req.body.lastActiveAt || new Date().toISOString()
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
