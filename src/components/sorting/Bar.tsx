import React from 'react'
import { motion } from 'framer-motion'

interface BarProps {
  value: number
  max: number
  state: 'default' | 'compare' | 'swap' | 'sorted'
  width: number
}

export const Bar: React.FC<BarProps> = ({ value, max, state, width }) => {
  // Height percentage relative to the maximum value in the array
  const heightPercent = Math.max((value / max) * 100, 1)

  // Apple-style color palette
  const getColor = () => {
    switch (state) {
      case 'compare':
        return 'bg-yellow-400 dark:bg-yellow-500 shadow-[0_0_12px_rgba(250,204,21,0.5)]'
      case 'swap':
        return 'bg-red-500 dark:bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
      case 'sorted':
        return 'bg-green-500 dark:bg-green-600 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
      default:
        // Default Apple blue
        return 'bg-blue-500 dark:bg-blue-600'
    }
  }

  return (
    <motion.div
      layout
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      className={`relative rounded-t-sm flex flex-col justify-end items-center ${getColor()}`}
      style={{
        height: `${heightPercent}%`,
        width: `${width}px`,
        minWidth: '4px'
      }}
    >
      {/* Optional: Show value if width allows */}
      {width > 20 && (
        <span className="text-[10px] text-white/90 mb-1 font-medium transform origin-bottom">
          {value}
        </span>
      )}
    </motion.div>
  )
}
