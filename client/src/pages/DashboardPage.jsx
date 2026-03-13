import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  ArrowRightIcon,
  BrandMark,
  ChartIcon,
  DashboardIcon,
  RoadmapIcon,
  SearchIcon,
  ShieldIcon,
} from '../components/AppIcons'
import { useAuth } from '../context/AuthContext'

const NEXT_PHASE_CARDS = [
  {
    title: 'Profile onboarding',
    copy: 'Phase 3 will collect current skills, target roles, and weekly study time from each authenticated student.',
    Icon: ShieldIcon,
  },
  {
    title: 'AI roadmap generation',
    copy: 'The server is now ready for protected roadmap generation endpoints once the student profile exists.',
    Icon: RoadmapIcon,
  },
  {
    title: 'Skill gap insights',
    copy: 'The dashboard shell is in place for gap analysis, project suggestions, and progress tracking cards.',
    Icon: SearchIcon,
  },
]

function DashboardPage() {
  const { user } = useAuth()

  return (
    <>
      <div className="bg-animated">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />

      <main className="dashboard-page">
        <section className="dashboard-hero glass">
          <div className="dashboard-hero-copy">
            <span className="section-badge dashboard-badge">Authenticated Workspace</span>
            <h1 className="dashboard-title">Welcome back, {user?.name || 'Student'}</h1>
            <p className="dashboard-copy">
              Your account is active, your session is protected with JWT, and the client is ready for the
              student profile flow in the next phase.
            </p>
            <div className="dashboard-actions">
              <Link className="btn btn-primary" to="/">
                <DashboardIcon className="button-icon" />
                View landing page
              </Link>
              <Link className="btn btn-glass" to="/signup">
                <ArrowRightIcon className="button-icon" />
                Revisit auth flow
              </Link>
            </div>
          </div>

          <div className="dashboard-identity glass">
            <div className="dashboard-identity-head">
              <span className="dashboard-identity-icon">
                <BrandMark className="app-icon" />
              </span>
              <div>
                <div className="dashboard-identity-label">Signed in account</div>
                <div className="dashboard-identity-name">{user?.name}</div>
              </div>
            </div>
            <div className="dashboard-identity-row">
              <span>Email</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="dashboard-identity-row">
              <span>Status</span>
              <strong>Authenticated</strong>
            </div>
            <div className="dashboard-identity-row">
              <span>Phase</span>
              <strong>2 complete</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          {NEXT_PHASE_CARDS.map(({ title, copy, Icon }) => (
            <article key={title} className="dashboard-card glass glass-hover">
              <span className="dashboard-card-icon">
                <Icon className="app-icon" />
              </span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}

          <article className="dashboard-card glass dashboard-card-accent">
            <span className="dashboard-card-icon">
              <ChartIcon className="app-icon" />
            </span>
            <h2>What is live right now</h2>
            <ul className="dashboard-list">
              <li>Secure register and login endpoints</li>
              <li>Stored JWT session on the client</li>
              <li>Protected dashboard routing</li>
              <li>Session restore through /api/auth/me</li>
            </ul>
          </article>
        </section>
      </main>
    </>
  )
}

export default DashboardPage
