'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

type AuthContextValue = {
  token: string | null
  userId: number | null
  setAuth: (token: string | null, userId: number | null) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  const setAuth = useCallback((t: string | null, id: number | null) => {
    setToken(t)
    setUserId(id)
  }, [])

  const value: AuthContextValue = {
    token,
    userId,
    setAuth,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
