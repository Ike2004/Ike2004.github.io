import photoUrl from '../Photo.jpg'
import resumeUrl from '../IkePeng_Resume.pdf?url'
import './App.css'

const internships = [
  {
    company: 'Intelligence Cubed',
    role: 'Software Engineer Intern',
    date: 'May 2026 — Present',
    summary:
      'Building a collaborative AI coding workspace for 2,000+ users with FastAPI, WebSockets, tmux, Firebase, automated VM provisioning, and multi-agent review.',
  },
  {
    company: 'Roxxem',
    role: 'AI Engineer Intern',
    date: 'Jun 2025 — Aug 2025',
    summary:
      'Rebuilt a cloud-based song difficulty prediction pipeline using MongoDB, BigQuery, FastAPI, and Random Forest models.',
  },
  {
    company: 'Kang Tao Technologies',
    role: 'Machine Learning Engineer Intern',
    date: 'Jul 2024 — Jan 2025',
    summary:
      'Trained 30+ Stable Diffusion LoRA models and built 20+ ComfyUI workflows for an AI-generated short film.',
  },
]

function App() {
  return (
    <div className="page-shell">
      <aside className="sidebar">
        <a className="monogram" href="#about" aria-label="Ike Peng home">
          IP
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#education">Education</a>
          <a href="#internship">Internship</a>
          <a href="#publication">Publication</a>
          <a href="#research">Research Experience</a>
        </nav>
        <div className="sidebar-links">
          <a href="https://github.com/Ike2004" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href="https://linkedin.com/in/ike001" target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={resumeUrl} target="_blank" rel="noreferrer">
            Résumé ↗
          </a>
        </div>
      </aside>

      <main>
        <section className="intro" id="about">
          <div className="intro-copy">
            <p className="kicker">Hello, I&apos;m</p>
            <h1>Ike Peng</h1>
            <p className="chinese-name">彭博文</p>
            <p className="role">Computer Science · AI · Software Engineering</p>
            <p className="summary">
              I&apos;m a computer science student and software engineer focused on
              practical AI systems, machine learning, and developer tools.
            </p>
            <a className="about-email" href="mailto:bpeng14@jh.edu">
              bpeng14@jh.edu
            </a>
            <div className="actions">
              <a className="button primary" href="mailto:bpeng14@jh.edu">
                Contact me
              </a>
              <a className="button secondary" href={resumeUrl} target="_blank" rel="noreferrer">
                View résumé
              </a>
            </div>
          </div>
          <img className="portrait" src={photoUrl} alt="Ike Peng" />
        </section>

        <section className="content-section" id="education">
          <h2>Education</h2>
          <div className="education-grid">
            <article className="card">
              <div>
                <h3>Johns Hopkins University</h3>
                <p>Master of Science in Computer Science</p>
              </div>
              <time>Jul 2026 — Present</time>
            </article>
            <article className="card">
              <div>
                <h3>University of Chicago</h3>
                <p>B.S. in Computer Science and Statistics</p>
              </div>
              <time>Sep 2023 — Jun 2026</time>
            </article>
          </div>
        </section>

        <section className="content-section" id="internship">
          <h2>Internship</h2>
          <div className="timeline">
            {internships.map((item) => (
              <article className="timeline-item" key={item.company}>
                <div className="timeline-title">
                  <div>
                    <h3>{item.role}</h3>
                    <p className="company">{item.company}</p>
                  </div>
                  <time>{item.date}</time>
                </div>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section" id="publication">
          <h2>Publication</h2>
          <article className="feature-card">
            <div>
              <p className="meta">NeurIPS 2025 · San Diego, CA</p>
              <h3>
                Concept Incongruence: An Exploration of Time and Death in Role
                Playing
              </h3>
              <p>Xiaoyan Bai, Ike Peng, Aditya Singh, and Chenhao Tan</p>
            </div>
            <span className="badge">Poster</span>
          </article>
        </section>

        <section className="content-section" id="research">
          <h2>Research Experience</h2>
          <div className="research-grid">
            <article className="research-card">
              <p className="meta">Johns Hopkins University · Present</p>
              <h3>Research Assistant</h3>
              <p className="mentor">Mentor: Prof. Kristina Gligoric</p>
              <ul>
                <li>
                  Period-Constrained LLMs for Reducing Interpretative
                  Anachronism · Present
                </li>
              </ul>
            </article>
            <article className="research-card">
              <p className="meta">CHAI Lab · University of Chicago</p>
              <h3>Research Assistant</h3>
              <p className="mentor">Mentor: Prof. Chenhao Tan</p>
              <ul>
                <li>Heuristic-Guided Hypothesis Generation · Jul 2025 — Present</li>
                <li>Concept Incongruence in LLM Role-Play · Feb — May 2025</li>
              </ul>
            </article>
            <article className="research-card">
              <p className="meta">HRI Lab · University of Chicago</p>
              <h3>Research Assistant</h3>
              <p className="mentor">Mentor: Prof. Sarah Sebo</p>
              <ul>
                <li>Homework Companion Robot Study · Jan — Mar 2025</li>
                <li>Human-Robot Rapport · Feb — May 2024</li>
              </ul>
            </article>
            <article className="research-card">
              <p className="meta">STAGE Lab · University of Chicago</p>
              <h3>Research Assistant</h3>
              <p className="mentor">
                Mentors: Sunanda Prabhu-Gaunkar &amp; Nancy Kawalek
              </p>
              <ul>
                <li>Entangled Hearts · Dec 2023 — May 2024</li>
              </ul>
            </article>
          </div>
        </section>

        <footer>
          <span>© {new Date().getFullYear()} Ike Peng</span>
          <a href="mailto:bpeng14@jh.edu">bpeng14@jh.edu</a>
        </footer>
      </main>
    </div>
  )
}

export default App
