import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Nav() {
  const router = useRouter()
  const isLibrary = router.pathname === '/'
  const isFixer   = router.pathname === '/fixer'
  const isBlog    = router.pathname.startsWith('/blog')

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link href="/" className="nav-logo">
          <div className="logo-box">🔒</div>
          StudioVault
        </Link>
        <span className="nav-pill">Beta</span>
      </div>
      <div className="nav-tabs">
        <Link href="/" className={`nav-tab ${isLibrary ? 'active' : ''}`}>
          📦 Script Library
        </Link>
        <Link href="/fixer" className={`nav-tab ${isFixer ? 'active' : ''}`}>
          🔧 Fix My Script <span className="tab-badge">AI</span>
        </Link>
        <Link href="/blog" className={`nav-tab ${isBlog ? 'active' : ''}`}>
          📖 Guides
        </Link>
      </div>
    </nav>
  )
}
