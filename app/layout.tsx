import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "CleverInvest - 스마트한 투자, 확실한 수익",
  description:
    "체계적이고 전문적인 투자 서비스를 제공하는 CleverInvest입니다. 데이터 기반의 투자 전략으로 안정적인 수익을 실현합니다.",
  generator: "v0.app",
  keywords: "투자, 자산관리, 포트폴리오, 수익률, 투자회사, 중소기업",
  authors: [{ name: "CleverInvest" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          {children}
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
