import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Fruit from './Fruit'
import tree2Png from '../assets/tree2.png'

const BAND = { highEnd: 190, medEnd: 382, lowEnd: 570 }

// feColorMatrix remaps black pixels (via alpha) to target colour; transparency preserved.
// Format per row: R G B A bias
const FILTER_BROWN = '0 0 0 0.420 0  0 0 0 0.271 0  0 0 0 0.153 0  0 0 0 1 0' // #6B4527
const FILTER_LIGHT = '0 0 0 0.867 0  0 0 0 0.812 0  0 0 0 0.749 0  0 0 0 1 0' // #DDCFBF

const FRUIT_SLOTS = {
  high: [
    { x: 363, y: 48  }, { x: 438, y: 32  }, { x: 498, y: 26  },
    { x: 549, y: 22  }, { x: 603, y: 32  }, { x: 658, y: 50  },
    { x: 728, y: 68  }, { x: 798, y: 84  }, { x: 848, y: 57  },
    { x: 878, y: 102 }, { x: 302, y: 97  }, { x: 254, y: 138 },
    { x: 768, y: 132 }, { x: 478, y: 108 }, { x: 615, y: 80  },
    { x: 330, y: 62  }, { x: 570, y: 55  }, { x: 700, y: 42  },
  ],
  medium: [
    { x: 148, y: 224 }, { x: 208, y: 248 }, { x: 308, y: 258 },
    { x: 388, y: 224 }, { x: 402, y: 282 }, { x: 678, y: 314 },
    { x: 698, y: 218 }, { x: 788, y: 235 }, { x: 885, y: 264 },
    { x: 960, y: 294 }, { x: 1022, y: 334 }, { x: 175, y: 325 },
    { x: 252, y: 364 }, { x: 840, y: 354 }, { x: 930, y: 382 },
    { x: 114, y: 374 }, { x: 470, y: 240 }, { x: 620, y: 248 },
    { x: 740, y: 275 }, { x: 340, y: 310 },
  ],
  low: [
    { x: 94,  y: 424 }, { x: 174, y: 444 }, { x: 252, y: 460 },
    { x: 352, y: 434 }, { x: 452, y: 414 }, { x: 435, y: 450 },
    { x: 704, y: 416 }, { x: 824, y: 444 }, { x: 922, y: 464 },
    { x: 1004, y: 494 }, { x: 164, y: 524 }, { x: 314, y: 534 },
    { x: 722, y: 527 }, { x: 874, y: 524 }, { x: 970, y: 544 },
    { x: 560, y: 438 }, { x: 650, y: 460 }, { x: 490, y: 500 },
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

export default function Tree({ issues, onFruitClick, onAddClick }) {
  const positions = useMemo(() => computePositions(issues), [issues])
  // Start fading the moment the last active issue begins its fall
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
          <filter id="tree-brown" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={FILTER_BROWN} />
          </filter>
          <filter id="tree-light" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={FILTER_LIGHT} />
          </filter>
        </defs>

        {/* Effort bands */}
        <rect x="0" y="0"            width="1122" height={BAND.highEnd}                fill="#fce8e4" />
        <rect x="0" y={BAND.highEnd} width="1122" height={BAND.medEnd - BAND.highEnd}  fill="#f8f4de" />
        <rect x="0" y={BAND.medEnd}  width="1122" height={BAND.lowEnd - BAND.medEnd}   fill="#e8f5e0" />
        <line x1="0" y1={BAND.highEnd} x2="1122" y2={BAND.highEnd} stroke="#d0d0d0" strokeWidth="1" />
        <line x1="0" y1={BAND.medEnd}  x2="1122" y2={BAND.medEnd}  stroke="#d0d0d0" strokeWidth="1" />

        {/* Base tree — always light (#DDCFBF) */}
        <image href={tree2Png} x="0" y="0" width="1122" height="889" filter="url(#tree-light)" />

        {/* Brown overlay — fades out when issues are added, fades back when all cleared */}
        <motion.g
          animate={{ opacity: hasActive ? 0 : 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <image href={tree2Png} x="0" y="0" width="1122" height="889" filter="url(#tree-brown)" />
        </motion.g>

        {/* Empty state — fades in when no active issues */}
        <motion.g
          animate={{ opacity: hasActive ? 0 : 1 }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
          style={{ pointerEvents: hasActive ? 'none' : 'auto' }}
        >
          <text
            x="561" y="752"
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="28"
            fontFamily="Inter, sans-serif"
            fontWeight="400"
          >
            You are free of UX debt
          </text>
          <g onClick={onAddClick} style={{ cursor: 'pointer' }}>
            <rect x="436" y="784" width="250" height="52" rx="26" fill="white" />
            <text
              x="561" y="810"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#3d2210"
              fontSize="20"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
            >
              Add UX issue
            </text>
          </g>
        </motion.g>

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
