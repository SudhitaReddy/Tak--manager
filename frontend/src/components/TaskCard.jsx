function TaskCard({
  task,
  onEdit,
  onDelete,
  onMove,
  moveLabel,
}) {
  return (
    <div
      className={`task ${task.priority.toLowerCase()}`}
    >
      <h4>{task.title}</h4>

      <p>{task.description}</p>

      <span className="badge">
        {task.priority}
      </span>

      <div className="task-actions">

        <button
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        {moveLabel && (
          <button
            onClick={() =>
              onMove(task)
            }
          >
            {moveLabel}
          </button>
        )}

        <button
          onClick={() =>
            onDelete(task._id)
          }
        >
          Delete
        </button>

      </div>
    </div>
  );
}

export default TaskCard;