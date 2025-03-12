import styles from "./MainView.module.css";
import { useCategories } from "../../context/CategoriesContext";
import { useTasks } from "../../context/TasksContext";
import { useNotes } from "../../context/NotesContext";
import { useState, useEffect, useRef } from "react";
import ModalForm from "../ModalForm/ModalForm";
import { LiaEllipsisVSolid } from "react-icons/lia"; // Icono de tres puntos
import { useMediaQuery } from "react-responsive"; // Para detectar el tamaño de la pantalla
import { FaArrowLeft } from "react-icons/fa"; // Icono de flecha para el botón de volver

export default function MainView({
  selectedCategory,
  setSelectedCategory,
  selectedNote,
  onTaskClick,
  onNoteClick,
  onBack, // Prop para manejar el botón de volver
}) {
  const { tasks, setTasks } = useTasks();
  const { notes, setNotes } = useNotes();
  const { categories, setCategories } = useCategories(); //
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar el menu
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [currentAction, setCurrentAction] = useState(null); // Estado para controlar la acción actual (editar o eliminar)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategoryAction, setCurrentCategoryAction] = useState(null);
  const menuRef = useRef(null); // Referencia para el menú
  const taskInputRef = useRef(null); // Referencia del input de nueva tarea
  const [renderKey, setRenderKey] = useState(0);

  // Detectar si la pantalla es pequeña (menos de 768px de ancho)
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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
      id: Date.now(),
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
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const isNowCompleted = !task.completed;

          // Lógica del sonido
          if (isNowCompleted) {
            const audio = new Audio("/sounds/completadotask.mp3");
            audio.volume = 0.7;

            // Reproducir y manejar posible bloqueo de autoplay
            audio.play().catch((error) => {
              console.log("Audio bloqueado:", error);
            });
          }

          return { ...task, completed: isNowCompleted };
        }
        return task;
      })
    );
  };

  // Funcion para eliminar categoria
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    // Eliminar categoría del contexto
    const updatedCategories = categories.filter(
      (cat) => cat.id !== selectedCategory.id
    );
    setCategories(updatedCategories);

    // Eliminar tareas asociadas
    const updatedTasks = tasks.filter(
      (task) => task.categoryId !== selectedCategory.id
    );
    setTasks(updatedTasks);

    // Resetear estados
    setSelectedCategory(null);
    setMenuOpen(false);
    setIsCategoryModalOpen(false);
  };

  // Funcion para editar categoria
  const handleEditCategory = (newName) => {
    if (!newName || !selectedCategory) return;

    const updatedCategories = categories.map((cat) =>
      cat.id === selectedCategory.id ? { ...cat, name: newName } : cat
    );
    setCategories(updatedCategories);

    // Actualizar selectedCategory localmente
    const updatedCategory = { ...selectedCategory, name: newName };
    setSelectedCategory(updatedCategory);
    setIsCategoryModalOpen(false);
    setMenuOpen(false);
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
      {/* Botón de volver atrás (solo en móviles) */}
      {isMobile && (
        <button onClick={onBack} className={styles.backButton}>
          <FaArrowLeft /> {/* Icono de flecha */}
        </button>
      )}

      {/* CATEGORIAS */}
      {selectedCategory && (
        <>
          <div className={styles.categoryHeader}>
            <h1>{selectedCategory.name}</h1>
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
                <div ref={menuRef} className={styles.menu}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentCategoryAction("edit");
                      setIsCategoryModalOpen(true);
                    }}
                    className={styles.menuButton}
                  >
                    Editar nombre
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentCategoryAction("delete");
                      setIsCategoryModalOpen(true);
                    }}
                    className={`${styles.menuButton} ${styles.deleteButton}`}
                  >
                    Eliminar Categoría
                  </button>
                </div>
              )}
            </div>
          </div>
          <ul className={styles.tasksContainer}>
            {filteredTasks.map((task) => (
              <li key={task.id} className={styles.taskItem}>
                <input
                  type="checkbox"
                  className={styles.taskCheckbox}
                  checked={task.completed}
                  onChange={(e) => {
                    e.stopPropagation(); // Evitar que el clic se propague al contenedor
                    handleTaskCompletion(task.id);
                  }}
                />
                {/* Título de la tarea (abre TaskDetailsPanel) */}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar que el clic se propague al contenedor
                    onTaskClick(task); // Abrir TaskDetailsPanel al hacer clic en el título
                  }}
                  onTouchStart={(e) => e.stopPropagation()} // Nuevo manejador para móviles
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    cursor: "pointer", // Cambiar el cursor a pointer para indicar que es clickeable
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
                ref={taskInputRef}
              />
            </form>
          </div>
        </>
      )}

      {/* NOTAS */}
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
                <div ref={menuRef} className={styles.menu}>
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

      {/* Modal para categorias */}
      <ModalForm
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setMenuOpen(false);
        }}
        onSubmit={
          currentCategoryAction === "edit"
            ? handleEditCategory
            : currentCategoryAction === "delete"
            ? handleDeleteCategory
            : null
        }
        title={
          currentCategoryAction === "edit"
            ? "Editar nombre de la categoría"
            : "¿Estás seguro de eliminar esta categoría?"
        }
        placeholder={currentCategoryAction === "edit" ? "Nuevo nombre" : ""}
        showInput={currentCategoryAction === "edit"}
      />

      {/* Mostrar mensaje cuando no hay nada seleccionado */}
      {!selectedCategory && !selectedNote && (
        <div className={styles.placeholderMessge}>
          <p className={styles.hello}>Hello!</p>
          <p className={styles.text}>
            Select a category or note to get started...
          </p>
        </div>
      )}
    </div>
  );
}
