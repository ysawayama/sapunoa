"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"

interface LoginFormData {
  identifier: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<'patient' | 'doctor' | ''>('')
  const [autoLogin, setAutoLogin] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      identifier: 'patient1@example.com',
      password: 'patient123'
    }
  })

  useEffect(() => {
    // URLパラメータでアカウントタイプを指定可能
    const params = new URLSearchParams(window.location.search)
    const accountType = params.get('account')
    
    if (accountType === 'doctor') {
      setValue('identifier', 'doctor@supnoa.com')
      setValue('password', 'doctor123')
      setSelectedAccount('doctor')
    } else if (accountType === 'patient' || !accountType) {
      setValue('identifier', 'patient1@example.com')
      setValue('password', 'patient123')
      setSelectedAccount('patient')
    }

    // 自動ログインが有効な場合
    if (params.get('auto') === 'true') {
      setAutoLogin(true)
    }
  }, [setValue])

  useEffect(() => {
    if (selectedAccount === 'patient') {
      setValue('identifier', 'patient1@example.com')
      setValue('password', 'patient123')
    } else if (selectedAccount === 'doctor') {
      setValue('identifier', 'doctor@supnoa.com')
      setValue('password', 'doctor123')
    }
  }, [selectedAccount, setValue])

  useEffect(() => {
    // 自動ログイン実行
    if (autoLogin) {
      handleSubmit(onSubmit)()
    }
  }, [autoLogin])

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("ログインに失敗しました。メールアドレスまたはパスワードを確認してください。")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError("エラーが発生しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (accountType: 'patient' | 'doctor') => {
    if (accountType === 'patient') {
      setValue('identifier', 'patient1@example.com')
      setValue('password', 'patient123')
    } else {
      setValue('identifier', 'doctor@supnoa.com')
      setValue('password', 'doctor123')
    }
    handleSubmit(onSubmit)()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* クイックログインボタン */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-gray-700 mb-3">🚀 クイックログイン（開発用）</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickLogin('patient')}
            className="px-4 py-3 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>👤</span>
            <span>患者としてログイン</span>
          </button>
          <button
            type="button"
            onClick={() => quickLogin('doctor')}
            className="px-4 py-3 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>👨‍⚕️</span>
            <span>医師としてログイン</span>
          </button>
        </div>
      </div>

      {/* テストアカウント選択 */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">フォームに入力する:</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedAccount('patient')}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              selectedAccount === 'patient'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            患者アカウント
          </button>
          <button
            type="button"
            onClick={() => setSelectedAccount('doctor')}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              selectedAccount === 'doctor'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            医師アカウント
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
          メールアドレスまたは診察券番号
        </label>
        <input
          {...register("identifier", {
            required: "メールアドレスまたは診察券番号を入力してください",
          })}
          type="text"
          id="identifier"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="メールアドレスまたは診察券番号"
        />
        {errors.identifier && (
          <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          パスワード
        </label>
        <input
          {...register("password", {
            required: "パスワードを入力してください",
          })}
          type="password"
          id="password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="パスワード"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "ログイン中..." : "ログイン"}
      </Button>

      <div className="text-center">
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">または</span>
          </div>
        </div>
        
        <a
          href="/dashboard"
          className="block w-full px-4 py-2 mb-4 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          ログインせずにデモを見る
        </a>
      </div>

      <div className="text-center text-sm">
        <span className="text-gray-600">アカウントをお持ちでない方は </span>
        <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
          新規登録
        </a>
      </div>
    </form>
  )
}