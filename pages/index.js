'use client'
import { useState } from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import ScriptCard from '../components/ScriptCard'
import { SNIPPETS, CATEGORIES } from '../lib/snippets'

export default function Home() {
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('All')

  const filtered = SNIPPETS.filter(s => {
    const mc = cat === 'All' || s.cat === cat
    const q  = search.toLowerCase()
    const mq = !q || s.title.toLowerCase().includes(q)
      || s.desc.toLowerCase().includes(q)
      || s.cat.toLowerCase().includes(q)
      || s.diff.toLowerCase().includes(q)
    return mc && mq
  })

  return (
    <>
      <Head>
        <title>StudioVault — Free Roblox Studio Luau Scripts & AI Script Fixer</title>
        <meta name="description" content="Free copy-paste Luau scripts for Roblox Studio. Datastores, shop systems, NPC pathfinding, admin commands, kill bricks and more. Plus an AI fixer that debugs broken scripts instantly." />
        <meta name="keywords" content="roblox studio scripts, luau scripts, roblox datastore script, roblox shop system, roblox NPC script, roblox kill brick, roblox admin commands, free roblox scripts, roblox scripting tutorial" />
        <meta property="og:title" content="StudioVault — Free Roblox Studio Luau Scripts" />
        <meta property="og:description" content="Copy-paste Luau scripts for Roblox Studio plus an AI script fixer. Free forever." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://studiovault-gamma.vercel.app" />

        {/* Noscript SEO fallback */}
        <noscript>{`
          <div>
            <h1>StudioVault - Free Roblox Luau Scripts</h1>
            <p>Free copy-paste Luau scripts for Roblox Studio developers. ${SNIPPETS.length} scripts across ${CATEGORIES.length - 1} categories.</p>
            ${SNIPPETS.map(s => `<article><h2>${s.title}</h2><p>${s.desc}</p><p>Category: ${s.cat} | Difficulty: ${s.diff} | Placement: ${s.placement}</p></article>`).join('')}
          </div>
        `}</noscript>
      </Head>

      <Nav />

      {/* HERO */}
      <div className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-eyebrow"><div className="hero-dot" /> Free for all Roblox developers</div>
        <h1 className="hero-title">The Script <em>Vault</em><br />for Roblox Devs</h1>
        <p className="hero-sub">Copy-paste ready Luau scripts for the most common Roblox Studio tasks. No fluff, no broken tutorials.</p>
        <div className="search-wrap">
          <span className="search-ico">🔍</span>
          <input
            className="search-input"
            placeholder="Search… datastore, NPC, shop, kill brick…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat"><div className="stat-num">{SNIPPETS.length}</div><div className="stat-lbl">Scripts</div></div>
        <div className="stat-div" />
        <div className="stat"><div className="stat-num">{CATEGORIES.length - 1}</div><div className="stat-lbl">Categories</div></div>
        <div className="stat-div" />
        <div className="stat"><div className="stat-num">Free</div><div className="stat-lbl">Always</div></div>
      </div>

      {/* CATEGORIES */}
      <div className="cats-wrap">
        <div className="cats-label">Filter by category</div>
        <div className="cats">
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-pill ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid-section">
        <div className="grid-count">
          {filtered.length} script{filtered.length !== 1 ? 's' : ''}
          {cat !== 'All' ? ` in ${cat}` : ''}
          {search ? ` matching "${search}"` : ''}
        </div>
        <div className="grid">
          {filtered.length > 0
            ? filtered.map(s => <ScriptCard key={s.id} s={s} />)
            : <div className="empty"><div className="empty-ico">🔍</div><div>No scripts found.</div></div>}
        </div>
      </div>

      <footer className="footer">
        <b>StudioVault</b> · Free Luau scripts for Roblox developers · AI fixer powered by Groq
      </footer>
    </>
  )
}
