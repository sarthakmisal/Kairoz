import { useState, useEffect } from 'react'

export default function Tasks() {
    const [tasks, setTasks] = useState([])
    const [viewMode, setViewMode] = useState('list')
    const [filter, setFilter] = useState('all')
    const [sortBy, setSortBy] = useState('dueDate')
    const [editingCell, setEditingCell] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [showAddTaskModal, setShowAddTaskModal] = useState(false)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignee: '',
        project: ''
    })

    // Available options for dropdowns
    const statusOptions = ['pending', 'in-progress', 'completed']
    const priorityOptions = ['low', 'medium', 'high']
    const assigneeOptions = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Brown']

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('kairoz_tasks')
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks))
        } else {
            // Default tasks if none exist
            const defaultTasks = [
                { id: 1, title: 'Complete project documentation', description: 'Write comprehensive docs for the new feature', priority: 'high', status: 'in-progress', dueDate: '2024-01-15', assignee: 'John Doe', project: 'Web App' },
                { id: 2, title: 'Review pull requests', description: 'Code review for the authentication module', priority: 'medium', status: 'pending', dueDate: '2024-01-12', assignee: 'Jane Smith', project: 'API' },
                { id: 3, title: 'Update dependencies', description: 'Upgrade React and related packages', priority: 'low', status: 'completed', dueDate: '2024-01-10', assignee: 'Mike Johnson', project: 'Frontend' },
                { id: 4, title: 'Design user interface', description: 'Create mockups for the dashboard redesign', priority: 'high', status: 'in-progress', dueDate: '2024-01-18', assignee: 'Sarah Wilson', project: 'Design' },
                { id: 5, title: 'Setup CI/CD pipeline', description: 'Configure automated testing and deployment', priority: 'medium', status: 'pending', dueDate: '2024-01-20', assignee: 'Alex Brown', project: 'DevOps' }
            ]
            setTasks(defaultTasks)
            localStorage.setItem('kairoz_tasks', JSON.stringify(defaultTasks))
        }
    }, [])

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('kairoz_tasks', JSON.stringify(tasks))
        }
    }, [tasks])

    const handleCellClick = (taskId, field, currentValue) => {
        if (field === 'assignee' || field === 'status' || field === 'priority') return
        setEditingCell(`${taskId}-${field}`)
        setEditValue(currentValue)
    }

    const handleCellBlur = (taskId, field) => {
        if (editingCell === `${taskId}-${field}`) {
            updateTask(taskId, field, editValue)
            setEditingCell(null)
            setEditValue('')
        }
    }

    const handleCellKeyDown = (e, taskId, field) => {
        if (e.key === 'Enter') {
            e.target.blur()
        } else if (e.key === 'Escape') {
            setEditingCell(null)
            setEditValue('')
        }
    }

    const updateTask = (taskId, field, value) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId ? { ...task, [field]: value } : task
            )
        )
    }

    const handleDropdownChange = (taskId, field, value) => {
        updateTask(taskId, field, value)
    }

    const addNewTask = () => {
        if (!newTask.title.trim()) return

        const task = {
            ...newTask,
            id: Date.now()
        }

        setTasks(prevTasks => [...prevTasks, task])
        setNewTask({
            title: '',
            description: '',
            priority: 'medium',
            status: 'pending',
            dueDate: '',
            assignee: '',
            project: ''
        })
        setShowAddTaskModal(false)
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true
        return task.status === filter
    })

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate)
        }
        if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        return a.title.localeCompare(b.title)
    })

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'low': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800'
            case 'in-progress': return 'bg-blue-100 text-blue-800'
            case 'pending': return 'bg-orange-100 text-orange-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tasks Management</h1>
                    <p className="text-gray-600 mt-1">Manage and track all your tasks efficiently</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Export
                    </button>
                    <button 
                        onClick={() => setShowAddTaskModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Task
                    </button>
                </div>
            </div>

            {/* Filters and View Options */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Filter:</label>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Sort by:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="dueDate">Due Date</option>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('board')}
                        className={`p-2 rounded-lg ${viewMode === 'board' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Tasks Content */}
            {viewMode === 'board' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl border-2 border-gray-300 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">To Do</h3>
                        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                        {filteredTasks.filter(task => task.status === 'pending').length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {filteredTasks.filter(task => task.status === 'pending').map((task) => (
                            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <button
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700"
                                            title="Delete task"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{task.project}</span>
                                    <span>{task.dueDate}</span>
                                </div>
                                <div className="mt-2 flex items-center space-x-2">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">
                                        {task.assignee.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-xs text-gray-600">{task.assignee}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl border-2 border-blue-300 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">In Progress</h3>
                        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                        {filteredTasks.filter(task => task.status === 'in-progress').length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {filteredTasks.filter(task => task.status === 'in-progress').map((task) => (
                            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <button
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700"
                                            title="Delete task"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{task.project}</span>
                                    <span>{task.dueDate}</span>
                                </div>
                                <div className="mt-2 flex items-center space-x-2">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">
                                        {task.assignee.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-xs text-gray-600">{task.assignee}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl border-2 border-green-300 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Completed</h3>
                        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                        {filteredTasks.filter(task => task.status === 'completed').length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {filteredTasks.filter(task => task.status === 'completed').map((task) => (
                            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <button
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700"
                                            title="Delete task"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{task.project}</span>
                                    <span>{task.dueDate}</span>
                                </div>
                                <div className="mt-2 flex items-center space-x-2">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">
                                        {task.assignee.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-xs text-gray-600">{task.assignee}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            ):(
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto min-w-[800px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                        Task
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                        Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                        Priority
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                        Due Date
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                                        Assignee
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                                        Project
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-3 sm:ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">
                                                        {task.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            {editingCell === `${task.id}-status` ? (
                                                <select
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    onBlur={() => handleCellSave(task.id, 'status')}
                                                    onKeyDown={(e) => handleCellKeyDown(e, task.id, 'status')}
                                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                                                    autoFocus
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            ) : (
                                                <span
                                                    onClick={() => handleCellClick(task.id, 'status', task.status)}
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                                                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-orange-100 text-orange-800'
                                                    }`}
                                                >
                                                    {task.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            {editingCell === `${task.id}-priority` ? (
                                                <select
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    onBlur={() => handleCellSave(task.id, 'priority')}
                                                    onKeyDown={(e) => handleCellKeyDown(e, task.id, 'priority')}
                                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                                                    autoFocus
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            ) : (
                                                <span
                                                    onClick={() => handleCellClick(task.id, 'priority', task.priority)}
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                                                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            {editingCell === `${task.id}-dueDate` ? (
                                                <input
                                                    type="date"
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    onBlur={() => handleCellSave(task.id, 'dueDate')}
                                                    onKeyDown={(e) => handleCellKeyDown(e, task.id, 'dueDate')}
                                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => handleCellClick(task.id, 'dueDate', task.dueDate)}
                                                    className="text-xs sm:text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                                                >
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            {editingCell === `${task.id}-assignee` ? (
                                                <input
                                                    type="text"
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    onBlur={() => handleCellSave(task.id, 'assignee')}
                                                    onKeyDown={(e) => handleCellKeyDown(e, task.id, 'assignee')}
                                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => handleCellClick(task.id, 'assignee', task.assignee)}
                                                    className="text-xs sm:text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                                                >
                                                    {task.assignee}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            {editingCell === `${task.id}-project` ? (
                                                <input
                                                    type="text"
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    onBlur={() => handleCellSave(task.id, 'project')}
                                                    onKeyDown={(e) => handleCellKeyDown(e, task.id, 'project')}
                                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => handleCellClick(task.id, 'project', task.project)}
                                                    className="text-xs sm:text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                                                >
                                                    {task.project}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Task</h2>
                            <button
                                onClick={() => setShowAddTaskModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                        placeholder="Enter task title..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                                    <input
                                        type="text"
                                        value={newTask.project}
                                        onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                        placeholder="Enter project name..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    placeholder="Enter task description..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                                <input
                                    type="text"
                                    value={newTask.assignee}
                                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    placeholder="Enter assignee name..."
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddTaskModal(false)}
                                className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addNewTask}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}