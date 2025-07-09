const Input = ({ label, ...props }) => (
    <div className="mb-4">
        <label className="block mb-1 text-sm font-semibold">{label}</label>
        <input
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
)

export default Input
