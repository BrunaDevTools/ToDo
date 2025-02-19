import { createContext, useContext, useState, useEffect } from "react";

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          { id: 1, title: "Buy groceries", completed: false, taskId: 1 },
          { id: 2, title: "Read a book", completed: false, taskId: 2 },
          { id: 3, title: "Go to the gym", completed: false, taskId: 3 },
          { id: 4, title: "Finish the project", completed: false, taskId: 4 },
        ];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <TasksContext.Provider
      value={{ tasks, setTasks, selectedTask, setSelectedTask }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}
