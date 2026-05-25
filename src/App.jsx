import { useState } from 'react'
import IssueForm from './components/IssueForm'
import Tree from './components/Tree'
import Modal from './components/Modal'

let nextId = 1

const LEGEND = [
  { label: 'Show stopper',  color: '#ff2d55' },
  { label: 'Major issue',   color: '#f5a623' },
  { label: 'Low-med issue', color: '#7ed321' },
]

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

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Light header ── */}
      <header style={{ background: '#ffffff' }} className="px-8 py-5 flex items-center gap-8 border-b border-gray-200">
        {/* Logo */}
        <div className="flex items-baseline shrink-0" style={{ gap: 0 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 46, color: '#000000', letterSpacing: '-1px', lineHeight: 1 }}>
            UX&nbsp;
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 46, color: '#ff2d55', letterSpacing: '-1px', lineHeight: 1 }}>
            DEBT
          </span>
          <span style={{ fontFamily: "'Griffy', cursive", fontWeight: 400, fontStyle: 'normal', fontSize: 46, color: '#000000', letterSpacing: '-0.5px', lineHeight: 1 }}>
            &nbsp;tree
          </span>
        </div>

        {/* Subtitle */}
        <p style={{ color: '#666666', fontSize: 14, lineHeight: 1.55, fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
          Help your team prioritise then reach for and pick off the quick wins to get your UX debt under control
        </p>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="shrink-0 bg-white border-r border-gray-200 p-7 flex flex-col" style={{ width: 272 }}>
          <IssueForm onAdd={addIssue} />
        </aside>

        {/* Tree panel */}
        <main className="flex-1 relative" style={{ background: '#f0efed', overflowX: 'clip', overflowY: 'visible' }}>

          <p className="absolute top-4 left-6 text-xs select-none" style={{ color: '#aaa' }}>
            Highest hanging = high dev effort
          </p>
          <p className="absolute bottom-4 left-6 text-xs select-none" style={{ color: '#aaa' }}>
            Lowest hanging = low dev effort
          </p>

          {/* Legend */}
          <div className="absolute top-4 right-6 flex flex-col gap-2.5">
            {LEGEND.map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="rounded-full shrink-0" style={{ width: 20, height: 20, background: color }} />
                <span style={{ fontSize: 14, color: '#555', fontFamily: "'Inter', sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>

          <Tree
            issues={issues}
            onFruitClick={setSelectedIssue}
            onAddClick={() => document.querySelector('textarea')?.focus()}
          />
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
