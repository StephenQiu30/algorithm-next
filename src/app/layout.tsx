import './globals.css'
import { Footer } from '@/components/footer/footer'
import React from 'react'
import { RootProviders } from '@/components/providers/root-providers'
import { SiteHeader } from '@/components/header/site-header'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

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
    <html lang="zh-CN" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
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
