
import { useState } from 'react'

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState('month') // month, week, day

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

    // Sample events
    const events = [
        { id: 1, title: 'Team Meeting', date: '2024-01-15', time: '10:00 AM', type: 'meeting' },
        { id: 2, title: 'Project Deadline', date: '2024-01-20', time: '11:59 PM', type: 'deadline' },
        { id: 3, title: 'Client Call', date: '2024-01-18', time: '2:00 PM', type: 'call' },
    ]

    const getEventsForDate = (date) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
        return events.filter(event => event.date === dateStr)
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

    const renderCalendarDays = () => {
        const days = []
        
        // Previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${daysInPrevMonth - i}`} className="p-2 text-gray-400">
                    <span className="text-sm">{daysInPrevMonth - i}</span>
                </div>
            )
        }

        // Current month days
        for (let date = 1; date <= daysInMonth; date++) {
            const dayEvents = getEventsForDate(date)
            days.push(
                <div 
                    key={date} 
                    className={`p-2 min-h-[100px] border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        isToday(date) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                >
                    <span className={`text-sm font-medium ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                        {date}
                    </span>
                    <div className="mt-1 space-y-1">
                        {dayEvents.map(event => (
                            <div 
                                key={event.id} 
                                className={`text-xs px-2 py-1 rounded truncate ${
                                    event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                                    event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                                    'bg-green-100 text-green-800'
                                }`}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        return days
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                    <p className="text-gray-600 mt-1">Manage your schedule and events</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Event
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
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            {['Month', 'Week', 'Day'].map((viewType) => (
                                <button
                                    key={viewType}
                                    onClick={() => setView(viewType.toLowerCase())}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                                        view === viewType.toLowerCase()
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {viewType}
                                </button>
                            ))}
                        </div>
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

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                    {events.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className={`h-3 w-3 rounded-full ${
                                    event.type === 'meeting' ? 'bg-blue-500' :
                                    event.type === 'deadline' ? 'bg-red-500' :
                                    'bg-green-500'
                                }`}></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                    <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
