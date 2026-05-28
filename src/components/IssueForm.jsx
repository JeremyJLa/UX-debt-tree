import { useState } from 'react'

const SEVERITY_OPTIONS = [
  { value: 'showstopper', label: 'Critical', color: '#ef4444', bg: '#fef2f2' },
  { value: 'major',       label: 'Major',    color: '#f59e0b', bg: '#fffbeb' },
  { value: 'minor',       label: 'Low-med',    color: '#ca8a04', bg: '#fefce8' },
]

const EFFORT_OPTIONS = [
  { value: 'high',   label: 'High',   color: '#f87171', bg: '#fef2f2' },
  { value: 'medium', label: 'Medium', color: '#fbbf24', bg: '#fffbeb' },
  { value: 'low',    label: 'Low',    color: '#4ade80', bg: '#f0fdf4' },
]

const FIELD_LABEL_STYLE = {
  fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
  textTransform: 'uppercase', color: '#9ca3af',
  fontFamily: "'Inter', sans-serif", marginBottom: 7, display: 'block',
}

const PILL_BASE = {
  flex: 1, padding: '7px 4px', borderRadius: 999,
  border: '1.5px solid #e5e7eb', background: 'white',
  fontSize: 11, fontWeight: 500, cursor: 'pointer',
  transition: 'all 0.15s ease', fontFamily: "'Inter', sans-serif",
  color: '#6b7280',
}

export default function IssueForm({ onAdd, theme }) {
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('major')
  const [effort, setEffort] = useState('low')
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim()) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    onAdd({ description: description.trim(), severity, effort })
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Title with accent bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ width: 4, height: 22, background: theme?.bg ?? '#6366f1', borderRadius: 2, flexShrink: 0, transition: 'background 0.5s' }} />
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 17, color: '#111827', margin: 0 }}>
          Log UX issue
        </h2>
      </div>

      {/* Description */}
      <div>
        <label style={FIELD_LABEL_STYLE}>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          placeholder="Describe the UX issue…"
          style={{
            width: '100%', boxSizing: 'border-box',
            borderRadius: 12, padding: '10px 12px',
            fontSize: 13, color: '#374151', resize: 'none',
            background: '#f9fafb',
            border: shake ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb',
            outline: 'none', fontFamily: "'Inter', sans-serif",
            transition: 'border-color 0.15s, box-shadow 0.15s',
            lineHeight: 1.55,
          }}
          onFocus={e => { e.target.style.borderColor = theme?.bg ?? '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.08)' }}
          onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
        />
      </div>

      {/* Severity pills */}
      <div>
        <label style={FIELD_LABEL_STYLE}>Severity</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {SEVERITY_OPTIONS.map(opt => (
            <button key={opt.value} type="button" onClick={() => setSeverity(opt.value)}
              style={{
                ...PILL_BASE,
                border: `1.5px solid ${severity === opt.value ? opt.color : '#e5e7eb'}`,
                background: severity === opt.value ? opt.bg : 'white',
                color: severity === opt.value ? opt.color : '#6b7280',
                fontWeight: severity === opt.value ? 700 : 500,
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Effort pills */}
      <div>
        <label style={FIELD_LABEL_STYLE}>Dev effort</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {EFFORT_OPTIONS.map(opt => (
            <button key={opt.value} type="button" onClick={() => setEffort(opt.value)}
              style={{
                ...PILL_BASE,
                border: `1.5px solid ${effort === opt.value ? opt.color : '#e5e7eb'}`,
                background: effort === opt.value ? opt.bg : 'white',
                color: effort === opt.value ? opt.color : '#6b7280',
                fontWeight: effort === opt.value ? 700 : 500,
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        style={{
          width: '100%', padding: '12px 0',
          background: theme?.button ?? theme?.bg ?? '#6366f1',
          color: 'white', borderRadius: 999, border: 'none',
          fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
          transition: 'transform 0.1s, box-shadow 0.1s, background 0.5s',
        }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.18)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.22)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.22)' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5"/>
          <path d="M8 5v6M5 8h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add to tree
      </button>

    </form>
  )
}
