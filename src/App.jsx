import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import MainView from "./components/MainView";
import TaskDetailsPanel from "./components/TaskDetailsPanel";
import { useCategories } from "./context/CategoriesContext";
import { useTasks } from "./context/TasksContext";

function App() {
  const { selectedCategory, setSelectedCategory } = useCategories();
  const { selectedTask, setSelectedTask } = useTasks();
  const [isDatailsOpen, setIsDatailsOpen] = useState(false);

  // Funcion para selecionar una categoria
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedTask(null);
    setIsDatailsOpen(false);
  };

  // Funcion para seleccionar una tarea
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setSelectedCategory(null);
    setIsDatailsOpen(true);
  };

  return (
    <>
      <div
        className={`main-container ${
          isDatailsOpen ? "main-container--with-details" : ""
        }`}
      >
        <Sidebar
          onCategoryClick={handleCategoryClick}
          onTaskClick={handleTaskClick}
        />
        <MainView
          selectedCategory={selectedCategory}
          selectedTask={selectedTask}
        />
        {isDatailsOpen && (
          <TaskDetailsPanel
            task={selectedTask}
            onClose={() => setIsDatailsOpen(false)}
          />
        )}
      </div>
    </>
  );
}

export default App;
