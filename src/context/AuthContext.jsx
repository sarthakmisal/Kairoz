import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check for existing user session on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('kairoz_user')
        const loginTimestamp = localStorage.getItem('kairoz_login_timestamp')

        if (storedUser && loginTimestamp) {
            // Check if login is still valid (optional: add expiration logic here)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email, password, rememberMe = false) => {
        console.log('Login attempt:', { email, password, rememberMe })

        // Get registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('kairoz_registered_users') || '[]')

        // Find user
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password)

        if (foundUser) {
            const userData = {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                avatar: foundUser.avatar
            }

            setUser(userData)

            // Store user session
            localStorage.setItem('kairoz_user', JSON.stringify(userData))
            localStorage.setItem('kairoz_login_timestamp', Date.now().toString())

            if (rememberMe) {
                localStorage.setItem('kairoz_remember_me', 'true')
            }

            return { success: true }
        } else {
            return { success: false, error: 'Invalid email or password' }
        }
    }

    const register = async (userData) => {
        const { name, email, password } = userData

        // Get existing users
        const registeredUsers = JSON.parse(localStorage.getItem('kairoz_registered_users') || '[]')

        // Check if user already exists
        const existingUser = registeredUsers.find(u => u.email === email)
        if (existingUser) {
            return { success: false, error: 'User with this email already exists' }
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
            createdAt: new Date().toISOString()
        }

        // Save to localStorage
        registeredUsers.push(newUser)
        localStorage.setItem('kairoz_registered_users', JSON.stringify(registeredUsers))

        return { success: true, user: newUser }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('kairoz_user')
        localStorage.removeItem('kairoz_profile')
        localStorage.removeItem('kairoz_settings')
    }

    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData }
        setUser(newUserData)
        localStorage.setItem('kairoz_user', JSON.stringify(newUserData))
    }

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}