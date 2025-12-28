'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useActivityStore } from '@/store/activityStore'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Target, 
  Zap, 
  Trophy, 
  Settings,
  Clock,
  Keyboard,
  X,
  Minus
} from 'lucide-react'

type ChallengeMode = 'speed' | 'accuracy' | 'endurance' | 'timed'
type TimeLimit = 30 | 60 | 120 | 300 | 600

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Typing is a skill that improves with practice.",
  "Programming is the art of telling a computer what to do. Code is poetry written in logic.",
  "Health and productivity go hand in hand. Small daily improvements lead to significant long-term gains.",
  "Focus and consistency are the keys to success. Every keystroke brings you closer to your goals.",
  "Technology empowers us to track our progress and improve ourselves. Data drives better decisions.",
  "Practice makes perfect. The more you type, the better you become at expressing your thoughts through words.",
  "Typing speed and accuracy are valuable skills in today's digital world. Keep practicing to improve.",
  "Consistency is key. Small daily practice sessions lead to significant improvements over time.",
]

const codingTexts = [
  "function calculateHealthScore(activeTime, idleTime, speed, accuracy) { return score; }",
  "const useActivityStore = create((set) => ({ isActive: false, recordKeystroke: () => {} }));",
  "import { useState, useEffect } from 'react'; export default function Component() { return <div>Hello</div>; }",
  "const handleClick = () => { console.log('Button clicked'); setState(prev => !prev); };",
  "async function fetchData() { const response = await fetch('/api/data'); return response.json(); }",
]

export function TypingChallenge() {
  const [mode, setMode] = useState<ChallengeMode>('speed')
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [errors, setErrors] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(60)
  const [showSettings, setShowSettings] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const pauseTimeRef = useRef<number>(0)
  const { updateTypingStats, addPoints } = useActivityStore()

  const generateText = useCallback(() => {
    const texts = mode === 'endurance' ? [...sampleTexts, ...codingTexts] : sampleTexts
    let selected = texts[Math.floor(Math.random() * texts.length)]
    
    if (mode === 'timed') {
      const multiple = Math.ceil(timeLimit / 30)
      selected = Array(multiple).fill(selected).join(' ')
    }
    
    setText(selected)
    setUserInput('')
    setStartTime(null)
    setIsActive(false)
    setIsPaused(false)
    setIsComplete(false)
    setErrors(0)
    setWpm(0)
    setAccuracy(100)
    setTimeRemaining(mode === 'timed' ? timeLimit : null)
  }, [mode, timeLimit])

  useEffect(() => {
    generateText()
  }, [generateText])

  useEffect(() => {
    if (mode === 'timed' && isActive && !isPaused && timeRemaining !== null && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [mode, isActive, isPaused, timeRemaining])

  useEffect(() => {
    if (isActive && !isPaused && startTime && !isComplete) {
      const interval = setInterval(() => {
        const now = Date.now()
        const pausedTime = pauseTimeRef.current
        const elapsed = (now - startTime - pausedTime) / 1000 / 60
        const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length
        const currentWpm = elapsed > 0 ? wordsTyped / elapsed : 0
        setWpm(Math.round(currentWpm))
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isActive, isPaused, startTime, userInput, isComplete])

  const handleTimeUp = () => {
    setIsComplete(true)
    setIsActive(false)
    const elapsed = (Date.now() - (startTime || Date.now()) - pauseTimeRef.current) / 1000 / 60
    const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length
    const finalWpm = elapsed > 0 ? wordsTyped / elapsed : 0
    
    let errorCount = 0
    const typedLength = Math.min(userInput.length, text.length)
    for (let i = 0; i < typedLength; i++) {
      if (userInput[i] !== text[i]) {
        errorCount++
      }
    }
    const totalChars = Math.max(typedLength, 1)
    const finalAccuracy = ((totalChars - errorCount) / totalChars) * 100
    
    setWpm(Math.round(finalWpm))
    setAccuracy(Math.max(0, finalAccuracy))
    updateTypingStats(finalWpm, finalAccuracy)
    const points = Math.round(finalWpm * 2 + (finalAccuracy / 100) * 50)
    addPoints(points)
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isPaused || isComplete) return
    
    const value = e.target.value
    
    if (!isActive && value.length > 0) {
      setIsActive(true)
      setStartTime(Date.now())
      pauseTimeRef.current = 0
    }

    if (value.length > text.length) return

    setUserInput(value)

    let errorCount = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++
      }
    }
    setErrors(errorCount)

    const totalChars = Math.max(value.length, 1)
    const newAccuracy = ((totalChars - errorCount) / totalChars) * 100
    setAccuracy(Math.max(0, newAccuracy))

    if (mode !== 'timed' && value === text) {
      setIsComplete(true)
      setIsActive(false)
      const elapsed = (Date.now() - (startTime || Date.now()) - pauseTimeRef.current) / 1000 / 60
      const wordsTyped = text.trim().split(/\s+/).length
      const finalWpm = elapsed > 0 ? wordsTyped / elapsed : 0
      setWpm(Math.round(finalWpm))
      updateTypingStats(finalWpm, newAccuracy)
      const points = Math.round(finalWpm * 2 + (newAccuracy / 100) * 50)
      addPoints(points)
    }
  }

  const handlePause = () => {
    if (isComplete) return
    
    if (isPaused) {
      const pauseDuration = Date.now() - pauseTimeRef.current
      pauseTimeRef.current = pauseDuration
      setIsPaused(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else {
      pauseTimeRef.current = Date.now() - (startTime || Date.now()) - pauseTimeRef.current
      setIsPaused(true)
    }
  }

  const handleReset = () => {
    generateText()
    pauseTimeRef.current = 0
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleStop = () => {
    if (isActive && !isComplete) {
      handleTimeUp()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowShortcuts(!showShortcuts)
        return
      }
      if (e.key === 'Escape') {
        setShowSettings(false)
        setShowShortcuts(false)
        return
      }
      if (e.key === ' ' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handlePause()
        return
      }
      if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleReset()
        return
      }
      if (e.key === 's' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        handleStop()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showShortcuts, isPaused, isActive, isComplete])

  const getModeConfig = () => {
    switch (mode) {
      case 'speed':
        return { name: 'Speed', icon: Zap }
      case 'accuracy':
        return { name: 'Accuracy', icon: Target }
      case 'endurance':
        return { name: 'Endurance', icon: Timer }
      case 'timed':
        return { name: 'Timed', icon: Clock }
    }
  }

  const modeConfig = getModeConfig()
  const ModeIcon = modeConfig.icon

  const getCharStatus = (index: number) => {
    if (index >= userInput.length) return 'pending'
    if (userInput[index] === text[index]) return 'correct'
    return 'incorrect'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = text.length > 0 ? (userInput.length / text.length) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Minimalist Mode Selector */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-1">
          {(['speed', 'accuracy', 'endurance', 'timed'] as ChallengeMode[]).map((m) => {
            const config = m === 'speed' 
              ? { name: 'Speed', icon: Zap }
              : m === 'accuracy'
              ? { name: 'Accuracy', icon: Target }
              : m === 'endurance'
              ? { name: 'Endurance', icon: Timer }
              : { name: 'Timed', icon: Clock }
            const Icon = config.icon
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${
                  mode === m
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{config.name}</span>
                {mode === m && (
                  <motion.div
                    layoutId="activeMode"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Shortcuts (Ctrl+K)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-sm w-full border border-gray-200 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-900">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {mode === 'timed' && (
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Time Limit</label>
                  <div className="flex gap-2">
                    {[30, 60, 120, 300, 600].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimeLimit(t as TimeLimit)
                          generateText()
                        }}
                        className={`flex-1 px-3 py-2 text-xs font-medium transition-colors border ${
                          timeLimit === t
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {t}s
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-sm w-full border border-gray-200 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-900">Shortcuts</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'Ctrl/Cmd + K', desc: 'Toggle shortcuts' },
                  { key: 'Ctrl/Cmd + Space', desc: 'Pause/Resume' },
                  { key: 'Ctrl/Cmd + R', desc: 'Reset' },
                  { key: 'Ctrl/Cmd + S', desc: 'Stop' },
                  { key: 'Esc', desc: 'Close modals' },
                ].map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-600">{shortcut.desc}</span>
                    <kbd className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-700">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats - Minimalist */}
      <div className="grid grid-cols-4 gap-6">
        <div>
          <div className="text-3xl font-light text-gray-900 mb-1">{wpm}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">WPM</div>
        </div>
        <div>
          <div className="text-3xl font-light text-gray-900 mb-1">{accuracy.toFixed(1)}%</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Accuracy</div>
        </div>
        <div>
          <div className="text-3xl font-light text-gray-900 mb-1">{errors}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Errors</div>
        </div>
        {(mode === 'timed' || isActive) && (
          <div>
            <div className="text-3xl font-light text-gray-900 mb-1">
              {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Time</div>
          </div>
        )}
      </div>

      {/* Progress Bar - Minimalist */}
      {mode !== 'timed' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-0.5 bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gray-900"
            />
          </div>
        </div>
      )}

      {/* Text Display - Clean & Minimalist */}
      <div className="relative">
        <div className="p-8 bg-gray-50 border border-gray-200 min-h-[200px] max-h-[400px] overflow-y-auto">
          <div className="text-xl leading-relaxed font-mono text-gray-900 select-none">
            {text.split('').map((char, index) => {
              const status = getCharStatus(index)
              const isCurrent = index === userInput.length
              return (
                <span
                  key={index}
                  className={`transition-colors duration-75 ${
                    status === 'correct'
                      ? 'text-gray-400'
                      : status === 'incorrect'
                      ? 'text-red-500 bg-red-50'
                      : isCurrent
                      ? 'text-gray-900 bg-gray-200'
                      : 'text-gray-300'
                  }`}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              )
            })}
          </div>
        </div>

        {/* Paused Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center">
                <Pause className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-xs text-gray-500">Paused</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area - Minimalist */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isComplete) {
              handleReset()
            }
          }}
          disabled={isComplete || isPaused}
          placeholder={isPaused ? "Paused" : "Start typing..."}
          className="w-full p-6 text-lg font-mono bg-white border border-gray-200 focus:border-gray-900 focus:outline-none resize-none min-h-[120px] disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
          autoFocus
        />
      </div>

      {/* Controls - Minimalist */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {isActive && !isComplete && (
            <>
              <button
                onClick={handlePause}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-300"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={handleStop}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-300"
              >
                <Minus className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion - Minimalist */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-gray-50 border border-gray-200"
          >
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-4">
                {wpm} WPM • {accuracy.toFixed(1)}% Accuracy
              </div>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
