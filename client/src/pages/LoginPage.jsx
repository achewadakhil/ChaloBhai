import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { ArrowRightIcon, ShieldIcon } from '../components/AppIcons'
import { useAuth } from '../context/AuthContext'
import getApiErrorMessage from '../utils/getApiErrorMessage'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(formData)
      const nextPath = location.state?.from?.pathname || '/dashboard'
      navigate(nextPath, { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to sign in with these credentials.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in to your workspace"
      subtitle="Access your roadmap workspace, restore your saved session, and continue building your career plan."
      sideTitle="A secure entry point into your AI career workspace"
      sideText="Authentication is now live. Students can create accounts, sign in, and move into a protected dashboard that will host the profile builder in the next phase."
      footerText="Need an account?"
      footerLinkText="Create one now"
      footerLinkTo="/signup"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email address</label>
          <input
            id="email"
            className="input"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="student@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error ? <div className="auth-message auth-message-error">{error}</div> : null}

        <button className="btn btn-primary auth-submit" disabled={submitting} type="submit">
          <ShieldIcon className="button-icon" />
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="auth-helper-row">
          <span>Phase 2 adds JWT auth and protected routes.</span>
          <Link to="/signup" className="auth-inline-link">
            Create account
            <ArrowRightIcon className="button-icon" />
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
