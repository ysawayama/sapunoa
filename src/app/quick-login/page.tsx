"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function QuickLoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient')

  const handleQuickAccess = () => {
    // セッションストレージにモックユーザー情報を保存
    const mockUser = selectedRole === 'patient' 
      ? {
          id: "demo-patient-1",
          email: "patient1@example.com",
          name: "山田 花子",
          role: "PATIENT",
          medicalRecordNumber: "P001234"
        }
      : {
          id: "demo-doctor-1",
          email: "doctor@supnoa.com",
          name: "Dr. 佐藤",
          role: "DOCTOR",
          medicalRecordNumber: null
        }

    sessionStorage.setItem('mockUser', JSON.stringify(mockUser))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl">←</span>
            <h1 className="text-xl font-bold text-primary-600">サプノア</h1>
          </Link>
        </div>
      </div>

      <div className="px-4 py-8">
        {/* タイトル */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            クイックアクセス
          </h2>
          <p className="text-sm text-gray-600">
            デモアカウントですぐに体験
          </p>
        </div>

        {/* ロール選択 */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setSelectedRole('patient')}
            className={`w-full p-4 rounded-2xl border-2 transition-all ${
              selectedRole === 'patient'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                selectedRole === 'patient' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                👤
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg mb-1">患者として体験</div>
                <div className="text-sm text-gray-600">
                  検査結果の確認・サプリメント購入
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                selectedRole === 'patient'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedRole === 'patient' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('doctor')}
            className={`w-full p-4 rounded-2xl border-2 transition-all ${
              selectedRole === 'doctor'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                selectedRole === 'doctor' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                👨‍⚕️
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg mb-1">医師として体験</div>
                <div className="text-sm text-gray-600">
                  患者管理・検査結果レビュー
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                selectedRole === 'doctor'
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300'
              }`}>
                {selectedRole === 'doctor' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* アクセスボタン */}
        <button
          onClick={handleQuickAccess}
          className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform text-lg"
        >
          ダッシュボードへ進む
        </button>

        {/* 補足情報 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs text-gray-500 text-center mb-3">
            選択中のアカウント情報
          </p>
          {selectedRole === 'patient' ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">名前:</span>
                <span className="font-medium">山田 花子</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">メール:</span>
                <span className="font-medium text-xs">patient1@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">診察券番号:</span>
                <span className="font-medium">P001234</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">名前:</span>
                <span className="font-medium">Dr. 佐藤</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">メール:</span>
                <span className="font-medium text-xs">doctor@supnoa.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">担当患者数:</span>
                <span className="font-medium">125名</span>
              </div>
            </div>
          )}
        </div>

        {/* 通常ログインへのリンク */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-sm text-primary-600 font-medium"
          >
            通常のログインはこちら →
          </Link>
        </div>
      </div>
    </div>
  )
}