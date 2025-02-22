import SearchBar from "./SearchBar/SearchBar";
import UserName from "./UserName/UserName";
import CategoriesList from "./Categories/CategoriesList";
import { useNotes } from "../../context/NotesContext";
import NoteList from "./Notes/NoteList";
import styles from "./Sidebar.module.css";

export default function Sidebar({
  categories,
  notes,
  selectedNote,
  onCategoryClick,
  onNoteClick,
  onAddCategory,
  onAddNote,
}) {
  return (
    <>
      <div className={styles.container}>
        <UserName name="Bruna" avatar="./img/avatar.jpg" />
        <SearchBar />
        <div className={styles.categoriesAndTasksContainer}>
          <CategoriesList
            className={styles.categoryContainer}
            categories={categories}
            onCategoryClick={onCategoryClick}
          />
          <NoteList
            className={styles.taskContainer}
            notes={notes}
            selectedNote={selectedNote}
            onNoteClick={onNoteClick}
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
