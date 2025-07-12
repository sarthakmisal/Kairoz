
import { useState, useEffect } from 'react'
import { localStorageService } from '../utils/localStorage'

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState('month')
    const [selectedDate, setSelectedDate] = useState(null)
    const [tasks, setTasks] = useState([])
    const [notes, setNotes] = useState([])
    const [showEntries, setShowEntries] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newEntryType, setNewEntryType] = useState('task')
    const [newEntry, setNewEntry] = useState({
        title: '',
        content: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        assignee: '',
        dueDate: ''
    })

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
            if (!task.dueDate) return false
            try {
                const taskDate = new Date(task.dueDate)
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
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
        setSelectedDate(dateStr)
        setShowEntries(true)
    }

    const handleAddEntry = () => {
        if (newEntryType === 'task') {
            if (!newEntry.title.trim()) return
            
            const taskData = {
                title: newEntry.title,
                description: newEntry.description,
                priority: newEntry.priority,
                status: newEntry.status,
                assignee: newEntry.assignee,
                dueDate: selectedDate,
                project: 'Calendar Task'
            }
            
            const addedTask = localStorageService.addTask(taskData)
            setTasks(prev => [...prev, addedTask])
        } else {
            if (!newEntry.title.trim() || !newEntry.content.trim()) return
            
            const noteData = {
                title: newEntry.title,
                content: newEntry.content,
                dateCreated: selectedDate
            }
            
            const addedNote = localStorageService.addNote(noteData)
            setNotes(prev => [addedNote, ...prev])
        }
        
        setNewEntry({
            title: '',
            content: '',
            description: '',
            priority: 'medium',
            status: 'pending',
            assignee: '',
            dueDate: ''
        })
        setShowAddModal(false)
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const renderCalendarDays = () => {
        const days = []
        
        // Previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${daysInPrevMonth - i}`} className="p-2 text-gray-400 min-h-[80px]">
                    <span className="text-sm">{daysInPrevMonth - i}</span>
                </div>
            )
        }

        // Current month days
        for (let date = 1; date <= daysInMonth; date++) {
            const { tasks: dayTasks, notes: dayNotes } = getItemsForDate(date)
            const totalItems = dayTasks.length + dayNotes.length
            
            days.push(
                <div 
                    key={date} 
                    className={`p-2 min-h-[80px] border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        isToday(date) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                    onClick={() => handleDateClick(date)}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                            {date}
                        </span>
                        {totalItems > 0 && (
                            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    
                    <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                            <div 
                                key={task.id} 
                                className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 truncate"
                                title={task.title}
                            >
                                📋 {task.title}
                            </div>
                        ))}
                        {dayNotes.slice(0, 1).map((note) => (
                            <div 
                                key={note.id} 
                                className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 truncate"
                                title={note.title}
                            >
                                📝 {note.title}
                            </div>
                        ))}
                        {totalItems > 3 && (
                            <div className="text-xs text-gray-500 px-2">
                                +{totalItems - 3} more
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        return days
    }

    const selectedDateItems = selectedDate ? getItemsForDate(parseInt(selectedDate.split('-')[2])) : { tasks: [], notes: [] }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                    <p className="text-gray-600 mt-1">View and manage your tasks and notes</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <button 
                        onClick={() => {
                            setSelectedDate(new Date().toISOString().split('T')[0])
                            setNewEntryType('task')
                            setShowAddModal(true)
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Quick Add
                    </button>
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

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                            <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total Notes</p>
                            <p className="text-2xl font-semibold text-gray-900">{notes.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">This Month</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {Array.from({length: daysInMonth}, (_, i) => i + 1)
                                    .reduce((total, date) => {
                                        const items = getItemsForDate(date)
                                        return total + items.tasks.length + items.notes.length
                                    }, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Entries Modal */}
            {showEntries && selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {formatDate(selectedDate)}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => {
                                        setNewEntryType('task')
                                        setShowAddModal(true)
                                    }}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    + Task
                                </button>
                                <button
                                    onClick={() => {
                                        setNewEntryType('note')
                                        setShowAddModal(true)
                                    }}
                                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                    + Note
                                </button>
                                <button
                                    onClick={() => setShowEntries(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selectedDateItems.tasks.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tasks</h3>
                                    <div className="space-y-2">
                                        {selectedDateItems.tasks.map((task) => (
                                            <div key={task.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-blue-900">{task.title}</h4>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                {task.description && (
                                                    <p className="text-sm text-blue-700 mt-1">{task.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedDateItems.notes.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                                    <div className="space-y-2">
                                        {selectedDateItems.notes.map((note) => (
                                            <div key={note.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                <h4 className="font-medium text-green-900">{note.title}</h4>
                                                <p className="text-sm text-green-700 mt-1">
                                                    {note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedDateItems.tasks.length === 0 && selectedDateItems.notes.length === 0 && (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No entries</h3>
                                    <p className="mt-1 text-sm text-gray-500">No tasks or notes for this date.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Entry Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Add New {newEntryType === 'task' ? 'Task' : 'Note'}
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newEntry.title}
                                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={`Enter ${newEntryType} title...`}
                                />
                            </div>

                            {newEntryType === 'task' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={newEntry.description}
                                            onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows={3}
                                            placeholder="Enter task description..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                            <select
                                                value={newEntry.priority}
                                                onChange={(e) => setNewEntry({...newEntry, priority: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                value={newEntry.status}
                                                onChange={(e) => setNewEntry({...newEntry, status: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        value={newEntry.content}
                                        onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={4}
                                        placeholder="Enter note content..."
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEntry}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add {newEntryType === 'task' ? 'Task' : 'Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
