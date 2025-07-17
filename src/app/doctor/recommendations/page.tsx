'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

// 推薦履歴の型定義
interface RecommendationHistory {
  id: string;
  patientId: string;
  patientName: string;
  patientMedicalNumber: string;
  testDate: string;
  createdAt: string;
  updatedAt: string;
  status: 'sent' | 'draft' | 'edited';
  supplements: {
    id: string;
    name: string;
    description: string;
    price: number;
    dosage: string;
    frequency: string;
  }[];
  recommendation: string;
  doctorNote: string;
}

// ダミーデータ
const dummyRecommendations: RecommendationHistory[] = [
  {
    id: '1',
    patientId: 'patient-1',
    patientName: '山田 花子',
    patientMedicalNumber: 'P001234',
    testDate: '2025-01-15',
    createdAt: '2025-01-16',
    updatedAt: '2025-01-16',
    status: 'sent',
    supplements: [
      {
        id: 'supp-1',
        name: 'ビタミンD強化マルチビタミン・亜鉛・乳酸菌',
        description: '1日2粒で、14種のビタミン（ビタミンD強化 25μg）・亜鉛・シールド乳酸菌®100億個をまとめて摂取',
        price: 2980,
        dosage: '1日2粒',
        frequency: '朝食後'
      },
      {
        id: 'supp-2',
        name: '鉄分サプリメント',
        description: 'ヘム鉄10mg配合、葉酸・ビタミンC・ビタミンB12も同時摂取',
        price: 1980,
        dosage: '1日1粒',
        frequency: '夕食後'
      }
    ],
    recommendation: 'ビタミンD不足による免疫機能低下と骨密度の減少リスクを改善するため、ビタミンD強化サプリメントを推奨します。また、軽度の貧血傾向が見られるため、鉄分補給も併せて行うことを推奨します。',
    doctorNote: '患者は日光への露出が少ない生活習慣。3ヶ月後に再検査予定。'
  },
  {
    id: '2',
    patientId: 'patient-2',
    patientName: '鈴木 太郎',
    patientMedicalNumber: 'P001235',
    testDate: '2025-01-14',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-17',
    status: 'edited',
    supplements: [
      {
        id: 'supp-3',
        name: 'ストロング39アミノ　マルチビタミン＆ミネラル',
        description: 'マルチビタミン＆ミネラルに9種の必須アミノ酸を含め18種のアミノ酸をプラス',
        price: 3980,
        dosage: '1日3粒',
        frequency: '朝・昼・夕食後'
      }
    ],
    recommendation: '複数の栄養素が不足しているため、バランス良く摂取できるマルチビタミン・ミネラルを推奨します。特にビタミンB群とミネラルの不足が顕著です。',
    doctorNote: '運動習慣あり。プロテイン摂取も検討。'
  },
  {
    id: '3',
    patientId: 'patient-3',
    patientName: '佐藤 美咲',
    patientMedicalNumber: 'P001236',
    testDate: '2025-01-13',
    createdAt: '2025-01-14',
    updatedAt: '2025-01-14',
    status: 'sent',
    supplements: [
      {
        id: 'supp-4',
        name: 'ビタミンB12・葉酸',
        description: 'ビタミンB12 1000μg、葉酸400μg配合',
        price: 1680,
        dosage: '1日1粒',
        frequency: '朝食後'
      }
    ],
    recommendation: 'ビタミンB12の不足により、疲労感や集中力の低下が見られます。神経機能の維持と造血作用をサポートするため、ビタミンB12と葉酸の補給を推奨します。',
    doctorNote: 'ベジタリアンのため、動物性食品からのB12摂取が不足。'
  }
];

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationHistory[]>(dummyRecommendations);
  const [filteredRecommendations, setFilteredRecommendations] = useState<RecommendationHistory[]>(dummyRecommendations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRecommendation, setEditingRecommendation] = useState<string>('');
  const [editingDoctorNote, setEditingDoctorNote] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    filterRecommendations();
  }, [searchTerm, filterStatus, recommendations]);

  const filterRecommendations = () => {
    let filtered = recommendations;

    // 検索フィルタ
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(rec =>
        rec.patientName.toLowerCase().includes(searchLower) ||
        rec.patientMedicalNumber.toLowerCase().includes(searchLower) ||
        rec.supplements.some(s => s.name.toLowerCase().includes(searchLower))
      );
    }

    // ステータスフィルタ
    if (filterStatus !== 'all') {
      filtered = filtered.filter(rec => rec.status === filterStatus);
    }

    setFilteredRecommendations(filtered);
  };

  const handleEdit = (recommendation: RecommendationHistory) => {
    setEditingId(recommendation.id);
    setEditingRecommendation(recommendation.recommendation);
    setEditingDoctorNote(recommendation.doctorNote);
    setExpandedId(recommendation.id);
  };

  const handleSave = (id: string) => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === id 
        ? {
            ...rec,
            recommendation: editingRecommendation,
            doctorNote: editingDoctorNote,
            status: 'edited' as const,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : rec
    ));
    setEditingId(null);
    setEditingRecommendation('');
    setEditingDoctorNote('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingRecommendation('');
    setEditingDoctorNote('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">送信済み</span>;
      case 'edited':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">編集済み</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">下書き</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">推奨管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          患者へ送付した推薦履歴の確認と編集
        </p>
      </div>

      {/* 検索・フィルタ */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="患者名、カルテ番号、サプリメント名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべて</option>
              <option value="sent">送信済み</option>
              <option value="edited">編集済み</option>
              <option value="draft">下書き</option>
            </select>
          </div>
        </div>
      </div>

      {/* 推薦履歴リスト */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="bg-white shadow rounded-lg overflow-hidden">
            {/* ヘッダー */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === recommendation.id ? null : recommendation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{recommendation.patientName}</h3>
                    <p className="text-sm text-gray-500">カルテ番号: {recommendation.patientMedicalNumber}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    検査日: {new Date(recommendation.testDate).toLocaleDateString('ja-JP')}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(recommendation.status)}
                  <span className="text-sm text-gray-500">
                    更新日: {new Date(recommendation.updatedAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>

            {/* 詳細（展開時） */}
            {expandedId === recommendation.id && (
              <div className="border-t border-gray-200 p-6 space-y-6">
                {/* 推奨サプリメント */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">推奨サプリメント</h4>
                  <div className="space-y-3">
                    {recommendation.supplements.map((supplement) => (
                      <div key={supplement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <BeakerIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{supplement.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{supplement.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">用量: {supplement.dosage}</span>
                            <span className="text-sm text-gray-500">服用: {supplement.frequency}</span>
                            <span className="text-sm font-medium text-gray-900">¥{supplement.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 推薦文 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">推薦文</h4>
                    {editingId !== recommendation.id && (
                      <button
                        onClick={() => handleEdit(recommendation)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        編集
                      </button>
                    )}
                  </div>
                  {editingId === recommendation.id ? (
                    <textarea
                      value={editingRecommendation}
                      onChange={(e) => setEditingRecommendation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-700">{recommendation.recommendation}</p>
                  )}
                </div>

                {/* 医師メモ */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">医師メモ（内部用）</h4>
                  {editingId === recommendation.id ? (
                    <textarea
                      value={editingDoctorNote}
                      onChange={(e) => setEditingDoctorNote(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="患者に表示されない内部メモ"
                    />
                  ) : (
                    <p className="p-3 bg-yellow-50 rounded-lg text-gray-700">
                      {recommendation.doctorNote || '（メモなし）'}
                    </p>
                  )}
                </div>

                {/* 編集時のアクションボタン */}
                {editingId === recommendation.id && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      キャンセル
                    </button>
                    <button
                      onClick={() => handleSave(recommendation.id)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      保存
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">推薦履歴が見つかりません</p>
          </div>
        )}
      </div>
    </div>
  );
}