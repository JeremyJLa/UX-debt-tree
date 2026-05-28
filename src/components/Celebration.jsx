import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'

// ── Paper confetti sound via Web Audio API ───────────────────────────────────
function playConfettiSounds() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // White-noise buffer of a given length
    function noiseBuf(secs) {
      const len  = Math.floor(ctx.sampleRate * secs)
      const buf  = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
      return buf
    }

    // Sustained paper swish — layered bandpass noise
    function swish(time, dur, freq, vol) {
      const src = ctx.createBufferSource()
      src.buffer = noiseBuf(dur)

      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = freq
      bp.Q.value = 1.4

      // Brighten with a high-shelf — gives paper its airy "sshhh" quality
      const hs = ctx.createBiquadFilter()
      hs.type = 'highshelf'
      hs.frequency.value = 5500
      hs.gain.value = 10

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0,         time)
      gain.gain.linearRampToValueAtTime(vol,      time + 0.07)
      gain.gain.setValueAtTime(vol * 0.8, time + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur)

      src.connect(bp); bp.connect(hs); hs.connect(gain); gain.connect(ctx.destination)
      src.start(time)
    }

    // Brief paper crinkle — very short filtered noise burst
    function crinkle(time, freq, vol, pan = 0) {
      const src = ctx.createBufferSource()
      src.buffer = noiseBuf(0.10)

      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = freq
      bp.Q.value = 3.5

      const panner = ctx.createStereoPanner()
      panner.pan.value = pan

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(vol,    time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12)

      src.connect(bp); bp.connect(gain); gain.connect(panner); panner.connect(ctx.destination)
      src.start(time)
    }

    // Three overlapping swish layers — full paper "shhhhh" texture
    swish(now,        3.2, 4000, 0.13)
    swish(now + 0.08, 2.8, 7000, 0.07)
    swish(now + 0.15, 3.0, 2200, 0.06)

    // Individual crinkles scattered across the stereo field
    ;[
      [0.04, 5200,  0.09, -0.7],
      [0.13, 3800,  0.07,  0.5],
      [0.22, 6800,  0.06, -0.3],
      [0.32, 4600,  0.08,  0.8],
      [0.44, 5800,  0.06, -0.6],
      [0.58, 3200,  0.05,  0.4],
      [0.74, 7200,  0.05, -0.5],
      [0.92, 4200,  0.05,  0.6],
      [1.15, 5500,  0.04, -0.4],
      [1.40, 3600,  0.04,  0.3],
      [1.70, 6200,  0.03, -0.6],
      [2.10, 4800,  0.03,  0.5],
    ].forEach(([t, f, v, p]) => crinkle(now + t, f, v, p))

  } catch (_) { /* AudioContext unavailable — fail silently */ }
}

const COLORS = [
  '#DA003E', '#FF6C22', '#F6BC0E',
  '#4ade80', '#60a5fa', '#a78bfa',
  '#f472b6', '#34d399', '#ffffff', '#fbbf24',
]

export default function Celebration({ auditName, theme, onDismiss, onContinue }) {
  const [runConfetti, setRunConfetti] = useState(false)
  const [showCard,    setShowCard]    = useState(false)
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    // Phase 1: fire confetti + sound as soon as overlay appears
    const t1 = setTimeout(() => { setRunConfetti(true); playConfettiSounds() }, 0)
    // Phase 2: after ~3 s of confetti, show the card
    const t2 = setTimeout(() => setShowCard(true), 800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 200 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }}
    >

      {/* Phase 1 — dark overlay fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        onClick={onDismiss}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(6, 7, 14, 0.94)',
          backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
        }}
      />

      {/* Phase 2 — react-confetti burst over the dark overlay */}
      {runConfetti && (
        <Confetti
          width={dims.w}
          height={dims.h}
          numberOfPieces={450}
          recycle={false}
          gravity={0.35}
          initialVelocityY={22}
          initialVelocityX={6}
          colors={COLORS}
          tweenDuration={2000}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        />
      )}

      {/* Phase 3 — modal card springs in after 3.5 s */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            key="card"
            initial={{ scale: 0.55, opacity: 0, y: 32 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                pointerEvents: 'auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 18, textAlign: 'center',
                padding: '44px 52px 40px',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
                borderRadius: 32,
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 32px 96px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              {/* Green tick */}
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 360, damping: 13 }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M8 30l14 14 30-28" stroke="#22c55e" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Inter', sans-serif", fontWeight: 800,
                  fontSize: 'clamp(26px, 3.5vw, 40px)',
                  color: 'white', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.15,
                }}
              >
                Your UX debt is cleared
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.38, duration: 0.45 }}
                style={{
                  fontFamily: "'Inter', sans-serif", fontWeight: 400,
                  fontSize: 16, color: 'rgba(255,255,255,0.55)',
                  margin: 0, marginTop: -10, lineHeight: 1.55,
                }}
              >
                All issues resolved for{' '}
                <span style={{ color: theme?.bg ?? '#a5b4fc', fontWeight: 600 }}>
                  {auditName}
                </span>.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', gap: 12, marginTop: 6 }}
              >
                {/* Primary — start fresh */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onDismiss}
                  style={{
                    padding: '13px 28px', borderRadius: 999,
                    background: 'white', border: 'none',
                    color: '#111827', fontSize: 15, fontWeight: 700,
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                    boxShadow: '0 4px 24px rgba(255,255,255,0.18)',
                  }}
                >
                  Start a new audit
                </motion.button>

                {/* Secondary — keep going */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onContinue}
                  style={{
                    padding: '13px 28px', borderRadius: 999,
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.45)',
                    color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Continue this audit
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
