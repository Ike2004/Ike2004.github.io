import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import photoUrl from '../Photo.jpg'
import resumeUrl from '../IkePeng_Resume.pdf?url'
import moliereTrackUrl from '../Musical/Watched/Molière, le spectacle musical.mp3?url'
import roxxemPrimaryUrl from '../Internship/Roxxem/1.jpg'
import roxxemProductUrl from '../Internship/Roxxem/2.png'
import roxxemInterviewUrl from '../Internship/Roxxem/Interview.jpg'
import './App.css'

const pixelColors = ['#0b3c68', '#155187', '#1d6aa5', '#2f80bd', '#59a5d8', '#8bc4e8', '#c4e3f5']

function PixelTransition({ phase, theme }) {
  if (!phase) return null

  if (theme === 'poster-left' || theme === 'poster-right') {
    return (
      <div className={`pixel-transition horizontal-cover ${phase} ${theme}`} aria-hidden="true">
        <div className="horizontal-cover-sheet" />
      </div>
    )
  }

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

const symposiumImages = Object.values(
  import.meta.glob('../Publication/*.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)

const kangTaoImageModules = import.meta.glob(
  '../Internship/Kang-Tao/{工作流1,工作流2,1,2,3,4,5,6,7,8}.png', {
  eager: true,
  query: '?url',
  import: 'default',
  },
)

const kangTaoWorkflowImages = ['工作流1.png', '工作流2.png'].map(
  (filename) => kangTaoImageModules[`../Internship/Kang-Tao/${filename}`],
)

const kangTaoGeneratedImages = Object.entries(kangTaoImageModules)
  .filter(([path]) => /\/([1-8])\.png$/.test(path))
  .sort(([pathA], [pathB]) => {
    const displayOrder = [3, 1, 4, 2, 5, 7, 6, 8]
    const numberA = Number(pathA.match(/\/([1-8])\.png$/)?.[1])
    const numberB = Number(pathB.match(/\/([1-8])\.png$/)?.[1])
    return displayOrder.indexOf(numberA) - displayOrder.indexOf(numberB)
  })
  .map(([, imageUrl]) => imageUrl)

const musicalWishlist = Array.from(
  Object.entries(musicalImageModules).reduce((musicals, [path, imageUrl]) => {
    const title = path.split('/').pop().replace(/\.[^.]+$/, '')
    const watched = path.includes('/Watched/')
    const existing = musicals.get(title)

    if (!existing || watched) musicals.set(title, { title, imageUrl, watched })
    return musicals
  }, new Map()).values(),
).sort((a, b) => a.title.localeCompare(b.title, 'en'))

function RecordPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setIsPlaying(false)
      }
    } else {
      audio.pause()
    }
  }

  return (
    <div className="record-player-wrap">
      <button
        className={`record-player${isPlaying ? ' playing' : ''}`}
        type="button"
        aria-label={isPlaying ? 'Pause Molière soundtrack' : 'Play Molière soundtrack'}
        aria-pressed={isPlaying}
        onClick={togglePlayback}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span className="record" aria-hidden="true">
          <span className="record-label">M</span>
        </span>
        <span className="tonearm-base" aria-hidden="true" />
        <span className="tonearm" aria-hidden="true">
          <span className="cartridge" />
        </span>
        <span className="player-control" aria-hidden="true">
          {isPlaying ? 'Ⅱ' : '▶'}
        </span>
      </button>
      <p>{isPlaying ? 'Now playing · Molière' : 'Tap to play · Molière'}</p>
      <audio
        ref={audioRef}
        src={moliereTrackUrl}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}

function OthersPage({ onPointerDown }) {
  return (
    <main className="others-main" onPointerDown={onPointerDown}>
      <section className="others-intro">
        <div className="others-copy">
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
        </div>
        <RecordPlayer />
      </section>
      <section
        className="musical-wishlist"
        aria-label="Musical theatre wishlist"
        onDragStart={(event) => event.preventDefault()}
      >
        {musicalWishlist.map((musical) => (
          <article
            className={`musical-card${musical.watched ? ' watched' : ' not-watched'}`}
            key={musical.title}
          >
            <div className="musical-image-frame">
              <img src={musical.imageUrl} alt="" draggable="false" />
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

function SymposiumPosterPage({ onBack }) {
  return (
    <main className="poster-page-main">
      <section className="poster-page-header">
        <a
          className="poster-back-button"
          href="/#publication"
          aria-label="Back to publications"
          title="Back to publications"
          onClick={onBack}
        >
          ←
        </a>
        <p className="meta">UChicago Undergraduate Research Symposium · April 2025</p>
        <h1>Exploring the Quantum Labyrinth</h1>
        <p className="poster-page-subtitle">Teaching Physics Through Games</p>
        <p>Ike Peng*, Justin Zhang*, and Lydia Liu*</p>
        <p className="author-note">*Equal contribution</p>
      </section>
      <section className="poster-page-content">
        <div
          className="poster-gallery"
          onDragStart={(event) => event.preventDefault()}
        >
          {symposiumImages.map((imageUrl, index) => (
            <img
              src={imageUrl}
              alt={`Entangled Hearts presentation ${index + 1}`}
              draggable="false"
              key={imageUrl}
            />
          ))}
        </div>
        <p>
          At the University of Chicago&apos;s STAGE Lab, I worked as a Research
          Assistant with mentors Sunanda Prabhu-Gaunkar and Nancy Kawalek on{' '}
          <em>Entangled Hearts</em> from December 2023 to May 2024. I developed a 2D
          puzzle role-playing game in GameMaker, translating quantum concepts such as
          superposition, uncertainty, and entanglement into level mechanics. I
          designed puzzles, gameplay systems, narrative elements, and original visual
          assets to balance scientific accuracy with an engaging player experience. I
          later presented the project as a poster at the 2025 University of Chicago
          Undergraduate Research Symposium, showing how interactive games can make
          quantum physics more approachable.
        </p>
      </section>
      <footer>
        <span>© {new Date().getFullYear()} Ike Peng</span>
        <a href="mailto:bpeng14@jh.edu">bpeng14@jh.edu</a>
      </footer>
    </main>
  )
}

function KangTaoPortfolioPage({ onBack }) {
  return (
    <main className="poster-page-main kang-tao-page">
      <section className="poster-page-header">
        <a
          className="poster-back-button"
          href="/#internship"
          aria-label="Back to internships"
          title="Back to internships"
          onClick={onBack}
        >
          ←
        </a>
        <p className="meta">Kang Tao Technologies · July 2024 — January 2025</p>
        <h1>Kang Tao Technologies</h1>
        <p className="poster-page-subtitle">AI Film Production Portfolio</p>
        <p className="portfolio-intro">
          I trained 30+ Stable Diffusion LoRA models and built 20+ ComfyUI
          workflows for image and video generation on the AI short film{' '}
          <em>September Eagles</em>.
        </p>
      </section>
      <section className="kang-tao-content" onDragStart={(event) => event.preventDefault()}>
        <div className="portfolio-section-heading">
          <p className="meta">Process</p>
          <h2>Production Workflows</h2>
        </div>
        <div className="workflow-gallery">
          {kangTaoWorkflowImages.map((imageUrl, index) => (
            <figure key={imageUrl}>
              <img
                src={imageUrl}
                alt={`ComfyUI production workflow ${index + 1}`}
                draggable="false"
              />
            </figure>
          ))}
        </div>
        <div className="portfolio-section-heading generated-heading">
          <p className="meta">Selected Work</p>
          <h2>AI-Generated Frames</h2>
        </div>
        <div className="generated-gallery">
          {kangTaoGeneratedImages.map((imageUrl, index) => (
            <img
              src={imageUrl}
              alt={`Selected AI-generated frame ${index + 1}`}
              draggable="false"
              loading="lazy"
              key={imageUrl}
            />
          ))}
        </div>
      </section>
      <footer>
        <span>© {new Date().getFullYear()} Ike Peng</span>
        <a href="mailto:bpeng14@jh.edu">bpeng14@jh.edu</a>
      </footer>
    </main>
  )
}

function RoxxemPortfolioPage({ onBack }) {
  return (
    <main className="poster-page-main roxxem-page">
      <section className="poster-page-header">
        <a
          className="poster-back-button"
          href="/#internship"
          aria-label="Back to internships"
          title="Back to internships"
          onClick={onBack}
        >
          ←
        </a>
        <p className="meta">Roxxem · Chicago, IL · June — August 2025</p>
        <h1>Roxxem</h1>
        <p className="poster-page-subtitle">AI Engineering Portfolio</p>
        <p className="portfolio-intro">
          I rebuilt Roxxem&apos;s song-difficulty prediction pipeline across
          MongoDB, BigQuery, FastAPI, and Google Cloud, and trained a Random
          Forest model on 10,000+ crowdsourced data points.
        </p>
      </section>
      <section
        className="roxxem-content"
        onDragStart={(event) => event.preventDefault()}
      >
        <div className="portfolio-section-heading">
          <p className="meta">Product &amp; Team</p>
          <h2>Building Personalized Learning</h2>
        </div>
        <div className="roxxem-showcase">
          <img
            className="roxxem-showcase-primary"
            src={roxxemProductUrl}
            alt="Roxxem song learning interface"
            draggable="false"
          />
          <img
            className="roxxem-showcase-team"
            src={roxxemPrimaryUrl}
            alt="The Roxxem team"
            draggable="false"
          />
        </div>

        <div className="roxxem-guidance-note">
          <p>
            I was fortunate to work alongside Jingjing and Hugo, whose guidance
            shaped both my technical work and how I approached product problems.
            My data pipeline and difficulty-modeling work supported parts of the
            broader proficiency and personalized-learning system described in
            Jingjing&apos;s article.{' '}
            <a
              href="https://blog.roxxem.com/posts/how-roxxem-measures-student-proficiencyand-uses-it-to-power-personalized-learning"
              target="_blank"
              rel="noreferrer"
            >
              Read Roxxem&apos;s Tech Blog ↗
            </a>
          </p>
        </div>

        <div className="roxxem-interview-section">
          <div className="portfolio-section-heading">
            <p className="meta">User Research</p>
            <h2>Customer Obsession</h2>
          </div>
          <img
            src={roxxemInterviewUrl}
            alt="Talking with a language teacher at a teachers association event"
            draggable="false"
            loading="lazy"
          />
          <p className="roxxem-interview-copy">
            Our team participated in teachers association events, where we
            spoke directly with language teachers and interviewed them about
            how they used Roxxem. These conversations helped us understand what
            users needed and quickly turn their feedback into prototypes and
            product improvements.
          </p>
        </div>
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
  const pendingScrollTarget = useRef(null)
  const isOthersPage = currentPath.replace(/\/$/, '') === '/others'
  const isPosterPage = currentPath.replace(/\/$/, '') === '/publication/quantum-labyrinth'
  const isKangTaoPage = currentPath.replace(/\/$/, '') === '/internship/kang-tao'
  const isRoxxemPage = currentPath.replace(/\/$/, '') === '/internship/roxxem'
  const isDetailPage = isPosterPage || isKangTaoPage || isRoxxemPage
  const isSubPage = isOthersPage || isDetailPage

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useLayoutEffect(() => {
    const sectionId = pendingScrollTarget.current
    if (!sectionId || currentPath.replace(/\/$/, '') !== '') return

    const section = document.getElementById(sectionId)
    if (!section) return

    const previousScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'
    section.scrollIntoView()
    document.documentElement.style.scrollBehavior = previousScrollBehavior
    pendingScrollTarget.current = null
  }, [currentPath])

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

  const openPosterPage = (event) => {
    event.preventDefault()
    if (pageTransition) return

    setPageTransition({ phase: 'covering', theme: 'poster-left' })
    window.setTimeout(() => {
      window.history.pushState({}, '', '/publication/quantum-labyrinth/')
      setCurrentPath('/publication/quantum-labyrinth')
      window.scrollTo({ top: 0 })
      setPageTransition({ phase: 'revealing', theme: 'poster-left' })
    }, 340)
    window.setTimeout(() => setPageTransition(null), 690)
  }

  const returnToPublication = (event) => {
    event.preventDefault()
    if (pageTransition) return

    setPageTransition({ phase: 'covering', theme: 'poster-right' })
    window.setTimeout(() => {
      window.history.pushState({}, '', '/#publication')
      pendingScrollTarget.current = 'publication'
      setCurrentPath('/')
      setPageTransition({ phase: 'revealing', theme: 'poster-right' })
    }, 340)
    window.setTimeout(() => setPageTransition(null), 690)
  }

  const openKangTaoPage = (event) => {
    event.preventDefault()
    if (pageTransition) return

    setPageTransition({ phase: 'covering', theme: 'poster-left' })
    window.setTimeout(() => {
      window.history.pushState({}, '', '/internship/kang-tao/')
      setCurrentPath('/internship/kang-tao')
      window.scrollTo({ top: 0 })
      setPageTransition({ phase: 'revealing', theme: 'poster-left' })
    }, 340)
    window.setTimeout(() => setPageTransition(null), 690)
  }

  const returnToInternship = (event) => {
    event.preventDefault()
    if (pageTransition) return

    setPageTransition({ phase: 'covering', theme: 'poster-right' })
    window.setTimeout(() => {
      window.history.pushState({}, '', '/#internship')
      pendingScrollTarget.current = 'internship'
      setCurrentPath('/')
      setPageTransition({ phase: 'revealing', theme: 'poster-right' })
    }, 340)
    window.setTimeout(() => setPageTransition(null), 690)
  }

  const openRoxxemPage = (event) => {
    event.preventDefault()
    if (pageTransition) return

    setPageTransition({ phase: 'covering', theme: 'poster-left' })
    window.setTimeout(() => {
      window.history.pushState({}, '', '/internship/roxxem/')
      setCurrentPath('/internship/roxxem')
      window.scrollTo({ top: 0 })
      setPageTransition({ phase: 'revealing', theme: 'poster-left' })
    }, 340)
    window.setTimeout(() => setPageTransition(null), 690)
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
        <nav aria-label="Main navigation">
          {[
            ['About', 'about'],
            ['Education', 'education'],
            ['Internship', 'internship'],
            ['Publication', 'publication'],
            ['Research Experience', 'research'],
          ].map(([label, id]) => (
            <a
              href={isSubPage ? `/#${id}` : `#${id}`}
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

      {isOthersPage ? (
        <OthersPage onPointerDown={createPixelBurst} />
      ) : isPosterPage ? (
        <SymposiumPosterPage onBack={returnToPublication} />
      ) : isKangTaoPage ? (
        <KangTaoPortfolioPage onBack={returnToInternship} />
      ) : isRoxxemPage ? (
        <RoxxemPortfolioPage onBack={returnToInternship} />
      ) : <main>
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
          <div className="internship-cards">
            {internships.map((item) => (
              <article className="feature-card internship-card" key={item.company}>
                <div>
                  <p className="meta">{item.company} · {item.date}</p>
                  <h3>{item.role}</h3>
                  <p>{item.summary}</p>
                  {item.company === 'Kang Tao Technologies' && (
                    <div className="publication-links">
                      <a href="/internship/kang-tao/" onClick={openKangTaoPage}>
                        Portfolio ↗
                      </a>
                    </div>
                  )}
                  {item.company === 'Roxxem' && (
                    <div className="publication-links">
                      <a href="/internship/roxxem/" onClick={openRoxxemPage}>
                        Learn More ↗
                      </a>
                      <a
                        href="https://blog.roxxem.com/posts/how-roxxem-measures-student-proficiencyand-uses-it-to-power-personalized-learning"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Tech Blog ↗
                      </a>
                    </div>
                  )}
                </div>
                <span className="badge">Internship</span>
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
          <article className="feature-card">
            <div>
              <p className="meta">
                UChicago Undergraduate Research Symposium · April 2025
              </p>
              <h3>
                Exploring the Quantum Labyrinth: Teaching Physics Through Games
              </h3>
              <p>Ike Peng*, Justin Zhang*, and Lydia Liu*</p>
              <div className="publication-links">
                <a
                  href="/publication/quantum-labyrinth/"
                  onClick={openPosterPage}
                >
                  Poster ↗
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
              <p className="meta">Sebo Lab · University of Chicago</p>
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
