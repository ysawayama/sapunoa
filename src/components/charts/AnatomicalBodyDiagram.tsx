"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface NutrientData {
  nutrient: string
  bodyParts: string[]
  status: 'good' | 'warning' | 'danger'
}

interface AnatomicalBodyDiagramProps {
  data: NutrientData[]
  gender?: 'male' | 'female'
  onGenderChange?: (gender: 'male' | 'female') => void
}

// 体の部位と座標のマッピング（相対的な位置 0-100%）
const bodyPartsCoordinates = {
  male: {
    // 体内の臓器
    '脳': { x: 50, y: 7, inside: true },
    '目': { x: 50, y: 9, inside: true },
    '甲状腺': { x: 50, y: 15, inside: true },
    '心臓': { x: 45, y: 23, inside: true },
    '肺': { x: 50, y: 21, inside: true },
    '肝臓': { x: 56, y: 30, inside: true },
    '胃': { x: 44, y: 32, inside: true },
    '膵臓': { x: 50, y: 34, inside: true },
    '腎臓': { x: 50, y: 36, inside: true },
    '腸': { x: 50, y: 40, inside: true },
    '筋肉': { x: 65, y: 45, inside: true },
    '骨': { x: 35, y: 60, inside: true },
    '血管': { x: 70, y: 50, inside: true },
    '神経': { x: 30, y: 50, inside: true },
    '免疫': { x: 50, y: 45, inside: true },
  },
  female: {
    // 体内の臓器
    '脳': { x: 50, y: 7, inside: true },
    '目': { x: 50, y: 9, inside: true },
    '甲状腺': { x: 50, y: 15, inside: true },
    '心臓': { x: 45, y: 23, inside: true },
    '肺': { x: 50, y: 21, inside: true },
    '肝臓': { x: 56, y: 30, inside: true },
    '胃': { x: 44, y: 32, inside: true },
    '膵臓': { x: 50, y: 34, inside: true },
    '腎臓': { x: 50, y: 36, inside: true },
    '腸': { x: 50, y: 40, inside: true },
    '子宮': { x: 50, y: 45, inside: true },
    '筋肉': { x: 65, y: 45, inside: true },
    '骨': { x: 35, y: 60, inside: true },
    '血管': { x: 70, y: 50, inside: true },
    '神経': { x: 30, y: 50, inside: true },
    '免疫': { x: 50, y: 42, inside: true },
  }
}

// 画像内の臓器アイコンの位置（画像に基づいて調整）
const organIconPositions = {
  male: {
    // 左側のアイコン
    'THYROID': { x: 15, y: 12, label: '甲状腺', organKey: '甲状腺' },
    'LUNGS': { x: 15, y: 23, label: '肺', organKey: '肺' },
    'LIVER': { x: 15, y: 34, label: '肝臓', organKey: '肝臓' },
    'PANCREAS': { x: 15, y: 45, label: '膵臓', organKey: '膵臓' },
    'INTESTINES': { x: 15, y: 56, label: '腸', organKey: '腸' },
    'MALE_REPRODUCTIVE': { x: 15, y: 67, label: '男性生殖器', organKey: '男性生殖器' },
    // 右側のアイコン
    'BRAIN': { x: 85, y: 12, label: '脳', organKey: '脳' },
    'HEART': { x: 85, y: 23, label: '心臓', organKey: '心臓' },
    'SPLIN': { x: 85, y: 34, label: '脾臓', organKey: '脾臓' },
    'STOMACH': { x: 85, y: 45, label: '胃', organKey: '胃' },
    'KIDNEYS': { x: 85, y: 56, label: '腎臓', organKey: '腎臓' },
    'BLADDER': { x: 85, y: 67, label: '膀胱', organKey: '膀胱' },
  },
  female: {
    // 左側のアイコン
    'THYROID': { x: 15, y: 12, label: '甲状腺', organKey: '甲状腺' },
    'LUNGS': { x: 15, y: 23, label: '肺', organKey: '肺' },
    'LIVER': { x: 15, y: 34, label: '肝臓', organKey: '肝臓' },
    'PANCREAS': { x: 15, y: 45, label: '膵臓', organKey: '膵臓' },
    'INTESTINES': { x: 15, y: 56, label: '腸', organKey: '腸' },
    'FEMALE_REPRODUCTIVE': { x: 15, y: 67, label: '女性生殖器', organKey: '子宮' },
    // 右側のアイコン
    'BRAIN': { x: 85, y: 12, label: '脳', organKey: '脳' },
    'HEART': { x: 85, y: 23, label: '心臓', organKey: '心臓' },
    'SPLIN': { x: 85, y: 34, label: '脾臓', organKey: '脾臓' },
    'STOMACH': { x: 85, y: 45, label: '胃', organKey: '胃' },
    'KIDNEYS': { x: 85, y: 56, label: '腎臓', organKey: '腎臓' },
    'BLADDER': { x: 85, y: 67, label: '膀胱', organKey: '膀胱' },
  }
}

export default function AnatomicalBodyDiagram({ data, gender = 'male', onGenderChange }: AnatomicalBodyDiagramProps) {
  const [highlightedParts, setHighlightedParts] = useState<Map<string, NutrientData[]>>(new Map())

  useEffect(() => {
    // 部位ごとに影響する栄養素をグループ化
    const partsMap = new Map<string, NutrientData[]>()
    
    data.forEach(item => {
      item.bodyParts.forEach(part => {
        if (!partsMap.has(part)) {
          partsMap.set(part, [])
        }
        partsMap.get(part)?.push(item)
      })
    })
    
    setHighlightedParts(partsMap)
  }, [data])

  const coordinates = bodyPartsCoordinates[gender]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">影響部位</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => onGenderChange?.('male')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            男性
          </button>
          <button 
            onClick={() => onGenderChange?.('female')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            女性
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* 人体図 */}
        <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
          {/* 画像を表示 */}
          <Image
            src={gender === 'male' ? '/images/anatomical-chart-male.png' : '/images/anatomical-chart-female.png'}
            alt={`${gender === 'male' ? '男性' : '女性'}の人体図`}
            width={320}
            height={480}
            className="w-full h-auto"
            priority
          />
          
          {/* 影響部位のハイライト（オーバーレイ） */}
          <div className="absolute inset-0">
            {/* 周囲の臓器アイコンのハイライト */}
            {Object.entries(organIconPositions[gender]).map(([key, iconData]) => {
              // このアイコンに対応する体内の臓器が影響を受けているかチェック
              const isAffected = highlightedParts.has(iconData.organKey)
              if (!isAffected) return null
              
              const nutrients = highlightedParts.get(iconData.organKey) || []
              
              // 最も悪い状態を取得
              const worstStatus = nutrients.reduce((worst, nutrient) => {
                if (nutrient.status === 'danger') return 'danger'
                if (nutrient.status === 'warning' && worst !== 'danger') return 'warning'
                return worst
              }, 'good' as 'good' | 'warning' | 'danger')
              
              const color = worstStatus === 'danger' ? 'bg-red-500' : 
                           worstStatus === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
              const shadowColor = worstStatus === 'danger' ? 'rgba(239, 68, 68, 0.6)' : 
                                 worstStatus === 'warning' ? 'rgba(245, 158, 11, 0.6)' : 
                                 'rgba(34, 197, 94, 0.6)'
              
              return (
                <div key={key} className="absolute" style={{
                  left: `${iconData.x}%`,
                  top: `${iconData.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}>
                  {/* 外側の大きなパルス */}
                  <div className={`absolute w-10 h-10 rounded-full ${color} opacity-10 animate-pulse`}
                       style={{ 
                         transform: 'translate(-50%, -50%)',
                         left: '50%',
                         top: '50%',
                         animationDuration: '3s'
                       }}></div>
                  
                  {/* 中間のパルス */}
                  <div className={`absolute w-8 h-8 rounded-full ${color} opacity-20 animate-ping`}
                       style={{ 
                         transform: 'translate(-50%, -50%)',
                         left: '50%',
                         top: '50%',
                         animationDuration: '2s'
                       }}></div>
                  
                  {/* グロー効果 */}
                  <div className="absolute w-6 h-6 rounded-full"
                       style={{ 
                         transform: 'translate(-50%, -50%)',
                         left: '50%',
                         top: '50%',
                         boxShadow: `0 0 15px ${shadowColor}`,
                         animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                       }}></div>
                </div>
              )
            })}
            
            {/* 体内の臓器のハイライト */}
            {Array.from(highlightedParts.entries()).map(([part, nutrients]) => {
              const coord = coordinates[part]
              if (!coord || !coord.inside) return null  // 体内の臓器のみ処理
              
              // 最も悪い状態を取得
              const worstStatus = nutrients.reduce((worst, nutrient) => {
                if (nutrient.status === 'danger') return 'danger'
                if (nutrient.status === 'warning' && worst !== 'danger') return 'warning'
                return worst
              }, 'good' as 'good' | 'warning' | 'danger')
              
              const color = worstStatus === 'danger' ? 'bg-red-500' : 
                           worstStatus === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
              
              return (
                <div key={part} className="absolute" style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}>
                  {/* 外側の大きなパルス */}
                  <div className={`absolute w-8 h-8 rounded-full ${color} opacity-15 animate-pulse`}
                       style={{ 
                         transform: 'translate(-50%, -50%)',
                         left: '50%',
                         top: '50%'
                       }}></div>
                  
                  {/* 中間のパルス */}
                  <div className={`absolute w-6 h-6 rounded-full ${color} opacity-25 animate-ping`}
                       style={{ 
                         transform: 'translate(-50%, -50%)',
                         left: '50%',
                         top: '50%',
                         animationDuration: '2s'
                       }}></div>
                  
                  {/* 中心のドット */}
                  <div
                    className={`relative w-3 h-3 rounded-full ${color}`}
                    style={{
                      boxShadow: `0 0 20px ${
                        worstStatus === 'danger' ? 'rgba(239, 68, 68, 0.8)' : 
                        worstStatus === 'warning' ? 'rgba(245, 158, 11, 0.8)' : 
                        'rgba(34, 197, 94, 0.8)'
                      }`
                    }}
                  ></div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 栄養素の影響リスト（下部4行） */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 text-center mb-3">不足している栄養素と影響部位</h4>
          <div className="grid grid-cols-1 gap-2">
            {data
              .filter(item => item.status !== 'good')
              .slice(0, 4)
              .map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.status === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <div className={`w-4 h-4 rounded-full ${
                      item.status === 'danger' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{item.nutrient}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'danger' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status === 'danger' ? '不足' : '要注意'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">影響：</span>
                      {item.bodyParts.map((part, i) => (
                        <span key={i} className="inline-flex items-center">
                          <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mx-1"></span>
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {/* 説明文 */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-gray-700 leading-relaxed">
              <span className="font-medium text-blue-700">※ </span>
              早期の栄養改善で健康な体を維持しましょう
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}