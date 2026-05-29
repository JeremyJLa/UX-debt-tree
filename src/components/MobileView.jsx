import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IssueForm from './IssueForm'

// ── Meta ─────────────────────────────────────────────────────────────────────
const SEVERITY_META = {
  showstopper: { label: 'Critical',   color: '#DA003E', bg: '#fff0f3' },
  major:       { label: 'Major',      color: '#FF6C22', bg: '#fff4ee' },
  minor:       { label: 'Low-medium', color: '#ca8a04', bg: '#fefce8' },
}

const EFFORT_META = {
  low:    { label: 'Low effort',    color: '#16a34a', bg: '#f0fdf4' },
  medium: { label: 'Medium effort', color: '#d97706', bg: '#fffbeb' },
  high:   { label: 'High effort',   color: '#dc2626', bg: '#fef2f2' },
}

const SEVERITY_ORDER = { showstopper: 0, major: 1, minor: 2 }

// Effort buckets — drives the list sections
const BUCKETS = [
  { effort: 'low',    label: 'Quick wins',     subtitle: 'Low dev effort',    accent: '#16a34a' },
  { effort: 'medium', label: 'Medium effort',  subtitle: 'Moderate dev work', accent: '#d97706' },
  { effort: 'high',   label: 'High effort',    subtitle: 'Significant dev work', accent: '#ef4444' },
]

// ── Seeded random (for float view) ───────────────────────────────────────────
function seeded(id, offset = 0) {
  let h = offset * 2654435761
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 2654435761)
  return (h >>> 0) / 0xffffffff
}

// Size by effort (diameter in px)
const EFFORT_SIZE = { low: 72, medium: 58, high: 44 }

// ── Engraving / botanical illustration style ──────────────────────────────────
// White chalk lines on dark background.
// Technique: contour hatching (lines follow the 3D form) + cross-hatch shadow
// + dense diagonal fill + highlight strokes on upper-left.

const SK   = 'rgba(255,255,255,0.88)'   // main outline
const SK2  = 'rgba(255,255,255,0.26)'   // ghost second pass
const SH1  = 'rgba(255,255,255,0.17)'   // primary hatching
const SH2  = 'rgba(255,255,255,0.10)'   // secondary / cross-hatch
const STM  = 'rgba(185,145,75,0.92)'    // stem
const LF_S = 'rgba(85,200,100,0.88)'    // leaf stroke
const LF_F = 'rgba(55,155,70,0.14)'     // leaf fill
const HL   = 'rgba(255,255,255,0.55)'   // highlight
const HL2  = 'rgba(255,255,255,0.35)'   // secondary highlight

// ── Apple — showstopper / critical ───────────────────────────────────────────
function AppleSVG({ size, uid }) {
  const cid = `ap-${uid}`
  const body = 'M29 15C22 13 10 18 8 27C6 36 9 48 16 56C21 61 26 64 29 64C32 64 37 61 42 56C49 48 52 36 50 27C48 18 36 13 29 15Z'
  return (
    <svg width={size * 0.88} height={size} viewBox="0 0 58 72" fill="none" overflow="visible">
      <defs>
        <clipPath id={cid}><path d={body}/></clipPath>
      </defs>
      <path d={body} fill="rgba(255,255,255,0.04)"/>
      <g clipPath={`url(#${cid})`}>
        {/* Primary diagonal hatching — covers right 70% */}
        {[14,17,20,23,26,29,32,35,38,41,44,47].map(x => (
          <line key={`p${x}`} x1={x} y1={0} x2={x+28} y2={74}
            stroke={SH1} strokeWidth="0.55"/>
        ))}
        {/* Cross-hatch deepest shadow zone (x > 33) */}
        {[34,38,42,46,50].map(x => (
          <line key={`c${x}`} x1={x} y1={74} x2={x-26} y2={0}
            stroke={SH2} strokeWidth="0.45"/>
        ))}
        {/* Contour lines — curve to follow the right silhouette (key engraving detail) */}
        <path d="M35 16C43 17 50 24 51 32" stroke={SH1} strokeWidth="0.70" fill="none"/>
        <path d="M37 20C45 21 51 29 51 37" stroke={SH1} strokeWidth="0.65" fill="none"/>
        <path d="M39 25C46 26 51 34 51 41" stroke="rgba(255,255,255,0.15)" strokeWidth="0.62" fill="none"/>
        <path d="M40 30C47 31 51 39 50 47" stroke="rgba(255,255,255,0.14)" strokeWidth="0.60" fill="none"/>
        <path d="M40 35C46 37 50 44 49 51" stroke="rgba(255,255,255,0.13)" strokeWidth="0.57" fill="none"/>
        <path d="M39 40C44 42 48 49 47 55" stroke="rgba(255,255,255,0.12)" strokeWidth="0.55" fill="none"/>
        <path d="M37 45C41 47 45 53 44 59" stroke="rgba(255,255,255,0.11)" strokeWidth="0.52" fill="none"/>
        {/* Ghost outline */}
        <path d={body} stroke={SK2} strokeWidth="0.7" fill="none"/>
      </g>
      {/* Main outline */}
      <path d={body} stroke={SK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Apple cleft */}
      <path d="M22 18C26 11 29 15 29 15C29 15 32 11 36 18"
        stroke={SK} strokeWidth="1.35" strokeLinecap="round" fill="none"/>
      {/* Highlights — upper left */}
      <path d="M11 24C13 18 17 17 16 22" stroke={HL}  strokeWidth="0.9"  strokeLinecap="round" fill="none"/>
      <path d="M9 33C11 27 14 26 13 32"   stroke={HL2} strokeWidth="0.75" strokeLinecap="round" fill="none"/>
      {/* Stem */}
      <path d="M29 15C29 9 31.5 6 34.5 5" stroke={STM} strokeWidth="1.9" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M28 13C31 5 41.5 5.5 40 11C38 16 28 13 28 13Z"
        fill={LF_F} stroke={LF_S} strokeWidth="1.0" strokeLinejoin="round"/>
      <path d="M28.5 13C32.5 8.5 40 11"  stroke={LF_S} strokeWidth="0.55" fill="none" opacity="0.70"/>
      <path d="M32 10C32.5 12 32 13.5"   stroke={LF_S} strokeWidth="0.40" fill="none" opacity="0.50"/>
      <path d="M36 9C36.5 11 36 12.5"    stroke={LF_S} strokeWidth="0.40" fill="none" opacity="0.50"/>
    </svg>
  )
}

// ── Orange — major ────────────────────────────────────────────────────────────
function OrangeSVG({ size, uid }) {
  const cid = `or-${uid}`
  const body = 'M30 8C43 8 52 18 52 30C52 43 43 54 30 54C17 54 8 43 8 30C8 18 17 8 30 8Z'
  return (
    <svg width={size} height={size * 0.92} viewBox="0 0 60 58" fill="none" overflow="visible">
      <defs>
        <clipPath id={cid}><path d={body}/></clipPath>
      </defs>
      <path d={body} fill="rgba(255,255,255,0.04)"/>
      <g clipPath={`url(#${cid})`}>
        {/* Primary diagonal hatching */}
        {[16,19,22,25,28,31,34,37,40,43,46,49].map(x => (
          <line key={`p${x}`} x1={x} y1={0} x2={x+26} y2={60}
            stroke={SH1} strokeWidth="0.55"/>
        ))}
        {/* Cross-hatch */}
        {[36,40,44,48].map(x => (
          <line key={`c${x}`} x1={x} y1={60} x2={x-24} y2={0}
            stroke={SH2} strokeWidth="0.45"/>
        ))}
        {/* Contour lines — follow the sphere's right silhouette */}
        <path d="M36 9C44 10 52 19 52 29"  stroke={SH1} strokeWidth="0.70" fill="none"/>
        <path d="M39 12C47 14 53 23 52 32"  stroke={SH1} strokeWidth="0.65" fill="none"/>
        <path d="M41 16C49 19 53 28 52 37"  stroke="rgba(255,255,255,0.15)" strokeWidth="0.62" fill="none"/>
        <path d="M42 21C49 24 52 33 51 42"  stroke="rgba(255,255,255,0.14)" strokeWidth="0.60" fill="none"/>
        <path d="M42 27C48 30 51 38 49 46"  stroke="rgba(255,255,255,0.13)" strokeWidth="0.57" fill="none"/>
        <path d="M41 32C46 35 49 43 47 50"  stroke="rgba(255,255,255,0.12)" strokeWidth="0.55" fill="none"/>
        <path d="M39 37C44 40 46 47 44 53"  stroke="rgba(255,255,255,0.11)" strokeWidth="0.52" fill="none"/>
        {/* Segment lines from centre — very subtle */}
        {[0,45,90,135,180,225,270,315].map(deg => {
          const r = deg * Math.PI / 180
          return <line key={deg} x1="30" y1="31"
            x2={30 + Math.cos(r) * 21} y2={31 + Math.sin(r) * 20}
            stroke="rgba(255,255,255,0.09)" strokeWidth="0.40"/>
        })}
        {/* Ghost outline */}
        <path d={body} stroke={SK2} strokeWidth="0.7" fill="none"/>
      </g>
      {/* Main outline */}
      <path d={body} stroke={SK} strokeWidth="1.6" strokeLinecap="round"/>
      {/* Navel */}
      <path d="M26.5 52C28 55.5 32 55.5 33.5 52"
        stroke={SK} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <ellipse cx="30" cy="52.5" rx="2.5" ry="1.5"
        stroke="rgba(255,255,255,0.50)" strokeWidth="0.65" fill="none"/>
      {/* Highlights */}
      <path d="M12 21C14 15 18 14 17 19" stroke={HL}  strokeWidth="0.9"  strokeLinecap="round" fill="none"/>
      <path d="M10 29C12 23 15 22 14 27"  stroke={HL2} strokeWidth="0.75" strokeLinecap="round" fill="none"/>
      {/* Stem */}
      <path d="M30 8C30 4 32 2 34.5 1.5" stroke={STM} strokeWidth="1.9" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M29.5 7C32.5 0 42 0.5 40.5 6.5C38.5 11.5 29.5 7 29.5 7Z"
        fill={LF_F} stroke={LF_S} strokeWidth="1.0" strokeLinejoin="round"/>
      <path d="M30 7C34 3 40.5 6.5"   stroke={LF_S} strokeWidth="0.55" fill="none" opacity="0.70"/>
      <path d="M33.5 4C34 6 33.5 7.5" stroke={LF_S} strokeWidth="0.40" fill="none" opacity="0.50"/>
      <path d="M37 3C37.5 5 37 6.5"   stroke={LF_S} strokeWidth="0.40" fill="none" opacity="0.50"/>
    </svg>
  )
}

// ── Pear — minor / low-medium ─────────────────────────────────────────────────
function PearSVG({ size, uid }) {
  const cid = `pe-${uid}`
  // Classic pear: narrow rounded neck, wide round belly, smooth waist transition
  const body = 'M22 13C18 13 16 17 16 22C16 26 18 29 22 30C13 34 9 43 9 51C9 62 17 70 29 70C41 70 49 62 49 51C49 43 45 34 36 30C40 29 42 26 42 22C42 17 40 13 36 13C33 11 31 11 29 11C27 11 24 12 22 13Z'
  return (
    <svg width={size * 0.82} height={size} viewBox="0 0 58 78" fill="none" overflow="visible">
      <defs>
        <clipPath id={cid}><path d={body}/></clipPath>
      </defs>
      <path d={body} fill="rgba(255,255,255,0.04)"/>
      <g clipPath={`url(#${cid})`}>
        {/* Primary diagonal hatching */}
        {[12,15,18,21,24,27,30,33,36,39,42,45,48].map(x => (
          <line key={`p${x}`} x1={x} y1={0} x2={x+30} y2={80}
            stroke={SH1} strokeWidth="0.55"/>
        ))}
        {/* Cross-hatch */}
        {[36,40,44,48].map(x => (
          <line key={`c${x}`} x1={x} y1={80} x2={x-28} y2={0}
            stroke={SH2} strokeWidth="0.45"/>
        ))}
        {/* Contour lines — neck, right side */}
        <path d="M34 14C39 15 43 19 42 24"  stroke={SH1} strokeWidth="0.68" fill="none"/>
        <path d="M36 17C41 18 43 22 42 27"  stroke="rgba(255,255,255,0.15)" strokeWidth="0.62" fill="none"/>
        {/* Contour lines — belly, right side */}
        <path d="M37 31C44 35 49 43 49 51"  stroke={SH1} strokeWidth="0.70" fill="none"/>
        <path d="M39 34C46 38 50 46 49 54"  stroke={SH1} strokeWidth="0.65" fill="none"/>
        <path d="M40 38C47 42 50 50 49 58"  stroke="rgba(255,255,255,0.15)" strokeWidth="0.62" fill="none"/>
        <path d="M41 43C47 47 49 55 48 62"  stroke="rgba(255,255,255,0.14)" strokeWidth="0.60" fill="none"/>
        <path d="M40 48C46 52 48 59 47 66"  stroke="rgba(255,255,255,0.13)" strokeWidth="0.57" fill="none"/>
        <path d="M38 53C43 57 45 63 44 69"  stroke="rgba(255,255,255,0.12)" strokeWidth="0.55" fill="none"/>
        {/* Ghost */}
        <path d={body} stroke={SK2} strokeWidth="0.7" fill="none"/>
      </g>
      {/* Main outline */}
      <path d={body} stroke={SK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Bottom belly accent curve */}
      <path d="M12 52C14 60 21 68 29 68"
        stroke="rgba(255,255,255,0.32)" strokeWidth="0.70" fill="none" strokeLinecap="round"/>
      {/* Highlights */}
      <path d="M18 16C20 12 23 12 22 17" stroke={HL}  strokeWidth="0.90" strokeLinecap="round" fill="none"/>
      <path d="M11 40C13 35 17 35 16 40"  stroke={HL}  strokeWidth="0.85" strokeLinecap="round" fill="none"/>
      <path d="M10 49C12 44 15 44 14 49"  stroke={HL2} strokeWidth="0.70" strokeLinecap="round" fill="none"/>
      {/* Stem */}
      <path d="M29 11C29 6 31 3 34 2" stroke={STM} strokeWidth="1.9" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M28 9C31 2 41 2.5 39.5 8.5C37.5 13.5 28 9 28 9Z"
        fill={LF_F} stroke={LF_S} strokeWidth="1.0" strokeLinejoin="round"/>
      <path d="M28.5 9C32.5 5 39.5 8.5"  stroke={LF_S} strokeWidth="0.55" fill="none" opacity="0.70"/>
      <path d="M32 6C32.5 8 32 9.5"      stroke={LF_S} strokeWidth="0.40" fill="none" opacity="0.50"/>
      <path d="M35.5 5C36 7 35.5 8.5"    stroke={LF_S} strokeWidth="0.40" fill="none" opacity="0.50"/>
    </svg>
  )
}

const FRUIT_COMPONENTS = {
  showstopper: AppleSVG,
  major:       OrangeSVG,
  minor:       PearSVG,
}

// ── Floating fruit (float view) ──────────────────────────────────────────────
function FloatingFruit({ issue, onTap }) {
  const n1 = seeded(issue.id, 0), n2 = seeded(issue.id, 1)
  const n3 = seeded(issue.id, 2), n4 = seeded(issue.id, 3)
  const left = 8  + n1 * 78
  const top  = 14 + n2 * 60
  const size   = EFFORT_SIZE[issue.effort] ?? 54
  const FruitSVG = FRUIT_COMPONENTS[issue.severity] ?? OrangeSVG
  const bobAmt = 4 + n3 * 7, bobDur = 2.8 + n4 * 2.5

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, y: 50, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: n2 * 0.1 }}
      onClick={() => onTap(issue)}
      style={{
        position: 'absolute', left: `${left}%`, top: `${top}%`,
        transform: 'translate(-50%, -50%)',
        padding: 10, background: 'none', border: 'none', margin: 0,
        cursor: 'pointer', zIndex: 1,
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      }}
    >
      <motion.div
        animate={{ y: [0, -bobAmt, 0], rotate: [0, n3 > 0.5 ? 1.5 : -1.5, 0] }}
        transition={{ duration: bobDur, repeat: Infinity, ease: 'easeInOut', delay: n1 * bobDur }}
        style={{
          filter: 'drop-shadow(0 6px 18px rgba(255,255,255,0.12))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <FruitSVG size={size} uid={issue.id} />
      </motion.div>
    </motion.button>
  )
}

// ── Issue card (list view) ────────────────────────────────────────────────────
function IssueCard({ issue, onTap, index }) {
  const sev = SEVERITY_META[issue.severity]
  const eff = EFFORT_META[issue.effort]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -14, transition: { duration: 0.16 } }}
      transition={{ delay: index * 0.03, duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onTap(issue)}
      style={{
        background: 'white', borderRadius: 12,
        padding: '13px 14px 12px 17px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 3px 12px rgba(0,0,0,0.04)',
        borderLeft: `3px solid ${sev.color}`,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      }}
    >
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14, fontWeight: 500, color: '#111827',
        margin: '0 0 9px', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {issue.description}
      </p>
      <div style={{ display: 'flex', gap: 5 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
          padding: '3px 8px', borderRadius: 999, background: sev.bg, color: sev.color,
        }}>{sev.label}</span>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
          padding: '3px 8px', borderRadius: 999, background: eff.bg, color: eff.color,
        }}>{eff.label}</span>
      </div>
    </motion.div>
  )
}

// ── Bucket section ────────────────────────────────────────────────────────────
function BucketSection({ bucket, issues, onTap }) {
  const sorted = [...issues].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
  if (sorted.length === 0) return null
  return (
    <div style={{ marginBottom: 6 }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '0 2px', marginBottom: 9,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: bucket.accent, flexShrink: 0 }} />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
          color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {bucket.label}
        </span>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#9ca3af',
        }}>
          · {bucket.subtitle}
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
          color: bucket.accent,
          background: `${bucket.accent}14`,
          padding: '2px 8px', borderRadius: 999,
        }}>
          {sorted.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AnimatePresence mode="popLayout">
          {sorted.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} onTap={onTap} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── View toggle icons ─────────────────────────────────────────────────────────
function ListIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4.5h10M3 8h10M3 11.5h10"
        stroke={active ? '#111827' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function FloatIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4.5" cy="10" r="2.5" fill={active ? '#111827' : '#9ca3af'}/>
      <circle cx="9"   cy="5"  r="2"   fill={active ? '#111827' : '#9ca3af'}/>
      <circle cx="13"  cy="9"  r="3"   fill={active ? '#111827' : '#9ca3af'}/>
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MobileView({ issues, onAdd, onFruitClick, theme, auditName, started }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode,   setViewMode]   = useState('list')   // 'list' | 'float'

  function handleAdd(data) { onAdd(data); setDrawerOpen(false) }

  const active       = issues.filter(i => !i.completed)
  const openCount    = active.length
  const quickWins    = active.filter(i => i.effort === 'low').length
  const showstoppers = active.filter(i => i.severity === 'showstopper').length

  const isFloat = viewMode === 'float'

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: isFloat ? 'linear-gradient(150deg, #1e3a5c 0%, #1a5a84 38%, #169688 68%, #129070 100%)' : '#f2f3f5',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      transition: 'background 0.4s ease',
    }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{
        background: isFloat ? 'rgba(255,255,255,0.12)' : 'white',
        backdropFilter: isFloat ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: isFloat ? 'blur(14px)' : 'none',
        padding: '16px 20px 0',
        flexShrink: 0,
        borderBottom: isFloat ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.06)',
        transition: 'background 0.4s ease',
      }}>
        {/* App label */}
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', margin: '0 0 5px',
          color: isFloat ? 'rgba(255,255,255,0.55)' : '#9ca3af',
          transition: 'color 0.3s',
        }}>
          UX audit tree
        </p>

        {/* Audit name + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h1 style={{
            fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1,
            color: isFloat ? 'white' : '#111827',
            transition: 'color 0.3s',
          }}>
            {started && auditName ? auditName : 'My UX Audit'}
          </h1>

          {/* View toggle */}
          <div style={{
            display: 'flex',
            background: isFloat ? 'rgba(255,255,255,0.15)' : '#f3f4f6',
            borderRadius: 8, padding: 3, gap: 2,
            transition: 'background 0.3s',
          }}>
            {[
              { mode: 'list',  Icon: ListIcon  },
              { mode: 'float', Icon: FloatIcon },
            ].map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 32, height: 28, borderRadius: 6, border: 'none',
                  background: viewMode === mode
                    ? (isFloat ? 'rgba(255,255,255,0.25)' : 'white')
                    : 'transparent',
                  cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: viewMode === mode && !isFloat ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'background 0.15s, box-shadow 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Icon active={viewMode === mode} />
              </button>
            ))}
          </div>
        </div>

        {/* Stats row — list mode only */}
        {!isFloat && (
          <AnimatePresence>
            {openCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: 'flex',
                  borderTop: '1px solid #f3f4f6',
                  marginLeft: -20, marginRight: -20,
                  overflow: 'hidden',
                }}
              >
                {[
                  { label: 'Issues',     value: openCount,    color: theme.bg  },
                  { label: 'Quick wins', value: quickWins,    color: '#16a34a' },
                  { label: 'Critical',   value: showstoppers, color: '#DA003E' },
                ].map((s, i) => (
                  <div key={s.label} style={{
                    flex: 1, padding: '12px 0 14px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    borderRight: i < 2 ? '1px solid #f3f4f6' : 'none',
                  }}>
                    <span style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: s.color, transition: 'color 0.5s' }}>
                      {s.value}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: '#9ca3af', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ── Content area ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isFloat ? (

          /* ── Float view ── */
          <motion.div
            key="float"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
          >
            {/* Centred stats pill */}
            {openCount > 0 && (
              <div style={{
                position: 'absolute', top: 20, left: 0, right: 0,
                display: 'flex', justifyContent: 'center',
                pointerEvents: 'none', zIndex: 5,
              }}>
                <div style={{
                  display: 'flex',
                  background: 'rgba(0,0,0,0.32)',
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  borderRadius: 20, overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                }}>
                  {[
                    { label: 'Issues',     value: openCount    },
                    { label: 'Quick wins', value: quickWins    },
                    { label: 'Critical',   value: showstoppers },
                  ].map((s, i) => (
                    <div key={s.label} style={{
                      padding: '14px 26px',
                      borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active.length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 48px', textAlign: 'center', pointerEvents: 'none' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.65 }}>
                  No issues logged yet.<br />Tap the button below to get started.
                </p>
              </div>
            )}

            <AnimatePresence>
              {active.map(issue => <FloatingFruit key={issue.id} issue={issue} onTap={onFruitClick} />)}
            </AnimatePresence>
          </motion.div>

        ) : (

          /* ── List view ── */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              flex: 1, overflowY: 'auto',
              padding: '16px 16px 110px',
              display: 'flex', flexDirection: 'column', gap: 18,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {active.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 72, gap: 10, textAlign: 'center' }}>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" opacity="0.2">
                  <circle cx="26" cy="26" r="24" stroke="#374151" strokeWidth="2"/>
                  <circle cx="18" cy="26" r="4" fill="#374151"/>
                  <circle cx="26" cy="18" r="3" fill="#374151"/>
                  <circle cx="34" cy="24" r="5" fill="#374151"/>
                </svg>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: 0 }}>No issues yet</p>
                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
                  Tap the button below to log<br />your first UX issue.
                </p>
              </div>
            )}

            {BUCKETS.map(bucket => (
              <BucketSection
                key={bucket.effort}
                bucket={bucket}
                issues={active.filter(i => i.effort === bucket.effort)}
                onTap={onFruitClick}
              />
            ))}
          </motion.div>

        )}
      </AnimatePresence>

      {/* ── FAB ─────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 40px',
        background: isFloat
          ? 'linear-gradient(to top, rgba(10,20,35,0.72) 0%, rgba(10,20,35,0.30) 55%, transparent)'
          : 'linear-gradient(to top, #f2f3f5 55%, transparent)',
        pointerEvents: 'none',
        transition: 'background 0.4s ease',
      }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setDrawerOpen(true)}
          style={{
            width: '100%', padding: '17px 0',
            background: isFloat ? 'white' : (theme?.button ?? theme?.bg ?? '#6366f1'),
            color: isFloat ? '#1a3a5c' : 'white',
            border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, fontFamily: "'Inter', sans-serif",
            cursor: 'pointer',
            boxShadow: isFloat
              ? '0 8px 36px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.20)'
              : '0 4px 20px rgba(0,0,0,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            transition: 'background 0.5s, color 0.5s, box-shadow 0.5s',
            pointerEvents: 'auto',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke={isFloat ? '#1a3a5c' : 'white'} strokeWidth="1.5"/>
            <path d="M8 5v6M5 8h6" stroke={isFloat ? '#1a3a5c' : 'white'} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Log UX issue
        </motion.button>
      </div>

      {/* ── Bottom drawer ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.38)' }}
            />
            <motion.div
              key="mob-drawer"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
                background: 'white', borderRadius: '22px 22px 0 0',
                padding: '0 24px 48px', maxHeight: '88vh', overflowY: 'auto',
                boxShadow: '0 -4px 32px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 2, margin: '14px auto 22px' }} />
              <IssueForm onAdd={handleAdd} theme={theme} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
