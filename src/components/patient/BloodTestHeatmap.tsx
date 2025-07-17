import React, { useState } from 'react';

interface BloodTestItem {
  name: string;
  nameEn: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: 'normal' | 'low' | 'high' | 'critical-low' | 'critical-high';
  category: string;
}

const bloodTestData: BloodTestItem[] = [
  // 血球系
  { name: '赤血球数', nameEn: 'RBC', value: 450, unit: '万/μL', min: 400, max: 550, status: 'normal', category: '血球系' },
  { name: 'ヘモグロビン', nameEn: 'HGB', value: 13.5, unit: 'g/dL', min: 13.0, max: 17.0, status: 'normal', category: '血球系' },
  { name: 'ヘマトクリット', nameEn: 'HCT', value: 38, unit: '%', min: 40, max: 52, status: 'low', category: '血球系' },
  { name: '血小板数', nameEn: 'PLT', value: 15, unit: '万/μL', min: 15, max: 40, status: 'normal', category: '血球系' },
  { name: '白血球数', nameEn: 'WBC', value: 5500, unit: '/μL', min: 4000, max: 9000, status: 'normal', category: '血球系' },
  
  // 栄養・代謝
  { name: '総蛋白', nameEn: 'TP', value: 6.8, unit: 'g/dL', min: 6.5, max: 8.0, status: 'normal', category: '栄養・代謝' },
  { name: 'アルブミン', nameEn: 'ALB', value: 3.8, unit: 'g/dL', min: 4.0, max: 5.0, status: 'low', category: '栄養・代謝' },
  { name: '血糖値', nameEn: 'GLU', value: 98, unit: 'mg/dL', min: 70, max: 110, status: 'normal', category: '栄養・代謝' },
  { name: 'HbA1c', nameEn: 'HbA1c', value: 5.6, unit: '%', min: 4.3, max: 5.8, status: 'normal', category: '栄養・代謝' },
  
  // 脂質
  { name: '総コレステロール', nameEn: 'T-CHO', value: 185, unit: 'mg/dL', min: 140, max: 220, status: 'normal', category: '脂質' },
  { name: 'HDLコレステロール', nameEn: 'HDL-C', value: 45, unit: 'mg/dL', min: 40, max: 90, status: 'normal', category: '脂質' },
  { name: 'LDLコレステロール', nameEn: 'LDL-C', value: 130, unit: 'mg/dL', min: 70, max: 140, status: 'normal', category: '脂質' },
  { name: '中性脂肪', nameEn: 'TG', value: 180, unit: 'mg/dL', min: 50, max: 150, status: 'high', category: '脂質' },
  
  // 肝機能
  { name: 'AST(GOT)', nameEn: 'AST', value: 25, unit: 'U/L', min: 10, max: 40, status: 'normal', category: '肝機能' },
  { name: 'ALT(GPT)', nameEn: 'ALT', value: 22, unit: 'U/L', min: 5, max: 45, status: 'normal', category: '肝機能' },
  { name: 'γ-GTP', nameEn: 'γ-GTP', value: 58, unit: 'U/L', min: 10, max: 50, status: 'high', category: '肝機能' },
  
  // 腎機能
  { name: '尿素窒素', nameEn: 'BUN', value: 18, unit: 'mg/dL', min: 8, max: 20, status: 'normal', category: '腎機能' },
  { name: 'クレアチニン', nameEn: 'CRE', value: 0.9, unit: 'mg/dL', min: 0.6, max: 1.1, status: 'normal', category: '腎機能' },
  { name: '尿酸', nameEn: 'UA', value: 7.5, unit: 'mg/dL', min: 3.0, max: 7.0, status: 'high', category: '腎機能' },
  
  // ミネラル・鉄
  { name: '血清鉄', nameEn: 'Fe', value: 60, unit: 'μg/dL', min: 70, max: 170, status: 'low', category: 'ミネラル' },
  { name: 'フェリチン', nameEn: 'Ferritin', value: 25, unit: 'ng/mL', min: 30, max: 300, status: 'low', category: 'ミネラル' },
  { name: 'カルシウム', nameEn: 'Ca', value: 9.2, unit: 'mg/dL', min: 8.5, max: 10.5, status: 'normal', category: 'ミネラル' },
  
  // 炎症・免疫
  { name: 'CRP', nameEn: 'CRP', value: 0.15, unit: 'mg/dL', min: 0, max: 0.3, status: 'normal', category: '炎症' },
  { name: 'リウマチ因子', nameEn: 'RF', value: 8, unit: 'IU/mL', min: 0, max: 20, status: 'normal', category: '炎症' },
];

export default function BloodTestHeatmap() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', ...Array.from(new Set(bloodTestData.map(item => item.category)))];
  
  const filteredData = selectedCategory === 'all' 
    ? bloodTestData 
    : bloodTestData.filter(item => item.category === selectedCategory);
  
  const getColorByStatus = (status: string, value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    if (status === 'normal') {
      // 正常範囲内でも値によってグラデーション
      if (percentage >= 40 && percentage <= 60) {
        return 'from-emerald-400 to-emerald-500 text-white shadow-emerald-500/30';
      } else if (percentage >= 30 && percentage <= 70) {
        return 'from-green-400 to-green-500 text-white shadow-green-500/30';
      } else {
        return 'from-lime-400 to-lime-500 text-white shadow-lime-500/30';
      }
    } else if (status === 'low') {
      return 'from-amber-400 to-orange-500 text-white shadow-orange-500/30';
    } else if (status === 'high') {
      return 'from-orange-400 to-red-500 text-white shadow-red-500/30';
    } else if (status === 'critical-low') {
      return 'from-red-500 to-red-600 text-white shadow-red-600/40';
    } else if (status === 'critical-high') {
      return 'from-red-600 to-red-700 text-white shadow-red-700/40';
    }
    return 'from-gray-300 to-gray-400 text-gray-700';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'low': return '低値';
      case 'high': return '高値';
      case 'critical-low': return '要注意(低)';
      case 'critical-high': return '要注意(高)';
      default: return '-';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">血液検査ヒートマップ</h3>
        
        {/* カテゴリー選択 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? '全項目' : category}
            </button>
          ))}
        </div>
        
        {/* 凡例 */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30"></div>
            <span className="text-gray-600">最適値</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-500/30"></div>
            <span className="text-gray-600">正常</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30"></div>
            <span className="text-gray-600">要注意</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-600/30"></div>
            <span className="text-gray-600">異常</span>
          </div>
        </div>
      </div>

      {/* ヒートマップグリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredData.map((item) => {
          const percentage = ((item.value - item.min) / (item.max - item.min)) * 100;
          const colorClass = getColorByStatus(item.status, item.value, item.min, item.max);
          
          return (
            <div
              key={item.nameEn}
              className={`relative p-4 rounded-lg bg-gradient-to-br ${colorClass} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer overflow-hidden`}
            >
              {/* 背景の光沢効果 */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="text-xs font-medium opacity-90 mb-1">{item.name}</div>
                <div className="text-lg font-bold mb-1">
                  {item.value}
                  <span className="text-xs font-normal ml-1 opacity-80">{item.unit}</span>
                </div>
                <div className="text-xs opacity-80">
                  {item.nameEn}
                </div>
                
                {/* プログレスバー */}
                <div className="mt-2 w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-white/60 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
                  />
                </div>
                
                <div className="text-xs mt-1 opacity-70">
                  {item.min}-{item.max}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* インサイト */}
      <div className="mt-6 p-4 bg-white/80 backdrop-blur rounded-lg shadow-inner">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">検査結果サマリー</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <span className="font-semibold text-red-700">要注意項目:</span>
            <ul className="mt-1 space-y-1 text-red-600">
              <li>• 血清鉄・フェリチン低値 → 鉄欠乏性貧血の可能性</li>
              <li>• 中性脂肪・尿酸高値 → 生活習慣の見直しが必要</li>
            </ul>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="font-semibold text-green-700">良好な項目:</span>
            <ul className="mt-1 space-y-1 text-green-600">
              <li>• 血糖値・HbA1c正常 → 糖代謝良好</li>
              <li>• 腎機能指標正常 → 腎臓の働き良好</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}