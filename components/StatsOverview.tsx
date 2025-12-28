'use client'

import { useActivityStore } from '@/store/activityStore'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar, TrendingUp, Award, Activity } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export function StatsOverview() {
  const { today, weeklyStats, gamification } = useActivityStore()

  const totalActiveTime = weeklyStats.reduce((sum, stat) => sum + stat.activeTime, 0)
  const totalIdleTime = weeklyStats.reduce((sum, stat) => sum + stat.idleTime, 0)
  const totalCalories = weeklyStats.reduce((sum, stat) => sum + stat.caloriesBurned, 0)
  const avgHealthScore = weeklyStats.length > 0
    ? weeklyStats.reduce((sum, stat) => sum + stat.healthScore, 0) / weeklyStats.length
    : 0

  const pieData = [
    { name: 'Active', value: totalActiveTime, color: '#3b82f6' },
    { name: 'Idle', value: totalIdleTime, color: '#9ca3af' },
  ]

  const chartData = weeklyStats.map(stat => ({
    ...stat,
    date: format(parseISO(stat.date), 'MMM dd'),
  }))

  const stats = [
    {
      label: 'Total Active Time',
      value: `${Math.floor(totalActiveTime / 60)}h ${Math.floor(totalActiveTime % 60)}m`,
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Calories',
      value: totalCalories.toFixed(1),
      icon: Award,
      color: 'from-orange-500 to-red-500',
    },
    {
      label: 'Avg Health Score',
      value: avgHealthScore.toFixed(0),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Current Streak',
      value: `${gamification.currentStreak} days`,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Activity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Weekly Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="activeTime" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="idleTime" fill="#9ca3af" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Stats Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Daily Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Active</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Idle</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Calories</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">WPM</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Accuracy</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Score</th>
              </tr>
            </thead>
            <tbody>
              {weeklyStats.slice().reverse().map((stat, index) => (
                <motion.tr
                  key={stat.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {format(parseISO(stat.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700">
                    {Math.floor(stat.activeTime / 60)}m
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700">
                    {Math.floor(stat.idleTime / 60)}m
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700">
                    {stat.caloriesBurned.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700">
                    {stat.typingSpeed.toFixed(0)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-700">
                    {stat.typingAccuracy.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-gray-800">
                    {stat.healthScore}
                  </td>
                </motion.tr>
              ))}
              {weeklyStats.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No data yet. Start typing to see your stats!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

