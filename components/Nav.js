import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Nav() {
  const router = useRouter()
  const isLibrary = router.pathname === '/'
  const isFixer   = router.pathname === '/fixer'

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
      </div>
    </nav>
  )
}
