import React, { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface HealthIndicator {
  id: string;
  name: string;
  description: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  score: number;
  color: string;
  items: Array<{
    name: string;
    nameEn: string;
    value: number;
    normalMin: number;
    normalMax: number;
  }>;
}

const healthIndicators: HealthIndicator[] = [
  {
    id: 'anemia',
    name: '貧血',
    description: '鉄分と血液の健康状態',
    grade: 'C',
    score: 65,
    color: '#FF6B6B',
    items: [
      { name: '赤血球数', nameEn: 'RBC', value: 75, normalMin: 400, normalMax: 550 },
      { name: 'ヘモグロビン', nameEn: 'HGB', value: 70, normalMin: 13.0, normalMax: 17.0 },
      { name: 'ヘマトクリット', nameEn: 'HCT', value: 60, normalMin: 40, normalMax: 52 },
      { name: '血小板数', nameEn: 'PLT', value: 85, normalMin: 15, normalMax: 40 },
      { name: '血清鉄', nameEn: 'Fe', value: 45, normalMin: 70, normalMax: 170 },
      { name: 'フェリチン', nameEn: 'Ferritin', value: 40, normalMin: 30, normalMax: 300 },
    ],
  },
  {
    id: 'energy',
    name: 'エネルギー',
    description: '代謝とエネルギー産生能力',
    grade: 'B',
    score: 78,
    color: '#4ECDC4',
    items: [
      { name: '総蛋白', nameEn: 'TP', value: 80, normalMin: 6.5, normalMax: 8.0 },
      { name: 'アルブミン', nameEn: 'ALB', value: 65, normalMin: 4.0, normalMax: 5.0 },
      { name: 'ヘモグロビン', nameEn: 'HGB', value: 70, normalMin: 13.0, normalMax: 17.0 },
      { name: '尿素窒素', nameEn: 'BUN', value: 85, normalMin: 8, normalMax: 20 },
      { name: '血糖値', nameEn: 'GLU', value: 90, normalMin: 70, normalMax: 110 },
    ],
  },
  {
    id: 'recovery',
    name: 'リカバリー',
    description: '回復力と炎症反応',
    grade: 'A',
    score: 88,
    color: '#45B7D1',
    items: [
      { name: 'CK', nameEn: 'CK', value: 85, normalMin: 50, normalMax: 250 },
      { name: '白血球数', nameEn: 'WBC', value: 90, normalMin: 4000, normalMax: 9000 },
      { name: 'CRP', nameEn: 'CRP', value: 95, normalMin: 0, normalMax: 0.3 },
      { name: 'LDH', nameEn: 'LDH', value: 88, normalMin: 120, normalMax: 250 },
      { name: '好中球', nameEn: 'Neutrophil', value: 82, normalMin: 40, normalMax: 70 },
    ],
  },
  {
    id: 'protein',
    name: 'たんぱく質',
    description: 'たんぱく質代謝と筋肉の健康',
    grade: 'B',
    score: 75,
    color: '#96CEB4',
    items: [
      { name: '総蛋白', nameEn: 'TP', value: 80, normalMin: 6.5, normalMax: 8.0 },
      { name: 'アルブミン', nameEn: 'ALB', value: 65, normalMin: 4.0, normalMax: 5.0 },
      { name: 'A/G比', nameEn: 'A/G', value: 75, normalMin: 1.2, normalMax: 2.0 },
      { name: '尿素窒素', nameEn: 'BUN', value: 85, normalMin: 8, normalMax: 20 },
      { name: 'クレアチニン', nameEn: 'CRE', value: 90, normalMin: 0.6, normalMax: 1.1 },
    ],
  },
  {
    id: 'immunity',
    name: '免疫',
    description: '免疫系の働きと防御力',
    grade: 'B',
    score: 82,
    color: '#DDA0DD',
    items: [
      { name: '白血球数', nameEn: 'WBC', value: 90, normalMin: 4000, normalMax: 9000 },
      { name: 'リンパ球', nameEn: 'Lymphocyte', value: 85, normalMin: 20, normalMax: 45 },
      { name: '好中球', nameEn: 'Neutrophil', value: 82, normalMin: 40, normalMax: 70 },
      { name: 'IgG', nameEn: 'IgG', value: 78, normalMin: 870, normalMax: 1700 },
      { name: '総蛋白', nameEn: 'TP', value: 80, normalMin: 6.5, normalMax: 8.0 },
    ],
  },
];

export default function HealthIndicatorRadar() {
  const [selectedIndicator, setSelectedIndicator] = useState<HealthIndicator>(healthIndicators[0]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'from-emerald-400 to-emerald-600';
      case 'B': return 'from-blue-400 to-blue-600';
      case 'C': return 'from-amber-400 to-amber-600';
      case 'D': return 'from-orange-400 to-orange-600';
      case 'E': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getGradeText = (grade: string) => {
    switch (grade) {
      case 'A': return '優秀';
      case 'B': return '良好';
      case 'C': return '普通';
      case 'D': return '要注意';
      case 'E': return '要改善';
      default: return '-';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl shadow-xl p-6 text-white">
      <h3 className="text-xl font-bold mb-6">健康指標レーダーチャート</h3>

      {/* 指標選択タブ */}
      <div className="flex flex-wrap gap-3 mb-6">
        {healthIndicators.map((indicator) => (
          <button
            key={indicator.id}
            onClick={() => setSelectedIndicator(indicator)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedIndicator.id === indicator.id
                ? 'bg-white/20 backdrop-blur border border-white/30 shadow-lg'
                : 'bg-white/10 hover:bg-white/15 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{indicator.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getGradeColor(indicator.grade)} text-white font-bold`}>
                {indicator.grade}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* レーダーチャート */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={selectedIndicator.items}>
              <PolarGrid 
                gridType="polygon" 
                stroke="rgba(255,255,255,0.2)"
                radialLines={true}
              />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: 'white', fontSize: 12 }}
                className="text-white"
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: 'white', fontSize: 10 }}
                tickCount={6}
              />
              <Radar
                name={selectedIndicator.name}
                dataKey="value"
                stroke={selectedIndicator.color}
                fill={selectedIndicator.color}
                fillOpacity={0.6}
                strokeWidth={2}
              />
              {/* 正常範囲の基準線 */}
              <Radar
                name="正常範囲"
                dataKey={() => 70}
                stroke="rgba(255,255,255,0.3)"
                fill="none"
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 評価詳細 */}
        <div className="space-y-4">
          {/* グレード表示 */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getGradeColor(selectedIndicator.grade)} shadow-2xl mb-4`}>
                <span className="text-4xl font-bold">{selectedIndicator.grade}</span>
              </div>
              <h4 className="text-lg font-semibold mb-1">{selectedIndicator.name}</h4>
              <p className="text-sm opacity-80">{selectedIndicator.description}</p>
              <div className="mt-4">
                <div className="text-2xl font-bold">{selectedIndicator.score}点</div>
                <div className="text-sm opacity-70">{getGradeText(selectedIndicator.grade)}</div>
              </div>
            </div>
          </div>

          {/* 各項目の詳細 */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <h5 className="text-sm font-semibold mb-3 opacity-90">検査項目詳細</h5>
            <div className="space-y-2">
              {selectedIndicator.items.map((item) => (
                <div key={item.nameEn} className="flex justify-between items-center text-sm">
                  <span className="opacity-80">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="font-semibold w-12 text-right">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* アドバイス */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur rounded-lg p-4 border border-white/20">
            <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              改善アドバイス
            </h5>
            <p className="text-sm opacity-80">
              {selectedIndicator.grade === 'A' && '素晴らしい状態です。この調子を維持しましょう。'}
              {selectedIndicator.grade === 'B' && '良好な状態ですが、さらなる改善の余地があります。'}
              {selectedIndicator.grade === 'C' && '平均的な状態です。生活習慣の見直しをお勧めします。'}
              {selectedIndicator.grade === 'D' && '注意が必要です。専門家への相談を検討してください。'}
              {selectedIndicator.grade === 'E' && '早急な改善が必要です。医師に相談してください。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}