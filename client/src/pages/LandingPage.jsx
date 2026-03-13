import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  BlocksIcon,
  BotIcon,
  BrandMark,
  BrainIcon,
  ChartIcon,
  ClockIcon,
  CloudIcon,
  DatabaseIcon,
  FlaskIcon,
  FlowIcon,
  GearIcon,
  GlobeIcon,
  LockIcon,
  PaletteIcon,
  PhoneIcon,
  ProjectIcon,
  RoadmapIcon,
  SearchIcon,
  SparkIcon,
  TargetIcon,
  UserIcon,
  WrenchIcon,
} from '../components/AppIcons'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const FEATURES = [
  {
    Icon: RoadmapIcon,
    iconBg: 'rgba(124, 58, 237, 0.16)',
    iconColor: '#a78bfa',
    title: 'AI-powered roadmap',
    desc: 'Generate a clear week-by-week plan based on a student\'s current skills, target role, and available study time.',
    chip: 'Roadmap engine',
    chipColor: 'rgba(124, 58, 237, 0.14)',
    chipBorder: 'rgba(124, 58, 237, 0.32)',
    chipText: '#a78bfa',
  },
  {
    Icon: SearchIcon,
    iconBg: 'rgba(6, 182, 212, 0.16)',
    iconColor: '#67e8f9',
    title: 'Skill-gap analysis',
    desc: 'Highlight what the student already knows, which skills are missing, and where to focus first.',
    chip: 'Gap detection',
    chipColor: 'rgba(6, 182, 212, 0.14)',
    chipBorder: 'rgba(6, 182, 212, 0.32)',
    chipText: '#67e8f9',
  },
  {
    Icon: ProjectIcon,
    iconBg: 'rgba(245, 158, 11, 0.16)',
    iconColor: '#fcd34d',
    title: 'Project suggestions',
    desc: 'Recommend portfolio work that proves skill growth and aligns with the selected career direction.',
    chip: 'Portfolio builder',
    chipColor: 'rgba(245, 158, 11, 0.14)',
    chipBorder: 'rgba(245, 158, 11, 0.32)',
    chipText: '#fcd34d',
  },
  {
    Icon: ClockIcon,
    iconBg: 'rgba(16, 185, 129, 0.16)',
    iconColor: '#6ee7b7',
    title: 'Time-aware planning',
    desc: 'Adapt learning plans to real schedules so students can move forward even with limited weekly study hours.',
    chip: 'Flexible schedule',
    chipColor: 'rgba(16, 185, 129, 0.14)',
    chipBorder: 'rgba(16, 185, 129, 0.32)',
    chipText: '#6ee7b7',
  },
  {
    Icon: ChartIcon,
    iconBg: 'rgba(236, 72, 153, 0.16)',
    iconColor: '#f9a8d4',
    title: 'Progress tracking',
    desc: 'Show milestones and completion status so students can stay consistent and understand what comes next.',
    chip: 'Progress ready',
    chipColor: 'rgba(236, 72, 153, 0.14)',
    chipBorder: 'rgba(236, 72, 153, 0.32)',
    chipText: '#f9a8d4',
  },
  {
    Icon: BotIcon,
    iconBg: 'rgba(99, 102, 241, 0.16)',
    iconColor: '#a5b4fc',
    title: 'AI mentor layer',
    desc: 'The architecture is prepared for guided coaching and contextual AI responses on top of each roadmap step.',
    chip: 'Next phase ready',
    chipColor: 'rgba(99, 102, 241, 0.14)',
    chipBorder: 'rgba(99, 102, 241, 0.32)',
    chipText: '#a5b4fc',
  },
]

const STEPS = [
  {
    id: '01',
    Icon: UserIcon,
    title: 'Create your account',
    desc: 'Students can now register and sign in through the new Phase 2 authentication flow.',
  },
  {
    id: '02',
    Icon: TargetIcon,
    title: 'Define the direction',
    desc: 'The next phase will connect skills, career goals, and study time to each signed-in account.',
  },
  {
    id: '03',
    Icon: BotIcon,
    title: 'Generate AI guidance',
    desc: 'The secured backend is ready for profile-driven roadmap generation and future recommendations.',
  },
  {
    id: '04',
    Icon: RoadmapIcon,
    title: 'Track the journey',
    desc: 'The protected dashboard shell is already in place for progress, gaps, and project suggestions.',
  },
]

const STATS = [
  { value: '10K+', label: 'Students guided' },
  { value: '50+', label: 'Career paths' },
  { value: '500+', label: 'Roadmaps created' },
  { value: '98%', label: 'Satisfaction' },
]

const CAREERS = [
  { Icon: GearIcon, label: 'Backend Developer' },
  { Icon: GlobeIcon, label: 'Full Stack Developer' },
  { Icon: BrainIcon, label: 'AI / ML Engineer' },
  { Icon: PaletteIcon, label: 'Frontend Developer' },
  { Icon: WrenchIcon, label: 'DevOps Engineer' },
  { Icon: ChartIcon, label: 'Data Scientist' },
  { Icon: CloudIcon, label: 'Cloud Architect' },
  { Icon: LockIcon, label: 'Cybersecurity Engineer' },
  { Icon: PhoneIcon, label: 'Mobile Developer' },
  { Icon: BlocksIcon, label: 'Blockchain Developer' },
  { Icon: FlaskIcon, label: 'QA / Test Engineer' },
  { Icon: DatabaseIcon, label: 'Database Engineer' },
]

function LandingPage() {
  const { theme } = useTheme()
  const { isAuthenticated } = useAuth()
  const [serverStatus, setServerStatus] = useState('checking')

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        setServerStatus(response.ok ? 'online' : 'offline')
      })
      .catch(() => {
        setServerStatus('offline')
      })
  }, [])

  const statusLabel = {
    checking: 'Connecting to server...',
    online: 'Server connected and running',
    offline: 'Server offline. Start Spring Boot on port 8080.',
  }[serverStatus]

  const featureBadgeStyle = theme === 'dark'
    ? { background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.35)', color: '#67e8f9' }
    : { background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.3)', color: '#0284c7' }

  const stepBadgeStyle = theme === 'dark'
    ? { background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#fcd34d' }
    : { background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', color: '#d97706' }

  const careerBadgeStyle = theme === 'dark'
    ? { background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#6ee7b7' }
    : { background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.3)', color: '#059669' }

  const primaryHref = isAuthenticated ? '/dashboard' : '/signup'
  const primaryLabel = isAuthenticated ? 'Open dashboard' : 'Start your journey'

  return (
    <>
      <div className="bg-animated">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />

      <section className="hero" style={{ position: 'relative' }}>
        <span className="section-badge hero-badge">
          <SparkIcon className="badge-icon" />
          AI career co-pilot
        </span>

        <h1 className="hero-title">
          Your career journey,{' '}
          <span className="gradient-text">guided by AI</span>
        </h1>

        <p className="hero-subtitle">
          ChaloBhai maps student skills, goals, and available study time into a clear learning path so every next step is easier to see.
        </p>

        <div className="hero-cta">
          <Link to={primaryHref} className="btn btn-primary">
            <ArrowRightIcon className="button-icon" />
            {primaryLabel}
          </Link>
          <a href="#features" className="btn btn-glass">
            Explore features
          </a>
        </div>

        <div className="hero-server-status glass">
          <span className={`status-dot ${serverStatus}`} />
          <span>{statusLabel}</span>
        </div>

        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>

      <div className="stats-bar glass">
        {STATS.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="section" id="features">
        <div className="section-header">
          <span className="section-badge" style={featureBadgeStyle}>
            <SparkIcon className="badge-icon" />
            Core features
          </span>
          <h2 className="section-title">
            Everything students need to <span className="gradient-text">level up</span>
          </h2>
          <p className="section-desc">
            The platform combines secure onboarding, roadmap planning, skill-gap clarity, and portfolio guidance in one product flow.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map(({ Icon, iconBg, iconColor, title, desc, chip, chipColor, chipBorder, chipText }) => (
            <div key={title} className="feature-card glass glass-hover">
              <div className="feature-icon-wrap" style={{ background: iconBg, color: iconColor }}>
                <Icon className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
              <span className="feature-chip" style={{ background: chipColor, borderColor: chipBorder, color: chipText }}>
                {chip}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="section-header">
          <span className="section-badge" style={stepBadgeStyle}>
            <FlowIcon className="badge-icon" />
            The process
          </span>
          <h2 className="section-title">
            From sign-in to roadmap in <span className="gradient-text">four steps</span>
          </h2>
          <p className="section-desc">
            The application is being built incrementally so every new feature sits on a working client and a working server.
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map(({ id, Icon, title, desc }) => (
            <div key={id} className="step-card glass glass-hover">
              <div className="step-number">
                <Icon className="step-icon-svg" />
              </div>
              <div className="step-eyebrow">Step {id}</div>
              <h3 className="step-title">{title}</h3>
              <p className="step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="careers-section" id="careers">
        <div className="section-header">
          <span className="section-badge" style={careerBadgeStyle}>
            <TargetIcon className="badge-icon" />
            Career paths
          </span>
          <h2 className="section-title">
            Roadmaps for every <span className="gradient-text">tech direction</span>
          </h2>
          <p className="section-desc">
            Backend, full stack, AI, data, cloud, and more can all plug into the same secure learning flow.
          </p>
        </div>

        <div className="careers-grid">
          {CAREERS.map(({ Icon, label }) => (
            <div key={label} className="career-chip glass">
              <span className="career-chip-icon">
                <Icon className="career-icon-svg" />
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-section" id="about">
        <div className="cta-card glass">
          <div className="cta-glow" />
          <h2 className="cta-title">
            Ready to build your <span className="gradient-text">learning path</span>?
          </h2>
          <p className="cta-desc">
            Phase 2 is live with secure student accounts and protected routes. The next phase will attach skills and goals to every signed-in user.
          </p>
          <div className="cta-actions">
            <Link to={primaryHref} className="btn btn-primary">
              <ArrowRightIcon className="button-icon" />
              {primaryLabel}
            </Link>
            {!isAuthenticated ? (
              <Link to="/login" className="btn btn-glass">
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <footer className="footer-wrapper">
        <div className="footer">
          <span className="footer-brand footer-brand-mark">
            <BrandMark className="app-icon" />
            ChaloBhai
          </span>
          <p className="footer-copy">Copyright 2026 ChaloBhai. AI Career Co-Pilot for Students.</p>
          <nav className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#careers">Careers</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </footer>
    </>
  )
}

export default LandingPage
