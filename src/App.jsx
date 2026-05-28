import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IssueForm from './components/IssueForm'
import Tree from './components/Tree'
import Modal from './components/Modal'
import WelcomeModal from './components/WelcomeModal'
import Celebration from './components/Celebration'
import { THEMES, DEFAULT_THEME } from './themes'

function ToolHint({ onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 8000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, x: -8, scale: 0.92 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{    opacity: 0, x: -6, scale: 0.94, transition: { duration: 0.25, ease: 'easeIn' } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onDismiss}
      style={{
        position: 'fixed', top: 88, left: 312, zIndex: 60,
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      {/* Arrow pointing left toward the sidebar form */}
      <div style={{
        position: 'absolute', left: -9, top: 84,
        borderTop: '9px solid transparent',
        borderBottom: '9px solid transparent',
        borderRight: '9px solid #1a2038',
      }} />

      <div style={{
        background: '#1a2038',
        borderRadius: 18,
        padding: '28px 28px 28px 24px',
        display: 'flex', alignItems: 'flex-start', gap: 18,
        boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
        width: 420,
      }}>
        {/* Coloured dots — represent severity-coded issues */}
        <svg width="30" height="30" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="3" cy="4"  r="2" fill="#DA003E" />
          <rect   x="7" y="3"   width="9" height="2" rx="1" fill="rgba(255,255,255,0.45)" />
          <circle cx="3" cy="9"  r="2" fill="#FF6C22" />
          <rect   x="7" y="8"   width="9" height="2" rx="1" fill="rgba(255,255,255,0.45)" />
          <circle cx="3" cy="14" r="2" fill="#F6BC0E" />
          <rect   x="7" y="13"  width="9" height="2" rx="1" fill="rgba(255,255,255,0.45)" />
        </svg>

        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: 15, color: 'white', margin: '0 0 10px',
            letterSpacing: '0.01em',
          }}>
            Log your UX &amp; UI issues
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 400,
            fontSize: 13, color: 'rgba(255,255,255,0.60)', margin: 0,
            lineHeight: 1.6,
          }}>
            Enter each issue, decide its severity and dev effort — it will be visually displayed as fruit on the tree, ordered by effort band.
          </p>
        </div>

        <span style={{
          color: 'rgba(255,255,255,0.35)', fontSize: 20, lineHeight: 1,
          marginLeft: 4, flexShrink: 0,
        }}>×</span>
      </div>
    </motion.div>
  )
}

function ThemeHint({ onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: -6, scale: 0.94, transition: { duration: 0.25, ease: 'easeIn' } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onDismiss}
      style={{
        position: 'fixed', top: 74, right: 20, zIndex: 60,
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      {/* Arrow pointing up — centred over the swatches */}
      <div style={{
        position: 'absolute', top: -9, right: 80,
        borderLeft: '9px solid transparent',
        borderRight: '9px solid transparent',
        borderBottom: '9px solid #1a2038',
      }} />

      <div style={{
        background: '#1a2038',
        borderRadius: 18,
        padding: '28px 28px 28px 24px',
        display: 'flex', alignItems: 'flex-start', gap: 18,
        boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
        width: 420,
      }}>
        {/* Colour palette icon */}
        <svg width="30" height="30" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="6"  cy="6"  r="2.2" fill="#ff2d55" />
          <circle cx="12" cy="6"  r="2.2" fill="#f5a623" />
          <circle cx="6"  cy="12" r="2.2" fill="#4ade80" />
          <circle cx="12" cy="12" r="2.2" fill="#60a5fa" />
        </svg>

        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: 15, color: 'white', margin: '0 0 10px',
            letterSpacing: '0.01em',
          }}>
            Try a colour theme
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 400,
            fontSize: 13, color: 'rgba(255,255,255,0.60)', margin: 0,
            lineHeight: 1.6,
          }}>
            Pick one of the four swatches in the top right to match your brand colours.
          </p>
        </div>

        {/* × close */}
        <span style={{
          color: 'rgba(255,255,255,0.35)', fontSize: 20, lineHeight: 1,
          marginLeft: 4, flexShrink: 0,
        }}>×</span>
      </div>
    </motion.div>
  )
}

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
      position: 'fixed', bottom: 32, left: 32,
      background: '#1a2038', borderRadius: 20,
      padding: '18px 8px', display: 'flex', zIndex: 50,
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
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
  const [started, setStarted] = useState(false)
  const [auditName, setAuditName] = useState('')
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [showToolHint,  setShowToolHint]  = useState(false)
  const [showThemeHint, setShowThemeHint] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const prevIssuesLen = useRef(0)

  const dismissThemeHint = useCallback(() => setShowThemeHint(false), [])
  const dismissToolHint  = useCallback(() => {
    setShowToolHint(false)
    // Chain: show colour-theme hint 1.5 s after the tool hint leaves
    setTimeout(() => setShowThemeHint(true), 1500)
  }, [])

  // When the last issue is cleared: fire celebration directly
  useEffect(() => {
    if (started && prevIssuesLen.current > 0 && issues.length === 0) {
      setShowCelebration(true)
    }
    prevIssuesLen.current = issues.length
  }, [issues.length, started])

  // Show tool-explanation hint shortly after the tree grows in
  useEffect(() => {
    if (!started) return
    const t = setTimeout(() => setShowToolHint(true), 1800)
    return () => clearTimeout(t)
  }, [started])

  function handleStart(name) {
    setAuditName(name)
    setStarted(true)
  }

  function handleCelebrationDismiss() {
    setShowCelebration(false)
    // Reset for a fresh audit
    setStarted(false)
    setAuditName('')
    setIssues([])
    nextId = 1
  }

  function handleCelebrationContinue() {
    // Just close the overlay — keep the current audit open
    setShowCelebration(false)
  }

  function handleThemeChange(t) {
    setTheme(t)
    setShowThemeHint(false)   // discovering a swatch dismisses the hint
  }

  function addIssue({ description, severity, effort }) {
    const id = String(nextId++)
    setIssues(prev => [...prev, { id, description, severity, effort, completed: false }])
  }

  function completeIssue(id) {
    // 1. Close the modal — let its exit animation play (~350 ms)
    setSelectedIssue(null)
    // 2. Remove the issue from state — AnimatePresence in Tree keeps the
    //    Fruit mounted and plays the full 2.8 s fall exit animation automatically
    setTimeout(() => {
      setIssues(prev => prev.filter(issue => issue.id !== id))
    }, 400)
  }

  const openCount = issues.filter(i => !i.completed).length

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: theme.gradient, transition: 'background 0.6s ease' }}>

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
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 800,
            fontSize: 28, letterSpacing: '-0.5px', lineHeight: 1,
            color: theme.bg,
            transition: 'color 0.5s',
          }}>
            UX audit prioritisation tree
          </span>
        </div>

        {/* Subtitle / audit name */}
        <p style={{ color: '#000000', fontSize: 32, lineHeight: 1.2, fontFamily: "'Inter', sans-serif", fontWeight: started ? 700 : 400, flex: 1, textAlign: 'center' }}>
          {started ? auditName : 'Prioritise quick wins and pick off UX debt, one piece at a time'}
        </p>


        {/* Theme swatches */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {THEMES.map(t => (
            <button
              key={t.id}
              title={t.label}
              onClick={() => handleThemeChange(t)}
              style={{
                width: 22, height: 22, borderRadius: '50%',
                background: t.gradient, border: 'none', cursor: 'pointer', padding: 0,
                boxShadow: t.id === theme.id
                  ? `0 0 0 2px white, 0 0 0 4px ${t.bg}`
                  : '0 1px 4px rgba(0,0,0,0.18)',
                transition: 'box-shadow 0.2s',
              }}
            />
          ))}
        </div>

        {/* Open issues badge */}
        {openCount > 0 && (
          <span style={{
            background: theme.gradient,
            color: 'white', borderRadius: 999, padding: '4px 12px',
            fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif",
            boxShadow: `0 2px 8px ${theme.bg}55`,
            whiteSpace: 'nowrap',
            transition: 'background 0.6s ease, box-shadow 0.6s ease',
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
          <IssueForm onAdd={addIssue} theme={theme} />
        </aside>

        {/* Tree panel — transparent so the page gradient shows through the tree cutout */}
        <main style={{
          flex: 1,
          background: 'transparent',
          borderRadius: '20px 20px 0 0',
          overflow: 'visible',
          minHeight: 'calc(100vh - 100px)',
        }}>
          <Tree
            issues={issues}
            onFruitClick={setSelectedIssue}
            onAddClick={() => document.querySelector('textarea')?.focus()}
            theme={theme}
            animateIn={started}
          />
          <StatsBar issues={issues} />
        </main>
      </div>

      <AnimatePresence>
        {selectedIssue && (
          <Modal
            key={selectedIssue.id}
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
            onComplete={completeIssue}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Welcome modal — shown on first load, dismissed on submit */}
      <AnimatePresence>
        {!started && <WelcomeModal onStart={handleStart} />}
      </AnimatePresence>

      {/* Celebration — fires when all issues are cleared */}
      <AnimatePresence>
        {showCelebration && (
          <Celebration
            key="celebration"
            auditName={auditName}
            theme={theme}
            onDismiss={handleCelebrationDismiss}
            onContinue={handleCelebrationContinue}
          />
        )}
      </AnimatePresence>

      {/* Tool explanation tooltip — appears first, after tree grows in */}
      <AnimatePresence>
        {showToolHint && <ToolHint onDismiss={dismissToolHint} />}
      </AnimatePresence>

      {/* Theme discovery tooltip — chained after tool hint dismisses */}
      <AnimatePresence>
        {showThemeHint && <ThemeHint onDismiss={dismissThemeHint} />}
      </AnimatePresence>
    </div>
  )
}
