"use client"

interface NutrientStatus {
  name: string
  value: number // 0-100
  status: 'good' | 'warning' | 'danger'
  category: 'ビタミン' | 'ミネラル' | 'その他'
}

interface NutrientHeatmapProps {
  nutrients: NutrientStatus[]
}

export default function NutrientHeatmap({ nutrients }: NutrientHeatmapProps) {
  // カテゴリごとに分類
  const categorized = nutrients.reduce((acc, nutrient) => {
    if (!acc[nutrient.category]) acc[nutrient.category] = []
    acc[nutrient.category].push(nutrient)
    return acc
  }, {} as Record<string, NutrientStatus[]>)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-700 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'danger': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getBarColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'danger': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">栄養素ステータス</h3>
      
      {Object.entries(categorized).map(([category, items]) => (
        <div key={category} className="mb-6 last:mb-0">
          <h4 className="text-sm font-medium text-gray-600 mb-3">{category}</h4>
          <div className="grid grid-cols-2 gap-3">
            {items.map((nutrient, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(nutrient.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{nutrient.name}</span>
                  <span className="text-xs">{nutrient.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getBarColor(nutrient.status)}`}
                    style={{ width: `${nutrient.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 凡例 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-gray-600">正常 (70%以上)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-gray-600">要注意 (50-69%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-gray-600">不足 (50%未満)</span>
          </div>
        </div>
      </div>
    </div>
  )
}