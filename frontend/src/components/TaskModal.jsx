import { useState, useEffect } from "react";
import API from "../services/api";

function TaskModal({
  show,
  onClose,
  fetchTasks,
  editingTask,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [stage, setStage] =
    useState("Todo");
  const [priority, setPriority] =
    useState("Medium");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(
        editingTask.description || ""
      );
      setStage(
        editingTask.stage || "Todo"
      );
      setPriority(
        editingTask.priority ||
          "Medium"
      );
    } else {
      setTitle("");
      setDescription("");
      setStage("Todo");
      setPriority("Medium");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await API.put(
          `/tasks/${editingTask._id}`,
          {
            title,
            description,
            stage,
            priority,
          }
        );
      } else {
        await API.post("/tasks", {
          title,
          description,
          stage,
          priority,
        });
      }

      fetchTasks();

      setTitle("");
      setDescription("");
      setStage("Todo");
      setPriority("Medium");

      onClose();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>
          {editingTask
            ? "Edit Task"
            : "Create Task"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows="4"
          />

          <select
            value={stage}
            onChange={(e) =>
              setStage(e.target.value)
            }
          >
            <option value="Todo">
              Todo
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Done">
              Done
            </option>
          </select>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
          >
            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>
          </select>

          <div className="modal-actions">

            <button
              className="save-btn"
              type="submit"
            >
              {editingTask
                ? "Update Task"
                : "Create Task"}
            </button>

            <button
              className="cancel-btn"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default TaskModal;