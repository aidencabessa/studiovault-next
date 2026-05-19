import { useState } from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import { highlight } from '../lib/highlight'
import { FIXER_PROMPT } from '../lib/snippets'

const STEPS = ["Reading your script…","Identifying issues…","Generating fix…","Finalizing…"]

export default function Fixer() {
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep]       = useState(0)
  const [result, setResult]   = useState(null)
  const [err, setErr]         = useState(null)
  const [copiedFix, setCopiedFix] = useState(false)

  async function fix() {
    if (!code.trim()) return
    setLoading(true); setResult(null); setErr(null); setStep(0)
    const iv = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 900)
    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: FIXER_PROMPT,
          messages: [{ role: 'user', content: `Script:\n\n${code}` }],
        }),
      })
      if (!res.ok) {
        const errBody = await res.text().catch(() => '')
        throw new Error(`API error ${res.status}: ${errBody.slice(0, 200)}`)
      }
      const data = await res.json()
      if (data.error) throw new Error(`API: ${data.error.message || JSON.stringify(data.error)}`)
      const txt = data.content?.map(b => b.text || '').join('') || ''
      if (!txt) throw new Error('Empty response from API')
      const jsonMatch = txt.replace(/```json|```/g, '').trim().match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error(`Could not parse response: ${txt.slice(0, 200)}`)
      setResult(JSON.parse(jsonMatch[0]))
    } catch(e) {
      setErr(`Error: ${e.message}`)
    } finally {
      clearInterval(iv); setStep(STEPS.length - 1); setLoading(false)
    }
  }

  function copyFix() {
    if (result?.fixedCode) {
      navigator.clipboard.writeText(result.fixedCode).catch(() => {})
      setCopiedFix(true)
      setTimeout(() => setCopiedFix(false), 2000)
    }
  }

  return (
    <>
      <Head>
        <title>Fix My Roblox Script — AI Script Fixer | StudioVault</title>
        <meta name="description" content="Paste any broken Roblox Studio Luau script. Our AI finds the bugs, explains what went wrong, and returns a corrected version instantly. Free to use." />
        <meta name="keywords" content="roblox script fixer, fix roblox script, roblox lua error, roblox studio script not working, debug roblox script" />
        <meta property="og:title" content="Fix My Roblox Script — AI Script Fixer" />
        <meta property="og:description" content="Paste your broken Roblox script. AI finds the bugs and fixes them instantly." />
      </Head>

      <Nav />

      <div className="fixer-wrap">
        <div className="fixer-hero">
          <h2>Fix My <em>Script</em></h2>
          <p>Paste any broken Roblox Studio script. AI will find the bugs, explain what went wrong, and hand back a corrected version.</p>
        </div>

        <div className="fixer-box">
          <div className="fixer-label">Your Script</div>
          <textarea
            className="fixer-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            placeholder={`-- Paste your script here...\nlocal part = script.parent  -- bug: lowercase 'parent'\npart.Touched:Connect(function(hit)\n    hit.Parent.Humanoid.Health = 0\nend)`}
          />
          <div className="fixer-actions">
            <span className="fixer-hint">
              {code.trim() ? `${code.split('\n').length} lines · Free · AI Powered` : 'Free · AI Powered'}
            </span>
            <button className="btn-fix" onClick={fix} disabled={loading || !code.trim()}>
              {loading
                ? <><div className="spinner spinner-sm" />Analyzing…</>
                : '🔧 Fix My Script'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="result-card" style={{ marginTop: 24 }}>
            <div className="loading-wrap">
              <div className="spinner" />
              <div className="loading-steps">
                {STEPS.map((s, i) => (
                  <div key={i} className={`loading-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                    <span>{i < step ? '✓' : i === step ? '→' : '·'}</span>{s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {err && (
          <div className="result-card" style={{ marginTop: 24 }}>
            <div className="result-body">
              <div style={{ color: '#ef5350', fontSize: '.88rem' }}>{err}</div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="results">
            <div className="result-card">
              <div className="result-header"><span>📋</span><span className="result-title">What This Script Does</span></div>
              <div className="result-body"><div className="result-summary">{result.summary}</div></div>
            </div>

            <div className="result-card">
              <div className="result-header">
                <span>{result.issues?.length > 0 ? '⚠️' : '✅'}</span>
                <span className="result-title">
                  {result.issues?.length > 0
                    ? `${result.issues.length} Issue${result.issues.length !== 1 ? 's' : ''} Found`
                    : 'No Issues Found'}
                </span>
              </div>
              <div className="result-body">
                {result.issues?.length > 0
                  ? <div className="issue-list">
                      {result.issues.map((iss, i) => (
                        <div key={i} className="issue-item"><div className="issue-dot" />{iss}</div>
                      ))}
                    </div>
                  : <div className="no-issues">✓ Your script looks clean!</div>}
              </div>
            </div>

            {result.whatChanged?.length > 0 && (
              <div className="result-card">
                <div className="result-header"><span>🛠️</span><span className="result-title">What Was Fixed</span></div>
                <div className="result-body">
                  <div className="issue-list">
                    {result.whatChanged.map((c, i) => (
                      <div key={i} className="issue-item"><div className="issue-dot fix-dot" />{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="result-card code-result">
              <div className="code-result-header">
                <span className="code-result-label">fixed_script.lua</span>
                <button className={`btn ${copiedFix ? 'btn-green' : 'btn-accent'}`} onClick={copyFix}>
                  {copiedFix ? '✓ Copied!' : '⎘ Copy Fixed Script'}
                </button>
              </div>
              <div className="code-result-inner">
                <pre dangerouslySetInnerHTML={{ __html: highlight(result.fixedCode || '') }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <b>StudioVault</b> · Free Luau scripts for Roblox developers · AI fixer powered by Groq
      </footer>
    </>
  )
}
