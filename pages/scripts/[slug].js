import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { SNIPPETS, CAT_COLOR } from '../../lib/snippets'
import { highlight } from '../../lib/highlight'

export async function getStaticPaths() {
  return {
    paths: SNIPPETS.map(s => ({ params: { slug: s.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const script = SNIPPETS.find(s => s.slug === params.slug) || null
  const related = script
    ? SNIPPETS.filter(s => s.cat === script.cat && s.id !== script.id).slice(0, 3)
    : []
  return { props: { script, related } }
}

export default function ScriptPage({ script, related }) {
  const [copied, setCopied] = useState(false)
  if (!script) return null
  const cs = CAT_COLOR[script.cat] || {}

  function copy() {
    navigator.clipboard.writeText(script.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <title>{script.title} — Free Roblox Luau Script | StudioVault</title>
        <meta name="description" content={`Free Roblox Studio Luau script: ${script.desc} Copy-paste ready, tested, and explained. Category: ${script.cat}. Difficulty: ${script.diff}.`} />
        <meta name="keywords" content={`roblox ${script.title.toLowerCase()}, roblox studio ${script.cat.toLowerCase()} script, luau ${script.title.toLowerCase()}, free roblox script, roblox scripting`} />
        <meta property="og:title" content={`${script.title} — Free Roblox Luau Script`} />
        <meta property="og:description" content={script.desc} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://studiovault-gamma.vercel.app/scripts/${script.slug}`} />
      </Head>

      <Nav />

      <div className="script-page">
        <Link href="/" className="script-page-back">← Back to all scripts</Link>

        <h1 className="script-page-title">{script.title}</h1>
        <p className="script-page-desc">{script.desc}</p>

        <div className="script-page-meta">
          <span className="cat-badge" style={{ background: cs.bg, color: cs.c, borderColor: cs.b }}>
            {script.cat}
          </span>
          <span className={`diff-badge diff-${script.diff.toLowerCase()}`}>{script.diff}</span>
          <span className="placement">{script.placement}</span>
        </div>

        <div className="script-page-code">
          <div className="script-page-code-header">
            <span className="script-page-code-label">{script.slug}.lua</span>
            <button className={`btn ${copied ? 'btn-green' : 'btn-accent'}`} onClick={copy}>
              {copied ? '✓ Copied!' : '⎘ Copy Script'}
            </button>
          </div>
          <div className="script-page-code-inner">
            <pre dangerouslySetInnerHTML={{ __html: highlight(script.code) }} />
          </div>
        </div>

        {/* Related scripts - great for internal linking + SEO */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div className="cats-label" style={{ marginBottom: 16 }}>Related scripts in {script.cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {related.map(r => (
                <Link key={r.id} href={`/scripts/${r.slug}`} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '12px 16px', textDecoration: 'none',
                  color: 'var(--text)', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', transition: 'border-color .15s',
                }}>
                  <span style={{ fontWeight: 500, fontSize: '.9rem' }}>{r.title}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>{r.diff} →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 48, padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            Something broken or not working?
          </div>
          <Link href="/fixer" style={{ color: 'var(--accent)', fontSize: '.88rem', fontWeight: 500, textDecoration: 'none' }}>
            🔧 Try the AI Script Fixer →
          </Link>
        </div>
      </div>

      <footer className="footer">
        <b>StudioVault</b> · Free Luau scripts for Roblox developers · AI fixer powered by Groq
      </footer>
    </>
  )
}
