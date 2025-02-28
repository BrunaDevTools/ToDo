import SearchBar from "./SearchBar/SearchBar";
import UserName from "./UserName/UserName";
import CategoriesList from "./Categories/CategoriesList";
import { useNotes } from "../../context/NotesContext";
import { useState, useRef, useEffect } from "react";
import { useMemo } from "react";
import NoteList from "./Notes/NoteList";
import styles from "./Sidebar.module.css";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import { LiaUserEditSolid } from "react-icons/lia";

export default function Sidebar({
  userName,
  userAvatar,
  categories,
  notes,
  selectedNote,
  onUserReset,
  onEditProfile,
  onCategoryClick,
  onNoteClick,
  onAddCategory,
  onAddNote,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null); // Referencia para el menú
  const buttonRef = useRef(null); // Referencia para el botón

  // Si el menú está abierto y el clic no fue en el menú ni en el botón
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false); // Cerrar el menú
      }
    };

    // Agregar el listener al documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]); // Ejecutar solo cuando showMenu cambie

  // Filtrar categorías y notas
  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [categories, searchQuery]
  );

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [notes, searchQuery]
  );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <UserName
            name={userName || "Usuario"}
            avatar={userAvatar || "./img/avatar-default.jpg"}
            onClick={() => setShowMenu(!showMenu)}
          />

          <div className={styles.menuContainer}>
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className={styles.editButton}
            >
              <LiaUserEditSolid />
            </button>

            {showMenu && (
              <div ref={menuRef} className={styles.userMenu}>
                <button onClick={() => setIsEditing(true)}>
                  Editar perfil
                </button>
                <button onClick={onUserReset} className={styles.resetUserBtn}>
                  Cambiar de usuario
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mostrar el modal de edición */}
        {isEditing && (
          <EditProfileModal
            onClose={() => setIsEditing(false)}
            onSave={(newInfo) => {
              onEditProfile(newInfo);
              setIsEditing(false);
            }}
            currentName={userName}
            currentAvatar={userAvatar}
          />
        )}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className={styles.categoriesAndTasksContainer}>
          <CategoriesList
            className={styles.categoryContainer}
            categories={filteredCategories}
            onCategoryClick={(category) => {
              setSearchQuery(""); // Limpiar búsqueda al seleccionar
              onCategoryClick(category);
            }}
          />
          <NoteList
            className={styles.taskContainer}
            notes={filteredNotes}
            selectedNote={selectedNote}
            onNoteClick={(note) => {
              setSearchQuery(""); // Limpiar búsqueda al seleccionar
              onNoteClick(note);
            }}
          />
        </div>
        <div className={`${styles.buttonsContainer} ${styles.sidebarControls}`}>
          <button onClick={onAddCategory} className={styles.addButton}>
            + New Category
          </button>
          <button onClick={onAddNote} className={styles.addButton}>
            + New Note
          </button>
        </div>
      </div>
    </>
  );
}
