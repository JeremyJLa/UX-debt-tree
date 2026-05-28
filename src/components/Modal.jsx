import { motion } from 'framer-motion'

const SEVERITY_META = {
  showstopper: { label: 'Critical',    color: '#DA003E', bg: '#fff0f3' },
  major:       { label: 'Major',       color: '#FF6C22', bg: '#fff4ee' },
  minor:       { label: 'Low-medium',  color: '#c49200', bg: '#fef9e7' },
}

const EFFORT_META = {
  low:    { label: 'Low effort',    color: '#4ade80', bg: '#f0fdf4' },
  medium: { label: 'Medium effort', color: '#fbbf24', bg: '#fffbeb' },
  high:   { label: 'High effort',   color: '#f87171', bg: '#fef2f2' },
}

export default function Modal({ issue, onClose, onComplete, theme }) {
  const sev = SEVERITY_META[issue.severity]
  const eff = EFFORT_META[issue.effort]

  return (
    <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/20" />

        <motion.div
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: 360,
            background: 'white', borderRadius: 20,
            boxShadow: '0 20px 60px rgba(99,102,241,0.2), 0 4px 16px rgba(0,0,0,0.08)',
            padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
          }}
          initial={{ scale: 0.93, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
          transition={{ type: 'spring', stiffness: 520, damping: 30, mass: 0.8 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Theme-coloured top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: theme?.button ?? theme?.bg ?? 'linear-gradient(to right, #6366f1, #8b5cf6)', borderRadius: '20px 20px 0 0' }} />

          {/* Close */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            width: 28, height: 28, borderRadius: '50%',
            border: 'none', background: '#f3f4f6', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: '#6b7280', lineHeight: 1,
          }}>
            ×
          </button>

          {/* Issue text */}
          <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>UX Issue</p>
            <p style={{ fontSize: 15, color: '#111827', lineHeight: 1.55, fontFamily: "'Inter', sans-serif" }}>{issue.description}</p>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 999, background: sev.bg, color: sev.color, fontFamily: "'Inter', sans-serif" }}>
              {sev.label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 999, background: eff.bg, color: eff.color, fontFamily: "'Inter', sans-serif" }}>
              {eff.label}
            </span>
          </div>

          {/* Complete button */}
          <button
            onClick={() => onComplete(issue.id)}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 999, border: 'none',
              background: theme?.button ?? theme?.bg ?? '#6366f1',
              color: 'white', fontFamily: "'Inter', sans-serif",
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
              transition: 'background 0.5s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5"/>
              <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Mark as complete
          </button>
        </motion.div>
      </motion.div>
  )
}
