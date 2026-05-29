import { useMemo, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import Fruit from './Fruit'
import treeSvg   from '../assets/tree.svg'
import groundSvg from '../assets/ground.svg'

const BAND = { highEnd: 190, medEnd: 382, lowEnd: 590 }

// ── Image geometry ──────────────────────────────────────────────────────────
// tree.svg   726×717  → bottom-aligned (xMidYMax) in its rect so the trunk
//                        pushes all the way down into the buried zone.
// ground.svg 1217×211 → top-aligned + sliced (xMidYMin slice) so its wavy
//                        peak starts exactly at GROUND_Y with no top gap,
//                        and the fill extends to the bottom of the SVG.
//
// All coordinates are in SVG user space (viewBox 0 0 1122 889).

const TREE_W  = 700
const TREE_H  = Math.round(TREE_W * 717 / 726) + 100   // natural height + buried zone
const TREE_X  = Math.round((1122 - TREE_W) / 2)        // = 211 — centred
const TREE_Y  = 20

const GROUND_Y = 710   // ground surface level — 120 px lower than before
const GROUND_H = 889 - GROUND_Y   // = 179 — viewBox headroom below ground

// ── Ground image placement ───────────────────────────────────────────────────
// ground.svg is 1217×211.  The image scale is FIXED at 299/211 (the original
// value when GROUND_Y was 590) so the ground keeps exactly the same visual
// size regardless of where GROUND_Y sits.  Only the y origin moves.
// Peak (x=560.123 in source) is aligned to the tree's pivot x (571).
const GROUND_SCALE = 299 / 211                                    // ≈ 1.417 — fixed
const GROUND_IMG_H = Math.round(211 * GROUND_SCALE)              // = 299
const GROUND_IMG_W = Math.round(1217 * GROUND_SCALE)             // ≈ 1725
const GROUND_IMG_X = Math.round(581 - 560.123 * GROUND_SCALE)   // ≈ −213  (pivot x = 561+20)
// ── ─────────────────────────────────────────────────────────────────────────

// Fruit slots — centre positions in the 1122×889 viewBox (translate group space)
const FRUIT_SLOTS = {
  high: [
    { x: 290, y: 154 }, { x: 338, y: 90  }, { x: 386, y: 84  },
    { x: 426, y: 65  }, { x: 474, y: 55  }, { x: 514, y: 52  },
    { x: 546, y: 54  }, { x: 594, y: 44  }, { x: 618, y: 59  },
    { x: 650, y: 82  }, { x: 682, y: 91  }, { x: 722, y: 95  },
    { x: 754, y: 115 }, { x: 786, y: 90  }, { x: 818, y: 140 },
    { x: 834, y: 163 }, { x: 842, y: 159 }, { x: 858, y: 188 },
  ],
  medium: [
    { x: 186, y: 310 }, { x: 226, y: 227 }, { x: 282, y: 228 },
    { x: 338, y: 254 }, { x: 386, y: 236 }, { x: 434, y: 254 },
    { x: 466, y: 252 }, { x: 506, y: 268 }, { x: 530, y: 227 },
    { x: 546, y: 251 }, { x: 594, y: 243 }, { x: 634, y: 327 },
    { x: 658, y: 235 }, { x: 698, y: 251 }, { x: 730, y: 248 },
    { x: 762, y: 229 }, { x: 802, y: 244 }, { x: 842, y: 234 },
    { x: 866, y: 318 }, { x: 890, y: 289 },
  ],
  low: [
    { x: 202, y: 420 }, { x: 218, y: 444 }, { x: 258, y: 440 },
    { x: 330, y: 422 }, { x: 370, y: 425 }, { x: 410, y: 433 },
    { x: 466, y: 423 }, { x: 498, y: 433 }, { x: 514, y: 439 },
    { x: 562, y: 470 }, { x: 602, y: 459 }, { x: 626, y: 433 },
    { x: 714, y: 445 }, { x: 754, y: 432 }, { x: 770, y: 422 },
    { x: 786, y: 419 }, { x: 866, y: 418 }, { x: 890, y: 449 },
  ],
}

const MIN_DIST = 62

function seeded(id, offset = 0) {
  let h = offset * 2654435761
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 2654435761)
  return (h >>> 0) / 0xffffffff
}

function computePositions(issues) {
  const placed = []
  const result = {}
  for (const issue of issues) {
    const slots = FRUIT_SLOTS[issue.effort]
    const n = slots.length
    const indices = Array.from({ length: n }, (_, i) => i)
      .sort((a, b) => seeded(issue.id, a + 20) - seeded(issue.id, b + 20))
    let chosen = null
    let bestFallback = null
    let bestFallbackDist = -1
    for (const idx of indices) {
      const slot = slots[idx]
      const jx = (seeded(issue.id, idx * 3 + 1) - 0.5) * 4
      const jy = (seeded(issue.id, idx * 3 + 2) - 0.5) * 4
      const candidate = { x: Math.round(slot.x + jx), y: Math.round(slot.y + jy) }
      const minDist = placed.length === 0
        ? Infinity
        : Math.min(...placed.map(p => Math.hypot(p.x - candidate.x, p.y - candidate.y)))
      if (minDist >= MIN_DIST) { chosen = candidate; break }
      if (minDist > bestFallbackDist) { bestFallbackDist = minDist; bestFallback = candidate }
    }
    const pos = chosen ?? bestFallback ?? { x: slots[0].x, y: slots[0].y }
    placed.push(pos)
    result[issue.id] = pos
  }
  return result
}

function BandLabel({ x, y, line1, line2, swap = false, line1Color = '#b0b4bc', line1Size = 20, lineGap = 28 }) {
  const shared = { fontFamily: 'Inter, sans-serif', x, textAnchor: 'start' }
  return swap ? (
    <g>
      <text {...shared} y={y}            fontSize="22" fill="#374151" fontWeight="700">{line2}</text>
      <text {...shared} y={y + lineGap}  fontSize={line1Size} fill={line1Color} fontWeight="400">{line1}</text>
    </g>
  ) : (
    <g>
      <text {...shared} y={y}      fontSize={line1Size} fill={line1Color} fontWeight="400">{line1}</text>
      <text {...shared} y={y + 28} fontSize="22" fill="#374151" fontWeight="700">{line2}</text>
    </g>
  )
}

export default function Tree({ issues, onFruitClick, onAddClick, theme, animateIn }) {
  const positions = useMemo(() => computePositions(issues), [issues])

  // Drive the tree scale via an SVG transform *attribute* — not a CSS property.
  // Framer Motion overrides CSS transformOrigin to 50%/50% on every motion element,
  // which breaks any custom pivot.  Writing the SVG transform attribute directly
  // bypasses that entirely; SVG unitless translate/scale always uses user-unit coords.
  const scaleTarget = useMotionValue(0.04)
  const scale       = useSpring(scaleTarget, { stiffness: 42, damping: 15, mass: 1.4 })
  const treeGRef    = useRef(null)

  // Drive target whenever animateIn flips
  useEffect(() => { scaleTarget.set(animateIn ? 1 : 0.04) }, [animateIn]) // eslint-disable-line

  // On every spring frame, write the SVG attribute directly
  useEffect(() => {
    return scale.on('change', s => {
      const g = treeGRef.current
      if (!g) return
      // translate(pivot*(1-s)+offset, pivot*(1-s)) scale(s)  ≡  scale-around-(561, GROUND_Y) + 20-unit nudge right
      const tx = 561 * (1 - s) + 28
      const ty = GROUND_Y * (1 - s)
      g.setAttribute('transform', `translate(${tx},${ty}) scale(${s})`)
    })
  }, [scale])

  return (
    <div style={{ width: '100%', minHeight: '500px', overflow: 'visible' }}>
      <svg
        viewBox="0 0 1122 889"
        preserveAspectRatio="xMidYMax meet"
        style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          {/* Gradient matches the page background — spans the full SVG area */}
          <linearGradient
            id="tree-fill-grad"
            gradientUnits="userSpaceOnUse"
            x1="0" y1="0"
            x2="1122" y2="889"
          >
            {theme.gradientStops.map(s => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>

          {/* Converts any opaque pixel to white — used inside masks */}
          <filter id="alpha-to-white" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 1 0" />
          </filter>

          {/* Tree mask — bottom-aligned so trunk reaches into the buried zone */}
          <mask id="tree-svg-mask" maskContentUnits="userSpaceOnUse">
            <image href={treeSvg}
              x={TREE_X} y={TREE_Y} width={TREE_W} height={TREE_H}
              preserveAspectRatio="xMidYMax meet"
              filter="url(#alpha-to-white)" />
          </mask>

          {/* Ground mask — peak aligned with tree pivot x (571).
               Image uses the fixed 1.417× scale so size is unchanged.
               White rect starts immediately below the image bottom and
               extends the mask opaque to the screen bottom.               */}
          <mask id="ground-svg-mask" maskContentUnits="userSpaceOnUse">
            <image href={groundSvg}
              x={GROUND_IMG_X} y={GROUND_Y}
              width={GROUND_IMG_W} height={GROUND_IMG_H}
              preserveAspectRatio="none"
              filter="url(#alpha-to-white)" />
            <rect x="0" y={GROUND_Y + GROUND_IMG_H} width="1122" height="5000" fill="white" />
          </mask>
        </defs>

        {/* Solid white base */}
        <rect x="0" y="0" width="1122" height="889" fill="white" />

        {/* Effort bands */}
        <rect x="0" y="0"            width="1122" height={BAND.highEnd}                fill="#fff3f2" />
        <rect x="0" y={BAND.highEnd} width="1122" height={BAND.medEnd - BAND.highEnd}  fill="#fefef0" />
        <rect x="0" y={BAND.medEnd}  width="1122" height={BAND.lowEnd - BAND.medEnd}   fill="#f2fef5" />
        <line x1="0" y1={BAND.highEnd} x2="1122" y2={BAND.highEnd} stroke="#e8eaed" strokeWidth="1" />
        <line x1="0" y1={BAND.medEnd}  x2="1122" y2={BAND.medEnd}  stroke="#e8eaed" strokeWidth="1" />

        {/* Band labels */}
        <BandLabel x={28} y={38}                line1="Top hanging fruit"    line2="High dev effort"   swap line1Color="#111827" line1Size={14} lineGap={24} />
        <BandLabel x={28} y={BAND.highEnd + 38} line1="Middle hanging fruit" line2="Medium dev effort" swap line1Color="#111827" line1Size={14} lineGap={24} />
        <BandLabel x={28} y={BAND.medEnd  + 30} line1="Bottom hanging fruit/quick wins" line2="Low dev effort" swap line1Color="#111827" line1Size={14} lineGap={24} />

        {/* ── Tree + fruits ─────────────────────────────────────────────────────── */}
        {/* Initial transform = translate(561*0.96, GROUND_Y*0.96) scale(0.04)    */}
        {/* i.e. scale-around-(561, GROUND_Y) at 4% — tiny seedling on soil line. */}
        {/* The spring effect above updates this attribute on every frame.          */}
        <g
          ref={treeGRef}
          transform={`translate(${(561 * 0.96 + 28).toFixed(3)},${(GROUND_Y * 0.96).toFixed(3)}) scale(0.04)`}
        >

          {/* Tree silhouette — gradient fill masked to tree.svg shape */}
          <rect
            x={TREE_X} y={TREE_Y} width={TREE_W} height={TREE_H}
            fill="url(#tree-fill-grad)"
            mask="url(#tree-svg-mask)"
          />

          {/* Solid colour overlay — opaque at start, fades as tree grows in */}
          <motion.rect
            x={TREE_X} y={TREE_Y} width={TREE_W} height={TREE_H}
            fill={theme.bg}
            mask="url(#tree-svg-mask)"
            initial={{ opacity: 1 }}
            animate={{ opacity: animateIn ? 0 : 1 }}
            transition={{ delay: 0.35, duration: 1.1, ease: 'easeOut' }}
          />

          {/* Fruit — FRUIT_SLOTS coords are in SVG viewport space */}
          <AnimatePresence>
            {issues.map(issue => (
              <Fruit
                key={issue.id}
                issue={issue}
                position={positions[issue.id] ?? { x: 562, y: 300 }}
                onClick={onFruitClick}
              />
            ))}
          </AnimatePresence>

        </g>


        {/* Legend — static, never animated with the tree */}
        <g fontFamily="Inter, sans-serif" fontSize="13" fill="#6b7280">
          <text x="734" y="642" fontSize="11" fontWeight="600" letterSpacing="0.06em" fill="#9ca3af" textAnchor="start">SEVERITY OF HANGING FRUIT</text>

          <circle cx="744" cy="662" r="8" fill="#DA003E" />
          <text x="758"  y="662" dominantBaseline="central">Critical</text>

          <circle cx="834" cy="662" r="8" fill="#FF6C22" />
          <text x="848"  y="662" dominantBaseline="central">Major</text>

          <circle cx="902" cy="662" r="8" fill="#F6BC0E" />
          <text x="916"  y="662" dominantBaseline="central">Low-medium</text>
        </g>

        {/* ── Ground — static, rendered AFTER tree so it covers the buried trunk.   */}
        {/* height=5000 + white rect in mask → fills to screen bottom seamlessly.  */}
        <rect
          x="0" y={GROUND_Y} width="1122" height="5000"
          fill="url(#tree-fill-grad)"
          mask="url(#ground-svg-mask)"
        />
      </svg>
    </div>
  )
}
