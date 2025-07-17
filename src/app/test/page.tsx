export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">テストページ</h1>
      <p className="text-lg mb-2">このページが表示されていれば、Next.jsは正常に動作しています。</p>
      <div className="bg-blue-100 p-4 rounded">
        <p>Tailwind CSSも正しく適用されています。</p>
      </div>
    </div>
  )
}