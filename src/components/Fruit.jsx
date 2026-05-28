import { useEffect } from 'react'
import { motion, usePresence, useMotionValue, useSpring } from 'framer-motion'

const SEVERITY_COLORS = {
  showstopper: '#DA003E',
  major:       '#FF6C22',
  minor:       '#F6BC0E',
}

export default function Fruit({ issue, position, onClick }) {
  const [isPresent, safeToRemove] = usePresence()
  const fill = SEVERITY_COLORS[issue.severity]
  // Fruit radius varies by effort band: low (easy) = larger, high (hard) = smaller
  const EFFORT_RADIUS = { low: 26, medium: 20, high: 15 }
  const r = EFFORT_RADIUS[issue.effort] ?? 20

  // Deterministic per-fruit offsets so every fruit is out of phase
  const h = issue.id.split('').reduce(
    (acc, c) => (Math.imul(acc ^ c.charCodeAt(0), 2654435761) >>> 0),
    0
  )
  const n1 = h / 0xffffffff
  const n2 = ((h >>> 8)  & 0xff) / 255
  const n3 = ((h >>> 16) & 0xff) / 255

  const swayDuration = 5   + n1 * 3    // 5 – 8 s, very slow
  const swayDelay    = n2  * swayDuration
  const bobDuration  = 2.5 + n3 * 2    // 2.5 – 4.5 s
  const bobDelay     = n1  * bobDuration

  // Hover pull – smooth spring toward cursor
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pullX = useSpring(rawX, { stiffness: 320, damping: 22, mass: 0.4 })
  const pullY = useSpring(rawY, { stiffness: 320, damping: 22, mass: 0.4 })

  function handleMouseMove(e) {
    const svg = e.currentTarget.closest('svg')
    if (!svg) return
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const { x: svgX, y: svgY } = pt.matrixTransform(ctm.inverse())
    const dx = svgX - position.x
    const dy = svgY - position.y
    const dist = Math.hypot(dx, dy) || 1
    // Pull strength: max 7 SVG-px, fades to 0 at 50 px radius
    const strength = 7 * Math.max(0, 1 - dist / 50)
    rawX.set((dx / dist) * strength)
    rawY.set((dy / dist) * strength)
  }

  const stemLength = 36 - r  // keeps stem top pinned at position.y - 36

  // Pivot = branch attachment (top of stem)
  const pivotX = position.x + 2
  const pivotY = position.y - r - stemLength   // = position.y - 36

  // ── Fall physics (all deterministic from seeded hash) ──────────────────────
  // Which side of the tree: right fruits spin CW (+), left fruits spin CCW (-)
  const spinDir    = position.x > 561 ? 1 : -1
  // 35–65° lean — clearly visible, modern restraint (not a full tumble)
  const spinDeg    = spinDir * (35 + n1 * 30)
  // Small snap on detach
  const snapWobble = -spinDir * (3 + n3 * 4)
  // Gentle lateral drift
  const driftX     = spinDir * (10 + n2 * 18)

  // When AnimatePresence wants to remove this component, drive the fall
  // animation manually via animate state, then tell AP it's safe to unmount.
  const animateState = isPresent ? 'visible' : 'gone'

  // Fallback: guarantee safeToRemove fires even if onAnimationComplete
  // doesn't (e.g. if Framer Motion swallows the callback in SVG context).
  useEffect(() => {
    if (!isPresent) {
      const t = setTimeout(() => safeToRemove?.(), 13500)
      return () => clearTimeout(t)
    }
  }, [isPresent, safeToRemove])

  return (
    <motion.g
      initial="hidden"
      animate={animateState}
      variants={{
        hidden: { y: -70, opacity: 0 },
        visible: {
          y: 0, opacity: 1,
          transition: {
            y:       { type: 'spring', stiffness: 380, damping: 13, mass: 0.65 },
            opacity: { duration: 0.18 },
          },
        },
        gone: {
          // 1. Tiny upward float on detach, then gravity
          y:       [0, -10, 1100],
          // 2. Gentle lateral drift
          x:       driftX,
          // 3. Visible lean/tilt as it falls
          rotate:  [0, snapWobble, spinDeg],
          // 4. Pop on detach (grows 15%), then recedes to 60% as it falls away
          scale:   [1, 1.15, 0.60],
          // 5. Fully opaque, then long silky fade
          opacity: [1, 1, 1, 0],
          transition: {
            duration: 13,
            y: {
              times: [0, 0.018, 1],
              ease: ['easeOut', [0.6, 0, 0.9, 0.7]],
            },
            x: {
              ease: [0.4, 0, 0.3, 1],
            },
            rotate: {
              times: [0, 0.02, 1],
              ease:  ['circOut', [0.5, 0, 0.8, 1]],
            },
            scale: {
              // Quick pop at detach, then slow shrink for the rest of the fall
              times: [0, 0.03, 1],
              ease:  ['backOut', [0.4, 0, 0.6, 1]],
            },
            opacity: {
              times: [0, 0.80, 0.98, 1],
            },
          },
        },
      }}
      onAnimationComplete={() => {
        // Once any animation completes while exiting, we're done
        if (!isPresent) safeToRemove?.()
      }}
      style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
      onClick={() => onClick(issue)}
      className="cursor-pointer"
    >

      {/* ── Sway: slow pendulum rotation around branch attachment ── */}
      <motion.g
        animate={isPresent ? { rotate: [0, 2.5, 0, -2.5, 0] } : {}}
        transition={{
          duration:    swayDuration,
          repeat:      Infinity,
          ease:        'easeInOut',
          delay:       swayDelay,
        }}
        style={{ transformOrigin: `${pivotX}px ${pivotY}px` }}
      >

        {/* ── Bob: gentle independent vertical float ── */}
        <motion.g
          animate={isPresent ? { y: [0, 2, 0, -1.5, 0] } : {}}
          transition={{
            duration: bobDuration,
            repeat:   Infinity,
            ease:     'easeInOut',
            delay:    bobDelay,
          }}
        >

          {/* ── Hover pull: drifts toward cursor ── */}
          <motion.g
            style={{ x: pullX, y: pullY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { rawX.set(0); rawY.set(0) }}
          >
            {/* Larger transparent hit area for smooth hover entry */}
            <circle cx={position.x} cy={position.y} r={r + 20} fill="transparent" />

            <line
              x1={position.x}
              y1={position.y - r}
              x2={position.x + 2}
              y2={position.y - r - stemLength}
              stroke="#1a1a18"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <circle cx={position.x} cy={position.y} r={r} fill={fill} stroke="white" strokeWidth={1} />
          </motion.g>

        </motion.g>
      </motion.g>
    </motion.g>
  )
}
