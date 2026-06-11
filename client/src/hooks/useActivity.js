import { useState, useEffect, useCallback } from 'react';

const POLL_INTERVAL = 60000;

async function sendHeartbeat() {
  try {
    await fetch('/api/profile/heartbeat', { method: 'POST' });
  } catch {
    // silently fail
  }
}

export default function useActivity() {
  const [activity, setActivity] = useState({
    title: 'Backend - Login/SignUp',
    description: 'Writing backend for a video watching app like YouTube.',
    isLive: false,
    statusText: 'Checking live status...',
  });
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/profile/activity');
      if (!res.ok) throw new Error('Could not load activity status');
      const data = await res.json();
      setActivity(data);
    } catch {
      setActivity((prev) => ({
        ...prev,
        statusText: 'Live status unavailable',
        isLive: false,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    sendHeartbeat();
    fetchActivity();
    const id = setInterval(() => {
      sendHeartbeat();
      fetchActivity();
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchActivity]);

  return { activity, loading };
}
