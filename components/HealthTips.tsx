'use client'

import { useState, useEffect } from 'react'
import { useActivityStore } from '@/store/activityStore'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const healthTips = [
  {
    id: 'stretch',
    message: 'Take a 2-minute stretch break. You\'ve been typing for a while.',
    condition: (state: any) => state.today.activeTime > 1200,
    action: 'Stretch your wrists and fingers',
  },
  {
    id: 'water',
    message: 'Stay hydrated. Take a water break.',
    condition: (state: any) => state.today.activeTime > 1800,
    action: 'Drink some water',
  },
  {
    id: 'posture',
    message: 'Check your posture. Sit up straight and relax your shoulders.',
    condition: (state: any) => state.today.activeTime > 2400,
    action: 'Adjust your posture',
  },
  {
    id: 'eye_break',
    message: 'Follow the 20-20-20 rule: Look at something 20 feet away for 20 seconds.',
    condition: (state: any) => state.today.activeTime > 3000,
    action: 'Rest your eyes',
  },
  {
    id: 'speed_boost',
    message: 'Try a 3-minute high-speed typing session to boost your activity.',
    condition: (state: any) => state.today.idleTime > state.today.activeTime && state.today.idleTime > 600,
    action: 'Start typing challenge',
  },
  {
    id: 'accuracy_focus',
    message: 'Focus on accuracy. Slow down and aim for 95%+ accuracy.',
    condition: (state: any) => state.today.typingAccuracy > 0 && state.today.typingAccuracy < 90,
    action: 'Practice accuracy mode',
  },
  {
    id: 'consistency',
    message: 'Great consistency. Keep up the good work.',
    condition: (state: any) => state.gamification.currentStreak >= 3,
    action: 'Maintain your streak',
  },
]

export function HealthTips() {
  const [currentTip, setCurrentTip] = useState<typeof healthTips[0] | null>(null)
  const [dismissedTips, setDismissedTips] = useState<string[]>([])
  const state = useActivityStore()

  useEffect(() => {
    const interval = setInterval(() => {
      const availableTips = healthTips.filter(
        tip => 
          !dismissedTips.includes(tip.id) &&
          tip.condition(state)
      )

      if (availableTips.length > 0 && !currentTip) {
        const tip = availableTips[Math.floor(Math.random() * availableTips.length)]
        setCurrentTip(tip)
        
        setTimeout(() => {
          setCurrentTip(null)
        }, 10000)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [state, dismissedTips, currentTip])

  const dismissTip = () => {
    if (currentTip) {
      setDismissedTips([...dismissedTips, currentTip.id])
      setCurrentTip(null)
    }
  }

  return (
    <AnimatePresence>
      {currentTip && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 right-6 z-50 max-w-sm"
        >
          <div className="bg-white border border-gray-200 shadow-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <p className="text-sm text-gray-900 mb-1">{currentTip.message}</p>
                <p className="text-xs text-gray-400">{currentTip.action}</p>
              </div>
              <button
                onClick={dismissTip}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
