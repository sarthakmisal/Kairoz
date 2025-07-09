
import { useState, useEffect } from 'react'

export default function ProjectsPage() {
    const [projects, setProjects] = useState([])
    const [showAddProjectModal, setShowAddProjectModal] = useState(false)
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        dueDate: '',
        status: 'planning',
        team: 0,
        tasks: 0,
        progress: 0
    })

    // Load projects from localStorage on component mount
    useEffect(() => {
        const savedProjects = localStorage.getItem('kairoz_projects')
        if (savedProjects) {
            setProjects(JSON.parse(savedProjects))
        } else {
            // Default projects if none exist
            const defaultProjects = [
                { id: 1, name: 'Web Application', description: 'Complete redesign of the main web application', progress: 75, team: 8, tasks: 24, dueDate: '2024-02-15', status: 'active', color: 'from-blue-500 to-cyan-500' },
                { id: 2, name: 'Mobile App', description: 'Native mobile application for iOS and Android', progress: 45, team: 6, tasks: 18, dueDate: '2024-03-01', status: 'active', color: 'from-purple-500 to-pink-500' },
                { id: 3, name: 'API Development', description: 'RESTful API for third-party integrations', progress: 90, team: 4, tasks: 12, dueDate: '2024-01-30', status: 'completed', color: 'from-green-500 to-emerald-500' },
                { id: 4, name: 'Marketing Campaign', description: 'Q1 marketing and promotional activities', progress: 30, team: 5, tasks: 15, dueDate: '2024-03-31', status: 'planning', color: 'from-orange-500 to-red-500' }
            ]
            setProjects(defaultProjects)
            localStorage.setItem('kairoz_projects', JSON.stringify(defaultProjects))
        }
    }, [])

    // Save projects to localStorage whenever projects change
    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem('kairoz_projects', JSON.stringify(projects))
        }
    }, [projects])

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800'
            case 'completed': return 'bg-green-100 text-green-800'
            case 'planning': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getRandomColor = () => {
        const colors = [
            'from-blue-500 to-cyan-500',
            'from-purple-500 to-pink-500',
            'from-green-500 to-emerald-500',
            'from-orange-500 to-red-500',
            'from-indigo-500 to-purple-500',
            'from-teal-500 to-blue-500'
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    const addNewProject = () => {
        if (!newProject.name.trim()) return
        
        const project = {
            ...newProject,
            id: Date.now(),
            color: getRandomColor()
        }
        
        setProjects(prevProjects => [...prevProjects, project])
        setNewProject({
            name: '',
            description: '',
            dueDate: '',
            status: 'planning',
            team: 0,
            tasks: 0,
            progress: 0
        })
        setShowAddProjectModal(false)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-sm text-gray-600">Manage your project portfolio</p>
                </div>
                <button 
                    onClick={() => setShowAddProjectModal(true)}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {/* Project Header */}
                        <div className={`h-32 bg-gradient-to-r ${project.color} p-6 flex flex-col justify-between`}>
                            <div className="flex items-start justify-between">
                                <div className="text-white">
                                    <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </span>
                                </div>
                                <button className="text-white hover:text-gray-200 transition-colors duration-200">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-white text-sm opacity-90">
                                {project.description}
                            </div>
                        </div>

                        {/* Project Content */}
                        <div className="p-6">
                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Progress</span>
                                    <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`bg-gradient-to-r ${project.color} h-2 rounded-full transition-all duration-300`}
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Project Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{project.tasks}</p>
                                    <p className="text-xs text-gray-500">Tasks</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{project.team}</p>
                                    <p className="text-xs text-gray-500">Team</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-900">{project.dueDate}</p>
                                    <p className="text-xs text-gray-500">Due Date</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200">
                                    View Details
                                </button>
                                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200">
                                    Manage Tasks
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Project Modal */}
            {showAddProjectModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Add New Project</h3>
                                <button
                                    onClick={() => setShowAddProjectModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                                        placeholder="Enter project name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                        placeholder="Enter project description"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={newProject.status}
                                            onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                        >
                                            <option value="planning">Planning</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newProject.dueDate}
                                            onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Team Size
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newProject.team}
                                            onChange={(e) => setNewProject({...newProject, team: parseInt(e.target.value) || 0})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tasks
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={newProject.tasks}
                                            onChange={(e) => setNewProject({...newProject, tasks: parseInt(e.target.value) || 0})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Progress %
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={newProject.progress}
                                            onChange={(e) => setNewProject({...newProject, progress: parseInt(e.target.value) || 0})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAddProjectModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addNewProject}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Add Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
