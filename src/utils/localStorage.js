
// LocalStorage service for managing application data
const STORAGE_KEYS = {
    TASKS: 'kairoz_tasks',
    PROJECTS: 'kairoz_projects',
    NOTES: 'kairoz_notes',
    USER: 'kairoz_user',
    REGISTERED_USERS: 'kairoz_registered_users'
}

export const localStorageService = {
    // Tasks management
    getTasks: () => {
        try {
            const tasks = localStorage.getItem(STORAGE_KEYS.TASKS)
            return tasks ? JSON.parse(tasks) : []
        } catch (error) {
            console.error('Error getting tasks from localStorage:', error)
            return []
        }
    },

    saveTasks: (tasks) => {
        try {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
            return true
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error)
            return false
        }
    },

    addTask: (task) => {
        const tasks = localStorageService.getTasks()
        const newTask = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...task
        }
        tasks.push(newTask)
        localStorageService.saveTasks(tasks)
        return newTask
    },

    updateTask: (taskId, updates) => {
        const tasks = localStorageService.getTasks()
        const taskIndex = tasks.findIndex(task => task.id === taskId)
        
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            }
            localStorageService.saveTasks(tasks)
            return tasks[taskIndex]
        }
        return null
    },

    deleteTask: (taskId) => {
        const tasks = localStorageService.getTasks()
        const filteredTasks = tasks.filter(task => task.id !== taskId)
        localStorageService.saveTasks(filteredTasks)
        return true
    },

    // Projects management
    getProjects: () => {
        try {
            const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS)
            return projects ? JSON.parse(projects) : []
        } catch (error) {
            console.error('Error getting projects from localStorage:', error)
            return []
        }
    },

    saveProjects: (projects) => {
        try {
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
            return true
        } catch (error) {
            console.error('Error saving projects to localStorage:', error)
            return false
        }
    },

    addProject: (project) => {
        const projects = localStorageService.getProjects()
        const newProject = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...project
        }
        projects.push(newProject)
        localStorageService.saveProjects(projects)
        return newProject
    },

    updateProject: (projectId, updates) => {
        const projects = localStorageService.getProjects()
        const projectIndex = projects.findIndex(project => project.id === projectId)
        
        if (projectIndex !== -1) {
            projects[projectIndex] = {
                ...projects[projectIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            }
            localStorageService.saveProjects(projects)
            return projects[projectIndex]
        }
        return null
    },

    deleteProject: (projectId) => {
        const projects = localStorageService.getProjects()
        const filteredProjects = projects.filter(project => project.id !== projectId)
        localStorageService.saveProjects(filteredProjects)
        return true
    },

    // Notes management
    getNotes: () => {
        try {
            const notes = localStorage.getItem(STORAGE_KEYS.NOTES)
            return notes ? JSON.parse(notes) : []
        } catch (error) {
            console.error('Error getting notes from localStorage:', error)
            return []
        }
    },

    saveNotes: (notes) => {
        try {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
            return true
        } catch (error) {
            console.error('Error saving notes to localStorage:', error)
            return false
        }
    },

    addNote: (note) => {
        const notes = localStorageService.getNotes()
        const newNote = {
            id: Date.now().toString(),
            dateCreated: new Date().toISOString(),
            ...note
        }
        notes.unshift(newNote) // Add to beginning for latest first
        localStorageService.saveNotes(notes)
        return newNote
    },

    updateNote: (noteId, updates) => {
        const notes = localStorageService.getNotes()
        const noteIndex = notes.findIndex(note => note.id === noteId)
        
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                ...updates
            }
            localStorageService.saveNotes(notes)
            return notes[noteIndex]
        }
        return null
    },

    deleteNote: (noteId) => {
        const notes = localStorageService.getNotes()
        const filteredNotes = notes.filter(note => note.id !== noteId)
        localStorageService.saveNotes(filteredNotes)
        return true
    },

    // Initialize sample data
    initializeSampleData: () => {
        const existingTasks = localStorageService.getTasks()
        const existingProjects = localStorageService.getProjects()
        const existingNotes = localStorageService.getNotes()

        if (existingTasks.length === 0) {
            const sampleTasks = [
                {
                    title: 'Update dependencies',
                    description: 'Update all npm packages to latest versions',
                    status: 'completed',
                    priority: 'medium',
                    assignee: 'John Doe',
                    dueDate: '2024-01-15',
                    projectId: '1'
                },
                {
                    title: 'Design user interface',
                    description: 'Create wireframes and mockups for the new dashboard',
                    status: 'in-progress',
                    priority: 'high',
                    assignee: 'Jane Smith',
                    dueDate: '2024-01-20',
                    projectId: '1'
                },
                {
                    title: 'Setup CI/CD pipeline',
                    description: 'Configure automated testing and deployment',
                    status: 'pending',
                    priority: 'high',
                    assignee: 'Mike Johnson',
                    dueDate: '2024-01-25',
                    projectId: '2'
                }
            ]

            sampleTasks.forEach(task => localStorageService.addTask(task))
        }

        if (existingProjects.length === 0) {
            const sampleProjects = [
                {
                    name: 'Web Application',
                    description: 'Main web application development project',
                    status: 'active',
                    priority: 'high',
                    startDate: '2024-01-01',
                    endDate: '2024-06-30',
                    progress: 65
                },
                {
                    name: 'Marketing Campaign',
                    description: 'Q1 marketing campaign for product launch',
                    status: 'active',
                    priority: 'medium',
                    startDate: '2024-01-15',
                    endDate: '2024-03-31',
                    progress: 40
                },
                {
                    name: 'Mobile App',
                    description: 'iOS and Android mobile application',
                    status: 'planning',
                    priority: 'medium',
                    startDate: '2024-03-01',
                    endDate: '2024-12-31',
                    progress: 15
                }
            ]

            sampleProjects.forEach(project => localStorageService.addProject(project))
        }

        if (existingNotes.length === 0) {
            const sampleNotes = [
                {
                    title: 'Welcome to Journalize',
                    content: 'This is your personal journaling space! You can:\n\n**Create** new notes with rich content\n**Edit** existing notes\n**Search** through your notes\n**Toggle** markdown preview\n\nTry using markdown formatting like **bold text**, *italic text*, and # headers!',
                },
                {
                    title: 'Project Ideas',
                    content: '# Upcoming Projects\n\n## Web Development\n- Redesign portfolio website\n- Learn React Native\n- Build a personal blog\n\n## Personal Goals\n- Read 2 books this month\n- Exercise 3x per week\n- Learn a new programming language',
                },
                {
                    title: 'Daily Reflection',
                    content: 'Today was productive! Completed the authentication module and made good progress on the dashboard design.\n\n**What went well:**\n- Solved the login bug\n- Great team meeting\n- Finished user interface mockups\n\n**Tomorrow\'s priorities:**\n- Review pull requests\n- Update documentation\n- Plan next sprint',
                }
            ]

            sampleNotes.forEach(note => localStorageService.addNote(note))
        }
    }
}

// Initialize sample data on first load
if (typeof window !== 'undefined') {
    localStorageService.initializeSampleData()
}
