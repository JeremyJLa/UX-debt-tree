import { useState } from 'react'

const SEVERITY_OPTIONS = [
  { value: 'showstopper', label: 'Show stopper' },
  { value: 'major',       label: 'Major' },
  { value: 'minor',       label: 'Low-med' },
]

const EFFORT_OPTIONS = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
]

export default function IssueForm({ onAdd }) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Title */}
      <h2 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, sans-serif' }}>
        Create UX debt
      </h2>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-black">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          className={[
            'w-full rounded-lg px-3 py-2.5 text-sm text-gray-800 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-gray-400',
            'transition-all',
            shake ? 'ring-2 ring-red-400' : '',
          ].join(' ')}
          style={{ background: '#f0f0f0', border: 'none' }}
        />
      </div>

      {/* Severity + Effort */}
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Severity"
          value={severity}
          onChange={setSeverity}
          options={SEVERITY_OPTIONS}
          showInfo
        />
        <SelectField
          label="Effort"
          value={effort}
          onChange={setEffort}
          options={EFFORT_OPTIONS}
          showInfo
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full text-white text-base font-semibold py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        style={{
          background: '#000',
          borderRadius: 9999,
        }}
      >
        <CirclePlus />
        Add to tree
      </button>
    </form>
  )
}

function SelectField({ label, value, onChange, options, showInfo }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <label className="text-sm font-semibold text-black">{label}</label>
        {showInfo && <InfoIcon />}
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function InfoIcon() {
  return (
    <span
      className="inline-flex items-center justify-center text-gray-400 border border-gray-400 rounded-full"
      style={{ width: 14, height: 14, fontSize: 9, lineHeight: 1, fontWeight: 700 }}
    >
      i
    </span>
  )
}

function CirclePlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5" />
      <path d="M10 6v8M6 10h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
