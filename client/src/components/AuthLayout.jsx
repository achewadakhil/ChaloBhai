import React from 'react'
import { Link } from 'react-router-dom'
import { BrandMark, ChartIcon, RoadmapIcon, SearchIcon, ShieldIcon } from './AppIcons'

const DEFAULT_HIGHLIGHTS = [
  {
    Icon: ShieldIcon,
    title: 'Secure sign-in flow',
    copy: 'JWT authentication keeps the client and server aligned for every protected request.',
  },
  {
    Icon: RoadmapIcon,
    title: 'Personalized planning',
    copy: 'The next phase will use your profile to generate role-specific learning paths and milestones.',
  },
  {
    Icon: SearchIcon,
    title: 'Skill-gap clarity',
    copy: 'Your dashboard is being prepared to surface missing skills, focus areas, and practical project ideas.',
  },
  {
    Icon: ChartIcon,
    title: 'Progress visibility',
    copy: 'The product is structured so future progress tracking fits naturally into the authenticated experience.',
  },
]

function AuthLayout({
  title,
  subtitle,
  sideTitle,
  sideText,
  footerText,
  footerLinkText,
  footerLinkTo,
  children,
  highlights = DEFAULT_HIGHLIGHTS,
}) {
  return (
    <>
      <div className="bg-animated">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <main className="auth-page">
        <div className="auth-shell">
          <section className="auth-showcase glass">
            <Link to="/" className="auth-brand">
              <span className="auth-brand-icon">
                <BrandMark className="app-icon" />
              </span>
              <span className="auth-brand-name">ChaloBhai</span>
            </Link>

            <span className="section-badge auth-kicker">Phase 2 Authentication</span>
            <h1 className="auth-showcase-title">{sideTitle}</h1>
            <p className="auth-showcase-copy">{sideText}</p>

            <div className="auth-highlight-list">
              {highlights.map(({ Icon, title: itemTitle, copy }) => (
                <div key={itemTitle} className="auth-highlight glass">
                  <span className="auth-highlight-icon">
                    <Icon className="app-icon" />
                  </span>
                  <div>
                    <h3>{itemTitle}</h3>
                    <p>{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="auth-panel glass">
            <span className="section-badge auth-panel-badge">Welcome back</span>
            <h2 className="auth-panel-title">{title}</h2>
            <p className="auth-panel-copy">{subtitle}</p>

            {children}

            <p className="auth-switch-copy">
              {footerText}{' '}
              <Link to={footerLinkTo}>{footerLinkText}</Link>
            </p>
          </section>
        </div>
      </main>
    </>
  )
}

export default AuthLayout
