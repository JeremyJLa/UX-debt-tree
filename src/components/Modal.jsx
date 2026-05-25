import { motion, AnimatePresence } from 'framer-motion'

const SEVERITY_META = {
  showstopper: { label: 'Show stopper', color: '#ff2d55' },
  major:       { label: 'Major issue',  color: '#f5a623' },
  minor:       { label: 'Low-med issue', color: '#7ed321' },
}

const EFFORT_META = {
  low:    'Low effort',
  medium: 'Medium effort',
  high:   'High effort',
}

export default function Modal({ issue, onClose, onComplete }) {
  const sev = SEVERITY_META[issue.severity]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />

        <motion.div
          className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
          initial={{ scale: 0.92, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors text-xl leading-none"
          >
            ×
          </button>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Issue</p>
            <p className="text-gray-900 text-base leading-snug">{issue.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white"
              style={{ background: sev.color }}
            >
              {sev.label}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
              {EFFORT_META[issue.effort]}
            </span>
          </div>

          <button
            onClick={() => onComplete(issue.id)}
            className="w-full text-white font-semibold py-3 text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
            style={{ background: '#000', borderRadius: 9999 }}
          >
            <span>✓</span>
            Mark as complete
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
