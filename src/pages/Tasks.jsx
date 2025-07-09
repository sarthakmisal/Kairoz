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
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="max-w-xs">
                                                {editingCell === `${task.id}-title` ? (
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={() => handleCellBlur(task.id, 'title')}
                                                        onKeyDown={(e) => handleCellKeyDown(e, task.id, 'title')}
                                                        className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div
                                                        onClick={() => handleCellClick(task.id, 'title', task.title)}
                                                        className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                                                    >
                                                        <div className="text-sm font-medium text-gray-900 truncate">{task.title}</div>
                                                        <div className="text-sm text-gray-500 truncate">{task.description}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={task.assignee}
                                                onChange={(e) => handleDropdownChange(task.id, 'assignee', e.target.value)}
                                                className="text-sm text-gray-900 border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-1"
                                            >
                                                <option value="">Unassigned</option>
                                                {assigneeOptions.map(assignee => (
                                                    <option key={assignee} value={assignee}>{assignee}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleDropdownChange(task.id, 'status', e.target.value)}
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-none ${getStatusColor(task.status)}`}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={task.priority}
                                                onChange={(e) => handleDropdownChange(task.id, 'priority', e.target.value)}
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-none ${getPriorityColor(task.priority)}`}
                                            >
                                                {priorityOptions.map(priority => (
                                                    <option key={priority} value={priority}>
                                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingCell === `${task.id}-dueDate` ? (
                                                <input
                                                    type="date"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => handleCellBlur(task.id, 'dueDate')}
                                                    onKeyDown={(e) => handleCellKeyDown(e, task.id, 'dueDate')}
                                                    className="text-sm text-gray-900 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => handleCellClick(task.id, 'dueDate', task.dueDate)}
                                                    className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                                                >
                                                    {task.dueDate}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingCell === `${task.id}-project` ? (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => handleCellBlur(task.id, 'project')}
                                                    onKeyDown={(e) => handleCellKeyDown(e, task.id, 'project')}
                                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => handleCellClick(task.id, 'project', task.project)}
                                                    className="text-sm text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
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

            {/* Fancy Add Task Modal */}
            {showAddTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Create New Task</h3>
                                        <p className="text-blue-100">Fill in the details to add a new task</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddTaskModal(false)}
                                    className="h-10 w-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                                >
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
                            <div className="space-y-8">
                                {/* Main Task Info */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Task Information
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Task Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={newTask.title}
                                                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                                placeholder="What needs to be done?"
                                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium placeholder-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={newTask.description}
                                                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                                placeholder="Provide more details about this task..."
                                                rows={4}
                                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm resize-none placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Priority and Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Priority Level
                                        </h4>
                                        <div className="space-y-3">
                                            {priorityOptions.map((priority) => (
                                                <label key={priority} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value={priority}
                                                        checked={newTask.priority === priority}
                                                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                                                        className="sr-only"
                                                    />
                                                    <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 w-full ${
                                                        newTask.priority === priority 
                                                            ? 'border-orange-500 bg-orange-100' 
                                                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                                                    }`}>
                                                        <div className={`h-4 w-4 rounded-full border-2 ${
                                                            newTask.priority === priority 
                                                                ? 'border-orange-500 bg-orange-500' 
                                                                : 'border-gray-300'
                                                        }`}>
                                                            {newTask.priority === priority && (
                                                                <div className="h-full w-full rounded-full bg-white scale-50"></div>
                                                            )}
                                                        </div>
                                                        <span className={`font-medium capitalize ${
                                                            newTask.priority === priority ? 'text-orange-700' : 'text-gray-700'
                                                        }`}>
                                                            {priority}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Task Status
                                        </h4>
                                        <div className="space-y-3">
                                            {statusOptions.map((status) => (
                                                <label key={status} className="flex items-center cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={status}
                                                        checked={newTask.status === status}
                                                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                                                        className="sr-only"
                                                    />
                                                    <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 w-full ${
                                                        newTask.status === status 
                                                            ? 'border-green-500 bg-green-100' 
                                                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                                                    }`}>
                                                        <div className={`h-4 w-4 rounded-full border-2 ${
                                                            newTask.status === status 
                                                                ? 'border-green-500 bg-green-500' 
                                                                : 'border-gray-300'
                                                        }`}>
                                                            {newTask.status === status && (
                                                                <div className="h-full w-full rounded-full bg-white scale-50"></div>
                                                            )}
                                                        </div>
                                                        <span className={`font-medium capitalize ${
                                                            newTask.status === status ? 'text-green-700' : 'text-gray-700'
                                                        }`}>
                                                            {status.replace('-', ' ')}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Assignment and Timeline */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Assignment & Timeline
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Assignee
                                            </label>
                                            <select
                                                value={newTask.assignee}
                                                onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                                            >
                                                <option value="">Choose assignee...</option>
                                                {assigneeOptions.map(assignee => (
                                                    <option key={assignee} value={assignee}>{assignee}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Due Date
                                            </label>
                                            <input
                                                type="date"
                                                value={newTask.dueDate}
                                                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Project
                                            </label>
                                            <input
                                                type="text"
                                                value={newTask.project}
                                                onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                                                placeholder="Project name..."
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with actions */}
                        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Fill in required fields to create task
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowAddTaskModal(false)}
                                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addNewTask}
                                    disabled={!newTask.title.trim()}
                                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Create Task</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}