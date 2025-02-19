import styles from "./MainView.module.css";
import { useCategories } from "../../context/CategoriesContext";
import { useTasks } from "../../context/TasksContext";
import { useState } from "react";

export default function MainView({
  selectedCategory,
  selectedTask,
  onTaskClick,
}) {
  const { tasks, setTasks } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Filtrar tareas por categoria seleccionada
  const filteredTasks = selectedCategory
    ? tasks
        .filter((task) => task.categoryId === selectedCategory.id)
        .sort((a, b) => {
          // Ordenar por completado
          if (a.completed && !b.completed) return 1;
          if (!a.completed && b.completed) return -1;
          // Ordenar por fecha de creacion
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    : [];

  // Manejar el cambio en el input
  const handleInputChange = (e) => {
    setNewTaskTitle(e.target.value);
  };

  // Manejar el envio del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      completed: false,
      categoryId: selectedCategory.id,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  // Manejar el cambio de estado de completado
  let currentAudio = null; // Variable global para controlar el sonido

  const handleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const wasCompleted = task.completed;
        const isNowCompleted = !task.completed;

        if (!wasCompleted && isNowCompleted) {
          if (currentAudio) {
            currentAudio.pause(); // Detener el sonido actual
            currentAudio.currentTime = 0; // Reiniciar el sonido
          }
          currentAudio = new Audio("../../public/sounds/completado.wav");
          currentAudio.volume = 0.7;
          currentAudio.play();
        }

        return { ...task, completed: isNowCompleted };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  return (
    <div className={styles.mainView}>
      {selectedCategory && (
        <>
          <h1>{selectedCategory.name}</h1>
          <ul>
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={styles.taskItem}
              >
                <input
                  type="checkbox"
                  className={styles.taskCheckbox}
                  checked={task.completed}
                  onChange={() => handleTaskCompletion(task.id)}
                />
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.taskInputContainer}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className={styles.taskInput}
                value={newTaskTitle}
                onChange={handleInputChange}
                placeholder="Add a new task..."
              />
              <button type="submit" className={styles.taskInputButton}>
                Add
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
