import styles from "./TaskDetailsPanel.module.css";
import { LiaTrashSolid, LiaWindowCloseSolid } from "react-icons/lia";
import { useState, useEffect, useRef } from "react";
import { useTasks } from "../../context/TasksContext";
import { useCategories } from "../../context/CategoriesContext";
import { useMediaQuery } from "react-responsive"; // Para detectar el tamaño de la pantalla

export default function TaskDetailsPanel({ task, onClose }) {
  const { categories, setCategories } = useCategories();
  const { tasks, setTasks } = useTasks();
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState("");
  const [notes, setNotes] = useState("");
  const [editedTitle, setEditedTitle] = useState(task ? task.title : "");

  // Detectar si la pantalla es pequeña (menos de 768px de ancho)
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Referencia (useRef) para el focus en inputTask
  const inputRef = useRef(null);

  // Sincronizo el estado interno para cambiar de task
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setSteps(task.steps || []);
      setNotes(task.notes || "");
      inputRef.current?.focus(); // Hace focus cuando el componente se monta
    }
  }, [task]);

  // Si task es null, no renderizar el componente
  if (!task) {
    return null;
  }

  // Guardar el título cuando el usuario presiona enter o cambia de foco
  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...t, title: editedTitle } : t
      )
    );
  };

  // Guardar las notas cuando el usuario deja de escribir
  const handleNotesBlur = () => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, notes: notes } : t))
    );
  };

  // Agrega un paso
  const handleAddStep = (e) => {
    e.preventDefault();
    if (newStep.trim()) {
      const newStepObject = {
        id: steps.length + 1,
        text: newStep,
        completed: false,
      };
      const updatedSteps = [...steps, newStepObject];
      setSteps(updatedSteps);

      setNewStep("");

      // Actualizar la tarea en el estado global
      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, steps: updatedSteps } : t
      );
      setTasks(updatedTasks);
    }
  };

  // Marcar como completado un paso
  const handleStepCompletion = (stepId) => {
    const updatedSteps = steps.map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    setSteps(updatedSteps);

    // Actualizar la tarea en el estado global
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, steps: updatedSteps } : t
    );
    setTasks(updatedTasks);
  };

  // Función para eliminar un paso
  const handleDeleteStep = (stepId) => {
    const updatedSteps = steps.filter((step) => step.id !== stepId);
    setSteps(updatedSteps);

    // Actualizo la tarea en el estado local
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, steps: updatedSteps } : t
    );
    setTasks(updatedTasks);
  };

  // Borrar la tarea
  const handleDeleteTask = () => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    onClose();
  };

  // Función para eliminar la categoría y sus tareas
  const handleDeleteCategory = () => {
    if (!task?.categoryId) return;

    // Eliminar la categoría
    const updateCategories = categories.filter(
      (cat) => cat.id !== task.categoryId
    );
    setCategories(updateCategories);

    // Eliminar todas las tareas de la categoría
    const updatedTasks = tasks.filter((t) => t.categoryId !== task.categoryId);
    setTasks(updatedTasks);

    onClose();
  };

  return (
    <div
      className={`${styles.taskDetailsPanel} ${
        isMobile ? styles.mobileView : ""
      }`}
    >
      <button onClick={onClose} className={styles.closeButton}>
        <LiaWindowCloseSolid className={styles.closeIcon} />
      </button>
      <div className={styles.taskDetailsMain}>
        <div className={styles.titleAndSteps}>
          <form onSubmit={handleTitleSubmit}>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit} // Guarda el título cuando pierde el foco
              className={styles.taskTitleInput}
            />
          </form>
          <div>
            <form onSubmit={handleAddStep}>
              <input
                ref={inputRef}
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="+  Agregar paso"
                className={styles.addStep}
              />
            </form>
          </div>
          <ul className={styles.stepsContainer}>
            {steps.map((step) => (
              <li key={step.id} className={styles.stepItem}>
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => handleStepCompletion(step.id)}
                  className={styles.stepCheckbox}
                />
                <span
                  style={{
                    textDecoration: step.completed ? "line-through" : "none",
                  }}
                >
                  {step.text}
                </span>
                <button
                  onClick={() => handleDeleteStep(step.id)}
                  className={styles.deleteStepButton}
                >
                  <LiaTrashSolid />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur} // Guarda las notas cuando pierde el foco
          placeholder="Agregar nota"
        />
      </div>
      <div className={styles.deleteButtonsContainer}>
        <button
          onClick={handleDeleteCategory}
          className={`${styles.deleteBtn} ${styles.deleteBtnCategory}`}
        >
          Eliminar Categoría
        </button>

        <button onClick={handleDeleteTask} className={styles.deleteBtn}>
          Eliminar tarea
          <LiaTrashSolid className={styles.trashIcon} />
        </button>
      </div>
    </div>
  );
}
