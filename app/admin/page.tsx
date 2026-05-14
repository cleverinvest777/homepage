"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { usePerformanceData } from "@/hooks/use-performance-data"
import { useUserData } from "@/hooks/use-user-data"
import { useAuth } from "@/hooks/use-auth"
import { performanceDataManager, type PerformanceData } from "@/lib/performance-data"
import type { User } from "@/lib/user-data"
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  LogOut,
  UserIcon,
  Search,
  Users,
  Circle
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const {
    data: performanceData,
    isLoading: isPerformanceLoading,
    addTrade,
    updateTrade,
    loadPerformanceData,
    loadAllTrades
  } = usePerformanceData()

  const { users, isLoading: isUsersLoading, searchUserData, removeUser } = useUserData()
  const { toast } = useToast()
  const { isAuthenticated, id, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<"performance" | "users">("performance")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PerformanceData | null>(null)
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  
  const [roleFilter, setRoleFilter] = useState("all") // all, admin, user
  const [monthFilter, setMonthFilter] = useState("")  // YYYY-MM
  const [formData, setFormData] = useState({
    symbol: "",
    buyPrice: "",
    sellPrice: "",
    buyDate: "",
    sellDate: "",
  })

  // 추가: 월 상태 관리
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}` // YYYY-MM
  })

  // 현재 선택된 월의 거래만 필터링
  const filteredPerformanceData = performanceData.filter(item => {
    if (!item.buyDate) return false
    const itemMonth = item.buyDate.slice(0, 7) // YYYY-MM
    return itemMonth === selectedMonth
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (userSearchQuery.trim()) {
      const maybePromise = searchUserData(userSearchQuery)
      if (maybePromise instanceof Promise) {
        maybePromise.then(setFilteredUsers)
      } else {
        setFilteredUsers(maybePromise)
      }
    } else {
      setFilteredUsers(users)
    }
  }, [userSearchQuery, users, searchUserData])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const resetForm = () => {
    setFormData({
      symbol: "",
      buyPrice: "",
      sellPrice: "",
      buyDate: "",
      sellDate: "",
    })
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem("cleverinvest_current_user")
    localStorage.removeItem("admin_auth")
    router.push("/admin/login")
  }

  const handleAdd = async () => {
    try {
      if (!formData.symbol || !formData.buyPrice || !formData.buyDate) {
        toast({ title: "입력 오류", description: "필수 필드를 입력해주세요.", variant: "destructive" })
        return
      }

      await addTrade({
        user: { user_id: Number(id) },
        stockName: formData.symbol.toUpperCase(),
        quantity: 1,
        buyPrice: Number(formData.buyPrice),
        sellPrice: formData.sellPrice ? Number(formData.sellPrice) : undefined,
        buyDate: formData.buyDate,
        sellDate: formData.sellDate || undefined,
      })

      await loadPerformanceData()
      await loadAllTrades()

      toast({ title: "성공", description: "거래 데이터가 추가되었습니다." })
      resetForm()
      setIsAddDialogOpen(false)
    } catch {
      toast({ title: "오류", description: "데이터 추가 중 오류가 발생했습니다.", variant: "destructive" })
    }
  }

  const handleEdit = (item: PerformanceData) => {
    setEditingItem(item)
    setFormData({
      symbol: item.stockName,
      buyPrice: item.buyPrice.toString(),
      sellPrice: item.sellPrice.toString(),
      buyDate: item.buyDate,
      sellDate: item.sellDate,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingItem) return
    try {
      if (!formData.symbol || !formData.buyPrice || !formData.sellPrice || !formData.buyDate || !formData.sellDate) {
        toast({ title: "입력 오류", description: "모든 필드를 입력해주세요.", variant: "destructive" })
        return
      }

      const currentUser = JSON.parse(localStorage.getItem("cleverinvest_current_user") || "{}")
      if (!currentUser?.user_id) {
        toast({ title: "사용자 오류", description: "로그인된 사용자를 찾을 수 없습니다.", variant: "destructive" })
        return
      }

      await updateTrade(Number(editingItem.tradeId), {
        user: { user_id: currentUser.user_id },
        stockName: formData.symbol,
        buyPrice: Number(formData.buyPrice),
        sellPrice: Number(formData.sellPrice),
        buyDate: formData.buyDate,
        sellDate: formData.sellDate,
      })

      await loadPerformanceData()
      await loadAllTrades()

      toast({ title: "성공", description: "거래 데이터가 수정되었습니다." })
      resetForm()
      setIsEditDialogOpen(false)
      setEditingItem(null)
    } catch {
      toast({ title: "오류", description: "거래 수정 중 오류가 발생했습니다.", variant: "destructive" })
    }
  }

  const handleDelete = async (tradeId: number, symbol: string) => {
    try {
      const success = await performanceDataManager.deleteTrade(tradeId)
      if (success) {
        await loadPerformanceData()
        await loadAllTrades()
        toast({ title: "성공", description: `${symbol} 거래가 삭제되었습니다.` })
      } else {
        toast({ title: "오류", description: "삭제에 실패했습니다.", variant: "destructive" })
      }
    } catch {
      toast({ title: "오류", description: "삭제 중 오류가 발생했습니다.", variant: "destructive" })
    }
  }

  const handleToggleShow = async (tradeId: number) => {
    try {
      const success = await performanceDataManager.toggleShow(tradeId)
      if (success) {
        await loadPerformanceData()
        await loadAllTrades()
      }
    } catch {
      console.error("Failed to toggle show")
    }
  }

  const handleDeleteUser = async (userId: number, username: string) => {
    try {
      const success = await performanceDataManager.deleteUser(userId)
      if (success) {

        toast({ title: "성공", description: `${username} 님이 삭제되었습니다.` })
      } else {
        toast({ title: "오류", description: "삭제에 실패했습니다.", variant: "destructive" })
      }
    } catch {
      toast({ title: "오류", description: "삭제 중 오류가 발생했습니다.", variant: "destructive" })
    }
  }

  const filteredSearchUsers = filteredUsers.filter(user => {
    const matchesSearch =
      user.username?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.id?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.phoneNumber?.includes(userSearchQuery)

    const matchesRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter

    const matchesMonth =
      !monthFilter || new Date(user.createdAt).toISOString().slice(0, 7) === monthFilter

    return matchesSearch && matchesRole && matchesMonth
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>홈으로 돌아가기</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">CleverInvest 관리자</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <UserIcon className="w-4 h-4" />
                <span className="text-sm">{id}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "performance"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              수익률 관리
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              회원 관리
            </button>
          </div>
        </div>

        {activeTab === "performance" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">수익률 데이터 관리</h1>
              <p className="text-slate-600">투자 성과 데이터를 추가, 수정, 삭제할 수 있습니다.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">총 거래 건수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{performanceData.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">평균 수익률</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +
                    {performanceData.length > 0
                      ? (
                          performanceData.reduce((sum, item) => sum + item.return, 0) /
                          performanceData.length
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">최고 수익률</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    +
                    {performanceData.length > 0
                      ? Math.max(...performanceData.map((item) => item.return)).toFixed(1)
                      : 0}
                    %
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">거래 내역</h2>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="month" className="text-sm text-slate-600">월 선택(매수 기준):</label>
                <input
                  type="month"
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 text-sm"
                />
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    새 거래 추가
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>새 거래 추가</DialogTitle>
                    <DialogDescription>새로운 투자 성과 데이터를 입력하세요.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="symbol">종목명</Label>
                      <Input
                        id="symbol"
                        placeholder="예: AAPL"
                        value={formData.symbol}
                        onChange={(e) => setFormData((prev) => ({ ...prev, symbol: e.target.value }))}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="buyPrice">매수가격 (원)</Label>
                      <Input
                        id="buyPrice"
                        type="number"
                        placeholder="예: 150000"
                        value={formData.buyPrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, buyPrice: e.target.value }))}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="sellPrice">매도가격 (원)</Label>
                      <Input
                        id="sellPrice"
                        type="number"
                        placeholder="예: 180000"
                        value={formData.sellPrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sellPrice: e.target.value }))}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="buyDate">매수일</Label>
                      <Input
                        id="buyDate"
                        type="date"
                        value={formData.buyDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, buyDate: e.target.value }))}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="sellDate">매도일</Label>
                      <Input
                        id="sellDate"
                        type="date"
                        value={formData.sellDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sellDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm()
                        setIsAddDialogOpen(false)
                      }}
                    >
                      취소
                    </Button>
                    <Button onClick={handleAdd}>추가</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Data Table */}
            {isPerformanceLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">데이터를 불러오는 중...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPerformanceData.map((item, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="text-sm font-mono">
                            {item.stockName}
                          </Badge>
                          <div>
                            <p className="text-sm text-slate-500">매수일: {item.buyDate}</p>
                            <p className="text-sm text-slate-500">매도일: {item.sellDate}</p>
                            <p className="text-xs text-slate-400">
                              등록일: {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                          <div className="text-center sm:text-left">
                            <p className="text-sm text-slate-500">매수가격</p>
                            <p className="text-lg font-semibold text-slate-900">
                              ₩{item.buyPrice.toLocaleString()}
                            </p>
                          </div>

                          <div className="text-center sm:text-left">
                            <p className="text-sm text-slate-500">매도가격</p>
                            <p className="text-lg font-semibold text-slate-900">
                              ₩{item.sellPrice.toLocaleString()}
                            </p>
                          </div>

                          <div className="text-center sm:text-left">
                            <p className="text-sm text-slate-500">수익률</p>
                            <div className="flex items-center justify-center sm:justify-start space-x-1">
                              {item.return >= 0 ? (
                                <ArrowUp className="w-4 h-4 text-green-600" />
                              ) : (
                                <ArrowDown className="w-4 h-4 text-red-600" />
                              )}
                              <p
                                className={`text-lg font-bold ${
                                  item.return >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {item.return >= 0 ? "+" : ""}
                                {item.return}%
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 bg-transparent"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {item.stockName} 거래 데이터를 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.tradeId, item.stockName)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    삭제
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <button
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                item.isShown ? "bg-green-500" : "bg-red-500"
                              }`}
                              onClick={() => {
                                handleToggleShow(item.tradeId)
                                console.log("shown", item.isShown, item.tradeId)
                              }}
                              title={item.isShown ? "보임 상태 (켬)" : "숨김 상태 (끔)"}
                            >
                              <Circle className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>거래 데이터 수정</DialogTitle>
                  <DialogDescription>투자 성과 데이터를 수정하세요.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-symbol">종목명</Label>
                    <Input
                      id="edit-symbol"
                      placeholder="예: AAPL"
                      value={formData.symbol}
                      onChange={(e) => setFormData((prev) => ({ ...prev, symbol: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-buyPrice">매수가격 (원)</Label>
                    <Input
                      id="edit-buyPrice"
                      type="number"
                      placeholder="예: 150000"
                      value={formData.buyPrice}
                      onChange={(e) => setFormData((prev) => ({ ...prev, buyPrice: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-sellPrice">매도가격 (원)</Label>
                    <Input
                      id="edit-sellPrice"
                      type="number"
                      placeholder="예: 180000"
                      value={formData.sellPrice}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sellPrice: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-buyDate">매수일</Label>
                    <Input
                      id="edit-buyDate"
                      type="date"
                      value={formData.buyDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, buyDate: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-sellDate">매도일</Label>
                    <Input
                      id="edit-sellDate"
                      type="date"
                      value={formData.sellDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sellDate: e.target.value }))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsEditDialogOpen(false)
                      setEditingItem(null)
                    }}
                  >
                    취소
                  </Button>
                  <Button onClick={handleUpdate}>수정</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {activeTab === "users" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">회원 관리</h1>
              <p className="text-slate-600">등록된 회원을 조회하고 관리할 수 있습니다.</p>
            </div>

            {/* 회원 통계 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">총 회원 수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{users.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">인증된 회원</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter((user) => user.isVerified).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">최근 가입</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {users.filter((user) => {
                      const oneWeekAgo = new Date()
                      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
                      return new Date(user.createdAt) > oneWeekAgo
                    }).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 검색 */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">회원 목록</h2>
              <div className="flex items-center gap-4">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value="all">전체</option>
                  <option value="admin">관리자</option>
                  <option value="user">사용자</option>
                </select>

                <input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 text-sm"
                />

                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="이름, 아이디, 전화번호로 검색..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
            </div>

            {/* 회원 목록 */}
            {isUsersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">회원 데이터를 불러오는 중...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredUsers.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-slate-500">{userSearchQuery ? "검색 결과가 없습니다." : "등록된 회원이 없습니다."}</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredSearchUsers.map((user, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-slate-900">{user.username}</h3>
                                {user.isVerified && (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                    인증완료
                                  </Badge>
                                )}
                                {user.role.toLocaleLowerCase() === "admin" && (
                                  <Badge className="text-xs bg-purple-100 text-purple-700">관리자</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-500">@{user.username}</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                            <div className="text-center sm:text-left">
                              <p className="text-sm text-slate-500">전화번호</p>
                              <p className="text-sm font-medium text-slate-900">{user.phoneNumber}</p>
                            </div>

                            <div className="text-center sm:text-left">
                              <p className="text-sm text-slate-500">가입일</p>
                              <p className="text-sm font-medium text-slate-900">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            {(
                              <div className="flex items-center space-x-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 bg-transparent"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>회원을 삭제하시겠습니까?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {user.username}님의 계정을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>취소</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUser(user.userId, user.username)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        삭제
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
