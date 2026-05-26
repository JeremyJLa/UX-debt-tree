import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Fruit from './Fruit'
import tree2Png from '../assets/tree2.png'

const BAND = { highEnd: 190, medEnd: 382, lowEnd: 570 }


// Slots are fruit-centre positions in the 1122×889 viewBox.
// slot_y = branch_tip_y + 36 so the stem top (y - r - stem) lands exactly
// on the branch pixel. All positions verified by pixel-scan of tree2.png.
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

const MIN_DIST = 46

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
      const jx = (seeded(issue.id, idx * 3 + 1) - 0.5) * 10
      const jy = (seeded(issue.id, idx * 3 + 2) - 0.5) * 6
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

// Two-line band label rendered in top-left of each band
function BandLabel({ x, y, line1, line2 }) {
  const shared = { fontFamily: 'Inter, sans-serif', x, textAnchor: 'start' }
  return (
    <g>
      <text {...shared} y={y}      fontSize="20" fill="#b0b4bc" fontWeight="400">{line1}</text>
      <text {...shared} y={y + 28} fontSize="22" fill="#374151" fontWeight="700">{line2}</text>
    </g>
  )
}

export default function Tree({ issues, onFruitClick, onAddClick }) {
  const positions = useMemo(() => computePositions(issues), [issues])
  const hasActive = issues.some(i => !i.completed)

  return (
    <div className="w-full h-full min-h-[500px]">
      <svg
        viewBox="0 0 1122 889"
        preserveAspectRatio="xMidYMax meet"
        className="w-full h-full"
        overflow="visible"
      >
        <defs>
          {/* Active: periwinkle-blue fill + slightly darker outline */}
          <filter id="tree-active" colorInterpolationFilters="sRGB" x="-1%" y="-1%" width="102%" height="102%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilated"/>
            <feFlood floodColor="#9aa4bc" result="outlineColor"/>
            <feComposite in="outlineColor" in2="dilated" operator="in" result="outline"/>
            <feColorMatrix type="matrix"
              values="0 0 0 0 0.74  0 0 0 0 0.77  0 0 0 0 0.86  0 0 0 1 0"
              in="SourceGraphic" result="blueFill"/>
            <feMerge>
              <feMergeNode in="outline"/>
              <feMergeNode in="blueFill"/>
            </feMerge>
          </filter>

          {/* Empty: muted, slightly darker periwinkle */}
          <filter id="tree-empty" colorInterpolationFilters="sRGB" x="-1%" y="-1%" width="102%" height="102%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilated"/>
            <feFlood floodColor="#7880a0" result="outlineColor"/>
            <feComposite in="outlineColor" in2="dilated" operator="in" result="outline"/>
            <feColorMatrix type="matrix"
              values="0 0 0 0 0.64  0 0 0 0 0.68  0 0 0 0 0.78  0 0 0 1 0"
              in="SourceGraphic" result="mutedFill"/>
            <feMerge>
              <feMergeNode in="outline"/>
              <feMergeNode in="mutedFill"/>
            </feMerge>
          </filter>
        </defs>

        {/* Solid white base — ensures ground area is white too */}
        <rect x="0" y="0" width="1122" height="889" fill="white" />

        {/* Effort bands — near-white tints */}
        <rect x="0" y="0"            width="1122" height={BAND.highEnd}                fill="#fff3f2" />
        <rect x="0" y={BAND.highEnd} width="1122" height={BAND.medEnd - BAND.highEnd}  fill="#fefef0" />
        <rect x="0" y={BAND.medEnd}  width="1122" height={BAND.lowEnd - BAND.medEnd}   fill="#f2fef5" />
        <line x1="0" y1={BAND.highEnd} x2="1122" y2={BAND.highEnd} stroke="#e8eaed" strokeWidth="1" />
        <line x1="0" y1={BAND.medEnd}  x2="1122" y2={BAND.medEnd}  stroke="#e8eaed" strokeWidth="1" />

        {/* Band labels — always visible, top-left of each band */}
        <BandLabel x={28} y={38}                    line1="Tip hanging fruit"    line2="High dev effort"   />
        <BandLabel x={28} y={BAND.highEnd + 38}     line1="Middle hanging fruit" line2="Medium dev effort" />
        <BandLabel x={28} y={BAND.medEnd  + 38}     line1="Bottom hanging fruit" line2="Low dev effort"    />

        {/* Base white tree — always visible */}
        <image href={tree2Png} x="0" y="0" width="1122" height="889" filter="url(#tree-active)" />

        {/* Empty overlay — fades out when first issue added, fades back when all cleared */}
        <motion.g
          animate={{ opacity: hasActive ? 0 : 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <image href={tree2Png} x="0" y="0" width="1122" height="889" filter="url(#tree-empty)" />
        </motion.g>

        {/* Empty-state copy — visible only when no active issues */}
        <motion.g
          animate={{ opacity: hasActive ? 0 : 1 }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
          style={{ pointerEvents: hasActive ? 'none' : 'auto' }}
        >
          <text x="561" y="752" textAnchor="middle" dominantBaseline="central"
            fill="#9ca3af" fontSize="26" fontFamily="Inter, sans-serif" fontWeight="400">
            You are free of UX debt
          </text>
          <g onClick={onAddClick} style={{ cursor: 'pointer' }}>
            <rect x="436" y="784" width="250" height="52" rx="26" fill="#6366f1" />
            <text x="561" y="810" textAnchor="middle" dominantBaseline="central"
              fill="white" fontSize="20" fontFamily="Inter, sans-serif" fontWeight="600">
              + Add UX issue
            </text>
          </g>
        </motion.g>

        {/* Legend */}
        <g fontFamily="Inter, sans-serif" fontSize="18" fill="#6b7280">
          <circle cx="620"  cy="592" r="10" fill="#ff2d55" />
          <text x="638"  y="592" dominantBaseline="central">Show stopper</text>

          <circle cx="798"  cy="592" r="10" fill="#f5a623" />
          <text x="816"  y="592" dominantBaseline="central">Major issue</text>

          <circle cx="962" cy="592" r="10" fill="#f5c542" />
          <text x="980" y="592" dominantBaseline="central">Low-med issue</text>
        </g>

        {/* Fruit */}
        {issues.map(issue => (
          <Fruit
            key={issue.id}
            issue={issue}
            position={positions[issue.id] ?? { x: 562, y: 300 }}
            onClick={onFruitClick}
          />
        ))}
      </svg>
    </div>
  )
}
