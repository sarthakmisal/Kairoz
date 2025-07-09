
import { useState, useEffect } from 'react'
import { localStorageService } from '../utils/localStorage'

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState('month') // month, week, day
    const [tasks, setTasks] = useState([])
    const [notes, setNotes] = useState([])
    const [selectedDate, setSelectedDate] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const today = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Get first day of month and days in month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Load tasks and notes from localStorage
    useEffect(() => {
        const loadedTasks = localStorageService.getTasks()
        const loadedNotes = localStorageService.getNotes()
        setTasks(loadedTasks)
        setNotes(loadedNotes)
    }, [])

    const getItemsForDate = (date) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
        
        const dayTasks = tasks.filter(task => {
            if (!task.dateCreated) return false
            try {
                const taskDate = new Date(task.dateCreated)
                if (isNaN(taskDate.getTime())) return false
                return taskDate.toISOString().split('T')[0] === dateStr
            } catch (error) {
                return false
            }
        })
        
        const dayNotes = notes.filter(note => {
            if (!note.dateCreated) return false
            try {
                const noteDate = new Date(note.dateCreated)
                if (isNaN(noteDate.getTime())) return false
                return noteDate.toISOString().split('T')[0] === dateStr
            } catch (error) {
                return false
            }
        })

        return { tasks: dayTasks, notes: dayNotes }
    }

    const navigateMonth = (direction) => {
        if (direction === 'prev') {
            setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
        } else {
            setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
        }
    }

    const isToday = (date) => {
        return today.getDate() === date && 
               today.getMonth() === currentMonth && 
               today.getFullYear() === currentYear
    }

    const handleDateClick = (date) => {
        setSelectedDate(date)
        setShowModal(true)
    }

    const renderCalendarDays = () => {
        const days = []
        
        // Previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${daysInPrevMonth - i}`} className="p-3 text-gray-400 min-h-[120px] border border-gray-100">
                    <span className="text-sm">{daysInPrevMonth - i}</span>
                </div>
            )
        }

        // Current month days
        for (let date = 1; date <= daysInMonth; date++) {
            const dayItems = getItemsForDate(date)
            const totalItems = dayItems.tasks.length + dayItems.notes.length
            
            days.push(
                <div 
                    key={date} 
                    onClick={() => handleDateClick(date)}
                    className={`p-3 min-h-[120px] border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        isToday(date) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                            {date}
                        </span>
                        {totalItems > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <div className="space-y-1">
                        {dayItems.tasks.slice(0, 2).map(task => (
                            <div 
                                key={task.id} 
                                className="text-xs px-2 py-1 rounded truncate bg-green-100 text-green-800"
                            >
                                📋 {task.title}
                            </div>
                        ))}
                        {dayItems.notes.slice(0, 2).map(note => (
                            <div 
                                key={note.id} 
                                className="text-xs px-2 py-1 rounded truncate bg-yellow-100 text-yellow-800"
                            >
                                📝 {note.title}
                            </div>
                        ))}
                        {totalItems > 4 && (
                            <div className="text-xs text-gray-500 px-2">
                                +{totalItems - 4} more
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        return days
    }

    const selectedDateItems = selectedDate ? getItemsForDate(selectedDate) : { tasks: [], notes: [] }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                    <p className="text-gray-600 mt-1">View all tasks and notes in calendar layout</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                            <span className="text-gray-600">Tasks</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                            <span className="text-gray-600">Notes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {months[currentMonth]} {currentYear}
                        </h2>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                            Today
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Week day headers */}
                <div className="grid grid-cols-7 bg-gray-50">
                    {weekDays.map(day => (
                        <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Date Detail Modal */}
            {showModal && selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {months[currentMonth]} {selectedDate}, {currentYear}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {selectedDateItems.tasks.length === 0 && selectedDateItems.notes.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No tasks or notes for this date</p>
                            ) : (
                                <div className="space-y-6">
                                    {selectedDateItems.tasks.length > 0 && (
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                Tasks ({selectedDateItems.tasks.length})
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedDateItems.tasks.map(task => (
                                                    <div key={task.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-medium text-green-900">{task.title}</h5>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {task.priority}
                                                            </span>
                                                        </div>
                                                        {task.description && (
                                                            <p className="text-green-700 text-sm mt-1">{task.description}</p>
                                                        )}
                                                        <p className="text-green-600 text-xs mt-2">
                                                            Status: {task.status} • Created: {new Date(task.dateCreated).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedDateItems.notes.length > 0 && (
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Notes ({selectedDateItems.notes.length})
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedDateItems.notes.map(note => (
                                                    <div key={note.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                        <h5 className="font-medium text-yellow-900">{note.title}</h5>
                                                        <p className="text-yellow-700 text-sm mt-1 line-clamp-3">{note.content}</p>
                                                        <p className="text-yellow-600 text-xs mt-2">
                                                            Created: {new Date(note.dateCreated).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
