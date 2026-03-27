import './globals.css'
import { Footer } from '@/components/footer/footer'
import React from 'react'
import { RootProviders } from '@/components/providers/root-providers'
import { SiteHeader } from '@/components/header/site-header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '排序可视化课堂',
  description: '面向排序算法教学的交互式可视化课堂。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <RootProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </RootProviders>
      </body>
    </html>
  )
}
