const track = document.getElementById('track');
const cards = track.querySelectorAll('.project-card');
const dotsEl = document.getElementById('dots');
const total = cards.length;
const visible = window.innerWidth <= 480 ? 1 : 2;
const steps = total - visible;
let current = 0;

dotsEl.innerHTML = '';
for (let i = 0; i <= steps; i += 1) {
  const d = document.createElement('div');
  d.className = `dot-ind${i === 0 ? ' active' : ''}`;
  dotsEl.appendChild(d);
}

function goTo(n) {
  current = Math.max(0, Math.min(n, steps));
  const cardW = cards[0].offsetWidth + 10;
  track.style.transform = `translateX(-${current * cardW}px)`;
  dotsEl.querySelectorAll('.dot-ind').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

document.getElementById('prev').addEventListener('click', () => goTo(current - 1));
document.getElementById('next').addEventListener('click', () => goTo(current + 1));

async function loadActivityStatus() {
  const titleEl = document.getElementById('activity-title');
  const descEl = document.getElementById('activity-desc');
  const statusEl = document.getElementById('activity-status');

  try {
    const response = await fetch('/api/profile/activity');
    if (!response.ok) {
      throw new Error('Could not load activity status');
    }

    const activity = await response.json();
    titleEl.textContent = activity.title;
    descEl.textContent = activity.description;
    statusEl.textContent = activity.statusText;
    statusEl.dataset.live = activity.isLive ? 'true' : 'false';
  } catch (error) {
    statusEl.textContent = 'Live status unavailable';
    statusEl.dataset.live = 'false';
  }
}

loadActivityStatus();
setInterval(loadActivityStatus, 60000);
