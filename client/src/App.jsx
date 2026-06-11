import { useState, useRef, useEffect, useCallback } from 'react';
import BackgroundParticles from './components/BackgroundParticles';
import useActivity from './hooks/useActivity';

const projects = [
  {
    name: 'FinanceDashboard',
    desc: 'Manage and record finances for purchasing things.',
    tags: ['Node.js', 'MongoDB', 'OpenAI API'],
  },
  {
    name: 'Restaurant Management',
    desc: 'Manage orders, payments, menus with the best customer experience.',
    tags: ['Express', 'PostgreSQL', 'Redis'],
  },
  {
    name: 'URL Shortener',
    desc: 'Short URLs powered by AI — clean, fast, trackable.',
    tags: ['Firebase', 'Supabase', 'Anthropic'],
  },
  {
    name: 'TO-DO App',
    desc: 'Simple daily task manager built with vanilla stack.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
];

function LiveDot({ isLive }) {
  return (
    <span className={`hero-live ${isLive ? 'hero-live--active' : 'hero-live--inactive'}`}>
      <span className="hero-live-dot" />
      <span className="hero-live-text">
        {isLive ? 'Building something' : 'Away'}
      </span>
    </span>
  );
}

const panelConfig = {
  about: { color: 'blue', label: 'about' },
  activity: { color: 'green', label: 'currently' },
  stack: { color: 'purple', label: 'stack' },
  tools: { color: 'cyan', label: 'tools' },
  projects: { color: 'orange', label: 'projects' },
};

function Panel({ indicator, label, children, delay, className }) {
  return (
    <section
      className={`panel ${className || ''}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      <div className="panel-header">
        <span className={`panel-indicator panel-indicator--${indicator}`} />
        <span className={`panel-label panel-label--${indicator}`}>{label}</span>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const { activity } = useActivity();
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  const visible = 2;
  const steps = projects.length - visible;

  const goTo = useCallback((n) => {
    setCurrent(Math.max(0, Math.min(n, steps)));
  }, [steps]);

  useEffect(() => {
    if (!trackRef.current || !cardRefs.current.length) return;
    const cardW = cardRefs.current[0]?.offsetWidth + 8 || 0;
    trackRef.current.style.transform = `translateX(-${current * cardW}px)`;
  }, [current]);

  return (
    <>
      <BackgroundParticles />
      <div className="portfolio">
        <header className="hero">
          <div className="hero-line">
            <span className="hero-line-user">pankaj</span>
            <span className="hero-line-at">@</span>
            <span className="hero-line-host">dev</span>
            <span>:</span>
            <span className="hero-line-path">~</span>
            <span className="hero-line-dollar">$</span>
            <span>_</span>
          </div>

          <h1 className="hero-name">
            <span>P</span><span>a</span><span>n</span><span>k</span><span>a</span><span>j</span>
          </h1>

          <p className="hero-title">
            <span className="hero-title-code">Backend Developer</span>
            <span className="hero-title-slash">/</span>
            <span className="hero-title-code">AI Integration</span>
            <span className="hero-title-slash">/</span>
            <span className="hero-title-loc">India</span>
          </p>

          <p className="hero-tagline">
            I build <strong>server-side systems</strong> and integrate <strong>AI APIs</strong> into real products.
            Databases, REST APIs, LLMs — shipped.
          </p>

          <div className="hero-actions">
            <LiveDot isLive={activity.isLive} />
            <button
              className="hero-btn"
              onClick={() => document.querySelector('.mid-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
              Explore work
            </button>
          </div>
        </header>

        <div className="mid-grid" id="work">
          <div className="mid-col">
            <Panel {...panelConfig.about} delay={0.06}>
              <p className="about-text">
                I build server-side systems and integrate AI APIs into real products.
                Comfortable with <code>databases</code>, <code>REST APIs</code>, and plugging
                LLMs into backend workflows. Frontend when needed — enough to ship.
              </p>
            </Panel>

            <Panel {...panelConfig.activity} delay={0.10}>
              <div className="activity-row">
                <div className="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div className="activity-body">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-desc">{activity.description}</p>
                  <span className={`activity-badge ${activity.isLive ? 'activity-badge--live' : 'activity-badge--away'}`}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {activity.statusText}
                  </span>
                </div>
              </div>
            </Panel>
          </div>

          <div className="mid-col">
            <Panel {...panelConfig.stack} delay={0.06}>
              <div className="stack-list">
                <div className="stack-group">
                  <span className="stack-label">Backend</span>
                  <div className="pills">
                    <span className="pill pill--backend">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1z"/><path d="M8 9V5a4 4 0 0 1 4-4 4 4 0 0 1 4 4v4"/></svg>
                      Node.js
                    </span>
                    <span className="pill pill--backend">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                      Express
                    </span>
                  </div>
                </div>
                <div className="stack-group">
                  <span className="stack-label">AI / APIs</span>
                  <div className="pills">
                    <span className="pill pill--ai">OpenAI</span>
                    <span className="pill pill--ai">Anthropic</span>
                  </div>
                </div>
                <div className="stack-group">
                  <span className="stack-label">Databases</span>
                  <div className="pills">
                    <span className="pill pill--db">MongoDB</span>
                    <span className="pill pill--db">Redis</span>
                    <span className="pill pill--db">PostgreSQL</span>
                    <span className="pill pill--db">MySQL</span>
                    <span className="pill pill--db">Firebase</span>
                    <span className="pill pill--db">Supabase</span>
                  </div>
                </div>
                <div className="stack-group">
                  <span className="stack-label">Frontend</span>
                  <div className="pills">
                    <span className="pill pill--frontend">HTML/CSS</span>
                    <span className="pill pill--frontend">JavaScript</span>
                    <span className="pill pill--frontend">React</span>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel {...panelConfig.tools} delay={0.10}>
              <div className="pills">
                <span className="pill pill--tool">Git</span>
                <span className="pill pill--tool">REST APIs</span>
                <span className="pill pill--tool">Postman</span>
                <span className="pill pill--tool">VS Code</span>
                <span className="pill pill--tool">Cursor</span>
                <span className="pill pill--tool">OpenCode</span>
                <span className="pill pill--tool">Claude</span>
              </div>
            </Panel>
          </div>
        </div>

        <section className="panel panel-projects">
          <div className="project-slider-header">
            <div className="panel-header" style={{ marginBottom: 0 }}>
              <span className="panel-indicator panel-indicator--orange" />
              <span className="panel-label panel-label--orange">projects</span>
            </div>
            <div className="slider-arrows">
              <button className="arrow-btn" onClick={() => goTo(current - 1)} aria-label="previous">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="arrow-btn" onClick={() => goTo(current + 1)} aria-label="next">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div className="slider-viewport">
            <div className="slider-track" ref={trackRef}>
              {projects.map((p, i) => (
                <div key={p.name} className="project-card" ref={(el) => (cardRefs.current[i] = el)}>
                  <div className="project-top">
                    <span className="project-name">{p.name}</span>
                    <a href="#" className="project-link">
                      view
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="project-tag">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="slider-dots">
            {Array.from({ length: steps + 1 }, (_, i) => (
              <button
                key={i}
                className={`slider-dot ${i === current ? 'slider-dot--active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </section>

        <footer className="footer">
          <div className="footer-links">
            <a href="#" className="footer-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
            <a href="mailto:you@email.com" className="footer-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email
            </a>
            <a href="#" className="footer-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              Twitter
            </a>
            <a href="#" className="footer-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              GitHub
            </a>
          </div>
          <span className="footer-brand">pankaj.dev</span>
        </footer>
      </div>
    </>
  );
}
