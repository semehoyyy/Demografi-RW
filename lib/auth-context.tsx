"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User } from "./types"
import { MOCK_USERS } from "./mock-data"

interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = "siwarga_session"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.username === username)
    if (!found) {
      return { success: false, message: "Username tidak ditemukan" }
    }
    if (password !== "password") {
      return { success: false, message: "Password salah (gunakan: password)" }
    }
    setUser(found)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    const target =
      found.role === "super-admin"
        ? "/super-admin/dashboard"
        : found.role === "admin"
          ? "/admin/dashboard"
          : "/warga/dashboard"
    router.push(target)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem(STORAGE_KEY)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
