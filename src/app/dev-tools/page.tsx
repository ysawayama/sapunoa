"use client"

import { useState, useEffect } from "react"

export default function DevToolsPage() {
  const [viewportSize, setViewportSize] = useState('mobile')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [currentUrl, setCurrentUrl] = useState('/dashboard')

  const devices = {
    mobile: { width: 375, height: 667, name: 'iPhone SE' },
    mobileL: { width: 414, height: 896, name: 'iPhone 11 Pro' },
    tablet: { width: 768, height: 1024, name: 'iPad' },
    desktop: { width: 1366, height: 768, name: 'Desktop' }
  }

  const handleViewportChange = (size: string) => {
    setViewportSize(size)
  }

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')
  }

  const device = devices[viewportSize as keyof typeof devices]
  const width = orientation === 'portrait' ? device.width : device.height
  const height = orientation === 'portrait' ? device.height : device.width

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ツールバー */}
      <div className="bg-white border-b shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">📱 モバイル開発ビュー</h1>
          
          <div className="flex items-center gap-4">
            {/* デバイス選択 */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">デバイス:</label>
              <select 
                value={viewportSize}
                onChange={(e) => handleViewportChange(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="mobile">iPhone SE (375×667)</option>
                <option value="mobileL">iPhone 11 Pro (414×896)</option>
                <option value="tablet">iPad (768×1024)</option>
                <option value="desktop">Desktop (1366×768)</option>
              </select>
            </div>

            {/* 向き切り替え */}
            <button
              onClick={toggleOrientation}
              className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition-colors"
            >
              🔄 {orientation === 'portrait' ? '横向き' : '縦向き'}に切り替え
            </button>

            {/* URL入力 */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">URL:</label>
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* デバイスビュー */}
      <div className="flex items-center justify-center p-8">
        <div className="relative">
          {/* デバイスフレーム */}
          <div 
            className="bg-gray-800 rounded-3xl p-4 shadow-2xl"
            style={{ width: `${width + 32}px` }}
          >
            {/* ノッチ（iPhone風） */}
            {viewportSize.includes('mobile') && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl"></div>
            )}
            
            {/* スクリーン */}
            <div 
              className="bg-white rounded-2xl overflow-hidden"
              style={{ 
                width: `${width}px`, 
                height: `${height}px` 
              }}
            >
              <iframe
                src={currentUrl}
                className="w-full h-full"
                style={{ 
                  width: `${width}px`, 
                  height: `${height}px` 
                }}
              />
            </div>

            {/* ホームインジケーター（iPhone風） */}
            {viewportSize.includes('mobile') && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
            )}
          </div>

          {/* デバイス情報 */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-sm text-gray-600">{device.name}</p>
            <p className="text-xs text-gray-500">{width} × {height}px</p>
          </div>
        </div>
      </div>

      {/* クイックリンク */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-sm font-medium mb-2">クイックアクセス</h3>
        <div className="space-y-1">
          <button 
            onClick={() => setCurrentUrl('/')}
            className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
          >
            🏠 ホーム
          </button>
          <button 
            onClick={() => setCurrentUrl('/quick-login')}
            className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
          >
            🚀 クイックログイン
          </button>
          <button 
            onClick={() => setCurrentUrl('/dashboard')}
            className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
          >
            📊 ダッシュボード
          </button>
          <button 
            onClick={() => setCurrentUrl('/demo')}
            className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
          >
            🎭 デモ
          </button>
        </div>
      </div>
    </div>
  )
}