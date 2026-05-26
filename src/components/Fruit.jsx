import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

const SEVERITY_COLORS = {
  showstopper: '#ff2d55',
  major:       '#f5a623',
  minor:       '#f5c542',   // was '#7ed321'
}

export default function Fruit({ issue, position, onClick }) {
  const fill = SEVERITY_COLORS[issue.severity]
  // Fruit radius varies by effort band: low (easy) = larger, high (hard) = smaller
  const EFFORT_RADIUS = { low: 26, medium: 20, high: 15 }
  const r = EFFORT_RADIUS[issue.effort] ?? 20
  const exitRotate = position.x > 561 ? 44 : -44

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

  return (
    <AnimatePresence>
      {!issue.completed && (
        <motion.g
          key={issue.id}
          initial="hidden"
          animate="visible"
          exit="gone"
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
              y: 1900,
              rotate: exitRotate,
              opacity: [1, 1, 0],
              transition: {
                y:       { duration: 1.45, ease: [0.4, 0, 1, 1] },
                rotate:  { duration: 1.45, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 1.45, times: [0, 0.88, 1] },
              },
            },
          }}
          style={{ transformOrigin: `${position.x}px ${position.y}px` }}
          onClick={() => onClick(issue)}
          className="cursor-pointer"
        >

          {/* ── Sway: slow pendulum rotation around branch attachment ── */}
          <motion.g
            animate={{ rotate: [0, 2.5, 0, -2.5, 0] }}
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
              animate={{ y: [0, 2, 0, -1.5, 0] }}
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
                <circle cx={position.x} cy={position.y} r={r} fill={fill} />
              </motion.g>

            </motion.g>
          </motion.g>
        </motion.g>
      )}
    </AnimatePresence>
  )
}
