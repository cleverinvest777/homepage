"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowLeft, TrendingUp, Calendar, DollarSign, Target, BarChart3 } from "lucide-react"
import { usePerformanceData } from "@/hooks/use-performance-data"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function TransactionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { data: performanceData, isLoading } = usePerformanceData()
  const [transaction, setTransaction] = useState<any>(null)

  useEffect(() => {
    if (performanceData.length > 0 && id) {
      const foundTransaction = performanceData.find((item) => item.id === id)
      setTransaction(foundTransaction)
    }
  }, [performanceData, id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">거래 내역을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">거래 내역을 찾을 수 없습니다</h1>
          <Link href="/transactions">
            <Button variant="outline">거래 내역으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  const profitAmount = Math.round((transaction.sellPrice - transaction.buyPrice) * (transaction.return / 100))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/transactions"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">거래 내역</span>
              </Link>
              <div className="w-px h-6 bg-slate-300"></div>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">CleverInvest</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Transaction Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{transaction.symbol}</h1>
              <Badge variant="outline" className="text-sm">
                거래 완료
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-slate-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">거래일: {transaction.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">ID: {transaction.id}</span>
              </div>
            </div>
          </div>

          {/* Transaction Summary Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <CardTitle className="text-sm font-medium text-slate-600">매수가격</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-bold text-slate-900">₩{transaction.buyPrice.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <CardTitle className="text-sm font-medium text-slate-600">매도가격</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-bold text-slate-900">₩{transaction.sellPrice.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      transaction.return >= 0 ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <ArrowUp className={`w-4 h-4 ${transaction.return >= 0 ? "text-green-600" : "text-red-600"}`} />
                  </div>
                  <CardTitle className="text-sm font-medium text-slate-600">수익률</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className={`text-2xl font-bold ${transaction.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {transaction.return >= 0 ? "+" : ""}
                  {transaction.return}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      profitAmount >= 0 ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <DollarSign className={`w-4 h-4 ${profitAmount >= 0 ? "text-green-600" : "text-red-600"}`} />
                  </div>
                  <CardTitle className="text-sm font-medium text-slate-600">수익금액</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className={`text-2xl font-bold ${profitAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {profitAmount >= 0 ? "+" : ""}₩{Math.abs(profitAmount).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">거래 상세 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">거래 개요</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">종목명</span>
                      <span className="font-medium text-slate-900">{transaction.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">거래일</span>
                      <span className="font-medium text-slate-900">{transaction.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">거래 유형</span>
                      <span className="font-medium text-slate-900">매수 → 매도</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">거래 상태</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        완료
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">수익 분석</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">매수가격</span>
                      <span className="font-medium text-slate-900">₩{transaction.buyPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">매도가격</span>
                      <span className="font-medium text-slate-900">₩{transaction.sellPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">가격 차이</span>
                      <span
                        className={`font-medium ${
                          transaction.sellPrice - transaction.buyPrice >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.sellPrice - transaction.buyPrice >= 0 ? "+" : ""}₩
                        {(transaction.sellPrice - transaction.buyPrice).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">수익률</span>
                      <span className={`font-bold ${transaction.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.return >= 0 ? "+" : ""}
                        {transaction.return}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">투자 전략 및 분석</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700 leading-relaxed">
                    {transaction.symbol} 종목에 대한 체계적인 분석을 통해 매수 시점을 결정했습니다. 시장 동향과 기술적
                    분석을 바탕으로 한 투자 전략이
                    <span className={`font-semibold ${transaction.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.return >= 0 ? " 성공적인 " : " 아쉬운 "}
                    </span>
                    결과를 가져왔습니다. 지속적인 시장 모니터링과 리스크 관리를 통해 최적의 매도 타이밍을 포착했습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/transactions">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                거래 내역으로 돌아가기
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                홈으로 이동
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
