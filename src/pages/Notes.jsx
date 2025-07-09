
import { useState, useEffect } from 'react'

export default function Notes() {
    const [notes, setNotes] = useState([])
    const [showAddNoteModal, setShowAddNoteModal] = useState(false)
    const [editingNote, setEditingNote] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [markdownPreview, setMarkdownPreview] = useState({})
    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        dateCreated: new Date().toISOString().split('T')[0]
    })

    // Load notes from localStorage on component mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('kairoz_notes')
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes))
        }
    }, [])

    // Save notes to localStorage whenever notes change
    useEffect(() => {
        localStorage.setItem('kairoz_notes', JSON.stringify(notes))
    }, [notes])

    const addNewNote = () => {
        if (!newNote.title.trim() || !newNote.content.trim()) return

        const note = {
            ...newNote,
            id: Date.now(),
            dateCreated: new Date().toISOString()
        }

        setNotes(prevNotes => [note, ...prevNotes])
        setNewNote({
            title: '',
            content: '',
            dateCreated: new Date().toISOString().split('T')[0]
        })
        setShowAddNoteModal(false)
    }

    const updateNote = (noteId, updatedNote) => {
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === noteId ? { ...note, ...updatedNote } : note
            )
        )
        setEditingNote(null)
    }

    const deleteNote = (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const renderMarkdown = (content) => {
        // Simple markdown to HTML conversion
        return content
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mb-3">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
            .replace(/\n/gim, '<br>')
    }

    const toggleMarkdownPreview = (noteId) => {
        setMarkdownPreview(prev => ({
            ...prev,
            [noteId]: !prev[noteId]
        }))
    }

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Journalize</h1>
                        <p className="text-indigo-100 text-lg">Your personal space for thoughts, ideas, and daily notes.</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={() => setShowAddNoteModal(true)}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Note</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                            <svg className="h-4 w-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                    <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
                                    {note.title}
                                </h3>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                    <button
                                        onClick={() => toggleMarkdownPreview(note.id)}
                                        className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                                        title="Toggle Markdown Preview"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setEditingNote(note)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                        title="Edit Note"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                        title="Delete Note"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                {markdownPreview[note.id] ? (
                                    <div 
                                        className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ 
                                            __html: renderMarkdown(note.content.slice(0, 200) + (note.content.length > 200 ? '...' : ''))
                                        }}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {note.content.length > 200 ? note.content.slice(0, 200) + '...' : note.content}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-400">
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatDate(note.dateCreated)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredNotes.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first note.'}
                    </p>
                    {!searchTerm && (
                        <div className="mt-6">
                            <button
                                onClick={() => setShowAddNoteModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Note
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Add Note Modal */}
            {showAddNoteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Note</h2>
                            <button
                                onClick={() => setShowAddNoteModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newNote.title}
                                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                                    placeholder="Enter note title..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                                <textarea
                                    value={newNote.content}
                                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                                    placeholder="Write your note here... (Supports basic Markdown: **bold**, *italic*, # headers)"
                                    rows={10}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowAddNoteModal(false)}
                                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addNewNote}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                            >
                                Create Note
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Note Modal */}
            {editingNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Note</h2>
                            <button
                                onClick={() => setEditingNote(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingNote.title}
                                    onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                                <textarea
                                    value={editingNote.content}
                                    onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                                    rows={10}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setEditingNote(null)}
                                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateNote(editingNote.id, editingNote)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
