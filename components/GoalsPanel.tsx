'use client'

import { useState } from 'react'
import { useActivityStore } from '@/store/activityStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, Check, X, TrendingUp, Calendar } from 'lucide-react'

interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  completed: boolean
}

export function GoalsPanel() {
  const { today, weeklyStats } = useActivityStore()
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Reduce Idle Time',
      target: 10,
      current: Math.floor(today.idleTime / 60),
      unit: '%',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
    },
    {
      id: '2',
      title: 'Type 5k Words',
      target: 5000,
      current: Math.floor(today.keystrokes / 5), // Rough estimate
      unit: ' words',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
    },
    {
      id: '3',
      title: 'Maintain 95% Accuracy',
      target: 95,
      current: today.typingAccuracy,
      unit: '%',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
    },
  ])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    unit: '',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })

  const addGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        target: newGoal.target,
        current: 0,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        completed: false,
      }
      setGoals([...goals, goal])
      setNewGoal({ title: '', target: 0, unit: '', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] })
      setShowAddGoal(false)
    }
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const getProgress = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100)
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span>Your Goals</span>
          </h2>
          <motion.button
            onClick={() => setShowAddGoal(!showAddGoal)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        <AnimatePresence>
          {showAddGoal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Target"
                    value={newGoal.target || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Unit (%, words, etc.)"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addGoal}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Goal
                  </button>
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {goals.map((goal, index) => {
            const progress = getProgress(goal)
            const daysLeft = getDaysUntilDeadline(goal.deadline)
            const isOverdue = daysLeft < 0
            const isCompleted = progress >= 100

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${
                  isCompleted
                    ? 'bg-green-50 border-green-300'
                    : isOverdue
                    ? 'bg-red-50 border-red-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-gray-800">{goal.title}</h3>
                      {isCompleted && <Check className="w-5 h-5 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-600">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()}{goal.unit}
                    </p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `${daysLeft} days left`}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{progress.toFixed(1)}% complete</p>
              </motion.div>
            )
          })}
          {goals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No goals yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>Progress Summary</span>
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-600">Active Goals</span>
            <span className="font-bold text-blue-600">{goals.filter(g => !g.completed).length}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-600">Completed</span>
            <span className="font-bold text-green-600">{goals.filter(g => g.completed).length}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <span className="text-sm text-gray-600">Average Progress</span>
            <span className="font-bold text-purple-600">
              {goals.length > 0
                ? (goals.reduce((sum, g) => sum + getProgress(g), 0) / goals.length).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

