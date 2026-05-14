"use client"

import { useState, useEffect } from "react"
import { type PerformanceData, type TradeData, performanceDataManager } from "@/lib/performance-data"

export function usePerformanceData() {
  const [data, setData] = useState<PerformanceData[]>([])
  const [allTrades, setAllTrades] = useState<TradeData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // -----------------------------
  // 판매된 거래만 로드
  // -----------------------------
  const loadPerformanceData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const performanceData = await performanceDataManager.getData()
      setData(performanceData)
    } catch (error) {
      console.error("Failed to load performance data:", error)
      setError("수익률 데이터를 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // -----------------------------
  // 모든 거래 로드
  // -----------------------------
  const loadAllTrades = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const trades = await performanceDataManager.getAllTrades() // Ensure this returns TradeData[]
      setAllTrades(trades)
    } catch (error) {
      console.error("Failed to load all trades:", error)
      setError("거래 데이터를 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // -----------------------------
  // 새 거래 추가
  // -----------------------------
  const addTrade = async (tradeData: {
    user: { user_id: number }  // 수정됨: userId → id
    stockName: string
    quantity: number
    buyPrice: number
    sellPrice?: number | null
    buyDate: string
    sellDate?: string | null
  }) => {
    try {
      setError(null)
      const newTrade = await performanceDataManager.addTrade(tradeData)
      if (newTrade) {
        // await loadAllTrades() // 추가 후 전체 거래 새로고침
        await loadPerformanceData();
        return newTrade
      }
      throw new Error("거래 추가에 실패했습니다.")
    } catch (error) {
      console.error("Failed to add trade:", error)
      setError("거래 추가에 실패했습니다.")
      throw error
    }
  }

  // -----------------------------
  // 거래 판매 (매도)
  // -----------------------------
  const sellTrade = async (
    tradeId: number,
    sellData: {
      sellPrice: number
      sellDate: string
    }
  ) => {
    try {
      setError(null)
      const soldTrade = await performanceDataManager.sellTrade(tradeId, sellData)
      if (soldTrade) {
        await Promise.all([
          loadPerformanceData(),
          loadAllTrades()
        ])
        return soldTrade
      }
      throw new Error("거래 판매에 실패했습니다.")
    } catch (error) {
      console.error("Failed to sell trade:", error)
      setError("거래 판매에 실패했습니다.")
      throw error
    }
  }

  // -----------------------------
  // 거래 삭제
  // -----------------------------
  const deleteTrade = async (tradeId: number) => {
    try {
      setError(null)
      const success = await performanceDataManager.deleteTrade(tradeId)
      if (success) {
        // 로컬 상태에서도 제거
        setData((prev) => prev.filter((item) => item.tradeId !== tradeId))
        setAllTrades((prev) => prev.filter((item) => item.tradeId !== tradeId))
        
      } else {
        throw new Error("거래 삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("Failed to delete trade:", error)
      setError("거래 삭제에 실패했습니다.")
      throw error
    }
  }

  // -----------------------------
  // 거래 수정
  // -----------------------------
  const updateTrade = async (
    tradeId: number,
    updates: {
      user: { user_id: number } // 추가: user 필수
      stockName?: string
      quantity?: number
      buyPrice?: number
      sellPrice?: number | null
      buyDate?: string
      sellDate?: string | null
    }
  ) => {
    try {
      setError(null)
      const updatedTrade = await performanceDataManager.updateTrade(tradeId, updates)
      if (updatedTrade) {
        await Promise.all([
          loadPerformanceData(),
          loadAllTrades()
        ])        
        return updatedTrade
      }
      throw new Error("거래 수정에 실패했습니다.")
    } catch (error) {
      console.error("Failed to update trade:", error)
      setError("거래 수정에 실패했습니다.")
      throw error
    }
  }

  // -----------------------------
  // 특정 사용자 거래 로드
  // -----------------------------
  const loadUserTrades = async (userId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const userTrades = await performanceDataManager.getUserTrades(userId)
      return userTrades
    } catch (error) {
      console.error("Failed to load user trades:", error)
      setError("사용자 거래 데이터를 불러오는데 실패했습니다.")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // -----------------------------
  // 수익률 통계 계산
  // -----------------------------
  const getPerformanceStats = async () => {
    try {
      setError(null)
      const stats = await performanceDataManager.getPerformanceStats()
      return stats
    } catch (error) {
      console.error("Failed to get performance stats:", error)
      setError("통계 데이터를 불러오는데 실패했습니다.")
      return {
        totalTrades: 0,
        totalProfit: 0,
        averageReturn: 0,
        winRate: 0
      }
    }
  }

  // -----------------------------
  // 전체 데이터 새로고침
  // -----------------------------
  const refreshAllData = async () => {
    await Promise.all([
      loadPerformanceData(),
      loadAllTrades()
    ])
  }

  // -----------------------------
  // 컴포넌트 마운트 시 초기 데이터 로드
  // -----------------------------
  useEffect(() => {
    loadPerformanceData()
  }, [])

  return {
    // 데이터
    data, // 판매된 거래 (수익률 포함)
    allTrades, // 모든 거래
    isLoading,
    error,

    // CRUD 함수
    addTrade,
    sellTrade,
    deleteTrade,
    updateTrade,

    // 데이터 로드 함수
    loadPerformanceData,
    loadAllTrades,
    loadUserTrades,
    refreshAllData,

    // 통계 함수
    getPerformanceStats,

    // 호환성 유지
    refreshData: loadPerformanceData,
  }
}

