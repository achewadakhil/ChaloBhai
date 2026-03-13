import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { ArrowRightIcon, SparkIcon } from '../components/AppIcons'
import { useAuth } from '../context/AuthContext'
import getApiErrorMessage from '../utils/getApiErrorMessage'

function SignupPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create your account right now.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your student account"
      subtitle="Set up your account now so the next phases can attach skills, goals, and personalized AI results to your profile."
      sideTitle="One account for your roadmap, gap analysis, and progress"
      sideText="This release creates the secure identity layer for the rest of ChaloBhai. Once signed in, students have a protected dashboard ready for profile onboarding in Phase 3."
      footerText="Already registered?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full name</label>
          <input
            id="name"
            className="input"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Aarav Sharma"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              className="input"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error ? <div className="auth-message auth-message-error">{error}</div> : null}

        <button className="btn btn-primary auth-submit" disabled={submitting} type="submit">
          <SparkIcon className="button-icon" />
          {submitting ? 'Creating account...' : 'Create account'}
        </button>

        <div className="auth-helper-row">
          <span>Account creation signs you in immediately.</span>
          <Link to="/login" className="auth-inline-link">
            Go to sign in
            <ArrowRightIcon className="button-icon" />
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export default SignupPage
