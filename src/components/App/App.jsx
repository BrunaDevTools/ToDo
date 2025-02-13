import { useState } from "react";
import styles from "./App.module.css";
import "../../styles/global.css";
import "../../styles/vars.css";
import Sidebar from "../Sidebar/Sidebar";
import MainView from "../MainView/MainView";
import TaskDetailsPanel from "../TaskDetailsPanel/TaskDetailsPanel";
import { useCategories } from "../../context/CategoriesContext";
import { useTasks } from "../../context/TasksContext";
import ModalForm from "../ModalForm/ModalForm";

function App() {
  const { selectedCategory, setSelectedCategory } = useCategories();
  const { selectedTask, setSelectedTask } = useTasks();
  const [isDatailsOpen, setIsDatailsOpen] = useState(false);
  const { categories, setCategories } = useCategories();
  const { tasks, setTasks } = useTasks();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

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

  // Funcion para agregar una nueva categoria
  const handleAddCategory = (categoryName) => {
    if (!categoryName) return;

    const newId =
      categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    const newCategory = {
      id: newId,
      name: categoryName,
      icon: "FaList",
      fixed: false,
    };
    setCategories([...categories, newCategory]);
  };

  // Funcion para agregar nueva tarea
  const handleAddTask = (taskTitle) => {
    if (!taskTitle) return;

    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newTask = {
      id: newId,
      title: taskTitle,
      fixed: false,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <>
      <div
        className={`${styles.mainContainer} ${
          isDatailsOpen ? styles.mainContainerWithDetails : ""
        }`}
      >
        <Sidebar
          categories={categories}
          tasks={tasks}
          onCategoryClick={handleCategoryClick}
          onTaskClick={handleTaskClick}
          onAddCategory={() => setShowCategoryModal(true)}
          onAddTask={() => setShowTaskModal(true)}
        />
        <ModalForm
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSubmit={handleAddCategory}
          title="New category"
          placeholder="Category name..."
        />
        <ModalForm
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleAddTask}
          title="New task"
          placeholder="Task title..."
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
