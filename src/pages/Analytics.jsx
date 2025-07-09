
import { useState } from 'react'

export default function Analytics() {
    const [timeRange, setTimeRange] = useState('7d')
    
    // Sample analytics data
    const metrics = {
        totalTasks: { value: 156, change: 12, trend: 'up' },
        completedTasks: { value: 124, change: 8, trend: 'up' },
        productivity: { value: 79.5, change: -2.3, trend: 'down' },
        teamEfficiency: { value: 85.2, change: 5.1, trend: 'up' }
    }

    const chartData = [
        { name: 'Mon', tasks: 12, completed: 8 },
        { name: 'Tue', tasks: 19, completed: 15 },
        { name: 'Wed', tasks: 15, completed: 12 },
        { name: 'Thu', tasks: 22, completed: 18 },
        { name: 'Fri', tasks: 18, completed: 16 },
        { name: 'Sat', tasks: 8, completed: 6 },
        { name: 'Sun', tasks: 5, completed: 4 }
    ]

    const projectProgress = [
        { name: 'Web Application', progress: 85, tasks: 24, completed: 20 },
        { name: 'Mobile App', progress: 60, tasks: 18, completed: 11 },
        { name: 'API Development', progress: 95, tasks: 12, completed: 11 },
        { name: 'Marketing Campaign', progress: 40, tasks: 15, completed: 6 }
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-600 mt-1">Track your team's performance and productivity</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <select 
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 3 months</option>
                        <option value="1y">Last year</option>
                    </select>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.totalTasks.value}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className={`text-sm font-medium ${metrics.totalTasks.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.totalTasks.trend === 'up' ? '+' : ''}{metrics.totalTasks.change}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.completedTasks.value}</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className={`text-sm font-medium ${metrics.completedTasks.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.completedTasks.trend === 'up' ? '+' : ''}{metrics.completedTasks.change}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Productivity Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.productivity.value}%</p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className={`text-sm font-medium ${metrics.productivity.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.productivity.trend === 'up' ? '+' : ''}{metrics.productivity.change}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Team Efficiency</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.teamEfficiency.value}%</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className={`text-sm font-medium ${metrics.teamEfficiency.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.teamEfficiency.trend === 'up' ? '+' : ''}{metrics.teamEfficiency.change}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Completion Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Daily Task Completion</h3>
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-600">Created</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600">Completed</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Simple Chart Visualization */}
                    <div className="space-y-3">
                        {chartData.map((day, index) => (
                            <div key={day.name} className="flex items-center space-x-4">
                                <div className="w-12 text-sm font-medium text-gray-700">{day.name}</div>
                                <div className="flex-1 flex items-center space-x-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                                        <div 
                                            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                            style={{ width: `${(day.tasks / 25) * 100}%` }}
                                        ></div>
                                        <div 
                                            className="bg-green-500 h-4 rounded-full absolute top-0 transition-all duration-300"
                                            style={{ width: `${(day.completed / 25) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 w-16">
                                        {day.completed}/{day.tasks}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Progress */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Progress</h3>
                    <div className="space-y-4">
                        {projectProgress.map((project, index) => (
                            <div key={project.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">{project.name}</span>
                                    <span className="text-sm text-gray-500">{project.completed}/{project.tasks} tasks</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{project.progress}% complete</span>
                                    <span className={`text-xs font-medium ${
                                        project.progress >= 80 ? 'text-green-600' :
                                        project.progress >= 50 ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                        {project.progress >= 80 ? 'On track' :
                                         project.progress >= 50 ? 'Moderate' :
                                         'Behind'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Performers */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Jane Smith', tasks: 45, avatar: 'JS' },
                            { name: 'Alex Brown', tasks: 38, avatar: 'AB' },
                            { name: 'Sarah Wilson', tasks: 32, avatar: 'SW' }
                        ].map((performer, index) => (
                            <div key={performer.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                        {performer.avatar}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{performer.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-blue-600">{performer.tasks} tasks</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Task Distribution */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
                    <div className="space-y-3">
                        {[
                            { status: 'Completed', count: 124, color: 'bg-green-500' },
                            { status: 'In Progress', count: 18, color: 'bg-blue-500' },
                            { status: 'Pending', count: 14, color: 'bg-yellow-500' }
                        ].map((item) => (
                            <div key={item.status} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                                <p className="text-gray-900">Task completed by John Doe</p>
                                <p className="text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                                <p className="text-gray-900">New project created</p>
                                <p className="text-gray-500">4 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                            <div>
                                <p className="text-gray-900">Team member joined</p>
                                <p className="text-gray-500">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
