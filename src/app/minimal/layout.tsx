import './minimal.css'

export default function MinimalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <div className="test-container">
          {children}
        </div>
      </body>
    </html>
  )
}