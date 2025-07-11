
import { useState, useEffect, useRef } from 'react'
import { localStorageService } from '../utils/localStorage'

export default function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
    const [isActive, setIsActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [sessionType, setSessionType] = useState('work') // 'work' or 'break'
    const [showBreakPrompt, setShowBreakPrompt] = useState(false)
    const [sessions, setSessions] = useState([])
    const [settings, setSettings] = useState({
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        sessionsUntilLongBreak: 4
    })
    const [completedSessions, setCompletedSessions] = useState(0)
    const intervalRef = useRef(null)
    const audioRef = useRef(null)

    // Load sessions and settings from localStorage
    useEffect(() => {
        const savedSessions = localStorageService.getPomodoroSessions()
        const savedSettings = localStorageService.getPomodoroSettings()
        
        if (savedSessions) setSessions(savedSessions)
        if (savedSettings) {
            setSettings(savedSettings)
            setTimeLeft(savedSettings.workDuration * 60)
        }
    }, [])

    // Timer countdown logic
    useEffect(() => {
        if (isActive && !isPaused && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(time => time - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleTimerComplete()
        } else {
            clearInterval(intervalRef.current)
        }

        return () => clearInterval(intervalRef.current)
    }, [isActive, isPaused, timeLeft])

    const handleTimerComplete = () => {
        setIsActive(false)
        setIsPaused(false)
        
        // Play notification sound
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e))
        }

        if (sessionType === 'work') {
            const newSession = {
                id: Date.now(),
                type: 'work',
                duration: settings.workDuration,
                completedAt: new Date().toISOString(),
                date: new Date().toDateString()
            }
            
            const updatedSessions = [newSession, ...sessions]
            setSessions(updatedSessions)
            localStorageService.savePomodoroSessions(updatedSessions)
            
            setCompletedSessions(prev => prev + 1)
            setShowBreakPrompt(true)
        } else {
            // Break completed, start new work session
            setSessionType('work')
            setTimeLeft(settings.workDuration * 60)
        }
    }

    const startTimer = () => {
        setIsActive(true)
        setIsPaused(false)
    }

    const pauseTimer = () => {
        setIsPaused(!isPaused)
    }

    const resetTimer = () => {
        setIsActive(false)
        setIsPaused(false)
        setShowBreakPrompt(false)
        const duration = sessionType === 'work' ? settings.workDuration : 
                        (completedSessions % settings.sessionsUntilLongBreak === 0 && completedSessions > 0) 
                        ? settings.longBreak : settings.shortBreak
        setTimeLeft(duration * 60)
    }

    const startBreak = (isLongBreak = false) => {
        setShowBreakPrompt(false)
        setSessionType('break')
        const breakDuration = isLongBreak ? settings.longBreak : settings.shortBreak
        setTimeLeft(breakDuration * 60)
        setIsActive(true)
    }

    const skipBreak = () => {
        setShowBreakPrompt(false)
        setSessionType('work')
        setTimeLeft(settings.workDuration * 60)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const getProgress = () => {
        const totalDuration = sessionType === 'work' ? settings.workDuration * 60 : 
                             (completedSessions % settings.sessionsUntilLongBreak === 0 && completedSessions > 0) 
                             ? settings.longBreak * 60 : settings.shortBreak * 60
        return ((totalDuration - timeLeft) / totalDuration) * 100
    }

    const updateSettings = (newSettings) => {
        setSettings(newSettings)
        localStorageService.savePomodoroSettings(newSettings)
        if (!isActive) {
            setTimeLeft(newSettings.workDuration * 60)
        }
    }

    const clearHistory = () => {
        setSessions([])
        localStorageService.savePomodoroSessions([])
    }

    const todaySessions = sessions.filter(session => 
        session.date === new Date().toDateString()
    )

    return (
        <div className="space-y-6">
            {/* Audio element for notifications */}
            <audio ref={audioRef} preload="auto">
                <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkhBDWJ1PLNeSsFJH/K8d6PQQsUYLXo66hVFAlBnN/yv2ghBDOH0fPNeSoDJoDG8N+VQQ4SYLjm66hWFAlBnN/xum0jBzaK1fPOeSs=" type="audio/wav" />
            </audio>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pomodoro Timer</h1>
                    <p className="text-gray-600 mt-1">Focus with the Pomodoro Technique</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {completedSessions} sessions today
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timer Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Timer */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="text-center">
                            <div className="mb-4">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                                    sessionType === 'work' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {sessionType === 'work' ? '🍅 Focus Time' : '☕ Break Time'}
                                </span>
                            </div>

                            {/* Circular Progress */}
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="transparent"
                                        className="text-gray-200"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                                        className={sessionType === 'work' ? 'text-red-500' : 'text-green-500'}
                                        style={{
                                            transition: 'stroke-dashoffset 0.5s ease-in-out',
                                        }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl font-mono font-bold text-gray-900">
                                            {formatTime(timeLeft)}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {Math.round(getProgress())}% complete
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-center space-x-4 mt-8">
                                {!isActive ? (
                                    <button
                                        onClick={startTimer}
                                        className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        Start
                                    </button>
                                ) : (
                                    <button
                                        onClick={pauseTimer}
                                        className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                            isPaused 
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700'
                                        }`}
                                    >
                                        {isPaused ? (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                                Resume
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Pause
                                            </>
                                        )}
                                    </button>
                                )}
                                
                                <button
                                    onClick={resetTimer}
                                    className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timer Settings</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Work (min)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.workDuration}
                                    onChange={(e) => updateSettings({...settings, workDuration: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Short Break (min)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={settings.shortBreak}
                                    onChange={(e) => updateSettings({...settings, shortBreak: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Long Break (min)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.longBreak}
                                    onChange={(e) => updateSettings({...settings, longBreak: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sessions to Long Break
                                </label>
                                <input
                                    type="number"
                                    min="2"
                                    max="10"
                                    value={settings.sessionsUntilLongBreak}
                                    onChange={(e) => updateSettings({...settings, sessionsUntilLongBreak: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session History */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Today's Sessions</h3>
                            {sessions.length > 0 && (
                                <button
                                    onClick={clearHistory}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Clear History
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {todaySessions.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No sessions completed today</p>
                            ) : (
                                todaySessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${session.type === 'work' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {session.type === 'work' ? 'Focus Session' : 'Break'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {session.duration} minutes
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {new Date(session.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {todaySessions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{todaySessions.length}</p>
                                    <p className="text-sm text-gray-500">sessions completed</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4">Productivity Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-blue-100">Focus time today:</span>
                                <span className="font-semibold">{todaySessions.length * settings.workDuration} min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-100">Average session:</span>
                                <span className="font-semibold">{settings.workDuration} min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-100">Next long break:</span>
                                <span className="font-semibold">
                                    {settings.sessionsUntilLongBreak - (completedSessions % settings.sessionsUntilLongBreak)} sessions
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Break Prompt Modal */}
            {showBreakPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Great work! 🎉
                            </h3>
                            <p className="text-gray-600 mb-6">
                                You've completed a focus session. Time for a well-deserved break!
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => startBreak(false)}
                                    className="w-full px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors duration-200"
                                >
                                    Take Short Break ({settings.shortBreak} min)
                                </button>
                                {completedSessions % settings.sessionsUntilLongBreak === 0 && completedSessions > 0 && (
                                    <button
                                        onClick={() => startBreak(true)}
                                        className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        Take Long Break ({settings.longBreak} min)
                                    </button>
                                )}
                                <button
                                    onClick={skipBreak}
                                    className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors duration-200"
                                >
                                    Skip Break
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
