import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()

    // Sample data for dashboard overview only
    const overviewStats = {
        totalTasks: 12,
        completedTasks: 8,
        inProgressTasks: 3,
        pendingTasks: 1,
        totalProjects: 4,
        activeProjects: 2,
        completedProjects: 2
    }

    const recentActivity = [
        { id: 1, action: 'Task completed', item: 'Update dependencies', time: '2 hours ago', type: 'task' },
        { id: 2, action: 'Project created', item: 'Marketing Campaign', time: '4 hours ago', type: 'project' },
        { id: 3, action: 'Task assigned', item: 'Review pull requests', time: '6 hours ago', type: 'task' },
        { id: 4, action: 'Project milestone', item: 'Web Application - Phase 1', time: '1 day ago', type: 'project' },
        { id: 5, action: 'Task updated', item: 'Design user interface', time: '2 days ago', type: 'task' }
    ]

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, John!</h1>
                        <p className="text-blue-100 text-lg">You have {overviewStats.pendingTasks} pending tasks and {overviewStats.inProgressTasks} in progress.</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button 
                            onClick={() => navigate('/tasks')}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                        >
                            View All Tasks
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3 md:ml-4 min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Tasks</p>
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">{overviewStats.totalTasks}</p>
                            <p className="text-xs md:text-sm text-green-600 truncate">+12% from last week</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3 md:ml-4 min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Completed</p>
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">{overviewStats.completedTasks}</p>
                            <p className="text-xs md:text-sm text-green-600 truncate">+8% completion rate</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3 md:ml-4 min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-medium text-gray-600 truncate">In Progress</p>
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">{overviewStats.inProgressTasks}</p>
                            <p className="text-xs md:text-sm text-blue-600 truncate">Active projects</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3 md:ml-4 min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Projects</p>
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">{overviewStats.totalProjects}</p>
                            <p className="text-xs md:text-sm text-orange-600 truncate">{overviewStats.activeProjects} active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900">Recent Activity</h3>
                            <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                                View all
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex items-center space-x-3">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                        activity.type === 'task' ? 'bg-blue-100' : 'bg-purple-100'
                                    }`}>
                                        {activity.type === 'task' ? (
                                            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.action}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {activity.item}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <p className="text-xs text-gray-400">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-4 space-y-4 md:space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Quick Actions</h3>
                        <div className="space-y-2 md:space-y-3">
                            <button
                                onClick={() => navigate('/tasks')}
                                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="h-7 w-7 md:h-8 md:w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm md:text-base truncate">Manage Tasks</span>
                                </div>
                            </button>
                            <button
                                onClick={() => navigate('/projects')}
                                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="h-7 w-7 md:h-8 md:w-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm md:text-base truncate">View Projects</span>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div className="h-7 w-7 md:h-8 md:w-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm md:text-base truncate">View Analytics</span>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div className="h-7 w-7 md:h-8 md:w-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm md:text-base truncate">Invite Team Member</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 md:p-6 text-white">
                        <h3 className="text-base md:text-lg font-semibold mb-2">Productivity Tip</h3>
                        <p className="text-purple-100 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">Break large tasks into smaller, manageable chunks to boost your completion rate!</p>
                        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}