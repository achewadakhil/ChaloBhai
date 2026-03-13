import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)
const TOKEN_KEY = 'chalobhai_token'
const USER_KEY = 'chalobhai_user'

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem(USER_KEY)
    return rawUser ? JSON.parse(rawUser) : null
  } catch {
    return null
  }
}

function persistSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      setInitializing(false)
      return
    }

    let active = true

    api.get('/auth/me')
      .then(({ data }) => {
        if (!active) {
          return
        }
        setUser(data)
        localStorage.setItem(USER_KEY, JSON.stringify(data))
      })
      .catch(() => {
        if (!active) {
          return
        }
        clearSession()
        setUser(null)
      })
      .finally(() => {
        if (active) {
          setInitializing(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    persistSession(data.token, data.user)
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    persistSession(data.token, data.user)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    initializing,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}
