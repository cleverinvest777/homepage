"use client"

import { useState, useEffect } from "react"
import { type User, getUsers, searchUsers, deleteUser } from "@/lib/user-data"

export function useUserData() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const userData = getUsers()
      setUsers(await userData)
    } catch (error) {
      console.error("[v0] 사용자 데이터 로드 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchUserData = (query: string) => {
    if (!query.trim()) {
      return users
    }
    return searchUsers(query)
  }

  const removeUser = async (userId: string) => {
    const success = deleteUser(userId)
    if (await success) {
      loadUsers() // 데이터 새로고침
    }
    return success
  }

  useEffect(() => {
    // 관리자 계정 초기화
    // initializeAdminAccount()
    loadUsers()
  }, [])

  return {
    users,
    isLoading,
    loadUsers,
    searchUserData,
    removeUser,
  }
}
