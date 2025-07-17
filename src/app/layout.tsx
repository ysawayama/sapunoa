import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sapunoa - パーソナライズド健康サプリメント',
  description: '血液検査・尿検査結果に基づく最適サプリメント提案・販売サービス',
  keywords: 'サプリメント, 健康, 血液検査, 尿検査, パーソナライズド',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}