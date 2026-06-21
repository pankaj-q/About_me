import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useActivity from '../hooks/useActivity';

export default function Home() {
  const { activity, loading } = useActivity();
  const navigate = useNavigate();

  return (
    <section className="landing">
      <div className="badge">
        <span className="dot" />
        {loading ? 'Loading...' : activity.isLive ? 'Live now' : activity.statusText}
      </div>
      <div className="badge">
        <span className="dot" />
        {loading ? 'Loading...' : activity.isLive ? 'Backend Developer' : activity.statusText}
      </div>
       <h1>PANKAJ</h1>
      
      <p>I build server-side systems and integrate AI APIs into real products.</p>
      <div className="btns">
        <a className="btn btn-primary" onClick={() => navigate('/work')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          See my work
        </a>
        <span className="btn btn-ghost">Learing System Design</span>
      </div>
    </section>
  );
}
