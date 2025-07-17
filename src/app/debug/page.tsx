'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setMounted(true)
      console.log('Debug page mounted successfully')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      console.error('Error in debug page:', e)
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">デバッグページ</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">マウント状態:</p>
          <p>{mounted ? '✅ マウント済み' : '❌ 未マウント'}</p>
        </div>

        {error && (
          <div className="bg-red-100 p-4 rounded">
            <p className="font-semibold text-red-600">エラー:</p>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="bg-blue-100 p-4 rounded">
          <p className="font-semibold">Tailwind CSS テスト:</p>
          <p className="text-blue-600">この背景が青色なら、Tailwindは正常に動作しています</p>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <p className="font-semibold">環境変数:</p>
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  )
}