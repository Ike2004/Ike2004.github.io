import { useCallback, useEffect, useRef, useState } from 'react'
import photoUrl from '../Photo.jpg'
import resumeUrl from '../IkePeng_Resume.pdf?url'
import './App.css'

const pixelColors = ['#0b3c68', '#155187', '#1d6aa5', '#2f80bd', '#59a5d8', '#8bc4e8', '#c4e3f5']

function PixelTransition({ phase, theme }) {
  if (!phase) return null

  if (theme === 'dark') {
    return (
      <div className={`pixel-transition tear-transition ${phase}`} aria-hidden="true">
        <div className="tear-page tear-page-left" />
        <div className="tear-page tear-page-right" />
      </div>
    )
  }

  return (
    <div className={`pixel-transition cover-transition ${phase}`} aria-hidden="true">
      <div className="cover-sheet" />
    </div>
  )
}

function ClickPixel({ pixel, onComplete }) {
  const pixelRef = useRef(null)

  useEffect(() => {
    const element = pixelRef.current
    const frameCount = 60
    const keyframes = Array.from({ length: frameCount + 1 }, (_, index) => {
      const progress = index / frameCount
      const x = pixel.velocityX * progress
      const y = pixel.velocityY * progress + pixel.gravity * progress * progress

      return {
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${pixel.rotation * progress}deg)`,
        opacity: progress < 0.72 ? 1 : 1 - (progress - 0.72) / 0.28,
      }
    })
    const animation = element.animate(keyframes, {
      duration: pixel.duration,
      easing: 'linear',
      fill: 'forwards',
    })

    animation.onfinish = () => onComplete(pixel.id)
    return () => animation.cancel()
  }, [onComplete, pixel])

  return (
    <span
      className="click-pixel"
      ref={pixelRef}
      style={{
        left: pixel.x,
        top: pixel.y,
        width: pixel.size,
        height: pixel.size,
        backgroundColor: pixel.color,
      }}
    />
  )
}

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

const musicalImageModules = import.meta.glob(
  '../Musical/**/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)

const musicalWishlist = Array.from(
  Object.entries(musicalImageModules).reduce((musicals, [path, imageUrl]) => {
    const title = path.split('/').pop().replace(/\.[^.]+$/, '')
    const watched = path.includes('/Watched/')
    const existing = musicals.get(title)

    if (!existing || watched) musicals.set(title, { title, imageUrl, watched })
    return musicals
  }, new Map()).values(),
).sort((a, b) => a.title.localeCompare(b.title, 'en'))

function OthersPage({ onPointerDown }) {
  return (
    <main className="others-main" onPointerDown={onPointerDown}>
      <section className="others-intro">
        <p className="others-kicker">Beyond code</p>
        <h1>Musical Theatre</h1>
        <p>My musical theatre wishlist.</p>
        <div className="wishlist-legend" aria-label="Wishlist legend">
          <div>
            <span className="legend-swatch seen" aria-hidden="true">
              <i />
              <i />
            </span>
            <span>Seen live</span>
          </div>
          <div>
            <span className="legend-swatch wishlist" aria-hidden="true">
              <i />
              <i />
            </span>
            <span>Still on wishlist</span>
          </div>
        </div>
      </section>
      <section className="musical-wishlist" aria-label="Musical theatre wishlist">
        {musicalWishlist.map((musical) => (
          <article
            className={`musical-card${musical.watched ? ' watched' : ' not-watched'}`}
            key={musical.title}
          >
            <div className="musical-image-frame">
              <img src={musical.imageUrl} alt="" />
            </div>
            <h2>{musical.title}</h2>
          </article>
        ))}
      </section>
      <footer>
        <span>© {new Date().getFullYear()} Ike Peng</span>
        <a href="mailto:bpeng14@jh.edu">bpeng14@jh.edu</a>
      </footer>
    </main>
  )
}

function App() {
  const [pixels, setPixels] = useState([])
  const [pageTransition, setPageTransition] = useState(null)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const nextPixelId = useRef(0)
  const isOthersPage = currentPath.replace(/\/$/, '') === '/others'

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const transitionTo = (event, destination, theme) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (pageTransition) return

    if (theme === 'dark') {
      window.history.pushState({}, '', destination)
      setCurrentPath('/others')
      setPageTransition({ phase: 'entering', theme })
      window.requestAnimationFrame(() => window.scrollTo({ top: 0 }))
      window.setTimeout(() => setPageTransition(null), 720)
      return
    }

    window.history.pushState({}, '', destination)
    setCurrentPath('/')
    setPageTransition({ phase: 'leaving', theme })
    const sectionId = destination.split('#')[1]
    window.requestAnimationFrame(() => {
      if (sectionId === 'about') {
        window.scrollTo({ top: 0 })
      } else if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView()
      }
    })
    window.setTimeout(() => setPageTransition(null), 620)
  }

  const scrollToTop = (event) => {
    event.preventDefault()
    window.history.replaceState({}, '', `${window.location.pathname}#about`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const createPixelBurst = (event) => {
    if (event.button !== undefined && event.button !== 0) return

    const burst = Array.from({ length: 18 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 18 + (Math.random() - 0.5) * 0.25
      const speed = 95 + Math.random() * 45
      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed
      const gravity = 350 + Math.random() * 80

      return {
        id: nextPixelId.current++,
        x: event.clientX,
        y: event.clientY,
        color: pixelColors[Math.floor(Math.random() * pixelColors.length)],
        size: 5 + Math.floor(Math.random() * 6),
        velocityX,
        velocityY,
        gravity,
        rotation: Math.round((Math.random() - 0.5) * 360),
        duration: 850 + Math.round(Math.random() * 250),
      }
    })

    setPixels((current) => [...current, ...burst])
  }

  const removePixel = useCallback((id) => {
    setPixels((current) => current.filter((pixel) => pixel.id !== id))
  }, [])

  return (
    <div className={`page-shell${isOthersPage ? ' others-page' : ''}`}>
      <PixelTransition
        phase={pageTransition?.phase}
        theme={pageTransition?.theme}
      />
      <div className="pixel-layer" aria-hidden="true">
        {pixels.map((pixel) => (
          <ClickPixel
            key={pixel.id}
            pixel={pixel}
            onComplete={removePixel}
          />
        ))}
      </div>
      <aside className="sidebar">
        <a
          className="monogram"
          href={isOthersPage ? '/#about' : '#about'}
          aria-label="Ike Peng home"
          onClick={isOthersPage ? (event) => transitionTo(event, '/#about', 'light') : scrollToTop}
        >
          IP
        </a>
        <nav aria-label="Main navigation">
          {[
            ['About', 'about'],
            ['Education', 'education'],
            ['Internship', 'internship'],
            ['Publication', 'publication'],
            ['Research Experience', 'research'],
          ].map(([label, id]) => (
            <a
              href={isOthersPage ? `/#${id}` : `#${id}`}
              key={id}
              onClick={
                isOthersPage
                  ? (event) => transitionTo(event, `/#${id}`, 'light')
                  : id === 'about'
                    ? scrollToTop
                    : undefined
              }
            >
              {label}
            </a>
          ))}
          <a
            href="/others"
            aria-current={isOthersPage ? 'page' : undefined}
            onClick={!isOthersPage ? (event) => transitionTo(event, '/others', 'dark') : undefined}
          >
            Others
          </a>
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

      {isOthersPage ? <OthersPage onPointerDown={createPixelBurst} /> : <main>
        <section className="intro" id="about">
          <div className="intro-copy">
            <p className="kicker">Hello, I&apos;m</p>
            <h1>Ike Peng</h1>
            <p className="chinese-name">彭博文</p>
            <p className="role">Computer Science · AI · Software Engineering</p>
            <p className="summary">
              Hi, I&apos;m a CS master&apos;s student at Johns Hopkins University. Through{' '}
              <a href="#internship">software and AI engineering internships</a>, I&apos;ve
              built AI developer tools and ML systems serving 300,000+ active users.
              I&apos;ve also researched human-centered AI and co-authored a{' '}
              <a href="#publication">NeurIPS 2025 publication</a>.
            </p>
            <p className="personal-note">
              Outside of work, I&apos;m a huge fan of{' '}
              <a
                href="/others"
                onClick={(event) => transitionTo(event, '/others', 'dark')}
              >
                musical theatre
              </a>.
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
            <article className="card">
              <div>
                <h3>Washington University in St. Louis</h3>
                <p>Coursework in Computer Science</p>
              </div>
              <time>2022 — 2023</time>
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
              <div className="publication-links">
                <a
                  href="https://proceedings.neurips.cc/paper_files/paper/2025/hash/e2bf9bac462f38001e6fc5e90c9c2546-Abstract-Conference.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  NeurIPS Proceedings ↗
                </a>
                <a
                  href="https://arxiv.org/abs/2505.14905"
                  target="_blank"
                  rel="noreferrer"
                >
                  arXiv ↗
                </a>
              </div>
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
      </main>}
    </div>
  )
}

export default App
