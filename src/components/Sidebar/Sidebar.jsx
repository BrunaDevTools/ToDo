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
  return (
    <>
      <div className={styles.container}>
        <UserName name="Bruna" avatar="./img/avatar.jpg" />
        <SearchBar />
        <CategoriesList
          className={styles.categoryContainer}
          categories={categories}
          onCategoryClick={onCategoryClick}
        />
        <TaskList
          className={styles.taskContainer}
          tasks={tasks}
          onTaskClick={onTaskClick}
        />
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
