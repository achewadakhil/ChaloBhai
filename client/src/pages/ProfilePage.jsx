import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import {
  ArrowRightIcon,
  ChartIcon,
  ClockIcon,
  RoadmapIcon,
  SearchIcon,
  ShieldIcon,
  TargetIcon,
  UserIcon,
} from '../components/AppIcons'
import { useAuth } from '../context/AuthContext'
import getApiErrorMessage from '../utils/getApiErrorMessage'

const CAREER_GOALS = [
  'Backend Developer',
  'Full Stack Developer',
  'AI / ML Engineer',
  'Frontend Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Cloud Architect',
  'Cybersecurity Engineer',
]

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

function ProfilePage() {
  const { user } = useAuth()
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [careerMenuOpen, setCareerMenuOpen] = useState(false)
  const [careerSearch, setCareerSearch] = useState('')
  const careerDropdownRef = useRef(null)
  const careerSearchInputRef = useRef(null)

  const [formData, setFormData] = useState({
    currentSkillsText: '',
    careerGoal: CAREER_GOALS[0],
    hoursPerWeek: 8,
    experienceLevel: EXPERIENCE_LEVELS[0],
  })

  useEffect(() => {
    let active = true

    api.get('/profile/me')
      .then(({ data }) => {
        if (!active) {
          return
        }

        setFormData({
          currentSkillsText: data.currentSkills.join(', '),
          careerGoal: data.careerGoal,
          hoursPerWeek: data.hoursPerWeek,
          experienceLevel: data.experienceLevel,
        })
      })
      .catch((error) => {
        if (!active) {
          return
        }

        if (error.response?.status !== 404) {
          setErrorMessage(getApiErrorMessage(error, 'Unable to load profile details.'))
        }
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

  const parsedSkills = useMemo(() => {
    return formData.currentSkillsText
      .split(/[\n,]/)
      .map((skill) => skill.trim())
      .filter(Boolean)
  }, [formData.currentSkillsText])

  const filteredCareerGoals = useMemo(() => {
    const search = careerSearch.trim().toLowerCase()
    if (!search) {
      return CAREER_GOALS
    }

    return CAREER_GOALS.filter((goal) => goal.toLowerCase().includes(search))
  }, [careerSearch])

  useEffect(() => {
    if (careerMenuOpen) {
      careerSearchInputRef.current?.focus()
    }
  }, [careerMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!careerDropdownRef.current?.contains(event.target)) {
        setCareerMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setCareerMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setSuccessMessage('')
    setErrorMessage('')

    setFormData((current) => ({
      ...current,
      [name]: name === 'hoursPerWeek' ? value.replace(/[^0-9]/g, '') : value,
    }))
  }

  const handleCareerGoalSelect = (goal) => {
    setSuccessMessage('')
    setErrorMessage('')
    setFormData((current) => ({
      ...current,
      careerGoal: goal,
    }))
    setCareerSearch('')
    setCareerMenuOpen(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (parsedSkills.length === 0) {
      setErrorMessage('Please enter at least one current skill.')
      return
    }

    const hours = Number(formData.hoursPerWeek)
    if (!Number.isInteger(hours) || hours < 1 || hours > 80) {
      setErrorMessage('Hours per week must be between 1 and 80.')
      return
    }

    setSavingProfile(true)

    try {
      const payload = {
        currentSkills: parsedSkills,
        careerGoal: formData.careerGoal,
        hoursPerWeek: hours,
        experienceLevel: formData.experienceLevel,
      }

      const { data } = await api.post('/profile/me', payload)

      setFormData({
        currentSkillsText: data.currentSkills.join(', '),
        careerGoal: data.careerGoal,
        hoursPerWeek: data.hoursPerWeek,
        experienceLevel: data.experienceLevel,
      })
      setSuccessMessage('Profile saved successfully. Your roadmap data is now ready for the next phase.')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to save profile right now.'))
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <>
      <div className="bg-animated">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />

      <main className="profile-page">
        <section className="profile-shell">
          <article className="profile-form-panel glass">
            <span className="section-badge dashboard-badge">Phase 3 profile onboarding</span>
            <h1 className="profile-title">Build your student profile</h1>
            <p className="profile-copy">
              Add your current skills, target career, weekly study time, and experience level. This information will power roadmap generation in the next phase.
            </p>

            {loadingProfile ? (
              <div className="profile-loading">Loading your existing profile...</div>
            ) : (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="currentSkillsText">Current skills</label>
                  <textarea
                    id="currentSkillsText"
                    className="textarea"
                    name="currentSkillsText"
                    placeholder="Example: Java, Spring Boot, REST APIs, MySQL"
                    rows={4}
                    value={formData.currentSkillsText}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="profile-hint">Separate skills with commas or new lines.</span>
                </div>

                <div className="profile-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="careerGoal">Career goal</label>
                    <div className="career-dropdown" ref={careerDropdownRef}>
                      <button
                        id="careerGoal"
                        type="button"
                        className={`career-dropdown-trigger input${careerMenuOpen ? ' is-open' : ''}`}
                        aria-expanded={careerMenuOpen}
                        aria-controls="careerGoalMenu"
                        onClick={() => setCareerMenuOpen((current) => !current)}
                      >
                        <span className="career-dropdown-value">{formData.careerGoal}</span>
                        <span className="career-dropdown-chevron" aria-hidden="true">▾</span>
                      </button>

                      {careerMenuOpen ? (
                        <div id="careerGoalMenu" className="career-dropdown-menu glass">
                          <div className="career-dropdown-search-wrap">
                            <input
                              ref={careerSearchInputRef}
                              className="career-dropdown-search"
                              type="text"
                              value={careerSearch}
                              onChange={(event) => setCareerSearch(event.target.value)}
                              placeholder="Search career goal..."
                              aria-label="Search career goals"
                            />
                          </div>

                          <div className="career-dropdown-options" role="listbox" aria-label="Career goals">
                            {filteredCareerGoals.length > 0 ? (
                              filteredCareerGoals.map((goal) => (
                                <button
                                  key={goal}
                                  type="button"
                                  className={`career-dropdown-option${formData.careerGoal === goal ? ' active' : ''}`}
                                  onClick={() => handleCareerGoalSelect(goal)}
                                  role="option"
                                  aria-selected={formData.careerGoal === goal}
                                >
                                  {goal}
                                </button>
                              ))
                            ) : (
                              <p className="career-dropdown-empty">No matching career goal found.</p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <span className="profile-hint">Select one or search quickly.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="experienceLevel">Experience level</label>
                    <select
                      id="experienceLevel"
                      className="input"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                    >
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="hoursPerWeek">Available study time (hours per week)</label>
                  <input
                    id="hoursPerWeek"
                    className="input"
                    name="hoursPerWeek"
                    type="text"
                    inputMode="numeric"
                    value={formData.hoursPerWeek}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {errorMessage ? <div className="auth-message auth-message-error">{errorMessage}</div> : null}
                {successMessage ? <div className="auth-message auth-message-success">{successMessage}</div> : null}

                <div className="profile-actions">
                  <button className="btn btn-primary" type="submit" disabled={savingProfile}>
                    <ShieldIcon className="button-icon" />
                    {savingProfile ? 'Saving profile...' : 'Save profile'}
                  </button>
                  <Link className="btn btn-glass" to="/dashboard">
                    <ArrowRightIcon className="button-icon" />
                    Back to dashboard
                  </Link>
                </div>
              </form>
            )}
          </article>

          <aside className="profile-insights-panel glass">
            <h2 className="profile-insights-title">Profile summary preview</h2>

            <div className="profile-metric-list">
              <div className="profile-metric">
                <span className="profile-metric-icon"><UserIcon className="app-icon" /></span>
                <div>
                  <div className="profile-metric-label">Student</div>
                  <div className="profile-metric-value">{user?.name}</div>
                </div>
              </div>

              <div className="profile-metric">
                <span className="profile-metric-icon"><TargetIcon className="app-icon" /></span>
                <div>
                  <div className="profile-metric-label">Career goal</div>
                  <div className="profile-metric-value">{formData.careerGoal}</div>
                </div>
              </div>

              <div className="profile-metric">
                <span className="profile-metric-icon"><ClockIcon className="app-icon" /></span>
                <div>
                  <div className="profile-metric-label">Study time</div>
                  <div className="profile-metric-value">{formData.hoursPerWeek || 0} hrs/week</div>
                </div>
              </div>
            </div>

            <div className="profile-chip-section">
              <h3>Current skills ({parsedSkills.length})</h3>
              <div className="profile-chip-list">
                {parsedSkills.length > 0 ? (
                  parsedSkills.map((skill) => (
                    <span key={skill} className="profile-chip glass">
                      <SearchIcon className="chip-icon" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="profile-empty-copy">No skills added yet.</p>
                )}
              </div>
            </div>

            <div className="profile-next-card glass">
              <h3><RoadmapIcon className="app-icon" /> Next up</h3>
              <p>
                With this profile saved, the upcoming phase can generate your personalized learning roadmap, skill gaps, and project suggestions.
              </p>
              <Link to="/dashboard" className="btn btn-glass btn-sm">
                <ChartIcon className="button-icon" />
                View dashboard status
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </>
  )
}

export default ProfilePage
