'use client'

import { useState } from 'react'

export default function ClientTestPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">クライアントコンポーネントテスト</h1>
      <p className="text-lg mb-4">カウント: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        カウントアップ
      </button>
    </div>
  )
}