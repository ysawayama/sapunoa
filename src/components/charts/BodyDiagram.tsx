"use client"

import { useEffect, useRef } from 'react'

interface NutrientData {
  nutrient: string
  bodyParts: string[]
  status: 'good' | 'warning' | 'danger'
}

interface BodyDiagramProps {
  data: NutrientData[]
}

export default function BodyDiagram({ data }: BodyDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスサイズ設定
    const width = 200
    const height = 300
    canvas.width = width
    canvas.height = height

    // 背景クリア
    ctx.clearRect(0, 0, width, height)

    // シンプルな人体図を描画
    const centerX = width / 2

    // 頭
    ctx.fillStyle = '#f3f4f6'
    ctx.beginPath()
    ctx.arc(centerX, 40, 25, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#9ca3af'
    ctx.stroke()

    // 胴体
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(centerX - 35, 65, 70, 100)
    ctx.strokeRect(centerX - 35, 65, 70, 100)

    // 腕
    ctx.fillRect(centerX - 55, 75, 20, 60)
    ctx.strokeRect(centerX - 55, 75, 20, 60)
    ctx.fillRect(centerX + 35, 75, 20, 60)
    ctx.strokeRect(centerX + 35, 75, 20, 60)

    // 脚
    ctx.fillRect(centerX - 25, 165, 20, 70)
    ctx.strokeRect(centerX - 25, 165, 20, 70)
    ctx.fillRect(centerX + 5, 165, 20, 70)
    ctx.strokeRect(centerX + 5, 165, 20, 70)

    // 部位ごとの栄養状態を表示
    const bodyPartColors: Record<string, { x: number; y: number; nutrients: NutrientData[] }> = {
      '脳': { x: centerX, y: 40, nutrients: [] },
      '目': { x: centerX, y: 30, nutrients: [] },
      '心臓': { x: centerX - 10, y: 95, nutrients: [] },
      '骨': { x: centerX + 10, y: 115, nutrients: [] },
      '筋肉': { x: centerX - 40, y: 100, nutrients: [] },
      '免疫': { x: centerX, y: 130, nutrients: [] },
    }

    // 栄養素と部位の関連付け
    data.forEach(item => {
      item.bodyParts.forEach(part => {
        if (bodyPartColors[part]) {
          bodyPartColors[part].nutrients.push(item)
        }
      })
    })

    // 部位ごとに色付け
    Object.entries(bodyPartColors).forEach(([part, info]) => {
      if (info.nutrients.length > 0) {
        // 最も悪い状態を取得
        const worstStatus = info.nutrients.reduce((worst, nutrient) => {
          if (nutrient.status === 'danger') return 'danger'
          if (nutrient.status === 'warning' && worst !== 'danger') return 'warning'
          return worst
        }, 'good' as 'good' | 'warning' | 'danger')

        // 状態に応じた色
        const color = 
          worstStatus === 'danger' ? 'rgba(239, 68, 68, 0.5)' :
          worstStatus === 'warning' ? 'rgba(245, 158, 11, 0.5)' :
          'rgba(34, 197, 94, 0.5)'

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(info.x, info.y, 8, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // ラベルを描画
    ctx.fillStyle = '#374151'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'

    Object.entries(bodyPartColors).forEach(([part, info]) => {
      if (info.nutrients.length > 0) {
        ctx.fillText(part, info.x, info.y + 20)
      }
    })
  }, [data])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">影響部位</h3>
      <div className="flex">
        <div className="flex-1">
          <canvas ref={canvasRef} className="mx-auto" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">不足栄養素の影響</h4>
          {data
            .filter(item => item.status !== 'good')
            .map((item, index) => (
              <div key={index} className="text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'danger' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="font-medium">{item.nutrient}</span>
                </div>
                <div className="ml-5 text-gray-600">
                  {item.bodyParts.join('、')}に影響
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}