import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { POSTS } from '../../lib/posts'

export default function Blog() {
  return (
    <>
      <Head>
        <title>Roblox Scripting Guides & Tutorials | StudioVault Blog</title>
        <meta name="description" content="Free Roblox scripting guides for developers. Learn how to make datastores, shop systems, NPCs, and more with step-by-step Luau tutorials." />
        <meta name="keywords" content="roblox scripting tutorial, roblox studio guide, how to script roblox, luau tutorial, roblox datastore guide, roblox npc tutorial" />
        <link rel="canonical" href="https://studiovault-next.vercel.app/blog" />
      </Head>

      <Nav />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 2rem 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: 16 }}>
            📖 Guides & Tutorials
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text)', marginBottom: 12 }}>
            Roblox Scripting Guides
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 520 }}>
            Step-by-step tutorials for the most common Roblox scripting tasks. Written for developers of all levels.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '24px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{post.date}</span>
                  <span style={{ color: 'var(--border)' }}>·</span>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>{post.readTime}</span>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: 8 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: '.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {post.description}
                </p>
                <div style={{ marginTop: 14, color: 'var(--accent)', fontSize: '.82rem', fontWeight: 500 }}>
                  Read guide →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="footer">
        <b>StudioVault</b> · Free Luau scripts for Roblox developers · AI fixer powered by Gemini
      </footer>
    </>
  )
}
