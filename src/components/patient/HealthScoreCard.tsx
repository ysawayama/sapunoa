import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import HealthIndicatorRadar from './HealthIndicatorRadar';

interface HealthScoreCardProps {
  score?: {
    overall: number;
    categories: {
      nutrition: number;
      fitness: number;
      mental: number;
      sleep: number;
    };
    nutritionDetails?: {
      vitamins: number;
      minerals: number;
      protein: number;
      fiber: number;
      omega3: number;
    };
    trend?: Array<{
      date: string;
      score: number;
    }>;
  };
}

type ViewMode = 'overview' | 'radar' | 'trend' | 'indicators';

export default function HealthScoreCard({ score }: HealthScoreCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  
  const defaultScore = {
    overall: 0,
    categories: {
      nutrition: 0,
      fitness: 0,
      mental: 0,
      sleep: 0,
    },
    nutritionDetails: {
      vitamins: 75,
      minerals: 68,
      protein: 85,
      fiber: 55,
      omega3: 45,
    },
    trend: [
      { date: '1月', score: 72 },
      { date: '2月', score: 75 },
      { date: '3月', score: 73 },
      { date: '4月', score: 78 },
      { date: '5月', score: 80 },
      { date: '6月', score: 82 },
    ],
  };

  const healthScore = score || defaultScore;

  const getScoreColor = (value: number) => {
    if (value >= 80) return '#10b981';
    if (value >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const categories = [
    { name: '栄養', key: 'nutrition', icon: '🥗' },
    { name: 'フィットネス', key: 'fitness', icon: '💪' },
    { name: 'メンタル', key: 'mental', icon: '🧠' },
    { name: '睡眠', key: 'sleep', icon: '😴' },
  ];

  // レーダーチャート用データ
  const radarData = categories.map((cat) => ({
    category: cat.name,
    value: healthScore.categories[cat.key as keyof typeof healthScore.categories],
    fullMark: 100,
  }));

  // 栄養素詳細レーダーチャート用データ
  const nutritionRadarData = healthScore.nutritionDetails ? [
    { nutrient: 'ビタミン', value: healthScore.nutritionDetails.vitamins, fullMark: 100 },
    { nutrient: 'ミネラル', value: healthScore.nutritionDetails.minerals, fullMark: 100 },
    { nutrient: 'タンパク質', value: healthScore.nutritionDetails.protein, fullMark: 100 },
    { nutrient: '食物繊維', value: healthScore.nutritionDetails.fiber, fullMark: 100 },
    { nutrient: 'オメガ3', value: healthScore.nutritionDetails.omega3, fullMark: 100 },
  ] : [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">健康スコア</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewMode === 'overview'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            概要
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewMode === 'radar'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            詳細分析
          </button>
          <button
            onClick={() => setViewMode('trend')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewMode === 'trend'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            推移
          </button>
          <button
            onClick={() => setViewMode('indicators')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewMode === 'indicators'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            健康指標
          </button>
        </div>
      </div>
      
      {viewMode === 'overview' && (
        <div className="flex items-center justify-between">
          <div className="w-32 h-32">
            <CircularProgressbar
              value={healthScore.overall}
              text={`${healthScore.overall}`}
              styles={buildStyles({
                textColor: '#1f2937',
                pathColor: getScoreColor(healthScore.overall),
                trailColor: '#e5e7eb',
                textSize: '24px',
              })}
            />
          </div>
          
          <div className="flex-1 ml-8 grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category.key} className="flex items-center">
                <span className="text-2xl mr-3">{category.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <span className="text-sm font-semibold">
                      {healthScore.categories[category.key as keyof typeof healthScore.categories]}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${healthScore.categories[category.key as keyof typeof healthScore.categories]}%`,
                        backgroundColor: getScoreColor(
                          healthScore.categories[category.key as keyof typeof healthScore.categories]
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'radar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">総合バランス</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="スコア"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">栄養素バランス</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={nutritionRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="充足率"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewMode === 'trend' && healthScore.trend && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">過去6ヶ月の推移</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={healthScore.trend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorScore)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {viewMode === 'indicators' && (
        <div className="-m-6">
          <HealthIndicatorRadar />
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">アドバイス:</span>{' '}
          {healthScore.overall >= 80
            ? '素晴らしい健康状態です！このまま維持しましょう。'
            : healthScore.overall >= 60
            ? '良好な状態ですが、改善の余地があります。'
            : '健康改善のために専門家のアドバイスを受けることをお勧めします。'}
        </p>
      </div>
    </div>
  );
}