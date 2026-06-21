const posts = [
  {
    title: 'Building a Live Activity Tracker with Express and React',
    excerpt: 'How I built a real-time heartbeat monitoring system that tracks coding activity and exposes a live status API with automatic stale detection.',
    date: 'Jun 15, 2026',
    readTime: '4 min read',
    tags: ['Node.js', 'Express', 'React'],
  },
  {
    title: 'Integrating LLM APIs into Production Systems',
    excerpt: 'A practical guide to rate limiting, caching, and fallback strategies when integrating large language model APIs into real applications.',
    date: 'May 28, 2026',
    readTime: '6 min read',
    tags: ['Python', 'FastAPI', 'OpenAI'],
  },
  {
    title: 'JWT Authentication Patterns for Modern Web Apps',
    excerpt: 'Exploring access tokens, refresh tokens, and secure session handling patterns for JWT-based authentication in Node.js applications.',
    date: 'May 10, 2026',
    readTime: '5 min read',
    tags: ['Node.js', 'JWT', 'Security'],
  },
  {
    title: 'Setting Up a Portfolio with Vite, React, and Express',
    excerpt: 'Step-by-step walkthrough of building and deploying this very portfolio — from project setup to production deployment.',
    date: 'Apr 22, 2026',
    readTime: '7 min read',
    tags: ['React', 'Vite', 'Express'],
  },
];

export default function Blog() {
  return (
    <section className="page-section">
      <div className="page-section-inner">
        <h2 className="page-title">Blog</h2>
        <p className="page-sub">Thoughts and write-ups.</p>

        <div className="blog-list">
          {posts.map((post, i) => (
            <article className="blog-card" key={i}>
              <div className="blog-meta">
                <span>{post.date}</span>
                <span className="blog-dot">·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-tags">
                {post.tags.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
