export default function MinimalPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        最小限のテストページ
      </h1>
      <p style={{ marginBottom: '1rem' }}>
        このページが表示されていれば、基本的なレンダリングは動作しています。
      </p>
      <div className="bg-blue-500 text-white p-4 rounded">
        <p>Tailwindクラスのテスト（青い背景、白い文字）</p>
      </div>
    </div>
  )
}