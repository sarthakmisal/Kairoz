import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
                    <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/dashboard"
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Go to Dashboard
                    </Link>

                    <div className="text-sm text-gray-500">
                        <Link
                            to="/login"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-xs text-gray-400">
                    <p>Lost? Contact support or check our help center.</p>
                </div>
            </div>
        </div>
    )
}