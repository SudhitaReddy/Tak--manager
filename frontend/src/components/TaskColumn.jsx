import TaskCard from "./TaskCard";

function TaskColumn({
  title,
  tasks,
  onEdit,
  onDelete,
  onMove,
  moveLabel,
}) {
  return (
    <div className="column">

      <h2>{title}</h2>

      {tasks.length === 0 && (
        <p>No Tasks</p>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          moveLabel={moveLabel}
        />
      ))}

    </div>
  );
}

export default TaskColumn;