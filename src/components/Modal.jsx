import { motion, AnimatePresence } from 'framer-motion'

const SEVERITY_META = {
  showstopper: { label: 'Show stopper', color: '#ef4444', bg: '#fef2f2' },
  major:       { label: 'Major issue',  color: '#f59e0b', bg: '#fffbeb' },
  minor:       { label: 'Low-med issue', color: '#f5c542', bg: '#fefce8' },
}

const EFFORT_META = {
  low:    { label: 'Low effort',    color: '#4ade80', bg: '#f0fdf4' },
  medium: { label: 'Medium effort', color: '#fbbf24', bg: '#fffbeb' },
  high:   { label: 'High effort',   color: '#f87171', bg: '#fef2f2' },
}

export default function Modal({ issue, onClose, onComplete }) {
  const sev = SEVERITY_META[issue.severity]
  const eff = EFFORT_META[issue.effort]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

        <motion.div
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: 360,
            background: 'white', borderRadius: 20,
            boxShadow: '0 20px 60px rgba(99,102,241,0.2), 0 4px 16px rgba(0,0,0,0.08)',
            padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
          }}
          initial={{ scale: 0.92, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Indigo top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #6366f1, #8b5cf6)', borderRadius: '20px 20px 0 0' }} />

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
              width: '100%', padding: '12px 0', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white', fontFamily: "'Inter', sans-serif",
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(99,102,241,0.40)',
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
    </AnimatePresence>
  )
}
