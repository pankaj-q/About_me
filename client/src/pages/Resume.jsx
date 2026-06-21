const experience = [
  { period: '2024 — Present', title: 'Backend Developer', subtitle: 'Freelance / Contract', desc: 'Building server-side systems, REST APIs, and AI integrations. Working with Node.js, Express, Python, FastAPI, MongoDB, and Redis.' },
  { period: '2023 — 2024', title: 'Full Stack Developer', subtitle: 'Previous Role', desc: 'Developed full-stack web applications. Built authentication systems, database schemas, and deployed applications to production.' },
  { period: '2022 — 2023', title: 'Backend Intern', subtitle: 'Internship', desc: 'Started career learning backend development. Built REST APIs, worked with MongoDB, and learned deployment workflows.' },
];

const education = [
  { period: '2020 — 2024', title: 'B.Tech in Computer Science', subtitle: 'University', desc: 'Focused on software engineering, data structures, algorithms, and web technologies.' },
];

export default function Resume() {
  return (
    <section className="page-section">
      <div className="page-section-inner">
        <h2 className="page-title">Resume</h2>
        <p className="page-sub">Experience and education.</p>

        <div className="resume-section">
          <h3 className="resume-heading">Experience</h3>
          {experience.map((item, i) => (
            <div className="resume-item" key={i}>
              <div className="resume-left">
                <span className="resume-period">{item.period}</span>
              </div>
              <div className="resume-right">
                <strong className="resume-title">{item.title}</strong>
                <span className="resume-subtitle">{item.subtitle}</span>
                <p className="resume-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="resume-section">
          <h3 className="resume-heading">Education</h3>
          {education.map((item, i) => (
            <div className="resume-item" key={i}>
              <div className="resume-left">
                <span className="resume-period">{item.period}</span>
              </div>
              <div className="resume-right">
                <strong className="resume-title">{item.title}</strong>
                <span className="resume-subtitle">{item.subtitle}</span>
                <p className="resume-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="resume-section">
          <h3 className="resume-heading">Skills</h3>
          <div className="resume-skills">
            <div className="resume-skill-group">
              <span className="resume-skill-cat">Languages</span>
              <div className="skill-items">
                {['JavaScript', 'Python', 'TypeScript', 'SQL'].map((s, i) => <span className="skill-item" key={i}>{s}</span>)}
              </div>
            </div>
            <div className="resume-skill-group">
              <span className="resume-skill-cat">Backend</span>
              <div className="skill-items">
                {['Node.js', 'Express', 'FastAPI', 'REST API'].map((s, i) => <span className="skill-item" key={i}>{s}</span>)}
              </div>
            </div>
            <div className="resume-skill-group">
              <span className="resume-skill-cat">Frontend</span>
              <div className="skill-items">
                {['React', 'Vite', 'HTML/CSS'].map((s, i) => <span className="skill-item" key={i}>{s}</span>)}
              </div>
            </div>
            <div className="resume-skill-group">
              <span className="resume-skill-cat">Tools</span>
              <div className="skill-items">
                {['Git', 'MongoDB', 'Redis', 'JWT'].map((s, i) => <span className="skill-item" key={i}>{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
