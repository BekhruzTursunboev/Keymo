import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ActivityData {
  activeTime: number // in seconds
  idleTime: number // in seconds
  keystrokes: number
  mouseMovements: number
  caloriesBurned: number
  typingSpeed: number // WPM
  typingAccuracy: number // percentage
  focusStreak: number // consecutive days
  lastActivity: Date
}

export interface DailyStats {
  date: string
  activeTime: number
  idleTime: number
  caloriesBurned: number
  typingSpeed: number
  typingAccuracy: number
  healthScore: number
}

export interface GamificationData {
  points: number
  level: number
  badges: string[]
  currentStreak: number
  bestStreak: number
  totalWordsTyped: number
  achievements: string[]
}

interface ActivityState {
  // Current session
  isActive: boolean
  lastKeystroke: number
  lastMouseMove: number
  idleThreshold: number // milliseconds
  
  // Stats
  today: ActivityData
  weeklyStats: DailyStats[]
  monthlyStats: DailyStats[]
  
  // Gamification
  gamification: GamificationData
  
  // Actions
  setActive: (active: boolean) => void
  recordKeystroke: () => void
  recordMouseMove: () => void
  updateTypingStats: (speed: number, accuracy: number) => void
  calculateCalories: () => void
  updateHealthScore: () => void
  addPoints: (points: number) => void
  checkAchievements: () => void
  resetDailyStats: () => void
}

const calculateCaloriesFromActivity = (
  keystrokes: number,
  mouseMovements: number,
  activeTime: number
): number => {
  // Rough estimation: ~0.1 calories per 100 keystrokes + 0.05 per minute of activity
  const keystrokeCalories = (keystrokes / 100) * 0.1
  const timeCalories = (activeTime / 60) * 0.05
  const mouseCalories = (mouseMovements / 1000) * 0.02
  return keystrokeCalories + timeCalories + mouseCalories
}

const calculateHealthScore = (
  activeTime: number,
  idleTime: number,
  typingSpeed: number,
  typingAccuracy: number
): number => {
  const activeRatio = activeTime / (activeTime + idleTime || 1)
  const speedScore = Math.min(typingSpeed / 60, 1) * 30 // Max 30 points
  const accuracyScore = (typingAccuracy / 100) * 30 // Max 30 points
  const activityScore = activeRatio * 40 // Max 40 points
  return Math.round(speedScore + accuracyScore + activityScore)
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      isActive: false,
      lastKeystroke: Date.now(),
      lastMouseMove: Date.now(),
      idleThreshold: 30000, // 30 seconds

      today: {
        activeTime: 0,
        idleTime: 0,
        keystrokes: 0,
        mouseMovements: 0,
        caloriesBurned: 0,
        typingSpeed: 0,
        typingAccuracy: 0,
        focusStreak: 0,
        lastActivity: new Date(),
      },

      weeklyStats: [],
      monthlyStats: [],

      gamification: {
        points: 0,
        level: 1,
        badges: [],
        currentStreak: 0,
        bestStreak: 0,
        totalWordsTyped: 0,
        achievements: [],
      },

      setActive: (active) => {
        set({ isActive: active })
        if (active) {
          const now = Date.now()
          set({ lastKeystroke: now, lastMouseMove: now })
        }
      },

      recordKeystroke: () => {
        const state = get()
        const now = Date.now()
        const timeSinceLastActivity = now - Math.max(state.lastKeystroke, state.lastMouseMove)
        
        if (timeSinceLastActivity > state.idleThreshold) {
          // Was idle, now active
          set({
            isActive: true,
            lastKeystroke: now,
            today: {
              ...state.today,
              idleTime: state.today.idleTime + timeSinceLastActivity / 1000,
              keystrokes: state.today.keystrokes + 1,
              lastActivity: new Date(),
            },
          })
        } else {
          // Still active
          set({
            lastKeystroke: now,
            today: {
              ...state.today,
              activeTime: state.today.activeTime + 0.1, // Small increment per keystroke
              keystrokes: state.today.keystrokes + 1,
              lastActivity: new Date(),
            },
          })
        }
        
        get().calculateCalories()
        get().addPoints(1)
      },

      recordMouseMove: () => {
        const state = get()
        const now = Date.now()
        const timeSinceLastActivity = now - Math.max(state.lastKeystroke, state.lastMouseMove)
        
        if (timeSinceLastActivity > state.idleThreshold) {
          set({
            isActive: true,
            lastMouseMove: now,
            today: {
              ...state.today,
              idleTime: state.today.idleTime + timeSinceLastActivity / 1000,
              mouseMovements: state.today.mouseMovements + 1,
              lastActivity: new Date(),
            },
          })
        } else {
          set({
            lastMouseMove: now,
            today: {
              ...state.today,
              activeTime: state.today.activeTime + 0.05,
              mouseMovements: state.today.mouseMovements + 1,
              lastActivity: new Date(),
            },
          })
        }
        
        get().calculateCalories()
      },

      updateTypingStats: (speed, accuracy) => {
        const state = get()
        set({
          today: {
            ...state.today,
            typingSpeed: speed,
            typingAccuracy: accuracy,
          },
        })
        get().updateHealthScore()
        get().checkAchievements()
      },

      calculateCalories: () => {
        const state = get()
        const calories = calculateCaloriesFromActivity(
          state.today.keystrokes,
          state.today.mouseMovements,
          state.today.activeTime
        )
        set({
          today: {
            ...state.today,
            caloriesBurned: calories,
          },
        })
      },

      updateHealthScore: () => {
        const state = get()
        const score = calculateHealthScore(
          state.today.activeTime,
          state.today.idleTime,
          state.today.typingSpeed,
          state.today.typingAccuracy
        )
        // Store in weekly stats
        const today = new Date().toISOString().split('T')[0]
        const weeklyStats = [...state.weeklyStats]
        const existingIndex = weeklyStats.findIndex((s) => s.date === today)
        
        const dailyStat: DailyStats = {
          date: today,
          activeTime: state.today.activeTime,
          idleTime: state.today.idleTime,
          caloriesBurned: state.today.caloriesBurned,
          typingSpeed: state.today.typingSpeed,
          typingAccuracy: state.today.typingAccuracy,
          healthScore: score,
        }

        if (existingIndex >= 0) {
          weeklyStats[existingIndex] = dailyStat
        } else {
          weeklyStats.push(dailyStat)
          // Keep only last 7 days
          if (weeklyStats.length > 7) {
            weeklyStats.shift()
          }
        }

        set({ weeklyStats })
      },

      addPoints: (points) => {
        const state = get()
        const newPoints = state.gamification.points + points
        const newLevel = Math.floor(newPoints / 1000) + 1
        
        set({
          gamification: {
            ...state.gamification,
            points: newPoints,
            level: newLevel,
          },
        })
      },

      checkAchievements: () => {
        const state = get()
        const achievements = [...state.gamification.achievements]
        const badges = [...state.gamification.badges]

        // Speed achievements
        if (state.today.typingSpeed >= 100 && !achievements.includes('speed_demon')) {
          achievements.push('speed_demon')
          badges.push('⚡ Speed Demon')
        }
        if (state.today.typingSpeed >= 60 && !achievements.includes('fast_typer')) {
          achievements.push('fast_typer')
          badges.push('🏃 Fast Typer')
        }

        // Accuracy achievements
        if (state.today.typingAccuracy >= 99 && !achievements.includes('perfectionist')) {
          achievements.push('perfectionist')
          badges.push('✨ Perfectionist')
        }
        if (state.today.typingAccuracy >= 95 && !achievements.includes('accurate')) {
          achievements.push('accurate')
          badges.push('🎯 Accurate')
        }

        // Activity achievements
        if (state.today.activeTime >= 3600 && !achievements.includes('active_hour')) {
          achievements.push('active_hour')
          badges.push('🔥 Active Hour')
        }

        set({
          gamification: {
            ...state.gamification,
            achievements,
            badges,
          },
        })
      },

      resetDailyStats: () => {
        const today = new Date().toISOString().split('T')[0]
        const state = get()
        
        // Save today's stats before resetting
        get().updateHealthScore()
        
        set({
          today: {
            activeTime: 0,
            idleTime: 0,
            keystrokes: 0,
            mouseMovements: 0,
            caloriesBurned: 0,
            typingSpeed: 0,
            typingAccuracy: 0,
            focusStreak: state.today.focusStreak,
            lastActivity: new Date(),
          },
        })
      },
    }),
    {
      name: 'keymo-activity-storage',
      partialize: (state) => ({
        ...state,
        today: {
          ...state.today,
          lastActivity: state.today.lastActivity.toISOString(),
        },
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert lastActivity back to Date if it's a string
          if (typeof state.today.lastActivity === 'string') {
            state.today.lastActivity = new Date(state.today.lastActivity)
          }
        }
      },
    }
  )
)

