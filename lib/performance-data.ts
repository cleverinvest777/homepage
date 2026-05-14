import axios from "axios"
import { deleteUser } from "./user-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 판매 완료된 거래 데이터 타입
export interface PerformanceData {
  id: string
  tradeId: number
  stockName: string
  quantity: number
  buyPrice: number
  sellPrice: number
  isShown: boolean
  return: number
  buyDate: string
  sellDate: string
  createdAt: string
  user: {
    id: string
    username: string
  }
  isSelled: boolean
}

// 모든 거래(진행중 + 완료) 타입
export interface TradeData {
  tradeId: number
  stockName: string
  quantity: number
  buyPrice: number
  sellPrice: number | null
  buyDate: string
  sellDate: string | null
  createdAt: string
  updatedAt: string
  isSelled: boolean
  user: {
    id: string
    username: string
  }
  shown: boolean
}

// 투자 성과 지표
export interface PerformanceMetrics {
  highestReturn: number;
  yearlyAverage: number;
  monthlyAverage: number;
}

export const fetchPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trade/performance`);
  return response.data;
};

// 데이터 관리 함수들
export const performanceDataManager = {
  /**
   * 모든 데이타 가져오기
   */
  getData: async (): Promise<PerformanceData[]> => {
    if (typeof window === "undefined") return []

    try {
      const response = await axios.get(`${API_BASE_URL}/trade/all`)
      const trades: TradeData[] = response.data

      const performanceData: PerformanceData[] = trades.map(trade => ({
        id: `${trade.user.id}-${trade.tradeId}`,
        tradeId: trade.tradeId,
        stockName: trade.stockName,
        quantity: trade.quantity,
        buyPrice: trade.buyPrice,
        sellPrice: trade.sellPrice ?? 0,
        return: trade.sellPrice
          ? Math.round(((trade.sellPrice - trade.buyPrice) / trade.buyPrice) * 100 * 10) / 10
          : 0,
        buyDate: trade.buyDate,
        sellDate: trade.sellDate ?? "",
        createdAt: trade.createdAt,
        user: trade.user,
        isSelled: trade.isSelled,
        isShown: trade.shown
      }))

      console.log("Fetched and calculated performance data:", performanceData)
      return performanceData
    } catch (error) {
      console.error("Error fetching performance data:", error)
      return []
    }
  },

  /**
   * 모든 거래 데이터 가져오기
   */
  getAllTrades: async (): Promise<TradeData[]> => {
    if (typeof window === "undefined") return []

    try {
      const response = await axios.get(`${API_BASE_URL}/trade/all`)
      console.log("Fetched all trades:", response.data)
      return response.data || []
    } catch (error) {
      console.error("Error fetching all trades:", error)
      return []
    }
  },

  /**
   * 특정 사용자의 거래 데이터 가져오기
   */
  getUserTrades: async (userId: string): Promise<TradeData[]> => {
    if (typeof window === "undefined") return []

    try {
      const response = await axios.get(`${API_BASE_URL}/trade/user/${userId}`)
      console.log("Fetched user trades:", response.data)
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching user trades:", error)
      return []
    }
  },

  deleteUser: async (userId: number): Promise<boolean> =>{

    try{
      console.log("Deleting user with ID:", userId);
      await axios.delete(`${API_BASE_URL}/user/${userId}`)
      return true
    } catch (error){
      console.error("Error delete User", error)
      return false
    }
  },

  /**
   * 새 거래 추가
   */
  addTrade: async (tradeData: {
    user: { user_id: number }
    stockName: string
    quantity: number
    buyPrice: number
    sellPrice?: number | null
    buyDate: string
    sellDate?: string | null
  }): Promise<TradeData | null> => {
    try {
      const currentUserString = localStorage.getItem("cleverinvest_current_user");
      const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

      const payload = {
        ...tradeData,
        user: currentUser && currentUser.user_id
          ? { userId: currentUser.user_id }
          : tradeData.user,
        sellPrice: tradeData.sellPrice ?? null,
        sellDate: tradeData.sellDate ?? null,
      };

      const response = await axios.post(`${API_BASE_URL}/trade/add`, payload);

      // console.log("Added new trade:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding trade:", error);
      return null;
    }
  },

  /**
   * 거래 판매 (매도 처리)
   */
  sellTrade: async (
    tradeId: number,
    sellData: {
      sellPrice: number
      sellDate: string
    }
  ): Promise<TradeData | null> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/trade/sell/${tradeId}`, sellData)
      console.log("Trade sold:", response.data)
      return response.data
    } catch (error) {
      console.error("Error selling trade:", error)
      return null
    }
  },

  /**
   * 거래 삭제
   */
  deleteTrade: async (tradeId: number): Promise<boolean> => {
    try {
      await axios.delete(`${API_BASE_URL}/trade/${tradeId}`)
      console.log("Trade deleted:", tradeId)
      return true
    } catch (error) {
      console.error("Error deleting trade:", error)
      return false
    }
  },

  /**
   * 거래 수정
   */
  updateTrade: async (
    tradeId: number,
    updates: {
      user: { user_id: number }
      stockName?: string
      quantity?: number
      buyPrice?: number
      sellPrice?: number | null
      buyDate?: string
      sellDate?: string | null
    }
  ): Promise<TradeData | null> => {
    try {
      console.log("Updating trade with ID:", tradeId, "with updates:", updates)
      const currentUserString = localStorage.getItem("cleverinvest_current_user");
      const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

      const payload = {
        ...updates,
        user: currentUser && currentUser.user_id
          ? { userId: currentUser.user_id }
          : { userId: updates.user.user_id },
        sellPrice: updates.sellPrice ?? null,
        sellDate: updates.sellDate ?? null,
      }

      const response = await axios.put(`${API_BASE_URL}/trade/${tradeId}`, payload)
      console.log("Trade updated:", response.data)
      return response.data
    } catch (error) {
      console.error("Error updating trade:", error)
      return null
    }
  },

  /**
   * 수익률 통계 계산
   */
  getPerformanceStats: async (): Promise<{
    totalTrades: number
    totalProfit: number
    averageReturn: number
    winRate: number
  }> => {
    try {
      const performanceData = await performanceDataManager.getData()

      const totalTrades = performanceData.length
      const profitableTrades = performanceData.filter(trade => trade.return > 0).length
      const totalProfit = performanceData.reduce((sum, trade) => {
        const profit = (trade.sellPrice - trade.buyPrice) * trade.quantity
        return sum + profit
      }, 0)

      const averageReturn =
        totalTrades > 0
          ? performanceData.reduce((sum, trade) => sum + trade.return, 0) / totalTrades
          : 0

      const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0

      return {
        totalTrades,
        totalProfit: Math.round(totalProfit),
        averageReturn: Math.round(averageReturn * 10) / 10,
        winRate: Math.round(winRate * 10) / 10,
      }
    } catch (error) {
      console.error("Error calculating performance stats:", error)
      return {
        totalTrades: 0,
        totalProfit: 0,
        averageReturn: 0,
        winRate: 0,
      }
    }
  },

  toggleShow: async (tradeId: number): Promise<boolean> => {
    try {
      // 실제 API 경로는 백엔드에서 구현된 엔드포인트에 맞게 수정 필요
      const res = await axios.put(`${API_BASE_URL}/trade/toggleShow/${tradeId}`);
      console.log("Toggled show state for trade:", tradeId, res.data);
      return true;
    } catch (error) {
      console.error("Error toggling show state:", error);
      return false;
    }
  }

}
