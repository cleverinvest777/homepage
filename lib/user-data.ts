import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface User {
  userId: number
  id: String
  password: string
  username: string
  phoneNumber: string
  createdAt: string
  isVerified: boolean
  role: string
}

export interface UserRegistrationData {
  id: string
  password: string
  username: string
  phoneNumber: string
}

// 사용자 데이터 저장
export const saveUser = async (userData: UserRegistrationData): Promise<User> => {
  const users = await getUsers()
  
  // 중복 아이디 체크
  if (users.find((user) => user.id === userData.id)) {
    throw new Error("이미 존재하는 아이디입니다.")
  }

  // 중복 전화번호 체크
  if (users.find((user) => user.phoneNumber === userData.phoneNumber)) {
    throw new Error("이미 등록된 전화번호입니다.")
  }

  const newUser: User = {
    ...userData,
    createdAt: new Date().toISOString(),
    isVerified: true,
    userId: 0,
    role: "USER"
  }

  // 서버에 새 사용자 저장 (필요시)
  try {
    await axios.post(`${API_BASE_URL}/user/register`, newUser)
  } catch (error) {
    console.error("사용자 저장 실패:", error)
    throw new Error("사용자 등록에 실패했습니다.")
  }

  return newUser
}

// 모든 사용자 조회
export const getUsers = async (): Promise<User[]> => {
  if (typeof window === "undefined") return []

  try {
    const response = await axios.get(`${API_BASE_URL}/user/all`);
    console.log(response.data)
    
    return response.data || []
  } catch (error) {
    console.error("사용자 조회 실패:", error)
    return []
  }
}

// 사용자 로그인 검증
export const validateLogin = async (id: string, password: string): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      id: id,
      password: password
    })
    return response.data || null
  } catch (error) {
    console.error("로그인 검증 실패:", error)
    return null
  }
}

// 사용자 검색
export const searchUsers = async (query: string): Promise<User[]> => {
  const users = await getUsers()
  const lowercaseQuery = query.toLowerCase()

  return users.filter(
    (user) =>
      (user.id?.toString().toLowerCase() ?? "").includes(lowercaseQuery) ||
      (user.username?.toLowerCase() ?? "").includes(lowercaseQuery) ||
      (user.phoneNumber ?? "").includes(query)
  )
}

// 사용자 삭제
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/user/${userId}`)
    return true
  } catch (error) {
    console.error("사용자 삭제 실패:", error)
    return false
  }
}

// 로컬 스토리지 기반 함수들 (백업용 또는 오프라인용)
export const getUsersFromStorage = (): User[] => {
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem("cleverinvest_users")
  return stored ? JSON.parse(stored) : []
}

export const saveUsersToStorage = (users: User[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cleverinvest_users", JSON.stringify(users))
  }
}