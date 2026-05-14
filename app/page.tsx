"use client"

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, TrendingUp, Shield, Users, Phone, Mail, MapPin, Menu, X, LogIn } from "lucide-react";
import { usePerformanceData } from "@/hooks/use-performance-data";
import { MobilePerformanceCard } from "@/components/mobile-performance-card";
import { AuthModal } from "@/components/auth-modal";
import Link from "next/link";

import { fetchPerformanceMetrics, PerformanceMetrics } from "@/lib/performance-data";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("company")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 상태 관리
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태 관리

  const { data: performanceData, isLoading } = usePerformanceData()
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    fetchPerformanceMetrics().then(setMetrics);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["company", "system", "performance", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const userData = localStorage.getItem("cleverinvest_current_user")

    if(userData){
      try{
        const user = JSON.parse(userData);
        const token = user?.access_token
        
        setIsLoggedIn(!!token)

        if (user.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

      }catch{
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    }
    
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">CleverInvest</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm font-medium transition-colors text-red-600 border-b-2 border-red-600"
                >
                  admin
                </Link>
              )}
              {[
                { id: "company", label: "회사소개" },
                { id: "system", label: "투자시스템" },
                { id: "performance", label: "수익률" },
                { id: "contact", label: "고객센터" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    // 로그아웃 처리: 토큰 및 유저 정보 삭제                    
                    localStorage.removeItem("cleverinvest_current_user");
                    localStorage.removeItem("admin_auth")
                    setIsLoggedIn(false);
                    window.location.reload();
                  }}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <span>로그아웃</span>
                </button>
              ) : (
                <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </button>
              )}
              
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              {[
                { id: "company", label: "회사소개" },
                { id: "system", label: "투자시스템" },
                { id: "performance", label: "수익률" },
                { id: "contact", label: "고객센터" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setIsAuthModalOpen(true)
                  setIsMenuOpen(false)
                }}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 text-balance leading-tight">
              스마트한 투자,
              <br />
              <span className="text-blue-600">확실한 수익</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
              CleverInvest와 함께 체계적이고 전문적인 투자 서비스를 경험하세요. 데이터 기반의 투자 전략으로 안정적인
              수익을 실현합니다.
            </p>
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg"
            >
              투자 상담 신청
            </Button>
          </div>
        </section>

        {/* Company Section */}
        <section id="company" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">회사소개</h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
                CleverInvest는 혁신적인 투자 솔루션을 제공하는 전문 투자회사입니다.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">안전한 투자</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    리스크 관리를 최우선으로 하는 체계적인 투자 전략으로 고객의 자산을 안전하게 보호합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">지속적 성장</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    시장 분석과 데이터 기반의 투자 결정으로 장기적이고 안정적인 수익 창출을 목표로 합니다.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center sm:col-span-2 md:col-span-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">전문 서비스</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    경험 많은 투자 전문가들이 고객 맞춤형 포트폴리오를 구성하고 지속적으로 관리합니다.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Investment System Section */}
        <section id="system" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">투자시스템</h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
                체계적이고 과학적인 투자 프로세스로 최적의 투자 성과를 달성합니다.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">시장 분석</h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        빅데이터와 AI 기술을 활용한 실시간 시장 분석으로 투자 기회를 포착합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">리스크 평가</h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        다각도 리스크 분석을 통해 안전한 투자 범위 내에서 최적의 수익을 추구합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">포트폴리오 구성</h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        고객의 투자 성향과 목표에 맞는 맞춤형 포트폴리오를 구성합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">지속적 모니터링</h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        24시간 시장 모니터링과 정기적인 포트폴리오 리밸런싱을 통해 최적 성과를 유지합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {!metrics ? <p>로딩 중...</p> : 
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-center">투자 성과 지표</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-slate-700 text-sm sm:text-base">최고 수익률</span>
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                      {metrics.highestReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-slate-700 text-sm sm:text-base">연평균 수익률</span>
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      {metrics.yearlyAverage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <span className="font-medium text-slate-700 text-sm sm:text-base">월평균 수익률</span>
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">
                      {metrics.monthlyAverage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div> }
              
            </div>
          </div>
        </section>

        {/* Performance Section */}
        <section id="performance" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">수익률</h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
                실제 투자 성과를 투명하게 공개합니다. 모든 거래 내역과 수익률을 확인하세요.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">수익률 데이터를 불러오는 중...</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {performanceData
                  .filter((item) => item.isShown === true)
                  .sort((a, b) => new Date(b.sellDate).getTime() - new Date(a.sellDate).getTime())
                  .map((item, index) =>
                    isMobile ? (
                      <MobilePerformanceCard key={index} item={item} />
                    ) : (
                      <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="relative">
                            {/* 종목명 - 더 크게 */}
                            <div className="mb-6">
                              <h3 className="text-2xl font-bold text-slate-900">{item.stockName}</h3>
                            </div>

                            {/* 매수가격, 매도가격, 수익률 - 가운데 정렬 */}
                            <div className="flex justify-center items-center gap-12 mb-4">
                              <div className="text-center">
                                <p className="text-sm text-slate-500 mb-1">매수가격</p>
                                <p className="text-lg font-semibold text-slate-900">₩{item.buyPrice.toLocaleString()}</p>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-slate-500 mb-1">매도가격</p>
                                <p className="text-lg font-semibold text-slate-900">₩{item.sellPrice.toLocaleString()}</p>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-slate-500 mb-1">수익률</p>
                                <div className="flex items-center justify-center space-x-1">
                                  <ArrowUp
                                    className={`w-4 h-4 ${item.return >= 0 ? "text-green-600" : "text-red-600"}`}
                                  />
                                  <p className={`text-lg font-bold ${item.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {item.return >= 0 ? "+" : ""}
                                    {item.return}%
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="absolute bottom-0 right-0 text-right">
                              <p className="text-sm text-slate-400">매수일: {item.buyDate}</p>
                              <p className="text-sm text-slate-400">매도일: {item.sellDate}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )
                }

              </div>
            )}

            <div className="text-center mt-8 sm:mt-12">
              <Link href="/transactions">
                <Button variant="outline" size="lg" className="px-6 sm:px-8 bg-transparent">
                  전체 거래 내역 보기
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">고객센터</h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto text-pretty">
                투자 상담이 필요하시거나 궁금한 점이 있으시면 언제든지 연락주세요.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg sm:text-xl">전화 상담</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-300 mb-4 text-sm sm:text-base">평일 09:00 - 18:00</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-400">02-1234-5678</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg sm:text-xl">이메일 문의</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-300 mb-4 text-sm sm:text-base">24시간 접수 가능</p>
                  <p className="text-lg sm:text-xl font-bold text-green-400 break-all">info@cleverinvest.co.kr</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 sm:col-span-2 lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg sm:text-xl">오시는 길</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-300 mb-4 text-sm sm:text-base">서울시 강남구 테헤란로</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-400">123번길 45</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3">
                투자 상담 신청하기
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">CleverInvest</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            © 2025 CleverInvest. All rights reserved. | 투자에는 원금 손실의 위험이 있습니다.
          </p>
        </div>
      </footer>
    </div>
  )
}
