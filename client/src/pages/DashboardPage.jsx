import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import {
  ArrowRightIcon,
  BrandMark,
  ChartIcon,
  DashboardIcon,
  RoadmapIcon,
  SearchIcon,
  ShieldIcon,
  TargetIcon,
} from '../components/AppIcons'
import { useAuth } from '../context/AuthContext'
import getApiErrorMessage from '../utils/getApiErrorMessage'

function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    let active = true

    api.get('/profile/me')
      .then(({ data }) => {
        if (!active) {
          return
        }
        setProfile(data)
      })
      .catch((error) => {
        if (!active) {
          return
        }

        if (error.response?.status === 404) {
          setProfile(null)
          return
        }

        setProfileError(getApiErrorMessage(error, 'Unable to load your profile status right now.'))
      })
      .finally(() => {
        if (active) {
          setLoadingProfile(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const hasProfile = Boolean(profile)

  const phaseCards = useMemo(() => ([
    {
      title: 'Profile onboarding',
      copy: hasProfile
        ? 'Your profile is saved and editable. You are ready for roadmap generation.'
        : 'Complete your profile to unlock personalized roadmap generation in the next phase.',
      Icon: ShieldIcon,
    },
    {
      title: 'AI roadmap generation',
      copy: 'The secured backend is ready to generate protected roadmap outputs once profile data exists.',
      Icon: RoadmapIcon,
    },
    {
      title: 'Skill gap insights',
      copy: 'This dashboard shell is prepared for upcoming skill-gap and project-suggestion views.',
      Icon: SearchIcon,
    },
  ]), [hasProfile])

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
            <span className="section-badge dashboard-badge">Authenticated workspace</span>
            <h1 className="dashboard-title">Welcome back, {user?.name || 'Student'}</h1>
            <p className="dashboard-copy">
              {hasProfile
                ? 'Your account and profile are active. Next, we will generate your personalized learning roadmap.'
                : 'Your account is active and protected. Complete your profile to start the roadmap flow.'}
            </p>
            <div className="dashboard-actions">
              <Link className="btn btn-primary" to="/profile">
                <TargetIcon className="button-icon" />
                {hasProfile ? 'Edit profile' : 'Complete profile'}
              </Link>
              <Link className="btn btn-glass" to="/">
                <DashboardIcon className="button-icon" />
                View landing page
              </Link>
            </div>
            {profileError ? <div className="auth-message auth-message-error">{profileError}</div> : null}
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
              <span>Profile status</span>
              <strong>{loadingProfile ? 'Checking...' : hasProfile ? 'Completed' : 'Pending'}</strong>
            </div>
            <div className="dashboard-identity-row">
              <span>Career goal</span>
              <strong>{profile?.careerGoal || 'Not set'}</strong>
            </div>
            <div className="dashboard-identity-row">
              <span>Study time</span>
              <strong>{profile?.hoursPerWeek ? `${profile.hoursPerWeek} hrs/week` : 'Not set'}</strong>
            </div>
            <div className="dashboard-identity-row">
              <span>Phase</span>
              <strong>{hasProfile ? '3 in progress' : '2 complete'}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          {phaseCards.map(({ title, copy, Icon }) => (
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
              <li>Stored JWT session and protected routes</li>
              <li>Student profile save and fetch APIs</li>
              <li>Profile-aware dashboard state</li>
            </ul>
            <Link className="btn btn-glass btn-sm" to="/profile">
              <ArrowRightIcon className="button-icon" />
              Open profile form
            </Link>
          </article>
        </section>
      </main>
    </>
  )
}

export default DashboardPage
