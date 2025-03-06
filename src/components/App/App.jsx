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
import { useMediaQuery } from "react-responsive"; // Importar useMediaQuery

function App() {
  const { selectedCategory, setSelectedCategory, categories, setCategories } =
    useCategories();
  const { selectedTask, setSelectedTask, tasks, setTasks } = useTasks();
  const { notes, setNotes, addNote } = useNotes();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { userInfo, updateUserInfo } = useUser();
  const [hasCompletedSetup, setHasCompletedSetup] = useState(
    localStorage.getItem("hasCompletedSetup") === "true"
  );

  // Detectar si la pantalla es pequeña (menos de 768px de ancho)
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Estado para controlar la vista actual en móviles
  const [currentView, setCurrentView] = useState("sidebar");

  const handleSetupComplete = (userData) => {
    setHasCompletedSetup(true);
    localStorage.setItem("hasCompletedSetup", "true");
  };

  const handleUserReset = () => {
    localStorage.removeItem("hasCompletedSetup");
    localStorage.removeItem("userInfo");
    setHasCompletedSetup(false);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedTask(null);
    setSelectedNote(null);
    setIsDetailsOpen(false);
    if (isMobile) setCurrentView("mainView"); // Cambiar a MainView en móviles
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
    if (isMobile) setCurrentView("taskDetails"); // Cambiar a TaskDetailsPanel en móviles
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setSelectedCategory(null);
    setSelectedTask(null);
    setIsDetailsOpen(false);
    if (isMobile) setCurrentView("mainView"); // Cambiar a MainView en móviles
  };

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
    setSelectedNote(newNote);
    setSelectedCategory(null);
    setIsDetailsOpen(false);
  };

  // Función para manejar el botón de "volver atrás"
  const handleBack = () => {
    if (currentView === "mainView") {
      setCurrentView("sidebar"); // Volver al Sidebar
    } else if (currentView === "taskDetails") {
      setCurrentView("mainView"); // Volver al MainView
    }
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
          {/* Mostrar Sidebar si no es móvil o si la vista actual es "sidebar" */}
          {(!isMobile || currentView === "sidebar") && (
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
          )}

          {/* Mostrar MainView si no es móvil o si la vista actual es "mainView" */}
          {(!isMobile || currentView === "mainView") && (
            <MainView
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedTask={selectedTask}
              selectedNote={selectedNote}
              onTaskClick={handleTaskClick}
              onNoteClick={handleNoteClick}
              onBack={isMobile ? handleBack : null} // Mostrar botón de "volver" solo en móviles
            />
          )}

          {/* Mostrar TaskDetailsPanel si no es móvil o si la vista actual es "taskDetails" */}
          {(!isMobile || currentView === "taskDetails") && (
            <TaskDetailsPanel
              task={selectedTask}
              onClose={() => {
                setIsDetailsOpen(false);
                if (isMobile) setCurrentView("mainView"); // Volver a MainView en móviles
              }}
            />
          )}

          {/* Modales para agregar categorías y notas */}
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
        </div>
      )}
    </>
  );
}

export default App;
