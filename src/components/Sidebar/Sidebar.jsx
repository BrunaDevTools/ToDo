import SearchBar from "./SearchBar/SearchBar";
import UserName from "./UserName/UserName";
import CategoriesList from "./Categories/CategoriesList";
import TaskList from "./Tasks/TaskList";
import styles from "./Sidebar.module.css";

export default function Sidebar({
  categories,
  tasks,
  onCategoryClick,
  onTaskClick,
  onAddCategory,
  onAddTask,
}) {
  // Filtro tareas que no tienen categoria (tareas globales)
  const globalTasks = tasks.filter((task) => !task.categoryId);

  return (
    <>
      <div className={styles.container}>
        <UserName name="Bruna" avatar="./img/avatar.jpg" />
        <SearchBar />
        <div className={styles.categoriesAndTasksContainer}>
          <CategoriesList
            className={styles.categoryContainer}
            categories={categories}
            onCategoryClick={onCategoryClick}
          />
          <TaskList
            className={styles.taskContainer}
            tasks={globalTasks}
            onTaskClick={onTaskClick}
          />
        </div>
        <div className={`${styles.buttonsContainer} ${styles.sidebarControls}`}>
          <button onClick={onAddCategory} className={styles.addButton}>
            + New Category
          </button>
          <button onClick={onAddTask} className={styles.addButton}>
            + New Task
          </button>
        </div>
      </div>
    </>
  );
}
