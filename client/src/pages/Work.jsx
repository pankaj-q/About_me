import { useState } from 'react';
import useActivity from '../hooks/useActivity';

const projects = [
  {
    title: 'Portfolio Website',
    desc: 'You\'re looking at it — a full-stack portfolio with live activity tracking, light/dark theme, particle animations, and a REST API backend with heartbeat-based live status.',
    detail: 'Built from scratch with React 19 and Vite for the frontend, with an Express.js backend serving both the API and static files. Features include live activity tracking via heartbeat polling, IP-based rate limiting, light/dark theme with localStorage persistence, animated particle background, and client-side routing with React Router.',
    stack: ['React 19', 'Vite', 'Express', 'CSS'],
    links: { github: '#', live: 'https://bpankaj.online' },
    featured: true,
  },
  {
    title: 'Video App Backend',
    desc: 'Authentication and user management system for a video streaming platform. JWT-based login/signup with session handling.',
    detail: 'Full backend service for a video streaming application. Implements JWT-based authentication with access and refresh tokens, user CRUD operations, content moderation workflows, role-based access control, and real-time notification delivery. Built with a clean architecture pattern separating routes, controllers, services, and middleware.',
    stack: ['Node.js', 'Express', 'JWT', 'MongoDB'],
    links: { github: '#' },
  },
  {
    title: 'AI API Integration',
    desc: 'Server-side integration of LLM APIs into production applications with rate limiting, caching, and fallback strategies.',
    detail: 'Production-grade integration layer for large language model APIs. Features include token-aware rate limiting, response caching with TTL-based invalidation, automatic fallback between multiple providers, prompt template management, and structured output parsing. Designed for reliability with circuit breaker pattern and comprehensive error handling.',
    stack: ['Python', 'FastAPI', 'OpenAI', 'Redis'],
    links: { github: '#' },
  },
  {
    title: 'Live Activity Tracker',
    desc: 'Real-time heartbeat monitoring system that tracks coding activity and exposes a live status API.',
    detail: 'Lightweight activity tracking system with an Express.js backend reading from a JSON file store. Features automatic stale detection (2-hour window), configurable live window (5 minutes), IP-based rate limiting on POST endpoints, and a React hook (useActivity) that polls the API every 60 seconds with automatic heartbeat pings.',
    stack: ['Node.js', 'Express', 'REST API'],
    links: { github: '#' },
  },
];

const skills = [
  { category: 'Languages', items: ['JavaScript', 'Python', 'TypeScript', 'SQL'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'FastAPI', 'REST API'] },
  { category: 'Frontend', items: ['React', 'Vite', 'HTML/CSS'] },
  { category: 'Tools', items: ['Git', 'MongoDB', 'Redis', 'JWT'] },
];

export default function Work() {
  const { activity, loading } = useActivity();
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="page-section">
      <div className="page-section-inner">
        <h2 className="page-title">Work</h2>
        <p className="page-sub">Current activity and projects I am building.</p>

        {!loading && (
          <div className="live-card">
            <div className="live-dot" data-live={activity.isLive} />
            <div className="live-body">
              <span className="live-label">Currently working on</span>
              <strong className="live-title">{activity.title}</strong>
              <p className="live-desc">{activity.description}</p>
              <span className="live-status">{activity.statusText}</span>
            </div>
          </div>
        )}

        <div className="project-grid">
          {projects.map((p, i) => (
            <div
              className={'project-card' + (p.featured ? ' project-card-featured' : '') + (expanded === i ? ' project-card-expanded' : '')}
              key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="project-card-header">
                <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="project-links" onClick={e => e.stopPropagation()}>
                  {p.links.live && (
                    <a href={p.links.live} target="_blank" rel="noopener" title="Live site">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </a>
                  )}
                  <a href={p.links.github} target="_blank" rel="noopener" title="View source">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.stack.map((s, j) => <span key={j} className="tag">{s}</span>)}
              </div>
              {expanded === i && (
                <div className="project-detail">
                  <p>{p.detail}</p>
                </div>
              )}
              <div className="project-expand">
                <span>{expanded === i ? 'Show less' : 'Show more'}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={'expand-icon' + (expanded === i ? ' expanded' : '')}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="skills-section">
          <h3 className="skills-title">Skills & Technologies</h3>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <div className="skill-group" key={i}>
                <span className="skill-category">{s.category}</span>
                <div className="skill-items">
                  {s.items.map((item, j) => (
                    <span className="skill-item" key={j}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
