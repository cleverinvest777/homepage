"use client"

import { useState, useEffect } from "react"
import { authManager, type AuthState } from "@/lib/auth"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    id: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 초기 인증 상태 로드
    setAuthState(authManager.getAuthState())
    setIsLoading(false)
  }, [])

  const login = async (id: string, password: string): Promise<boolean> => {
    const success = authManager.login(id, password)
    if (await success) {
      setAuthState(authManager.getAuthState())
    }
    return success
  }

  const logout = () => {
    authManager.logout()
    setAuthState(authManager.getAuthState())
  }

  return {
    ...authState,
    isLoading,
    login,
    logout,
  }
}
