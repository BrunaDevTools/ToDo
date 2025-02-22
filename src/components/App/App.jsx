import { useState } from "react";
import styles from "./App.module.css";
import "../../styles/global.css";
import "../../styles/vars.css";
import Sidebar from "../Sidebar/Sidebar";
import MainView from "../MainView/MainView";
import TaskDetailsPanel from "../TaskDetailsPanel/TaskDetailsPanel";
import { useCategories } from "../../context/CategoriesContext";
import { useTasks } from "../../context/TasksContext";
import { useNotes, NotesProvider } from "../../context/NotesContext";
import ModalForm from "../ModalForm/ModalForm";

function App() {
  // Contextos para categorias, tareas y notas
  const { selectedCategory, setSelectedCategory, categories, setCategories } =
    useCategories();
  const { selectedTask, setSelectedTask, tasks, setTasks } = useTasks();
  const { notes, setNotes, addNote } = useNotes();
  // Estados locales para controlar modales y nota seleccionada
  const [isDatailsOpen, setIsDatailsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Funcion para selecionar una categoria
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedTask(null);
    setSelectedNote(null);
    setIsDatailsOpen(false);
  };

  // Funcion para seleccionar una tarea
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDatailsOpen(true);
  };

  //Funcion para seleccionar una nota
  const handleNoteClick = (note) => {
    console.log("NOTA seleccionada:", note); // Depuración
    setSelectedNote(note);
    setSelectedCategory(null);
    setSelectedTask(null);
    setIsDatailsOpen(false);
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

  // Funcion para agregar una nueva nota
  const handleAddNote = (noteTitle) => {
    if (!noteTitle) return;
    const newId =
      notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    const newNote = {
      id: newId,
      title: noteTitle,
      content: "",
      dateCreated: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    // Selecciona la nota recien creada para mostrarla en MainView
    setSelectedNote(newNote);
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
          notes={notes}
          selectedNote={selectedNote}
          onCategoryClick={handleCategoryClick}
          onTaskClick={handleTaskClick}
          onNoteClick={handleNoteClick}
          onAddCategory={() => setShowCategoryModal(true)}
          onAddNote={() => setShowNoteModal(true)}
        />
        <ModalForm
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSubmit={handleAddCategory}
          title="New category"
          placeholder="Category name..."
        />
        <ModalForm
          isOpen={showNoteModal}
          onClose={() => setShowNoteModal(false)}
          onSubmit={handleAddNote}
          title="New Note"
          placeholder="Note title..."
        />
        <MainView
          selectedCategory={selectedCategory}
          selectedTask={selectedTask}
          selectedNote={selectedNote}
          onTaskClick={handleTaskClick}
          onNoteClick={handleNoteClick}
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
