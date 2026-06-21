const timeline = [
  { year: '2024 — Present', role: 'Backend Developer', desc: 'Building server-side systems and integrating AI APIs into real products. Working on authentication, real-time features, and API design.' },
  { year: '2023 — 2024', role: 'Full Stack Developer', desc: 'Developed full-stack web applications with React and Node.js. Built REST APIs, authentication systems, and database schemas.' },
  { year: '2022 — 2023', role: 'Backend Intern', desc: 'Started career building backend services. Learned Express, MongoDB, REST principles, and deployment workflows.' },
];

export default function About() {
  return (
    <section className="page-section">
      <div className="page-section-inner">
        <h2 className="page-title">About</h2>
        <p className="page-sub">A bit about me.</p>

        <div className="about-bio">
          <p>I'm a backend developer focused on building reliable server-side systems. I work with Node.js, Express, Python, and databases like MongoDB to create APIs and services that power real applications.</p>
          <p>I'm particularly interested in AI API integrations — connecting large language models with production systems through rate-limited, cached, and fault-tolerant middleware.</p>
        </div>

        <div className="timeline">
          <h3 className="timeline-title">Experience</h3>
          <div className="timeline-list">
            {timeline.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <span className="timeline-year">{item.year}</span>
                  <strong className="timeline-role">{item.role}</strong>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-interests">
          <h3>Interests</h3>
          <div className="interests-list">
            {['API Design', 'AI/ML Integration', 'Backend Architecture', 'Open Source', 'System Design', 'DevOps'].map((interest, i) => (
              <span className="interest-item" key={i}>{interest}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
