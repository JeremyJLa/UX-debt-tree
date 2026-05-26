import { useState } from 'react'
import IssueForm from './components/IssueForm'
import Tree from './components/Tree'
import Modal from './components/Modal'

function StatsBar({ issues }) {
  const active = issues.filter(i => !i.completed)
  if (active.length === 0) return null
  const quickWins    = active.filter(i => i.effort === 'low').length
  const showstoppers = active.filter(i => i.severity === 'showstopper').length
  const total        = active.length
  const stats = [
    { label: 'QUICK WINS',    value: quickWins    },
    { label: 'SHOWSTOPPERS',  value: showstoppers },
    { label: 'TOTAL UX DEBT', value: total        },
  ]
  return (
    <div style={{
      position: 'absolute', bottom: 32, left: 32,
      background: '#1a2038', borderRadius: 20,
      padding: '18px 8px', display: 'flex', zIndex: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '0 28px',
          borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
            color: 'rgba(255,255,255,0.50)', marginBottom: 6,
            fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
          }}>
            {s.label}
          </span>
          <span style={{
            fontSize: 36, fontWeight: 800, color: 'white',
            lineHeight: 1, fontFamily: 'Inter, sans-serif',
          }}>
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}

let nextId = 1

export default function App() {
  const [issues, setIssues] = useState([])
  const [selectedIssue, setSelectedIssue] = useState(null)

  function addIssue({ description, severity, effort }) {
    const id = String(nextId++)
    setIssues(prev => [...prev, { id, description, severity, effort, completed: false }])
  }

  function completeIssue(id) {
    setSelectedIssue(null)
    setIssues(prev =>
      prev.map(issue => issue.id === id ? { ...issue, completed: true } : issue)
    )
    setTimeout(() => {
      setIssues(prev => prev.filter(issue => issue.id !== id))
    }, 1550)
  }

  const openCount = issues.filter(i => !i.completed).length

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Glassmorphic header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.55)',
        boxShadow: '0 1px 16px rgba(99,102,241,0.09)',
        padding: '0 28px',
        height: 64,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 38, color: '#111827', letterSpacing: '-1px', lineHeight: 1 }}>UX&nbsp;</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 38, color: '#6366f1', letterSpacing: '-1px', lineHeight: 1 }}>DEBT</span>
          <span style={{ fontFamily: "'Griffy', cursive", fontWeight: 400, fontSize: 38, color: '#111827', letterSpacing: '-0.5px', lineHeight: 1 }}>&nbsp;tree</span>
        </div>

        {/* Subtitle */}
        <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.5, fontFamily: "'Inter', sans-serif", fontWeight: 400, flex: 1 }}>
          Prioritise quick wins and pick off UX debt, one piece at a time
        </p>

        {/* Open issues badge */}
        {openCount > 0 && (
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', borderRadius: 999, padding: '4px 12px',
            fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif",
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            whiteSpace: 'nowrap',
          }}>
            {openCount} open {openCount === 1 ? 'issue' : 'issues'}
          </span>
        )}
      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', padding: '20px 20px 0', gap: 16, alignItems: 'flex-start' }}>

        {/* Sidebar card */}
        <aside style={{
          width: 272, flexShrink: 0,
          background: 'white',
          borderRadius: 20,
          boxShadow: '0 4px 32px rgba(99,102,241,0.12), 0 1px 4px rgba(0,0,0,0.04)',
          padding: 24,
          position: 'sticky', top: 80,
        }}>
          <IssueForm onAdd={addIssue} />
        </aside>

        {/* Tree panel */}
        <main style={{
          flex: 1,
          position: 'relative',
          background: 'white',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          overflowX: 'clip',
          overflowY: 'visible',
          minHeight: 'calc(100vh - 100px)',
        }}>
          <Tree
            issues={issues}
            onFruitClick={setSelectedIssue}
            onAddClick={() => document.querySelector('textarea')?.focus()}
          />
          <StatsBar issues={issues} />
        </main>
      </div>

      {selectedIssue && (
        <Modal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onComplete={completeIssue}
        />
      )}
    </div>
  )
}
