const tasks = [
    { id: 1, title: "Call client", completed: false },
    { id: 2, title: "Finish dashboard UI", completed: true },
]

const TaskList = () => {
    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className={`p-3 rounded border ${task.completed ? "bg-green-100" : "bg-yellow-100"
                        }`}
                >
                    <h2 className="font-semibold">{task.title}</h2>
                    <p>Status: {task.completed ? "Done" : "Pending"}</p>
                </div>
            ))}
        </div>
    )
}

export default TaskList
