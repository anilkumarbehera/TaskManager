import React, { useState, useEffect } from "react";
import "./index.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ priority: "All", status: "All" });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.title) {
      const task = { ...newTask, id: Date.now(), completed: false };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
      });
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setNewTask(taskToEdit);
    deleteTask(id);
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        (filter.priority === "All" || task.priority === filter.priority) &&
        (filter.status === "All" ||
          (filter.status === "Completed" && task.completed) ||
          (filter.status === "Incomplete" && !task.completed))
    )
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getSectionTasks = (section) => {
    const now = new Date().toISOString().split("T")[0];
    if (section === "Upcoming")
      return filteredTasks.filter(
        (task) => !task.completed && task.dueDate >= now
      );
    if (section === "Overdue")
      return filteredTasks.filter(
        (task) => !task.completed && task.dueDate < now
      );
    if (section === "Completed")
      return filteredTasks.filter((task) => task.completed);
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div className="task-creator">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>
      <div className="task-sections">
        {["Upcoming", "Overdue", "Completed"].map((section) => (
          <div key={section} className="task-section">
            <h2>{section} Tasks</h2>
            <ul>
              {getSectionTasks(section).map((task) => (
                <li key={task.id}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Due: {task.dueDate}</p>
                  <p>Priority: {task.priority}</p>
                  <button onClick={() => toggleCompletion(task.id)}>
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button onClick={() => editTask(task.id)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
