
import { useCallback, useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleAdd(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      setError("");
      const task = await createTask(title.trim());
      setTasks((current) => [task, ...current]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(task) {
    try {
      setError("");
      const updated = await updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks((current) =>
        current.map((item) =>
          item._id === updated._id ? updated : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      await deleteTask(id);
      setTasks((current) =>
        current.filter((task) => task._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <main className="app">
      <section className="task-card">
        <p className="eyebrow">YOUR DAILY WORKSPACE</p>
        <h1>Task Manager</h1>
        <p className="subtitle">
          Small steps. Real progress.
        </p>

        <form onSubmit={handleAdd} className="task-form">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to get done?"
            maxLength={200}
            aria-label="New task title"
          />
          <button type="submit">Add task</button>
        </form>

        <div className="summary">
          <span>{tasks.length} tasks</span>
          <span>{completedCount} completed</span>
        </div>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first one!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task)}
                  />
                  <span className={task.completed ? "done" : ""}>
                    {task.title}
                  </span>
                </label>

                <button
                  className="delete"
                  onClick={() => handleDelete(task._id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
