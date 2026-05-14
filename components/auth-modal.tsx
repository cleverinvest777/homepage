"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff } from "lucide-react"

import axios from 'axios'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    username: "",
    phoneNumber: "",
    confirmPassword: "",
    verificationCode: "",
  })
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!isLogin) {
      // 회원가입 유효성 검사
      if (!formData.id || formData.id.length < 5) {
        newErrors.id = "아이디는 5글자 이상이어야 합니다."
      }

      if (!formData.password || formData.password.length < 8) {
        newErrors.password = "비밀번호는 8글자 이상이어야 합니다."
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(formData.password)) {
        newErrors.password = "비밀번호는 문자와 숫자를 포함해야 합니다."
      }

      if (!formData.username) {
        newErrors.username = "이름을 입력해주세요."
      }

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "전화번호를 입력해주세요."
      } else if (!/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "올바른 전화번호 형식이 아닙니다."
      }

      if (isVerificationSent && !formData.verificationCode) {
        newErrors.verificationCode = "인증번호를 입력해주세요."
      }
    } else {
      // 로그인 유효성 검사
      if (!formData.id) {
        newErrors.id = "아이디를 입력해주세요."
      }
      if (!formData.password) {
        newErrors.password = "비밀번호를 입력해주세요."
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendVerification = async () => {
    if (!formData.phoneNumber) {
      setErrors({ phoneNumber: "전화번호를 먼저 입력해주세요." })
      return
    }

    try {
      console.log("SMS 인증번호 발송:", formData.phoneNumber)
      // TODO: 실제 SMS API 연동 시 여기에 구현
      setIsVerificationSent(true)
      alert("인증번호가 발송되었습니다. (개발 환경에서는 '123456'을 입력하세요)")
    } catch (error) {
      console.error("인증번호 발송 오류:", error)
      setErrors({ phoneNumber: "인증번호 발송에 실패했습니다." })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (isLogin) {
        // 로그인 처리
        const response = await axios.post(`${API_BASE_URL}/user/login`, {
          id: formData.id,
          password: formData.password,
        })
        
        console.log("로그인 응답:", response.data)
        const user = response.data

        if (user) {
          console.log("로그인 성공:", user.username || user.id)
          alert(`${user.username || user.id}님, 환영합니다!`)

          // 로그인 상태 저장
          localStorage.setItem("cleverinvest_current_user", JSON.stringify(user))

          onClose()
          // 페이지 새로고침으로 로그인 상태 반영
          window.location.reload()
        }
      } else {
        // 회원가입 처리
        // if (!isVerificationSent) {
        //   alert("전화번호 인증을 먼저 진행해주세요.")
        //   return
        // }

        // if (formData.verificationCode !== "123456") {
        //   setErrors({ verificationCode: "인증번호가 올바르지 않습니다." })
        //   return
        // }

        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = "비밀번호가 일치하지 않습니다."
        }

        // 백엔드에 회원가입 데이터 전송
        console.log("회원가입 데이터 전송:", formData)
        const response = await axios.post(`${API_BASE_URL}/user/signup`, {
          id: formData.id,
          password: formData.password,
          username: formData.username,
          phoneNumber: formData.phoneNumber,
        })
        
        console.log("회원가입 응답:", response.data)
        const newUser = response.data

        // 회원가입 후 자동 로그인
        // localStorage.setItem("cleverinvest_current_user", JSON.stringify(newUser))

        console.log("회원가입 성공:", newUser)
        alert(`${newUser.username || newUser.id}님, 회원가입이 완료되었습니다!`)

        onClose()
        window.location.reload()
      }
    } catch (error: any) {
      console.error("인증 오류:", error)
      
      // 에러 메시지 처리
      let errorMessage = "처리 중 오류가 발생했습니다."
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || "처리 중 오류가 발생했습니다."
      } else if (error.message) {
        errorMessage = error.message
      }

      console.log("Error message received:", errorMessage);

      if (typeof errorMessage === "string"){
        if (errorMessage.includes("Duplicate entry")) {
          setErrors({ id: "이미 사용중인 아이디입니다." });
        } else if (errorMessage.includes("아이디")) {
          setErrors({ id: errorMessage });
        } else if (errorMessage.includes("비밀번호")) {
          setErrors({ password: errorMessage });
        } else {
          alert(errorMessage);
        }
      }
      // if (errorMessage.includes("아이디")) {
      //   setErrors({ id: errorMessage })
      // } else if (errorMessage.includes("비밀번호")) {
      //   setErrors({ password: errorMessage })
      // } else if (errorMessage.includes("전화번호")) {
      //   setErrors({ phoneNumber: errorMessage })
      // } else if (errorMessage.includes("이름")) {
      //   setErrors({ username: errorMessage })
      // } else {
      //   alert(errorMessage)
      // }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const resetForm = () => {
    setFormData({
      id: "",
      password: "",
      username: "",
      phoneNumber: "",
      verificationCode: "",
      confirmPassword: "",
    })
    setErrors({})
    setIsVerificationSent(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <Card className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">{isLogin ? "로그인" : "회원가입"}</CardTitle>
            <CardDescription>
              {isLogin ? "CleverInvest에 로그인하세요" : "CleverInvest 회원이 되어보세요"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 아이디 */}
              <div>
                <Label htmlFor="id">아이디</Label>
                <Input
                  id="id"
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  placeholder={isLogin ? "아이디를 입력하세요" : "5글자 이상 입력하세요"}
                  className={errors.id ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.id && <p className="text-sm text-red-500 mt-1">{errors.id}</p>}
              </div>

              {/* 비밀번호 */}
              <div>
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder={isLogin ? "비밀번호를 입력하세요" : "8글자 이상, 문자+숫자"}
                    className={errors.password ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* 회원가입 추가 필드 */}
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword ?? ""}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="비밀번호를 다시 입력하세요"
                        className={errors.confirmPassword ? "border-red-500" : ""}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                  {/* 이름 */}
                  <div>
                    <Label htmlFor="username">이름</Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      placeholder="실명을 입력하세요"
                      className={errors.username ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
                  </div>

                  {/* 전화번호 */}
                  {/* <div>
                    <Label htmlFor="phoneNumber">전화번호</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder="010-1234-5678"
                        className={`flex-1 ${errors.phoneNumber ? "border-red-500" : ""}`}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendVerification}
                        disabled={isVerificationSent || isSubmitting}
                        className="whitespace-nowrap bg-transparent"
                      >
                        {isVerificationSent ? "발송완료" : "인증번호"}
                      </Button>
                    </div>
                    {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
                  </div> */}

                  {/* 인증번호 */}
                  {/* {isVerificationSent && (
                    <div>
                      <Label htmlFor="verificationCode">인증번호</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        value={formData.verificationCode}
                        onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                        placeholder="인증번호 6자리를 입력하세요"
                        className={errors.verificationCode ? "border-red-500" : ""}
                        maxLength={6}
                        disabled={isSubmitting}
                      />
                      {errors.verificationCode && (
                        <p className="text-sm text-red-500 mt-1">{errors.verificationCode}</p>
                      )}
                    </div>
                  )} */}
                </>
              )}

              {/* 제출 버튼 */}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
              </Button>
            </form>

            {/* 모드 전환 */}
            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-sm text-slate-600">
                {isLogin ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  resetForm()
                }}
                className="text-blue-600 hover:text-blue-700 font-medium mt-1"
                disabled={isSubmitting}
              >
                {isLogin ? "회원가입하기" : "로그인하기"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}