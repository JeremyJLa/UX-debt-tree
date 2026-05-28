import { motion } from 'framer-motion'

// Four distinct leaf silhouettes centred at (0,0)
const LEAF_SHAPES = [
  {
    body: "M0,-14 C7,-13 13,-6 13,2 C13,9 7,13 0,14 C-7,13 -13,9 -13,2 C-13,-6 -7,-13 0,-14 Z",
    vein: "M0,-13 Q1,0 0,13",
  },
  {
    body: "M0,-16 C4,-11 10,-4 10,2 C10,8 5,12 0,13 C-5,12 -10,8 -10,2 C-10,-4 -4,-11 0,-16 Z",
    vein: "M0,-15 Q0.8,0 0,12",
  },
  {
    body: "M0,-10 C9,-13 15,-5 15,2 C15,8 9,12 0,12 C-9,12 -15,8 -15,2 C-15,-5 -9,-13 0,-10 Z",
    vein: "M0,-9 Q1,0 0,11",
  },
  {
    body: "M0,-17 C3,-12 6,-5 6,1 C6,7 3,12 0,15 C-3,12 -6,7 -6,1 C-6,-5 -3,-12 0,-17 Z",
    vein: "M0,-16 Q0.5,0 0,14",
  },
]

const COLORS = [
  '#22c55e', '#16a34a', '#86efac',
  '#f59e0b', '#f97316', '#ef4444',
  '#eab308', '#dc2626', '#ca8a04',
  '#4ade80', '#fb923c', '#fde047',
]

const POSITIONS = [
  // High band
  { x: 594, y: 44  }, { x: 474, y: 55  }, { x: 514, y: 52  },
  { x: 426, y: 65  }, { x: 650, y: 82  }, { x: 722, y: 95  },
  { x: 338, y: 90  }, { x: 786, y: 90  }, { x: 818, y: 140 },
  // Medium band
  { x: 506, y: 268 }, { x: 530, y: 227 }, { x: 658, y: 235 },
  { x: 386, y: 236 }, { x: 762, y: 229 }, { x: 226, y: 227 },
  { x: 698, y: 251 }, { x: 434, y: 254 }, { x: 842, y: 234 },
  { x: 890, y: 289 }, { x: 186, y: 310 },
  // Low band
  { x: 498, y: 433 }, { x: 562, y: 470 }, { x: 626, y: 433 },
  { x: 330, y: 422 }, { x: 754, y: 432 }, { x: 218, y: 444 },
  { x: 866, y: 418 }, { x: 410, y: 433 }, { x: 786, y: 419 },
]

function seeded(i, offset) {
  let h = (i * 7 + offset) * 2654435761
  return (h >>> 0) / 0xffffffff
}

function darken(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, ((n >> 16) & 0xff) - 45)
  const g = Math.max(0, ((n >>  8) & 0xff) - 45)
  const b = Math.max(0,  (n        & 0xff) - 45)
  return `rgb(${r},${g},${b})`
}

export default function LeafFlourish() {
  return (
    <>
      {POSITIONS.map((pos, i) => {
        const shape     = LEAF_SHAPES[Math.floor(seeded(i, 1) * LEAF_SHAPES.length)]
        const color     = COLORS[Math.floor(seeded(i, 2) * COLORS.length)]
        const rotation  = seeded(i, 3) * 340 - 170
        const sizeScale = 1.5 + seeded(i, 4) * 1.2   // 1.5–2.7×
        const delay     = seeded(i, 5) * 0.65

        return (
          // ── Outer plain <g> uses SVG attribute transform for user-unit
          //    positioning (immune to the CSS-vs-SVG coordinate mismatch).
          <g
            key={i}
            transform={`translate(${pos.x},${pos.y}) rotate(${rotation}) scale(${sizeScale})`}
          >
            {/* ── Inner motion.g handles ONLY scale + opacity animation,
                   centred on its own fill-box so the pivot is always correct. */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
              exit={{
                scale: 0, opacity: 0,
                transition: { duration: 0.3, delay: seeded(i, 6) * 0.15 },
              }}
              transition={{
                delay,
                duration: 0.45,
                ease: 'backOut',
                opacity: { duration: 0.2, delay },
              }}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            >
              <path
                d={shape.body}
                fill={color}
                stroke={darken(color)}
                strokeWidth="0.7"
                opacity="0.95"
              />
              <path
                d={shape.vein}
                fill="none"
                stroke={darken(color)}
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.55"
              />
              <line x1="0" y1="-3" x2="-8" y2="4"
                stroke={darken(color)} strokeWidth="0.5"
                strokeLinecap="round" opacity="0.35" />
              <line x1="0" y1="-3" x2="8"  y2="4"
                stroke={darken(color)} strokeWidth="0.5"
                strokeLinecap="round" opacity="0.35" />
            </motion.g>
          </g>
        )
      })}
    </>
  )
}
