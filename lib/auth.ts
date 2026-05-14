"use client"

import axios from "axios"
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 간단한 관리자 인증 시스템
const ADMIN_CREDENTIALS = {
  id: "admin",
  password: "cleverinvest2024",
}

export interface AuthState {
  isAuthenticated: boolean
  id: string | null
}

export class AuthManager {
  private static instance: AuthManager
  private authState: AuthState = {
    isAuthenticated: false,
    id: null,
  }
  id: AuthState | undefined

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  constructor() {
    // 브라우저에서만 실행
    if (typeof window !== "undefined") {
      this.loadAuthState()
    }
  }

  private loadAuthState() {
    try {
      const saved = localStorage.getItem("admin_auth")
      if (saved) {
        const parsed = JSON.parse(saved)
        // 세션 만료 체크 (24시간)
        const now = Date.now()
        if (parsed.expires && now < parsed.expires) {
          this.authState = {
            isAuthenticated: true,
            id: parsed.id,
          }
        } else {
          this.logout()
        }
      }
    } catch (error) {
      console.error("Failed to load auth state:", error)
      this.logout()
    }
  }

  private saveAuthState() {
    try {
      const expires = Date.now() + 24 * 60 * 60 * 1000 // 24시간
      localStorage.setItem(
        "admin_auth",
        JSON.stringify({
          id: this.authState.id,
          expires,
        }),
      )
    } catch (error) {
      console.error("Failed to save auth state:", error)
    }
  }
  
  async login(id: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        id: id,
        password: password
      })
      
      console.log(response.data);
      
      this.authState = {
        isAuthenticated: true,
        id: id,
      }
      
      localStorage.setItem("cleverinvest_current_user", JSON.stringify(response.data));
      this.saveAuthState()
      
      return true
      
    } catch(err) {
      console.log(err);
      return false;
    }
  }

  logout() {
    this.authState = {
      isAuthenticated: false,
      id: null,
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("cleverinvest_current_user")
      localStorage.removeItem("admin_auth")
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState }
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated
  }
}

export const authManager = AuthManager.getInstance()