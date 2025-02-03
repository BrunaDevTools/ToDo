import "./../styles/mainView.css";
import { useCategories } from "../context/CategoriesContext";
import { useTasks } from "../context/TasksContext";

export default function MainView({ selectedCategory, selectedTask }) {
  const { tasks } = useTasks();

  // Filtrar tareas por categoria seleccionada
  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.categoryId === selectedCategory.id)
    : [];

  return (
    <div className="main-view">
      {/* Mostrar la categoría seleccionada */}
      {selectedCategory && (
        <>
          <h1>{selectedCategory.name}</h1>
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </>
      )}
      {/* Mostrar la tarea seleccionada */}
      {selectedTask && (
        <>
          <h1>{selectedTask.title}</h1>
          <p>Detalles de la tarea...</p>
        </>
      )}
    </div>
  );
}
