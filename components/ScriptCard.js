'use client'
import { useState } from 'react'
import Link from 'next/link'
import { highlight } from '../lib/highlight'
import { CAT_COLOR } from '../lib/snippets'

export default function ScriptCard({ s }) {
  const [open, setOpen]     = useState(false)
  const [copied, setCopied] = useState(false)
  const cs = CAT_COLOR[s.cat] || {}

  function copy() {
    navigator.clipboard.writeText(s.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-top">
          <div className="card-badges">
            <span className="cat-badge" style={{ background: cs.bg, color: cs.c, borderColor: cs.b }}>
              {s.cat}
            </span>
            <span className={`diff-badge diff-${s.diff.toLowerCase()}`}>{s.diff}</span>
          </div>
          <span className="placement">{s.placement}</span>
        </div>
        <div className="card-title">{s.title}</div>
        <div className="card-desc">{s.desc}</div>
      </div>
      <div className="card-actions">
        <button className={`btn ${copied ? 'btn-green' : 'btn-accent'}`} onClick={copy}>
          {copied ? '✓ Copied!' : '⎘ Copy'}
        </button>
        <button className="btn btn-ghost" onClick={() => setOpen(v => !v)}>
          {open ? '▲ Hide' : '▼ View Code'}
        </button>
        <Link href={`/scripts/${s.slug}`} className="btn btn-ghost" style={{ marginLeft: 'auto' }}>
          View Page →
        </Link>
      </div>
      <div className={`code-wrap ${open ? 'open' : ''}`}>
        <div className="code-inner">
          <pre dangerouslySetInnerHTML={{ __html: highlight(s.code) }} />
        </div>
      </div>
    </div>
  )
}
