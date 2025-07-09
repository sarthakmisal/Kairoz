
import { useState } from 'react'

export default function Team() {
    const [teamMembers] = useState([
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Product Manager',
            department: 'Product',
            avatar: 'JD',
            status: 'online',
            tasksCompleted: 24,
            tasksActive: 3,
            joinDate: '2023-01-15'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'Senior Developer',
            department: 'Engineering',
            avatar: 'JS',
            status: 'online',
            tasksCompleted: 45,
            tasksActive: 5,
            joinDate: '2022-08-20'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            role: 'UX Designer',
            department: 'Design',
            avatar: 'MJ',
            status: 'away',
            tasksCompleted: 18,
            tasksActive: 2,
            joinDate: '2023-03-10'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            role: 'Marketing Lead',
            department: 'Marketing',
            avatar: 'SW',
            status: 'offline',
            tasksCompleted: 32,
            tasksActive: 4,
            joinDate: '2022-11-05'
        },
        {
            id: 5,
            name: 'Alex Brown',
            email: 'alex.brown@example.com',
            role: 'DevOps Engineer',
            department: 'Engineering',
            avatar: 'AB',
            status: 'online',
            tasksCompleted: 38,
            tasksActive: 6,
            joinDate: '2023-02-28'
        }
    ])

    const [filter, setFilter] = useState('all')

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-green-500'
            case 'away': return 'bg-yellow-500'
            case 'offline': return 'bg-gray-400'
            default: return 'bg-gray-400'
        }
    }

    const getDepartmentColor = (department) => {
        switch (department) {
            case 'Product': return 'bg-blue-100 text-blue-800'
            case 'Engineering': return 'bg-purple-100 text-purple-800'
            case 'Design': return 'bg-pink-100 text-pink-800'
            case 'Marketing': return 'bg-orange-100 text-orange-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const filteredMembers = teamMembers.filter(member => {
        if (filter === 'all') return true
        return member.department.toLowerCase() === filter.toLowerCase()
    })

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                    <p className="text-gray-600 mt-1">Manage your team members and collaboration</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        Invite Member
                    </button>
                </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Members</p>
                            <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Online Now</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {teamMembers.filter(m => m.status === 'online').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Departments</p>
                            <p className="text-2xl font-bold text-gray-900">4</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Filter by department:</span>
                    {['all', 'Product', 'Engineering', 'Design', 'Marketing'].map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setFilter(dept)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                filter === dept
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            {dept === 'all' ? 'All' : dept}
                        </button>
                    ))}
                </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                    <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        {/* Member Header */}
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                    {member.avatar}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
                                <p className="text-sm text-gray-500 truncate">{member.email}</p>
                            </div>
                        </div>

                        {/* Member Info */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Role</span>
                                <span className="text-sm text-gray-900">{member.role}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Department</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(member.department)}`}>
                                    {member.department}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Active Tasks</span>
                                <span className="text-sm text-gray-900">{member.tasksActive}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Completed</span>
                                <span className="text-sm text-green-600 font-semibold">{member.tasksCompleted}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Joined</span>
                                <span className="text-sm text-gray-900">{new Date(member.joinDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                            <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200">
                                Message
                            </button>
                            <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
