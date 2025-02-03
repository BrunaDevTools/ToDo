import { useTasks } from "../context/TasksContext";

export default function TaskList({ onTaskClick }) {
  const { tasks, selectedTask } = useTasks();

  return (
    <div>
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            onClick={() => onTaskClick(task)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                selectedTask?.id === task.id ? "#e0e0e0" : "transparent",
              borderLeft:
                selectedTask?.id === task.id ? "4px solid #01b0c4" : "none",
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            <span>{task.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
