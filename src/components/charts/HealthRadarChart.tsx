"use client"

import { useEffect, useRef } from 'react'

interface HealthData {
  label: string
  value: number // 0-100
  status: 'good' | 'warning' | 'danger'
}

interface HealthRadarChartProps {
  data: HealthData[]
  showLegend?: boolean
}

export default function HealthRadarChart({ data, showLegend = true }: HealthRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスサイズ設定
    const size = 280
    canvas.width = size
    canvas.height = size
    
    const centerX = size / 2
    const centerY = size / 2
    const chartRadius = 90

    // 背景クリア
    ctx.clearRect(0, 0, size, size)

    // データポイント数
    const dataCount = data.length
    const angleStep = (Math.PI * 2) / dataCount

    // 背景の同心円を描画
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (chartRadius / 5) * i, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 軸線を描画
    ctx.strokeStyle = '#e5e7eb'
    data.forEach((_, i) => {
      const angle = angleStep * i - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + Math.cos(angle) * chartRadius,
        centerY + Math.sin(angle) * chartRadius
      )
      ctx.stroke()
    })

    // データポリゴンを描画
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)' // green-500 with opacity
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2

    ctx.beginPath()
    data.forEach((item, i) => {
      const angle = angleStep * i - Math.PI / 2
      const value = (item.value / 100) * chartRadius
      const x = centerX + Math.cos(angle) * value
      const y = centerY + Math.sin(angle) * value
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // データポイントを描画
    data.forEach((item, i) => {
      const angle = angleStep * i - Math.PI / 2
      const value = (item.value / 100) * chartRadius
      const x = centerX + Math.cos(angle) * value
      const y = centerY + Math.sin(angle) * value

      // ポイントの色を状態に応じて変更
      ctx.fillStyle = item.status === 'good' ? '#22c55e' : 
                      item.status === 'warning' ? '#f59e0b' : '#ef4444'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // ラベルを描画
    ctx.fillStyle = '#374151'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    data.forEach((item, i) => {
      const angle = angleStep * i - Math.PI / 2
      const labelRadius = chartRadius + 30
      const x = centerX + Math.cos(angle) * labelRadius
      const y = centerY + Math.sin(angle) * labelRadius

      // ラベル背景（状態に応じた色）
      const bgColor = item.status === 'good' ? 'rgba(34, 197, 94, 0.1)' : 
                      item.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'
      const borderColor = item.status === 'good' ? '#22c55e' : 
                         item.status === 'warning' ? '#f59e0b' : '#ef4444'
      
      const metrics = ctx.measureText(item.label)
      const padding = 6
      const boxWidth = metrics.width + padding * 2
      const boxHeight = 28
      
      // 角度に応じてボックスの位置を調整
      let boxX = x - boxWidth / 2
      let boxY = y - boxHeight / 2
      
      // 背景ボックス（角丸長方形を手動で描画）
      ctx.fillStyle = bgColor
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      
      const cornerRadius = 4
      ctx.beginPath()
      ctx.moveTo(boxX + cornerRadius, boxY)
      ctx.lineTo(boxX + boxWidth - cornerRadius, boxY)
      ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + cornerRadius)
      ctx.lineTo(boxX + boxWidth, boxY + boxHeight - cornerRadius)
      ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - cornerRadius, boxY + boxHeight)
      ctx.lineTo(boxX + cornerRadius, boxY + boxHeight)
      ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - cornerRadius)
      ctx.lineTo(boxX, boxY + cornerRadius)
      ctx.quadraticCurveTo(boxX, boxY, boxX + cornerRadius, boxY)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // ラベルテキスト
      ctx.fillStyle = '#374151'
      ctx.font = '11px sans-serif'
      ctx.fillText(item.label, x, y - 4)

      // 値を表示
      ctx.fillStyle = item.status === 'good' ? '#16a34a' : 
                      item.status === 'warning' ? '#d97706' : '#dc2626'
      ctx.font = '10px sans-serif'
      ctx.fillText(`${item.value}%`, x, y + 8)
    })
  }, [data])

  return (
    <div className="relative">
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      
      {/* 凡例 */}
      {showLegend && (
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">良好</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">要注意</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">不足</span>
          </div>
        </div>
      )}
    </div>
  )
}