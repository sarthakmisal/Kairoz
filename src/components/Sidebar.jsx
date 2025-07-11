import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Sidebar({ isMobileMenuOpen, toggleMobileMenu }) {
    const location = useLocation()
    const { isDarkMode } = useTheme()

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
        { name: 'Tasks', href: '/tasks', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { name: 'Projects', href: '/projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { name: 'Calendar', href: '/calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Team', href: '/team', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
        { name: 'Analytics', href: '/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { name: 'Journalize', href: '/notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'Pomodoro', href: '/pomodoro', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Expenses', href: '/expenses', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', }
    ]

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0 md:fixed md:inset-y-0 md:left-0 md:w-64 md:top-16 md:z-20">
                <div className="flex flex-col w-64">
                    <div className={`flex flex-col flex-grow pt-5 pb-4 overflow-y-auto border-r h-full ${
                        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center flex-shrink-0 px-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">K</span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">Kairoz</h1>
                            </div>
                        </div>
                        <nav className="mt-8 flex-1 px-2 space-y-1">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `group flex items-center px-4 py-3 mx-2 text-sm font-medium rounded-xl transition-all duration-300 transform relative overflow-hidden ${
                                            isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:scale-102'
                                        }`
                                    }
                                >
                                    {location.pathname === item.href && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
                                    )}
                                    <div className={`relative z-10 flex items-center ${location.pathname === item.href ? 'animate-bounce' : ''}`}>
                                        <svg
                                            className={`mr-3 h-5 w-5 transition-all duration-300 ${
                                                location.pathname === item.href 
                                                    ? 'text-white drop-shadow-sm' 
                                                    : 'text-gray-400 group-hover:text-blue-500 group-hover:scale-110'
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        <span className={`font-semibold ${location.pathname === item.href ? 'text-white' : ''}`}>
                                            {item.name}
                                        </span>
                                    </div>
                                    {location.pathname === item.href && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 border-r transform transition-transform duration-300 ease-in-out md:hidden top-16 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">K</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Kairoz</h1>
                        </div>
                    </div>
                    <nav className="mt-8 flex-1 px-2 space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={toggleMobileMenu}
                                className={({ isActive }) =>
                                    `group flex items-center px-4 py-3 mx-2 text-sm font-medium rounded-xl transition-all duration-300 transform relative overflow-hidden ${
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                                            : isDarkMode 
                                                ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-900 hover:to-purple-900 hover:text-white hover:scale-102'
                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:scale-102'
                                    }`
                                }
                            >
                                {location.pathname === item.href && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
                                )}
                                <div className={`relative z-10 flex items-center ${location.pathname === item.href ? 'animate-bounce' : ''}`}>
                                    <svg
                                        className={`mr-3 h-5 w-5 transition-all duration-300 ${
                                            location.pathname === item.href 
                                                ? 'text-white drop-shadow-sm' 
                                                : 'text-gray-400 group-hover:text-blue-500 group-hover:scale-110'
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    <span className={`font-semibold ${location.pathname === item.href ? 'text-white' : ''}`}>
                                        {item.name}
                                    </span>
                                </div>
                                {location.pathname === item.href && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    )
}