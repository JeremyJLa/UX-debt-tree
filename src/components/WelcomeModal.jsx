import { useState } from 'react'
import { motion } from 'framer-motion'

export default function WelcomeModal({ onStart }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onStart(name.trim() || 'My UX Audit')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0, 0, 0, 0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ y: -16, opacity: 0 }}
        transition={{ delay: 0.08, duration: 0.35, ease: 'easeOut' }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 28, width: '100%', maxWidth: 520, textAlign: 'center',
        }}
      >

        {/* Heading + supporting text — shifted up 30 px */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, transform: 'translateY(-30px)' }}>

          {/* Heading */}
          <div style={{ lineHeight: 1 }}>
            <h1 style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 800,
              fontSize: 'clamp(64px, 10vw, 104px)',
              color: 'white', margin: 0, letterSpacing: '-3px', lineHeight: 1,
            }}>
              UX audit
            </h1>
            <h2 style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 52px)',
              color: '#4ade80', margin: 0, letterSpacing: '-1px', lineHeight: 1.15,
            }}>
              prioritisation tree
            </h2>
          </div>

          {/* Supporting text */}
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 400,
            fontSize: 17, color: '#ffffff',
            lineHeight: 1.65, margin: 0, whiteSpace: 'nowrap',
          }}>
            Surface UX friction and identify the low hanging fruit to pick off first.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {/* Audit name input */}
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name your audit"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '15px 22px', borderRadius: 3,
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'white', fontSize: 16, outline: 'none',
              fontFamily: "'Inter', sans-serif",
              textAlign: 'center',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.30)' }}
            onBlur={e =>  { e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}
          />

          {/* CTA button */}
          <button
            type="submit"
            style={{
              width: '100%', padding: '15px 0', borderRadius: 999,
              background: 'white', border: 'none',
              color: '#111827', fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              transition: 'transform 0.1s, box-shadow 0.1s',
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.015)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onMouseDown={e =>  { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e =>    { e.currentTarget.style.transform = 'scale(1.015)' }}
          >
            Let's get started
          </button>
        </form>

      </motion.div>
    </motion.div>
  )
}
