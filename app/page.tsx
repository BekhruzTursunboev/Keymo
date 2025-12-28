'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/Dashboard'
import { TypingChallenge } from '@/components/TypingChallenge'
import { StatsOverview } from '@/components/StatsOverview'
import { GamificationPanel } from '@/components/GamificationPanel'
import { GoalsPanel } from '@/components/GoalsPanel'
import { HealthTips } from '@/components/HealthTips'
import { motion } from 'framer-motion'
import { Activity, Target, Trophy, Zap } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'typing' | 'stats' | 'goals'>('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'typing', label: 'Typing', icon: Zap },
    { id: 'stats', label: 'Stats', icon: Target },
    { id: 'goals', label: 'Goals', icon: Trophy },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Minimalist Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Keymo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <Zap className="w-4 h-4 text-white" style={{ display: 'none' }} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                  Keymo
                </h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider hidden sm:block">Typing & Health</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <HealthTips />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Minimalist Navigation */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex items-center space-x-1 border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Dashboard />
          </motion.div>
        )}

        {activeTab === 'typing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TypingChallenge />
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StatsOverview />
          </motion.div>
        )}

        {activeTab === 'goals' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GoalsPanel />
              <GamificationPanel />
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
