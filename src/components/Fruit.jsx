import { motion, AnimatePresence } from 'framer-motion'

const SEVERITY_COLORS = {
  showstopper: '#ff2d55',
  major:       '#f5a623',
  minor:       '#7ed321',
}

export default function Fruit({ issue, position, onClick }) {
  const fill = SEVERITY_COLORS[issue.severity]
  const r = 20
  const exitRotate = position.x > 561 ? 44 : -44

  return (
    <AnimatePresence>
      {!issue.completed && (
        <motion.g
          key={issue.id}
          initial="hidden"
          animate="visible"
          exit="gone"
          variants={{
            // Drop onto branch from above — bouncy spring landing
            hidden: {
              y: -70,
              opacity: 0,
            },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                y:       { type: 'spring', stiffness: 380, damping: 13, mass: 0.65 },
                opacity: { duration: 0.18 },
              },
            },
            // Gravity fall — accelerating, rotates away from trunk, fades at the very end
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
          <line
            x1={position.x}
            y1={position.y - r}
            x2={position.x + 3}
            y2={position.y - r - 9}
            stroke="#1a1a18"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <circle cx={position.x} cy={position.y} r={r} fill={fill} />
        </motion.g>
      )}
    </AnimatePresence>
  )
}
