import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { POSTS } from '../../lib/posts'

export async function getStaticPaths() {
  return {
    paths: POSTS.map(p => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = POSTS.find(p => p.slug === params.slug) || null
  const related = post
    ? POSTS.filter(p => p.slug !== post.slug).slice(0, 3)
    : []
  return { props: { post, related } }
}

function renderContent(content) {
  const lines = content.split('\n')
  const elements = []
  let i = 0
  let codeBlock = []
  let inCode = false

  while (i < lines.length) {
    const line = lines[i]

    // Code blocks
    if (line.startsWith('```')) {
      if (inCode) {
        elements.push(
          <div key={i} style={{
            background: 'var(--code-bg)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '16px 20px', margin: '20px 0', overflowX: 'auto'
          }}>
            <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '.78rem', lineHeight: 1.75, color: '#8888c0', whiteSpace: 'pre', margin: 0 }}>
              {codeBlock.join('\n')}
            </pre>
          </div>
        )
        codeBlock = []
        inCode = false
      } else {
        inCode = true
      }
      i++
      continue
    }

    if (inCode) {
      codeBlock.push(line)
      i++
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'var(--text)', margin: '36px 0 14px' }}>
          {line.slice(3)}
        </h2>
      )
      i++
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', margin: '24px 0 10px' }}>
          {line.slice(4)}
        </h3>
      )
      i++
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Regular paragraph — handle inline **bold** and [links](url)
    const parsed = line
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text);font-weight:600">$1</strong>')
      .replace(/`(.*?)`/g, '<code style="font-family:JetBrains Mono,monospace;font-size:.82em;background:var(--surface2);padding:2px 6px;border-radius:4px;color:#50e3a4">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent);text-decoration:none;font-weight:500">$1</a>')

    elements.push(
      <p key={i} style={{ fontSize: '.95rem', color: 'var(--text-muted)', lineHeight: 1.8, margin: '12px 0' }}
        dangerouslySetInnerHTML={{ __html: parsed }} />
    )
    i++
  }

  return elements
}

export default function BlogPost({ post, related }) {
  if (!post) return null

  return (
    <>
      <Head>
        <title>{post.title} | StudioVault</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={`roblox scripting, roblox studio, luau, ${post.title.toLowerCase()}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <link rel="canonical" href={`https://studiovault-next.vercel.app/blog/${post.slug}`} />
      </Head>

      <Nav />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 2rem 80px' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '.85rem', textDecoration: 'none', marginBottom: 32 }}>
          ← All guides
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{post.date}</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{post.readTime}</span>
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
          {post.title}
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 40, borderBottom: '1px solid var(--border)', paddingBottom: 32 }}>
          {post.description}
        </p>

        <div>{renderContent(post.content)}</div>

        {/* CTA box */}
        <div style={{ marginTop: 48, padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 8 }}>
            Ready-made scripts for your game
          </div>
          <p style={{ fontSize: '.88rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>
            Browse our free library of copy-paste Luau scripts — no setup needed.
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--accent-dim)', border: '1px solid rgba(232,160,32,.25)', color: 'var(--accent)', padding: '8px 16px', borderRadius: 8, fontSize: '.85rem', fontWeight: 500, textDecoration: 'none' }}>
            Browse Script Library →
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div className="cats-label" style={{ marginBottom: 16 }}>More guides</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '14px 18px', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontWeight: 500, fontSize: '.9rem', color: 'var(--text)' }}>{r.title}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>{r.readTime} →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <b>StudioVault</b> · Free Luau scripts for Roblox developers · AI fixer powered by Gemini
      </footer>
    </>
  )
}
