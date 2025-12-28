'use client'

import { useActivityStore } from '@/store/activityStore'
import { motion } from 'framer-motion'
import { Trophy, Star, Award, Flame, Target, Zap } from 'lucide-react'

export function GamificationPanel() {
  const { gamification } = useActivityStore()

  const levelProgress = (gamification.points % 1000) / 10
  const nextLevelPoints = 1000 - (gamification.points % 1000)

  const achievements = [
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Reach 100+ WPM', icon: Zap, color: 'from-yellow-400 to-orange-500' },
    { id: 'fast_typer', name: 'Fast Typer', desc: 'Reach 60+ WPM', icon: Target, color: 'from-blue-400 to-cyan-500' },
    { id: 'perfectionist', name: 'Perfectionist', desc: '99%+ Accuracy', icon: Star, color: 'from-purple-400 to-pink-500' },
    { id: 'accurate', name: 'Accurate', desc: '95%+ Accuracy', icon: Award, color: 'from-green-400 to-emerald-500' },
    { id: 'active_hour', name: 'Active Hour', desc: '1+ hour active', icon: Flame, color: 'from-red-400 to-orange-500' },
  ]

  const unlockedAchievements = achievements.filter(ach => 
    gamification.achievements.includes(ach.id)
  )

  const lockedAchievements = achievements.filter(ach => 
    !gamification.achievements.includes(ach.id)
  )

  return (
    <div className="space-y-6">
      {/* Level & Points Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Current Level</p>
            <p className="text-5xl font-bold">{gamification.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90 mb-1">Total Points</p>
            <p className="text-3xl font-bold">{gamification.points.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress to Level {gamification.level + 1}</span>
            <span>{nextLevelPoints} points needed</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="text-center">
            <Flame className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{gamification.currentStreak}</p>
            <p className="text-xs opacity-90">Day Streak</p>
          </div>
          <div className="text-center">
            <Trophy className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{gamification.bestStreak}</p>
            <p className="text-xs opacity-90">Best Streak</p>
          </div>
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-1" />
            <p className="text-2xl font-bold">{gamification.totalWordsTyped.toLocaleString()}</p>
            <p className="text-xs opacity-90">Words Typed</p>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span>Your Badges</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {gamification.badges.length > 0 ? (
            gamification.badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white font-medium shadow-md"
              >
                {badge}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No badges yet. Keep typing to earn them!</p>
          )}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-purple-500" />
          <span>Achievements</span>
        </h2>
        <div className="space-y-3">
          {unlockedAchievements.map((ach, index) => {
            const Icon = ach.icon
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl bg-gradient-to-r ${ach.color} text-white shadow-md`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6" />
                  <div>
                    <p className="font-bold">{ach.name}</p>
                    <p className="text-sm opacity-90">{ach.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
          {lockedAchievements.map((ach, index) => {
            const Icon = ach.icon
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (unlockedAchievements.length + index) * 0.1 }}
                className="p-4 rounded-xl bg-gray-100 text-gray-400"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6" />
                  <div>
                    <p className="font-bold">{ach.name}</p>
                    <p className="text-sm">{ach.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

