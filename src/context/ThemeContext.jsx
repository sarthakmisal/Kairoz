
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        // Load theme preference from localStorage
        const savedTheme = localStorage.getItem('kairoz_theme')
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark')
        } else {
            // Check system preference
            setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
        }
    }, [])

    useEffect(() => {
        // Apply theme to document
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        
        // Save to localStorage
        localStorage.setItem('kairoz_theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
