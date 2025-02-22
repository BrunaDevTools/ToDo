import styles from "./MainView.module.css";
import { useCategories } from "../../context/CategoriesContext";
import { useTasks } from "../../context/TasksContext";
import { useNotes } from "../../context/NotesContext";
import { useState, useEffect, useRef } from "react";
import ModalForm from "../ModalForm/ModalForm";
import { LiaEllipsisVSolid } from "react-icons/lia"; // Icono de tres puntos

export default function MainView({
  selectedCategory,
  selectedNote,
  onTaskClick,
  onNoteClick,
}) {
  const { tasks, setTasks } = useTasks();
  const { notes, setNotes } = useNotes();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menu
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [currentAction, setCurrentAction] = useState(null); // Estado para controlar la acción actual (editar o eliminar)
  const menuRef = useRef(null); // Referencia para el menú

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Funcion para abrir/cerrar el menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Funcion para editar el nombre de la nota
  const handleEditNote = (newTitle) => {
    if (!newTitle) return;

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? { ...note, title: newTitle } : note
    );
    setNotes(updatedNotes);

    // Actualizar selectedNote
    const updatedNote = { ...selectedNote, title: newTitle };
    onNoteClick(updatedNote); // Pasar la nota actualizada al componente padre
    setIsModalOpen(false); // Cerrar el modal
    setMenuOpen(false); // Cerrar el menú
  };

  // Funcion para eliminar la nota
  const handleDeleteNote = () => {
    setCurrentAction("delete");
    setIsModalOpen(true);
  };

  // Confirmacion de eliminacion de nota
  const handleConfirmDeleteNote = () => {
    if (!selectedNote) return;

    const updatedNotes = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(updatedNotes);
    setMenuOpen(false);
    onNoteClick(null);
    setIsModalOpen(false);
  };

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

  // Manejar el cambio en el contenido de la nota
  const handleNoteContentChange = (e) => {
    if (!selectedNote) return;

    console.log("NOTA antes de actualizar:", selectedNote.content); // Depuración

    // Actualizar el estado global de las notas
    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? { ...note, content: e.target.value } : note
    );
    setNotes(updatedNotes);

    // Actualizar el estado local de selectedNote
    const updatedNote = { ...selectedNote, content: e.target.value };
    onNoteClick(updatedNote); // Pasar la nota actualizada al componente padre

    console.log("NOTA contenido después de actualizar:", updatedNote.content); // Depuración
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
              <button type="submit" className={styles.taskInputButton}>
                +
              </button>
              <input
                type="text"
                className={styles.taskInput}
                value={newTaskTitle}
                onChange={handleInputChange}
                placeholder="Add a new task..."
              />
            </form>
          </div>
        </>
      )}

      {/* Mostrar la nota seleccionada */}
      {selectedNote && (
        <div className={styles.noteContainer}>
          <div className={styles.noteHeader}>
            <h1>{selectedNote.title}</h1>
            <div style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu();
                }}
                className={styles.threeDotsButton}
              >
                <LiaEllipsisVSolid />
              </button>
              {menuOpen && (
                <div className={styles.menu}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentAction("edit");
                      setIsModalOpen(true); // Abrir el modal de edición
                    }}
                    className={styles.menuButton}
                  >
                    Editar nombre
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentAction("delete");
                      setIsModalOpen(true); // Abrir el modal de eliminación
                    }}
                    className={`${styles.menuButton} ${styles.deleteButton}`}
                  >
                    Eliminar nota
                  </button>
                </div>
              )}
            </div>
          </div>
          <textarea
            value={selectedNote.content || ""}
            onChange={handleNoteContentChange}
            placeholder="Write your note here..."
            className={styles.noteTextarea}
          />
        </div>
      )}

      {/* Modal para editar el nombre de la nota o confirmar eliminación */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMenuOpen(false); // Cerrar el menú al cerrar el modal
        }}
        onSubmit={
          currentAction === "edit"
            ? handleEditNote
            : currentAction === "delete"
            ? handleConfirmDeleteNote
            : null
        }
        title={
          currentAction === "edit"
            ? "Editar nombre de la nota"
            : "¿Estás seguro de eliminar esta nota?"
        }
        placeholder={currentAction === "edit" ? "Nuevo nombre de la nota" : ""}
        showInput={currentAction === "edit"} // Mostrar input solo para editar
      />

      {/* Mostrar mensaje cuando no hay nada seleccionado */}
      {!selectedCategory && !selectedNote && (
        <div className={styles.placeholderMessge}>
          <p>Hello!</p>
          <p>Select a category or note to get started</p>
        </div>
      )}
    </div>
  );
}
