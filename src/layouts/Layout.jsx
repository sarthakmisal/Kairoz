import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const { isDarkMode } = useTheme()

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Top Navigation */}
            <nav className={`fixed top-0 z-50 w-full border-b shadow-sm ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo and Mobile Menu Button */}
                            <button 
                                className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                onClick={toggleMobileMenu}
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <a href="/" className="flex-shrink-0">
                                <span className="font-semibold text-xl">TaskMaster</span>
                            </a>
                        </div>
                        {/* Navbar Actions */}
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <button className={`p-2 rounded-lg transition-colors duration-200 ${
                                isDarkMode 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}>
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm5-1H9a1 1 0 01-1-1V5a1 1 0 011-1h11a1 1 0 011 1v11z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar and Main Content */}
            <div className="flex pt-16">
                <Sidebar 
                    isMobileMenuOpen={isMobileMenuOpen}
                    toggleMobileMenu={toggleMobileMenu}
                />
                <main className="flex-1 md:ml-64 p-4 sm:p-6 min-h-screen">
                    <Outlet />
                </main>
            </div>
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 md:hidden" onClick={toggleMobileMenu} />
            )}
        </div>
    )
}