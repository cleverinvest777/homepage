"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, Filter, Calendar } from "lucide-react"
import { usePerformanceData } from "@/hooks/use-performance-data"
import Link from "next/link"

const ITEMS_PER_PAGE = 10

export default function TransactionsPage() {
  const { data: performanceData, isLoading } = usePerformanceData()
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  const [filterType, setFilterType] = useState<"all" | "trade-date" | "created-date">("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const filteredData = useMemo(() => {
    if (filterType === "all") return performanceData

    return performanceData.filter((item) => {
      let targetDate: string

      if (filterType === "trade-date") {
        targetDate = item.buyDate
      } else {
        // created-date
        targetDate = new Date(item.createdAt).toISOString().split("T")[0]
      }

      const [year, month] = targetDate.split("-")

      if (selectedYear !== "all" && year !== selectedYear) return false
      if (selectedMonth !== "all" && month !== selectedMonth) return false

      return true
    })
  }, [performanceData, filterType, selectedYear, selectedMonth])

  const availableYears = useMemo(() => {
    const years = new Set<string>()

    performanceData.forEach((item) => {
      if (filterType === "trade-date") {
        years.add(item.buyDate.split("-")[0])
      } else if (filterType === "created-date") {
        years.add(new Date(item.createdAt).getFullYear().toString())
      }
    })

    return Array.from(years).sort((a, b) => b.localeCompare(a))
  }, [performanceData, filterType])

  const availableMonths = useMemo(() => {
    if (selectedYear === "all") return []

    const months = new Set<string>()

    performanceData.forEach((item) => {
      let targetDate: string

      if (filterType === "trade-date") {
        targetDate = item.buyDate
      } else if (filterType === "created-date") {
        targetDate = new Date(item.createdAt).toISOString().split("T")[0]
      } else {
        return
      }

      const [year, month] = targetDate.split("-")
      if (year === selectedYear) {
        months.add(month)
      }
    })

    return Array.from(months).sort()
  }, [performanceData, filterType, selectedYear])

  // 페이징 계산
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemClick = (id: string) => {
    // 개별 상세 페이지로 이동
    // window.location.href = `/transactions/${id}`
  }

  const resetFilters = () => {
    setFilterType("all")
    setSelectedYear("all")
    setSelectedMonth("all")
    setCurrentPage(1)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [filterType, selectedYear, selectedMonth])

  useEffect(() => {
    setSelectedMonth("all")
  }, [selectedYear])

  const getMonthName = (month: string) => {
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    return monthNames[Number.parseInt(month) - 1] || month
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">홈으로</span>
              </Link>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">CleverInvest</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">전체 거래 내역</h1>
            <p className="text-base sm:text-lg text-slate-600">
              총 {performanceData.length}건의 거래 내역을 확인하실 수 있습니다.
              {filteredData.length !== performanceData.length && (
                <span className="text-blue-600 font-medium"> (필터링된 결과: {filteredData.length}건)</span>
              )}
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">필터링</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 필터 타입 선택 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    기준 날짜
                  </label>
                  <Select
                    value={filterType}
                    onValueChange={(value: "all" | "trade-date" | "created-date") => setFilterType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="trade-date">거래일 기준</SelectItem>
                      <SelectItem value="created-date">등록일 기준</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 연도 선택 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">연도</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear} disabled={filterType === "all"}>
                    <SelectTrigger>
                      <SelectValue placeholder="연도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}년
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 월 선택 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">월</label>
                  <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                    disabled={filterType === "all" || selectedYear === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="월 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {availableMonths.map((month) => (
                        <SelectItem key={month} value={month}>
                          {getMonthName(month)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 초기화 버튼 */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full bg-transparent"
                    disabled={filterType === "all" && selectedYear === "all" && selectedMonth === "all"}
                  >
                    필터 초기화
                  </Button>
                </div>
              </div>

              {/* 현재 필터 상태 표시 */}
              {filterType !== "all" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {filterType === "trade-date" ? "거래일 기준" : "등록일 기준"}
                  </Badge>
                  {selectedYear !== "all" && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {selectedYear}년
                    </Badge>
                  )}
                  {selectedMonth !== "all" && (
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      {getMonthName(selectedMonth)}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">거래 내역을 불러오는 중...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                {filterType === "all" ? "아직 거래 내역이 없습니다." : "선택한 조건에 맞는 거래 내역이 없습니다."}
              </p>
              {filterType !== "all" && (
                <Button variant="outline" onClick={resetFilters} className="mt-4 bg-transparent">
                  필터 초기화
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Transaction List */}
              <div className="grid gap-4 sm:gap-6 mb-8">
                {currentData.filter(item => item.isShown).map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01]"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <CardContent className="p-6">
                      {isMobile ? (
                        // Mobile Layout
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">{item.stockName}</h3>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge variant="outline" className="text-xs">
                                거래일: {item.buyDate}
                              </Badge>
                              <Badge variant="outline" className="text-xs text-slate-500">
                                등록일: {new Date(item.createdAt).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-500 mb-1">매수가격</p>
                              <p className="text-sm font-semibold text-slate-900">₩{item.buyPrice.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-500 mb-1">매도가격</p>
                              <p className="text-sm font-semibold text-slate-900">₩{item.sellPrice.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-500 mb-1">수익률</p>
                            <div className="flex items-center justify-center space-x-1">
                              <ArrowUp className={`w-4 h-4 ${item.return >= 0 ? "text-green-600" : "text-red-600"}`} />
                              <p
                                className={`text-lg font-bold ${item.return >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {item.return >= 0 ? "+" : ""}
                                {item.return}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Desktop Layout
                        <div className="relative">
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">{item.stockName}</h3>
                          </div>

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
                                <p
                                  className={`text-lg font-bold ${item.return >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {item.return >= 0 ? "+" : ""}
                                  {item.return}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute bottom-0 right-0 text-right">
                            <p className="text-sm text-slate-400">거래일: {item.buyDate}</p>
                            <p className="text-xs text-slate-400">
                              등록일: {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>이전</span>
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 ${
                          currentPage === page
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "text-slate-600 hover:text-blue-600"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1"
                  >
                    <span>다음</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Page Info */}
              <div className="text-center mt-6 text-sm text-slate-500">
                {/* {startIndex + 1}-{Math.min(endIndex, filteredData.length)} / {filteredData.length}건 표시 중
                {filteredData.length !== performanceData.length && <span> (전체 {performanceData.length}건 중)</span>} */}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
