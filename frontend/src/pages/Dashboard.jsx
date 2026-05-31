import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";
import TaskModal from "../components/TaskModal";
import TaskColumn from "../components/TaskColumn";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [trashTasks, setTrashTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal,setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  // Fetch Active Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/tasks");

      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Fetch Trash Tasks
  const fetchTrashTasks = async () => {
    try {
      const { data } = await API.get("/tasks/trash");

      setTrashTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTrashTasks();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const deleteTask = async (id) => {
  try {
    if (!window.confirm("Move task to trash?"))
      return;

    await API.delete(`/tasks/${id}`);

    fetchTasks();
    fetchTrashTasks();
  } catch (error) {
    console.log(error);
  }
};

const restoreTask = async (id) => {
  try {
    await API.put(
      `/tasks/restore/${id}`
    );

    fetchTasks();
    fetchTrashTasks();
  } catch (error) {
    console.log(error);
  }
};

const permanentDelete = async (id) => {
  try {
    if (
      !window.confirm(
        "Delete permanently?"
      )
    )
      return;

    await API.delete(
      `/tasks/permanent/${id}`
    );

    fetchTrashTasks();
  } catch (error) {
    console.log(error);
  }
};

const moveTask = async (
  task,
  newStage
) => {
  try {
    await API.put(
      `/tasks/${task._id}`,
      {
        title: task.title,
        description:
          task.description,
        priority:
          task.priority,
        stage: newStage,
      }
    );

    fetchTasks();
  } catch (error) {
    console.log(error);
  }
};

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const todoTasks = filteredTasks.filter(
    (task) => task.stage === "Todo"
  );

  const progressTasks = filteredTasks.filter(
    (task) => task.stage === "In Progress"
  );

  const doneTasks = filteredTasks.filter(
    (task) => task.stage === "Done"
  );

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Task Manager</h2>

      <ul>

        <li
            onClick={() =>
            setActiveTab("dashboard")
            }
        >
            Dashboard
        </li>

        <li
            onClick={() =>
            setActiveTab("tasks")
            }
        >
            Tasks
        </li>

        <li
            onClick={() =>
            setActiveTab("trash")
            }
        >
            Trash
        </li>

        </ul>

        <button
          className="logout-btn"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">

        {/* Header */}
        <div className="topbar">
          <h1>
            Welcome,
            {
                JSON.parse(
                localStorage.getItem(
                    "userInfo"
                )
                )?.name
            }
            </h1>

          <input
            type="text"
            placeholder="Search Tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Stats */}
        <div className="stats">

          <div className="card">
            <h3>Total Tasks</h3>
            <p>{tasks.length}</p>
          </div>

          <div className="card">
            <h3>Todo</h3>
            <p>{todoTasks.length}</p>
          </div>

          <div className="card">
            <h3>In Progress</h3>
            <p>{progressTasks.length}</p>
            </div>

          <div className="card">
            <h3>Done</h3>
            <p>{doneTasks.length}</p>
          </div>

          <div className="card">
            <h3>Trash</h3>
            <p>{trashTasks.length}</p>
          </div>

        </div>

        {/* Add Task */}
        <div className="actions">
          <button
            className="add-btn"
            onClick={() =>
                setShowModal(true)
            }
            >
            + Add New Task
            </button>
        </div>

        {loading ? (
  <h2>Loading...</h2>
) : (
  <div className="board">

    <TaskColumn
      title="Todo"
      tasks={todoTasks}
      onEdit={(task) => {
        setEditingTask(task);
        setShowModal(true);
      }}
      onDelete={deleteTask}
      onMove={(task) =>
        moveTask(task, "In Progress")
      }
      moveLabel="Start"
    />

    <TaskColumn
      title="In Progress"
      tasks={progressTasks}
      onEdit={(task) => {
        setEditingTask(task);
        setShowModal(true);
      }}
      onDelete={deleteTask}
      onMove={(task) =>
        moveTask(task, "Done")
      }
      moveLabel="Complete"
    />

    <TaskColumn
      title="Done"
      tasks={doneTasks}
      onEdit={(task) => {
        setEditingTask(task);
        setShowModal(true);
      }}
      onDelete={deleteTask}
      onMove={(task) =>
        moveTask(task, "Todo")
      }
      moveLabel="Reopen"
    />

    {/* Trash Column */}

    <div className="column">

      <h2>Trash</h2>

      {trashTasks.length === 0 && (
        <p>Trash Empty</p>
      )}

      {trashTasks.map((task) => (
        <div
          key={task._id}
          className="task"
        >
          <h4>{task.title}</h4>

          <p>{task.description}</p>

          <span className="badge">
            {task.priority}
          </span>

          <div className="task-actions">

            <button
              onClick={() =>
                restoreTask(task._id)
              }
            >
              Restore
            </button>

            <button
              onClick={() =>
                permanentDelete(task._id)
              }
            >
              Delete Forever
            </button>

          </div>

        </div>
      ))}

    </div>

  </div>
)}

    <TaskModal
        show={showModal}
        onClose={() => {
            setShowModal(false);
            setEditingTask(null);
        }}
        fetchTasks={fetchTasks}
        editingTask={editingTask}
     />

      </main>

    </div>
  );
}

export default Dashboard;