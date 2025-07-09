
import { useState, useEffect } from 'react'
import { localStorageService } from '../utils/localStorage'

export default function ExpenseTracker() {
    const [entries, setEntries] = useState([])
    const [showAddEntryModal, setShowAddEntryModal] = useState(false)
    const [filter, setFilter] = useState('All')
    const [showChart, setShowChart] = useState(false)
    const [newEntry, setNewEntry] = useState({
        title: '',
        amount: '',
        type: 'Expense',
        date: new Date().toISOString().split('T')[0],
        category: 'General'
    })

    const categories = ['General', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other']

    // Load entries from localStorage on component mount
    useEffect(() => {
        const savedEntries = localStorageService.getExpenseEntries()
        setEntries(savedEntries)
    }, [])

    // Calculate totals
    const totalIncome = entries.filter(entry => entry.type === 'Income').reduce((sum, entry) => sum + entry.amount, 0)
    const totalExpenses = entries.filter(entry => entry.type === 'Expense').reduce((sum, entry) => sum + entry.amount, 0)
    const balance = totalIncome - totalExpenses

    // Filter entries based on selected filter
    const filteredEntries = filter === 'All' ? entries : entries.filter(entry => entry.type === filter)

    // Group entries by category for chart
    const categoryData = entries.reduce((acc, entry) => {
        if (entry.type === 'Expense') {
            acc[entry.category] = (acc[entry.category] || 0) + entry.amount
        }
        return acc
    }, {})

    const handleAddEntry = () => {
        if (newEntry.title && newEntry.amount) {
            const entry = {
                ...newEntry,
                amount: parseFloat(newEntry.amount)
            }
            const addedEntry = localStorageService.addExpenseEntry(entry)
            setEntries(prev => [addedEntry, ...prev])
            setNewEntry({
                title: '',
                amount: '',
                type: 'Expense',
                date: new Date().toISOString().split('T')[0],
                category: 'General'
            })
            setShowAddEntryModal(false)
        }
    }

    const handleDeleteEntry = (id) => {
        localStorageService.deleteExpenseEntry(id)
        setEntries(prev => prev.filter(entry => entry.id !== id))
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    const getTypeColor = (type) => {
        return type === 'Income' ? 'text-green-600' : 'text-red-600'
    }

    const getTypeIcon = (type) => {
        return type === 'Income' ? (
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        ) : (
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Expense Tracker</h1>
                        <p className="text-emerald-100 text-lg">Track your income and expenses to manage your finances.</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={() => setShowAddEntryModal(true)}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Entry</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Balance</p>
                            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(balance)}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Income</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Chart Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex space-x-2">
                    {['All', 'Income', 'Expense'].map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                filter === filterOption
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {filterOption}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowChart(!showChart)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{showChart ? 'Hide' : 'Show'} Chart</span>
                </button>
            </div>

            {/* Category Chart */}
            {showChart && Object.keys(categoryData).length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense by Category</h3>
                    <div className="space-y-3">
                        {Object.entries(categoryData).map(([category, amount]) => {
                            const percentage = (amount / totalExpenses) * 100
                            return (
                                <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-700">{category}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-500 h-2 rounded-full" 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 w-16 text-right">
                                            {formatCurrency(amount)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Entries List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Entries</h3>
                </div>
                <div className="p-6">
                    {filteredEntries.length === 0 ? (
                        <div className="text-center py-8">
                            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500">No entries found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            {getTypeIcon(entry.type)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{entry.title}</h4>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <span>{entry.category}</span>
                                                <span>•</span>
                                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`font-semibold ${getTypeColor(entry.type)}`}>
                                            {entry.type === 'Income' ? '+' : '-'}{formatCurrency(entry.amount)}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteEntry(entry.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Entry Modal */}
            {showAddEntryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Entry</h3>
                            <button
                                onClick={() => setShowAddEntryModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newEntry.title}
                                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newEntry.amount}
                                    onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={newEntry.type}
                                    onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Expense">Expense</option>
                                    <option value="Income">Income</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={newEntry.category}
                                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={newEntry.date}
                                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddEntryModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEntry}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Add Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
