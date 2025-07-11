
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/layout/Navbar'

export default function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar 
                isMobileMenuOpen={isMobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
            />
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
