"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown } from "lucide-react"
import type { PerformanceData } from "@/lib/performance-data"

interface MobilePerformanceCardProps {
  item: PerformanceData
}

export function MobilePerformanceCard({ item }: MobilePerformanceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm font-mono">
              {item.stockName}
            </Badge>
            <div className="flex items-center space-x-1">
              {item.return >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-lg font-bold ${item.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                {item.return >= 0 ? "+" : ""}
                {item.return}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-slate-500">매수일: {item.buyDate}</p>
            <p className="text-sm text-slate-500">매도일: {item.sellDate}</p>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">매수가격</p>
              <p className="text-sm font-semibold text-slate-900">₩{item.buyPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">매도가격</p>
              <p className="text-sm font-semibold text-slate-900">₩{item.sellPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
