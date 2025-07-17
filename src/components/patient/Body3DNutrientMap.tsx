import React, { useState } from 'react';

interface OrganSystem {
  id: string;
  name: string;
  parts: string[];
  nutrients: Array<{
    name: string;
    status: 'good' | 'warning' | 'critical';
    effect: string;
  }>;
}

const organSystems: OrganSystem[] = [
  {
    id: 'brain',
    name: '脳・神経系',
    parts: ['brain', 'nerves'],
    nutrients: [
      { name: 'ビタミンB群', status: 'warning', effect: '神経伝達物質の生成をサポート' },
      { name: 'オメガ3脂肪酸', status: 'critical', effect: '脳機能の維持と認知機能向上' },
      { name: 'マグネシウム', status: 'warning', effect: '神経の興奮を抑制し、リラックス効果' },
    ],
  },
  {
    id: 'heart',
    name: '心臓・循環器系',
    parts: ['heart', 'blood-vessels'],
    nutrients: [
      { name: 'オメガ3脂肪酸', status: 'critical', effect: '血管の健康維持と血流改善' },
      { name: 'コエンザイムQ10', status: 'warning', effect: '心筋のエネルギー産生をサポート' },
      { name: 'マグネシウム', status: 'warning', effect: '血圧の調整と不整脈予防' },
    ],
  },
  {
    id: 'bones',
    name: '骨・関節',
    parts: ['bones', 'joints'],
    nutrients: [
      { name: 'カルシウム', status: 'warning', effect: '骨密度の維持と骨粗鬆症予防' },
      { name: 'ビタミンD', status: 'critical', effect: 'カルシウムの吸収を促進' },
      { name: 'ビタミンK', status: 'good', effect: '骨の形成をサポート' },
    ],
  },
  {
    id: 'muscles',
    name: '筋肉系',
    parts: ['muscles'],
    nutrients: [
      { name: 'タンパク質', status: 'good', effect: '筋肉の修復と成長' },
      { name: 'ビタミンB6', status: 'warning', effect: 'タンパク質代謝をサポート' },
      { name: 'マグネシウム', status: 'warning', effect: '筋肉の収縮と弛緩を調整' },
    ],
  },
  {
    id: 'digestive',
    name: '消化器系',
    parts: ['stomach', 'intestines'],
    nutrients: [
      { name: '食物繊維', status: 'critical', effect: '腸内環境の改善と便通促進' },
      { name: 'プロバイオティクス', status: 'warning', effect: '腸内細菌バランスの改善' },
      { name: 'ビタミンB群', status: 'warning', effect: '消化酵素の働きをサポート' },
    ],
  },
  {
    id: 'immune',
    name: '免疫系',
    parts: ['lymph', 'thymus'],
    nutrients: [
      { name: 'ビタミンC', status: 'critical', effect: '免疫細胞の活性化と抗酸化作用' },
      { name: '亜鉛', status: 'warning', effect: '免疫機能の正常化' },
      { name: 'ビタミンD', status: 'critical', effect: '免疫調整作用' },
    ],
  },
];

export default function Body3DNutrientMap() {
  const [selectedSystem, setSelectedSystem] = useState<OrganSystem | null>(null);
  const [viewAngle, setViewAngle] = useState<'front' | 'side' | 'back'>('front');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good': return 'from-emerald-500/20 to-emerald-600/20';
      case 'warning': return 'from-amber-500/20 to-amber-600/20';
      case 'critical': return 'from-red-500/20 to-red-600/20';
      default: return 'from-gray-500/20 to-gray-600/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-xl shadow-xl p-6 text-white">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">栄養素と身体への影響（3Dビュー）</h3>
        <p className="text-sm opacity-70">身体の各部位をクリックして、関連する栄養素の状態を確認できます</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D人体図 */}
        <div className="relative bg-black/30 rounded-lg p-6 backdrop-blur border border-white/10">
          {/* ビュー切り替えボタン */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {(['front', 'side', 'back'] as const).map((angle) => (
              <button
                key={angle}
                onClick={() => setViewAngle(angle)}
                className={`px-3 py-1 text-xs rounded-lg transition-all ${
                  viewAngle === angle
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {angle === 'front' ? '正面' : angle === 'side' ? '側面' : '背面'}
              </button>
            ))}
          </div>

          {/* 人体SVG */}
          <div className="relative h-[500px] flex items-center justify-center">
            <svg viewBox="0 0 300 400" className="w-full h-full max-w-[300px]">
              {/* グラデーション定義 */}
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {viewAngle === 'front' && (
                <g>
                  {/* 頭部 */}
                  <ellipse
                    cx="150" cy="60" rx="30" ry="35"
                    fill="url(#bodyGradient)"
                    stroke="#60A5FA"
                    strokeWidth="2"
                    filter="url(#glow)"
                    className={`cursor-pointer transition-all hover:fill-blue-400 ${
                      selectedSystem?.id === 'brain' ? 'fill-blue-300' : ''
                    }`}
                    onClick={() => setSelectedSystem(organSystems.find(s => s.id === 'brain') || null)}
                  />
                  
                  {/* 胴体 */}
                  <path
                    d="M 120 90 Q 120 85 125 85 L 175 85 Q 180 85 180 90 L 180 180 Q 180 190 175 190 L 125 190 Q 120 190 120 180 Z"
                    fill="url(#bodyGradient)"
                    stroke="#60A5FA"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                  
                  {/* 心臓 */}
                  <path
                    d="M 135 110 C 135 105, 140 100, 145 105 C 150 100, 155 105, 155 110 Q 155 120, 145 125 Q 135 120, 135 110"
                    fill="#EF4444"
                    stroke="#DC2626"
                    strokeWidth="2"
                    filter="url(#glow)"
                    className={`cursor-pointer transition-all hover:fill-red-300 ${
                      selectedSystem?.id === 'heart' ? 'fill-red-300' : ''
                    }`}
                    onClick={() => setSelectedSystem(organSystems.find(s => s.id === 'heart') || null)}
                  />
                  
                  {/* 腕 */}
                  <path d="M 120 100 L 90 130 L 85 170" stroke="#60A5FA" strokeWidth="15" strokeLinecap="round" fill="none" filter="url(#glow)" />
                  <path d="M 180 100 L 210 130 L 215 170" stroke="#60A5FA" strokeWidth="15" strokeLinecap="round" fill="none" filter="url(#glow)" />
                  
                  {/* 脚 */}
                  <path d="M 135 190 L 130 250 L 125 300" stroke="#60A5FA" strokeWidth="15" strokeLinecap="round" fill="none" filter="url(#glow)" />
                  <path d="M 165 190 L 170 250 L 175 300" stroke="#60A5FA" strokeWidth="15" strokeLinecap="round" fill="none" filter="url(#glow)" />
                  
                  {/* 消化器系 */}
                  <ellipse
                    cx="150" cy="140" rx="20" ry="25"
                    fill="#F59E0B"
                    fillOpacity="0.6"
                    stroke="#D97706"
                    strokeWidth="1"
                    className={`cursor-pointer transition-all hover:fill-amber-300 ${
                      selectedSystem?.id === 'digestive' ? 'fill-amber-300' : ''
                    }`}
                    onClick={() => setSelectedSystem(organSystems.find(s => s.id === 'digestive') || null)}
                  />
                  
                  {/* 骨格（透過表示） */}
                  <g opacity="0.3">
                    <line x1="150" y1="90" x2="150" y2="180" stroke="white" strokeWidth="2" />
                    <line x1="120" y1="100" x2="180" y2="100" stroke="white" strokeWidth="2" />
                  </g>
                </g>
              )}

              {/* サイドビューとバックビューは簡略化 */}
              {viewAngle === 'side' && (
                <g>
                  <path
                    d="M 150 40 Q 140 40 140 50 L 140 90 Q 140 100 150 100 L 160 100 L 160 180 Q 160 190 150 190 L 140 190 L 140 300"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="20"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                </g>
              )}
              
              {/* インタラクティブな臓器ラベル */}
              {selectedSystem && viewAngle === 'front' && (
                <g>
                  <circle cx="150" cy="150" r="3" fill="white" className="animate-pulse" />
                  <text x="155" y="155" fill="white" fontSize="12" className="font-semibold">
                    {selectedSystem.name}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* 栄養素情報パネル */}
        <div className="space-y-4">
          {selectedSystem ? (
            <>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></span>
                  {selectedSystem.name}
                </h4>
                
                <div className="space-y-3">
                  {selectedSystem.nutrients.map((nutrient, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg bg-gradient-to-r ${getStatusBg(nutrient.status)} border border-white/10`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className={`font-semibold ${getStatusColor(nutrient.status)}`}>
                          {nutrient.name}
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded-full bg-black/30 ${
                          nutrient.status === 'good' ? 'text-emerald-400' :
                          nutrient.status === 'warning' ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {nutrient.status === 'good' ? '良好' :
                           nutrient.status === 'warning' ? '要注意' : '不足'}
                        </span>
                      </div>
                      <p className="text-sm opacity-80">{nutrient.effect}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur rounded-lg p-4 border border-white/20">
                <h5 className="text-sm font-semibold mb-2">推奨サプリメント</h5>
                <ul className="space-y-1 text-sm opacity-80">
                  {selectedSystem.nutrients
                    .filter(n => n.status !== 'good')
                    .map((n, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {n.name}サプリメント
                      </li>
                    ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20 text-center">
              <p className="text-gray-300">
                左の人体図から気になる部位をクリックしてください
              </p>
            </div>
          )}

          {/* 全体の栄養状態サマリー */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <h5 className="text-sm font-semibold mb-3">全身の栄養状態</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {organSystems.map((system) => (
                <button
                  key={system.id}
                  onClick={() => setSelectedSystem(system)}
                  className={`p-2 rounded-lg text-left transition-all ${
                    selectedSystem?.id === system.id
                      ? 'bg-white/20 border border-white/30'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="font-medium">{system.name}</div>
                  <div className="flex gap-1 mt-1">
                    {system.nutrients.map((n, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          n.status === 'good' ? 'bg-emerald-400' :
                          n.status === 'warning' ? 'bg-amber-400' :
                          'bg-red-400'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}