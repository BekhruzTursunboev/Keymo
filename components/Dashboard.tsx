'use client'

import { useActivityStore } from '@/store/activityStore'
import { motion } from 'framer-motion'
import { Activity, Clock, Flame, Target, TrendingUp, Zap } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDistanceToNow } from 'date-fns'

export function Dashboard() {
  const { today, weeklyStats, gamification } = useActivityStore()

  const activeMinutes = Math.floor(today.activeTime / 60)
  const idleMinutes = Math.floor(today.idleTime / 60)
  const totalMinutes = activeMinutes + idleMinutes
  const activePercentage = totalMinutes > 0 ? (activeMinutes / totalMinutes) * 100 : 0

  const healthScore = weeklyStats.length > 0 
    ? weeklyStats[weeklyStats.length - 1].healthScore 
    : 0

  const stats = [
    {
      label: 'Active',
      value: `${activeMinutes}m`,
      subValue: `${Math.floor(today.activeTime % 60)}s`,
      icon: Activity,
    },
    {
      label: 'Idle',
      value: `${idleMinutes}m`,
      subValue: `${Math.floor(today.idleTime % 60)}s`,
      icon: Clock,
    },
    {
      label: 'Calories',
      value: today.caloriesBurned.toFixed(1),
      subValue: 'kcal',
      icon: Flame,
    },
    {
      label: 'Score',
      value: healthScore,
      subValue: '/ 100',
      icon: Target,
    },
  ]

  return (
    <div className="space-y-12">
      {/* Minimalist Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 text-gray-400">
                <Icon className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-4xl font-light text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.subValue}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts - Minimalist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Weekly Activity</h3>
          </div>
          <div className="border border-gray-200 p-6">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyStats} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="activeTime" 
                  stroke="#0f172a" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#colorActive)" 
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke="#cbd5e1"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#cbd5e1"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Health Score</h3>
          </div>
          <div className="border border-gray-200 p-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyStats} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Line 
                  type="monotone" 
                  dataKey="healthScore" 
                  stroke="#0f172a" 
                  strokeWidth={2}
                  dot={{ fill: '#0f172a', r: 3 }}
                />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke="#cbd5e1"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#cbd5e1"
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Activity - Minimalist */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Activity</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border border-gray-200 p-6">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Keystrokes</div>
            <div className="text-2xl font-light text-gray-900">{today.keystrokes.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Mouse Moves</div>
            <div className="text-2xl font-light text-gray-900">{today.mouseMovements.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">WPM</div>
            <div className="text-2xl font-light text-gray-900">{today.typingSpeed.toFixed(0)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Accuracy</div>
            <div className="text-2xl font-light text-gray-900">{today.typingAccuracy.toFixed(1)}%</div>
          </div>
        </div>
        {today.lastActivity && (
          <div className="text-xs text-gray-400 text-right">
            Last activity: {formatDistanceToNow(
              typeof today.lastActivity === 'string' 
                ? new Date(today.lastActivity) 
                : today.lastActivity, 
              { addSuffix: true }
            )}
          </div>
        )}
      </div>

      {/* Gamification - Minimalist */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Level {gamification.level}</div>
            <div className="text-3xl font-light text-gray-900">{gamification.points.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-2">Points</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Streak</div>
            <div className="text-2xl font-light text-gray-900">{gamification.currentStreak}</div>
            <div className="text-xs text-gray-400">days</div>
          </div>
        </div>
      </div>
    </div>
  )
}
