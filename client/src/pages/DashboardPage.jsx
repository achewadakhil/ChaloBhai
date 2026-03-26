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
  const [roadmap, setRoadmap] = useState(null)
  const [loadingRoadmap, setLoadingRoadmap] = useState(true)
  const [roadmapError, setRoadmapError] = useState('')
  const [roadmapMessage, setRoadmapMessage] = useState('')
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false)
  const [roadmapProgress, setRoadmapProgress] = useState(null)
  const [loadingRoadmapProgress, setLoadingRoadmapProgress] = useState(true)
  const [roadmapProgressError, setRoadmapProgressError] = useState('')
  const [togglingMilestoneKey, setTogglingMilestoneKey] = useState('')
  const [insights, setInsights] = useState(null)
  const [loadingInsights, setLoadingInsights] = useState(true)
  const [insightsError, setInsightsError] = useState('')
  const [insightsMessage, setInsightsMessage] = useState('')
  const [generatingInsights, setGeneratingInsights] = useState(false)
  const [nextStep, setNextStep] = useState(null)
  const [loadingNextStep, setLoadingNextStep] = useState(true)
  const [nextStepError, setNextStepError] = useState('')

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

  useEffect(() => {
    if (loadingProfile) {
      return
    }

    if (!hasProfile) {
      setRoadmap(null)
      setRoadmapProgress(null)
      setNextStep(null)
      setNextStepError('')
      setRoadmapProgressError('')
      setRoadmapError('')
      setRoadmapMessage('')
      setLoadingRoadmap(false)
      setLoadingRoadmapProgress(false)
      setLoadingNextStep(false)
      return
    }

    let active = true
    setLoadingRoadmap(true)
    setRoadmapError('')

    api.get('/roadmap/me')
      .then(({ data }) => {
        if (!active) {
          return
        }
        setRoadmap(data)
      })
      .catch((error) => {
        if (!active) {
          return
        }

        if (error.response?.status === 404) {
          setRoadmap(null)
          return
        }

        setRoadmapError(getApiErrorMessage(error, 'Unable to load your roadmap right now.'))
      })
      .finally(() => {
        if (active) {
          setLoadingRoadmap(false)
        }
      })

    return () => {
      active = false
    }
  }, [hasProfile, loadingProfile])

  const handleGenerateRoadmap = async () => {
    if (!hasProfile || generatingRoadmap) {
      return
    }

    setGeneratingRoadmap(true)
    setRoadmapError('')
    setRoadmapMessage('')
    setRoadmapProgressError('')
    setNextStepError('')

    try {
      const { data } = await api.post('/roadmap/me/generate')
      setRoadmap(data)
      setRoadmapProgress(null)
      setNextStep(null)
      setInsights(null)
      setInsightsMessage('')
      setInsightsError('')
      setRoadmapMessage('Roadmap generated and saved successfully.')
    } catch (error) {
      setRoadmapError(getApiErrorMessage(error, 'Unable to generate roadmap right now.Try to reload and '))
    } finally {
      setGeneratingRoadmap(false)
      setLoadingRoadmap(false)
    }
  }

  useEffect(() => {
    if (loadingRoadmap) {
      return
    }

    if (!roadmap) {
      setRoadmapProgress(null)
      setRoadmapProgressError('')
      setLoadingRoadmapProgress(false)
      return
    }

    let active = true
    setLoadingRoadmapProgress(true)
    setRoadmapProgressError('')

    api.get('/roadmap/me/progress')
      .then(({ data }) => {
        if (!active) {
          return
        }
        setRoadmapProgress(data)
      })
      .catch((error) => {
        if (!active) {
          return
        }

        if (error.response?.status === 404) {
          setRoadmapProgress({
            roadmapId: roadmap.id,
            totalMilestones: roadmap.milestones.length,
            completedMilestones: 0,
            completionPercentage: 0,
            completedMilestoneKeys: [],
          })
          return
        }

        setRoadmapProgressError(getApiErrorMessage(error, 'Unable to load roadmap progress right now.'))
      })
      .finally(() => {
        if (active) {
          setLoadingRoadmapProgress(false)
        }
      })

    return () => {
      active = false
    }
  }, [loadingRoadmap, roadmap])

  useEffect(() => {
    if (loadingRoadmap || loadingRoadmapProgress) {
      return
    }

    if (!roadmap) {
      setNextStep(null)
      setNextStepError('')
      setLoadingNextStep(false)
      return
    }

    let active = true
    setLoadingNextStep(true)
    setNextStepError('')

    api.get('/roadmap/me/next-step')
      .then(({ data }) => {
        if (!active) {
          return
        }
        setNextStep(data)
      })
      .catch((error) => {
        if (!active) {
          return
        }
        setNextStepError(getApiErrorMessage(error, 'Unable to load your recommended next step right now.'))
      })
      .finally(() => {
        if (active) {
          setLoadingNextStep(false)
        }
      })

    return () => {
      active = false
    }
  }, [loadingRoadmap, loadingRoadmapProgress, roadmap, roadmapProgress])

  const buildMilestoneKey = (milestone) => {
    const normalizedTitle = (milestone.title || 'milestone')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return `${milestone.weekStart}-${milestone.weekEnd}-${normalizedTitle}`
  }

  const completedMilestoneKeys = useMemo(() => {
    return new Set(roadmapProgress?.completedMilestoneKeys || [])
  }, [roadmapProgress])

  const handleToggleMilestone = async (milestone) => {
    if (!roadmap || !roadmapProgress || togglingMilestoneKey) {
      return
    }

    const milestoneKey = buildMilestoneKey(milestone)
    setTogglingMilestoneKey(milestoneKey)
    setRoadmapProgressError('')

    try {
      const { data } = await api.post('/roadmap/me/progress/toggle', { milestoneKey })
      setRoadmapProgress(data)
    } catch (error) {
      setRoadmapProgressError(getApiErrorMessage(error, 'Unable to update milestone progress right now.'))
    } finally {
      setTogglingMilestoneKey('')
    }
  }

  useEffect(() => {
    if (loadingRoadmap) {
      return
    }

    if (!roadmap) {
      setInsights(null)
      setInsightsError('')
      setInsightsMessage('')
      setLoadingInsights(false)
      return
    }

    let active = true
    setLoadingInsights(true)
    setInsightsError('')

    api.get('/insights/me')
      .then(({ data }) => {
        if (!active) {
          return
        }
        setInsights(data)
      })
      .catch((error) => {
        if (!active) {
          return
        }

        if (error.response?.status === 404) {
          setInsights(null)
          return
        }

        setInsightsError(getApiErrorMessage(error, 'Unable to load roadmap insights right now.'))
      })
      .finally(() => {
        if (active) {
          setLoadingInsights(false)
        }
      })

    return () => {
      active = false
    }
  }, [loadingRoadmap, roadmap])

  const handleGenerateInsights = async () => {
    if (!roadmap || generatingInsights) {
      return
    }

    setGeneratingInsights(true)
    setInsightsError('')
    setInsightsMessage('')

    try {
      const { data } = await api.post('/insights/me/generate')
      setInsights(data)
      setInsightsMessage('Skill gaps and project suggestions generated successfully.')
    } catch (error) {
      setInsightsError(getApiErrorMessage(error, 'Unable to generate roadmap insights right now.'))
    } finally {
      setGeneratingInsights(false)
      setLoadingInsights(false)
    }
  }

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
      copy: !hasProfile
        ? 'Profile data is required before roadmap generation can start.'
        : loadingRoadmap
          ? 'Checking for an existing roadmap generated for your account.'
          : roadmap
            ? 'Roadmap is generated and stored for this authenticated session.'
            : 'Generate your roadmap to create a personalized weekly learning plan.',
      Icon: RoadmapIcon,
    },
    {
      title: 'Skill gap insights',
      copy: !roadmap
        ? 'Generate your roadmap first to unlock personalized skill-gap and project insights.'
        : loadingInsights
          ? 'Checking if your roadmap insights already exist for this account.'
          : insights
            ? 'Insights are generated and stored with role-focused project suggestions.'
            : 'Generate skill-gap analysis and portfolio project suggestions from your roadmap.',
      Icon: SearchIcon,
    },
    {
      title: 'Adaptive next-step guidance',
      copy: !roadmap
        ? 'Generate your roadmap first to unlock adaptive next-step recommendations.'
        : loadingNextStep
          ? 'Preparing your best next milestone based on progress and insight data.'
          : nextStep
            ? 'Next-step guidance is ready with recommended focus and project direction.'
            : 'Your next-step guidance will appear once roadmap data is available.',
      Icon: TargetIcon,
    },
  ]), [hasProfile, insights, loadingInsights, loadingNextStep, loadingRoadmap, nextStep, roadmap])

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
                ? 'Your account and profile are active. Generate and review your personalized learning roadmap below.'
                : 'Your account is active and protected. Complete your profile to start the roadmap flow.'}
            </p>
            <div className="dashboard-actions">
              <Link className="btn btn-primary" to="/profile">
                <TargetIcon className="button-icon" />
                {hasProfile ? 'Edit profile' : 'Complete profile'}
              </Link>
              {hasProfile ? (
                <button
                  className="btn btn-glass"
                  type="button"
                  onClick={handleGenerateRoadmap}
                  disabled={generatingRoadmap}
                >
                  <RoadmapIcon className="button-icon" />
                  {generatingRoadmap
                    ? 'Generating roadmap...'
                    : roadmap
                      ? 'Regenerate roadmap'
                      : 'Generate roadmap'}
                </button>
              ) : null}
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
              <span>Roadmap status</span>
              <strong>{loadingRoadmap ? 'Checking...' : roadmap ? 'Generated' : 'Not generated'}</strong>
            </div>
            <div className="dashboard-identity-row">
              <span>Study time</span>
              <strong>{profile?.hoursPerWeek ? `${profile.hoursPerWeek} hrs/week` : 'Not set'}</strong>
            </div>
            <div className="dashboard-identity-row">
              <span>Phase</span>
              <strong>{nextStep ? '7 in progress' : insights ? '6 in progress' : roadmap ? '5 in progress' : hasProfile ? '3 complete' : '2 complete'}</strong>
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
              <li>AI roadmap generation and persistence APIs</li>
              <li>Skill-gap and project suggestion generation APIs</li>
              <li>Milestone progress tracking APIs</li>
              <li>Adaptive next-step recommendation API</li>
            </ul>
            <Link className="btn btn-glass btn-sm" to="/profile">
              <ArrowRightIcon className="button-icon" />
              Open profile form
            </Link>
          </article>
        </section>

        <section className="dashboard-roadmap glass">
          <div className="dashboard-roadmap-head">
            <div>
              <span className="section-badge dashboard-badge">Phase 4 roadmap</span>
              <h2 className="dashboard-roadmap-title">Your AI learning roadmap</h2>
            </div>
            {hasProfile ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleGenerateRoadmap}
                disabled={generatingRoadmap}
              >
                <RoadmapIcon className="button-icon" />
                {generatingRoadmap ? 'Generating...' : roadmap ? 'Refresh roadmap' : 'Generate now'}
              </button>
            ) : null}
          </div>

          {roadmapError ? <div className="auth-message auth-message-error">{roadmapError}</div> : null}
          {roadmapMessage ? <div className="auth-message auth-message-success">{roadmapMessage}</div> : null}
          {roadmapProgressError ? <div className="auth-message auth-message-error">{roadmapProgressError}</div> : null}

          {!hasProfile ? (
            <p className="dashboard-roadmap-empty">
              Complete your profile first. Roadmap generation uses your skills, career goal, and weekly study time.
            </p>
          ) : loadingRoadmap ? (
            <p className="dashboard-roadmap-empty">Loading roadmap status...</p>
          ) : !roadmap ? (
            <p className="dashboard-roadmap-empty">
              No roadmap generated yet. Use Generate now to create your first personalized learning plan.
            </p>
          ) : (
            <>
              <p className="dashboard-roadmap-summary">{roadmap.summary}</p>

              <div className="dashboard-roadmap-meta">
                <span>{roadmap.estimatedWeeks} week plan</span>
                <span>Provider: {roadmap.provider}</span>
                <span>Model: {roadmap.model}</span>
              </div>

              {loadingRoadmapProgress ? (
                <p className="dashboard-roadmap-empty">Loading progress status...</p>
              ) : roadmapProgress ? (
                <div className="roadmap-progress-panel glass">
                  <div className="roadmap-progress-head">
                    <h3>Progress tracking</h3>
                    <span>{roadmapProgress.completionPercentage}% complete</span>
                  </div>
                  <div className="roadmap-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={roadmapProgress.completionPercentage}>
                    <div
                      className="roadmap-progress-fill"
                      style={{ width: `${roadmapProgress.completionPercentage}%` }}
                    />
                  </div>
                  <p className="roadmap-progress-copy">
                    {roadmapProgress.completedMilestones} of {roadmapProgress.totalMilestones} milestones completed
                  </p>
                </div>
              ) : null}

              <div className="roadmap-timeline">
                {roadmap.milestones.map((milestone) => (
                  <article
                    key={`${milestone.weekStart}-${milestone.weekEnd}-${milestone.title}`}
                    className={`roadmap-item glass ${completedMilestoneKeys.has(buildMilestoneKey(milestone)) ? 'roadmap-item-complete' : ''}`}
                  >
                    <div className="roadmap-item-week">Week {milestone.weekStart} to {milestone.weekEnd}</div>
                    <h3 className="roadmap-item-title">{milestone.title}</h3>
                    <p className="roadmap-item-goal">{milestone.goal}</p>
                    <p className="roadmap-item-deliverable">
                      <strong>Deliverable:</strong> {milestone.deliverable}
                    </p>
                    <button
                      type="button"
                      className={`roadmap-toggle-btn ${completedMilestoneKeys.has(buildMilestoneKey(milestone)) ? 'is-complete' : ''}`}
                      onClick={() => handleToggleMilestone(milestone)}
                      disabled={Boolean(togglingMilestoneKey)}
                    >
                      {togglingMilestoneKey === buildMilestoneKey(milestone)
                        ? 'Saving...'
                        : completedMilestoneKeys.has(buildMilestoneKey(milestone))
                          ? 'Mark as incomplete'
                          : 'Mark as complete'}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="dashboard-insights glass">
          <div className="dashboard-roadmap-head">
            <div>
              <span className="section-badge dashboard-badge">Phase 5 insights</span>
              <h2 className="dashboard-roadmap-title">Skill gaps and project suggestions</h2>
            </div>
            {roadmap ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleGenerateInsights}
                disabled={generatingInsights}
              >
                <SearchIcon className="button-icon" />
                {generatingInsights ? 'Generating...' : insights ? 'Refresh insights' : 'Generate insights'}
              </button>
            ) : null}
          </div>

          {insightsError ? <div className="auth-message auth-message-error">{insightsError}</div> : null}
          {insightsMessage ? <div className="auth-message auth-message-success">{insightsMessage}</div> : null}

          {!roadmap ? (
            <p className="dashboard-roadmap-empty">Generate your roadmap first. Insights are created from roadmap milestones and your profile.</p>
          ) : loadingInsights ? (
            <p className="dashboard-roadmap-empty">Loading insights status...</p>
          ) : !insights ? (
            <p className="dashboard-roadmap-empty">No insights generated yet. Use Generate insights to get skill-gap analysis and project ideas.</p>
          ) : (
            <div className="dashboard-insights-grid">
              <article className="insight-panel glass">
                <h3 className="insight-panel-title">Top skill gaps</h3>
                <div className="insight-list">
                  {insights.skillGaps.map((gap) => (
                    <div key={`${gap.skill}-${gap.targetLevel}`} className="insight-item">
                      <div className="insight-item-head">
                        <h4>{gap.skill}</h4>
                        <span className="insight-level">{gap.currentLevel} to {gap.targetLevel}</span>
                      </div>
                      <p>{gap.whyItMatters}</p>
                      <ul>
                        {gap.learningActions.map((action) => (
                          <li key={action}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>

              <article className="insight-panel glass">
                <h3 className="insight-panel-title">Suggested projects</h3>
                <div className="insight-list">
                  {insights.projectSuggestions.map((project) => (
                    <div key={project.title} className="insight-item">
                      <div className="insight-item-head">
                        <h4>{project.title}</h4>
                        <span className="insight-level">{project.difficulty} · {project.durationWeeks} weeks</span>
                      </div>
                      <p>{project.description}</p>
                      <p className="insight-outcome"><strong>Outcome:</strong> {project.outcome}</p>
                      <div className="insight-stack">
                        {project.techStack.map((tech) => (
                          <span key={`${project.title}-${tech}`}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}
        </section>

        <section className="dashboard-next-step glass">
          <div className="dashboard-roadmap-head">
            <div>
              <span className="section-badge dashboard-badge">Phase 7 adaptive guide</span>
              <h2 className="dashboard-roadmap-title">Your recommended next step</h2>
            </div>
          </div>

          {nextStepError ? <div className="auth-message auth-message-error">{nextStepError}</div> : null}

          {!roadmap ? (
            <p className="dashboard-roadmap-empty">Generate your roadmap first to unlock next-step recommendations.</p>
          ) : loadingNextStep ? (
            <p className="dashboard-roadmap-empty">Loading next-step recommendation...</p>
          ) : !nextStep ? (
            <p className="dashboard-roadmap-empty">Next-step guidance is not available yet.</p>
          ) : (
            <div className="next-step-panel glass">
              <div className="next-step-head">
                <h3>{nextStep.nextMilestoneTitle}</h3>
                {nextStep.nextMilestoneWeekStart && nextStep.nextMilestoneWeekEnd ? (
                  <span>Week {nextStep.nextMilestoneWeekStart} to {nextStep.nextMilestoneWeekEnd}</span>
                ) : (
                  <span>All milestones completed</span>
                )}
              </div>

              <p className="next-step-copy">{nextStep.focusAction}</p>

              <div className="next-step-progress">
                <span>{nextStep.completedMilestones}/{nextStep.totalMilestones} milestones completed</span>
                <strong>{nextStep.completionPercentage}%</strong>
              </div>

              {nextStep.recommendedProjects?.length ? (
                <div className="next-step-projects">
                  {nextStep.recommendedProjects.map((projectTitle) => (
                    <span key={projectTitle}>{projectTitle}</span>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default DashboardPage
