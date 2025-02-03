import { createContext, useContext, useState } from "react";

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Buy groceries", completed: false, categoryId: 1 },
    { id: 2, title: "Read a book", completed: false, categoryId: 2 },
    { id: 3, title: "Go to the gym", completed: false, categoryId: 3 },
    { id: 4, title: "Finish the project", completed: false, categoryId: 4 },
  ]);

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
