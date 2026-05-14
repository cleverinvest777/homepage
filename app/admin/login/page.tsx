"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Lock, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function AdminLoginPage() {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [registerData, setRegisterData] = useState({
    id: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  })
  const [registerError, setRegisterError] = useState("")
  const [registerLoading, setRegisterLoading] = useState(false)

  const { isAuthenticated, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, router])

  // 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(id, password)
      if (success) {
        const userData = JSON.parse(localStorage.getItem("cleverinvest_current_user") || "{}")
        if (userData.role && userData.role.toLowerCase() !== "admin") {
          setError("관리자 권한이 없습니다.")
          setIsLoading(false)
          return
        }
        router.push("/admin")
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.")
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 회원가입 처리
  const handleRegister = async () => {
    setRegisterError("")

    if (!registerData.id || !registerData.username || !registerData.password) {
      setRegisterError("모든 필드를 입력하세요.")
      return
    }
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("비밀번호가 일치하지 않습니다.")
      return
    }

    try {
      setRegisterLoading(true)
      await axios.post(`${API_BASE_URL}/user/admin-signup`, {
        id: registerData.id,
        username: registerData.username,
        password: registerData.password,
        phoneNumber: registerData.phoneNumber
      })
      alert("회원가입이 완료되었습니다. 이제 로그인하세요.")
      setIsRegisterOpen(false)
      setRegisterData({ id: "", username: "", password: "", confirmPassword: "", phoneNumber: "" })
    } catch (error) {
      setRegisterError("회원가입 중 오류가 발생했습니다.")
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">홈으로 돌아가기</span>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">CleverInvest</span>
          </div>
          <p className="text-slate-600">관리자 로그인</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">관리자 인증</CardTitle>
            <CardDescription>수익률 데이터 관리를 위해 로그인이 필요합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="id">아이디</Label>
                <Input
                  id="id"
                  type="text"
                  placeholder="관리자 아이디를 입력하세요"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            {/* 회원가입 버튼 */}
            <div className="mt-4 text-center">
              <Button variant="outline" className="w-full" onClick={() => setIsRegisterOpen(true)}>
                관리자 회원가입
              </Button>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 text-center">
                <strong>데모 계정:</strong>
                <br />
                아이디: admin
                <br />
                비밀번호: cleverinvest2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 회원가입 모달 */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관리자 회원가입</DialogTitle>
            <DialogDescription>새 관리자 계정을 생성합니다.</DialogDescription>
          </DialogHeader>

          {registerError && (
            <Alert variant="destructive">
              <AlertDescription>{registerError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 mt-3">
            <div>
              <Label>아이디</Label>
              <Input
                value={registerData.id}
                onChange={(e) => setRegisterData({ ...registerData, id: e.target.value })}
                placeholder="아이디 입력"
              />
            </div>
            <div>
              <Label>이름</Label>
              <Input
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                placeholder="이름 입력"
              />
            </div>
            <div>
              <Label>비밀번호</Label>
              <Input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="비밀번호 입력"
              />
            </div>
            <div>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                placeholder="비밀번호 확인"
              />
            </div>
            <div>
              <Label>전화번호</Label>
              <Input
                type="text"
                inputMode="numeric"       // 모바일에서 숫자 키패드 표시
                pattern="[0-9]*"           // 숫자만 허용
                value={registerData.phoneNumber}
                onChange={(e) => setRegisterData({ 
                  ...registerData, 
                  phoneNumber: e.target.value.replace(/\D/g, "") // 숫자만 남기기
                })}
                placeholder="예: 01012345678"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsRegisterOpen(false)}>
              취소
            </Button>
            <Button onClick={handleRegister} disabled={registerLoading}>
              {registerLoading ? "가입 중..." : "회원가입"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
