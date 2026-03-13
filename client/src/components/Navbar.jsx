import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightIcon,
  BrandMark,
  CloseIcon,
  DashboardIcon,
  LogoutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from './AppIcons'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Careers', href: '#careers' },
]

function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const scrolledBg = theme === 'dark'
    ? 'rgba(8, 3, 28, 0.75)'
    : 'rgba(238, 242, 255, 0.82)'

  return (
    <>
      <nav
        className="navbar glass"
        style={scrolled ? { background: scrolledBg, boxShadow: '0 4px 24px rgba(0, 0, 0, 0.18)' } : {}}
      >
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-icon">
            <BrandMark className="app-icon" />
          </div>
          <span className="navbar-brand-name">ChaloBhai</span>
        </Link>

        <ul className="navbar-links">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle colour theme"
            type="button"
          >
            {theme === 'dark' ? <SunIcon className="app-icon" /> : <MoonIcon className="app-icon" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-glass btn-sm">
                <DashboardIcon className="button-icon" />
                Dashboard
              </Link>
              <button className="btn btn-primary btn-sm" onClick={handleLogout} type="button">
                <LogoutIcon className="button-icon" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-glass btn-sm">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
                <ArrowRightIcon className="button-icon" />
              </Link>
            </>
          )}

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle mobile menu"
            type="button"
          >
            {menuOpen ? <CloseIcon className="app-icon" /> : <MenuIcon className="app-icon" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="glass"
          style={{
            position: 'fixed',
            top: '86px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 24px)',
            maxWidth: '480px',
            zIndex: 999,
            borderRadius: '20px',
            padding: '16px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={handleNavClick}
              style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: '12px',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = 'var(--glass-bg-hover)'
                event.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = 'transparent'
                event.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {label}
            </a>
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-glass" onClick={handleNavClick} style={{ flex: 1, justifyContent: 'center' }}>
                  Dashboard
                </Link>
                <button className="btn btn-primary" onClick={handleLogout} style={{ flex: 1, justifyContent: 'center' }} type="button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-glass" onClick={handleNavClick} style={{ flex: 1, justifyContent: 'center' }}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={handleNavClick} style={{ flex: 1, justifyContent: 'center' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar

