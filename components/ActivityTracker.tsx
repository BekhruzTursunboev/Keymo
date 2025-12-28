'use client'

import { useEffect } from 'react'
import { useActivityStore } from '@/store/activityStore'

export function ActivityTracker() {
  const { recordKeystroke, recordMouseMove, setActive } = useActivityStore()

  useEffect(() => {
    // Track keyboard activity
    const handleKeyPress = () => {
      recordKeystroke()
    }

    // Track mouse activity
    const handleMouseMove = () => {
      recordMouseMove()
    }

    // Track visibility changes
    const handleVisibilityChange = () => {
      setActive(!document.hidden)
    }

    // Track focus changes
    const handleFocus = () => setActive(true)
    const handleBlur = () => setActive(false)

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Check for idle time periodically
    const idleInterval = setInterval(() => {
      const state = useActivityStore.getState()
      const now = Date.now()
      const timeSinceLastActivity = now - Math.max(state.lastKeystroke, state.lastMouseMove)
      
      if (timeSinceLastActivity > state.idleThreshold && state.isActive) {
        setActive(false)
        // Add to idle time
        useActivityStore.setState({
          today: {
            ...state.today,
            idleTime: state.today.idleTime + (timeSinceLastActivity / 1000),
          },
        })
      }
    }, 5000) // Check every 5 seconds

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      clearInterval(idleInterval)
    }
  }, [recordKeystroke, recordMouseMove, setActive])

  // Reset daily stats at midnight
  useEffect(() => {
    const resetDailyStats = useActivityStore.getState().resetDailyStats
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime()
    
    const timeout = setTimeout(() => {
      resetDailyStats()
      // Set up daily reset
      setInterval(resetDailyStats, 24 * 60 * 60 * 1000)
    }, msUntilMidnight)

    return () => clearTimeout(timeout)
  }, [])

  return null
}

