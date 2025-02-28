import SearchBar from "./SearchBar/SearchBar";
import UserName from "./UserName/UserName";
import CategoriesList from "./Categories/CategoriesList";
import { useNotes } from "../../context/NotesContext";
import { useState } from "react";
import { useMemo } from "react";
import NoteList from "./Notes/NoteList";
import styles from "./Sidebar.module.css";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import { LiaEditSolid } from "react-icons/lia";

export default function Sidebar({
  userName,
  userAvatar,
  categories,
  notes,
  selectedNote,
  onEditProfile,
  onCategoryClick,
  onNoteClick,
  onAddCategory,
  onAddNote,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
          />
          <button
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
          >
            <LiaEditSolid />
          </button>
        </div>
        {/* Mostrar el modal de edicion */}
        {isEditing && (
          <EditProfileModal
            onClose={() => setIsEditing(false)}
            onSave={(newInfo) => {
              onEditProfile(newInfo); // Actualiza el perfil
              setIsEditing(false);
            }}
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
