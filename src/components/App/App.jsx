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
import { UserProvider, useUser } from "../../context/UserContext";
import SetupScreen from "../../components/SetupScreen/SetupScreen";
import ModalForm from "../ModalForm/ModalForm";

function App() {
  // Contextos para categorias, tareas y notas
  const { selectedCategory, setSelectedCategory, categories, setCategories } =
    useCategories();
  const { selectedTask, setSelectedTask, tasks, setTasks } = useTasks();
  const { notes, setNotes, addNote } = useNotes();
  // Estados locales para controlar modales y nota seleccionada
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userInfo, updateUserInfo } = useUser();
  const [hasCompletedSetup, setHasCompletedSetup] = useState(
    localStorage.getItem("hasCompletedSetup") === "true"
  );

  // Inicio de sesion
  const handleSetupComplete = (userData) => {
    setHasCompletedSetup(true);
    localStorage.setItem("hasCompletedSetup", "true");
  };

  // Receteo de sesion
  const handleUserReset = () => {
    localStorage.removeItem("hasCompletedSetup");
    localStorage.removeItem("userInfo");
    setHasCompletedSetup(false);
  };

  // Funcion para selecionar una categoria
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedTask(null);
    setSelectedNote(null);
    setIsDetailsOpen(false);
  };

  // Funcion para seleccionar una tarea
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  //Funcion para seleccionar una nota
  const handleNoteClick = (note) => {
    console.log("NOTA seleccionada:", note); // Depuración
    setSelectedNote(note);
    setSelectedCategory(null);
    setSelectedTask(null);
    setIsDetailsOpen(false);
  };

  // Funcion para agregar una nueva categoria
  const handleAddCategory = (categoryName) => {
    if (!categoryName) return;

    const newId = Date.now();

    const newCategory = {
      id: newId,
      name: categoryName,
      icon: "FaList",
      fixed: false,
    };
    setCategories([...categories, newCategory]);
    setIsDetailsOpen(false);
    setSelectedCategory(newCategory);
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
    const newId = Date.now();
    const newNote = {
      id: newId,
      title: noteTitle,
      content: "",
      dateCreated: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    // Selecciona la nota recien creada para mostrarla en MainView
    setSelectedNote(newNote);
    setSelectedCategory(null);
    setIsDetailsOpen(false);
  };

  return (
    <>
      {!hasCompletedSetup ? (
        <SetupScreen onComplete={handleSetupComplete} />
      ) : (
        <div
          className={`${styles.mainContainer} ${
            isDetailsOpen ? styles.mainContainerWithDetails : ""
          }`}
        >
          <Sidebar
            userName={userInfo.name}
            userAvatar={userInfo.avatar}
            categories={categories}
            tasks={tasks}
            notes={notes}
            selectedNote={selectedNote}
            onEditProfile={updateUserInfo}
            onUserReset={handleUserReset}
            onCategoryClick={handleCategoryClick}
            onTaskClick={handleTaskClick}
            onNoteClick={handleNoteClick}
            onAddCategory={() => setShowCategoryModal(true)}
            onAddNote={() => setShowNoteModal(true)}
          />
          <ModalForm
            isOpen={showCategoryModal}
            onClose={() => {
              setShowCategoryModal(false);
              setMenuOpen(false);
            }}
            onSubmit={handleAddCategory}
            title="New category"
            placeholder="Category name..."
          />
          <ModalForm
            isOpen={showNoteModal}
            onClose={() => {
              setShowNoteModal(false);
              setMenuOpen(false);
            }}
            onSubmit={handleAddNote}
            title="New Note"
            placeholder="Note title..."
          />
          <MainView
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTask={selectedTask}
            selectedNote={selectedNote}
            onTaskClick={handleTaskClick}
            onNoteClick={handleNoteClick}
          />
          {isDetailsOpen && (
            <TaskDetailsPanel
              task={selectedTask}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;
